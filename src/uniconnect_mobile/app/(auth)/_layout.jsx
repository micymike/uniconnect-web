import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const AuthLayout = () => {
  return (
    <View style={styles.container}>
    <Stack screenOptions={{
       headerShown: false ,
       cardStyle: { backgroundColor: '#000' },

    }} >
       <Stack.Screen 
       name="signin"
       options={{ headerShown: false,presentation: "modal" }}

      />
      <Stack.Screen 
       name="signup"
       options={{ headerShown: false }}
      />
      <Stack.Screen 
       name="selectaccount"
       options={{ headerShown: false }}
      /> 
      <Stack.Screen 
       name="forgotpassword"
       options={{ headerShown: false }}
      /> 
      <Stack.Screen 
       name="help"
       options={{ headerShown: false }}
      /> 
      <Stack.Screen 
       name="terms"
       options={{ headerShown: false }}
      /> 
       <Stack.Screen 
       name="privacy"
       options={{ headerShown: false }}
      /> 
      <Stack.Screen 
       name="privacynotificationsetting"
       options={{ headerShown: false }}
      />
      <Stack.Screen 
       name="subscription"
       options={{ headerShown: false }}
      />

      <Stack.Screen 
       name="referral"
       options={{ headerShown: false }}
      />
    </Stack>
    </View>
  )
}

export default AuthLayout

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', 
  },
})