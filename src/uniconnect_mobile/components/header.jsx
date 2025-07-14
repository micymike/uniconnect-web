import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'; 
import { useRouter,router } from 'expo-router';
import { Gray, secondary } from '../utils/colors';

// Add onTitlePress prop
const Header = ({ title = "Comrades Hub", desc, showBackButton = false, onTitlePress = null , menu,style,showIcons = true,color = "#000", Size = 17,backPath = null,}) => {
  const router = useRouter();

  const handleBackPress = () => {
    if (backPath) {
    router.replace(backPath);
  } else if (router.canGoBack()) {
    router.back();
  } else {
    console.log("No back path or history to go back to.");
  }
  };

  const handleNotificationPress = () => {
    router.replace('/notifications');
  };


  return (
    <View style={[styles.headerContainer, style]}>
      <View style={styles.leftSection}>
        {menu && 
           <TouchableOpacity
           onPress={() => {
            router.replace("/rentals")
           }}
           style={{marginRight: 8}}
           >
             <Ionicons name='menu' size={21}/>
           </TouchableOpacity>
        }
        
        {showBackButton && (
          <TouchableOpacity activeOpacity={0.6} onPress={handleBackPress} style={{ paddingRight: 10, paddingVertical: 5,}}>
            <Ionicons name="arrow-back" size={18} color={color} />
          </TouchableOpacity>
         )}
        
         
        <View style={styles.titleContainer}>
             <Text style={[styles.headerTitle, { fontSize: Size, color }]} numberOfLines={1}>{title}</Text>
             {desc && (<Text style={styles.headerDesc}>{desc}</Text>)}
        </View>
         
      </View>
      <View style={styles.rightSection}>
        {/* Keep existing right icons */}
        {showIcons &&
        <>
        
        {/* <TouchableOpacity
          style={styles.iconButton}
          onPress={handleNotificationPress}
          activeOpacity={0.7}
        >
          <View style={styles.iconWrapper}>
            <Ionicons name="notifications-outline" size={20} color="#CBCED4" />
          </View>
        </TouchableOpacity> */}
        </>
        }
      </View>
    </View>
  )
}

export default Header

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'transparent',
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    paddingRight: 10,
    paddingVertical: 5,
  },
  titleContainer: {
    flexShrink: 1, // Allow title to shrink if needed
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontWeight: '600', 
    color: Gray,
    letterSpacing: 0.3,
  },
  headerDesc: { // Added style for description
    fontSize: 12,
    color: "#666",
  },
  iconButton: {
    marginLeft: 6,
    padding: 2,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  }
})
