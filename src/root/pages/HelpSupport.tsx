import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';


const { width } = Dimensions.get('window');

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View style={styles.faqItem}>
      <TouchableOpacity
        style={styles.faqQuestion}
        onPress={() => setIsExpanded(!isExpanded)}
        accessible={true}
        accessibilityLabel={`FAQ: ${question}`}
        accessibilityHint={isExpanded ? "Tap to collapse answer" : "Tap to expand answer"}
      >
        <Text style={styles.faqQuestionText}>{question}</Text>
        <Icon
          name={isExpanded ? 'expand-less' : 'expand-more'}
          size={20}
          color="#666"
        />
      </TouchableOpacity>
      {isExpanded && (
        <View style={styles.faqAnswer}>
          <Text style={styles.faqAnswerText}>{answer}</Text>
        </View>
      )}
    </View>
  );
};

const HelpSupport: React.FC = () => {
  const [ticketName, setTicketName] = useState('');
  const [ticketEmail, setTicketEmail] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [selectedIssue, setSelectedIssue] = useState('');

  const issueTypes = [
    { label: 'Select an issue type', value: '' },
    { label: 'Login/Authentication Problem', value: 'login' },
    { label: 'Account Settings', value: 'account' },
    { label: 'Payment/Billing Issue', value: 'payment' },
    { label: 'Technical Bug', value: 'bug' },
    { label: 'Feature Request', value: 'feature' },
    { label: 'Data/Privacy Concern', value: 'privacy' },
    { label: 'Performance Issue', value: 'performance' },
    { label: 'Other', value: 'other' },
  ];

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmitTicket = () => {
    if (!ticketName.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }
    
    if (!ticketEmail.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    if (!validateEmail(ticketEmail.trim())) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (!selectedIssue) {
      Alert.alert('Error', 'Please select an issue type');
      return;
    }

    if (!ticketMessage.trim()) {
      Alert.alert('Error', 'Please describe your issue');
      return;
    }

    Alert.alert(
      'Ticket Created', 
      `Your support ticket has been created successfully! We'll get back to you at ${ticketEmail.trim()} within 24 hours.`,
      [
        {
          text: 'OK',
          onPress: () => {
            setTicketName('');
            setTicketEmail('');
            setTicketMessage('');
            setSelectedIssue('');
          }
        }
      ]
    );
  };

  const faqData: FAQItemProps[] = [
    {
      question: 'How do I reset my password?',
      answer: 'Go to Settings > Account > Change Password. You can also use the "Forgot Password" link on the login screen.',
    },
    {
      question: 'How do I update my profile information?',
      answer: 'Navigate to Profile > Edit Profile. You can update your name, email, phone number, and profile picture.',
    },
    {
      question: 'Why am I not receiving notifications?',
      answer: 'Check your device notification settings and ensure the app has permission to send notifications. You can also check notification preferences in the app settings.',
    },
    {
      question: 'How do I export my data?',
      answer: 'Go to Settings > Data Export. You can export your data in PDF or CSV format.',
    },
    {
      question: 'How do I contact customer support?',
      answer: 'You can create a support ticket using the form below. We typically respond within 24 hours.',
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes, we use industry-standard encryption and security measures to protect your data. All data is stored securely and never shared with third parties.',
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4a90e2" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <Text style={styles.headerSubtitle}>We're here to help you</Text>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          {faqData.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
            />
          ))}
        </View>

        {/* Create Ticket Form */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Create Support Ticket</Text>
          <View style={styles.ticketForm}>
            <TextInput
              style={styles.input}
              placeholder="Your full name"
              placeholderTextColor="#999"
              value={ticketName}
              onChangeText={setTicketName}
              accessible={true}
              accessibilityLabel="Full name input"
              autoCapitalize="words"
              autoComplete="name"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Your email address"
              placeholderTextColor="#999"
              value={ticketEmail}
              onChangeText={setTicketEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              accessible={true}
              accessibilityLabel="Email address input"
            />

            <TouchableOpacity
              style={styles.pickerContainer}
              onPress={() => {
                const options = issueTypes.slice(1).map((issue) => ({
                  text: issue.label,
                  onPress: () => setSelectedIssue(issue.value)
                }));
                
                options.push({
                  text: 'Cancel',
                  onPress: () => {}
                });

                Alert.alert(
                  'Select Issue Type',
                  '',
                  options
                );
              }}
              accessible={true}
              accessibilityLabel="Issue type selector"
            >
              <Text style={styles.pickerText}>
                {selectedIssue 
                  ? issueTypes.find(issue => issue.value === selectedIssue)?.label 
                  : 'Select an issue type'
                }
              </Text>
              <Icon name="arrow-drop-down" size={20} color="#666" />
            </TouchableOpacity>

            <TextInput
              style={styles.messageInput}
              placeholder="Describe your issue in detail..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={6}
              value={ticketMessage}
              onChangeText={setTicketMessage}
              textAlignVertical="top"
              accessible={true}
              accessibilityLabel="Issue description input"
            />

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmitTicket}
              accessible={true}
              accessibilityLabel="Create support ticket"
              accessibilityHint="Submits your support ticket"
            >
              <Icon name="confirmation-number" size={20} color="#ffffff" />
              <Text style={styles.submitButtonText}>Create Ticket</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Contact Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.contactInfo}>
            <View style={styles.contactItem}>
              <Icon name="phone" size={16} color="#666" />
              <Text style={styles.contactText}>+1 (234) 567-8900</Text>
            </View>
            <View style={styles.contactItem}>
              <Icon name="email" size={16} color="#666" />
              <Text style={styles.contactText}>support@example.com</Text>
            </View>
            <View style={styles.contactItem}>
              <Icon name="schedule" size={16} color="#666" />
              <Text style={styles.contactText}>Mon-Fri: 9 AM - 6 PM EST</Text>
            </View>
            <View style={styles.contactItem}>
              <Icon name="location-on" size={16} color="#666" />
              <Text style={styles.contactText}>123 Support Street, Help City, HC 12345</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#4a90e2',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  faqItem: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  faqQuestionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  faqAnswer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  faqAnswerText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginTop: 12,
  },
  ticketForm: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  messageInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    minHeight: 120,
    marginBottom: 16,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4a90e2',
    paddingVertical: 12,
    borderRadius: 8,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  contactInfo: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
  },
});

export default HelpSupport;