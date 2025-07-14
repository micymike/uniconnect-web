import { StyleSheet, Text, View ,Dimensions,TouchableOpacity,ActivityIndicator,Image,KeyboardAvoidingView, Platform, } from 'react-native'
import React, {useState} from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Gray, Primary, secondary,Red } from "../../utils/colors"
import CustomInput from '../../components/custominput';
import { signupwithemail,signIn,getAuthData ,validateReferralCode } from '../../lib/auth/emailpassword';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomReferralModal from "../../components/customreferralmodal"
import { useToast } from "@/context/ToastProvider";
import { syncPushTokenToUser } from '../../lib/auth/emailpassword';
import { useNotification } from "@/context/NotificationContext";


const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const Signup = () => {
    const { error, notification, expoPushToken } = useNotification();
    const [username, setUsername] = useState("")
    const [email , setEmail] = useState("")
    const [password, setPassword] = useState("")
    const emailpasswordBoolean = true
    const [isSubmiting, setIsSubmiting] = useState(false)
    const { showSuccess, showError } = useToast();

    const [usernameError, setUsernameError] = useState("")
    const [emailError , setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [referralCodeFromModal, setReferralCodeFromModal] = useState(null);
    const [shouldContinueWithGoogle, setShouldContinueWithGoogle] = useState(false);
    const [modalerror, setModalError] = useState("")
    const [isLoad,setIsLoad] = useState(false)
  
    const openModal = () => {
      setIsModalVisible(true);

    };

    const closeModal = () => {
      setIsModalVisible(false);
      setModalError("");
    };

    const handleContinue =async  (referralCode) => {
      console.log('Referral Code Entered:', referralCode);
      if (!referralCode || referralCode.trim() === "") {
       closeModal();
       setReferralCodeFromModal(null);
       setShouldContinueWithGoogle(true);
       return;
      }
       const isValid = await validateReferralCode(referralCode.trim());

      if (isValid) {
        closeModal();
        setReferralCodeFromModal(referralCode.trim());
      } else {
        setModalError("Invalid referral code")
      }
    }
    

    const checkAuth = async () => {
      const { user, session } = await getAuthData();
      console.log("Stored User:", user);
      console.log("Stored Session:", session);
    };

    // const submittosignup = async () => { 
    //     try{
    //       let hasError = false;

    //       if(!username){
    //         setUsernameError("Username is required")
    //         hasError = true;
    //       }
  
    //       if(!email){
    //         setEmailError("Email is required")
    //         hasError = true;
    //       }else {
    //         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //         if (!emailRegex.test(email)) {
    //           setEmailError("Please enter a valid email address");
    //           hasError = true;
    //         }
    //       }
  
    //       if(!password || password.length < 8){
    //         setPasswordError("Password must be at least 8 characters long")
    //         hasError = true;
    //       }
  
    //       if (hasError) return;
  
  
    //       setIsSubmiting(true)

    //       console.log("Using referral code:", referralCodeFromModal);

  
    //       const result = await signupwithemail(email,password, username,null,referralCodeFromModal,emailpasswordBoolean);
  
    //       if (!result.success) {
    //         if (result.message.includes("Email is already taken")) {
    //           setEmailError(result.message);
    //         } else {
    //           console.log("Signup failed:", result.message);
    //         }
    //         return;
    //       }

    //       const session = await signIn(email, password)

    //       if(session.success){
    //         console.log("session",session)

    //         await AsyncStorage.setItem("user", JSON.stringify(session.user));
    //         await AsyncStorage.setItem("session", JSON.stringify(session.session));

    //         setEmail("");
    //         setPassword("");
    //         setUsername("");

    //         setEmailError("");
    //         setPasswordError("");
    //         setUsernameError("");

    //          router.replace("/rentals"); 

    //       }
    //       console.log("Signup success");
  
    //     }catch(e){
    //       console.log("sign up err", e)
    //     }finally{
    //       setIsSubmiting(false)
    //     }
    //   }

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
        }else {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(email)) {
            setEmailError("Please enter a valid email address");
            hasError = true;
          }
        }

        if(!password || password.length < 8){
          setPasswordError("Password must be at least 8 characters long")
          hasError = true;
        }

        if (hasError) return;

        setIsSubmiting(true)

        console.log("Using referral code:", referralCodeFromModal);

        // Step 1: Sign up the user
        const result = await signupwithemail(email, password, username, null, referralCodeFromModal, emailpasswordBoolean, expoPushToken || "");

        if (!result.success) {
          if (result.message.includes("Email is already taken")) {
            setEmailError(result.message);
          } else {
            console.log("Signup failed:", result.message);
            // You might want to show a general error message to the user here
          }
          return; // Exit if signup fails
        }

        console.log("Signup success, now signing in...");

        // Step 2: Sign in the user
        const session = await signIn(email, password,emailpasswordBoolean);

        if (session.success) {
          console.log("Sign-in successful:", session);

          // Step 3: Store user data
          await AsyncStorage.setItem("user", JSON.stringify(session.user));
          await AsyncStorage.setItem("session", JSON.stringify(session.session));

          // Step 4: Clear form
          setEmail("");
          setPassword("");
          setUsername("");
          setEmailError("");
          setPasswordError("");
          setUsernameError("");
          setReferralCodeFromModal(null)


          router.replace("/rentals");
          
        } else {
          console.log("Sign-in failed:", session.message || "Unknown error");
          
          // Handle sign-in failure - maybe show an error or try again
          // You could set an error state here to inform the user
        }

      } catch(e) {
        console.log("sign up error:", e);
        // Consider showing an error message to the user
      } finally {
        setIsSubmiting(false);
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
            <Text style={{ textAlign: "center", fontWeight: "500",color: "#fff",fontSize: 21,fontWeight: 700,marginVertical: 10 }}>Sign up for an account</Text>
            <Text style={{ textAlign: "center", fontWeight: "500" ,color: "#788481",marginBottom: 10,fontSize: 15}}>Create a new account to get started</Text>
            <View style={{marginVertical: 20}}>
              <CustomInput
                label="UserName"
                placeholder="John Doe"
                value={username}
                onChangeText={(text) => {
                    setUsername(text);
                    if (text.length > 0) setUsernameError("");
                }}
                style={{marginVertical: 5}}
              />
              {usernameError && <Text style={{color: Red,fontSize: 12,marginHorizontal: 3}}>{usernameError}</Text>}
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
               style={{marginVertical: 5}}
               secureTextEntry={true}
              />
              {passwordError && <Text style={{color: Red,fontSize: 12,marginHorizontal: 3}}>{passwordError}</Text>}
            </View>
            <TouchableOpacity
                  activeOpacity={0.7}
                  disabled={isSubmiting}
                  onPress={() => {
                    submittosignup()
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

            <TouchableOpacity 
            onPress={() => {
              openModal()
            }}
            style={{flexDirection: "row",justifyContent: "flex-start",width: windowWidth,alignItems: "center",marginLeft: 60,marginTop: 10}}>
              <Ionicons name="gift-sharp" size={12} color={Primary} style={{}} />
              <Text style={{color: Primary,marginHorizontal: 10}}>Have a referral code?</Text>
            </TouchableOpacity>
            
            </View>
            <View style={{marginTop: 50,}}>
              
            <Text style={{color:"#788481",alignSelf: "center"}}>Already have an account? {''} 
                <Text 
                style={{color: "#ff8c00",fontWeight: 600}}
                onPress={() => {
                router.push("/signin")
                // checkAuth()
            }}>Sign In</Text>
            </Text>
        </View>
        </View>

        <View>
            <CustomReferralModal
              isVisible={isModalVisible}
              onClose={closeModal}
              onContinue={handleContinue}
              isLoading={isLoad}
              modalerror={modalerror}
            />

          </View>
        
     </SafeAreaView>
     </KeyboardAvoidingView>
    </LinearGradient>
  )
}

export default Signup

const styles = StyleSheet.create({})