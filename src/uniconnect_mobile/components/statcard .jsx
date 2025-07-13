import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Primary } from '../utils/colors'

const Statcard  = ({ label, value }) => {
  return (
    <View style={{backgroundColor: '#0F172A',borderRadius: 10,padding: 10,width: '48%',marginBottom: 10,borderLeftWidth: 4,borderLeftColor: Primary,}}>
      <Text style={{ color: '#aaa',fontSize: 14,marginBottom: 8,}}>{label}</Text>
      <Text style={{color: 'white',fontSize: 16,fontWeight: 600,}}>{value}</Text>
    </View>
  )
}

export default Statcard 

const styles = StyleSheet.create({})