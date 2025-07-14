import { StyleSheet, Text, View, ScrollView, TouchableOpacity,ActivityIndicator } from 'react-native';
import React, { useState,useEffect } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome, Feather } from "@expo/vector-icons";
import { Gray, Primary, secondary, silver, white } from "../../utils/colors";
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Servicebtn from '../../components/servicebtn';
import { getAuthData,updateUserAccountType } from '../../lib/auth/emailpassword';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNotification } from "@/context/NotificationContext";
import { syncPushTokenToUser } from '../../lib/auth/emailpassword';

const selectaccount = () => {
  const { error, notification, expoPushToken } = useNotification();
  const [currentTab, setCurrentTab] = useState("accountType");
  const [accountType, setAccountType] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false)

  const syncPushTokenToUserr = async () => {
    try{
      const res = await syncPushTokenToUser(expoPushToken)
      console.log("res",res.message)
    }catch(error){
      console.log("pushnotification error",error);
    }
  }
  useEffect(() => {
       syncPushTokenToUserr()
  },[expoPushToken])

   useEffect(() => {
        
        const checkAuth = async () => {
          const { user, session } = await getAuthData();
          if(!user || !session){
            router.push("/") 
          }
        };
        checkAuth()
    }, []);


  const handleAccountTypeSelect = (type) => {
    setAccountType(type);
    if (type === "find") {
      router.replace("/rentals"); 
    } else {
      setCurrentTab("serviceType");
    }
  };

  const handleServiceTypeToggle = (service) => {
  setSelectedServices((prev) => {
    if (prev.includes(service)) {
      return prev.filter((s) => s !== service); 
    } else {
      return [...prev, service]; 
    }
  });
};

const updateAccount = async () => {
  setIsUpdating(true)
  try{
     const result = await updateUserAccountType(accountType);
     if(result.success){
      if(result.updatedDoc.accountType === "offer"){
        setCurrentTab("serviceType")
      }else{
        router.push("/rentals")
      }
     }
  }catch(error){
    console.log("accounttype updatw", error)
  }finally{
    setIsUpdating(false)
  }

}



  const renderContent = () => {
    switch (currentTab) {
      case "accountType":
         return (
           <View> 
              <View style={{width: "98%",justifyContent: "center",padding: 10,alignItems: "center",}}>
                <Text style={{fontWeight: 700,fontSize: 18,color: "#fff"}}>Account type</Text>
                <Text numberOfLines={2} style={{marginVertical:7,color: silver,textAlign: "center",fontWeight: 500}}>How would you like to use UniConnect?</Text>
              </View>
              <View >
                <Servicebtn
                heading="Offer Services"
                desc="Provide food or rentals to students"
                iconName="business"
                selected={accountType === "offer"}
                onPress={() => setAccountType("offer")}
                />
                <Servicebtn
                heading="Find Services"
                desc="Discover food and housing options"
                iconName="shield-half-outline"
                selected={accountType === "find"}
                onPress={() => setAccountType("find")}
                />
                <TouchableOpacity
                  style={[
                    styles.continueButton,
                    { backgroundColor: accountType ? Primary : secondary }
                  ]}
                  activeOpacity={0.8}
                  disabled={accountType === null}
                  onPress={() => {
                    updateAccount()
                    // if (accountType === "find") {
                    //   router.replace("/rentals");
                    // } else {
                    //   setCurrentTab("serviceType");
                    // }
                  }}
                >
                  {isUpdating ? <ActivityIndicator size={16} color="white"/> : <Text style={styles.buttonText}>Continue</Text>}
                  
                </TouchableOpacity>
              </View>
           </View>
         );
      case "serviceType":
        return (
          <View> 
              <View style={{width: "98%",justifyContent: "center",padding: 10,alignItems: "center",}}>
                <Text style={{fontWeight: 700,fontSize: 18,color: "#fff"}}>Select the service</Text>
                <Text numberOfLines={2} style={{marginVertical:7,color: silver,textAlign: "center",fontWeight: 500}}>What type of service would you like to offer?</Text>
              </View>
              <View >
                <Servicebtn
                heading="Rental Services"
                desc="Offer hostels, apartments, or rooms"
                iconName="home-outline"
                selected={selectedServices.includes("rental")}
                onPress={() => handleServiceTypeToggle("rental")}
                />
                
                 <Servicebtn
                heading="Marketplace Services"
                desc="Sell electronics, furniture, or supplies	"
                iconName="pricetags-outline"
                selected={selectedServices.includes("market")}
                onPress={() => handleServiceTypeToggle("market")}
                />

                <TouchableOpacity
                  style={[
                    styles.continueButton,
                    { backgroundColor: selectedServices.length > 0 ? Primary : secondary }
                  ]}
                  activeOpacity={0.8}
                  disabled={selectedServices.length === 0}
                  onPress={() => {
                    const query = selectedServices.join(",");
                    router.push({
                        pathname: '/createbusiness',
                        params: { oldservices: selectedServices },
                    })
                  }}
                >
                  <Text style={styles.buttonText}>Continue</Text>
                </TouchableOpacity>
              </View>
           </View>
        )
      default:
        return null;
    }
  }


  return (
    <LinearGradient
      colors={["#030406","#000"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1,justifyContent: "center",alignItems: "center" }}>
        <View style={{position: "absolute",top: 70,right: 30,zIndex: 40 }}>
          <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
              router.back()
          }}
          >
            <Ionicons name="close" size={19} color="#fff" />
          </TouchableOpacity>
        </View>
          <View>{renderContent()}</View>

      </SafeAreaView>
    </LinearGradient>
  );
};

export default selectaccount;

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 16,
    justifyContent: "",
    paddingBottom: 40,
  },
  headerText: {
    color: "#fff",
    fontSize: 23,
    fontWeight: "800",
    textAlign: "center",
  },
  subHeaderText: {
    color: "#CBCED4",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    maxWidth: "86%",
  },
  card: {
    backgroundColor: "#101723",
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 15,
    shadowColor: Primary,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
    marginHorizontal: 10,
    borderLeftWidth: 3,
    borderLeftColor: Gray,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    alignItems: "center",
  },
  radioCircle: {
    width: 12,
    height: 12,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Gray,
  },
  selectedCircle: {
    borderColor: Primary, 
    backgroundColor: Primary,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 6,
  },
  cardDesc: {
    color: "#aaa",
    fontSize: 14,
    marginBottom: 14,
  },
  continueButton: {
    padding: 10,
    borderRadius: 9,
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.4,
    borderColor: Gray,
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "600",
    color: "white",
  },
});
