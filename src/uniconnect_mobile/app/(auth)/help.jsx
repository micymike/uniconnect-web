import { StyleSheet, Text, View, Dimensions, TouchableOpacity, TextInput, FlatList, Linking  } from 'react-native';
import React, { useState, useMemo } from 'react';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Helpcenterslider from '../../components/helpcenterslider';
import { Gray, Primary, secondary, silver, white } from '../../utils/colors';
import Ionicons from '@expo/vector-icons/Ionicons';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Help = () => {
  const [selectedTag, setSelectedTag] = useState("FAQ");
  const [pressedId, setPressedId] = useState(null);
  const [pressedContactId, setPressedContactId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const FAQ = [
    {
      id: 1,
      title: "How do I manage my properties or products?",
      description: "Go to your Dashboard by tapping the profile icon. Select 'My Listings' to view, edit, or delete your rentals or marketplace products."
    },
    {
      id: 2,
      title: "How can I add a rental property?",
      description: "Go to Rentals > Add Property. Fill in property name, type, images, location, and add units with prices and availability."
    },
    {
      id: 3,
      title: "How do I post a product in the marketplace?",
      description: "Tap Marketplace > + Add Product. Enter title, price, images, and description. Make sure you have a market business profile set up."
    },
    {
      id: 4,
      title: "Can I communicate with buyers or tenants?",
      description: "Yes. Tap the chat icon on a listing to talk to the other user. All chats are handled securely inside the app."
    },
    {
      id: 5,
      title: "What does the Dashboard help me do?",
      description: "Your dashboard lets you manage everything — properties, products, messages, and your account profile."
    },
    {
      id: 6,
      title: "How does the referral system work?",
      description: "Share your referral link or code with a friend. When they sign up using it, you get 2 days of premium access — and you’ll help more students discover the platform!"
    }
  ];

  const contactData = [
    {
      id: 1,
      platform: "Call Support",
      detail: "+254743105146",
      iconName: "call",
      iconcolor: "#34A853",
      link: "tel:+254743105146"
    },
    {
      id: 2,
      platform: "WhatsApp",
      detail: "Chat with us",
      iconName: "logo-whatsapp",
      iconcolor: "#25D366",
      link: "https://wa.me/254750932325"
    },
    {
      id: 3,
      platform: "Gmail",
      detail: "uniconnectnertwork@gmail.com",
      iconName: "mail",
      iconcolor: "#EA4335",
      link: "mailto:uniconnectnertwork@gmail.com"
    },
    {
      id: 4,
      platform: "Facebook",
      detail: "@UNICONNECT KENYA 🇰🇪",
      iconName: "logo-facebook",
      iconcolor: "#1877F2",
      link: "https://www.facebook.com/groups/710867458344536/"
    },
    {
      id: 5,
      platform: "Instagram",
      detail: "@uniconnect_nertwork",
      iconName: "logo-instagram",
      iconcolor: "#FFC0CB",
      link: "https://www.instagram.com/uniconnect_nertwork/?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw%3D%3D#"
    },
    {
      id: 6,
      platform: "LinkedIn",
      detail: "uniconnect",
      iconName: "logo-linkedin",
      iconcolor: "#0077B5",
      link: "https://www.linkedin.com/company/uniconnect-ke/"
    },
    {
    id: 7,
    platform: "Tiktok",
    detail: "@uniconnect16",
    iconName: "logo-tiktok",
    iconcolor: "#fff",
    link: "https://www.tiktok.com/@uniconnect16?_t=ZM-8xbeVPJtsKz&_r=1"
  },
  ];

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return selectedTag === "FAQ" ? FAQ : contactData;
    const query = searchQuery.toLowerCase().trim();
    return selectedTag === "FAQ"
      ? FAQ.filter(item => item.title.toLowerCase().includes(query) || item.description.toLowerCase().includes(query))
      : contactData.filter(item => item.platform.toLowerCase().includes(query) || item.detail.toLowerCase().includes(query));
  }, [searchQuery, selectedTag]);

  const toggleFAQ = (id) => {
    setPressedId(prev => (prev === id ? null : id));
  };

  const toggleContact = (id) => {
    setPressedContactId(prev => (prev === id ? null : id));
  };

  const handleContactPress = async (link) => {
    try {
      const supported = await Linking.canOpenURL(link);
      if (supported) {
        await Linking.openURL(link);
      } else {
        console.log("Don't know how to open URI: " + link);
      }
    } catch (error) {
      console.error('An error occurred', error);
    }
  };

  const clearSearch = () => setSearchQuery('');
  const handleTagChange = (tag) => {
    setSelectedTag(tag);
    setSearchQuery('');
    setPressedId(null);
    setPressedContactId(null);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#000', width: windowWidth, alignItems: "center" }}>
      {/* Header Spacer */}
      <View style={{ height: "30%" }} />

      {/* List Section */}
      <View style={{ width: "100%", height: "70%", alignItems: "center" }}>
        {filteredData.length === 0 && searchQuery.trim() !== '' ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: silver, fontSize: 16 }}>
              No {selectedTag === "FAQ" ? "FAQ" : "contact"} found for "{searchQuery}"
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredData}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <View style={{
                borderWidth: 0.7, borderColor: secondary, borderRadius: 8,
                width: windowWidth * 0.9, marginVertical: 6, alignItems: "center"
              }}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => selectedTag === "FAQ" ? toggleFAQ(item.id) : toggleContact(item.id)}
                  style={{
                    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
                    width: "90%", borderBottomColor: secondary, borderBottomWidth: 1, paddingVertical: 10
                  }}>
                  {selectedTag === "FAQ" ? (
                    <Text style={{ color: white, fontWeight: '500', fontSize: 15 }}>{item.title}</Text>
                  ) : (
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Ionicons name={item.iconName} size={19} color={item.iconcolor} />
                      <Text style={{ color: white, fontWeight: '500', fontSize: 15, marginLeft: 10 }}>{item.platform}</Text>
                    </View>
                  )}
                  <AntDesign name="down" size={14} color={white} />
                </TouchableOpacity>

                {(selectedTag === "FAQ" ? pressedId === item.id : pressedContactId === item.id) && (
                  <View style={{
                    paddingVertical: 10, paddingHorizontal: 6,
                    width: "90%", alignSelf: "center"
                  }}>
                    {selectedTag === "FAQ" ? (
                      <Text style={{ color: silver }}>
                        {item.description}
                      </Text>
                    ) : (
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => handleContactPress(item.link)}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          backgroundColor: secondary,
                          paddingVertical: 12,
                          paddingHorizontal: 16,
                          borderRadius: 8,
                          marginTop: 5
                        }}
                      >
                        <AntDesign name="infocirlceo" size={14} color={white}/>
                        <Text style={{
                          color: white,
                          fontSize: 14,
                          marginLeft: 12,
                          flex: 1
                        }}>
                          {item.detail}
                        </Text>
                        <MaterialIcons name="open-in-new" size={16} color={silver} />
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>
            )}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* Back & Title Header */}
      <View style={{ position: "absolute", width: "90%", top: "7%", flexDirection: "row", justifyContent: "space-between" }}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.back()}
          style={{ padding: 10, borderRadius: 24 }}>
          <AntDesign name="arrowleft" size={20} color={white} />
        </TouchableOpacity>
        <View style={{ justifyContent: "center", width: "30%" }}>
          <Text style={{ color: white, fontWeight: '600', fontSize: 17, textAlign: "center" }}>Help Center</Text>
        </View>
        <View style={{ width: "15%" }} />
      </View>

      {/* Search Bar */}
      <View style={{ position: "absolute", width: "90%", top: "16%", flexDirection: "row" }}>
        <View style={{
          width: '100%', borderRadius: 10, paddingHorizontal: 10,
          flexDirection: 'row', alignItems: 'center',
          backgroundColor: secondary, paddingVertical: 2
        }}>
          <MaterialIcons name="search" size={24} color={silver} />
          <TextInput
            placeholder={selectedTag === "FAQ" ? "Search FAQ..." : "Search contacts..."}
            placeholderTextColor="#AFAFB4"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{
              marginHorizontal: 1, color: white, width: "85%", paddingVertical: 8
            }}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity 
            activeOpacity={0.7}
            onPress={clearSearch} style={{ padding: 4,marginRight: 12 }}>
              <MaterialIcons name="close" size={20} color={silver} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Tag Slider */}
      <View style={{ position: "absolute", width: "90%", top: "24%" }}>
        <Helpcenterslider onTagSelect={handleTagChange} activeTag={selectedTag} />
      </View>

      <StatusBar style="light" />
    </View>
  );
};

export default Help;

const styles = StyleSheet.create({});