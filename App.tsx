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

type ScreenType = 'SignIn' | 'Dashboard' | 'Users' | 'Settings' | 'Analytics' | 'Content';

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

      {/* Conditional Screens */}
      {activeScreen === 'SignIn' ? (
        <SignIn onLoginSuccess={handleLoginSuccess} />
      ) : (
        <Homepage />
      )}

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
});

export default App;