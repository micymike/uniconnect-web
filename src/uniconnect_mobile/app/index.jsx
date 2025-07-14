import { useNotification } from "@/context/NotificationContext";
import { Gray, Primary, secondary } from "@/utils/colors";
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Dimensions, Text, TouchableOpacity, View, ActivityIndicator, Alert, Image, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAuthData, validateReferralCode, syncPushTokenToUser } from "../lib/auth/emailpassword";
import { googleOAuth, checkIfUserExists, currentuserInfo } from "../lib/auth/googleoauth"
import * as FileSystem from 'expo-file-system';
import { signIn, signupwithemail, updateGoogleImg } from "../lib/auth/emailpassword";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomReferralModal from "../components/customreferralmodal"
import { useToast } from "@/context/ToastProvider";

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

export default function Index() {
  const { error, notification, expoPushToken } = useNotification();
  const [userHasSession, setUserHasSession] = useState(false);
  const [isSubmittingToGoogle, setIsSubmittingToGoogle] = useState(false);
  const [isLoad, setIsLoad] = useState(false)
  const { showSuccess, showError } = useToast();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastStatus, setToastStatus] = useState("")

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalerror, setModalError] = useState("")
  const [tempGoogleData, setTempGoogleData] = useState(null);

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

  const openModal = () => {
    setIsModalVisible(true);
    setIsSubmittingToGoogle(true)
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setIsSubmittingToGoogle(false)
    setModalError("");
  };

  const handleContinue = async (referralCode) => {
    if (!referralCode || referralCode.trim() === "") {
      closeModal();
      // Continue with signup using empty referral code
      if (tempGoogleData) {
        proceedWithSignup("");
      }
      return;
    }
    setIsSubmittingToGoogle(true);
    try{
      const isValid = await validateReferralCode(referralCode.trim());

      if (isValid) {
        closeModal();
        if (tempGoogleData) {
          proceedWithSignup(referralCode.trim());
        }
      }else {
        setModalError("Invalid referral code");
      }

    }catch(error){
      console.log("error valid referal", error)

    }finally{
      // setIsSubmittingToGoogle(false); 
    }

  };

  const proceedWithSignup = async (referralCode) => {
    if (!tempGoogleData) return;
    
    setIsSubmittingToGoogle(true);
    setIsLoad(true);
    
    try {
      const result = await signupwithemail(
        tempGoogleData.googleemail,
        tempGoogleData.googlepassword,
        tempGoogleData.googleusername,
        tempGoogleData.googlePhotoUrl,
        referralCode,
        tempGoogleData.emailpasswordBoolean,
        expoPushToken || ""
      );

      if (!result || result.success === false) {
        console.log("error signup with google");
        showError("Failed to create account");
      } else {
        console.log("Signup successful:", result);
        const session = await signIn(
          tempGoogleData.googleemail, 
          tempGoogleData.googlepassword, 
          tempGoogleData.emailpasswordBoolean
        );
        
        if (session.success) {
          const userWithImage = {
            ...session.user,
            profileImage: tempGoogleData.localPhotoPath, 
          };
          
          await AsyncStorage.setItem("user", JSON.stringify(userWithImage));
          await AsyncStorage.setItem("session", JSON.stringify(session.session));
          router.replace("/rentals"); 
        } else {
          console.log("Sign in failed after signup:", session);
          // showError(session.message || "Failed to sign in after account creation, check your connection and try again");
        }
      }
    } catch (error) {
      console.error("Error in proceedWithSignup:", error);
      setToastMessage("Failed to create account, check your internet connection and try again");
      setToastStatus("error");
      setToastVisible(true);
    } finally {
      setIsSubmittingToGoogle(false);
      setIsLoad(false);
      setTempGoogleData(null); // Clean up temp data
    }
  };

  useEffect(() => {
    const checkUserInfo = async () => {
      setIsCheckingAuth(true);
      try {
        const { user, session } = await getAuthData();
        
        if (user && session) {
          setUserHasSession(true);
        } else {
          console.log("not found")
        }
      } catch (error) {
        console.error("Error retrieving user info:", error);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkUserInfo();
  }, []);

  useEffect(() => {
    if (userHasSession && !isCheckingAuth) {
      router.replace("/rentals");
    }
  }, [userHasSession,isCheckingAuth])

  const submittoGoogle = async (referralCode = null) => {
    setIsSubmittingToGoogle(true);
    setIsLoad(true);
    
    try {
      const result = await googleOAuth();

      if (!result || !result.data || !result.data.user) {
        showError("Sign-in process was cancelled, try again.");
        return
      }

      const googleusername = result.data.user.name;
      const googleemail = result.data.user.email;
      const googlepassword = `${googleemail}_GPass#123`;
      const googlePhotoUrl = result.data.user.photo;
      const emailpasswordBoolean = false;

      let localPhotoPath = null;
      if (googlePhotoUrl) {
        const fileName = googlePhotoUrl.split('/').pop(); 
        localPhotoPath = `${FileSystem.documentDirectory}${fileName}`;

        try {
          const { uri } = await FileSystem.downloadAsync(googlePhotoUrl, localPhotoPath);
          localPhotoPath = uri; 
        } catch (downloadError) {
          console.error("Error downloading photo:", downloadError);
          localPhotoPath = null;
        }
      }

      const userExists = await checkIfUserExists(googleemail);

      if (userExists) {
        console.log(userExists);
        // USER EXISTS - SIGN IN (No referral modal needed)
        try {
          const session = await signIn(googleemail, googlepassword,emailpasswordBoolean);

          if(!session.success){
            // showError(session.message)
          }else{
            console.log("Sign-in response:", session);
          }

          const userWithImage = {
            ...session.user,
            profileImage: localPhotoPath, 
          };
          
          await AsyncStorage.setItem("user", JSON.stringify(userWithImage));
          await AsyncStorage.setItem("session", JSON.stringify(session.session));

          await updateGoogleImg({
            googleemail: session.user.email,
            googlePhotoUrl: googlePhotoUrl,
          });

          if (expoPushToken) {
            console.log("exi",expoPushToken)
            await syncPushTokenToUser(expoPushToken);
          }


          router.push("/rentals");
        } catch (error) {
          showError("Failed to create a session, check your internet connection and try again");
          setToastStatus("error");
          setToastVisible(true);
        }
      } else {
        // USER DOESN'T EXIST - SHOW REFERRAL MODAL FOR SIGNUP
        if (referralCode === null) {
          // First time calling this function, show modal
          setIsSubmittingToGoogle(false);
          setIsLoad(false);
          openModal();
          
          // Store the user data temporarily for when modal completes
          setTempGoogleData({
            googleusername,
            googleemail,
            googlepassword,
            googlePhotoUrl,
            localPhotoPath,
            emailpasswordBoolean
          });
          return; // Exit here to show modal
        }
        
        // This runs after modal is completed with referralCode
        try {
          const result = await signupwithemail(
            googleemail,
            googlepassword,
            googleusername,
            googlePhotoUrl,
            referralCode || "",
            emailpasswordBoolean,
            expoPushToken || ""
          );

          if (!result || result.success === false) {
            
            console.log("error signup with google",result);
          } else {
            console.log("Signup successful:", result);
            const session = await signIn(googleemail, googlepassword,emailpasswordBoolean);
            
            if (session.success) {
              const userWithImage = {
                ...session.user,
                profileImage: localPhotoPath, 
              };
              
              await AsyncStorage.setItem("user", JSON.stringify(userWithImage));
              await AsyncStorage.setItem("session", JSON.stringify(session.session));

              router.replace("/rentals"); 
            }
          }
        } catch (error) {
          showError("Failed to create account, check your internet connection and try again");
          setToastStatus("error");
          setToastVisible(true);
        }
      }
    } catch (error) {
      console.log("google error ", error);
    } finally {
      setIsSubmittingToGoogle(false);
      setIsLoad(false);
    }
  };

  if (isCheckingAuth || userHasSession) {
    return (
      <LinearGradient
        colors={["#464646", "#464646", "#030406", "#000", "#000", "#000"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="small" color={Primary} />
            <Text style={{ color: "#fff", marginTop: 10, fontSize: 14 }}>
              {isCheckingAuth ? "Checking session..." : "Redirecting..."}
            </Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#464646", "#464646", "#030406", "#000", "#000", "#000"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 16 }}>

          <View style={{ flex: 0.1 }} />
          <View style={{ gap: 10, alignItems: "center", marginVertical: 20 }}>
            
            <View>
              <Text style={{ color: "#fff", fontSize: 22, fontWeight: "800", textAlign: "center" }}>
                Find It. Have It. List It.
              </Text>
              <Text style={{ color: Primary, textAlign: "center", fontSize: 23, fontWeight: "800" }}>Uniconnect.</Text> 
            </View>
            <Text style={{ color: "#CBCED4", fontSize: 14, fontWeight: "500", textAlign: "center", maxWidth: "86%" }}>
              Find rental spaces, buy what you need, and sell what you no longer use
            </Text>
          </View>

          <View style={{ flex: 0.8 }} />
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Image
              style={{ width: 120, height: 120, borderRadius: 60 }}
              source={require("../assets/icons/adaptive-icon.png")}
            />
            <Text style={{ textAlign: "center", fontWeight: "500", color: "#fff", fontSize: 20, fontWeight: 700, marginBottom: 7 }}>Welcome To <Text style={{ color: Primary }}>Uniconnect</Text></Text>
            <Text style={{ textAlign: "center", fontWeight: "500", color: "#788481", marginBottom: 10, fontSize: 14 }}>Sign In to access your account</Text>

            <View style={{ width: windowWidth, justifyContent: "center", alignItems: "center", flexDirection: "column", marginVertical: 10 }}>
              <TouchableOpacity 
                activeOpacity={0.7}
                disabled={isSubmittingToGoogle}
                onPress={() => submittoGoogle()}
                style={{ width: "80%", backgroundColor: secondary, padding: 12, borderRadius: 9, marginBottom: 20, flexDirection: "row", alignItems: "center", justifyContent: "center", borderWidth: 0.4, borderColor: Gray }}>
                {isSubmittingToGoogle ? (
                  <ActivityIndicator size={16} color="#fff" />
                ) : (
                  <>
                    <Ionicons name="logo-google" size={14} color="#fff" />
                    <Text style={{ textAlign: "center", fontWeight: "600", color: "white", marginLeft: 10 }}>Continue With Google</Text>
                  </>
                )}
              </TouchableOpacity>

              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                <View style={{ backgroundColor: Gray, width: 70, height: 1 }} />
                <Text style={{ color: "white", marginHorizontal: 10 }}>OR</Text>
                <View style={{ backgroundColor: Gray, width: 70, height: 1 }} />
              </View>

              <TouchableOpacity 
                activeOpacity={0.7}
                onPress={() => {
                  router.push("/signin")
                }}
                style={{ width: "80%", backgroundColor: Primary, padding: 10, borderRadius: 9, marginBottom: 20, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                <Ionicons name="mail-outline" size={18} color="#fff" />
                <Text style={{ textAlign: "center", fontWeight: "600", color: "white", marginLeft: 10 }}>Sign In with Email</Text>
              </TouchableOpacity>

              <View style={{ marginTop: 10 }}>
                <Text style={{ color: "#788481" }}>Don't have an account? {''} 
                  <Text style={{ color: "#ff8c00", fontWeight: 600 }} onPress={() => { router.push("/signup") }}>Signup</Text>
                </Text>
              </View>

              <View style={{ width: windowWidth, backgroundColor: Gray, height: 0.11, marginTop: 30 }} />

            </View>
          </View>

          <View style={{ marginVertical: 10, justifyContent: "center", alignItems: "center", paddingVertical: 5 }}>
            <Text style={{ color: "#788481" }}>© 2025 Uniconnect. All rights reserved.</Text>
            <View style={{ flexDirection: "row", justifyContent: "space-evenly", alignItems: "center", marginTop: 6, width: windowWidth * 0.45 }}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  Linking.openURL('https://www.uniconnect.store/terms');
                }}
              >
                <Text style={{ color: "#788481" }}>Terms</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  Linking.openURL('https://www.uniconnect.store/privacy');
                }}
              >
                <Text style={{ color: "#788481" }}>Privacy</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  Linking.openURL('https://www.uniconnect.store/contact');
                }}
              >
                <Text style={{ color: "#788481" }}>Help</Text>
              </TouchableOpacity>
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
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}