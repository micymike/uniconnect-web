import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const MarketLayout = () => {
  return (
    <View style={styles.container}>
    <Stack screenOptions={{
       headerShown: false ,
       cardStyle: { backgroundColor: '#000' },

    }} >
      <Stack.Screen 
       name="createproduct"
       options={{ headerShown: false }}
      />


      <Stack.Screen 
       name="productsearch"
       options={{ headerShown: false }}
      />

      <Stack.Screen 
       name="singleproductdetails"
       options={{ headerShown: false }}
      />

      <Stack.Screen 
       name="category"
       options={{ headerShown: false }}
      />
      
      <Stack.Screen 
       name="editproduct"
       options={{ headerShown: false }}
      />
    </Stack>
    </View>
  )
}

export default MarketLayout

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', 
  },
})