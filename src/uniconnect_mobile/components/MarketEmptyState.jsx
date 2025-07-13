import { View, Text, FlatList, StyleSheet, Dimensions, Animated, Easing } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { white } from '../utils/colors';
import { LinearGradient } from 'expo-linear-gradient';

const windowWidth = Dimensions.get('window').width;
const AnimatedLG = Animated.createAnimatedComponent(LinearGradient);

const Shimmer = () => {
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

  return (
    <View style={styles.shimmerWrapper}>
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
            transform: [{ translateX }, { skewX: '-20deg' }]
          }
        ]}
      />
    </View>
  );
};

const MarketEmptyState = () => (
  <>
    {Array.from({ length: 4 }).map((_, sectionIndex) => (
      <View key={sectionIndex} style={{ marginBottom: 20 }}>
        <View
          style={{
            paddingHorizontal: 15,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
          }}
        >
          <View style={styles.titleSkeleton}>
            <Shimmer />
          </View>
          <View style={styles.seeMoreSkeleton}>
            <Shimmer />
          </View>
        </View>
        <FlatList
          data={Array.from({ length: 3 })}
          horizontal
          keyExtractor={(_, i) => `skeleton-${sectionIndex}-${i}`}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 10, marginTop: 5 }}
          renderItem={() => (
            <View style={{ width: 130, marginRight: 10 }}>
              <View style={styles.imageBox}>
                <Shimmer />
              </View>
              <View style={styles.textBox}>
                <Shimmer />
              </View>
              <View style={styles.priceBox}>
                <Shimmer />
              </View>
            </View>
          )}
        />
      </View>
    ))}
  </>
);

export default MarketEmptyState;

const styles = StyleSheet.create({
  shimmerWrapper: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  titleSkeleton: {
    height: 18,
    width: 120,
    backgroundColor: '#1a1a1a',
    borderRadius: 6,
    overflow: 'hidden',
    position: 'relative',
  },
  seeMoreSkeleton: {
    height: 14,
    width: 60,
    backgroundColor: '#1a1a1a',
    borderRadius: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  imageBox: {
    height: 100,
    backgroundColor: '#1a1a1a',
    borderRadius: 6,
    marginBottom: 8,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 0.5,
    borderColor: '#2a2a2a',
  },
  textBox: {
    height: 12,
    backgroundColor: '#1a1a1a',
    borderRadius: 3,
    marginBottom: 6,
    overflow: 'hidden',
    position: 'relative',
    width: '85%',
  },
  priceBox: {
    height: 14,
    backgroundColor: '#1a1a1a',
    borderRadius: 3,
    width: 50,
    overflow: 'hidden',
    position: 'relative',
  },
});