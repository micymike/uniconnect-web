import { StyleSheet, Text, View ,ScrollView,  Dimensions,
Image, TouchableOpacity} from 'react-native'
import React, { useRef, useState, useEffect } from 'react';
import { white, Primary,secondary, silver, Gray } from '../utils/colors';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

const Specialoffercarousel = () => {
    const carouselData = [
        { image: require('../assets/images/icon.png') },
        { image: require('../assets/images/icon.png') },
        { image: require('../assets/images/icon.png') },
      ];
    
      const scrollViewRef = useRef(null);
      const [activeIndex, setActiveIndex] = useState(0);
    
      useEffect(() => {
        const interval = setInterval(() => {
          const nextIndex = (activeIndex + 1) % carouselData.length;
          setActiveIndex(nextIndex);
    
          scrollViewRef.current?.scrollTo({
            x: nextIndex * windowWidth * 0.9,
            animated: true,
          });
        }, 4000);
    
        return () => clearInterval(interval);
      }, [activeIndex]);

      const handleScroll = (event) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / windowWidth);
        setActiveIndex(index);
      };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.carousel}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {carouselData.map((item, index) => (
          <View key={index} style={{width: windowWidth * 0.889,flex: 1,height: 140,backgroundColor: secondary,borderRadius: 16,margin: 2,flexDirection: "row",justifyContent: "space-between",overflow: "hidden"}}>
            <View style={{width: "60%",padding: 14}}>
              <View style={{padding:1, backgroundColor: white, width: "50%",alignItems: "center",justifyContent: "center",borderRadius: 12}}>
                <Text style={{color: "#242424",fontWeight: 500}}>Limited Time</Text>
              </View>
              <View style={{marginHorizontal: 10,marginTop: 14}}>
                <Text style={{color: white, fontWeight: '600', fontSize: 18, textAlign: "left",}}>Get Special Offer</Text>
              </View>
              <View style={{flexDirection: "row",justifyContent:"",alignItems: "center",marginHorizontal: 15,marginTop: 6}}>
                <Text style={{color: silver,fontWeight: 500,marginBottom: 15}}>Up To</Text>
                <Text style={{color: Primary, fontWeight: '700', fontSize: 24, textAlign: "left",marginLeft: 10}}>40%</Text>
                <Text style={{color: silver,fontWeight: 500,marginBottom: 15,marginLeft: 10}}>Off</Text>
              </View>
              <View style={{marginTop: 2}}>
                <TouchableOpacity 
                activeOpacity={0.7}
                style={{backgroundColor: Primary, borderRadius: 12,width:"45%",justifyContent: "center",alignItems: "center",padding: 4}}>
                  <Text style={{color:"white", fontWeight: 500}}>Order Now</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{backgroundColor: ""}}>
              <Image
               source={{uri: "https://images.unsplash.com/photo-1572978841127-8883b88e85c2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}}
               style={{width: 140, aspectRatio: 1, borderTopLeftRadius: 70,borderBottomLeftRadius: 70}}
               resizeMode='cover'
              />
            </View>
          </View>
        ))}
 

      </ScrollView>

      <View style={styles.dotsContainer}>
        {carouselData.map((item, index) => (
          <View
            key={index}
            style={[styles.dot, activeIndex === index && styles.activeDot]}
          />
        ))}
      </View>

    </View>
  )
}

export default Specialoffercarousel

const styles = StyleSheet.create({
  carousel: {
    backgroundColor: 'transparent',
    width: windowWidth * 0.9,
    alignSelf:"center"
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: silver,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: white,
  },
})