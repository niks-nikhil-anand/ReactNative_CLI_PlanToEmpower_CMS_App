import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  SafeAreaView,
} from 'react-native';

interface SettingsItemProps {
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightComponent?: React.ReactNode;
  showArrow?: boolean;
}

const SettingsItem: React.FC<SettingsItemProps> = ({
  title,
  subtitle,
  onPress,
  rightComponent,
  showArrow = true,
}) => {
  return (
    <TouchableOpacity
      style={styles.settingsItem}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingsItemContent}>
        <View style={styles.settingsItemText}>
          <Text style={styles.settingsItemTitle}>{title}</Text>
          {subtitle && (
            <Text style={styles.settingsItemSubtitle}>{subtitle}</Text>
          )}
        </View>
        <View style={styles.settingsItemRight}>
          {rightComponent}
          {showArrow && onPress && (
            <Text style={styles.arrow}>›</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const SettingsPage: React.FC = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);

  const handleAccountPress = () => {
    Alert.alert('Account', 'Navigate to account settings');
  };

  const handlePrivacyPress = () => {
    Alert.alert('Privacy', 'Navigate to privacy settings');
  };

  const handleSecurityPress = () => {
    Alert.alert('Security', 'Navigate to security settings');
  };

  const handleLanguagePress = () => {
    Alert.alert('Language', 'Select your preferred language');
  };

  const handleStoragePress = () => {
    Alert.alert('Storage', 'Manage app storage and data');
  };

  const handleHelpPress = () => {
    Alert.alert('Help', 'Get help and support');
  };

  const handleAboutPress = () => {
    Alert.alert('About', 'App version 1.0.0');
  };

  const handleSignOutPress = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: () => {} },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.header}>Settings</Text>
        
        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <SettingsItem
            title="Profile"
            subtitle="Manage your profile information"
            onPress={handleAccountPress}
          />
          <SettingsItem
            title="Privacy"
            subtitle="Control your privacy settings"
            onPress={handlePrivacyPress}
          />
          <SettingsItem
            title="Security"
            subtitle="Password and security options"
            onPress={handleSecurityPress}
          />
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <SettingsItem
            title="Notifications"
            subtitle="Push notifications and alerts"
            rightComponent={
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
              />
            }
            showArrow={false}
          />
          <SettingsItem
            title="Dark Mode"
            subtitle="Enable dark theme"
            rightComponent={
              <Switch
                value={darkModeEnabled}
                onValueChange={setDarkModeEnabled}
              />
            }
            showArrow={false}
          />
          <SettingsItem
            title="Location Services"
            subtitle="Allow location access"
            rightComponent={
              <Switch
                value={locationEnabled}
                onValueChange={setLocationEnabled}
              />
            }
            showArrow={false}
          />
          <SettingsItem
            title="Biometric Authentication"
            subtitle="Use fingerprint or face ID"
            rightComponent={
              <Switch
                value={biometricsEnabled}
                onValueChange={setBiometricsEnabled}
              />
            }
            showArrow={false}
          />
        </View>

        {/* App Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          <SettingsItem
            title="Language"
            subtitle="English"
            onPress={handleLanguagePress}
          />
          <SettingsItem
            title="Storage"
            subtitle="Manage app data and cache"
            onPress={handleStoragePress}
          />
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <SettingsItem
            title="Help & Support"
            subtitle="Get help with the app"
            onPress={handleHelpPress}
          />
          <SettingsItem
            title="About"
            subtitle="App version and information"
            onPress={handleAboutPress}
          />
        </View>

        {/* Sign Out */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleSignOutPress}
          >
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 30,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginHorizontal: 20,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingsItem: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  settingsItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    minHeight: 60,
  },
  settingsItemText: {
    flex: 1,
  },
  settingsItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  settingsItemSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  settingsItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrow: {
    fontSize: 20,
    color: '#ccc',
    marginLeft: 10,
  },
  signOutButton: {
    backgroundColor: '#ff4444',
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  signOutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SettingsPage;