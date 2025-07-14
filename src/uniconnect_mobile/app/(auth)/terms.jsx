import { StyleSheet, Text, View ,Dimensions,TouchableOpacity,ScrollView} from 'react-native'
import React, {useState} from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Gray, Primary, secondary,Red } from "../../utils/colors"
import TermsCard from '../../components/termscard';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const Terms = () => {
    const [username, setUsername] = useState("")
    const [email , setEmail] = useState("")
    const [subject, setSubject] = useState("")
    const [message, setMessage] = useState("")
    const [isSubmiting, setIsSubmiting] = useState(false)

    const [usernameError, setUsernameError] = useState("")
    const [emailError , setEmailError] = useState("")
    const [subjectError, setsubjectError] = useState("")
    const [messageError, setmessageError] = useState("")

    const submittosignup = async () => { 
        try{
          let hasError = false;

          if(!username){
            setUsernameError("Username is required")
            hasError = true;
          }
  
          if(!email){
            setEmailError("Email is required")
            hasError = true;
          }
  
          if(!subject){
            setsubjectError("Subject is required")
            hasError = true;
          }

          if(!message){
            setmessageError("Subject is required")
            hasError = true;
          }
  
          if (hasError) return;
  
  
          setIsSubmiting(true)
  
        //   const result = await signUp(email,password, username);
  
        //   if (!result.success) {
        //     if (result.message.includes("Email is already taken")) {
        //       setEmailError(result.message);
        //     } else {
        //       console.log("Signup failed:", result.message);
        //     }
        //     return;
        //   }
      
        //   console.log("Signup success");
  
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

        

        <View style={{width: windowWidth * 0.9,height: windowHeight * 0.88,marginVertical: 5,justifyContent: "center",alignItems:"center",borderRadius: 12}}>
            <View style={{justifyContent: "center",alignItems: "center",}}>
           
            <Text style={{ textAlign: "center", fontWeight: "500",color: "#fff",fontSize: 21,fontWeight: 700,marginVertical: 10 }}>Terms of Service</Text>
            <Text style={{ textAlign: "center", fontWeight: "500" ,color: "#CBCED4",marginBottom: 10,fontSize: 15}}>These are the basic terms for using our app. By using our services, you agree to these terms.</Text>
            <View style={{marginVertical: 20}}>
              
            </View>
            <ScrollView style={{flex: 1,width: windowWidth,paddingVertical: 30,paddingHorizontal: 20}}>
            <TermsCard
             title="Your Account"
             points={[
               "You must provide accurate information when creating an account",
               "Keep your password secure",
                "You're responsible for all activity on your account"
             ]}
            />
            <TermsCard
             title="Using Our Services"
             points={[
               "Use our services legally and responsibly",
               " Don't post harmful, illegal, or offensive content",
               "We can remove content that violates our terms",
               "We may update our services at any time"
             ]}
            />
            <TermsCard
             title="Your Privacy"
             points={[
               " We collect and use your data as described in our Privacy Policy",
               "We take reasonable steps to protect your information",
               " You can access and update your personal information",
             ]}
            />
            </ScrollView>
            
            </View>
            
        </View>
        
     </SafeAreaView>
    </LinearGradient>
  )
}

export default Terms

const styles = StyleSheet.create({})