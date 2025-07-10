import React, { JSX, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Homepage from './src/root/Homepage';
import Sidebar from './src/root/shared/Drawer';
import SignIn from './src/auth/SignIn';
import AllCalls from './src/root/AllCalls';

type ScreenType = 'SignIn' | 'Dashboard' | 'Calls' | 'Contacts' | 'Analytics' | 'Calendar' | 'Documents' | 'Settings' | 'Help';

function App(): JSX.Element {
  const [sidebarVisible, setSidebarVisible] = useState<boolean>(false);
  const [activeScreen, setActiveScreen] = useState<ScreenType>('SignIn');

  const toggleSidebar = (): void => setSidebarVisible(!sidebarVisible);

  const handleScreenChange = (screen: string): void => {
    if (screen === 'Logout') {
      setActiveScreen('SignIn');
      setSidebarVisible(false);
      return;
    }

    setActiveScreen(screen as ScreenType);
    setSidebarVisible(false);
    console.log(`Navigating to: ${screen}`);
  };

  const handleLoginSuccess = (): void => {
    setActiveScreen('Dashboard');
  };

  // Function to render the appropriate screen
  const renderScreen = () => {
    switch (activeScreen) {
      case 'SignIn':
        return <SignIn onLoginSuccess={handleLoginSuccess} />;
      case 'Dashboard':
        return <Homepage />;
      case 'Calls':
        return <AllCalls />;
      case 'Contacts':
        return (
          <View style={styles.screenContainer}>
            <Text style={styles.screenTitle}>Contacts</Text>
            <Text style={styles.screenSubtitle}>Contacts page coming soon...</Text>
          </View>
        );
      case 'Analytics':
        return (
          <View style={styles.screenContainer}>
            <Text style={styles.screenTitle}>Analytics</Text>
            <Text style={styles.screenSubtitle}>Analytics page coming soon...</Text>
          </View>
        );
      case 'Calendar':
        return (
          <View style={styles.screenContainer}>
            <Text style={styles.screenTitle}>Calendar</Text>
            <Text style={styles.screenSubtitle}>Calendar page coming soon...</Text>
          </View>
        );
      case 'Documents':
        return (
          <View style={styles.screenContainer}>
            <Text style={styles.screenTitle}>Documents</Text>
            <Text style={styles.screenSubtitle}>Documents page coming soon...</Text>
          </View>
        );
      case 'Settings':
        return (
          <View style={styles.screenContainer}>
            <Text style={styles.screenTitle}>Settings</Text>
            <Text style={styles.screenSubtitle}>Settings page coming soon...</Text>
          </View>
        );
      case 'Help':
        return (
          <View style={styles.screenContainer}>
            <Text style={styles.screenTitle}>Help & Support</Text>
            <Text style={styles.screenSubtitle}>Help page coming soon...</Text>
          </View>
        );
      default:
        return <Homepage />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Show header only when logged in */}
      {activeScreen !== 'SignIn' && (
        <View style={styles.header}>
          <TouchableOpacity onPress={toggleSidebar} style={styles.menuButton}>
            <Icon name="menu" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{activeScreen}</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerIcon}>
              <Icon name="notifications" size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIcon}>
              <Icon name="search" size={24} color="#333" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Render the appropriate screen */}
      {renderScreen()}

      {/* Sidebar visible only after login */}
      {activeScreen !== 'SignIn' && (
        <Sidebar
          isVisible={sidebarVisible}
          onClose={() => setSidebarVisible(false)}
          activeScreen={activeScreen}
          onScreenChange={handleScreenChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f5f5f5' 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  menuButton: { 
    padding: 8 
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: { 
    flexDirection: 'row' 
  },
  headerIcon: { 
    padding: 8, 
    marginLeft: 8 
  },
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  screenSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default App;