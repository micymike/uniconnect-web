import { StyleSheet, Text, View,TouchableOpacity, FlatList,Dimensions,Image,Alert, ActivityIndicator } from 'react-native'
import React, { useState,useEffect } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons,Feather,MaterialIcons,FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { white ,secondary,Primary,silver,Gray, Red } from '../../utils/colors';
import Myrentalcard from '../../components/myrentalcard';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Avatar from "../../components/avatar";
import { useToast } from "@/context/ToastProvider";
import { getRentalForBusiness } from '../../lib/rentals/rental';
import { deleteproduct, getProductForBusiness } from '../../lib/market/market';
import EmptyState from '../../components/emptystate';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useAuthGuard } from '../../utils/useAuthGuard';

const BUSINESS_TYPES_CONFIG = {
  market: { dashboardTitle: 'Marketplace' },
  rental: { dashboardTitle: 'Rental Services' },
  meals: { dashboardTitle: 'Meals Delivery' },
};
const screenWidth = Dimensions.get('window').width;
const itemWidth = screenWidth / 3;
const windowWidth = Dimensions.get('window').width;

const Dashindex = () => {
   const { showSuccess, showError } = useToast();
    const { isAuthenticated, checking } = useAuthGuard('/');
   const [rentalData,setRentalData] = useState([]);
   const [marketData, setmarketData] = useState([])
   const [isloading, setIsLoading] = useState(false)

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeBusinessType, setActiveBusinessType] = useState('rental');
  const [deletingId, setDeletingId] = useState(null);


  const currentConfig = BUSINESS_TYPES_CONFIG[activeBusinessType];
  const insets = useSafeAreaInsets();


  const handleDelete = (propertyId) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this product?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setDeletingId(propertyId);
            try {
              const result = await deleteproduct(propertyId);

              if(result.success){
                showSuccess("Product deleted successfully.");
                fetchData()
              }

              if(!result.success){
                showSuccess("Failed to deleted product, try again.");
              }
              

            } catch (error) {
              console.log("Deletion failed:", error);
            }finally {
              setDeletingId(null); 
            }
          },
        },
      ]
    );
  };

  const fetchData = async () => {
    setIsLoading(true)
    try {
      if(activeBusinessType === "rental"){
        const result = await getRentalForBusiness()

        if(result.success){
          setRentalData(result.result)
        }
        if(!result.success){
          showError("Oops! We couldn't fetch your business data.Please try again or check your connection..")

        }
      }else if(activeBusinessType === "market"){
        const product = await getProductForBusiness()

        if(product.success){
          setmarketData(product.result)
        }
        if(!product.success){
          showError("Oops! We couldn't fetch your business data.Please try again or check your connection.")

        }
      }
      
    } catch (error) {
      console.error(error);
    }finally{
      setIsLoading(false)
    }
  };
useEffect(() => {
  
  fetchData();
}, [activeBusinessType]);

const RentalCard = ({ item }) => (
  <Myrentalcard
    item={item}
    onEdit={(item) => console.log("Edit", item)}
    onDelete={(item) => console.log("Delete", item)}
  />
);


const MarketCard = ({ item }) => (
   <TouchableOpacity
    onPress={() =>{
      router.push({
        pathname: '/singleproductdetails',
        params: { id: item.$id }
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
        justifyContent:"space-between"
    }}>
      <View style={{backgroundColor: secondary,width: 85,height: 90,borderRadius: 8,overflow: "hidden"}}>
        <Image
          source={
          item
            ? { uri: item?.frontImage }
            : require("../../assets/images/blog2.jpg")
        }
          style={{width: "100%",height: "100%",}}
          />

    </View>
      
      <View style={{width: "70%",height: 80,paddingVertical: 5,justifyContent: "space-between"}}>
        <View style={{width: "100%"}}>

          <View style={{flexDirection: "row",justifyContent: "space-between",alignItems: "center"}}>
            <Text numberOfLines={1} style={{fontWeight: 600,color: white}}>{item.title}</Text>
          </View>
          
          <View style={{flexDirection:"row", alignItems: "center",marginVertical: 3}}>
              <Ionicons name="location-outline" size={13} color={Gray} style={{marginLeft:4,}}/>
              <Text style={{ color:silver, marginHorizontal: 3,fontSize: 12 }}>{item.location || "No location"}</Text>
          </View>
        </View>

        <View style={{flexDirection:"row", alignItems: "center",justifyContent: "space-between",marginTop: 4}}>
          <View style={{flexDirection:"row", alignItems: "center"}}>
              <Ionicons name="bag-check" size={12} color={Gray} style={{marginLeft:4,}}/>
              <Text style={{ color:silver, marginHorizontal: 3,fontSize: 12 }}> {item.isAvailable ? "In Stock" : "Out of Stock"}</Text>
          </View>
          <View style={{flexDirection:"row",alignItems:"center"}}>
          <TouchableOpacity
              activeOpacity={0.7}
              style={styles.actionButton}
              onPress={() => {
                  router.push({
                    pathname: '/editproduct',
                    params: { id: item.$id }
                  })
              }}
            >
              <AntDesign name="edit" size={12} color={white} style={{paddingHorizontal: 3}} />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              disabled={deletingId === item.$id}
              onPress={() => {
                handleDelete(item.$id)
              }}
              style={[styles.actionButton, styles.deleteButton]}
            >
              {deletingId === item.$id ? (
                <ActivityIndicator size={14} color={Red} style={{ marginLeft: 4 }} />
              ) : (
                <AntDesign name="delete" size={12} color={white} style={{paddingHorizontal: 3}} />
              )}
            </TouchableOpacity>
          </View>
        </View>


        </View>
    </TouchableOpacity>
);

const getDashboardContent = () => {
  switch (activeBusinessType) {
    case 'rental':
      return { data: rentalData, Component: RentalCard };
    case 'market':
      return { data: marketData, Component: MarketCard };
    default:
      return { data: [], Component: () => null };
  }
};

const RentalEmptyCard = () => {
  if(isloading === true && rentalData.length === 0){
    return (
      <View>
        <EmptyState/>
        <EmptyState/>
        <EmptyState/>
        <EmptyState/>
      </View>
      
    )
  }else if(isloading === false && rentalData.length === 0){
    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
          marginTop: 40,
        }}
      >
        <Ionicons name="add-outline" size={24} color={Primary} style={{ marginBottom: 5 }} />
        <Text style={{ fontSize: 13, color: silver, marginBottom: 10, textAlign: 'center' }}>
          You haven’t added any rental properties yet.
        </Text>
        <TouchableOpacity
        activeOpacity={0.7}
          onPress={() => {
            router.replace("/createrental")
          }}
          style={{
            backgroundColor: Primary,
            paddingVertical: 7,
            paddingHorizontal: 8,
            borderRadius: 8,
            marginTop: 4,
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold',fontSize: 12 }}>Add Property</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const MarketEmptyCard = () => {
  if(isloading === true && marketData.length === 0){
    return (
      <View>
        <EmptyState/>
        <EmptyState/>
        <EmptyState/>
      </View>
      
    )
  }else if(isloading === false && marketData.length === 0) {
    return ( 
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
          marginTop: 40,
        }}
      >
        <Ionicons name="add-outline" size={24} color={Primary} style={{ marginBottom: 5 }} />
        <Text style={{ fontSize: 13, color: Gray, marginBottom: 10, textAlign: 'center' }}>
          You haven't added any products yet.
        </Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            router.replace("/createproduct") 
          }}
          style={{
            backgroundColor: Primary,
            paddingVertical: 7,
            paddingHorizontal: 8,
            borderRadius: 8,
            marginTop: 4,
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 12 }}>Add Product</Text>
        </TouchableOpacity>
      </View>
    )

  }

}

const getEmptyState = () => {
  switch(activeBusinessType) {
     case 'rental':
      return  RentalEmptyCard() ;
     case 'market':
      return  MarketEmptyCard();
    default:
      return  null;
  }
}



  const dashboards = [
  { key: 'rental', label: 'Rental Dashboard', icon: 'home' },
  { key: 'market', label: 'Market Dashboard', icon: 'cart' },
];

  const Header = ({}) => {
    return(
      <View style={{flexDirection: 'row',justifyContent: 'space-between',alignItems: 'center',paddingHorizontal: 16,paddingVertical: 10,backgroundColor: secondary,}}>
        <View style={{flexDirection: 'row',alignItems: 'center',}}>
          <TouchableOpacity 
          activeOpacity={0.6} 
          onPress={()=> {
              router.replace("/profile");
          }} style={{ paddingRight: 10, paddingVertical: 5,}}>
              <Ionicons name="arrow-back" size={19} color={white} />
            </TouchableOpacity>
        </View>
        <View style={{  }}>
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
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#F3F4F6',textAlign:"center" }}>
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
              alignSelf:"center"
            }}
          >
            {dashboards.map((dashboard) => (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      key={dashboard.key}
                      style={{
                        alignItems: 'center',
                        padding: 8,
                        justifyContent: 'center',
                        flexDirection: 'row',
                        width: 160,
                        backgroundColor: secondary,
                        
                      }}
                      onPress={() => {
                        setActiveBusinessType(dashboard.key); 
                        setIsDropdownOpen(false);
                      }}
                    >
                      <Ionicons name={dashboard.icon} size={15} color={white} />
                      <Text style={{ marginHorizontal: 4, color: white }}>
                        {dashboard.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                )}
                </View>
            <View style={{flexDirection: 'row',alignItems: 'center',}}>
              <TouchableOpacity
                activeOpacity={0.9}
                style={{padding: 5,}}>
          
                </TouchableOpacity>
            </View>
      </View>
    )
  };


 


  
const { data, Component } = getDashboardContent();

  return (
    <LinearGradient
      colors={["#030406","#000"]}
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

      <SafeAreaView style={{ flex: 1,}}>
        <Header/>
        <View style={{flex: 1}}>
        <FlatList
        data={data}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <Component item={item} />}
        style={{marginBottom: 3}}
        ListHeaderComponent={
          <View style={{marginBottom: 3}}>
           
          <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: 16,
                paddingVertical: 12,
              }}
            >
              <Text style={{ fontSize: 16, color: white, fontWeight: '600' }}>{activeBusinessType === "rental"? "Your Properties": "Your Products"}</Text>

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
                  if(activeBusinessType === "rental"){
                    router.replace("/createrental")
                  }else{
                    router.replace("/createproduct")
                  }
                 }}
              >
                <Ionicons name="add" size={16} color="#fff" style={{ marginRight: 4 }} />
                <Text style={{ color: "white", fontSize: 13, fontWeight: '500' }}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        }
        ListEmptyComponent={
          getEmptyState()
        }
        />
        </View>
        <StatusBar style="light"  />
      </SafeAreaView>
    </LinearGradient>
  )
}

export default Dashindex

const styles = StyleSheet.create({
  summaryNumber: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
  },
  summaryLabel: {
    color: "#9ca3af",
    fontSize: 12,
    marginTop: 4,
  },
   unitActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 4,
  },
  actionButtonText: {
    fontSize: 16,
  },
  unitDetails: {
    gap: 12,
  },
  unitDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  unitDetailText: {
    color: "#9ca3af",
    fontSize: 14,
  },
})