import { StyleSheet, View, Dimensions, Animated, Easing } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

const windowWidth = Dimensions.get('window').width;
const AnimatedLG = Animated.createAnimatedComponent(LinearGradient);

const ChatSkeletonItem = () => {
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
          overflow: 'hidden' 
        }
      ]}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        {renderShimmer()}
      </View>

      <View style={styles.textContainer}>
        <View style={styles.nameRow}>
          <View style={styles.nameBar}>
            {renderShimmer()}
          </View>
          <View style={styles.timeBar}>
            {renderShimmer()}
          </View>
        </View>
        <View style={styles.messageRow}>
          <View style={styles.messageBar}>
            {renderShimmer()}
          </View>
          <View style={styles.unreadBadge}>
            {renderShimmer()}
          </View>
        </View>
      </View>
    </View>
  );
};

export default ChatSkeletonItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#1a1a1a',
    overflow: 'hidden',
    marginRight: 12,
    position: 'relative',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'space-between',
    height: 40,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  nameBar: {
    width: '45%',
    height: 12,
    backgroundColor: '#1a1a1a',
    borderRadius: 3,
    overflow: 'hidden',
    position: 'relative',
  },
  timeBar: {
    width: 45,
    height: 10,
    backgroundColor: '#1a1a1a',
    borderRadius: 2,
    overflow: 'hidden',
    position: 'relative',
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  messageBar: {
    width: '65%',
    height: 10,
    backgroundColor: '#1a1a1a',
    borderRadius: 2,
    overflow: 'hidden',
    position: 'relative',
  },
  unreadBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#1a1a1a',
    overflow: 'hidden',
    position: 'relative',
  },
});