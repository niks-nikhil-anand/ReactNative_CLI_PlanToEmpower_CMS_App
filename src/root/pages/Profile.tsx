import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  Dimensions,
  StatusBar,
} from 'react-native';

interface ProfileData {
  fullName: string;
  email: string;
  mobile: string;
  status: string;
  profilePicture: string;
}

interface ProfilePageProps {
  initialData?: ProfileData;
  onSave?: (data: ProfileData) => void;
  onEditPhoto?: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({
  initialData,
  onSave,
  onEditPhoto
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>(
    initialData || {
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      mobile: '+1 (555) 123-4567',
      status: 'Available',
      profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face'
    }
  );

  const [editData, setEditData] = useState<ProfileData>(profileData);

  const statusOptions = ['Available', 'Busy', 'Away', 'Do Not Disturb', 'Offline'];

  const handleSave = () => {
    if (!editData.fullName.trim()) {
      Alert.alert('Error', 'Full name is required');
      return;
    }
    
    if (!editData.email.trim() || !isValidEmail(editData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    
    if (!editData.mobile.trim()) {
      Alert.alert('Error', 'Mobile number is required');
      return;
    }

    setProfileData(editData);
    setIsEditing(false);
    onSave?.(editData);
    Alert.alert('Success', 'Profile updated successfully');
  };

  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Available': return '#4caf50';
      case 'Busy': return '#f44336';
      case 'Away': return '#ff9800';
      case 'Do Not Disturb': return '#9c27b0';
      case 'Offline': return '#9e9e9e';
      default: return '#4caf50';
    }
  };

  const renderProfilePicture = () => (
    <View style={styles.profilePictureContainer}>
      <Image
        source={{ uri: profileData.profilePicture }}
        style={styles.profilePicture}
      />
      <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(profileData.status) }]} />
      {isEditing && (
        <TouchableOpacity 
          style={styles.editPhotoButton}
          onPress={onEditPhoto}
        >
          <Text style={styles.editPhotoText}>📷</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderField = (
    label: string,
    value: string,
    key: keyof ProfileData,
    multiline: boolean = false,
    keyboardType: 'default' | 'email-address' | 'phone-pad' = 'default'
  ) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {isEditing ? (
        <TextInput
          style={[styles.input, multiline && styles.multilineInput]}
          value={editData[key]}
          onChangeText={(text) => setEditData({ ...editData, [key]: text })}
          placeholder={`Enter ${label.toLowerCase()}`}
          placeholderTextColor="#999"
          multiline={multiline}
          keyboardType={keyboardType}
        />
      ) : (
        <Text style={styles.fieldValue}>{value}</Text>
      )}
    </View>
  );

  const renderStatusField = () => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>Status</Text>
      {isEditing ? (
        <View style={styles.statusContainer}>
          {statusOptions.map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.statusOption,
                editData.status === status && styles.selectedStatus
              ]}
              onPress={() => setEditData({ ...editData, status })}
            >
              <View style={[styles.statusDot, { backgroundColor: getStatusColor(status) }]} />
              <Text style={[
                styles.statusText,
                editData.status === status && styles.selectedStatusText
              ]}>
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={styles.statusDisplay}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(profileData.status) }]} />
          <Text style={styles.fieldValue}>{profileData.status}</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4a90e2" />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Picture Section */}
        <View style={styles.profileSection}>
          {renderProfilePicture()}
          <Text style={styles.profileName}>{profileData.fullName}</Text>
          <Text style={styles.profileEmail}>{profileData.email}</Text>
        </View>

        {/* Profile Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          {renderField('Full Name', profileData.fullName, 'fullName')}
          {renderField('Email Address', profileData.email, 'email', false, 'email-address')}
          {renderField('Mobile Number', profileData.mobile, 'mobile', false, 'phone-pad')}
          {renderStatusField()}
        </View>

        {/* Action Buttons */}
        {isEditing && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
  },
  editButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 30,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  profilePictureContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#ffffff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  editPhotoButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#4a90e2',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  editPhotoText: {
    fontSize: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: '#666666',
  },
  detailsContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginHorizontal: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 8,
  },
  fieldValue: {
    fontSize: 16,
    color: '#333333',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  input: {
    fontSize: 16,
    color: '#333333',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  statusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 8,
  },
  selectedStatus: {
    backgroundColor: '#4a90e2',
    borderColor: '#4a90e2',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#333333',
  },
  selectedStatusText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  statusDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  actionButtons: {
    padding: 20,
  },
  saveButton: {
    backgroundColor: '#4a90e2',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfilePage