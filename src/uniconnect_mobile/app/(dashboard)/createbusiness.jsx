import { StyleSheet, Text, View,TouchableOpacity,} from 'react-native'
import {router } from 'expo-router'
import React,{useState,useEffect} from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { Primary, white, Gray, secondary,silver } from '../../utils/colors';
import CustomInput from '../../components/custominput';
import { getAuthData } from '../../lib/auth/emailpassword';
import { createBusiness } from '../../lib/business/business';
import { useToast } from "@/context/ToastProvider";
import Header from "../../components/header"
import { useAuthGuard } from '../../utils/useAuthGuard';


const Createbusiness = () => {
    const { showSuccess, showError } = useToast();
          const { isAuthenticated, checking } = useAuthGuard('/');
    
    const [tabIndex, setTabIndex] = useState(0);
    const [businessname, setBusinessName] = useState('');
    
    const [isloading,setisloading] = useState(false)

    useEffect(() => {
      
      const checkAuth = async () => {
        const { user, session } = await getAuthData();
        if(!user || !session){
          router.push("/") 
        }
      };
      checkAuth()
    }, []);

    const [businessNameError, setBusinessNameError] = useState('');

    const createbusiness = async () => {
      try{
        let hasError = false;

        if (businessname.length < 3 ) {
          showError("Enter a valid business name with at least 3 characters.");
          hasError = true;
        }

        if (hasError) return;

        setisloading(true)

        const result = await createBusiness({
          businessname,
        });

        console.log(result)

        if(result.success){
          showSuccess(result.message)
          router.push("/dashindex")
        }else{
          showError(result.message)
        }
         
      }catch(error){
        console.log("create business error", error)
      }finally{
        setisloading(false)
      }
    
    }

    const renderTab = () => {
    switch (tabIndex) {
      case 0:
        return (
          <View style={{flex: 1,paddingHorizontal: 30,paddingVertical: 20}}>
            <Text style={{color: white,fontSize: 14,fontWeight: '600',}}>
              Name Your Business
            </Text>
            <View style={{marginVertical: 6}}>
            <CustomInput
               placeholder="Business Name"
               value={businessname}
               onChangeText={(text) => {
                   setBusinessName(text);
                   if (text.length > 0) setBusinessNameError("");
               }}
               style={{marginVertical: 5}}
             />
             {businessNameError && <Text style={{color: "red"}}>{businessNameError}</Text>}

             <View style={{flexDirection: 'row',alignItems: 'center',gap: 8,marginBottom: 4,marginTop: 10}}>
                  <MaterialIcons name="error-outline" size={16} color={Primary} style={{ marginTop: 3 }} />
                  <Text style={{ flex: 1,fontSize: 13.5,color: silver,}}>This name appears on your listings</Text>
              </View>
             </View>
             
             <TouchableOpacity 
              activeOpacity={0.7}
              disabled={isloading}
             onPress={() => {
              if (businessname.length < 3 ) {
               setBusinessNameError("Enter a valid business name with at least 3 characters.");
               return;
              }

              createbusiness()
             }}
             style={{padding: 9,borderRadius: 9,marginTop: 8,flexDirection: "row",alignItems: "center",justifyContent: "center",borderWidth: 0.4,borderColor: Gray,width: "95%",alignSelf: "center",backgroundColor: Primary}}>
               {isloading ? (
                  <Text style={{textAlign: "center",fontWeight: "500",color: "white",}}>Creating...</Text>
                ) : (
                  <Text style={{ textAlign: "center", fontWeight: "600", color: "white" }}>
                    Create Business
                  </Text>
                )}
             </TouchableOpacity>
          </View>
        );
    }
  }

  return (
    <LinearGradient
      colors={["#030406","#000"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{flex:1,}}>
         
          <Header
            showBackButton={true}
            title="Create dashboard"
            color={white}
            Size={17}
            showIcons={false}
            backPath="/profile"
          />
          {renderTab()}
      </SafeAreaView>
    </LinearGradient>
  )
}

export default Createbusiness

const styles = StyleSheet.create({})