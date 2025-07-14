import React, { useEffect, useState, createContext, useContext } from "react";
import { Modal, View, Text, Button,TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from '@expo/vector-icons';
import { Gray, Primary, secondary, silver, white } from "@/utils/colors";
import { router } from "expo-router";
import { getAuthData } from "@/lib/auth/emailpassword";

const PromoModalContext = createContext({
  showPromo: () => {},
});

const PROMO_KEY = "last_promo_shown";

const PromoModalProvider = ({ children }) => {
  const [visible, setVisible] = useState(false);

  const showPromo = async () => {
    setVisible(true);
    await AsyncStorage.setItem(PROMO_KEY, Date.now().toString());
  };

  const checkIfShouldShowPromo = async () => {
    const lastShown = await AsyncStorage.getItem(PROMO_KEY);
    if (!lastShown) return true;

    const last = new Date(parseInt(lastShown));
    const now = new Date();
    const daysPassed = (now - last) / (1000 * 60 * 60 * 24);

    return daysPassed >= 3;
  };
 

  useEffect(() => {
    (async () => {
      const shouldShow = await checkIfShouldShowPromo();
      if (shouldShow) {
        showPromo(); 
      }
    })();
  }, []);

  return (
    <PromoModalContext.Provider value={{ showPromo }}>
      {children}
      <Modal visible={visible} transparent animationType="fade">
      <View style={{
        flex: 1,
        backgroundColor: "#00000099",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}>
        <View style={{
          backgroundColor: "#000",
          padding: 24,
          borderRadius: 16,
          width: "90%",
          maxWidth: 400,
          elevation: 5,
          borderWidth: 0.6,
          borderColor: Primary
        }}>
          <View style={{ alignItems: "center", marginBottom: 4 }}>
            <Ionicons name="gift-outline" size={30} color={Primary} />
          </View>

          <Text style={{ fontSize: 16, fontWeight: 500, textAlign: "center", marginBottom: 8 ,color: white}}>
               Invite Friends, Get Premium!
          </Text>

          <Text style={{ fontSize: 13, color: silver, textAlign: "center", marginBottom: 20 }}>
              Get 2 days of Premium access every time you refer a friend
          </Text>

          <View style={{ gap: 10, marginBottom: 20, alignItems: "flex-start",paddingHorizontal: 30 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{ width: 24, alignItems: "center" }}>
              <Ionicons name="checkmark-circle-outline" size={16} color={Primary} />
            </View>
            <Text style={{ fontSize: 13, color: silver, fontWeight: "400" }}>
              View property directions
            </Text>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{ width: 24, alignItems: "center" }}>
              <Ionicons name="checkmark-circle-outline" size={16} color={Primary} />
            </View>
            <Text style={{ fontSize: 13, color: silver, fontWeight: "400" }}>
              Contact property owners
            </Text>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{ width: 24, alignItems: "center" }}>
              <Ionicons name="checkmark-circle-outline" size={16} color={Primary} />
            </View>
            <Text style={{ fontSize: 13, color: silver, fontWeight: "400" }}>
              Promote your business
            </Text>
          </View>
        </View>


          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <TouchableOpacity
                onPress={() => setVisible(false)}
                activeOpacity={0.7}
              >
                <Text style={{color: Gray}}>Not now</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
              <TouchableOpacity 
              onPress={ async () => {
                  setVisible(false);
                  const { user } = await getAuthData();

                  if (user) {
                    router.replace("/referral");
                  } else {
                    // Optional: show an error or redirect to login
                    console.warn("User not authenticated.");
                    // e.g., router.replace("/login"); or showToast("You need to sign in first.")
                  }
                }}
              activeOpacity={0.7}
              style={{alignSelf: 'flex-end',
                borderRadius: 8,
                overflow: 'hidden',
                elevation: 4,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 12,
                paddingVertical: 6,backgroundColor:Primary,justifyContent:"center"
                }}>
                <Text style={{fontSize: 12,fontWeight: '600',color: "white",}}>Invite Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>

    </PromoModalContext.Provider>
  );
};

export const usePromoModal = () => useContext(PromoModalContext);
export default PromoModalProvider;
