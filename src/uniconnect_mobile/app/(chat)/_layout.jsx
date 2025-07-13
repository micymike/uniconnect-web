import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const ChatLayout = () => {
  return (
    <View style={styles.container}>
    <Stack screenOptions={{
       headerShown: false ,
       cardStyle: { backgroundColor: '#fff' },

    }} >
       <Stack.Screen 
       name="chatroom"
       options={{ headerShown: false,}}

      />

    </Stack>
    </View>
  )
}

export default ChatLayout

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', 
  },
})