import { StyleSheet, Text, View, ScrollView, TouchableOpacity,Switch,Dimensions,ActivityIndicator,Image ,} from 'react-native';
import React, { useState, useEffect,useCallback  } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/header';
import { Primary, white, Gray, secondary, silver } from '../../utils/colors';
import { Ionicons } from '@expo/vector-icons';
import { getAuthData } from '../../lib/auth/emailpassword';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Avatar from '../../components/avatar';
import BusinessProfileCard from '../../components/businessprofilecard';
import { router } from 'expo-router';
import { signOut } from '../../lib/auth/emailpassword';
import * as FileSystem from 'expo-file-system';
import { storeUsersBusiness } from '../../lib/business/business';
import { useFocusEffect } from 'expo-router';
import CreateBusinessBanner from '../../components/CreateBusinessBanner';
import LifeTipsBanner from '../../components/lifetipbanner';
import { useToast } from '@/context/ToastProvider';
import { useAuthGuard } from '../../utils/useAuthGuard';


const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const Profile = () => {
    const { showError, showSuccess } = useToast();
    const [businessMode, setBusinessMode] = useState(false);
    const [username , setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [profileImg, setProfileImg] = useState("")
    const [joinedAt, setJoinedAt] = useState("")
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [businessData, setBusinessData] = useState(null);
    const [isBusinessLoading, setIsBusinessLoading] = useState(true);
    const { isAuthenticated, checking } = useAuthGuard('/');


    const formatMonthYear = (isoDate) => {
      const date = new Date(isoDate);
      const options = { year: 'numeric', month: 'long' };
      return new Intl.DateTimeFormat('en-US', options).format(date);
    };

    useEffect(() => {
     const checkUserInfo = async () => {
    try {
      const { user} = await getAuthData();

      if (user) {
        setEmail(user.email);
        setUsername(user.name);

        const formattedDate = formatMonthYear(user.$createdAt);
        setJoinedAt(formattedDate); 
      } else {
        router.replace("/")
        console.log("not found")
      }
    } catch (error) {
      console.error("Error retrieving user info:", error);
    } finally {
    }
  };

  checkUserInfo();
}, []);  

  const logout = async () => {
      setIsLoggingOut(true);
      try{
        
        const result = await signOut();

        if (!result.success) {
          showError("Sign-out failed. Please try again or check your connection.");
          return;
        }

        const userInfoString = await AsyncStorage.getItem('user');
        if (userInfoString) {
          const userInfo = JSON.parse(userInfoString);

          if (userInfo.profileImage) {
            try {
              const fileInfo = await FileSystem.getInfoAsync(userInfo.profileImage);
              if (fileInfo.exists) {
                await FileSystem.deleteAsync(userInfo.profileImage);
              }
            } catch (deleteError) {
              console.error("Error deleting profile image:", deleteError);
            }
          }
        }
        await AsyncStorage.removeItem('user')

        await AsyncStorage.removeItem('session')

        await AsyncStorage.removeItem('business')

        router.push("/")


      }catch(error){
        console.log("signout error", error)
      
      } finally {
        setIsLoggingOut(false);
      }
    }

useEffect(() => {
  const loadProfileImage = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        const imagePath = parsedUser.profileImage;

        if (imagePath) {
          const fileInfo = await FileSystem.getInfoAsync(imagePath);
          if (fileInfo.exists) {
            setProfileImg(imagePath);
          }
        }
      }
    } catch (error) {
      console.error("Error loading profile image:", error);
    }
  };

  loadProfileImage();
}, []);

const syncBusinessData = async () => {
    setIsBusinessLoading(true);
  try{
    const stored = await AsyncStorage.getItem('business');
    const storedBusiness = stored ? JSON.parse(stored) : null;

    setBusinessData(storedBusiness);
    const newBusiness = await storeUsersBusiness(); 

    if (
      newBusiness &&
      (!storedBusiness ||
        newBusiness.$id !== storedBusiness.$id ||
        newBusiness.$updatedAt !== storedBusiness.$updatedAt)
    ) {
      setBusinessData(newBusiness);
    }


  }catch(error){
    console.warn("Offline or failed to fetch business:", error.message);
  }finally{
    setIsBusinessLoading(false);
  }
}
useFocusEffect(
  useCallback(() => {
    syncBusinessData();
  }, [])
);


  return (
    <LinearGradient
      colors={['#030406', '#000']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
    <SafeAreaView style={{ flex: 1 }}>
      <Header title="Profile" color={white} Size={19} />
      <View  style={{ marginBottom: 4,paddingHorizontal: 16,height: windowHeight * 0.22,justifyContent: "center"}}>
           <View style={{flexDirection: 'row',alignItems: 'center',marginTop: 10}}>
                {profileImg ? (
                  <Image
                    source={{ uri: profileImg }}
                    style={{ width: 65, height: 65, borderRadius: 32.5 }}
                  />
                ) : (
                  <Avatar name={username} size={65} />
                )}
              <View style={{ marginLeft: 12,}}>
                <Text numberOfLines={1} style={{fontSize: 17,fontWeight: 600,color: "#fff",}}>{username}</Text>
                <Text numberOfLines={1} style={{color: '#f3f4f4',color: white,fontSize: 14,marginVertical: 2}}>{email}</Text>
                <Text numberOfLines={1} style={{color: white,}}>Joined {joinedAt}</Text>
              </View>
           </View>
           <View style={{marginTop: 15,flexDirection: 'row',justifyContent: 'space-between',alignItems: 'center',paddingVertical: 7,backgroundColor: secondary,width: windowWidth * 0.89,borderRadius: 10,paddingHorizontal: 10,alignSelf: "center"}}>
             <Text style={{color: white,fontSize: 15,fontWeight: 500}}>Business Mode</Text>
             <Switch value={businessMode} 
              onValueChange={() => setBusinessMode(!businessMode)} 
              trackColor={{ false: '#374151', true: `${Primary}40` }}
              thumbColor={businessMode ? Primary : '#9CA3AF'}
              ios_backgroundColor="#374151"
             />
            </View>
        </View>
        <ScrollView 
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          style={{width: windowWidth,flex: 1}} contentContainerStyle={{justifyContent: "center",alignItems: "center",marginTop: 10,paddingBottom: 30}}>
              <View>
              <View style={{width: windowWidth * 0.9,}}>
              

                {businessMode ? (
                  isBusinessLoading ? (
                    <>
                      <LifeTipsBanner />
                    </>
                  ) : businessData ? (
                    <BusinessProfileCard
                      name={businessData.name}
                      category={'Rental & market'}
                      joinedAt={formatMonthYear(businessData.$createdAt)}
                      onPress={() => router.push('/dashboard')}
                    />
                  ) : (
                    <CreateBusinessBanner onCreatePress={() => router.push('/createbusiness')} />
                  )
                ) : (
                  <LifeTipsBanner />
                )}

                
                

                 <View style={{marginTop: 25,borderRadius: 12,padding: 16,}}>
                   <Text style={{fontSize: 16,fontWeight: 500,paddingVertical: 10,color: white}}>Settings</Text>
                   {/* <TouchableOpacity 
                    onPress={() => {
                      router.push("/privacynotificationsetting")
                    }}
                    activeOpacity={0.6}
                    style={{flexDirection: 'row',alignItems: 'center',paddingVertical: 12,}}>
                    <View style={{width: 30,alignItems: 'center',}}>
                      <Ionicons name="person-circle-outline" size={21} color="#777" />
                    </View>
                    <Text style={{ flex: 1,fontSize: 15,marginLeft: 10,color: white}}>Account Settings</Text>
                      <Ionicons name="chevron-forward" size={18} color="#aaa" style={{marginRight: 6,}} />
                   </TouchableOpacity> */}

                   

                   <TouchableOpacity 
                    onPress={() => {
                      router.push("/subscription")
                    }}
                    activeOpacity={0.6}
                    style={{flexDirection: 'row',alignItems: 'center',paddingVertical: 12,}}>
                    <View style={{width: 30,alignItems: 'center',}}>
                      <Ionicons name="card-outline" size={21} color="#777" />
                    </View>
                    <Text style={{ flex: 1,fontSize: 15,marginLeft: 10,color: white}}>Payment Settings</Text>
                      <Ionicons name="chevron-forward" size={18} color="#aaa" style={{marginRight: 6,}} />
                   </TouchableOpacity>

                   <TouchableOpacity 
                    onPress={() => {
                      router.push("/referral")
                    }}
                    activeOpacity={0.6}
                    style={{flexDirection: 'row',alignItems: 'center',paddingVertical: 12,}}>
                    <View style={{width: 30,alignItems: 'center',}}>
                      <Ionicons name="logo-usd" size={21} color="#777" />
                    </View>
                    <Text style={{ flex: 1,fontSize: 15,marginLeft: 10,color: white}}>Referral Program</Text>
                      <Ionicons name="chevron-forward" size={18} color="#aaa" style={{marginRight: 6,}} />
                   </TouchableOpacity>

                   <TouchableOpacity 
                    onPress={() => {
                      router.push("/help")
                    }}
                    activeOpacity={0.6}
                    style={{flexDirection: 'row',alignItems: 'center',paddingVertical: 12,}}>
                    <View style={{width: 30,alignItems: 'center',}}>
                      <Ionicons name="help-circle-outline" size={21} color="#777" />
                    </View>
                    <Text style={{ flex: 1,fontSize: 15,marginLeft: 10,color: white}}>Help Center</Text>
                      <Ionicons name="chevron-forward" size={18} color="#aaa" style={{marginRight: 6,}} />
                   </TouchableOpacity>
                   
                  </View>

                  <TouchableOpacity
                    disabled={isLoggingOut}
                 onPress={() => {
                  logout()
                }}
                activeOpacity={0.6}
                 style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'center',paddingVertical: 10,marginTop: 10,backgroundColor: 'rgba(239, 68, 68, 0.2)',borderRadius: 12}}>
                   {isLoggingOut ? (
                    <ActivityIndicator size={16} color="#EF4444" />
                    ) : (
                      <>
                      <Ionicons name="log-out-outline" size={18} color="#EF4444" />
                    <Text style={{ color: '#EF4444', fontSize: 15, fontWeight: '500', marginLeft: 6 }}>
                      Log Out
                    </Text>
                 </>
                 )}
                 </TouchableOpacity>
              </View>
              
              </View>
        </ScrollView>

    </SafeAreaView>
    </LinearGradient>
  )
}

export default Profile

const styles = StyleSheet.create({})