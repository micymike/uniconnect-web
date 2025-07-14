import { StyleSheet, Text, View, TextInput,TouchableOpacity, FlatList, Image,Dimensions,ToastAndroid,RefreshControl } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Gray, Primary, secondary, silver, white } from '../../utils/colors'
import { router,useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import ProductTag from '../../components/productTag'
import { categories } from '../../lib/market/category'
import Entypo from '@expo/vector-icons/Entypo';
import Searchfilter from '../../components/searchfilter'
import { searchMarketplaceItems } from '../../lib/market/market'
import { fetchAllProducts } from '../../lib/market/market'
import { useToast } from "@/context/ToastProvider";
import { useAuthGuard } from '../../utils/useAuthGuard'


const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const Productsearch = () => {
    const inputRef = useRef(null);
    const {category} = useLocalSearchParams();
    const { showSuccess, showError } = useToast();
          const { isAuthenticated, checking } = useAuthGuard('/');
    

    const [refreshing, setRefreshing] = useState(false);
    const [allproducts, setAllproducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searched, setSearched] = useState(false);
    const [titletags, settitletags] = useState(null)
    const [selectedTag, setSelectedTag] = useState("");
    const [subcategories, setSubcategories] = useState([]);
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [selectedSubCategory,setSelectedSubCategory] = useState("")
    const [fetchingProducts, setFetchingProducts] = useState(false)

    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({ price: 0, location: 'All' });

    useEffect(() => {
        if(category){
            setSelectedTag(category)
        }else{
            setSelectedTag('Home & Living')
        }
    },[category])

    const loadData = async () => {
    setFetchingProducts(true)
    try {
        const productRes = await fetchAllProducts();
        
        if (productRes.success) {
            const availableProducts = productRes.data.filter(product => product.isAvailable === true);
            const unavailableProducts = productRes.data.filter(product => product.isAvailable !== true);
            
            const shuffledAvailable = [...availableProducts].sort(() => Math.random() - 0.5);
            const shuffledUnavailable = [...unavailableProducts].sort(() => Math.random() - 0.5);
            
            const finalProducts = [...shuffledAvailable, ...shuffledUnavailable];
            
            setAllproducts(finalProducts)
        }
    } catch (error) {
        console.error("check your connection, something went wrong will fetching products to search")
    } finally {
        setFetchingProducts(false)
        }
    }

    useEffect(() => {
        loadData();
    }, [])

    useEffect(() => {
        const categoryNames = categories.map((category) => ({
            title: category.name,
        }));
        settitletags(categoryNames);

    },[])

    const handleTagSelect = (tag) => {
        setSelectedTag(tag);

        const found = categories.find((category) => category.name === tag);
        setSubcategories(found?.subcategories || []);

    };

  useEffect(() => {
    if (selectedTag) {
        handleTagSelect(selectedTag) 
    }
}, [selectedTag]);

    const handleSearch = () => {
        if(searchQuery === ""){
            return
        }
        const results = allproducts.filter((item) => {
            const matchesQuery =
            searchQuery.trim() === '' ||
            item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.subcategory?.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesLocation =
            filters.location === 'All' ||
            item.location?.toLowerCase().includes(filters.location.toLowerCase());

            const matchesPrice =
            !filters.price || item.price <= filters.price;

            return matchesQuery && matchesLocation && matchesPrice;
        });

        if (!results || results.length === 0) {
            ToastAndroid.show("No results found", ToastAndroid.SHORT);
        }

        const shuffledResults = results.sort(() => Math.random() - 0.5);
        setSearchResults(shuffledResults);
    };
    
    const onRefresh = async () => {
        setRefreshing(true);
        handleSearch();
        setRefreshing(false);
    };

    const handleClear = () => {
        setSearchQuery('');
        setSearchResults([]);
        inputRef.current.focus();
    };

    const handleOverlayPress = () => {
        setDropdownVisible(false);
    };

    const handleApply = (appliedFilters) => {
        setFilters(appliedFilters);
        setDropdownVisible(false);
        ToastAndroid.show("Filters Applied", ToastAndroid.SHORT);
        setTimeout(() => {
            handleSearch(); 
        }, 0);
    };

     useEffect(() => {
        handleSearch();
    }, [filters, searchQuery]);

    useEffect(() => {
        if(searchQuery.trim() === ""){
            setSearchResults([]);
        }
    }, [searchQuery])

    useEffect(() => {
       setSearchQuery("")
        setSearchResults([]) 
    },[selectedTag])
    
  return (
     <LinearGradient
      colors={['#030406', '#000']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
        <SafeAreaView style={{ flex: 1,}}>
            <View style={{flexDirection: "row",alignItems: "center",justifyContent: "space-between", width: "100%",paddingHorizontal: 10,marginTop: 18,paddingVertical: 4,backgroundColor: ""}}>
                {isDropdownVisible && 
                <TouchableOpacity
                    style={styles.overlay}
                    activeOpacity={1}
                    onPress={handleOverlayPress}
                />
                }
                <TouchableOpacity
                    onPress={() => {
                    router.back();
                    }}
                    style={{ padding: 7, borderWidth: 0, borderColor: secondary, borderRadius: 24 }}
                >
                    <AntDesign name="arrowleft" size={18} color={white} />
                </TouchableOpacity>
                <View style={{flexDirection: 'row',alignItems: 'center',width: windowWidth * 0.83,height: 40,backgroundColor: secondary,borderRadius: 10,paddingHorizontal: 10,alignSelf: 'center',}}>
                    <Ionicons name="search" size={17} color={white} style={{ marginRight: 7,}} />
                    <TextInput
                    ref={inputRef}
                    style={{flex: 1,fontSize: 14,color: 'white',}}
                    placeholder="Search here..."
                    autoFocus={true}
                    returnKeyType="search"
                    onSubmitEditing={handleSearch}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && ( 
                        <TouchableOpacity 
                        activeOpacity={0.7}
                        onPress={handleClear} style={{marginHorizontal: 3,}}>
                            <Ionicons name="close-circle" size={16} color={white} />
                        </TouchableOpacity>
                    )}
                    <View style={{height: 17,width: 1,backgroundColor: Gray,marginHorizontal: 6}}/>
                    <TouchableOpacity
                    onPress={() => setDropdownVisible(!isDropdownVisible)}
                    activeOpacity={0.7}>
                        <Ionicons name="funnel-outline" size={17} color={white} />
                    </TouchableOpacity>

                    {isDropdownVisible && 
                     <>
                       
                        <View style={{position: "absolute",top: 46,right: windowWidth * 0.02,zIndex: 20, width: "75%"}}>
                            <Searchfilter
                             MIN_PRICE={0}
                            MAX_PRICE={20000}
                            onApply={handleApply}
                            filters={filters}
                            setFilters={setFilters}
                            />
                        </View>
                        
                     </>
                    }
                </View>

            </View>
             <View style={{ paddingVertical: 8,paddingHorizontal: 2}}>
                <ProductTag
                    data={titletags}
                     onTagSelect={handleTagSelect}
                    activeTag={selectedTag}
                />
             </View>
             {searchResults.length > 0 ? 
             (
              <>
              <View style={{ marginVertical: 4, marginHorizontal: 13,flex: 1 }}>
                <Text style={{ color: white, fontWeight: '600', fontSize: 14, marginVertical: 10 }}>Search Results</Text>
                <FlatList
                    data={searchResults}
                    numColumns={2}
                    keyExtractor={(item) => item.$id}
                    contentContainerStyle={{ paddingHorizontal: 5, }}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => {
                                router.push({
                                    pathname: '/singleproductdetails',
                                    params: { id: item.$id },
                                })
                            }}
                            activeOpacity={0.8}
                            style={{ 
                                flex: 1,
                                maxWidth: '50%',
                                paddingHorizontal: 5,
                                marginBottom: 10
                            }}
                        >
                            <View style={{ flex: 1 }}>
                                <Image
                                    source={
                                        item.frontImage
                                            ? { uri: item.frontImage }
                                            : require("../../assets/images/adaptive-icon.png")
                                    }
                                    style={{
                                        height: 140,
                                        width: '90%',
                                        borderRadius: 6,
                                        resizeMode: 'cover',
                                        backgroundColor: secondary,
                                    }}
                                />
                                <Text numberOfLines={1} style={{ color: white,fontWeight: 600 }}>
                                    {item.title}
                                </Text>
                                <Text style={{ color: '#F07500', fontWeight: '500', marginTop: 4 }}>
                                    {item.price}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    refreshControl={
                        <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={["#ffffff"]}                 
                        tintColor="#ffffff"                  
                        progressBackgroundColor="#262626"
                        />
                    }
                />
            </View>

              </>
              
            ): 
            (
             <View style={{marginVertical: 4,marginHorizontal: 13}}>
                <Text style={{color: white,fontWeight: 600,fontSize: 15,marginVertical: 10}}>Select Your Match</Text>

                 <FlatList
                    data={subcategories}
                    keyExtractor={(item, index) => index.toString()}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                    <TouchableOpacity
                    onPress={() =>{
                        setSearchQuery(item)
                        inputRef.current?.focus(); 
                    }}
                    activeOpacity={0.7}
                    style={{
                        paddingVertical: 6,
                        paddingHorizontal: 10,
                        borderRadius: 12,
                        marginBottom: 6,
                        flexDirection: "row"
                    }}>
                        <Entypo name="back-in-time" size={15} color={silver} />
                        <Text style={{ color:selectedSubCategory === item? white :silver, marginHorizontal: 10 }}>{item}</Text>
                    </TouchableOpacity>
                    )}
                />

             </View>
            )}

        </SafeAreaView>
    </LinearGradient>
  )
}

export default Productsearch

const styles = StyleSheet.create({
      overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    width: windowWidth,
    height: windowHeight,
    zIndex: 16,
  },
})