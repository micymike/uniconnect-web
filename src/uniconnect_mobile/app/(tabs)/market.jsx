import { StyleSheet, Text, View, FlatList, TouchableOpacity,Image,RefreshControl  } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/header';
import SearchBTN from '../../components/searchBTN';
import { Primary, white, Gray, secondary, silver } from '../../utils/colors';
import ProductTag from '../../components/productTag';
import { useRouter } from 'expo-router';
import MarketEmptyState from '../../components/MarketEmptyState';
import { Ionicons } from '@expo/vector-icons';
import { fetchMarketProducts } from '../../lib/market/market';
import { categories } from '../../lib/market/category';
import { useAuthGuard } from '../../utils/useAuthGuard';


const Market = () => {
  const router = useRouter();
  const [selectedTag, setSelectedTag] = useState('All Products');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [marketData, setMarketData] = useState([]);
  const [titletags, setTitletags] = useState([]);
  const { isAuthenticated, checking } = useAuthGuard('/');
  

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const loadProducts = async () => {
    const result = await fetchMarketProducts();
    if(!result.success){
      setMarketData([])
      return
    }
    if (result.success) {
      const shuffledData = result.data.sort(() => Math.random() - 0.5);
      
      const dataWithShuffledProducts = shuffledData.map(category => ({
        ...category,
        products: shuffleArray(category.products)
      }));
      
      setMarketData(dataWithShuffledProducts);
    } else {
      setMarketData([])
      console.error(result.message);
    }
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setSelectedTag('All Products'); 
    await loadProducts();
    setRefreshing(false);
  };

  useEffect(() => {
      loadProducts();
  }, []);

  useEffect(() => {
  const allCategories = categories.map(category => ({
    title: category.name
  }));
  
  const tagsWithAll = [
    { title: 'All Products' },
    ...allCategories
  ];
  
  setTitletags(tagsWithAll);
}, []);

  return (
    <LinearGradient
      colors={['#030406', '#000']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <Header title="Marketplace" color={white} Size={19}  />
        <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
          <SearchBTN placeholder="Search for a product here..." redirect="/productsearch"/>
        </View>

        <View style={{ marginVertical: 4, width: '100%' }}>
          <ProductTag
            data={titletags}
            onTagSelect={(tag) => {
              setSelectedTag(tag)
             
              if (tag === 'All Products') {
                loadProducts(); 
              } else {
                router.push({
                  pathname: '/productsearch',
                  params: { category: tag },
                });
              }
            }}
            activeTag={selectedTag}
          />
        </View>

        <View style={{ marginVertical: 8, width: '100%', flex: 1 }}>
          <FlatList
            data={marketData}
            keyExtractor={(item, index) => item.category + index}
             refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#ffffff"]}                 
                tintColor="#ffffff"                  
                progressBackgroundColor="#262626"
              />
            }
            renderItem={({ item }) => (
              <View style={{ marginBottom: 10 }}>
                <View
                  style={{
                    paddingHorizontal: 5,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 2,
                  }}
                >
                  <Text style={{ fontSize: 15, fontWeight: '600', color: white }}>
                    {item.category}
                  </Text>
                  <View
                   style={{ flexDirection: 'row', alignItems: 'center',paddingVertical: 6,}}
                  >
                  <Text
                    onPress={() =>
                      router.push({
                        pathname: '/productsearch',
                        params: { category: item.category },
                      })
                    }
                    style={{ color: Primary }}
                  >
                    See more
                  </Text>
                  <Ionicons 
                    name="chevron-forward" 
                    size={12} 
                    color={Primary} 
                    style={{ marginLeft: 4 }} 
                  />
                  </View>
                </View>
                <FlatList
                  data={item.products.slice(0, 15)}
                  horizontal
                  keyExtractor={(_, index) => index.toString()}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 10,marginTop: 5 }}
                  renderItem={({ item: product }) => (
                    <TouchableOpacity 
                    onPress={() => {
                      router.push({
                        pathname: '/singleproductdetails',
                        params: { id: product.id },
                      })
                    }}
                    activeOpacity={0.8} style={{ width: 130, marginRight: 10 }}>
                      <Image
                        source={
                          product.image
                            ? { uri: product.image }
                            : require("../../assets/images/adaptive-icon.png")
                        }
                        style={{
                          height: 100,
                          width: '100%',
                          borderRadius: 6,
                          resizeMode: 'cover',
                          backgroundColor: secondary,
                        }}
                      />
                      <Text numberOfLines={1} style={{ color: white }}>
                        {product.title}
                      </Text>
                      <Text style={{ color: '#F07500', fontWeight: '600',marginTop: 4 }}>{product.price}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}
            ListEmptyComponent={<MarketEmptyState /> }
            showsVerticalScrollIndicator={false}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default Market;

const styles = StyleSheet.create({});