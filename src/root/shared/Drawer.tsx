import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

interface SidebarItemProps {
  icon: string;
  iconLibrary?: 'MaterialIcons' | 'Feather';
  title: string;
  onPress: () => void;
  isActive?: boolean;
}

interface UserData {
  id: string;
  name: string;
  role: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  iconLibrary = 'MaterialIcons',
  title,
  onPress,
  isActive = false,
}) => {
  const IconComponent = iconLibrary === 'Feather' ? FeatherIcon : Icon;

  return (
    <TouchableOpacity
      style={[styles.sidebarItem, isActive && styles.sidebarItemActive]}
      onPress={onPress}
    >
      <IconComponent
        name={icon}
        size={22}
        color={isActive ? '#4CAF50' : '#666'}
      />
      <Text
        style={[
          styles.sidebarItemText,
          isActive && styles.sidebarItemTextActive,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

interface SidebarProps {
  isVisible: boolean;
  onClose: () => void;
  activeScreen: string;
  onScreenChange: (screen: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isVisible,
  onClose,
  activeScreen,
  onScreenChange,
}) => {
  const [userData, setUserData] = useState<UserData>({
    id: '',
    name: 'Loading...',
    role: 'Loading...',
  });
  const [loading, setLoading] = useState(true);

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
      const response = await fetch(`http://10.171.189.32:3000/api/auth/candidate/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const userData = await response.json();
      console.log('User data fetched:', userData);
      console.log('User data fetched:', userData.data._id);

      // Update user data state
      setUserData({
        id: userData.data._id || '',
        name: userData.data.fullName ,
        role: userData.data.role,
      });

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

  // Fetch user data when sidebar becomes visible
  useEffect(() => {
    if (isVisible) {
      fetchUserData();
    }
  }, [isVisible]);

  const handleItemPress = (screen: string) => {
    onScreenChange(screen);
    onClose();
  };

  const handleLogout = async () => {
    try {
      console.log('Logging out: Removing token...');
      await AsyncStorage.removeItem('token');
      console.log('Token removed successfully.');

      onClose(); 
      console.log('Sidebar closed.');

      // Use the onScreenChange prop to navigate to SignIn
      onScreenChange('Logout');
      console.log('Navigated to SignIn.');
    } catch (error) {
      console.error('Logout Error:', error);
      Alert.alert('Logout Error', 'Unable to logout. Please try again.');
    }
  };

  // Generate initials from name
  const getInitials = (name: string) => {
    if (!name || name === 'Loading...' || name === 'Unknown User') {
      return 'U';
    }
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.sidebarOverlay}>
        <TouchableOpacity
          style={styles.sidebarBackground}
          onPress={onClose}
          activeOpacity={1}
        />
        <View style={styles.sidebarContainer}>
          <SafeAreaView style={styles.sidebarContent}>
            {/* Header */}
            <View style={styles.sidebarHeader}>
              <View style={styles.sidebarHeaderInfo}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {getInitials(userData.name)}
                  </Text>
                </View>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>
                    {loading ? 'Loading...' : userData.name}
                  </Text>
                  
                  <Text style={styles.userRole}>
                    {loading ? 'Loading...' : userData.role}
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Navigation Items */}
            <ScrollView style={styles.sidebarMenu}>
              <SidebarItem
                icon="dashboard"
                title="Dashboard"
                onPress={() => handleItemPress('Dashboard')}
                isActive={activeScreen === 'Dashboard'}
              />
              <SidebarItem
                icon="phone"
                title="Calls"
                onPress={() => handleItemPress('Calls')}
                isActive={activeScreen === 'Calls'}
              />
              <SidebarItem
                icon="contacts"
                title="Contacts"
                onPress={() => handleItemPress('Contacts')}
                isActive={activeScreen === 'Contacts'}
              />
              <SidebarItem
                icon="trending-up"
                iconLibrary="Feather"
                title="Analytics"
                onPress={() => handleItemPress('Analytics')}
                isActive={activeScreen === 'Analytics'}
              />
              <SidebarItem
                icon="calendar"
                iconLibrary="Feather"
                title="Calendar"
                onPress={() => handleItemPress('Calendar')}
                isActive={activeScreen === 'Calendar'}
              />
              <SidebarItem
                icon="folder"
                iconLibrary="Feather"
                title="Documents"
                onPress={() => handleItemPress('Documents')}
                isActive={activeScreen === 'Documents'}
              />

              <View style={styles.divider} />

              <SidebarItem
                icon="settings"
                title="Settings"
                onPress={() => handleItemPress('Settings')}
                isActive={activeScreen === 'Settings'}
              />
              <SidebarItem
                icon="help-circle"
                iconLibrary="Feather"
                title="Help & Support"
                onPress={() => handleItemPress('Help')}
                isActive={activeScreen === 'Help'}
              />
              <SidebarItem
                icon="logout"
                iconLibrary="Feather"
                title="Logout"
                onPress={handleLogout}
                isActive={false}
              />
            </ScrollView>
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  sidebarOverlay: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebarBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sidebarContainer: {
    width: width * 0.8,
    backgroundColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  sidebarContent: {
    flex: 1,
  },
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#f8f9fa',
  },
  sidebarHeaderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  userRole: {
    fontSize: 14,
    color: '#666',
  },
  closeButton: {
    padding: 8,
  },
  sidebarMenu: {
    flex: 1,
    paddingTop: 8,
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sidebarItemActive: {
    backgroundColor: '#f0f8f0',
    borderRightWidth: 3,
    borderRightColor: '#4CAF50',
  },
  sidebarItemText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 16,
    fontWeight: '500',
  },
  sidebarItemTextActive: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 8,
    marginHorizontal: 20,
  },
});

export default Sidebar;