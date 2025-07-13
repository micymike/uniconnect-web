import { StyleSheet, Text, View ,Dimensions,TouchableOpacity,ActivityIndicator,Image,KeyboardAvoidingView, Platform, } from 'react-native'
import React, {useState} from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Gray, Primary, secondary,Red } from "../../utils/colors"
import CustomInput from '../../components/custominput';
import { StatusBar } from 'expo-status-bar'
import { signIn } from '../../lib/auth/emailpassword';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useToast } from "@/context/ToastProvider";
import { syncPushTokenToUser } from '../../lib/auth/emailpassword';
import { useNotification } from "@/context/NotificationContext";


const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const Signin = () => {
    const { error, notification, expoPushToken } = useNotification();
    const [email , setEmail] = useState("")
    const [password, setPassword] = useState("")
    const { showSuccess, showError } = useToast();
    const [isSubmiting, setIsSubmiting] = useState(false)
    const emailpasswordBoolean = true
    const [emailError , setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")


    const submittosignin = async () => { 
        try{
          let hasError = false;
  
          if(!email){
            setEmailError("Email is required")
            hasError = true;
          }
  
          if(!password || password.length < 8){
            setPasswordError("Password must be at least 8 characters long")
            hasError = true;
          }
  
          if (hasError) return;
  
  
          setIsSubmiting(true)
  
          const result = await signIn(email,password,emailpasswordBoolean);
          
        if(result.success){
           console.log("session",result)

            await AsyncStorage.setItem("user", JSON.stringify(result.user));
            await AsyncStorage.setItem("session", JSON.stringify(result.session));

            if (expoPushToken) {
              console.log("expoPushToken",expoPushToken)
              await syncPushTokenToUser(expoPushToken);
            }


            setEmail("");
            setPassword("");

            router.replace("/rentals"); 
        }else if( result.success=== false ){
          showError(result.message)
        }
        
        }catch(e){
          console.log("sign up err", e)
        }finally{
          setIsSubmiting(false)
        }
      }
  return (
    <LinearGradient
      colors={["#464646","#464646", "#030406","#000","#000", "#000"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
     <SafeAreaView style={{ flex: 1,justifyContent: "center",alignItems: "center" }}>
        <View style={{position: "absolute",top: 60,left: 30 }}>
            <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
                router.back()
            }}
            >
              <Ionicons name="arrow-back" size={18} color="#fff" />
            </TouchableOpacity>
        </View>

        <View style={{width: windowWidth * 0.9,height: windowHeight * 0.45,marginVertical: 5,justifyContent: "center",alignItems:"center",borderRadius: 12}}>
            <View style={{justifyContent: "center",alignItems: "center"}}>
          
            <Image
              style={{ width: 120, height: 120, borderRadius: 60 }}
              source={require("../../assets/icons/adaptive-icon.png")}
            />
            <Text style={{ textAlign: "center", fontWeight: "500",color: "#fff",fontSize: 21,fontWeight: 700,marginVertical: 10 }}>Sign in to your account</Text>
            <Text style={{ textAlign: "center", fontWeight: "500" ,color: "#788481",marginBottom: 10,fontSize: 15}}>We missed you! continue to your account</Text>
            <View style={{marginVertical: 20}}>
              <CustomInput
                label="Email"
                placeholder="testemail@gmail.com"
                value={email}
                onChangeText={(text) => {
                    setEmail(text);
                    if (text.length > 0) setEmailError("");
                }}
                style={{marginVertical: 5}}
              />
              {emailError && <Text style={{color: Red,fontSize: 12,marginHorizontal: 3}}>{emailError}</Text>}
              <CustomInput
               label="Password"
               placeholder="********"
               value={password}
               onChangeText={(text) => {
                setPassword(text);
                if (text.length >= 8) setPasswordError("");
               }}
               root="password"
               style={{marginVertical: 5}}
               secureTextEntry={true}
              />
              {passwordError && <Text style={{color: Red,fontSize: 12,marginHorizontal: 3}}>{passwordError}</Text>}
            </View>
            <TouchableOpacity
                  activeOpacity={0.7}
                  disabled={isSubmiting}
                  onPress={() => {
                    submittosignin()
                  }}
                        style={{ backgroundColor: Primary, padding: 10, borderRadius: 10, width:  windowWidth * 0.8, marginTop: 10 }}
                      >
                       {isSubmiting ? (
                        <ActivityIndicator size={16} color="#fff" />
                     ) : (
                     <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '500' }}>
                      Signin
                   </Text>
                    )}
            </TouchableOpacity>
            </View>
            <View style={{marginTop: 40}}>
            <Text style={{color:"#788481"}}>Don't have an account? {''} 
                <Text 
                style={{color: "#ff8c00",fontWeight: 600}}
                onPress={() => {
                router.push("/signup")
            }}>Sign up</Text>
            </Text>
        </View>
        </View>
        
     </SafeAreaView>
     </KeyboardAvoidingView>
    </LinearGradient>
  )
}

export default Signin

const styles = StyleSheet.create({})