import { StyleSheet, Text, View,Image ,TouchableOpacity,Linking} from 'react-native'
import React, {useState,useEffect} from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import { Primary, secondary, silver, white } from '../utils/colors';
import Avatar from "../components/avatar"
import { useToast } from "@/context/ToastProvider";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getOrCreateChatRoom } from '../lib/chat/chat';
import { getBusinessByUserId } from '../lib/business/business';
import { router } from 'expo-router';

const Contactcard = ({name, type, phoneNumber = "",ownerId}) => {
  const { showSuccess, showError } = useToast();
  const [currentUserId, setcurrentUserId] = useState("")
  const [currentUsername, setCurrentUsername] = useState("");


  console.log("n",name)

  useEffect(() => {
    const getUser = async () => {
      try {
        const user = await AsyncStorage.getItem("user")
        if (user) {
          const userInfo = JSON.parse(user)
          setcurrentUserId(userInfo.$id)
          const extractedName = userInfo.name || userInfo.username || "User";
          setCurrentUsername(extractedName);

        }
      } catch (error) {
        console.error("Error fetching user:", error)
      }
    }
    getUser()
  }, [])

  const callPhoneNumber = async () => {
    if(phoneNumber){
        const url = `tel:+254${phoneNumber}`;
        await Linking.openURL(url).catch((err) => console.error("Error making a call:", err));
    }else{
      showError("Supplier contact number is not available at the moment")
    }
  };

  const startChat = async () => {
    if (!currentUserId) return showError("User not authenticated")
    if (!ownerId) return showError("Owner not found")
    if (currentUserId === ownerId) return showError("You cannot chat with yourself")

    try{
      const businessRes = await getBusinessByUserId(ownerId);
      const businessName = businessRes.success ? businessRes.business.name : "Business";
      // console.log("businessName",businessName)
      
      const res = await getOrCreateChatRoom(currentUserId, ownerId,currentUsername,businessName)

      if (res.success) {
        router.push({
          pathname: "/chatroom",
          params: {
            chatroomId: res.chatroom.$id,
            title: name,
          },
        })
      } else {
        showError("Failed to start chat")
      }

    }catch(error){
      console.log("er",error);
    }
  }

  return (
    <View style={{flexDirection: "row",justifyContent: "space-evenly", alignItems: "center",width: "95%"}}>
        <View style={{ width: 50,height: 50,borderRadius: 25,justifyContent: 'center',alignItems: 'center',borderColor: silver,borderWidth: 1}}>
            
            <Avatar name={name} size={39} />
            
        </View>
        <View style={{width: "40%"}}>
          <Text numberOfLines={1} style={{fontSize: 16,color: white,lineHeight: 22,fontWeight: 500,marginTop:1,marginHorizontal: 6,maxWidth: "80%"}}>{name}.</Text>
          <View style={{flexDirection: "row",alignItems:"center"}}>
              <Ionicons name="person" size={15} color={silver} style={{marginTop:1,marginHorizontal: 6}}/>
              <Text numberOfLines={1} style={{fontSize: 13,color: silver,lineHeight: 22,fontWeight: 500}}>{type}</Text>
            </View>

        </View>
        <View style={{width: "39%",justifyContent: "flex-end",alignItems: "center",flexDirection: "row",alignItems: "center"}}>
            <TouchableOpacity 
            onPress={startChat}
            activeOpacity={0.7}
            style={{padding: 7,borderRadius: 7,flexDirection: "row",justifyContent: 'center',alignItems: 'center',borderColor: secondary,borderWidth: 0.7,marginHorizontal: 10,borderRadius: 60}}>
              <Ionicons name="paper-plane" size={20} color={Primary} />
            </TouchableOpacity>
             {phoneNumber && (<TouchableOpacity 
             onPress={() => {
              callPhoneNumber()
             }}
            activeOpacity={0.7}
            style={{padding: 7,borderRadius: 7,flexDirection: "row",justifyContent: 'center',alignItems: 'center',borderColor: secondary,borderWidth: 0.7,borderRadius: 60}}>
              <Ionicons name="call-outline" size={20} color={Primary}/>
            </TouchableOpacity>)}
        </View>
    </View>
  )
}

export default Contactcard

const styles = StyleSheet.create({})