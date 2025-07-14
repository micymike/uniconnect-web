import {StyleSheet,Text,View,FlatList,TouchableOpacity,RefreshControl,TextInput,KeyboardAvoidingView,TouchableWithoutFeedback,Keyboard,Platform,ToastAndroid } from 'react-native';
import { useEffect, useState, useRef,useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/header';
import { Gray, Primary, secondary, silver, white } from '../../utils/colors';
import { Ionicons } from '@expo/vector-icons';
import ProductTag from '../../components/productTag';
import Avatar from '../../components/avatar';
import { router,useFocusEffect } from 'expo-router';
import ChatSkeletonItem from '../../components/ChatSkeletonItem';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { deleteAllEmptyChatrooms,cleanupOldDeletedMessages } from '../../lib/chat/chat';
import { fetchChatRooms } from '../../lib/chat/chat';
import { useToast } from '@/context/ToastProvider';
import { useAuthGuard } from '../../utils/useAuthGuard';

const Chat = () => {
  const { showError, showSuccess } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All Chats');
  const [searchResults, setSearchResults] = useState([]);
  const [chatRooms, setchatRooms] = useState([])
  const [isloading, setIsLoading] = useState(false);
  const [isRefreshed, setIsRefreshed] = useState(false)
  const [currentUserId,setcurrentUserId] = useState("")
  const { isAuthenticated, checking } = useAuthGuard('/');
  

  const getUser = async () => {
    const user = await AsyncStorage.getItem("user")
    if (user) {
          const userInfo = JSON.parse(user);
          setcurrentUserId(userInfo.$id)
    }
  }

  useEffect(() => {
    getUser()
  },[currentUserId])

  const hasUnreadMessages = () => {
    return chatRooms.some(room => {
      const unreadObj = room.unreadCounts ? JSON.parse(room.unreadCounts) : {};
      const unreadCount = unreadObj[currentUserId] || 0;
      return unreadCount > 0;
    });
  };

  const showToast = (message) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    }
  };

  const handleSearch = (text, tagOverride = null) => {
    const activeTag = tagOverride || selectedTag;

    setSearchQuery(text);
    const query = text.trim().toLowerCase();

    const filtered = chatRooms?.filter((room) => {
      const matchesSearch = !query || (
        room.title?.toLowerCase().includes(query) ||
        room.lastMessage?.toLowerCase().includes(query)
      );

      const unreadObj = room.unreadCounts ? JSON.parse(room.unreadCounts) : {};
      const unreadCount = unreadObj[currentUserId] || 0;

      const matchesTag =
        activeTag === 'All Chats' ||
        (activeTag === 'Unread chats' && unreadCount > 0)

      return matchesSearch && matchesTag;
    });

    setSearchResults(filtered);
  };

  const handleClear = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  useEffect(() => {
    handleSearch(searchQuery);
    getUser()
  }, [selectedTag]);

  const titletags = [
    { id: 1, title: 'All Chats' },
    { id: 2, title: 'Unread chats' },
  ];

  const formatTime = (timestamp) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInHours = Math.abs(now - messageTime) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return messageTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return messageTime.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };


const getChatrooms = async () => {
  try {
    setIsLoading(true);

    const [chats, cleanupResult] = await Promise.all([
      fetchChatRooms(),
      cleanupOldDeletedMessages()
    ]);

    if (!chats.success) {
      showError("Failed to load chats. Please check your connection or try again.");
      setchatRooms([]);
      return;
    }

    if (chats.success) {
      setchatRooms(chats.chatRooms);
    }

    if (cleanupResult.success && cleanupResult.deletedCount > 0) {
      console.log(`Cleaned up ${cleanupResult.deletedCount} old deleted messages.`);
    }else {
      console.warn("Cleanup failed:", cleanupResult?.error);
    }

  } catch (error) {
    console.log("getChatrooms error", error);
  } finally {
    setIsLoading(false);
  }
};

  const deleteEmptyChatroom = async () => {
    try{
      const del = await deleteAllEmptyChatrooms();
      if (!del.success) {
        console.warn("Failed to delete empty chatrooms:", del.error);
        return;
      }

      if(del.success){
        getChatrooms();
      }
      console.log(del);
    }catch(error){
      console.log("delete all chatoom if empty", error)
    }finally{

    }
  }

  const handleTagSelect = (tag) => {
    if (tag === 'Unread chats') {
      if (!hasUnreadMessages()) {
        showToast('No unread messages found');
        setSelectedTag('All Chats');
        handleSearch(searchQuery, 'All Chats');
        return;
      }
    }
    
    setSelectedTag(tag);
    handleSearch(searchQuery, tag);
  };

  useFocusEffect(
    useCallback(() => {
      getUser();
      getChatrooms();
      deleteEmptyChatroom();
    }, [])
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={{ paddingVertical: 3 }}>
            <Header
              title="Chats"
              color={white}
              Size={19}
              showIcons={false}
            />
          </View>

          <View style={{width: '100%',justifyContent: 'center',alignItems: 'center',paddingHorizontal: 5,marginVertical: 5,}}>
            <View style={{width: "99%",flexDirection: 'row',alignItems: 'center',backgroundColor:"#262626",paddingHorizontal: 10,borderRadius: 10,borderWidth: 0.4,borderColor: Gray}}>
              <Ionicons name="search" size={16} color={silver} style={{marginRight: 5}} />
              <TextInput
                style={{flex: 1,fontSize: 14,color: white,paddingVertical: 12}}
                placeholder="Search chat here..."
                placeholderTextColor={silver}
                value={searchQuery}
                onChangeText={handleSearch}
                returnKeyType="search"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity 
                activeOpacity={0.7}
                onPress={handleClear} style={{marginHorizontal: 3,}}>
                    <Ionicons name="close-circle" size={16} color={white} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={{ width: '100%',marginVertical: 10 }}>
            <ProductTag
              data={titletags}
              onTagSelect={handleTagSelect}
              activeTag={selectedTag}
            />
          </View>

          <View style={{ flex: 1,marginVertical: 10 }}>
            <FlatList
              data={searchQuery.trim() || selectedTag !== 'All Chats' ? searchResults : chatRooms}
              keyExtractor={(item) => item.$id}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => {
                const unreadCount = JSON.parse(item.unreadCounts || '{}')[currentUserId] || 0;

                const lastSender = item.lastMessageSenderId;
                const readBy = item.readBy ? JSON.parse(item.readBy) : [];
                const isMyLastMessage = lastSender === currentUserId;
                const hasBeenRead = readBy.length > 1 && readBy.includes(currentUserId);
                return (
                  <TouchableOpacity
                    style={{flexDirection: 'row',alignItems: 'center',paddingHorizontal: 12,paddingVertical: 10,marginHorizontal: 10,marginBottom: 8,borderRadius: 12,}}
                    activeOpacity={0.7}
                    onPress={() => {
                      const visibleTitle =
                        currentUserId === item.createdBy
                          ? item?.usertitle || item.title
                          : item?.businesstitle || item.title;

                      router.push({
                        pathname: "/chatroom",
                        params:{chatroomId: item.$id,title: visibleTitle}
                      })
                    }}
                  >
                    <View style={{position: 'relative',marginRight: 12,}}>
                      <Avatar 
                        name={item.title} 
                        size={40}
                      />
                      {unreadCount > 0 && (
                        <View style={{position: 'absolute',bottom: 2,right: 2,width: 10,height: 10,borderRadius: 6,backgroundColor: '#4CAF50',borderWidth: 2,borderColor: '#1a1a1a',}} />
                      )}
                    </View>
                    
                    <View style={{flex: 1,}}>
                      <View style={{flexDirection: 'row',justifyContent: 'space-between',alignItems: 'center',marginBottom: 4,}}>
                        <Text numberOfLines={1} style={{color: white,fontWeight: 500,flex: 1}}>
                          {
                            currentUserId === item.createdBy
                              ? item?.usertitle || item.title
                              : item?.businesstitle || item.title
                          }
                        </Text>
                        <Text style={{color: silver,fontSize: 12,marginLeft: 8,}}>
                          {formatTime(item.lastMessageAt)}
                        </Text>
                      </View>
                      
                      <View style={{flexDirection: 'row',justifyContent: 'space-between',alignItems: 'center',}}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                          <Text 
                            style={{ color: silver, fontSize: 13 }}
                            numberOfLines={1}
                          >
                            {item.lastMessage}
                          </Text>

                          {isMyLastMessage && (
                            <Ionicons
                              name={hasBeenRead ? "checkmark-done" : "checkmark"} 
                              size={14}
                              color={hasBeenRead ? "#4CAF50" : silver}
                              style={{ marginLeft: 6 }}
                            />
                          )}
                        </View>
                        {unreadCount > 0 && (
                          <View style={{backgroundColor: '#E53935',borderRadius: 40,minWidth: 20,paddingHorizontal: 6,paddingVertical: 2,alignItems: 'center',justifyContent: 'center',marginLeft: 8,}}>
                            <Text style={{color: white,fontSize: 10,fontWeight: 'bold',}}>
                              {unreadCount > 99 ? '99+' : unreadCount}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }}
              contentContainerStyle={{ paddingBottom: 20 }}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshed}
                  onRefresh={() => {
                    getChatrooms()
                  }}
                  colors={["#ffffff"]}                 
                  tintColor="#ffffff"                  
                  progressBackgroundColor="#262626"
                />
              }
              ListEmptyComponent={
                isloading ? (
                  <View style={{ paddingHorizontal: 8, marginTop: 10 }}>
                    {[...Array(4)].map((_, index) => (
                      <ChatSkeletonItem key={index} />
                    ))}
                  </View>
                ) : (
                  <View style={{ alignItems: 'center', marginTop: 150 }}>
                      <Ionicons name="chatbubble-ellipses-outline" size={48} color={silver} />
                      <Text style={{ color: Primary, marginTop: 12, fontSize: 16, fontWeight: '600' }}>
                        No chats yet
                      </Text>
                      <Text style={{ color: silver, marginTop: 8, fontSize: 13, textAlign: 'center', lineHeight: 20, maxWidth: "76%" }}>
                        Tap the contact card on any product or rental to start a chat with the seller or owner.
                      </Text>


                  </View>
                )
              }
            />
          </View>

        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default Chat;

const styles = StyleSheet.create({});
