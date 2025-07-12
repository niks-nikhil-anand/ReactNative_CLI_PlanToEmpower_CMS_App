import React, { useState } from 'react';
import {
  Modal,
  SafeAreaView,
  StatusBar,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

type NotConnectedReason = 
  | 'Busy in another call'
  | 'User disconnected the call'
  | 'Switch off'
  | 'Out of coverage/network issue'
  | 'Other reason'
  | 'Incorrect/invalid number'
  | 'Incoming calls not available'
  | 'Number not in use/does not exist/out of service';

type StepType = 'connection' | 'not-connected' | 'connected';

interface FormData {
  // Connection status
  isConnected: boolean | null;
  notConnectedReason: NotConnectedReason | '';
  
  // Connected flow
  customerInterested: boolean | null;
  isScheduled: boolean;
  followUpDate: string;
  donationAmount: string;
  callOutcome: string;
  remarks: string;
  doNotDisturb: boolean;
  
  // Quick actions
  valuableCustomer: boolean;
  appointmentScheduled: boolean;
}

interface NotConnectedSubmitData {
  status: 'not-connected';
  reason: NotConnectedReason;
  timestamp: string;
}

interface ConnectedSubmitData {
  status: 'connected';
  customerInterested: boolean;
  isScheduled: boolean;
  followUpDate: string;
  donationAmount: string;
  callOutcome: string;
  remarks: string;
  doNotDisturb: boolean;
  valuableCustomer: boolean;
  appointmentScheduled: boolean;
  timestamp: string;
}

type SubmitData = NotConnectedSubmitData | ConnectedSubmitData;

interface CallConnectionFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: SubmitData) => void;
}

const CallConnectionForm: React.FC<CallConnectionFormProps> = ({ 
  visible, 
  onClose, 
  onSubmit 
}) => {
  const [currentStep, setCurrentStep] = useState<StepType>('connection');
  const [formData, setFormData] = useState<FormData>({
    // Connection status
    isConnected: null,
    notConnectedReason: '',
    
    // Connected flow
    customerInterested: null,
    isScheduled: false,
    followUpDate: '',
    donationAmount: '',
    callOutcome: '',
    remarks: '',
    doNotDisturb: false,
    
    // Quick actions
    valuableCustomer: false,
    appointmentScheduled: false,
  });

  const notConnectedReasons: NotConnectedReason[] = [
    'Busy in another call',
    'User disconnected the call',
    'Switch off',
    'Out of coverage/network issue',
    'Other reason',
    'Incorrect/invalid number',
    'Incoming calls not available',
    'Number not in use/does not exist/out of service'
  ];

  const handleConnectionChoice = (connected: boolean): void => {
    setFormData({...formData, isConnected: connected});
    setCurrentStep(connected ? 'connected' : 'not-connected');
  };

  const handleNotConnectedSubmit = (): void => {
    if (!formData.notConnectedReason) {
      Alert.alert('Error', 'Please select a reason for not connected');
      return;
    }
    
    const submitData: NotConnectedSubmitData = {
      status: 'not-connected',
      reason: formData.notConnectedReason as NotConnectedReason,
      timestamp: new Date().toISOString()
    };
    
    onSubmit(submitData);
    resetForm();
  };

  const handleConnectedSubmit = (): void => {
    if (formData.customerInterested === null) {
      Alert.alert('Error', 'Please select if customer is interested');
      return;
    }

    const submitData: ConnectedSubmitData = {
      status: 'connected',
      customerInterested: formData.customerInterested,
      isScheduled: formData.isScheduled,
      followUpDate: formData.followUpDate,
      donationAmount: formData.donationAmount,
      callOutcome: formData.callOutcome,
      remarks: formData.remarks,
      doNotDisturb: formData.doNotDisturb,
      valuableCustomer: formData.valuableCustomer,
      appointmentScheduled: formData.appointmentScheduled,
      timestamp: new Date().toISOString()
    };

    onSubmit(submitData);
    resetForm();
  };

  const resetForm = (): void => {
    setFormData({
      isConnected: null,
      notConnectedReason: '',
      customerInterested: null,
      isScheduled: false,
      followUpDate: '',
      donationAmount: '',
      callOutcome: '',
      remarks: '',
      doNotDisturb: false,
      valuableCustomer: false,
      appointmentScheduled: false,
    });
    setCurrentStep('connection');
    onClose();
  };

  const updateFormData = (updates: Partial<FormData>): void => {
    setFormData({...formData, ...updates});
  };

  const renderConnectionStep = (): React.ReactElement => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Call Connection Status</Text>
      <Text style={styles.stepDescription}>Was the call connected?</Text>
      
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[styles.choiceButton, styles.connectedButton]}
          onPress={() => handleConnectionChoice(true)}
        >
          <Icon name="phone" size={24} color="#fff" />
          <Text style={styles.choiceButtonText}>Connected</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.choiceButton, styles.notConnectedButton]}
          onPress={() => handleConnectionChoice(false)}
        >
          <Icon name="phone-disabled" size={24} color="#fff" />
          <Text style={styles.choiceButtonText}>Not Connected</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderNotConnectedStep = (): React.ReactElement => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Call Not Connected</Text>
      <Text style={styles.stepDescription}>Please select the reason:</Text>
      
      <ScrollView style={styles.reasonsList}>
        {notConnectedReasons.map((reason, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.reasonItem,
              formData.notConnectedReason === reason && styles.selectedReason
            ]}
            onPress={() => updateFormData({notConnectedReason: reason})}
          >
            <Icon 
              name={formData.notConnectedReason === reason ? "radio-button-checked" : "radio-button-unchecked"} 
              size={24} 
              color={formData.notConnectedReason === reason ? "#4CAF50" : "#666"} 
            />
            <Text style={[
              styles.reasonText,
              formData.notConnectedReason === reason && styles.selectedReasonText
            ]}>
              {reason}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <View style={styles.formActions}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => setCurrentStep('connection')}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.submitButton} 
          onPress={handleNotConnectedSubmit}
        >
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderConnectedStep = (): React.ReactElement => (
    <ScrollView style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Call Connected</Text>
      
      {/* Customer Interest */}
      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Customer Interest *</Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[
              styles.interestButton,
              formData.customerInterested === true && styles.interestedSelected
            ]}
            onPress={() => updateFormData({customerInterested: true})}
          >
            <Icon name="thumb-up" size={20} color={formData.customerInterested === true ? "#fff" : "#4CAF50"} />
            <Text style={[
              styles.interestButtonText,
              formData.customerInterested === true && styles.interestedSelectedText
            ]}>
              Interested
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.interestButton,
              formData.customerInterested === false && styles.notInterestedSelected
            ]}
            onPress={() => updateFormData({customerInterested: false})}
          >
            <Icon name="thumb-down" size={20} color={formData.customerInterested === false ? "#fff" : "#f44336"} />
            <Text style={[
              styles.interestButtonText,
              formData.customerInterested === false && styles.notInterestedSelectedText
            ]}>
              Not Interested
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Scheduled Call */}
      <TouchableOpacity
        style={styles.checkboxRow}
        onPress={() => updateFormData({isScheduled: !formData.isScheduled})}
      >
        <Icon 
          name={formData.isScheduled ? "check-box" : "check-box-outline-blank"} 
          size={24} 
          color="#4CAF50" 
        />
        <Text style={styles.checkboxLabel}>Scheduled the call</Text>
      </TouchableOpacity>

      {/* Do Not Disturb - only show if not interested */}
      {formData.customerInterested === false && (
        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => updateFormData({doNotDisturb: !formData.doNotDisturb})}
        >
          <Icon 
            name={formData.doNotDisturb ? "check-box" : "check-box-outline-blank"} 
            size={24} 
            color="#f44336" 
          />
          <Text style={styles.checkboxLabel}>Do not disturb / Call again</Text>
        </TouchableOpacity>
      )}

      {/* Follow-up Date - show if scheduled */}
      {formData.isScheduled && (
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Follow-up Date</Text>
          <TextInput
            style={styles.textInput}
            value={formData.followUpDate}
            onChangeText={(text) => updateFormData({followUpDate: text})}
            placeholder="Select follow-up date"
          />
        </View>
      )}

      {/* Donation Amount - show if interested */}
      {formData.customerInterested === true && (
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Donation Amount</Text>
          <TextInput
            style={styles.textInput}
            value={formData.donationAmount}
            onChangeText={(text) => updateFormData({donationAmount: text})}
            placeholder="Enter donation amount"
            keyboardType="numeric"
          />
        </View>
      )}

      {/* Call Outcome - show if not interested or no donation */}
      {(formData.customerInterested === false || (formData.customerInterested === true && !formData.donationAmount)) && (
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Call Outcome</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            value={formData.callOutcome}
            onChangeText={(text) => updateFormData({callOutcome: text})}
            placeholder="What was the outcome?"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>
      )}

      {/* Next Follow-up - show if not interested or no donation */}
      {(formData.customerInterested === false || (formData.customerInterested === true && !formData.donationAmount)) && (
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Next Follow-up Date</Text>
          <TextInput
            style={styles.textInput}
            value={formData.followUpDate}
            onChangeText={(text) => updateFormData({followUpDate: text})}
            placeholder="When should we follow up?"
          />
        </View>
      )}

      {/* Remarks */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Remarks</Text>
        <TextInput
          style={[styles.textInput, styles.textArea]}
          value={formData.remarks}
          onChangeText={(text) => updateFormData({remarks: text})}
          placeholder="Additional remarks..."
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      {/* Quick Actions */}
      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        {formData.customerInterested === true && (
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => updateFormData({valuableCustomer: !formData.valuableCustomer})}
          >
            <Icon 
              name={formData.valuableCustomer ? "check-box" : "check-box-outline-blank"} 
              size={24} 
              color="#FF9800" 
            />
            <Text style={styles.checkboxLabel}>Valuable Customer</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => updateFormData({appointmentScheduled: !formData.appointmentScheduled})}
        >
          <Icon 
            name={formData.appointmentScheduled ? "check-box" : "check-box-outline-blank"} 
            size={24} 
            color="#4CAF50" 
          />
          <Text style={styles.checkboxLabel}>Appointment Scheduled</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formActions}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => setCurrentStep('connection')}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.submitButton} 
          onPress={handleConnectedSubmit}
        >
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#fff" barStyle="dark-content" />
        
        <View style={styles.header}>
          <Text style={styles.title}>Call Details</Text>
          <TouchableOpacity onPress={resetForm}>
            <Icon name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {currentStep === 'connection' && renderConnectionStep()}
        {currentStep === 'not-connected' && renderNotConnectedStep()}
        {currentStep === 'connected' && renderConnectedStep()}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  stepContainer: {
    flex: 1,
    padding: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  stepDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  choiceButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  connectedButton: {
    backgroundColor: '#4CAF50',
  },
  notConnectedButton: {
    backgroundColor: '#f44336',
  },
  choiceButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  reasonsList: {
    flex: 1,
    marginBottom: 20,
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  selectedReason: {
    backgroundColor: '#e8f5e8',
  },
  reasonText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  selectedReasonText: {
    color: '#4CAF50',
    fontWeight: '500',
  },
  formSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  interestButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginHorizontal: 5,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  interestedSelected: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  notInterestedSelected: {
    backgroundColor: '#f44336',
    borderColor: '#f44336',
  },
  interestButtonText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
    color: '#333',
  },
  interestedSelectedText: {
    color: '#fff',
  },
  notInterestedSelectedText: {
    color: '#fff',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 5,
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  backButton: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  submitButton: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    marginLeft: 10,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
});

export default CallConnectionForm;