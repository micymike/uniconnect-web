import { Text, View, ScrollView, TouchableOpacity, Alert, Clipboard, Share, ToastAndroid, FlatList,ActivityIndicator,StyleSheet} from 'react-native';
import React, { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { silver, white, secondary, Primary } from '../../utils/colors'
import { router } from 'expo-router'
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '../../components/header';
import Avatar from '../../components/avatar';
import {getCurrentUserProfile, getUsersReferredByCode} from "../../lib/auth/emailpassword"
import MessagesEmptyState from '../../components/messagesskeleton';
import { useToast } from "@/context/ToastProvider";
import { useAuthGuard } from '../../utils/useAuthGuard';


const Referral = () => {
      const { isAuthenticated, checking } = useAuthGuard('/');

  const insets = useSafeAreaInsets();
  const { showSuccess, showError } = useToast();
  const [referralCode, setReferralCode] = useState('');
  const [totalReferrals, setTotalReferrals] = useState(0);
  const [fetching, setfetching] = useState(false);
  const [showAllReferrals, setShowAllReferrals] = useState(false);
  const [recentReferrals, setRecentReferrals] = useState([]);

  useEffect(() => {
  const getReferralCode = async () => {
    try {
      setfetching(true)
      const result = await getCurrentUserProfile()
      if(result.success){
        const yourcode = result.profile.referralCode;
        setReferralCode(yourcode);

        const myReferrals = await getUsersReferredByCode(yourcode)

        if (myReferrals.success) {
          setRecentReferrals(myReferrals.users); 
          setTotalReferrals(myReferrals.users.length);
        }
      }

    } catch (error) {
      console.error("Error fetching referral code:", error);
      showError("Something went wrong while loading your referral data. Please try again.")
      router.replace("/profile")

    } finally {
      setfetching(false)
    }
  };

  getReferralCode();
}, []);
  const copyReferralCode = async () => {
    try {
      await Clipboard.setString(referralCode);
     ToastAndroid.show("copied to clipboard", ToastAndroid.SHORT);
    } catch (error) {
      ToastAndroid.show("Failed to copy referral code", ToastAndroid.SHORT);
    }
  };

  const shareReferralCode = async () => {
    try {
      const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.uniconnect.x';
      
      const downloadUrl = playStoreUrl;
      
      const message = `🎉 Looking for a place to stay or want to sell something on campus? UniConnect makes it easy! Use my code ${referralCode} when you sign up. Download the app here: ${downloadUrl}`;

      await Share.share({
        message: message,
        title: 'Join with my referral code!',
        url: downloadUrl
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share referral code');
    }
  };

  const StatsCard = ({ icon, title, value, subtitle, color = '#ff9900' }) => {
    return (
      <View style={{flex: 1, backgroundColor: '#111', borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center'}}>
        <View style={[{ backgroundColor: `${color}20`, width: 30, height: 30, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginRight: 12 }]}>
          <Ionicons name={icon} size={18} color={color} />
        </View>
        <View style={{flex: 1}}>
          <Text style={{fontSize: 14, fontWeight: 'bold', color: white, marginBottom: 2}}>{value}</Text>
          <Text style={{fontSize: 14, color: '#999', marginBottom: 2}}>{title}</Text>
          {subtitle && <Text style={{fontSize: 12, color: '#666'}}>{subtitle}</Text>}
        </View>
      </View>
    );
  };

  const ReferralCard = () => {
    return (
      <View style={{borderRadius: 16, padding: 24, marginBottom: 24, backgroundColor: Primary}}>
        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 12}}>
          <Ionicons name="gift" size={16} color="#fff" />
          <Text style={{fontSize: 16, fontWeight: 'bold', color: '#fff', marginLeft: 10}}>Your Referral Code</Text>
        </View>
        
        <Text style={{color: '#fff', fontSize: 13, marginBottom: 20, opacity: 0.9}}>
          Earn 2 days of full premium access when a friend signs up using your code.
        </Text>
        
        <View style={{backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: 7, paddingHorizontal: 16, paddingVertical: 10, marginBottom: 20, alignItems: 'center'}}>
          <Text style={{fontSize: 16, fontWeight: 'bold', color: '#fff', letterSpacing: 2}}>{referralCode}</Text>
        </View>
        
        <View style={{flexDirection: 'row', justifyContent: 'space-between', gap: 12}}>
          <TouchableOpacity 
            style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', paddingVertical: 9, borderRadius: 8, gap: 6}}
            onPress={copyReferralCode}
            activeOpacity={0.8}
          >
            <Ionicons name="copy" size={16} color="#ff9900" />
            <Text style={{color: '#ff9900', fontSize: 14, fontWeight: '600'}}>Copy Code</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', paddingVertical: 9, borderRadius: 8, gap: 6}}
            onPress={shareReferralCode}
            activeOpacity={0.8}
          >
            <Ionicons name="share" size={16} color="#ff9900" />
            <Text style={{color: '#ff9900', fontSize: 14, fontWeight: '600'}}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      
      if (isNaN(date.getTime())) return 'Invalid date';
      
      const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      };
      
      return date.toLocaleDateString('en-US', options);
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid date';
    }
  };

  const ReferralItem = ({ item }) => {
    return (
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#222'
      }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          flex: 1
        }}>
          <View style={{marginRight: 12}}>
                <Avatar name={item.username} size={34} />
          </View>
          
          <View style={{flex: 1}}>
            <Text style={{
              color: white,
              fontSize: 15,
              fontWeight: '500',
              marginBottom: 2
            }}>{item.username}</Text>
            <Text style={{
              color: '#999',
              fontSize: 12
            }}>{formatDate(item.$createdAt)}</Text>
          </View>
        </View>
        
        <View style={{alignItems: 'flex-end'}}>
          
        </View>
      </View>
    );
  };

  const HowItWorksCard = () => {
    return (
      <View style={{backgroundColor: '#111', borderRadius: 12, padding: 20, marginBottom: 24}}>
        <Text style={{fontSize: 15, fontWeight: 'bold', color: white, marginBottom: 16, textAlign: 'center'}}>How Referrals Work</Text>
        
        <View style={{gap: 16}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{ width: 26, height: 26, borderRadius: 16, backgroundColor: Primary, alignItems: 'center', justifyContent: 'center', marginRight: 12}}>
              <Text style={{color: '#fff', fontWeight: '500', fontSize: 14}}>1</Text>
            </View>
            <Text style={{flex: 1, color: white, fontSize: 14}}>Share your referral code with friends</Text>
          </View>
          
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{ width: 26, height: 26, borderRadius: 16, backgroundColor: Primary, alignItems: 'center', justifyContent: 'center', marginRight: 12}}>
              <Text style={{color: '#fff', fontWeight: '500', fontSize: 14}}>2</Text>
            </View>
            <Text style={{flex: 1, color: white, fontSize: 14}}>They sign up using your code</Text>
          </View>
          
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{ width: 26, height: 26, borderRadius: 16, backgroundColor: Primary, alignItems: 'center', justifyContent: 'center', marginRight: 12}}>
              <Text style={{color: '#fff', fontWeight: '500', fontSize: 14}}>3</Text>
            </View>
            <Text style={{flex: 1, color: white, fontSize: 14}}>You get 2 days of premium access</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderReferralItem = ({ item }) => <ReferralItem item={item} />;

  const toggleViewAllReferrals = () => {
    setShowAllReferrals(!showAllReferrals);
  };

  const displayedReferrals = showAllReferrals ? recentReferrals : recentReferrals.slice(0, 3);

  return (
    <View style={{flex: 1, backgroundColor: "#000"}}>
      <SafeAreaView style={{flex: 1}}>
        <Header
            title="Referral Program"
            showBackButton={true}
            color={white}
            showIcons={false}
            Size={17}
            backPath="/profile"
        />
        <ScrollView 
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        style={{flex: 1}} 
        contentContainerStyle={{padding: 16, paddingBottom: 32}}>
          
          <ReferralCard />

          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 16,
            gap: 12
          }}>
            <StatsCard
              icon="people"
              title="Total Referrals"
              value={totalReferrals.toString()}
              subtitle="Friends joined"
            />
            
            <StatsCard
              icon="star"
              title="Premium Days Earned"
              value={`${totalReferrals * 2} days`}
              subtitle="From referrals"
              color="#FFD700" // gold/yellow
              />
          </View>

          <HowItWorksCard />

          <View style={{
            backgroundColor: '#111',
            borderRadius: 12,
            padding: 16,
            marginBottom: 16
          }}>
            <Text style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: white,
              marginBottom: 16
            }}>Recent Referrals</Text>
            
            <FlatList
              data={displayedReferrals}
              renderItem={renderReferralItem}
              keyExtractor={(item) => item.$id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={{height: 0}} />}
              ListEmptyComponent={
                fetching ? (
                    <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 32 }}>
                      <ActivityIndicator size={20} color={Primary}/>
                      <Text style={{ color: '#999', marginTop: 8 }}>Fetching referrals...</Text>
                    </View>
                  ) : (
                 <View style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: 32
                  }}>
                    <Ionicons name="people-outline" size={36} color="#666" />
                    <Text style={{
                      color: '#999',
                      fontSize: 16,
                      fontWeight: '500',
                      marginTop: 12,
                      marginBottom: 4
                    }}>No referrals yet</Text>
                    <Text style={{
                      color: '#666',
                      fontSize: 14,
                      textAlign: 'center',
                      maxWidth: "80%"
                    }}>Start sharing your referral code to see your friends here!</Text>
                  </View>
                )
                
              }
            />
            
            {recentReferrals.length > 3 && (
              <TouchableOpacity 
                activeOpacity={0.7}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 16,
                  paddingVertical: 12
                }}
                onPress={toggleViewAllReferrals}
              >
                <Text style={{
                  color: '#ff9900',
                  fontSize: 14,
                  fontWeight: '600',
                  marginRight: 4
                }}>
                  {showAllReferrals ? 'Show Less' : `View All Referrals (${recentReferrals.length})`}
                </Text>
                <Ionicons 
                  name={showAllReferrals ? "chevron-up" : "chevron-forward"} 
                  size={14} 
                  color="#ff9900" 
                />
              </TouchableOpacity>
            )}
          </View>

        </ScrollView>
        {fetching && (
            <View style={styles.loadingOverlay}>
              <View style={styles.loadingBox}>
                <ActivityIndicator size="small" color={white} />
                <Text style={{ marginTop: 10, color: white }}>Loading referral...</Text>
              </View>
            </View>
          )}
        <StatusBar style="light"/>
      </SafeAreaView>
    </View>
  );
};

export default Referral;

const styles = StyleSheet.create({
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  
  loadingBox: {
    backgroundColor: secondary,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
})