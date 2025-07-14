import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const getInitials = (name) => {
  if (!name || typeof name !== 'string') return '?';
  const names = name.trim().split(' ');
  if (names.length === 1) return names[0][0].toUpperCase();
  return (names[0][0] + names[1][0]).toUpperCase();
};

const getBackgroundColor = (name) => {
  const colors = ['#f44336', '#3f51b5', '#009688', '#ff9800', '#9c27b0', '#2196f3'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const Avatar = ({ name = 'User', size = 64, style }) => {
  const initials = getInitials(name);
  const backgroundColor = getBackgroundColor(name);

  return (
    <View
      style={[
        styles.avatar,
        {
          backgroundColor,
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        style,
      ]}
    >
      <Text style={[styles.text, { fontSize: size / 2.5 }]}>{initials}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Avatar;
