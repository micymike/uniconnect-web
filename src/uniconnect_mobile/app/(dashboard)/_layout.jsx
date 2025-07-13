import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const DashboardLayout = () => {
  return (
    <View style={styles.container}>
    <Stack screenOptions={{
       headerShown: false ,
       cardStyle: { backgroundColor: '#fff' },

    }} >
       <Stack.Screen 
       name="dashindex"
       options={{ headerShown: false,presentation: "modal" }}
      />
      <Stack.Screen 
       name="createbusiness"
       options={{ headerShown: false,presentation: "modal" }}
      />
      <Stack.Screen 
       name="editbusiness"
       options={{ headerShown: false,presentation: "modal" }}
      />
    </Stack>
    </View>
  )
}

export default DashboardLayout

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', 
  },
})