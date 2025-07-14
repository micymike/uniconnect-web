import { StyleSheet, Text, View, TextInput,TouchableOpacity, FlatList, Image,Dimensions,KeyboardAvoidingView, Platform,ToastAndroid,ActivityIndicator  } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Gray, Primary, secondary, silver, white } from '../../utils/colors'
import { router,useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import Searchfilter from '../../components/searchfilter'
import Entypo from '@expo/vector-icons/Entypo';
import { fetchRentals,fetchAllUnits } from '../../lib/rentals/rental';
import EmptyState from '../../components/emptystate'
import { useAuthGuard } from '../../utils/useAuthGuard'


const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const Rentalsearch = () => {
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const inputRef = useRef(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({ price: 0, location: 'All' });
    const [searchResults, setSearchResults] = useState([]);
    const [rentalUnits, setRentalUnits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [promotedData, setpromotedData] = useState([]);
    const { isAuthenticated, checking } = useAuthGuard('/');


    const loadData = async () => {
        setLoading(true);
        try {
        const [rentalRes, unitsRes] = await Promise.all([
            fetchRentals(),
            fetchAllUnits()
        ]);

        if (rentalRes.success && unitsRes.success) {
            const verifiedProperties = rentalRes.data
            .filter(({ property }) => property.isVerified === true)
            .map(({ property }) => ({
              ...property,
              images: JSON.parse(property.images || "[]")
            }));

            const verifiedPropertyIds = verifiedProperties.map(prop => prop.$id);
            const verifiedUnits = unitsRes.data.filter(unit => 
                verifiedPropertyIds.includes(unit.propertyId)
            );

            const combined = verifiedUnits.map(unit => {
                const parentProperty = verifiedProperties.find(prop => prop.$id === unit.propertyId);
                return {
                ...unit,
                property: parentProperty || {}
                };
            });
        
             const promoted = combined.filter(item => item.property?.isPromoted === true);

             const shuffled = promoted.sort(() => 0.5 - Math.random());

             const top3Promoted = shuffled.slice(0, 3);

            setRentalUnits(combined);
            setpromotedData(top3Promoted);

        }
        } catch (err) {
        console.error("Error loading rental data:", err);
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);


    
    
    
    const popularSearches = [
        {$id: 1,name: "bed sitter"},
        {$id: 2, name:"one bedroom"},
        {$id: 3,name: "single room"},
        {$id: 4,name: "double room"},
    ]
    

    const handleOverlayPress = () => {
        setDropdownVisible(false);
    };

        const handleClear = () => {
            setSearchQuery('');
            setSearchResults([]);
            inputRef.current.focus();
        };
    

        const handleSearch = () => {

            if(searchQuery === ""){
                return
            }
            const results = rentalUnits.filter((item) => {
                const matchesQuery =
                searchQuery.trim() === '' ||
                item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.type?.toLowerCase().includes(searchQuery.toLowerCase());

                const matchesLocation =
                filters.location === 'All' ||
                item.property?.location?.toLowerCase().includes(filters.location.toLowerCase());

                const matchesPrice =
                !filters.price || item.price <= filters.price;

                return matchesQuery && matchesLocation && matchesPrice;
            });

            if (!results || results.length === 0) {
                ToastAndroid.show("No results found", ToastAndroid.SHORT);
            }

             const shuffledResults = results.sort(() => 0.5 - Math.random());

            setSearchResults(shuffledResults);

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


  return (
    <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
        <SafeAreaView style={{flex: 1,backgroundColor: "#000"}}>
            <View style={{flexDirection: "row",alignItems: "center",justifyContent: "space-between", width: "100%",paddingHorizontal: 10,marginTop: 18,paddingVertical: 4,backgroundColor: ""}}>
                {isDropdownVisible && 
                <TouchableOpacity
                    style={{ position: 'absolute',top: 0,left: 0,right: 0,bottom: 0,backgroundColor: 'rgba(0,0,0,0.4)',width: windowWidth,height: windowHeight,zIndex: 16,}}
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
                {searchResults.length > 0 ? (
                <View style={{ marginHorizontal: 13 }}>
                    <Text style={{ color: white, fontWeight: '600', fontSize: 14, marginVertical: 10 }}>
                    Search Results
                    </Text>
                <FlatList
                    data={searchResults}
                    keyExtractor={(item) => item.$id}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => {
                            router.push({
                                pathname: '/rentalunitdetail',
                                params: { unitId: item.$id  }
                            });
                        }}
                        activeOpacity={0.7}
                        style={{
                        paddingVertical: 6,
                        paddingHorizontal: 10,
                        borderRadius: 12,
                        marginBottom: 6,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between"
                        }}
                    >
                        <View style={{ backgroundColor: secondary, width: 80, height: 80, borderRadius: 8, overflow: "hidden" }}>
                        <Image
                            source={{uri: item.property?.frontImage}}
                            style={{ width: "100%", height: "100%" }}
                        />
                        </View>
                        <View style={{ width: "70%", height: 80, paddingVertical: 5, justifyContent: "space-between" }}>
                        <View>
                            <Text style={{ fontWeight: 500, color: white }}>{item.property?.title}</Text>
                            <View style={{flexDirection:"row", alignItems: "center",marginVertical: 3}}>
                                    <Ionicons name="location-outline" size={13} color={Gray} style={{marginLeft:4,}}/>
                                    <Text style={{ color:silver, marginHorizontal: 3,fontSize: 12 }}>{item.property?.location || "Egerton University"}</Text>
                                </View>
                                <View style={{flexDirection: "row",alignItems: "center",marginVertical: 2}}>
                                    
                                    {item.isFurnished && (
                                        <Text style={{backgroundColor: "#2a1205",padding:2,color: Primary,borderRadius: 8,paddingHorizontal: 12,fontSize: 11,marginHorizontal: 2}}>Furnished</Text>
                                    )}
                                    {item.vacancyStatus && (
                                        <Text style={{backgroundColor: "#2a1205",padding:2,color: Primary,borderRadius: 8,paddingHorizontal: 12,fontSize: 11,marginHorizontal: 2}}>Vacant</Text>
                                    )}
                                </View>
                        </View>

                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Ionicons name="bed" size={13} color={Gray} style={{ marginLeft: 4 }} />
                            <Text style={{ color: silver, marginHorizontal: 3 }}>{item?.type || "N/A"}</Text>
                            </View>
                            <Text style={{ color: Primary, marginHorizontal: 3, fontWeight: 600 }}>Ksh. {item?.price || "N/A"}</Text>
                        </View>
                        </View>
                    </TouchableOpacity>
                    )}
                    ListEmptyComponent={
                    <View style={{ alignItems: 'center', marginTop: 30 }}>
                        <Ionicons name="search-outline" size={40} color={Gray} />
                        <Text style={{ color: silver, fontSize: 15, marginTop: 10 }}>
                        No results found
                        </Text>
                        <Text
                        style={{
                            color: Gray,
                            fontSize: 13,
                            textAlign: 'center',
                            marginTop: 6,
                            paddingHorizontal: 30,
                        }}
                        >
                        Try adjusting your search or filters to find what you're looking for.
                        </Text>
                    </View>
                    }
                />
            </View>
                ) : (
                <>
                    {/* Popular searches */}
                    <View style={{ marginVertical: 4, marginHorizontal: 13 }}>
                    <Text style={{ color: white, fontWeight: 600, fontSize: 15, marginVertical: 10 }}>Popular search</Text>
                    <FlatList
                        data={popularSearches}
                        keyExtractor={(item) => item.$id}
                        renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => {
                            setSearchQuery(item.name)
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
                            <Text style={{ color: searchQuery === item.name ? white : silver, marginHorizontal: 10 }}>{item.name}</Text>
                        </TouchableOpacity>
                        )}
                    />
                    </View>

                    {/* Promotions */}
                    <View style={{ marginVertical: 4, marginHorizontal: 13 }}>
                    <Text style={{ color: white, fontWeight: 600, fontSize: 14, marginVertical: 10 }}>Promotions</Text>
                    <FlatList
                        data={promotedData}
                        keyExtractor={(item) => item.$id}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => {
                                router.push({
                                    pathname: '/rentalunitdetail',
                                    params: { unitId: item.$id  }
                                });
                            }}
                            activeOpacity={0.7}
                            style={{
                            paddingVertical: 6,
                            paddingHorizontal: 10,
                            borderRadius: 12,
                            marginBottom: 6,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between"
                            }}>
                            <View style={{ backgroundColor: secondary, width: 80, height: 80, borderRadius: 8, overflow: "hidden" }}>
                            <Image
                                source={{uri: item.property?.frontImage}}
                                style={{ width: "100%", height: "100%" }}
                            />
                            </View>
                            <View style={{ width: "70%", height: 80, paddingVertical: 5, justifyContent: "space-between" }}>
                            <View>
                                <Text style={{ fontWeight: 500, color: white }}>{item.property?.title || "No title"}</Text>
                                <View style={{flexDirection:"row", alignItems: "center",marginVertical: 3}}>
                                    <Ionicons name="location-outline" size={13} color={Gray} style={{marginLeft:4,}}/>
                                    <Text style={{ color:silver, marginHorizontal: 3,fontSize: 12 }}>{item.property?.location || "Egerton University"}</Text>
                                </View>
                                <View style={{flexDirection: "row",alignItems: "center",marginVertical: 2}}>
                                    
                                    {item.isFurnished && (
                                        <Text style={{backgroundColor: "#2a1205",padding:2,color: Primary,borderRadius: 8,paddingHorizontal: 12,fontSize: 11,marginHorizontal: 2}}>Furnished</Text>
                                    )}
                                    {item.vacancyStatus && (
                                        <Text style={{backgroundColor: "#2a1205",padding:2,color: Primary,borderRadius: 8,paddingHorizontal: 12,fontSize: 11,marginHorizontal: 2}}>Vacant</Text>
                                    )}
                                </View>
                            </View>
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Ionicons name="bed" size={13} color={Gray} style={{ marginLeft: 4 }} />
                                <Text style={{ color: silver, marginHorizontal: 3 }}>{item.type || "N/A"}</Text>
                                </View>
                                <Text style={{ color: Primary, marginHorizontal: 3, fontWeight: 600 }}>Ksh. {item.price || "N/A"}</Text>
                            </View>
                            </View>
                        </TouchableOpacity>
                        )}
                        ListEmptyComponent={
                        loading ? (
                            <View>
                                <EmptyState/>
                                <EmptyState/>
                            </View>
                        ) : (
                        <View style={{ alignItems: "center", marginTop: 40 }}>
                            <Ionicons name="megaphone-outline" size={40} color={white} />
                            <Text style={{ color: white, fontSize: 16, marginTop: 10, fontWeight: "500" }}>
                              Be Seen First!
                            </Text>
                            <Text style={{ color: Gray, fontSize: 13, textAlign: "center", marginTop: 6, paddingHorizontal: 40 }}>
                            Promote your rental and reach more people looking to rent
                            </Text>
                            <TouchableOpacity
                            onPress={() => {
                                router.replace('/help')
                            }}
                            style={{
                                marginTop: 16,
                                backgroundColor: Primary,
                                paddingVertical: 8,
                                paddingHorizontal: 15,
                                borderRadius: 8,
                            }}
                            >
                            <Text style={{ color: "white", fontWeight: "600",fontSize: 13 }}> Contact Us to Promote</Text>
                            </TouchableOpacity>
                        </View>
                        )
                    }
                    />
                    </View>
                </>
                )}

        </SafeAreaView>
    </KeyboardAvoidingView>
  )
}

export default Rentalsearch

const styles = StyleSheet.create({})