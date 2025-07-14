import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const CreateBusinessBanner = ({ onCreatePress }) => {
  const messages = [
    "Create your business profile and start offering rentals or marketplace services",
    "Promote your rental or product listings and reach students across campus",
    "Unlock your business potential and manage everything in one simple dashboard",
  ];

  const titles = [
    "Start Your Business Journey",
    "Expand Your Campus Enterprise",
    "Set Up and Start Selling Fast",
  ];

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [randomIcons, setRandomIcons] = useState([]);

  const allIcons = ['📦', '🏠', '💼',];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const selected = allIcons.sort(() => 0.5 - Math.random()).slice(0, 3);
    setRandomIcons(selected);
  }, []);

  return (
    <LinearGradient
      colors={['#F07500', '#FF8C42', '#F07500']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.bannerContainer}
    >

      <View style={styles.contentContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{titles[currentMessageIndex]}</Text>

          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
            <Text style={styles.subtitle}>{messages[currentMessageIndex]}</Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.createButton}
                onPress={onCreatePress}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#FFFFFF', '#F8F8F8']}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.buttonText}>Create Business</Text>
                </LinearGradient>
              </TouchableOpacity>
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
  createButton: {
    alignSelf: 'flex-end',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F07500',
    marginRight: 8,
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
  buttonContainer: {
    alignItems: 'flex-end',
  },
  iconsContainer: {
    position: 'absolute',
    top: 15,
    right: 20,
    flexDirection: 'row',
    zIndex: 4,
    gap: 8,
  },
  topIcon: {
    fontSize: 18,
    opacity: 0.7,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  randomIcon: {
    position: 'absolute',
    opacity: 0.7, 
    zIndex: 1, 
    color: 'rgba(255, 255, 255, 0.8)', 
  },
});

export default CreateBusinessBanner;