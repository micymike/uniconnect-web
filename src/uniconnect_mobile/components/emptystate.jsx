import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import React, { useEffect, useRef } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { Animated, Easing } from 'react-native';
import { Primary, white, Gray, secondary } from '../utils/colors';

const windowWidth = Dimensions.get('window').width;
const AnimatedLG = Animated.createAnimatedComponent(LinearGradient);

const EmptyState = () => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1800,
        easing: Easing.bezier(0.4, 0, 0.6, 1),
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-windowWidth * 1.5, windowWidth * 1.5],
  });

  const renderShimmer = () => (
    <AnimatedLG
      colors={[
        'transparent',
        'rgba(255, 255, 255, 0.03)',
        'rgba(255, 255, 255, 0.08)',
        'rgba(255, 255, 255, 0.12)',
        'rgba(255, 255, 255, 0.08)',
        'rgba(255, 255, 255, 0.03)',
        'transparent'
      ]}
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 0.5 }}
      style={[
        StyleSheet.absoluteFill, 
        { 
          transform: [{ translateX }, { skewX: '-20deg' }],
          overflow: "hidden" 
        }
      ]}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {renderShimmer()}
      </View>
      
      <View style={styles.contentContainer}>
        <View>
          <View style={styles.titleSkeleton}>
            {renderShimmer()}
          </View>
          <View style={styles.locationRow}>
            <View style={styles.locationSkeleton}>
              {renderShimmer()}
            </View>
          </View>
        </View>
        
        <View style={styles.bottomRow}>
          <View style={styles.bedRow}>
            <View style={styles.bedSkeleton}>
              {renderShimmer()}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default EmptyState;

const styles = StyleSheet.create({
  container: {
    width: windowWidth * 0.96,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginBottom: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  imageContainer: {
    backgroundColor: "#1a1a1a",
    width: 85,
    height: 85,
    borderRadius: 8,
    overflow: "hidden",
    position: 'relative',
  },
  contentContainer: {
    width: "70%",
    height: 80,
    paddingVertical: 5,
    justifyContent: "space-between",
  },
  titleSkeleton: {
    overflow: "hidden",
    width: "80%",
    height: 12,
    backgroundColor: "#1a1a1a",
    borderRadius: 3,
    marginVertical: 5,
    position: 'relative',
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 3,
  },
  locationSkeleton: {
    overflow: "hidden",
    width: "60%",
    height: 10,
    backgroundColor: "#1a1a1a",
    borderRadius: 2,
    marginLeft: 5,
    position: 'relative',
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bedRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  bedSkeleton: {
    overflow: "hidden",
    width: 50,
    height: 10,
    backgroundColor: "#1a1a1a",
    borderRadius: 2,
    marginLeft: 5,
    position: 'relative',
  },
  icon: {
    marginLeft: 4,
  },
});