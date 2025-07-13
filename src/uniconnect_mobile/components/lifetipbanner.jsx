import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const Lifetips = () => {
  const tips = [
  {
    title: "Find Vacant Places Fast",
    message: "Skip the hassle — explore available rentals nearby and check prices instantly.",
    image: require("../assets/lifetips/3d-map.png"),
  },
  {
    title: "Buy With Confidence",
    message: "Browse items from real students, check prices, and buy directly from trusted sellers.",
    image: require("../assets/lifetips/buy.png"),
  },
  {
    title: "Contact Landlords Easily",
    message: "See landlord contact details for any rental listing — no middlemen, no hassle.",
    image: require("../assets/lifetips/contact.png"),
  },
  {
    title: "Sell What You Don’t Need",
    message: "Post your unused items for sale and earn money from fellow students nearby.",
    image: require("../assets/lifetips/sell.png"),
  },
  {
    title: "Get Items Delivered",
    message: "Enjoy delivery options for products or rentals — no need to carry heavy stuff across campus.",
    image: require("../assets/lifetips/box-truck.png"),
  },
];


  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % tips.length);
    }, 8000); // 8 seconds interval

    return () => clearInterval(interval);
  }, []);

  const currentTip = tips[currentTipIndex];

  return (
    <LinearGradient
      colors={['#F07500', '#FF8C42', '#F07500']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.bannerContainer}
    >
      <View style={styles.contentContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{currentTip.title}</Text>

          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
            <Text style={styles.subtitle}>{currentTip.message}</Text>

            <View style={styles.imageWrapper}>
              <Image
                source={currentTip.image}
                style={{ width: 60, height: 60 }}
                resizeMode="contain"
              />
            </View>
          </View>
        </View>
      </View>

      <View style={styles.decorativeCircle1} />
      <View style={styles.decorativeCircle2} />
      <View style={styles.decorativeCircle3} />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#F07500',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    position: 'relative',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    position: 'relative',
    zIndex: 3,
  },
  textContainer: {
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.95,
    lineHeight: 22,
    maxWidth: "60%",
  },
  decorativeCircle1: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    zIndex: 2,
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: -20,
    left: -20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    zIndex: 2,
  },
  decorativeCircle3: {
    position: 'absolute',
    top: '50%',
    right: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    zIndex: 2,
  },
});

export default Lifetips;
