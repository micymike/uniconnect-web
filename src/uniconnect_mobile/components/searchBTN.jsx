import { StyleSheet, Text, View,Dimensions, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import { Gray, secondary,silver } from '../utils/colors';
import { router } from 'expo-router';


const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const SearchBTN = ({placeholder = "Search here...", redirect}) => {
  return (
    <TouchableOpacity 
    onPress={() => {
      if (redirect) {
        router.push(redirect);
      }
    }}
    activeOpacity={0.7}
    style={{width: windowWidth *0.94,flexDirection: 'row',alignItems: 'center',backgroundColor:"#1a1a1a",marginVertical: 8,paddingVertical: 9,paddingHorizontal: 10,borderRadius: 10,borderWidth: 0.4,borderColor: "#2a2a2a"}}>
        <Ionicons name="search" size={16} color={silver} style={{ marginRight: 5,}} />
        <Text style={{color: silver,fontSize: 16,marginLeft: 12}}>{placeholder}</Text>
    </TouchableOpacity>
  )
}

export default SearchBTN

const styles = StyleSheet.create({})
