import { StyleSheet, Text, View ,Dimensions,Image,ScrollView} from 'react-native'
import React,{useRef, useState, useEffect} from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import { secondary, silver } from '../utils/colors';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const Productimg = ({price, title,uri,frontImage, backImage}) => {
    const [activeIndex, setActiveIndex] = useState(0); 
    const scrollViewRef = useRef(null);

    const listing = {
        images: [
          frontImage,
          backImage
        ],
      };

    useEffect(() => {
            const interval = setInterval(() => {
              const nextIndex = (activeIndex + 1) % listing.images.length; 
              setActiveIndex(nextIndex);
              scrollViewRef.current?.scrollTo({ x: nextIndex * windowWidth, animated: true });
            }, 3000); 
          
            return () => clearInterval(interval); 
    }, [activeIndex]);
  return (
    <View style={{ width: windowWidth, height : windowHeight * 0.34, justifyContent: "center", alignItems: "center",overflow: "hidden"}}>
            <View style={{ position: 'absolute',top: -70,width: '100%',height: 100,zIndex: 1,}}>
              <LinearGradient
                colors={['rgba(200, 200, 200, 0.8)', 'rgba(200, 200, 200, 0)']}
                style={{flex: 1,}}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
              />
            </View>
    
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
            contentContainerStyle={{alignItems: "center"}}
            >
                {listing.images.map((image, index) => (
                <Image key={index} 
                source={{ uri: image }}
                style={{ width: windowWidth,height: "100%",backgroundColor: secondary,}}
                resizeMode='contain'
                />
              ))}
    
            </ScrollView>
    
        
            <View style={{bottom: 19,position: "absolute",left: 15}}>
                <Text style={{color: "white",fontWeight: 600,fontSize: 14,backgroundColor: "#F07500",paddingVertical: 3,borderRadius: 9,textAlign: "center",width: 90}}>Ksh {price}</Text>
                <Text style={{color: "#fff",fontSize: 19,fontWeight: 500,marginVertical: 10,paddingLeft: 10}}>{title}</Text>
            </View>
    
            <View style={{ position: "absolute",bottom: 5,flexDirection: "row",alignSelf: "center",}}>
              {listing.images.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    index === activeIndex ? styles.activeDot : styles.inactiveDot,
                  ]}
                />
              ))}
            </View>
            
            <View style={{position: 'absolute',bottom: -10,width: '100%',height: 75,zIndex: 1,}}>
              <LinearGradient
                colors={['rgba(200, 200, 200, 0.8)', 'rgba(200, 200, 200, 0)']}
                style={{flex: 1}}
                start={{ x: 0, y: 1 }}
                end={{ x: 0, y: 0 }}
              />
            </View>
            
        </View>
  )
}

export default Productimg

const styles = StyleSheet.create({
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
      },
      activeDot: {
        backgroundColor: "#F07500",
      },
      inactiveDot: {
        backgroundColor: "#FFF",
      },
})