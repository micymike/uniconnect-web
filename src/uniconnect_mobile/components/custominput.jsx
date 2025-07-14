import React, { useState,useEffect } from 'react';
import { StyleSheet, Text, View, TextInput,Dimensions ,TouchableOpacity,Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Gray,Primary } from '../utils/colors';
import { router } from 'expo-router';

const windowWidth = Dimensions.get('window').width;
const CustomInput = ({ label, placeholder, value, onChangeText, secureTextEntry = false,root,error,style}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = secureTextEntry;

  
  return (
    <View style={[styles.container,style]}>
      <View style={{display: "flex",justifyContent: "space-between",alignItems:"center",flexDirection: "row",marginBottom:4}}>
         {label && <Text style={styles.label}>{label} <Text style={{color: "#F07500"}}>*</Text></Text>}
         {root && 
         <TouchableOpacity activeOpacity={0.7} 
          onPress={() => {
            Linking.openURL("https://www.uniconnect.store/reset");
          }}
         >
          <Text style={{color: "#F07500",fontSize: 13,marginBottom: 4}}>Forgot password</Text>
         </TouchableOpacity>}
      </View>
      
      <View style={styles.inputWrapper}>

      <TextInput
        style={[
          styles.input,
          { borderColor: isFocused ? Primary : Gray }
        ]}
        placeholder={placeholder}
        placeholderTextColor="#999"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={isPassword && !showPassword}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />

        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(prev => !prev)}
            style={styles.eyeButton}
          >
              {showPassword ?
               <Ionicons name="eye-off-outline" size={17} color="#fff" /> : <Ionicons name="eye-outline" size={17} color="#fff" />}
          </TouchableOpacity>
        )}
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default CustomInput;

const styles = StyleSheet.create({
  container: {
    width: windowWidth * 0.8,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: '#788481',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#fff",
    backgroundColor: '#262626',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
  },
  eyeButton: {
    position: 'absolute',
    right: 10,
    top: 8,
  },
});