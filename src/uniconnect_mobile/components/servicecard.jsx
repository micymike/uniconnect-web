import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';

const ServiceCard = () => {
  return (
      <View style={styles.cardContent}>
        <View style={{flexDirection: "row",justifyContent: "space-between"}}>
        <Text style={styles.title}>Select Service:</Text>
        <View style={{flexDirection: 'row',alignItems: 'center',backgroundColor: '#22c55e33', paddingHorizontal: 8,paddingVertical: 4,borderRadius: 999, alignSelf: 'flex-start'}}>
             <FontAwesome name="building" size={12} color="#22c55e" style={{ marginRight: 6 }} />
             <Text style={{ color: '#22c55e', fontSize: 12, fontWeight: '600' }}>Rentals</Text>
        </View>
        </View>
        <Text style={styles.description}>Currently managing Rental Properties</Text>
      </View>
  );
};

const styles = StyleSheet.create({
  cardContent: {
    paddingHorizontal: 20,
    paddingVertical: 5
  },
  title: {
    fontSize: 15,
    fontWeight: 600,
    color: '#fff',
  },
  serviceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#22c55e44',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    justifyContent: "center"
  },
  serviceText: {
    fontSize: 14,
    color: '#22c55e99',
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: '#788481',
    marginHorizontal: 8
  },
});

export default ServiceCard;
