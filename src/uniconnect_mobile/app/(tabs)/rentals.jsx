import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { GoogleMaps } from 'expo-maps';
import { router } from "expo-router";
import { useEffect, useState,useRef } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, TextInput, RefreshControl,Animated  } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import EmptyState from '../../components/emptystate';
import Header from '../../components/header';
import Rentalcard from '../../components/rentalcard';
import SearchBTN from '../../components/searchBTN';
import { fetchRentals,fetchAllUnits } from '../../lib/rentals/rental';
import { Primary, secondary, white } from '../../utils/colors';
import ProductTag from '../../components/productTag';
import { sendPushNotification } from '../../lib/notifications/notifications';
import { useNotification } from "@/context/NotificationContext";
import { useToast } from "@/context/ToastProvider";
import { useAuthGuard } from '../../utils/useAuthGuard';
import { StatusBar } from 'expo-status-bar';


const Rentals = () => {
    const { showSuccess, showError } = useToast();
    const { error, notification, expoPushToken } = useNotification();
    const [showMap, setShowMap] = useState(false);
    const [rentalUnits, setRentalUnits] = useState([]);
    const { isAuthenticated, checking } = useAuthGuard('/');

    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedTag, setSelectedTag] = useState('All');
    const [refreshing, setRefreshing] = useState(false);

    const categories = ["All", "bedsitter", "onebedroom", "two bedroom", "air bnb"];

    const flatListRef = useRef(null);
    const scrollY = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const [showScrollTop, setShowScrollTop] = useState(false);

    const handleScroll = (event) => {
      const y = event.nativeEvent.contentOffset.y;

      if (y > 200 && !showScrollTop) {
        setShowScrollTop(true);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }).start();
      } else if (y <= 200 && showScrollTop) {
        setShowScrollTop(false);
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }).start();
      }
    };

    const scrollToTop = () => {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    };

     const titletags = [
        { id: 1, title: 'All' },
        { id: 2, title: 'Vacant' },
        { id: 3, title: 'Furnished' },
        { id: 4, title: 'bed sitter' },
        { id: 5, title: 'one bedroom' },
        { id: 6, title: 'Single room' },
        { id: 7, title: 'two bedrooms' },
        { id: 8, title: 'double room' },
      ];

    const fetchData = async () => {
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

          const vacantUnits = combined.filter(unit => unit.vacancyStatus === true);
          const occupiedUnits = combined.filter(unit => unit.vacancyStatus === false);

          const shuffledVacant = vacantUnits.sort(() => Math.random() - 0.5);
          const shuffledOccupied = occupiedUnits.sort(() => Math.random() - 0.5);

          const finalUnits = [...shuffledVacant, ...shuffledOccupied];

          setRentalUnits(finalUnits);
        }
      } catch (err) {
        showError("Something went wrong while loading rental data. Please try again.")
        console.error("Error loading rental data:", err);
      }
    };

    const loadInitialData = async () => {
      setLoading(true);
      await fetchData();
      setLoading(false);
    };

    const onRefresh = async () => {
      setRefreshing(true);
      await fetchData();
      setRefreshing(false);
    };

    useEffect(() => {
      loadInitialData();
    }, []);

  
    const cameraPosition = {
      coordinates: {
        latitude: -0.3691,
        longitude: 36.9570
      },
      zoom: 10,
    
    }
            
  return (
    <View style={{flex: 1, backgroundColor: "#000"}}>
      <SafeAreaView style={{ flex: 1 ,backgroundColor: "#000"}}>
        
        {showMap ? 
         (
         <>
          <GoogleMaps.View 
            cameraPosition={cameraPosition}
            style={{ flex: 1 }}
            // interactive={false} 
            compassEnabled={false}
            showsMyLocationButton={false}
            showsUserLocation={false}
            showsTraffic={false}
            showsBuildings={false}
            toolbarEnabled={false}
            zoomControlsEnabled={false}
            
          />
        </>
         ):
         (
          <>
          <Header
         title="Rentals"
         color={white}
         Size={19}
        />
        <View style={{width: "100%", justifyContent: "center", alignItems: "center"}}>
          <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <SearchBTN placeholder="Search for rental here..." redirect="/rentalsearch"/>
          </View>
         

        <View style={{width: "96%",flexDirection: "row",justifyContent: "space-between",marginVertical: 4,alignItems: "center"}}>
          <View>
            <Text style={{fontSize: 15,fontWeight: 500,marginVertical:10,color: white}}>All Rentals</Text>
          </View>
          <View style={{flexDirection: "row", alignItems: "center"}}>
            
            <TouchableOpacity
             activeOpacity={0.7}
              onPress={() => {
                router.push("/help");
              }}
              style={{
                paddingVertical: 5,
                paddingHorizontal: 14,
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: Primary,
                borderRadius: 7,
              }}>
              <Text style={{color: "white", fontWeight: 600, fontSize: 14}}>Need Help ?</Text>
            </TouchableOpacity>
          </View>
        </View>
        </View>
          

          <View style={{ width: '100%',marginBottom: 10 }}>
          <ProductTag
            data={titletags}
            onTagSelect={(tag) => setSelectedTag(tag)}
            activeTag={selectedTag}
          />
        </View>
          <FlatList
            ref={flatListRef}
            data={
              selectedTag === "All"
                ? rentalUnits
                : rentalUnits.filter((item) => {
                    if (selectedTag === "Vacant") return item.vacancyStatus === true;
                    if (selectedTag === "Furnished") return item.isFurnished === true;
                    return item.type?.toLowerCase() === selectedTag.toLowerCase();
                  })
            }
            keyExtractor={(item) => item.$id}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => <Rentalcard key={item.$id} item={item} />}
            contentContainerStyle={{alignItems: "center"}}
            ListEmptyComponent={
              <View>
                <EmptyState/>
                <EmptyState/>
                <EmptyState/>
                <EmptyState/>
                <EmptyState/>
                <EmptyState/>
              </View>
            }
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#ffffff"]}                 
                tintColor="#ffffff"                  
                progressBackgroundColor="#262626"
              />
            }
            onScroll={handleScroll}
            scrollEventThrottle={16}
          />

           <Animated.View
              style={{
                position: 'absolute',
                bottom: 20,
                right: 20,
                opacity: fadeAnim,
                transform: [{ scale: fadeAnim }],
              }}
              pointerEvents={showScrollTop ? "auto" : "none"} 
            >
              <TouchableOpacity
               activeOpacity={0.7}
                onPress={scrollToTop}
                style={{
                  backgroundColor: '#262626',
                  padding: 8,
                  borderRadius: 50,
                  elevation: 4,
                  shadowColor: '#000',
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  shadowOffset: { width: 0, height: 2 }
                }}
              >
                <Ionicons name="chevron-up" size={17} color={white} />
              </TouchableOpacity>
            </Animated.View>
          </>
         )}
         
      </SafeAreaView>
      <StatusBar style="light"/>
      </View>
  )
}

export default Rentals

const styles = StyleSheet.create({})