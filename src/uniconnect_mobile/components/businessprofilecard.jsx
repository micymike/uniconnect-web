import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { secondary,white } from '../utils/colors';
import { router } from 'expo-router';

const BusinessProfileCard = ({ name, category, joinedAt, onPress }) => {
  return (
    <View style={styles.card}>
      <View style={styles.infoContainer}>

        <View style={{ marginLeft: 4, flex: 1 }}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{name}</Text>
            <View style={styles.tag}>
              <Text style={styles.tagText}>Business</Text>
            </View>
          </View>
          <Text style={styles.category}>Services: {category}</Text>
          <Text style={styles.joined}>Created {joinedAt}</Text>
        </View>
        <TouchableOpacity
        onPress={() => {
          router.replace("/dashindex")
        }}
        activeOpacity={0.7}
        style={styles.button}>
        <Text style={styles.buttonText}>Go to Dashboard</Text>
      </TouchableOpacity>
      </View>

      
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: secondary,
    padding: 16,
    borderRadius: 12,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    justifyContent: 'space-between',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    color: white,
    fontWeight: 'bold',
    marginRight: 6,
  },
  tag: {
    backgroundColor: '#4c2e00',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tagText: {
    color: '#F07500',
    fontSize: 11,
    fontWeight: '600',
  },
  category: {
    color: '#ccc',
    fontSize: 13,
    marginTop: 2,
  },
  joined: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 1,
  },
  button: {
    backgroundColor: '#F07500',
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 12,
    alignSelf: 'flex-end',
    paddingHorizontal: 12,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '500',
    fontSize: 14,
  },
});

export default BusinessProfileCard;
