import { StyleSheet, Text, View, FlatList, Pressable , Dimensions} from 'react-native'
import React from 'react'
import { Primary, silver } from '../utils/colors';


const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const Helpcenterslider = ({ onTagSelect, activeTag,  }) => {
    const tags = [
        { id: '1', name: 'FAQ' },
        { id: '2', name: 'Contact Us' },
      ];

      const handleTagPress = (tagName, tagId) => {
        onTagSelect(tagName);
      };

      const RenderTags = ({ item }) => {
        const isActive = activeTag === item.name;
        return (
            <Pressable
            style={{
                marginHorizontal: "auto",
                width: windowWidth * 0.45,
                padding: 5,
                borderBottomWidth: isActive ? 2: 0,
                borderBottomColor: isActive ? Primary: "",
                borderRadius: 10
            }}
            onPress={() => handleTagPress(item.name, item.id)}
            >
                <Text
              style={{
                fontWeight: '600',
                fontSize: 16,
                textAlign: 'center',
                color:isActive ? Primary: silver,
              }}
            >
              {item.name}
            </Text>

            </Pressable>
        )
      }
  return (
    <View >
       <FlatList
        data={tags}
        renderItem={({ item }) => <RenderTags key={item.id} item={item} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{justifyContent: "space-evenly"}}
        style={{ width: windowWidth * 0.9,}}
      />
    </View>
  )
}

export default Helpcenterslider

const styles = StyleSheet.create({})