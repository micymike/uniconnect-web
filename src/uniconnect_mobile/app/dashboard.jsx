import { StyleSheet, Text, View, TouchableOpacity, FlatList, Dimensions, ActivityIndicator } from 'react-native'
import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, Feather, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { white, secondary, Primary, silver, Gray } from '../utils/colors';
import Myrentalcard from '../components/myrentalcard';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BusinessCard from '../components/businesscard';
import { usePromoModal } from "@/context/PromoModalContext";
import { useToast } from "@/context/ToastProvider";
import { fetchRentals } from '../lib/rentals/rental';
import { fetchMarketProducts } from '../lib/market/market';
/* import { fetchMeals } from '../lib/meals/meals'; */
import { getCurrentUser } from '../lib/auth/emailpassword';
import { getBusinessByUserId } from '../lib/business/business';

const BUSINESS_TYPES_CONFIG = {
  market: { dashboardTitle: 'Marketplace' },
  rental: { dashboardTitle: 'Rental Services' },
  // meals: { dashboardTitle: 'Meals Delivery' },
};
const screenWidth = Dimensions.get('window').width;

/* 
// Meals Card Component (commented out)
const MealCard = ({ item }) => (
  <View style={{ padding: 10, backgroundColor: '#1F2937', borderRadius: 10, marginVertical: 5 }}>
    <Text style={{ color: white, fontWeight: '600', fontSize: 15 }}>{item.title}</Text>
    <Text style={{ color: silver }}>{item.price} - {item.location || "No location"}</Text>
    <Text style={{ color: silver }}>{item.by ? `By: ${item.by}` : ""}</Text>
  </View>
);
*/

const Dashboard = () => {
  const { showPromo } = usePromoModal();
  const { showSuccess, showError } = useToast();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeBusinessType, setActiveBusinessType] = useState('rental');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentBusinessId, setCurrentBusinessId] = useState(null);

  const currentConfig = BUSINESS_TYPES_CONFIG[activeBusinessType];
  const insets = useSafeAreaInsets();

  // Fetch current user and business on mount
  useEffect(() => {
    const fetchUserAndBusiness = async () => {
      try {
        const userRes = await getCurrentUser();
        if (userRes.success && userRes.user?.$id) {
          setCurrentUserId(userRes.user.$id);
          // Fetch business for this user
          const businessRes = await getBusinessByUserId(userRes.user.$id);
          if (businessRes.success && businessRes.business?.$id) {
            setCurrentBusinessId(businessRes.business.$id);
          } else {
            setCurrentBusinessId(null);
          }
        }
      } catch (err) {
        setCurrentUserId(null);
        setCurrentBusinessId(null);
      }
    };
    fetchUserAndBusiness();
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      if (activeBusinessType === 'rental') {
        const res = await fetchRentals();
        if (res.success) {
          // Show all properties, just like the rentals page
          const allUnits = [];
          res.data.forEach(({ property, units }) => {
            units.forEach(unit => {
              allUnits.push({
                ...unit,
                property,
              });
            });
          });
          setData(allUnits);
        } else {
          setFetchError(res.message || "Failed to fetch rentals");
        }
      } else if (activeBusinessType === 'market') {
        const res = await fetchMarketProducts();
        if (res.success) {
          // Flatten all products from all categories
          const allProducts = [];
          res.data.forEach(({ category, products }) => {
            products.forEach(product => {
              allProducts.push({
                ...product,
                category,
              });
            });
          });
          setData(allProducts);
        } else {
          setFetchError(res.message || "Failed to fetch market products");
        }
      } 
      /* else if (activeBusinessType === 'meals') {
        const res = await fetchMeals();
        if (res.success) {
          setData(res.data);
        } else {
          setFetchError(res.message || "Failed to fetch meals");
        }
      } */
    } catch (err) {
      setFetchError("An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  }, [activeBusinessType, currentUserId]);

  useEffect(() => {
    if (activeBusinessType !== 'rental' || currentUserId !== null) {
      fetchData();
    }
  }, [fetchData, activeBusinessType, currentUserId]);

  const dashboards = [
    { key: 'rental', label: 'Rental Dashboard', icon: 'home' },
    // { key: 'meals', label: 'Meal Dashboard', icon: 'restaurant' },
    { key: 'market', label: 'Marketplace Dashboard', icon: 'cart' },
  ];

  const Header = () => (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, backgroundColor: secondary }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => {
            router.back();
          }} style={{ paddingRight: 10, paddingVertical: 5 }}>
          <Ionicons name="arrow-back" size={19} color={white} />
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setIsDropdownOpen(!isDropdownOpen)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 4,
            borderRadius: 6,
          }}
        >
          <View>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#F3F4F6', textAlign: "center" }}>
              {currentConfig.dashboardTitle}
            </Text>
            <Text style={{ fontSize: 12, color: '#9CA3AF' }}>
              Manage your {activeBusinessType}
            </Text>
          </View>
          <Ionicons
            name={isDropdownOpen ? 'chevron-up' : 'chevron-down'}
            size={16}
            color="#9CA3AF"
            style={{ marginLeft: 6 }}
          />
        </TouchableOpacity>
        {isDropdownOpen && (
          <View
            style={{
              position: 'absolute',
              top: 55,
              borderRadius: 6,
              zIndex: 10,
              overflow: 'hidden',
              right: -30,
              alignSelf: "center"
            }}
          >
            {dashboards.map((dashboard) => (
              <TouchableOpacity
                key={dashboard.key}
                style={{
                  alignItems: 'center',
                  padding: 8,
                  justifyContent: 'center',
                  flexDirection: 'row',
                  width: 180,
                  backgroundColor: secondary,
                }}
                onPress={() => {
                  setActiveBusinessType(dashboard.key);
                  setIsDropdownOpen(false);
                }}
              >
                <Ionicons name={dashboard.icon} size={19} color="white" />
                <Text style={{ marginHorizontal: 4, color: 'white' }}>
                  {dashboard.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={{ padding: 5, borderRadius: 8, borderWidth: 1, borderColor: Gray }}>
          <FontAwesome name="edit" size={13} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const Quickstat = () => {
    // Example: show count of items
    return (
      <>
        <Text style={{ color: white, marginLeft: 20, fontWeight: 600, fontSize: 17 }}>Overview</Text>
        <View style={{ flexDirection: "row", marginVertical: 8, marginLeft: 20 }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginRight: 24 }}>
            <Ionicons name="list" size={20} color="#4cc9f0" style={{ marginRight: 6 }} />
            <Text style={{ color: silver, fontWeight: 400, fontSize: 14 }}>Total</Text>
            <Text style={{ color: white, fontSize: 16, fontWeight: 700, marginLeft: 6 }}>{data.length}</Text>
          </View>
        </View>
      </>
    );
  };

  // Renderers for each business type
  const RentalCard = ({ item }) => (
    <Myrentalcard
      item={{
        ...item,
        title: item.title || item.property?.title,
        location: item.location || item.property?.location,
        type: item.type || item.property?.type,
        price: item.price,
        image: item.frontImage || (item.property?.images ? JSON.parse(item.property.images)[0] : undefined),
      }}
      onEdit={() => showSuccess("Edit rental")}
      onDelete={() => showSuccess("Delete rental")}
      onPress={() => router.push('/(rental)/rentaldashboard')}
    />
  );

  const MealCard = ({ item }) => (
    <View style={{ padding: 10, backgroundColor: '#1F2937', borderRadius: 10, marginVertical: 5 }}>
      <Text style={{ color: white, fontWeight: '600', fontSize: 15 }}>{item.title}</Text>
      <Text style={{ color: silver }}>{item.price} - {item.location || "No location"}</Text>
      <Text style={{ color: silver }}>{item.by ? `By: ${item.by}` : ""}</Text>
    </View>
  );

  const MarketCard = ({ item }) => (
    <View style={{ padding: 10, backgroundColor: '#111827', borderRadius: 10, marginVertical: 5 }}>
      <Text style={{ color: white, fontWeight: '600', fontSize: 15 }}>{item.title}</Text>
      <Text style={{ color: silver }}>{item.price}</Text>
      <Text style={{ color: silver }}>{item.category}</Text>
    </View>
  );

  let Component;
  if (activeBusinessType === 'rental') Component = RentalCard;
  // else if (activeBusinessType === 'meals') Component = MealCard;
  else if (activeBusinessType === 'market') Component = MarketCard;

  return (
    <LinearGradient
      colors={["#030406", "#000"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <View style={{
        height: insets.top,
        backgroundColor: secondary,
        width: '100%',
        position: 'absolute',
        top: 0,
        zIndex: 100,
      }} />

      <SafeAreaView style={{ flex: 1 }}>
        <Header />
        {loading ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color={Primary} />
            <Text style={{ color: silver, marginTop: 10 }}>Loading...</Text>
          </View>
        ) : fetchError ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ color: "red" }}>{fetchError}</Text>
            <TouchableOpacity onPress={fetchData} style={{ marginTop: 10, backgroundColor: Primary, padding: 10, borderRadius: 6 }}>
              <Text style={{ color: white }}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={data}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => <Component item={item} />}
            style={{ marginBottom: 3 }}
            ListHeaderComponent={
              <View style={{ marginBottom: 10 }}>
                <View style={{ padding: 10 }}>
                  <BusinessCard />
                </View>
                <Quickstat />
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                }}>
                  <Text style={{ fontSize: 16, color: white, fontWeight: '600' }}>
                    {activeBusinessType === 'rental' ? "Your Properties" : /*activeBusinessType === 'meals' ? "Your Meals" :*/ "Your Products"}
                  </Text>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: Primary,
                      paddingVertical: 4,
                      paddingHorizontal: 9,
                      borderRadius: 5,
                    }}
                    onPress={() => {
                      if (activeBusinessType === 'rental') {
                        router.push('/createrental');
                      } else if (activeBusinessType === 'market') {
                        router.push('/market/createproduct');
                      } /* else if (activeBusinessType === 'meals') {
                        showError("Add meal feature is not available yet.");
                      } */
                    }}
                  >
                    <Ionicons name="add" size={16} color="#fff" style={{ marginRight: 4 }} />
                    <Text style={{ color: "white", fontSize: 13, fontWeight: '500' }}>Add</Text>
                  </TouchableOpacity>
                </View>
              </View>
            }
          />
        )}
        <StatusBar style="light" />
      </SafeAreaView>
    </LinearGradient>
  );
};

export default Dashboard;

const styles = StyleSheet.create({});
