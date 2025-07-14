// import { StyleSheet, Text, View,FlatList } from 'react-native'
// import { router, useLocalSearchParams } from 'expo-router'
// import { LinearGradient } from 'expo-linear-gradient';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { Ionicons } from '@expo/vector-icons';
// import { Primary, white, Gray, secondary, silver } from '../../utils/colors';
// import React, { useState, useEffect } from 'react';
// import Header from '../../components/header';
// import { fetchMarketProducts } from '../../lib/market/market';

// const Category = () => {
//   const { category } = useLocalSearchParams();
//   const [loading, setLoading] = useState(true);
//   const [marketData, setMarketData] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);



//   const loadProducts = async () => {
//       setLoading(true);
//     try{
//       const result = await fetchMarketProducts();
//       if (result.success) {
//         setMarketData(result.data);

//         const categoryData = result.data.find(
//           item => item.category.toLowerCase() === category?.toLowerCase()
//         );
        
//         if (categoryData) {
//           console.log("categoryData",categoryData.products)
//           setFilteredProducts(categoryData.products);
//         } else {
//           setFilteredProducts([]);
//           router.replace("/market")
//         }
//       }

//     }catch(error){
//       console.log("error",error)
//     }finally{
//       setLoading(false);
//     }    
//   };

//   useEffect(() => {
//       loadProducts();
//   }, []);

//   return (
//     <LinearGradient
//       colors={['#030406', '#000']}
//       start={{ x: 0, y: 0 }}
//       end={{ x: 0, y: 1 }}
//       style={{ flex: 1 }}
//     >
//       <SafeAreaView style={{ flex: 1 }}>
//         <Header title={category} color={white} Size={16} showIcons={false} showBackButton={true}  />
//         <View style={{ marginVertical: 8, width: '100%', flex: 1 }}>
//           <FlatList
//           data={filteredProducts}
//           keyExtractor={(item, index) => item.category + index}
//           renderItem={({ item }) => (
//              <View style={{ marginBottom: 10 }}>
//                 <View
//                   style={{
//                     paddingHorizontal: 5,
//                     flexDirection: 'row',
//                     justifyContent: 'space-between',
//                     alignItems: 'center',
//                     marginBottom: 2,
//                   }}
//                 >
//                   <Text style={{ fontSize: 15, fontWeight: '600', color: white }}>
//                     {item.category}
//                   </Text>
//                   <View
//                     style={{ flexDirection: 'row', alignItems: 'center',paddingVertical: 6,}}
//                   >
//                   <Text
//                     onPress={() =>
//                       router.push({
//                         pathname: '/category',
//                         params: { category: item.category },
//                       })
//                     }
//                     style={{ color: Primary }}
//                   >
//                     See more
//                   </Text>
//                   <Ionicons 
//                     name="chevron-forward" 
//                     size={12} 
//                     color={Primary} 
//                     style={{ marginLeft: 4 }} 
//                   />
//                   </View>
//                 </View>
//               </View>
//           )}
//           />

//         </View>
//       </SafeAreaView>
//     </LinearGradient>
//   )
// }

// export default Category

// const styles = StyleSheet.create({})

import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Primary, white, Gray, secondary, silver } from '../../utils/colors';
import React, { useState, useEffect } from 'react';
import Header from '../../components/header';
import { fetchMarketProducts } from '../../lib/market/market';

const Category = () => {
  const { category } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [marketData, setMarketData] = useState([]);
  const [groupedProducts, setGroupedProducts] = useState([]);
     
  const loadProducts = async () => {
    setLoading(true);
    try{
      const result = await fetchMarketProducts();
      if (result.success) {
        setMarketData(result.data);
         
        const categoryData = result.data.find(
          item => item.category.toLowerCase() === category?.toLowerCase()
        );
                 
        if (categoryData) {
          console.log("categoryData", categoryData.products);
          
          // Group products by subcategory
          const grouped = categoryData.products.reduce((acc, product) => {
            const subcategory = product.subcategory || 'Other';
            if (!acc[subcategory]) {
              acc[subcategory] = [];
            }
            // Limit to 5 products per subcategory
            if (acc[subcategory].length < 5) {
              acc[subcategory].push(product);
            }
            return acc;
          }, {});
          
          // Convert to array format for easier rendering
          const groupedArray = Object.keys(grouped).map(subcategory => ({
            subcategory,
            products: grouped[subcategory]
          }));
          
          setGroupedProducts(groupedArray);
        } else {
          setGroupedProducts([]);
          router.replace("/market")
        }
      }
     }catch(error){
      console.log("error", error)
    }finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const renderProductItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.horizontalProductCard}
      onPress={() => {
        // Navigate to product details
        router.push({
          pathname: '/product-details',
          params: { productId: item.id }
        })
      }}
    >
      <Image 
        source={{ uri: item.image }} 
        style={styles.horizontalProductImage}
        resizeMode="cover"
      />
      <View style={styles.horizontalProductInfo}>
        <Text style={styles.horizontalProductTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.horizontalProductPrice}>
          {item.price}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderSubcategorySection = ({ item }) => (
    <View style={styles.subcategorySection}>
      <View style={styles.subcategoryHeader}>
        <Text style={styles.subcategoryTitle}>
          {item.subcategory}
        </Text>
        <TouchableOpacity
          onPress={() => {
            // Navigate to subcategory with all products
            router.push({
              pathname: '/subcategory',
              params: { 
                category: category,
                subcategory: item.subcategory 
              }
            })
          }}
          style={styles.seeMoreButton}
        >
          <Text style={styles.seeMoreText}>See more</Text>
          <Ionicons
            name="chevron-forward"
            size={12}
            color={Primary}
            style={{ marginLeft: 4 }}
          />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={item.products}
        keyExtractor={(product) => product.id}
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
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalList}
        ItemSeparatorComponent={() => <View style={styles.horizontalSeparator} />}
      />
    </View>
  );

  return (
    <LinearGradient
      colors={['#030406', '#000']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <Header 
          title={category} 
          color={white} 
          Size={16} 
          showIcons={false} 
          showBackButton={true}  
          backPath="/market"
        />
        <View style={styles.container}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading products...</Text>
            </View>
          ) : (
            <FlatList
              data={groupedProducts}
              keyExtractor={(item) => item.subcategory}
              renderItem={renderSubcategorySection}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
              ItemSeparatorComponent={() => <View style={styles.sectionSeparator} />}
            />
          )}
        </View>
      </SafeAreaView>
    </LinearGradient>
  )
}

export default Category

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 8,
  },
  listContainer: {
    paddingBottom: 10,
  },
  subcategorySection: {
    paddingHorizontal: 16,
  },
  subcategoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  subcategoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: white,
  },
  seeMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
  },
  seeMoreText: {
    color: Primary,
    fontSize: 14,
  },
  horizontalList: {
    paddingLeft: 0,
  },
  horizontalProductCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 8,
    width: 140,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  horizontalProductImage: {
    width: '100%',
    height: 80,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 8,
  },
  horizontalProductInfo: {
    flex: 1,
  },
  horizontalProductTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: white,
    marginBottom: 4,
    lineHeight: 18,
  },
  horizontalProductPrice: {
    fontSize: 13,
    color: Primary,
    fontWeight: '600',
  },
  horizontalSeparator: {
    width: 12,
  },
  sectionSeparator: {
    height: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: white,
    fontSize: 16,
  },
})