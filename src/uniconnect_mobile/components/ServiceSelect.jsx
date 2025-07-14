import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';

const ServiceSelect = ({ selectedServices = [], onChange }) => {
  const SERVICES = [
    { id: 'rental', label: 'Rentals' },
    { id: 'market', label: ' Market' },
  ];

  const [selected, setSelected] = useState(selectedServices || []);


    useEffect(() => {
        setSelected(selectedServices || []);
    }, [selectedServices]);


   const toggleService = (service) => {
    const newSelected = selected.includes(service)
      ? selected.filter(s => s !== service)
      : [...selected, service];

    setSelected(newSelected);
    onChange(newSelected); 
  };

  return (
    <View style={styles.container}>
      <View style={styles.servicesContainer}>
        {SERVICES.map((service) => {
          const isSelected = selected.includes(service.id);
          return (
            <TouchableOpacity
              activeOpacity={0.7}
              key={service.id}
              onPress={() => toggleService(service.id)}
              style={[
                styles.serviceItem,
                {
                  borderColor: isSelected ? '#f97316' : '#555',
                  backgroundColor: isSelected ? '#2a1205' : '#222',
                },
              ]}
            >
              <View style={styles.checkboxWrapper}>
                {isSelected ? (
                  <Ionicons name="checkmark-outline" size={13} color="#fff" />
                ) : (
                  <View style={styles.uncheckedBox} />
                )}
              </View>
              <Text
                style={[
                  styles.serviceText,
                  {
                    color: isSelected ? '#f97316' : '#fff',
                    fontWeight: isSelected ? '600' : '400',
                  },
                ]}
              >
                {service.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default ServiceSelect;

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 10,
  },
  required: {
    color: 'red',
  },
  servicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    borderWidth: 0.8,
    minWidth: '45%',
    marginBottom: 10,
  },
  checkboxWrapper: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#f97316',
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  uncheckedBox: {
    width: 12,
    height: 12,
    backgroundColor: 'transparent',
  },
  serviceText: {
    fontSize: 14,
  },
});
