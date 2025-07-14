import { StyleSheet, View } from 'react-native'
import React from 'react'
import {Tabs}  from 'expo-router'
import {Primary,Gray,silver,white} from "../../utils/colors"


import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const TabsLayout = () => {
  return (
    <Tabs
    screenOptions={{
      headerShown: false,
      tabBarShowLabel: true,
      tabBarStyle: styles.tabBarStyle,
      tabBarActiveTintColor: white,
      tabBarLabelStyle: {
        marginTop: 2, 
        fontWeight: 500,
        fontSize: 11,
      },
    }}
    >
      
      <Tabs.Screen 
       name='rentals'
       options={{
        headerShown: false,
        title: 'Rentals',
        tabBarIcon: ({ color ,focused}) => {
          const isFocused = focused 

          const iconColor = isFocused ? white : silver;
          return (
            <View style={{ alignItems: 'center' }}>
              {isFocused && <View style={styles.dot} />}
              <MaterialIcons name="business" size={23} color={iconColor} style={{marginTop:4,}}/>
            </View>
          );
        },
       }}
      />
      <Tabs.Screen 
       name='market'
       options={{
        headerShown: false,
        title: 'Market',
        tabBarIcon: ({ color ,focused}) => {
          const isFocused = focused 

          const iconColor = isFocused ? white : silver;
          return (
            <View style={{ alignItems: 'center' }}>
              {isFocused && <View style={styles.dot} />}
              <Ionicons name="bag-check" size={22} color={iconColor} style={{marginTop:4,}}/>
            </View>
          );
        },
       }}
      />
      
      <Tabs.Screen 
       name='chat'
       options={{
        headerShown: false,
        title: 'Chats',
        tabBarIcon: ({ color ,focused}) => {
          const isFocused = focused 

          const iconColor = isFocused ? white : silver;
          return (
            <View style={{ alignItems: 'center' }}>
              {isFocused && <View style={styles.dot} />}
              <Ionicons name="chatbox-ellipses" size={22} color={iconColor} style={{marginTop:4,}}/>
            </View>
          );
        },
       }}
      />
      <Tabs.Screen 
       name='profile'
       options={{
        headerShown: false,
        title: 'Profile',
        tabBarIcon: ({ color ,focused}) => {
          const isFocused = focused 

          const iconColor = isFocused ? white : silver;
          return (
            <View style={{ alignItems: 'center' }}>
              {isFocused && <View style={styles.dot} />}
              <FontAwesome name="user" size={22} color={iconColor} style={{marginTop:4,}}/>
            </View>
          );
        },
       }}
      />
    </Tabs>
  )
}

export default TabsLayout

const styles = StyleSheet.create({
    tabBarStyle: {
        backgroundColor: "#000",
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
        height: 60,
        overflow: "hidden",
        paddingHorizontal: 8,
      },
      dot: {
        width: 16,
        height: 8,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
        backgroundColor: white,
        position: 'absolute',
        top: -9,
      },
})