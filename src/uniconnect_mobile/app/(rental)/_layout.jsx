import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const RentalLayout = () => {
  return (
    <View style={styles.container}>
    <Stack screenOptions={{
       headerShown: false ,
       cardStyle: { backgroundColor: '#fff' },

    }} >
      <Stack.Screen 
       name="rentalunitdetail"
       options={{ headerShown: false,}}

      />
      <Stack.Screen 
       name="createrental"
       options={{ headerShown: false,}}

      />
      <Stack.Screen 
       name="editproperty"
       options={{ headerShown: false,}}

      />
      <Stack.Screen 
       name="editunit"
       options={{ headerShown: false,}}
      /> 
      <Stack.Screen 
       name="createunit"
       options={{ headerShown: false,}}
      />
      <Stack.Screen 
       name="rentalsearch"
       options={{ headerShown: false,}}
      />

    </Stack>
    </View>
  )
}

export default RentalLayout

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', 
  },
})