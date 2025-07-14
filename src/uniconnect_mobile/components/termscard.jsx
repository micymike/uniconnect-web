import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Primary ,secondary,white,Gray, silver} from '../utils/colors';

const TermsCard = ({ title, points  }) => {
  return (
    <View style={styles.card}>
      <View style={styles.sideLine} />
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        {points.map((point, index) => (
          <Text key={index} style={styles.point}>
            • {point}
          </Text>
        ))}
      </View>
    </View>
  );
};

export default TermsCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: secondary,
    borderRadius: 10,
    padding: 16,
    marginVertical: 8,
    width: '100%',
  },
  sideLine: {
    width: 4,
    backgroundColor: Primary,
    borderRadius: 8,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    color: white,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  point: {
    color: silver,
    fontSize: 14,
    marginBottom: 4,
  },
});
