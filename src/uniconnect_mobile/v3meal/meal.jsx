// import { StyleSheet, Text, View ,FlatList,TouchableOpacity,Image} from 'react-native'
// import React, {useState,useEffect} from 'react'
// import { LinearGradient } from 'expo-linear-gradient';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import Header from '../../components/header';
// import SearchBTN from '../../components/searchBTN';
// import { Primary, white, Gray, secondary, silver } from '../../utils/colors';
// import Specialoffercarousel from '../../components/Specialoffercarousel';
// import { Ionicons } from '@expo/vector-icons';
// import { router } from 'expo-router';
// import { fetchMeals,fetchBusinessById } from '../../lib/meals/meals';

// const Meal = () => {
//   const [mealData, setMealData] = useState([])
//   const [loading, setLoading] = useState(true);

//   const loadMeal = async () => {
//       setLoading(true);
//       try {
//         const res = await fetchMeals();

//         if(res.success){
//           const meals = res.data;

//           const grouped = meals.reduce((acc, item) => {
//             const category = item.isPoolable ? "Poolable Meals" : "Other Meals";
//             if (!acc[category]) acc[category] = [];
//             acc[category].push(item);
//             return acc;
//           }, {});

//           const formatted = Object.entries(grouped).map(([category, meals]) => ({
//             category,
//             meals,
//           }));

//           setMealData(formatted);
       
//         } else {
//           console.error("Error loading Meal:", res.message);
//         }
//       } catch (err) {
//         console.error("Error fetching Meal:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     useEffect(() => {
//       loadMeal()
//     }, [])


//   return (
//     <LinearGradient
//       colors={['#030406', '#000']}
//       start={{ x: 0, y: 0 }}
//       end={{ x: 0, y: 1 }}
//       style={{ flex: 1 }}
//     >
//       <SafeAreaView style={{ flex: 1 }}>
//         <Header title="Meals" color={white} Size={19} />
//         <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
//           <SearchBTN placeholder="Search for a meal here..." />
//         </View>
//         <View style={{ marginVertical: 4, width: '100%',justifyContent: "center" }}>
//           <Specialoffercarousel 
//           />
//         </View>
//         <View style={{ marginVertical: 8, width: '100%', flex: 1 }}>
//           <FlatList
//           data={mealData}
//           keyExtractor={(item, index) => item.category + index}
//           showsVerticalScrollIndicator={false}
//           showsHorizontalScrollIndicator={false}
//           renderItem={({ item }) => (
//             <View style={{ marginBottom: 10 }}>
//               <View
//                 style={{
//                 paddingHorizontal: 15,
//                   flexDirection: 'row',
//                   justifyContent: 'space-between',
//                   alignItems: 'center',
//                   marginBottom: 2,
//                 }}
//                 >
//                 <Text style={{ fontSize: 18, fontWeight: '600', color: white }}>
//                   {item.category}
//                 </Text>
                
//                   <View>
//                     <Ionicons onPress={() =>
//                     router.push({
//                       pathname: '/category',
//                       params: { category: item.category },
//                     })
//                   } name="arrow-forward" size={15} color={white}  style={{padding: 5,borderRadius: 22,backgroundColor: secondary,}}/>
//                   </View>
//               </View>
//               <FlatList
//                 data={item.meals.slice(0, 5)}
//                 horizontal
//                 keyExtractor={(_, index) => index.toString()}
//                 showsHorizontalScrollIndicator={false}
//                 contentContainerStyle={{ paddingHorizontal: 10 }}
//                 renderItem={({ item: product }) => (
//                   <TouchableOpacity activeOpacity={0.7} style={{ width: 170, marginRight: 10 }}>
//                     <Image
//                       source={
//                         product.image
//                           ? { uri: product.image }
//                           : require("../../assets/images/adaptive-icon.png")
//                       }
//                       style={{
//                         height: 100,
//                         width: '100%',
//                         borderRadius: 10,
//                         resizeMode: 'cover',
//                         backgroundColor: secondary,
//                       }}
//                     />
//                     <View style={{flexDirection: "row",justifyContent:"space-between",alignItems: "center"}}>                    
//                       <Text numberOfLines={1} style={{ color: white,fontWeight: 500,fontSize: 15,maxWidth: "70%" }}>
//                         {product.title}
//                       </Text>
//                       <Text style={{ color: '#F07500', fontWeight: '600',}}>{product.price}</Text>
//                     </View>
//                     <View style={{flexDirection: "row",alignItems:"center"}}>
//                       <Ionicons name="star" size={10} color="gold" />
//                       <Text numberOfLines={1} style={{ color: silver, }}>
//                         {product.rate} <Text onPress={() => {console.log("by pressed")}} style={{textDecorationLine:"underline",color:Primary}}>{product.by}</Text>
//                       </Text>
//                     </View>
                    
                    
//                   </TouchableOpacity>
//                 )}
//               />

//             </View>
//           )}
//           />
//         </View>
//        </SafeAreaView>
//     </LinearGradient>
//   )
// }

// export default Meal

// const styles = StyleSheet.create({})