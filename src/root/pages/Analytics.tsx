import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FeatherIcon from 'react-native-vector-icons/Feather';

const { width } = Dimensions.get('window');

interface StatCardProps {
  title: string;
  value: string;
  icon: string;
  iconLibrary?: 'MaterialIcons' | 'Feather';
  color: string;
  change: string;
  changeType: 'increase' | 'decrease';
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  iconLibrary = 'MaterialIcons',
  color,
  change,
  changeType,
}) => {
  const IconComponent = iconLibrary === 'Feather' ? FeatherIcon : Icon;
  
  return (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statCardContent}>
        <View style={styles.statHeader}>
          <IconComponent name={icon} size={24} color={color} />
          <Text style={styles.statTitle}>{title}</Text>
        </View>
        <Text style={[styles.statValue, { color }]}>{value}</Text>
        <View style={styles.changeContainer}>
          <Icon 
            name={changeType === 'increase' ? 'trending-up' : 'trending-down'} 
            size={16} 
            color={changeType === 'increase' ? '#4CAF50' : '#F44336'} 
          />
          <Text style={[
            styles.changeText,
            { color: changeType === 'increase' ? '#4CAF50' : '#F44336' }
          ]}>
            {change}
          </Text>
        </View>
      </View>
    </View>
  );
};

const Analytics: React.FC = () => {
  const handleExportPDF = () => {
    // TODO: Implement PDF export functionality
    console.log('Export PDF pressed');
  };

  const handleShareReport = () => {
    // TODO: Implement share functionality
    console.log('Share Report pressed');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Analytics</Text>
        <Text style={styles.headerSubtitle}>Track your performance</Text>
      </View>

      {/* Statistics Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statsRow}>
          <StatCard
            title="Total Calls"
            value="1,247"
            icon="phone"
            color="#4CAF50"
            change="+12%"
            changeType="increase"
          />
          <StatCard
            title="Total Follows"
            value="856"
            icon="heart"
            iconLibrary="Feather"
            color="#E91E63"
            change="+8%"
            changeType="increase"
          />
        </View>

        <View style={styles.statsRow}>
          <StatCard
            title="Conversion Rate"
            value="34.2%"
            icon="trending-up"
            color="#2196F3"
            change="+2.1%"
            changeType="increase"
          />
          <StatCard
            title="Success Rate"
            value="68.5%"
            icon="check-circle"
            color="#9C27B0"
            change="-1.3%"
            changeType="decrease"
          />
        </View>

        <View style={styles.statsRow}>
          <StatCard
            title="Revenue"
            value="$12,850"
            icon="attach-money"
            color="#FF9800"
            change="+15.2%"
            changeType="increase"
          />
          <StatCard
            title="Active Leads"
            value="342"
            icon="people"
            color="#00BCD4"
            change="+5.7%"
            changeType="increase"
          />
        </View>

        <View style={styles.statsRow}>
          <StatCard
            title="Closed Deals"
            value="89"
            icon="handshake"
            iconLibrary="MaterialIcons"
            color="#795548"
            change="+7.4%"
            changeType="increase"
          />
          <StatCard
            title="Response Rate"
            value="72.8%"
            icon="reply"
            color="#607D8B"
            change="-2.1%"
            changeType="decrease"
          />
        </View>
      </View>

      {/* Performance Metrics */}
      <View style={styles.metricsContainer}>
        <Text style={styles.sectionTitle}>Performance Metrics</Text>
        
        <View style={styles.metricRow}>
          <View style={styles.metricItem}>
            <Icon name="access-time" size={20} color="#2196F3" />
            <Text style={styles.metricLabel}>Average Call Duration</Text>
            <Text style={styles.metricValue}>8:42 min</Text>
          </View>
          <View style={styles.metricItem}>
            <Icon name="speed" size={20} color="#4CAF50" />
            <Text style={styles.metricLabel}>Response Rate</Text>
            <Text style={styles.metricValue}>72%</Text>
          </View>
        </View>

        <View style={styles.metricRow}>
          <View style={styles.metricItem}>
            <Icon name="schedule" size={20} color="#FF9800" />
            <Text style={styles.metricLabel}>Best Call Time</Text>
            <Text style={styles.metricValue}>2:00 PM</Text>
          </View>
          <View style={styles.metricItem}>
            <Icon name="flag" size={20} color="#9C27B0" />
            <Text style={styles.metricLabel}>Weekly Target</Text>
            <Text style={styles.metricValue}>85%</Text>
          </View>
        </View>

        <View style={styles.metricRow}>
          <View style={styles.metricItem}>
            <Icon name="star" size={20} color="#E91E63" />
            <Text style={styles.metricLabel}>Customer Rating</Text>
            <Text style={styles.metricValue}>4.8/5</Text>
          </View>
          <View style={styles.metricItem}>
            <Icon name="thumb-up" size={20} color="#00BCD4" />
            <Text style={styles.metricLabel}>Satisfaction</Text>
            <Text style={styles.metricValue}>92%</Text>
          </View>
        </View>
      </View>

      {/* Export Options */}
      <View style={styles.exportContainer}>
        <Text style={styles.sectionTitle}>Export Data</Text>
        <View style={styles.exportButtons}>
          <TouchableOpacity style={styles.exportButton} onPress={handleExportPDF}>
            <Icon name="file-download" size={20} color="#2196F3" />
            <Text style={styles.exportButtonText}>Export PDF</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.exportButton} onPress={handleShareReport}>
            <Icon name="share" size={20} color="#4CAF50" />
            <Text style={styles.exportButtonText}>Share Report</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
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
  statsContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statCard: {
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
  statCardContent: {
    alignItems: 'flex-start',
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statTitle: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  metricsContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  metricItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    width: (width - 50) / 2,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    marginTop: 8,
    textAlign: 'center',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  exportContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  exportButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  exportButton: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    width: (width - 50) / 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  exportButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
});

export default Analytics;