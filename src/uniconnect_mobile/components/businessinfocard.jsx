import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome, MaterialIcons, Feather } from '@expo/vector-icons';

const BusinessInfoCard = () => {
  return (
  
      <View style={styles.cardContent}>
        <Text style={styles.title}>Your Business Info</Text>
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <MaterialIcons name="email" size={16} color="#fff" style={styles.icon} />
            <Text style={styles.infoText}>alex@business.com</Text>
          </View>
          <View style={styles.infoItem}>
            <FontAwesome name="phone" size={16} color="#fff" style={styles.icon} />
            <Text style={styles.infoText}>+1 (555) 123-4567</Text>
          </View>
          <View style={styles.infoItem}>
            <FontAwesome name="globe" size={16} color="#fff" style={styles.icon} />
            <Text style={styles.infoText}>www.alexbusiness.com</Text>
          </View>
          <View style={styles.infoItem}>
            <FontAwesome name="map-marker" size={16} color="#fff" style={styles.icon} />
            <Text style={styles.infoText}>123 Business Ave, City, State</Text>
          </View>
          <View style={styles.infoItem}>
            <Feather name="clock" size={16} color="#fff" style={styles.icon} />
            <Text style={styles.infoText}>Mon-Fri: 9AM-6PM, Sat: 10AM-4PM</Text>
          </View>
          
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 12,
    marginHorizontal: 16,
  },
  cardContent: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 15,
    fontWeight: 600,
    color: '#fff',
    marginBottom: 16,
  },
  infoContainer: {
    marginTop: 3,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    marginRight: 12,
    width: 20, // Add this line to ensure the icon takes up space
    textAlign: 'center'
  },
  infoText: {
    fontSize: 14,
    color: '#fff',
  },
});

export default BusinessInfoCard;
