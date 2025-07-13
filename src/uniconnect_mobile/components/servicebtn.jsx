import { StyleSheet, Text, View,Dimensions,TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Gray, Primary, white,silver, secondary } from '../utils/colors';

const windowWidth = Dimensions.get('window').width;

const Servicebtn = ({heading,desc,iconName,onPress,selected = false  }) => {
  return (
    <TouchableOpacity 
    onPress={onPress}
    activeOpacity={0.7}
    style={{flexDirection: "row",justifyContent: "space-evenly",alignItems: "center",marginVertical: 6,width: windowWidth * 0.83,borderColor:selected?'#f97316' : '#555',borderWidth: 0.9,paddingVertical: 16,borderRadius: 8,backgroundColor:selected? '#2a1205' : secondary}}>
        <View>
           <Ionicons name={iconName} size={20} color="#F07500" style={{padding: 12,borderRadius: 30}} />
        </View>
        <View>
         <Text style={{color: white,fontWeight: 500,fontSize: 14,paddingVertical: 3}}>{heading}</Text>
         <Text style={{color: silver,fontSize: 13}}>{desc}</Text>
        </View>
        <View>
          <Ionicons name="arrow-forward-outline" size={15} color="#F07500" />  
        </View>
    </TouchableOpacity>
  )
}

export default Servicebtn

const styles = StyleSheet.create({})