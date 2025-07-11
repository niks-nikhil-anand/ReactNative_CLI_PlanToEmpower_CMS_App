import React, { useState, useEffect } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ProfileData {
  fullName: string;
  email: string;
  mobile: string;
  status: string;
  profilePicture: string;
}

interface UserData {
  id: string;
  name: string;
  role: string;
}

interface ProfilePageProps {
  initialData?: ProfileData;
  onSave?: (data: ProfileData) => void;
  onEditPhoto?: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({
  initialData,
  onSave,
  onEditPhoto,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData>({
    id: '',
    name: 'Unknown User',
    role: 'Unknown Role',
  });

  const [profileData, setProfileData] = useState<ProfileData>(
    initialData || {
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      mobile: '+1 (555) 123-4567',
      status: 'Available',
      profilePicture:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    },
  );

  const [editData, setEditData] = useState<ProfileData>(profileData);

  const statusOptions = [
    'Available',
    'Busy',
    'Away',
    'Do Not Disturb',
    'Offline',
  ];

  // Fetch user data from API
  const fetchUserData = async () => {
    try {
      setLoading(true);

      // Get token from AsyncStorage
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        console.log('No token found in AsyncStorage');
        Alert.alert('Error', 'Session expired. Please login again.');
        return;
      }

      console.log('Retrieved token:', token);

      // Make API call to /api/candidate/me with token in Authorization header
      const response = await fetch(
        `http://10.171.189.32:3000/api/auth/candidate/me`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const userData = await response.json();
      console.log('User data fetched:', userData);
      console.log('User data fetched:', userData.data._id);

      // Update user data state
      setUserData({
        id: userData.data._id || '',
        name: userData.data.fullName || 'Unknown User',
        role: userData.data.role || 'Unknown Role',
      });

      // Update profile data with API response
      const updatedProfileData = {
        fullName: userData.data.fullName || 'John Doe',
        email: userData.data.email || 'john.doe@example.com',
        mobile:
          userData.data.mobile || userData.data.phone || '+1 (555) 123-4567',
        status: userData.data.status || 'Available',
        profilePicture:
          userData.data.profilePicture ||
          userData.data.avatar ||
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      };

      setProfileData(updatedProfileData);
      setEditData(updatedProfileData);
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert('Error', 'Failed to load user data. Please try again.');

      // Set fallback data
      setUserData({
        id: '',
        name: 'Unknown User',
        role: 'Unknown Role',
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  const handleSave = async () => {
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

    try {
      // Get token from AsyncStorage
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        Alert.alert('Error', 'Session expired. Please login again.');
        return;
      }

      // Make API call to update profile
      const response = await fetch(
        `http://10.171.189.32:3000/api/auth/candidate/update`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fullName: editData.fullName,
            email: editData.email,
            mobile: editData.mobile,
            status: editData.status,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Profile updated:', result);

      setProfileData(editData);
      setIsEditing(false);
      onSave?.(editData);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
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
      case 'Available':
        return '#4caf50';
      case 'Busy':
        return '#f44336';
      case 'Away':
        return '#ff9800';
      case 'Do Not Disturb':
        return '#9c27b0';
      case 'Offline':
        return '#9e9e9e';
      default:
        return '#4caf50';
    }
  };

  const renderProfilePicture = () => (
    <View style={styles.profilePictureContainer}>
      <Image
        source={{ uri: profileData.profilePicture }}
        style={styles.profilePicture}
      />
      <View
        style={[
          styles.statusIndicator,
          { backgroundColor: getStatusColor(profileData.status) },
        ]}
      />
      {isEditing && (
        <TouchableOpacity style={styles.editPhotoButton} onPress={onEditPhoto}>
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
    keyboardType: 'default' | 'email-address' | 'phone-pad' = 'default',
  ) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {isEditing ? (
        <TextInput
          style={[styles.input, multiline && styles.multilineInput]}
          value={editData[key]}
          onChangeText={text => setEditData({ ...editData, [key]: text })}
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
          {statusOptions.map(status => (
            <TouchableOpacity
              key={status}
              style={[
                styles.statusOption,
                editData.status === status && styles.selectedStatus,
              ]}
              onPress={() => setEditData({ ...editData, status })}
            >
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: getStatusColor(status) },
                ]}
              />
              <Text
                style={[
                  styles.statusText,
                  editData.status === status && styles.selectedStatusText,
                ]}
              >
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={styles.statusDisplay}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: getStatusColor(profileData.status) },
            ]}
          />
          <Text style={styles.fieldValue}>{profileData.status}</Text>
        </View>
      )}
    </View>
  );

  const renderRoleField = () => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>Role</Text>
      <Text style={styles.fieldValue}>{userData.role}</Text>
    </View>
  );

  const renderUserIdField = () => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>User ID</Text>
      <Text style={styles.fieldValue}>{userData.id}</Text>
    </View>
  );

  // Show loading indicator while fetching data
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4a90e2" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Picture Section */}
        <View style={styles.profileSection}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditing(!isEditing)}
          >
            <Text style={styles.editButtonText}>
              {isEditing ? 'Cancel' : 'Edit'}
            </Text>
          </TouchableOpacity>

          {renderProfilePicture()}
          <Text style={styles.profileName}>{profileData.fullName}</Text>
          <Text style={styles.profileEmail}>{profileData.email}</Text>
          <Text style={styles.profileRole}>{userData.role}</Text>
        </View>

        {/* Profile Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          {renderField('Full Name', profileData.fullName, 'fullName')}
          {renderField(
            'Email Address',
            profileData.email,
            'email',
            false,
            'email-address',
          )}
          {renderField(
            'Mobile Number',
            profileData.mobile,
            'mobile',
            false,
            'phone-pad',
          )}
          {renderStatusField()}
          {renderRoleField()}
          {renderUserIdField()}
        </View>

        {/* Action Buttons */}
        {isEditing && (
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Refresh Button */}
        <View style={styles.refreshContainer}>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={fetchUserData}
          >
            <Text style={styles.refreshButtonText}>🔄 Refresh Profile</Text>
          </TouchableOpacity>
        </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
  },
  content: {
    flex: 1,
    paddingTop: 20,
  },
  profileSection: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 30,
    paddingHorizontal: 20,
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: 'relative',
  },
  editButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#4a90e2',
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  editButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
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
    marginBottom: 8,
  },
  profileRole: {
    fontSize: 14,
    color: '#4a90e2',
    fontWeight: '600',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  detailsContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 16,
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
    paddingHorizontal: 16,
    marginBottom: 20,
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
    marginBottom: 12,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#f44336',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  cancelButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  refreshContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    marginBottom: 16,
  },
  refreshButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  refreshButtonText: {
    color: '#4a90e2',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ProfilePage;
