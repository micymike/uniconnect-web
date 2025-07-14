import { StyleSheet, Text, View ,Dimensions,ScrollView, TouchableOpacity,Image,ActivityIndicator } from 'react-native'
import React, {useState,useEffect} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import Header from '../../components/header'
import Productimg from '../../components/productimg'
import Ionicons from '@expo/vector-icons/Ionicons';
import Contactcard from '../../components/contactcard'
import AntDesign from '@expo/vector-icons/AntDesign';
import { useLocalSearchParams } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { Gray, secondary, silver, white } from '../../utils/colors'
import { router } from 'expo-router'
import { useToast } from "@/context/ToastProvider";
import { getProductById, getMarketplaceItemsByCategory, getRandomMarketplaceItems } from '../../lib/market/market'
import { getBusinessByID } from '../../lib/business/business'
import FeaturedEmptyState from '../../components/featuredproductempty'
import { useAuthGuard } from '../../utils/useAuthGuard'


const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const Singleproductdetails = () => {
      const {id} = useLocalSearchParams()
      const { showSuccess, showError } = useToast();
      const [productData, setProductData] = useState([]);
      const [businessData, setBusinessData] = useState(null);
      const [featuredProducts,setFeaturedProducts] = useState(null)
      const [loading, setLoading] = useState(true);
            const { isAuthenticated, checking } = useAuthGuard('/');
      

      const [isfetching, setisfetching] = useState(false)
      
      useEffect(() => {
        if(!id || id == null){
          showError("Oops! Something went wrong. Please try again or go back.")
          router.back();
        }else{
          // console.log(id)
          singeProduct(id)
        }
      },[id])

      const singeProduct = async () => {
        setisfetching(true)
        try{
          const result = await getProductById(id);

          if (!result.success) {
            showError("Failed to get product details, check your connection and try again");
            router.back()
            return;
          }

          setProductData(result.result)

           const businessId = result.result.businessId;
            if (!businessId) {
              showError("This product doesn't have a valid business attached.");
              return;
            }else{
              const businessResponse = await getBusinessByID(businessId);
              
               if (!businessResponse.success) {
                  showError(businessResponse.message);
                  return;
                }

                setBusinessData(businessResponse.result)
            }
        }catch(error){
          showError(result.message)

        }finally{
          setisfetching(false)
        }
      }

      useEffect(() => {
        const fetchSimilarOrFallbackItems = async () => {
          if (!productData) return;

          const { category, $id } = productData;

          setLoading(true);

          const similarResult = await getMarketplaceItemsByCategory(category, $id);

          if (similarResult.success && similarResult.result.length > 0) {
            setFeaturedProducts(similarResult.result);
          } else {
            const fallbackResult = await getRandomMarketplaceItems($id);
            if (fallbackResult.success) {
              setFeaturedProducts(fallbackResult.result);
            } else {
              setFeaturedProducts([]); 
            }
          }
           setLoading(false);
        };

        fetchSimilarOrFallbackItems();
      }, [productData]); 

    const [isExpanded, setIsExpanded] = useState(false);
    const maxLength = 200;

    const truncatedText = productData?.description?.length > maxLength ? productData?.description.slice(0, maxLength) + '...' : productData?.description;

  return (
    <LinearGradient
      colors={['#030406', '#000']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
    <SafeAreaView style={{ flex: 1,  }}>
       <Header 
       showBackButton={true}
       title="Product Details"
       color={white} 
       Size={15}
      backPath="/market"
       />
       <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} >
          <Productimg price={productData?.price} title={productData?.title} frontImage={productData?.frontImage} backImage={productData?.backImage}/>

          <View  style={{width: windowWidth,justifyContent: "space-evenly",flexDirection: "column",padding: 12}}>
                  <View style={{flexDirection: "row",alignItems: "center"}}>
                    <Ionicons name="location-outline" size={16} color="grey" style={{marginTop:1,marginHorizontal: 6}}/>
                    <Text numberOfLines={2} style={{fontSize: 14,color: "grey",lineHeight: 22,}}>{productData?.location}</Text>
                  </View>
                  
                  <View style={{flexDirection: "row",alignItems: "center",padding: 3,marginTop: 5}}>
                     <Ionicons name="bag-check-outline" size={16} color="grey" style={{marginLeft:4,}}/>
                     <Text style={{color: "grey",marginLeft: 3,fontSize: 14,marginLeft: 8,lineHeight: 22,}}>{productData?.isAvailable ? "In stock": "Out Of Stock" }</Text>
                  </View>
                  <View style={{flexDirection: "row",alignItems: "center",padding: 3,marginTop: 3}}>
                     <AntDesign name="tago" size={16} color="grey" style={{marginLeft:4,}} />
                     <Text style={{color: "grey",marginLeft: 3,fontSize: 14,marginLeft: 8,lineHeight: 22,}}>{productData?.category}. {productData?.subcategory}</Text>
                  </View>
                  <View style={{flexDirection: "row",alignItems: "center",padding: 3,marginTop: 3}}>
                     <AntDesign name="check" size={16} color="grey" style={{marginLeft:4,}} />
                     <Text style={{color: "#F07500",marginLeft: 3,fontSize: 14,marginLeft: 8,lineHeight: 22,}}>{productData?.condition}</Text>
                  </View>
          </View>

            <View style={{ flex: 1,padding: 16,}}>
               <Text style={{fontSize: 16,fontWeight:500,color: white}}>Description</Text>
              
                      <Text style={{fontSize: 14,color: Gray,marginTop: 7,lineHeight: 22,}}>
                      {isExpanded ? productData?.description : truncatedText}
                    </Text>
                    {productData?.description?.length > maxLength && (
                      <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
                        <Text style={{color: "#F07500",marginTop: 4,fontWeight: 500,alignSelf: "flex-end"}}>
                          {isExpanded ? 'Show Less' : 'Show More'}
                        </Text>
                      </TouchableOpacity>
                    )}

                  <Text style={{fontSize: 16,fontWeight:500,color: white,marginVertical: 10}}>Contact Supplier</Text>


                  <View style={{marginVertical: 8,padding: 5,alignItems: 'center',borderColor: secondary,borderWidth: 1,borderRadius: 10,}}>
                      <Contactcard name={businessData?.name} type="supplier" phoneNumber={productData?.contactPhone} ownerId={productData?.userId}/>
                  </View>

                  <Text style={{fontSize: 16,fontWeight:500,color: white,marginVertical:3}}>Similar Items</Text>

              
                    <View style={{ marginTop: 10 }}>
                {loading ? (
                  <FeaturedEmptyState />
                ) : (
                  featuredProducts.length > 0 && (
                    <>

                      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 0 }}>
                        {featuredProducts?.map((item) => (
                          <TouchableOpacity
                          onPress={() => {
                            router.push({
                              pathname: '/singleproductdetails',
                              params: { id: item.$id },
                            })
                          }}
                          activeOpacity={0.7}
                            key={item.$id} 
                            style={{ width: 140, marginRight: 10 }}>
                              <Image
                              source={
                              item.frontImage
                                ? { uri: item.frontImage }
                                : require("../../assets/images/adaptive-icon.png")
                              }
                              style={{ height: 100, backgroundColor: secondary, borderRadius: 10 }}
                              />
                            <Text numberOfLines={1} style={{color: white}}>{item.title}</Text>
                            <Text style={{ color: '#F07500', fontWeight: '600' }}>{item.price}</Text>
                          </TouchableOpacity>
                          ))}
                        </ScrollView>
                    </>
                  )
                )}
              </View>

            </View>

       </ScrollView>
       {isfetching && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingBox}>
            <ActivityIndicator size={22} color={white} />
            <Text style={{ marginTop: 10, color: white }}>Loading product...</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
    </LinearGradient>
  )
}

export default Singleproductdetails

const styles = StyleSheet.create({
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
loadingBox: {
  backgroundColor: secondary,
  padding: 20,
  borderRadius: 10,
  alignItems: 'center',
  justifyContent: 'center',
  elevation: 5,
},
})