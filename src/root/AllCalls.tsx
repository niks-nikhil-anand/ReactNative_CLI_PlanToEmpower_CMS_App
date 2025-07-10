import { View, Text, FlatList, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import React from 'react';

interface CallerDetails {
  name: string;
  phone: string;
  company: string;
  designation: string;
  email: string;
  address: string;
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

const AllCalls: React.FC = () => {
  const handlePhonePress = (phone: string): void => {
    const phoneUrl = `tel:${phone}`;
    Linking.openURL(phoneUrl);
  };

  const handleEmailPress = (email: string): void => {
    const emailUrl = `mailto:${email}`;
    Linking.openURL(emailUrl);
  };

  const renderCallerItem = ({ item }: { item: CallerDetails }) => (
    <View style={styles.callerCard}>
      <View style={styles.callerHeader}>
        <Text style={styles.callerName}>{item.name}</Text>
        <Text style={styles.callerDesignation}>{item.designation}</Text>
      </View>
      
      <View style={styles.callerDetails}>
        <Text style={styles.companyName}>{item.company}</Text>
        
        <TouchableOpacity 
          style={styles.contactRow}
          onPress={() => handlePhonePress(item.phone)}
        >
          <Text style={styles.contactLabel}>Phone: </Text>
          <Text style={styles.phoneNumber}>{item.phone}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.contactRow}
          onPress={() => handleEmailPress(item.email)}
        >
          <Text style={styles.contactLabel}>Email: </Text>
          <Text style={styles.emailAddress}>{item.email}</Text>
        </TouchableOpacity>
        
        <View style={styles.addressRow}>
          <Text style={styles.contactLabel}>Address: </Text>
          <Text style={styles.address}>{item.address}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Calls</Text>
      <FlatList
        data={CALLERS_DATA}
        renderItem={renderCallerItem}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  callerCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  callerHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 8,
    marginBottom: 12,
  },
  callerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  callerDesignation: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  callerDetails: {
    gap: 8,
  },
  companyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c5aa0',
    marginBottom: 4,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  contactLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  phoneNumber: {
    fontSize: 14,
    color: '#007AFF',
    textDecorationLine: 'underline',
    flex: 1,
  },
  emailAddress: {
    fontSize: 14,
    color: '#007AFF',
    textDecorationLine: 'underline',
    flex: 1,
  },
  address: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    lineHeight: 20,
  },
});

export default AllCalls;