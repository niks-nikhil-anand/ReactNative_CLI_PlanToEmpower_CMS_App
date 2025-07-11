import React, { JSX, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SignIn from './src/auth/SignIn';
import Homepage from './src/root/Homepage';
import AllCalls from './src/root/AllCalls';
import Sidebar from './src/root/shared/Drawer';
import Calendar from './src/root/pages/Calender';
import ProfilePage from './src/root/pages/Profile';
import HelpSupport from './src/root/pages/HelpSupport';
import SettingsPage from './src/root/pages/Settings';
import Analytics from './src/root/pages/Analytics';
import NotificationsPage from './src/root/pages/Notification';

type ScreenType =
  | 'SignIn'
  | 'Dashboard'
  | 'Calls'
  | 'Contacts'
  | 'Analytics'
  | 'Calendar'
  | 'Profile'
  | 'Settings'
  | 'Help'
  | 'Notifications';

function App(): JSX.Element {
  const [sidebarVisible, setSidebarVisible] = useState<boolean>(false);
  const [activeScreen, setActiveScreen] = useState<ScreenType>('SignIn');
  const [previousScreen, setPreviousScreen] = useState<ScreenType>('Dashboard');

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

  const handleNotificationClick = (): void => {
    if (activeScreen === 'Notifications') {
      // If already on notifications page, go back to previous screen
      setActiveScreen(previousScreen);
    } else {
      // If not on notifications page, store current screen and go to notifications
      setPreviousScreen(activeScreen);
      setActiveScreen('Notifications');
    }
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
            <Text style={styles.screenSubtitle}>
              Contacts page coming soon...
            </Text>
          </View>
        );
      case 'Analytics':
        return <Analytics />;
      case 'Calendar':
        return <Calendar />;
      case 'Profile':
        return <ProfilePage />;
      case 'Settings':
        return <SettingsPage />;
      case 'Help':
        return <HelpSupport />;
      case 'Notifications':
        return <NotificationsPage />;
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
            <TouchableOpacity 
              style={[
                styles.headerIcon, 
                activeScreen === 'Notifications' && styles.activeNotificationIcon
              ]} 
              onPress={handleNotificationClick}
            >
              <Icon 
                name="notifications" 
                size={24} 
                color={activeScreen === 'Notifications' ? '#007AFF' : '#333'} 
              />
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
    backgroundColor: '#f5f5f5',
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
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    flexDirection: 'row',
  },
  headerIcon: {
    padding: 8,
    marginLeft: 8,
  },
  activeNotificationIcon: {
    backgroundColor: '#E3F2FD',
    borderRadius: 20,
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