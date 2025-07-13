import React, { useRef, useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Gray, secondary, silver } from '../utils/colors';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const DetailImage = ({ price, title,frontImage,backImage}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef(null);
   const images = [frontImage, backImage];

  useEffect(() => {
    if (!images.length) return;

    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % images.length;
      setActiveIndex(nextIndex);
      scrollViewRef.current?.scrollTo({
        x: nextIndex * windowWidth,
        animated: true,
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [activeIndex, images]);

  return (
    <View style={styles.container}>
      {/* Top fade gradient */}
      <LinearGradient
        colors={['rgba(200, 200, 200, 0.8)', 'rgba(200, 200, 200, 0)']}
        style={styles.topFade}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />

      {/* Image slider */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        onScroll={(event) => {
          const offsetX = event.nativeEvent.contentOffset.x;
          const index = Math.round(offsetX / windowWidth);
          setActiveIndex(index);
        }}
        scrollEventThrottle={16}
      >
        {images.length > 0 ? (
          images.map((image, index) => (
            <Image
              key={index}
              source={typeof image === 'string' ? { uri: image } : image}
              style={{width: windowWidth,height: windowHeight * 0.34,alignSelf: 'center',}}
              resizeMode="contain"
            />
          ))
        ) : (
          <View style={styles.placeholder}>
            <Text style={{color: silver}}>Loading Image...</Text>
          </View>
        )}
      </ScrollView>

      {/* Price and title */}
      <View style={styles.infoContainer}>
        <Text style={styles.price}>Ksh {price}/month</Text>
        <Text style={styles.title}>{title}</Text>
      </View>

      {/* Image dots */}
      <View style={styles.dotsContainer}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === activeIndex ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>

      {/* Bottom fade gradient */}
      <LinearGradient
        colors={['rgba(200, 200, 200, 0.8)', 'rgba(200, 200, 200, 0)']}
        style={styles.bottomFade}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
      />
    </View>
  );
};

export default DetailImage;

const styles = StyleSheet.create({
  container: {
    width: windowWidth,
    height: windowHeight * 0.34,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  topFade: {
    position: 'absolute',
    top: -70,
    width: '100%',
    height: 100,
    zIndex: 1,
  },
  image: {
    width: windowWidth,
    aspectRatio: 1,
    height: '100%',
    alignSelf: 'center',
  },
  placeholder: {
    width: windowWidth,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: secondary,
  },
  infoContainer: {
    position: 'absolute',
    bottom: 19,
    left: 15,
  },
  price: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
    backgroundColor: '#F07500',
    paddingVertical: 3,
    borderRadius: 9,
    textAlign: 'center',
    width: 110,
  },
  title: {
    color: '#fff',
    fontSize: 19,
    fontWeight: '500',
    marginVertical: 10,
    paddingLeft: 10,
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 5,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#F07500',
  },
  inactiveDot: {
    backgroundColor: '#FFF',
  },
  bottomFade: {
    position: 'absolute',
    bottom: -10,
    width: '100%',
    height: 75,
    zIndex: 1,
  },
});
