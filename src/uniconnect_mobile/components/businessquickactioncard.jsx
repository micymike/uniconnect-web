import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome, MaterialIcons, Feather } from '@expo/vector-icons';

const BusinessQuickActionsCard = () => {
  return (
    <LinearGradient
      colors={['#1a1a2e', '#3f37c9', '#1a1a2e']}
      style={styles.cardContainer}
    >
      <View style={styles.cardContent}>
        <Text style={styles.title}>Quick Actions</Text>
        
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 12,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,  // Slightly stronger shadow
    shadowRadius: 6,      // More pronounced radius
    elevation: 8,          // Add elevation for Android
  },
  cardContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'left'
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 10
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // More transparent background
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)', // Subtle border
  },
  actionIcon: {
    color: '#fff',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    color: '#fff',
    marginTop: 4,
    fontWeight: '600', // Make the text bold
  },
});

export default BusinessQuickActionsCard;
