import { StyleSheet, Text, View, ScrollView, TouchableOpacity,Switch,TextInput,Modal,KeyboardAvoidingView,Platform } from 'react-native';
import React, { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/header';
import { Ionicons } from '@expo/vector-icons';
import { silver, white, secondary, Primary, Gray } from '../../utils/colors'
import { router } from 'expo-router'
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const Subscription = () => {
    const insets = useSafeAreaInsets();
    const [selectedPlan, setSelectedPlan] = useState("1day");
    const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [currentPlan, setCurrentPlan] = useState(null);

    const Card = ({time,price,description,style, selected, onPress }) => {
        return(
             <TouchableOpacity
                activeOpacity={0.8}
                onPress={onPress}
                style={[
                {
                    backgroundColor: selected ? "#2a1205" : "#1a1a1a",
                    paddingHorizontal: 16,
                    borderRadius: 12,
                    marginHorizontal: 8,
                    borderColor:selected?'#f97316' : '#555',
                    borderWidth: 0.9,
                    width: 100,
                    alignItems: "center",
                    paddingVertical: selected ? 25: 15
                },
                style,
                ]}
            >
                {currentPlan && (
                  <View style={{
                    position: 'absolute',
                    top: 6,
                    right: 6,
                    backgroundColor: Primary,
                    paddingVertical: 2,
                    paddingHorizontal: 6,
                    borderRadius: 6,
                  }}>
                    <Text style={{ fontSize: 10, color: white, fontWeight: 'bold' }}>
                      Current
                    </Text>
                  </View>
                )}
                <Text style={{ color: "#fff", fontSize: 13,textAlign: "center" }}>{time}</Text>
                <Text style={{ color: selected?Primary:"#fff", marginTop: 8,textAlign: "center", fontSize: 16, fontWeight: "600"}}>Ksh {price}</Text>
                <Text style={{ color: "#ccc", fontSize: 12, marginTop: 6 ,textAlign: "center"}}>{description}</Text>
            </TouchableOpacity>
        )
    }
    const subscriptionPlans = [
        { id: "1week", time: "1 Week", price: 49, description: "Billed weekly" },
        { id: "1day", time: "1 Day", price: 29, description: "Billed daily" },
        { id: "1month", time: "1 Month", price: 99, description: "Billed monthly" },
    ];

    const features = [
    "Post unlimited listings",
    "Access premium visibility",
    "Priority customer support",
    "Connect directly with clients",
    ];
  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
        <KeyboardAvoidingView
  style={{ flex: 1 }}
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
>
  <SafeAreaView style={{ flex: 1 }}>
    <TouchableOpacity 
    onPress={() => router.back()}
    activeOpacity={0.7} style={{position: "absolute",top: 60,left: 20,backgroundColor: secondary,borderRadius: 50,padding: 6}}>
        <Ionicons name="close" size={15} color={white}/>    
    </TouchableOpacity>

    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 5 }}>
      <Text style={{ color: Primary, fontSize: 20, fontWeight: "bold", marginBottom: 6 ,textAlign: "center"}}>Uniconnect</Text>
      <Text style={{ color: "#fff", fontSize: 16,textAlign: "center" }}>Unlimited Access</Text>
      <Text style={{ color: "#aaa", fontSize: 14, marginBottom: 24,textAlign: "center" }}>to all features</Text>

      <View style={{ marginTop: 4,}}>
        {features.map((feature, index) => (
            <View
            key={index}
            style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 12,
            }}
            >
            <Ionicons name="checkmark" size={18} color={Primary} />
            <Text style={{ color: white, marginLeft: 10, fontSize: 15 }}>
                {feature}
            </Text>
            </View>
        ))}
      </View>

      <View style={{ height: 150, justifyContent: 'center' }}>
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            }}
        >
            {subscriptionPlans.map((plan) => (
            <Card
                key={plan.id}
                time={plan.time}
                price={plan.price}
                description={plan.description}
                selected={selectedPlan === plan.id}
                onPress={() => setSelectedPlan(plan.id)}
            />
            ))}
        </ScrollView>
       </View>


      <TouchableOpacity
      activeOpacity={0.7}
        style={{
          backgroundColor: selectedPlan? Primary : secondary,
          width: "95%",
          paddingVertical: 11,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 8,
          marginTop: 5,
        }}
        onPress={() => {
              setBottomSheetVisible(true);
        }}
        >
            <Text style={{ color: "#fff", fontSize: 15, fontWeight: "600" }}>
            Continue
            </Text>
        </TouchableOpacity>
        </View>

        {isBottomSheetVisible && (
          <>

          <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: '#1a1a1a',
            padding: 20,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -3 },
            shadowOpacity: 0.3,
            shadowRadius: 6,
            elevation: 10,
            alignItems: 'center'
          }}
        >
          <Ionicons name="sparkles-outline" size={32} color={Primary} style={{ marginBottom: 10 }} />
          <Text style={{ color: "#fff", fontSize: 15, fontWeight: "bold", marginBottom: 8, textAlign: 'center' }}>
            Thanks for your interest!
          </Text>
          <Text style={{ color: "#aaa", fontSize: 13, textAlign: "center", marginBottom: 16,maxWidth: "90%" }}>
            Premium subscription is coming soon. We’re working hard to bring it to you!
          </Text>

          <TouchableOpacity
            activeOpacity={0.7}
            style={{
              backgroundColor: Primary,
              paddingVertical: 7,
              paddingHorizontal: 20,
              borderRadius: 10,
            }}
            onPress={() => setBottomSheetVisible(false)}
          >
            <Text style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>Got it</Text>
          </TouchableOpacity>
        </View>
    {/* <TouchableOpacity
      activeOpacity={1}
      onPress={() => setBottomSheetVisible(false)}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)", 
      }}
    />

    <View
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#1a1a1a',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 10,
      }}
    >
      <Text style={{ color: "#fff", fontSize: 15, fontWeight: "bold", marginBottom: 12 }}>
        Enter Mpesa Number
      </Text>

      <View style={{ marginVertical: 6 }}>
                      
                      <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: secondary,
                        borderColor:  Gray,
                        borderWidth: 1,
                        borderRadius: 8,
                        paddingHorizontal: 10,marginBottom: 10
                      }}>
                        <Text style={{ color: white, fontSize: 16, marginRight: 5 }}>+254</Text>
                        <TextInput
                          placeholder="712345678"
                          placeholderTextColor={silver}
                          keyboardType="number-pad"
                          value={phoneNumber}
                          onChangeText={(text) => {
                            setPhoneNumber(text);
                          }}
                        //   onFocus={() => setIsFocused(true)}
                        //   onBlur={() => setIsFocused(false)}
                          style={{
                            color: white,
                            flex: 1,
                            fontSize: 16,
                            paddingVertical: 10,
                          }}
                        />
                      </View>
                    </View>

      <TouchableOpacity
        style={{
          backgroundColor: Primary,
          paddingVertical: 10,
          borderRadius: 10,
          alignItems: 'center'
        }}
        onPress={() => {
          console.log("Proceed with:", phoneNumber, "for plan:", selectedPlan);
          setBottomSheetVisible(false);
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>Pay Now</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setBottomSheetVisible(false)} style={{ marginTop: 12 }}>
        <Text style={{ color: "#aaa", textAlign: "center" }}>Cancel</Text>
      </TouchableOpacity>
    </View> */}
  </>
)}


    <StatusBar style="light" />
  </SafeAreaView>
  </KeyboardAvoidingView>
</View>

  )
}

export default Subscription

const styles = StyleSheet.create({})