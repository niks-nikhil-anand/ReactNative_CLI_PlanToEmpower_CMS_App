import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Modal,
  Linking,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import CallingInterface from './CallingInterface';

const { width } = Dimensions.get('window');

interface DashboardCardProps {
  title: string;
  count: number;
  icon: string;
  iconLibrary?: 'MaterialIcons' | 'Feather';
  color: string;
  onPress: () => void;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  count,
  icon,
  iconLibrary = 'MaterialIcons',
  color,
  onPress,
}) => {
  const IconComponent = iconLibrary === 'Feather' ? FeatherIcon : Icon;
  
  return (
    <TouchableOpacity style={[styles.card, { borderLeftColor: color }]} onPress={onPress}>
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <IconComponent name={icon} size={24} color={color} />
          <Text style={styles.cardTitle}>{title}</Text>
        </View>
        <Text style={[styles.cardCount, { color }]}>{count}</Text>
      </View>
    </TouchableOpacity>
  );
};

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    question: "How do I start making calls?",
    answer: "Simply tap the 'Start Calling' button on the dashboard to begin your calling session. Make sure you have a stable internet connection for the best experience."
  },
  {
    question: "What data is collected during calls?",
    answer: "We collect basic call metrics like duration, outcome, and notes for performance tracking. Personal conversation content is not stored unless explicitly saved by the user."
  },
  {
    question: "How do I manage my leads?",
    answer: "Access your leads through the 'My Leads' card on the dashboard. You can add, edit, and track lead status, set follow-up reminders, and view interaction history."
  },
  {
    question: "Can I export my call reports?",
    answer: "Yes, you can export your call reports and analytics from the 'My Report' section. Data can be exported in CSV or PDF format."
  },
  {
    question: "How do I update my profile information?",
    answer: "Navigate to Settings > Profile to update your personal information, contact details, and calling preferences."
  },
  {
    question: "What should I do if I encounter technical issues?",
    answer: "If you experience technical difficulties, please check your internet connection first. For persistent issues, contact our support team through the Help section."
  }
];

const DisclaimerModal: React.FC<{ visible: boolean; onClose: () => void }> = ({ visible, onClose }) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView style={styles.modalScrollView}>
            <Text style={styles.modalTitle}>Important Disclaimer</Text>
            
            <Text style={styles.sectionTitle}>Service Terms</Text>
            <Text style={styles.disclaimerText}>
              Plan to Empower CMS is a customer management system designed to facilitate business communications. 
              Users are responsible for complying with all applicable laws and regulations when using this service.
            </Text>
            
            <Text style={styles.sectionTitle}>Call Recording & Privacy</Text>
            <Text style={styles.disclaimerText}>
              • All calls may be recorded for quality assurance and training purposes{'\n'}
              • Users must obtain proper consent before recording calls where required by law{'\n'}
              • Personal data is handled according to our Privacy Policy{'\n'}
              • Users are responsible for protecting customer information
            </Text>
            
            <Text style={styles.sectionTitle}>Limitation of Liability</Text>
            <Text style={styles.disclaimerText}>
              Plan to Empower CMS is provided "as is" without warranties. We are not liable for any damages 
              arising from the use of this service, including but not limited to business losses, data loss, 
              or communication failures.
            </Text>
            
            <Text style={styles.sectionTitle}>Compliance</Text>
            <Text style={styles.disclaimerText}>
              Users must comply with telemarketing laws, do-not-call registries, and other applicable 
              regulations in their jurisdiction. Misuse of this service may result in account suspension.
            </Text>
          </ScrollView>
          
          <TouchableOpacity style={styles.modalButton} onPress={onClose}>
            <Text style={styles.modalButtonText}>I Understand</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const FAQModal: React.FC<{ visible: boolean; onClose: () => void }> = ({ visible, onClose }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Frequently Asked Questions</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalScrollView}>
            {FAQ_DATA.map((faq, index) => (
              <View key={index} style={styles.faqItem}>
                <TouchableOpacity 
                  style={styles.faqQuestion}
                  onPress={() => toggleFAQ(index)}
                >
                  <Text style={styles.faqQuestionText}>{faq.question}</Text>
                  <Icon 
                    name={expandedIndex === index ? "expand-less" : "expand-more"} 
                    size={24} 
                    color="#666" 
                  />
                </TouchableOpacity>
                
                {expandedIndex === index && (
                  <Text style={styles.faqAnswer}>{faq.answer}</Text>
                )}
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const SupportModal: React.FC<{ visible: boolean; onClose: () => void }> = ({ visible, onClose }) => {
  const handleEmailPress = () => {
    Linking.openURL('mailto:support@plantoempowercms.com');
  };

  const handlePhonePress = () => {
    Linking.openURL('tel:+1234567890');
  };

  const handleWebsitePress = () => {
    Linking.openURL('https://www.plantoempowercms.com');
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Contact Support</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.supportContainer}>
            <Text style={styles.supportDescription}>
              Need help? Get in touch with our support team through any of the following methods:
            </Text>
            
            <TouchableOpacity style={styles.supportOption} onPress={handleEmailPress}>
              <View style={styles.supportIconContainer}>
                <Icon name="email" size={24} color="#4CAF50" />
              </View>
              <View style={styles.supportTextContainer}>
                <Text style={styles.supportOptionTitle}>Email Support</Text>
                <Text style={styles.supportOptionSubtitle}>support@plantoempowercms.com</Text>
                <Text style={styles.supportOptionDescription}>We'll respond within 24 hours</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.supportOption} onPress={handlePhonePress}>
              <View style={styles.supportIconContainer}>
                <Icon name="phone" size={24} color="#2196F3" />
              </View>
              <View style={styles.supportTextContainer}>
                <Text style={styles.supportOptionTitle}>Phone Support</Text>
                <Text style={styles.supportOptionSubtitle}>+1 (234) 567-8900</Text>
                <Text style={styles.supportOptionDescription}>Mon-Fri, 9AM-6PM EST</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.supportOption} onPress={handleWebsitePress}>
              <View style={styles.supportIconContainer}>
                <Icon name="language" size={24} color="#FF9800" />
              </View>
              <View style={styles.supportTextContainer}>
                <Text style={styles.supportOptionTitle}>Visit Website</Text>
                <Text style={styles.supportOptionSubtitle}>www.plantoempowercms.com</Text>
                <Text style={styles.supportOptionDescription}>Documentation & resources</Text>
              </View>
            </TouchableOpacity>
            
            <View style={styles.supportFooter}>
              <Text style={styles.supportFooterText}>
                For urgent issues, please call our support line directly.
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const Homepage: React.FC = () => {
  const [showCallingInterface, setShowCallingInterface] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [showSupport, setShowSupport] = useState(false);

  const handleStartCalling = () => {
    console.log('Start calling pressed');
    setShowCallingInterface(true);
  };

  const handleCloseCalling = () => {
    setShowCallingInterface(false);
  };

  const handleCardPress = (cardType: string) => {
    console.log(`${cardType} card pressed`);
    // Add navigation or action logic here
  };

  const handleSupportPress = () => {
    setShowSupport(true);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <ScrollView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Dashboard</Text>
            <Text style={styles.headerSubtitle}>Welcome back!</Text>
          </View>

          {/* Start Calling Button */}
          <TouchableOpacity style={styles.startCallingButton} onPress={handleStartCalling}>
            <Icon name="phone" size={24} color="#fff" />
            <Text style={styles.startCallingText}>Start Calling</Text>
          </TouchableOpacity>

          {/* Dashboard Cards */}
          <View style={styles.cardsContainer}>
            <View style={styles.cardRow}>
              <DashboardCard
                title="Total Calls"
                count={127}
                icon="phone"
                color="#4CAF50"
                onPress={() => handleCardPress('Total Calls')}
              />
              <DashboardCard
                title="My Tasks"
                count={8}
                icon="assignment"
                color="#FF9800"
                onPress={() => handleCardPress('My Tasks')}
              />
            </View>

            <View style={styles.cardRow}>
              <DashboardCard
                title="My Leads"
                count={45}
                icon="people"
                color="#2196F3"
                onPress={() => handleCardPress('My Leads')}
              />
              <DashboardCard
                title="My Follows"
                count={23}
                icon="favorite"
                iconLibrary="Feather"
                color="#E91E63"
                onPress={() => handleCardPress('My Follows')}
              />
            </View>

            <View style={styles.cardRow}>
              <DashboardCard
                title="My Report"
                count={12}
                icon="bar-chart"
                iconLibrary="Feather"
                color="#9C27B0"
                onPress={() => handleCardPress('My Report')}
              />
              <View style={styles.cardPlaceholder} />
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActionsContainer}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActionsRow}>
              <TouchableOpacity style={styles.quickActionButton} onPress={() => setShowFAQ(true)}>
                <Icon name="help-outline" size={20} color="#666" />
                <Text style={styles.quickActionText}>FAQ</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.quickActionButton} onPress={() => setShowDisclaimer(true)}>
                <Icon name="info-outline" size={20} color="#666" />
                <Text style={styles.quickActionText}>Disclaimer</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.quickActionButton} onPress={handleSupportPress}>
                <Icon name="support-agent" size={20} color="#666" />
                <Text style={styles.quickActionText}>Support</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Plan to Empower CMS</Text>
            <Text style={styles.copyrightText}>© 2025 Plan to Empower CMS. All rights reserved.</Text>
            <Text style={styles.footerSubtext}>
              Empowering businesses through intelligent customer management
            </Text>
          </View>
        </ScrollView>

        {/* Calling Interface Modal */}
        <CallingInterface
          visible={showCallingInterface}
          onClose={handleCloseCalling}
        />

        {/* Disclaimer Modal */}
        <DisclaimerModal
          visible={showDisclaimer}
          onClose={() => setShowDisclaimer(false)}
        />

        {/* Support Modal */}
        <SupportModal
          visible={showSupport}
          onClose={() => setShowSupport(false)}
        />

        {/* FAQ Modal */}
        <FAQModal
          visible={showFAQ}
          onClose={() => setShowFAQ(false)}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  startCallingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    margin: 20,
    paddingVertical: 15,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  startCallingText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  cardsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: (width - 50) / 2,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardContent: {
    alignItems: 'flex-start',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    fontWeight: '500',
  },
  cardCount: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  cardPlaceholder: {
    width: (width - 50) / 2,
  },
  quickActionsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
  },
  quickActionButton: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    minWidth: 80,
  },
  quickActionText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  footer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  copyrightText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  footerSubtext: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: width * 0.9,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalScrollView: {
    maxHeight: '80%',
  },
  disclaimerText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 15,
  },
  modalButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  supportContainer: {
    paddingVertical: 10,
  },
  supportDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 20,
  },
  supportOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  supportIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  supportTextContainer: {
    flex: 1,
  },
  supportOptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  supportOptionSubtitle: {
    fontSize: 14,
    color: '#007bff',
    marginBottom: 2,
    fontWeight: '500',
  },
  supportOptionDescription: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  supportFooter: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffeaa7',
  },
  supportFooterText: {
    fontSize: 12,
    color: '#856404',
    textAlign: 'center',
    fontWeight: '500',
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingVertical: 15,
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
    lineHeight: 20,
  },
});

export default Homepage;