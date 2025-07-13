import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome, MaterialIcons, Feather } from '@expo/vector-icons';

const BusinessSummaryCard = () => {
  return (
    <LinearGradient
      colors={['#1a1a2e', '#3f37c9', '#1a1a2e']}
      style={styles.cardContainer}
    >
      <View style={styles.cardContent}>
        <Text style={styles.title}>Business Summary</Text>
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <FontAwesome name="money" size={24} color="#fff" />
            <Text style={styles.summaryTitle}>Total Revenue</Text>
            <Text style={styles.summaryValue}>$50,000</Text>
          </View>

          {/* Card 2: Total Customers */}
          <View style={styles.summaryCard}>
            <MaterialIcons name="people" size={24} color="#fff" />
            <Text style={styles.summaryTitle}>Total Customers</Text>
            <Text style={styles.summaryValue}>1,200</Text>
          </View>

          {/* Card 3: Active Listings */}
          <View style={styles.summaryCard}>
            <FontAwesome name="list-alt" size={24} color="#fff" />
            <Text style={styles.summaryTitle}>Active Listings</Text>
            <Text style={styles.summaryValue}>250</Text>
          </View>

          {/* Card 4: Average Rating */}
          <View style={styles.summaryCard}>
            <MaterialIcons name="star" size={24} color="#fff" />
            <Text style={styles.summaryTitle}>Average Rating</Text>
            <Text style={styles.summaryValue}>4.5/5</Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 12,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardContent: {
    padding: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  summaryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  summaryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Semi-transparent white
    width: '48%', // Two cards per row
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100, // Ensure cards have some minimum height
  },
  summaryTitle: {
    fontSize: 14,
    color: '#eee',
    marginTop: 8,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 4,
  },
});

export default BusinessSummaryCard;
