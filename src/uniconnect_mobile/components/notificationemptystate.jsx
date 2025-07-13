import { StyleSheet, Text, View , Dimensions } from 'react-native'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { Animated, Easing } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const AnimatedLG = Animated.createAnimatedComponent(LinearGradient);
const Notificationemptystate = () => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
      Animated.loop(
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 800,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    }, []);
  
    const translateX = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [-windowWidth, windowWidth],
    });
  
    const renderShimmer = () => (
      <AnimatedLG
        colors={['#464646', '#5A5A5A', '#464646']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[StyleSheet.absoluteFill, { transform: [{ translateX }],overflow: "hidden" }]}
      />
    );
  return (
    <View>
      <Text>Notificationemptystate</Text>
    </View>
  )
}

export default Notificationemptystate

const styles = StyleSheet.create({})