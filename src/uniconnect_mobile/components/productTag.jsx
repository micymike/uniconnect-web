import { StyleSheet, Text, View, FlatList, TouchableOpacity, Dimensions } from 'react-native'
import React, { useMemo } from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import { Gray, Primary, silver, white } from '../utils/colors';

const windowWidth = Dimensions.get('window').width;

const ProductTag = ({ onTagSelect, activeTag, data }) => {

    const handleTagPress = (tagName) => {
        onTagSelect(tagName);
    };

   const orderedData = useMemo(() => {
        const isAllTag = activeTag === 'All Products' || activeTag === 'All';
        
        if (!activeTag || isAllTag) {
            return data; 
        }
        
        const allProductsTag = data.find(item => item.title === 'All Products' || item.title === 'All');
        const selectedTagItem = data.find(item => item.title === activeTag);
        const otherTags = data.filter(item => 
            item.title !== 'All Products' && 
            item.title !== 'All' && 
            item.title !== activeTag
        );
        
        return [
            ...(allProductsTag ? [allProductsTag] : []), 
            ...(selectedTagItem ? [selectedTagItem] : []), 
            ...otherTags 
        ];
    }, [data, activeTag]);

    const RenderTextTags = ({ item }) => {
        const isActive = activeTag === item.title;
        return (
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleTagPress(item.title)}
                style={{
                    width: "auto",
                    backgroundColor: "transparent",
                    marginRight: 3,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingVertical: 2,
                    paddingHorizontal: 5,
                    borderRadius: 10,
                    borderColor: isActive ? white : Gray,
                    borderWidth: isActive ? 1 : 0.9,
                    marginHorizontal: 2
                }}>
                <Text style={{
                    padding: 3,
                    fontWeight: isActive ? 500 : 400,
                    color: isActive ? white : silver
                }}>{item.title}</Text>
            </TouchableOpacity>
        )
    }

    return (
        <View style={{ marginVertical: 2 }}>
            <FlatList
                data={orderedData}
                renderItem={({ item }) => {
                    return (
                        <>
                            <RenderTextTags key={item.id} item={item} />
                        </>
                    )
                }}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ justifyContent: "space-between", alignItems: "center" }}
                style={{ width: windowWidth * 0.98, paddingHorizontal: 0, marginHorizontal: 5 }}
            />
        </View>
    )
}

export default ProductTag