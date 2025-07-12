import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
  StatusBar,
  SafeAreaView,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CallConnectionForm from './CallDetailsForm';

const { width, height } = Dimensions.get('window');

interface CallerDetails {
  name: string;
  phone: string;
  company: string;
  designation: string;
  email: string;
  address: string;
}

interface PreviousCallData {
  id: string;
  callDate: string;
  callTime: string;
  duration: string;
  callType: 'incoming' | 'outgoing' | 'missed';
  status: 'completed' | 'no_answer' | 'busy' | 'cancelled';
  notes: string;
  outcome: 'interested' | 'not_interested' | 'callback' | 'no_response';
  followUpDate?: string;
  recordingUrl?: string;
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

// Demo previous call data for each candidate
const PREVIOUS_CALLS_DATA: { [key: string]: PreviousCallData[] } = {
  'John Doe': [
    {
      id: '1',
      callDate: '2024-01-15',
      callTime: '10:30 AM',
      duration: '8:45',
      callType: 'outgoing',
      status: 'completed',
      notes: 'Discussed project requirements and timeline. Client showed interest in our services.',
      outcome: 'interested',
      followUpDate: '2024-01-20',
    },
    {
      id: '2',
      callDate: '2024-01-08',
      callTime: '2:15 PM',
      duration: '3:22',
      callType: 'incoming',
      status: 'completed',
      notes: 'Initial inquiry about our products. Requested product demo.',
      outcome: 'callback',
      followUpDate: '2024-01-10',
    },
    {
      id: '3',
      callDate: '2024-01-03',
      callTime: '11:00 AM',
      duration: '0:00',
      callType: 'outgoing',
      status: 'no_answer',
      notes: 'No response. Left voicemail.',
      outcome: 'no_response',
      followUpDate: '2024-01-05',
    },
  ],
  'Jane Smith': [
    {
      id: '4',
      callDate: '2024-01-12',
      callTime: '3:45 PM',
      duration: '12:30',
      callType: 'outgoing',
      status: 'completed',
      notes: 'Technical discussion about system integration. Very positive response.',
      outcome: 'interested',
      followUpDate: '2024-01-18',
    },
    {
      id: '5',
      callDate: '2024-01-05',
      callTime: '9:20 AM',
      duration: '5:15',
      callType: 'incoming',
      status: 'completed',
      notes: 'Asked about pricing and implementation timeline.',
      outcome: 'callback',
    },
  ],
  'Michael Johnson': [
    {
      id: '6',
      callDate: '2024-01-14',
      callTime: '1:30 PM',
      duration: '6:45',
      callType: 'outgoing',
      status: 'completed',
      notes: 'Marketing strategy discussion. Interested in our digital marketing services.',
      outcome: 'interested',
      followUpDate: '2024-01-21',
    },
  ],
  'Sarah Williams': [
    {
      id: '7',
      callDate: '2024-01-11',
      callTime: '4:00 PM',
      duration: '2:15',
      callType: 'outgoing',
      status: 'completed',
      notes: 'Brief call about data analytics tools. Not the right fit currently.',
      outcome: 'not_interested',
    },
    {
      id: '8',
      callDate: '2024-01-07',
      callTime: '10:15 AM',
      duration: '0:00',
      callType: 'outgoing',
      status: 'busy',
      notes: 'Line was busy. Will try again later.',
      outcome: 'no_response',
      followUpDate: '2024-01-09',
    },
  ],
  'Robert Brown': [
    {
      id: '9',
      callDate: '2024-01-13',
      callTime: '11:45 AM',
      duration: '15:20',
      callType: 'incoming',
      status: 'completed',
      notes: 'Executive level discussion about enterprise solutions. Very interested in partnership.',
      outcome: 'interested',
      followUpDate: '2024-01-20',
    },
    {
      id: '10',
      callDate: '2024-01-06',
      callTime: '3:30 PM',
      duration: '7:45',
      callType: 'outgoing',
      status: 'completed',
      notes: 'Initial business development call. Good rapport established.',
      outcome: 'callback',
      followUpDate: '2024-01-10',
    },
  ],
  'Emily Davis': [
    {
      id: '11',
      callDate: '2024-01-10',
      callTime: '2:20 PM',
      duration: '4:30',
      callType: 'outgoing',
      status: 'completed',
      notes: 'Creative project discussion. Interested in our design services.',
      outcome: 'interested',
      followUpDate: '2024-01-17',
    },
  ],
  'David Wilson': [],
  'Lisa Thompson': [
    {
      id: '12',
      callDate: '2024-01-09',
      callTime: '9:45 AM',
      duration: '8:15',
      callType: 'incoming',
      status: 'completed',
      notes: 'Healthcare solution inquiry. Discussed compliance requirements.',
      outcome: 'callback',
      followUpDate: '2024-01-15',
    },
  ],
};

type CallStatus = 'idle' | 'dialing' | 'ringing' | 'connected';

const CallingInterface: React.FC<CallingInterfaceProps> = ({
  visible,
  onClose,
  callerDetails,
}) => {
  const [currentCallerIndex, setCurrentCallerIndex] = useState<number>(0);
  const [timer, setTimer] = useState<number>(0);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [isCallActive, setIsCallActive] = useState<boolean>(false);
  const [callStatus, setCallStatus] = useState<CallStatus>('idle');
  const [expandedCallId, setExpandedCallId] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const callProgressRef = useRef<NodeJS.Timeout | null>(null);
  const callProgressRef2 = useRef<NodeJS.Timeout | null>(null);
  
  // Get current caller details
  const currentCaller = callerDetails || CALLERS_DATA[currentCallerIndex];
  
  // Get previous calls for current caller
  const previousCalls = PREVIOUS_CALLS_DATA[currentCaller.name] || [];

  // Timer effect - starts when interface opens for each caller
  useEffect(() => {
    if (visible && !showForm) {
      setIsTimerRunning(true);
      timerRef.current = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    } else {
      setIsTimerRunning(false);
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
  }, [visible, showForm, currentCallerIndex]);

  // Reset state when modal closes
  useEffect(() => {
    if (!visible) {
      setCurrentCallerIndex(0);
      setTimer(0);
      setShowForm(false);
      setIsTimerRunning(false);
      setIsCallActive(false);
      setCallStatus('idle');
      setExpandedCallId(null);
      
      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      // Clear call progress timeouts
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
    // Extract phone number and remove formatting
    const phoneNumber = currentCaller.phone.replace(/[^\d+]/g, '');
    
    // Create tel: URL for dialer
    const telUrl = `tel:${phoneNumber}`;
    
    // Open native dialer
    Linking.openURL(telUrl).catch(err => {
      Alert.alert('Error', 'Unable to open dialer. Please check if your device supports phone calls.');
      console.error('Error opening dialer:', err);
    });

    // Simulate call progress
    setIsCallActive(true);
    setCallStatus('dialing');
    
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
    // Stop timer and reset for next caller
    setIsTimerRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // End any active call
    handleEndCall();

    // Reset expanded call
    setExpandedCallId(null);

    if (currentCallerIndex < CALLERS_DATA.length - 1) {
      setCurrentCallerIndex(prev => prev + 1);
      setTimer(0); // Reset timer for next caller
    } else {
      Alert.alert(
        'No More Callers',
        'You have reached the end of the caller list.',
        [
          { text: 'Close', onPress: onClose },
          { text: 'Start Over', onPress: () => {
            setCurrentCallerIndex(0);
            setTimer(0);
          }}
        ]
      );
    }
  };

  const handlePreviousCaller = (): void => {
    // Stop timer and reset for previous caller
    setIsTimerRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // End any active call
    handleEndCall();

    // Reset expanded call
    setExpandedCallId(null);

    if (currentCallerIndex > 0) {
      setCurrentCallerIndex(prev => prev - 1);
      setTimer(0); // Reset timer for previous caller
    }
  };

  const handleFormSubmit = (formData: any): void => {
    console.log('Form submitted:', formData);
    
    // Stop timer when form is submitted
    setIsTimerRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    Alert.alert('Success', 'Call details saved successfully!', [
      { text: 'OK', onPress: () => {
        setShowForm(false);
        setTimer(0); // Reset timer
        onClose(); // Close the main modal after saving
      }}
    ]);
  };

  const handleFormClose = (): void => {
    setShowForm(false);
  };

  const handleCloseModal = (): void => {
    // Stop timer when closing
    setIsTimerRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // End any active call
    handleEndCall();
    
    onClose();
  };

  const getCallStatusText = (): string => {
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

  const getCallStatusColor = (): string => {
    switch (callStatus) {
      case 'dialing':
        return '#FF9800';
      case 'ringing':
        return '#2196F3';
      case 'connected':
        return '#4CAF50';
      default:
        return '#666';
    }
  };

  const getCallTypeIcon = (callType: string): string => {
    switch (callType) {
      case 'incoming':
        return 'call-received';
      case 'outgoing':
        return 'call-made';
      case 'missed':
        return 'call-missed';
      default:
        return 'call';
    }
  };

  const getCallTypeColor = (callType: string): string => {
    switch (callType) {
      case 'incoming':
        return '#4CAF50';
      case 'outgoing':
        return '#2196F3';
      case 'missed':
        return '#FF5722';
      default:
        return '#666';
    }
  };

  const getOutcomeColor = (outcome: string): string => {
    switch (outcome) {
      case 'interested':
        return '#4CAF50';
      case 'callback':
        return '#FF9800';
      case 'not_interested':
        return '#FF5722';
      case 'no_response':
        return '#666';
      default:
        return '#666';
    }
  };

  const getOutcomeText = (outcome: string): string => {
    switch (outcome) {
      case 'interested':
        return 'Interested';
      case 'callback':
        return 'Callback Required';
      case 'not_interested':
        return 'Not Interested';
      case 'no_response':
        return 'No Response';
      default:
        return outcome;
    }
  };

  const toggleCallExpansion = (callId: string): void => {
    setExpandedCallId(expandedCallId === callId ? null : callId);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
    >
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

        <ScrollView 
          style={styles.content} 
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
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
                isCallActive && styles.callButtonActive,
                callStatus === 'connected' && styles.callButtonConnected
              ]}
              onPress={isCallActive ? handleEndCall : handleStartCall}
            >
              <Icon 
                name={isCallActive ? "call-end" : "call"} 
                size={40} 
                color="#fff" 
              />
            </TouchableOpacity>

            {/* Call Status */}
            <View style={styles.callStatusContainer}>
              <View style={[styles.statusDot, { backgroundColor: getCallStatusColor() }]} />
              <Text style={[styles.callStatusText, { color: getCallStatusColor() }]}>
                {getCallStatusText()}
              </Text>
            </View>

            {/* Timer */}
            <View style={styles.timerContainer}>
              <Icon name="access-time" size={24} color="#666" />
              <Text style={styles.timerText}>{formatTime(timer)}</Text>
            </View>

            {/* Timer Status */}
            <View style={styles.statusContainer}>
              <View style={[styles.statusDot, { backgroundColor: isTimerRunning ? '#4CAF50' : '#666' }]} />
              <Text style={[styles.statusText, { color: isTimerRunning ? '#4CAF50' : '#666' }]}>
                {isTimerRunning ? 'Timer Running' : 'Timer Stopped'}
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

          {/* Previous Call History */}
          <View style={styles.previousCallsSection}>
            <Text style={styles.sectionTitle}>
              Previous Call History ({previousCalls.length})
            </Text>
            
            {previousCalls.length === 0 ? (
              <View style={styles.noCallsContainer}>
                <Icon name="call" size={40} color="#ccc" />
                <Text style={styles.noCallsText}>No previous calls with this contact</Text>
                <Text style={styles.noCallsSubtext}>This will be your first interaction</Text>
              </View>
            ) : (
              <View style={styles.callHistoryContainer}>
                {previousCalls.map((call, index) => (
                  <TouchableOpacity
                    key={call.id}
                    style={styles.callHistoryItem}
                    onPress={() => toggleCallExpansion(call.id)}
                  >
                    <View style={styles.callHistoryHeader}>
                      <View style={styles.callHistoryLeft}>
                        <Icon 
                          name={getCallTypeIcon(call.callType)} 
                          size={20} 
                          color={getCallTypeColor(call.callType)} 
                        />
                        <View style={styles.callHistoryInfo}>
                          <Text style={styles.callHistoryDate}>
                            {call.callDate} at {call.callTime}
                          </Text>
                          <Text style={styles.callHistoryDuration}>
                            Duration: {call.duration}
                          </Text>
                        </View>
                      </View>
                      
                      <View style={styles.callHistoryRight}>
                        <View style={[styles.outcomeTag, { backgroundColor: getOutcomeColor(call.outcome) }]}>
                          <Text style={styles.outcomeText}>
                            {getOutcomeText(call.outcome)}
                          </Text>
                        </View>
                        <Icon 
                          name={expandedCallId === call.id ? "expand-less" : "expand-more"} 
                          size={24} 
                          color="#666" 
                        />
                      </View>
                    </View>

                    {expandedCallId === call.id && (
                      <View style={styles.callHistoryExpanded}>
                        <View style={styles.callStatusRow}>
                          <Text style={styles.callStatusLabel}>Status:</Text>
                          <Text style={styles.callStatusValue}>{call.status.replace('_', ' ')}</Text>
                        </View>
                        
                        <View style={styles.callNotesSection}>
                          <Text style={styles.callNotesLabel}>Notes:</Text>
                          <Text style={styles.callNotesText}>{call.notes}</Text>
                        </View>
                        
                        {call.followUpDate && (
                          <View style={styles.followUpSection}>
                            <Icon name="event" size={16} color="#FF9800" />
                            <Text style={styles.followUpText}>
                              Follow-up: {call.followUpDate}
                            </Text>
                          </View>
                        )}
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
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

        {/* Your External Form Component */}
        <CallConnectionForm
          visible={showForm}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
          // callerDetails={currentCaller}
        />
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
  contentContainer: {
    paddingBottom: 30,
  },
  callerNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 25,
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
    marginBottom: 25,
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
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  callButtonActive: {
    backgroundColor: '#FF5722',
  },
  callButtonConnected: {
    backgroundColor: '#2196F3',
  },
  callStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  callStatusText: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  previousCallsSection: {
    marginBottom: 30,
  },
  noCallsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
  },
  noCallsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#999',
    marginTop: 10,
  },
  noCallsSubtext: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 4,
  },
  callHistoryContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
  },
  callHistoryItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 12,
  },
  callHistoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  callHistoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  callHistoryInfo: {
    marginLeft: 10,
  },
  callHistoryDate: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  callHistoryDuration: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  callHistoryRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  outcomeTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
  },
  outcomeText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  callHistoryExpanded: {
    marginTop: 10,
    paddingLeft: 28,
  },
  callStatusRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  callStatusLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginRight: 5,
  },
  callStatusValue: {
    fontSize: 14,
    color: '#777',
  },
  callNotesSection: {
    marginTop: 5,
    marginBottom: 10,
  },
  callNotesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 3,
  },
  callNotesText: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
  followUpSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  followUpText: {
    fontSize: 13,
    color: '#FF9800',
    marginLeft: 5,
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
});

export default CallingInterface;