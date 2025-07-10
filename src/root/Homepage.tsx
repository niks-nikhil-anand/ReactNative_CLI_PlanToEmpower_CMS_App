import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
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

const Homepage: React.FC = () => {
  const [showCallingInterface, setShowCallingInterface] = useState(false);

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

  return (
    <>
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
      </ScrollView>

      {/* Calling Interface Modal */}
      <CallingInterface
        visible={showCallingInterface}
        onClose={handleCloseCalling}
      />
    </>
  );
};

const styles = StyleSheet.create({
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
});

export default Homepage;