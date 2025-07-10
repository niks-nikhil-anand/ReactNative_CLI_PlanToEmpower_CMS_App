import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
  Alert,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');

interface CallerDetails {
  name: string;
  phone: string;
  company: string;
  designation: string;
  email: string;
  address: string;
}

interface CallFormData {
  callPurpose: string;
  callOutcome: string;
  nextFollowUp: string;
  remarks: string;
  interested: boolean;
  appointmentScheduled: boolean;
}

interface CallingInterfaceProps {
  visible: boolean;
  onClose: () => void;
  callerDetails?: CallerDetails;
}

const CALLERS_DATA: CallerDetails[] = [
  {
    name: 'John Doe',
    phone: '+1 (555) 123-4567',
    company: 'ABC Corp',
    designation: 'Manager',
    email: 'john.doe@abccorp.com',
    address: '123 Business St, City, State 12345',
  },
  {
    name: 'Jane Smith',
    phone: '+1 (555) 987-6543',
    company: 'Tech Solutions Inc.',
    designation: 'Senior Developer',
    email: 'jane.smith@techsolutions.com',
    address: '456 Innovation Drive, Tech City, TC 67890',
  },
  {
    name: 'Michael Johnson',
    phone: '+1 (555) 456-7890',
    company: 'Global Marketing Ltd.',
    designation: 'Marketing Director',
    email: 'michael.johnson@globalmarketing.com',
    address: '789 Creative Avenue, Marketing Hub, MH 54321',
  },
  {
    name: 'Sarah Williams',
    phone: '+1 (555) 321-6547',
    company: 'DataFlow Systems',
    designation: 'Data Analyst',
    email: 'sarah.williams@dataflow.com',
    address: '321 Analytics Street, Data City, DC 98765',
  },
  {
    name: 'Robert Brown',
    phone: '+1 (555) 654-3210',
    company: 'NextGen Industries',
    designation: 'CEO',
    email: 'robert.brown@nextgen.com',
    address: '654 Executive Plaza, Business District, BD 13579',
  },
  {
    name: 'Emily Davis',
    phone: '+1 (555) 789-0123',
    company: 'Creative Design Studio',
    designation: 'Art Director',
    email: 'emily.davis@creativedesign.com',
    address: '987 Design Boulevard, Art Quarter, AQ 24680',
  },
  {
    name: 'David Wilson',
    phone: '+1 (555) 012-3456',
    company: 'Financial Advisors Inc.',
    designation: 'Senior Consultant',
    email: 'david.wilson@financialadvisors.com',
    address: '159 Money Street, Finance District, FD 11223',
  },
  {
    name: 'Lisa Thompson',
    phone: '+1 (555) 345-6789',
    company: 'HealthCare Plus',
    designation: 'Operations Manager',
    email: 'lisa.thompson@healthcareplus.com',
    address: '753 Wellness Way, Medical Center, MC 33445',
  },
];

type CallStatus = 'idle' | 'dialing' | 'ringing' | 'connected';

const CallingInterface: React.FC<CallingInterfaceProps> = ({
  visible,
  onClose,
  callerDetails,
}) => {
  const [currentCallerIndex, setCurrentCallerIndex] = useState<number>(0);
  const [isCallActive, setIsCallActive] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [callStatus, setCallStatus] = useState<CallStatus>('idle');
  const [formData, setFormData] = useState<CallFormData>({
    callPurpose: '',
    callOutcome: '',
    nextFollowUp: '',
    remarks: '',
    interested: false,
    appointmentScheduled: false,
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const callProgressRef = useRef<NodeJS.Timeout | null>(null);
  const callProgressRef2 = useRef<NodeJS.Timeout | null>(null);
  
  // Get current caller details
  const currentCaller = callerDetails || CALLERS_DATA[currentCallerIndex];

  // Timer effect
  useEffect(() => {
    if (isCallActive) {
      timerRef.current = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isCallActive]);

  // Reset state when modal closes
  useEffect(() => {
    if (!visible) {
      setCurrentCallerIndex(0);
      setIsCallActive(false);
      setCallStatus('idle');
      setTimer(0);
      setShowForm(false);
      setFormData({
        callPurpose: '',
        callOutcome: '',
        nextFollowUp: '',
        remarks: '',
        interested: false,
        appointmentScheduled: false,
      });
      
      // Clear all timers
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (callProgressRef.current) {
        clearTimeout(callProgressRef.current);
        callProgressRef.current = null;
      }
      if (callProgressRef2.current) {
        clearTimeout(callProgressRef2.current);
        callProgressRef2.current = null;
      }
    }
  }, [visible]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (callProgressRef.current) {
        clearTimeout(callProgressRef.current);
      }
      if (callProgressRef2.current) {
        clearTimeout(callProgressRef2.current);
      }
    };
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartCall = (): void => {
    setIsCallActive(true);
    setCallStatus('dialing');
    setTimer(0);
    
    // Clear any existing timeouts
    if (callProgressRef.current) {
      clearTimeout(callProgressRef.current);
    }
    if (callProgressRef2.current) {
      clearTimeout(callProgressRef2.current);
    }
    
    // Simulate call progression
    callProgressRef.current = setTimeout(() => {
      setCallStatus('ringing');
      callProgressRef2.current = setTimeout(() => {
        setCallStatus('connected');
      }, 2000);
    }, 1000);
  };

  const handleEndCall = (): void => {
    setIsCallActive(false);
    setCallStatus('idle');
    setTimer(0);
    
    // Clear call progress timeouts
    if (callProgressRef.current) {
      clearTimeout(callProgressRef.current);
      callProgressRef.current = null;
    }
    if (callProgressRef2.current) {
      clearTimeout(callProgressRef2.current);
      callProgressRef2.current = null;
    }
  };

  const handleSkipCaller = (): void => {
    if (isCallActive) {
      Alert.alert(
        'Call Active',
        'Please end the current call before skipping to the next caller.',
        [{ text: 'OK' }]
      );
      return;
    }

    if (currentCallerIndex < CALLERS_DATA.length - 1) {
      setCurrentCallerIndex(prev => prev + 1);
      // Reset call-related states
      setCallStatus('idle');
      setTimer(0);
      setFormData({
        callPurpose: '',
        callOutcome: '',
        nextFollowUp: '',
        remarks: '',
        interested: false,
        appointmentScheduled: false,
      });
    } else {
      Alert.alert(
        'No More Callers',
        'You have reached the end of the caller list.',
        [
          { text: 'Close', onPress: onClose },
          { text: 'Start Over', onPress: () => setCurrentCallerIndex(0) }
        ]
      );
    }
  };

  const handlePreviousCaller = (): void => {
    if (isCallActive) {
      Alert.alert(
        'Call Active',
        'Please end the current call before changing callers.',
        [{ text: 'OK' }]
      );
      return;
    }

    if (currentCallerIndex > 0) {
      setCurrentCallerIndex(prev => prev - 1);
      // Reset call-related states
      setCallStatus('idle');
      setTimer(0);
      setFormData({
        callPurpose: '',
        callOutcome: '',
        nextFollowUp: '',
        remarks: '',
        interested: false,
        appointmentScheduled: false,
      });
    }
  };

  const handleFormSubmit = (): void => {
    if (!formData.callPurpose.trim() || !formData.callOutcome.trim()) {
      Alert.alert('Error', 'Please fill in all required fields (Call Purpose and Call Outcome)');
      return;
    }
    
    console.log('Form submitted:', formData);
    Alert.alert('Success', 'Call details saved successfully!', [
      { text: 'OK', onPress: () => {
        setShowForm(false);
        setFormData({
          callPurpose: '',
          callOutcome: '',
          nextFollowUp: '',
          remarks: '',
          interested: false,
          appointmentScheduled: false,
        });
        onClose(); // Close the main modal after saving
      }}
    ]);
  };

  const handleCloseModal = (): void => {
    if (isCallActive) {
      Alert.alert(
        'Call Active',
        'You have an active call. Are you sure you want to close?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Yes', onPress: () => {
            setIsCallActive(false);
            setCallStatus('idle');
            setTimer(0);
            // Clear all timers
            if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = null;
            }
            if (callProgressRef.current) {
              clearTimeout(callProgressRef.current);
              callProgressRef.current = null;
            }
            if (callProgressRef2.current) {
              clearTimeout(callProgressRef2.current);
              callProgressRef2.current = null;
            }
            onClose();
          }}
        ]
      );
    } else {
      onClose();
    }
  };

  const getStatusColor = (): string => {
    switch (callStatus) {
      case 'dialing':
      case 'ringing':
        return '#FF9800';
      case 'connected':
        return '#4CAF50';
      default:
        return '#666';
    }
  };

  const getStatusText = (): string => {
    switch (callStatus) {
      case 'dialing':
        return 'Dialing...';
      case 'ringing':
        return 'Ringing...';
      case 'connected':
        return 'Connected';
      default:
        return 'Ready to call';
    }
  };

  const renderMainScreen = (): React.ReactElement => (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#f5f5f5" barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Calling Interface</Text>
          <Text style={styles.headerSubtitle}>
            {currentCallerIndex + 1} of {CALLERS_DATA.length}
          </Text>
        </View>
        <TouchableOpacity onPress={handleCloseModal}>
          <Icon name="close" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Caller Navigation */}
        <View style={styles.callerNavigation}>
          <TouchableOpacity
            style={[styles.navButton, currentCallerIndex === 0 && styles.navButtonDisabled]}
            onPress={handlePreviousCaller}
            disabled={currentCallerIndex === 0}
          >
            <Icon name="chevron-left" size={20} color={currentCallerIndex === 0 ? "#ccc" : "#666"} />
            <Text style={[styles.navButtonText, currentCallerIndex === 0 && styles.navButtonTextDisabled]}>
              Previous
            </Text>
          </TouchableOpacity>

          <View style={styles.callerCounter}>
            <Text style={styles.counterText}>
              Caller {currentCallerIndex + 1} of {CALLERS_DATA.length}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.navButton}
            onPress={handleSkipCaller}
          >
            <Text style={styles.navButtonText}>Skip</Text>
            <Icon name="chevron-right" size={20} color="#666" />
          </TouchableOpacity>
        </View>
        
        {/* Call Button and Timer */}
        <View style={styles.callSection}>
          <TouchableOpacity
            style={[
              styles.callButton,
              { backgroundColor: isCallActive ? '#F44336' : '#4CAF50' }
            ]}
            onPress={isCallActive ? handleEndCall : handleStartCall}
          >
            <Icon 
              name={isCallActive ? "call-end" : "call"} 
              size={40} 
              color="#fff" 
            />
          </TouchableOpacity>

          {/* Timer */}
          <View style={styles.timerContainer}>
            <Icon name="access-time" size={24} color="#666" />
            <Text style={styles.timerText}>{formatTime(timer)}</Text>
          </View>

          {/* Call Status */}
          <View style={styles.statusContainer}>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
            <Text style={[styles.statusText, { color: getStatusColor() }]}>
              {getStatusText()}
            </Text>
          </View>
        </View>

        {/* Caller Details */}
        <View style={styles.callerDetailsSection}>
          <Text style={styles.sectionTitle}>Caller Details</Text>
          
          <View style={styles.callerCard}>
            <View style={styles.avatarContainer}>
              <Icon name="person" size={50} color="#666" />
            </View>
            
            <View style={styles.callerInfo}>
              <Text style={styles.callerName}>{currentCaller.name}</Text>
              <Text style={styles.callerTitle}>
                {currentCaller.designation} at {currentCaller.company}
              </Text>
              
              <View style={styles.contactRow}>
                <Icon name="phone" size={16} color="#666" />
                <Text style={styles.contactText}>{currentCaller.phone}</Text>
              </View>
              
              <View style={styles.contactRow}>
                <Icon name="email" size={16} color="#666" />
                <Text style={styles.contactText}>{currentCaller.email}</Text>
              </View>
              
              <View style={styles.contactRow}>
                <Icon name="location-on" size={16} color="#666" />
                <Text style={styles.contactText}>{currentCaller.address}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Form Button */}
        <TouchableOpacity
          style={styles.formButton}
          onPress={() => setShowForm(true)}
        >
          <Icon name="description" size={24} color="#fff" />
          <Text style={styles.formButtonText}>Open Call Details Form</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );

  const renderForm = (): React.ReactElement => (
    <Modal
      visible={showForm}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.formContainer}>
        <StatusBar backgroundColor="#fff" barStyle="dark-content" />
        
        <View style={styles.formHeader}>
          <Text style={styles.formTitle}>Call Details</Text>
          <TouchableOpacity onPress={() => setShowForm(false)}>
            <Icon name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.formContent} showsVerticalScrollIndicator={false}>
          <View style={styles.formSection}>
            <Text style={styles.formSectionTitle}>Call Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Call Purpose *</Text>
              <TextInput
                style={styles.textInput}
                value={formData.callPurpose}
                onChangeText={(text) => setFormData({...formData, callPurpose: text})}
                placeholder="What was the purpose of this call?"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Call Outcome *</Text>
              <TextInput
                style={styles.textInput}
                value={formData.callOutcome}
                onChangeText={(text) => setFormData({...formData, callOutcome: text})}
                placeholder="What was the outcome?"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Next Follow-up</Text>
              <TextInput
                style={styles.textInput}
                value={formData.nextFollowUp}
                onChangeText={(text) => setFormData({...formData, nextFollowUp: text})}
                placeholder="When should we follow up?"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Remarks</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={formData.remarks}
                onChangeText={(text) => setFormData({...formData, remarks: text})}
                placeholder="Additional remarks..."
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.formSectionTitle}>Quick Actions</Text>
            
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setFormData({...formData, interested: !formData.interested})}
            >
              <Icon 
                name={formData.interested ? "check-box" : "check-box-outline-blank"} 
                size={24} 
                color="#4CAF50" 
              />
              <Text style={styles.checkboxLabel}>Customer is interested</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setFormData({...formData, appointmentScheduled: !formData.appointmentScheduled})}
            >
              <Icon 
                name={formData.appointmentScheduled ? "check-box" : "check-box-outline-blank"} 
                size={24} 
                color="#4CAF50" 
              />
              <Text style={styles.checkboxLabel}>Appointment scheduled</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View style={styles.formActions}>
          <TouchableOpacity 
            style={styles.cancelButton} 
            onPress={() => setShowForm(false)}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.submitButton} 
            onPress={handleFormSubmit}
          >
            <Text style={styles.submitButtonText}>Save Details</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
    >
      <View style={styles.app}>
        {renderMainScreen()}
        {renderForm()}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  app: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  callerNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  navButtonDisabled: {
    backgroundColor: '#f9f9f9',
  },
  navButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  navButtonTextDisabled: {
    color: '#ccc',
  },
  callerCounter: {
    flex: 1,
    alignItems: 'center',
  },
  counterText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  callSection: {
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  callButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  timerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
    fontFamily: 'monospace',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
  },
  callerDetailsSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  callerCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 15,
  },
  callerInfo: {
    alignItems: 'center',
  },
  callerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  callerTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
    textAlign: 'center',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    width: '100%',
  },
  contactText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
    flex: 1,
  },
  formButton: {
    backgroundColor: '#2196F3',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  
  // Form Styles
  formContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  formContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  formSection: {
    marginVertical: 20,
  },
  formSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  formActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    marginRight: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  submitButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    marginLeft: 10,
  },
  submitButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});

export default CallingInterface;