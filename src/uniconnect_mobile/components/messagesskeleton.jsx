import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { white, secondary, Gray, silver } from '../utils/colors';

const SCREEN_WIDTH = Dimensions.get('window').width;

const BubbleSkeleton = ({ isMyMessage }) => {
  const shimmerOpacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerOpacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [shimmerOpacity]);

  return (
    <View style={[
      styles.messageContainer,
      isMyMessage ? styles.myMessageContainer : styles.otherMessageContainer
    ]}>
      <View style={[
        styles.messageBubble,
        isMyMessage ? styles.myMessageBubble : styles.otherMessageBubble
      ]}>
        {!isMyMessage && (
          <Animated.View
            style={[styles.senderNameSkeleton, { opacity: shimmerOpacity }]}
          />
        )}
        <View>
          <Animated.View
            style={[
              styles.textLineSkeleton,
              styles.firstLine,
              { opacity: shimmerOpacity }
            ]}
          />
          <Animated.View
            style={[
              styles.textLineSkeleton,
              styles.secondLine,
              { opacity: shimmerOpacity }
            ]}
          />
        </View>
      </View>
    </View>
  );
};

const MessagesEmptyState = () => {
  const fakeMessages = [
    { id: 1, isMyMessage: false },
    { id: 2, isMyMessage: true },
    { id: 3, isMyMessage: false },
    { id: 4, isMyMessage: true },
  ];

  return (
    <View style={styles.messagesContainer}>
      {fakeMessages.map(msg => (
        <BubbleSkeleton key={msg.id} isMyMessage={msg.isMyMessage} />
      ))}
    </View>
  );
};

export default MessagesEmptyState;

const styles = StyleSheet.create({
  messagesContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  messageContainer: {
    marginVertical: 6,
    maxWidth: '90%',
  },
  myMessageContainer: {
    alignSelf: 'flex-end',
    width: "50%"
  },
  otherMessageContainer: {
    alignSelf: 'flex-start',
    width: "50%"
  },
  messageBubble: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
    maxWidth: '100%',
  },
  myMessageBubble: {
    backgroundColor: secondary,
    borderBottomRightRadius: 4,
  },
  otherMessageBubble: {
    backgroundColor: "#111111",
    borderBottomLeftRadius: 4,
  },
  senderNameSkeleton: {
    height: 10,
    width: 60,
    backgroundColor: Gray,
    borderRadius: 4,
    marginBottom: 6,
  },
  textLineSkeleton: {
    height: 12,
    backgroundColor: Gray,
    borderRadius: 6,
    marginBottom: 6,
  },
  firstLine: {
    width: '75%',
  },
  secondLine: {
    width: '55%',
  },
});