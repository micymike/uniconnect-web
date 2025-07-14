import { StyleSheet, Text, View ,Dimensions,TouchableOpacity} from 'react-native'
import React, {useState} from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Gray, Primary, secondary,Red } from "../../utils/colors"
import CustomInput from '../../components/custominput';
import { StatusBar } from 'expo-status-bar'
import {recoverPassword} from "../../lib/auth/emailpassword"
import { useToast } from "@/context/ToastProvider";


const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const Forgotpassword = () => {
    const { showSuccess, showError } = useToast();
    const [email , setEmail] = useState("")
    const [isSubmiting, setIsSubmiting] = useState(false)

    const [emailError , setEmailError] = useState("")

    const submittoreset = async () => { 
        try{
          let hasError = false;
  
          if(!email){
            showError("Please input your email!");
            setEmailError("Email is required")
            hasError = true;
          }

  
          if (hasError) return;
  
  
          setIsSubmiting(true)
  
          const result = await recoverPassword(email);
  
           if (!result.success) {
             if (result.message.includes("No account is associated with this email.")) {
                showError("Confirm your email and try again!");
             } else {
              showSuccess("We have sent you an email to reset your password")
               console.log("recover failed:", result.message);
             }
             return;
           }
      
  
        }catch(e){
          console.log("reset password err", e)
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
            {/* <Image
              style={{ width: 60, height: 60 }}
              source={require("../assets/images/react-logo.png")}
            /> */}
            <Ionicons name="logo-github" size={22} color="#fff" style={{padding: 15,borderRadius: 40,backgroundColor: Primary}} />
            <Text style={{ textAlign: "center", fontWeight: "500",color: "#fff",fontSize: 21,fontWeight: 700,marginVertical: 10 }}>Reset Password</Text>
            <Text style={{ textAlign: "center", fontWeight: "500" ,color: "#788481",marginBottom: 10,fontSize: 15}}>Enter your email address and we'll send you a link to reset your password</Text>
            <View style={{marginVertical: 20}}>
              <CustomInput
                label="Email Address"
                placeholder="testemail@gmail.com"
                value={email}
                onChangeText={(text) => {
                    setEmail(text);
                    if (text.length > 0) setEmailError("");
                }}
                style={{marginVertical: 5}}
              />
              {emailError && <Text style={{color: Red,fontSize: 12,marginHorizontal: 3}}>{emailError}</Text>}
              
            </View>
            <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    submittoreset()
                  }}
                        style={{ backgroundColor: Primary, padding: 10, borderRadius: 10, width:  windowWidth * 0.8, marginTop: 10 }}
                      >
                        <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '500' }}>Send Reset Link</Text>
            </TouchableOpacity>
            </View>
            <View style={{marginTop: 40}}>
            <Text style={{color:"#788481"}}>Remember your password? {''} 
                <Text 
                style={{color: "#ff8c00",fontWeight: 600}}
                onPress={() => {
                router.push("/signin")
            }}>Sign in</Text>
            </Text>
        </View>
        </View>
        
     </SafeAreaView>
    </LinearGradient>
  )
}

export default Forgotpassword

const styles = StyleSheet.create({})