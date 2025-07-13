import React, { useState,useEffect } from 'react';
import { StyleSheet, Text, View, TextInput,Dimensions ,TouchableOpacity,} from 'react-native';
import { Red, Gray, Primary, white } from '../utils/colors';
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const Textarea = ({ label, placeholder, value, onChangeText,numberOfLines,error,style,maxWords = 50,}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  const handleTextChange = (text) => {
    const words = text.trim().split(/\s+/).filter(Boolean);
    if (words.length <= maxWords) {
      setWordCount(words.length);
      onChangeText(text);
    } else {
      const trimmedText = words.slice(0, maxWords).join(' ');
      setWordCount(maxWords);
      onChangeText(trimmedText);
    }
  };

  useEffect(() => {
    const words = value.trim().split(/\s+/).filter(Boolean);
    setWordCount(words.length);
  }, [value]);


 
  
  return (
    <View style={[styles.container,style]}>
      <View style={{display: "flex",flexDirection: "row",marginBottom:0}}>
         {label && <Text style={styles.label}>{label} <Text style={{color: "#F07500"}}>*</Text></Text>}
      </View>
      

      <TextInput
        style={[
          styles.input,
          { borderColor: isFocused ? Primary : Gray }
        ]}
        multiline={true} 
        textAlignVertical="top"
        numberOfLines={4} 
        placeholder={placeholder}
        placeholderTextColor="#999"
        value={value}
        onChangeText={handleTextChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {/* <View style={styles.footer}>
        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <Text style={{color:"white"}}>
            {maxWords - wordCount} words remaining
          </Text>
        )}
      </View> */}

  </View>
  );
};

export default Textarea;

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
    color: white,
    backgroundColor: '#262626',
    height: 100,
  },
  errorText: {
    color: Red,
    marginTop: 4,
    fontSize: 12,
  },
});
