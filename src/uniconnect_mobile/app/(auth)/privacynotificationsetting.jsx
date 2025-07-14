import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Switch, TextInput, Alert, Clipboard } from 'react-native';
import React, { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/header';
import { Ionicons } from '@expo/vector-icons';
import { silver, white, secondary, Gray } from '../../utils/colors'
import { router } from 'expo-router'
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { updateUserSettings } from '../../lib/auth/emailpassword';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useToast } from "@/context/ToastProvider";

const Privacynotificationsetting = () => {
  const insets = useSafeAreaInsets();
  const { showSuccess, showError } = useToast();
  
  // Profile Information
  const [username, setUsername] = useState('JohnDoe123');
  const [email, setEmail] = useState('john.doe@example.com');
  const [referralCode, setReferralCode] = useState('REF12345ABC');
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [tempUsername, setTempUsername] = useState(username);

  // Privacy Settings
  const [profileVisible, setProfileVisible] = useState(true);
  const [showEmail, setShowEmail] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [allowMessages, setAllowMessages] = useState(true);

  // Notification Settings
  const [promotions, setPromotions] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(false);

  // Updated handleToggleChange function
  const handleToggleChange = async (fieldName, newValue, setterFunction) => {
    try {
      // Optimistically update the UI first
      setterFunction(newValue);

      // Prepare the update object
      const updates = {
        [fieldName]: newValue
      };

      const response = await updateUserSettings(updates);

      if (response.success) {
        const updatedData = response.data;

        // Sync to AsyncStorage
        const stored = await AsyncStorage.getItem('user');
        const storedData = stored ? JSON.parse(stored) : null;

        if (JSON.stringify(storedData) !== JSON.stringify(updatedData)) {
          await AsyncStorage.setItem('user', JSON.stringify(updatedData));
          console.log('User data synced to AsyncStorage');
        }

        showSuccess(`${fieldName.replace(/([A-Z])/g, ' $1').toLowerCase()} updated successfully.`);
      } else {
        // Revert the UI change if the update failed
        setterFunction(!newValue);
        showError('Failed to update settings. Please try again.');
      }

    } catch (error) {
      // Revert the UI change if there was an error
      setterFunction(!newValue);
      showError(error.message || "Something went wrong");
      console.error('Error updating user settings:', error);
    }
  };

  const handleUsernameEdit = async () => {
    if (isEditingUsername) {
      try {
        const updates = { username: tempUsername };
        const response = await updateUserSettings(updates);

        if (response.success) {
          setUsername(tempUsername);
          setIsEditingUsername(false);
          
          // Sync to AsyncStorage
          const stored = await AsyncStorage.getItem('user');
          const storedData = stored ? JSON.parse(stored) : null;
          
          if (storedData) {
            storedData.username = tempUsername;
            await AsyncStorage.setItem('user', JSON.stringify(storedData));
          }
          
          showSuccess('Username updated successfully!');
        } else {
          showError('Failed to update username. Please try again.');
        }
      } catch (error) {
        showError(error.message || "Failed to update username");
        console.error('Error updating username:', error);
      }
    } else {
      setTempUsername(username);
      setIsEditingUsername(true);
    }
  };

  const handleCancelEdit = () => {
    setTempUsername(username);
    setIsEditingUsername(false);
  };

  const ProfileInfoCard = ({ icon, title, value, editable = false, onEdit, isEditing = false }) => {
    return (
      <View style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',paddingVertical: 6, borderBottomWidth: 1,
    borderBottomColor: '#222'}}>
        <View style={styles.profileInfoLeft}>
          <Ionicons name={icon} size={16} color="#777" />
          <View style={{marginLeft: 12,flex: 1}}>
            <Text style={{fontSize: 13,color: '#999',marginBottom: 2}}>{title}</Text>
            {isEditing ? (
              <TextInput
                style={styles.editInput}
                value={tempUsername}
                onChangeText={setTempUsername}
                autoFocus
                placeholderTextColor="#999"
              />
            ) : (
              <Text style={{fontSize: 14,color: white,fontWeight: '500'}}>{value}</Text>
            )}
          </View>
        </View>
        {editable && (
          <View style={{marginLeft: 12}}>
            {isEditing ? (
              <View style={{flexDirection: 'row',gap: 12}}>
                <TouchableOpacity onPress={handleCancelEdit} style={{padding: 4}}>
                  <Ionicons name="close" size={17} color="#999" />
                </TouchableOpacity>
                <TouchableOpacity onPress={onEdit} style={{padding: 4}}>
                  <Ionicons name="checkmark" size={17} color="#ff9900" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity onPress={onEdit}>
                <Ionicons name="pencil" size={14} color="#ff9900" />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    );
  };

  const SettingCard = ({ icon, title, description, value, onValueChange, fieldName }) => {
    return (
      <View style={{ flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',paddingVertical: 12,borderBottomWidth: 1,borderBottomColor: '#222'}}>
        <View style={{flexDirection: 'row',alignItems: 'center',flex: 1}}>
          <View style={{ width: 24,alignItems: 'center'}}>
            <Ionicons name={icon} size={18} color="#777" />
          </View>
          <View style={{ marginLeft: 12,flex: 1}}>
            <Text style={{fontSize: 14,color: white,marginBottom: 2}}>{title}</Text>
            <Text style={{fontSize: 14,color: '#999'}}>{description}</Text>
          </View>
        </View>
        <Switch
          value={value}
          onValueChange={(newValue) => handleToggleChange(fieldName, newValue, onValueChange)}
          trackColor={{ true: '#ff9900', false: '#333' }}
          thumbColor={value ? '#fff' : '#fff'}
        />
      </View>
    );
  };

  const SectionHeader = ({ title, description }) => {
    return (
      <View style={{marginVertical:4}}>
        <Text style={{fontWeight: 'bold',fontSize: 15,marginBottom: 4,color: white}}>{title}</Text>
        <Text style={{color: Gray,fontSize: 13,marginBottom: 8}}>{description}</Text>
      </View>
    );
  };

  return (
    <View style={{flex: 1,backgroundColor: "#000"}}>
      <SafeAreaView style={{flex: 1,}}>
          <Header
             title="Account Settings"
             showBackButton={true}
             color={white}
             showIcons={false}
             Size={16}
         />

        <ScrollView 
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        style={{flex: 1,}} contentContainerStyle={{padding: 16,}}>
          
          {/* Profile Information Section */}
          <SectionHeader 
            title="Profile Information" 
            description="Manage your personal information"
          />
          
          <View style={{backgroundColor: "#111111",borderRadius: 12,padding: 16,marginBottom: 8}}>
            <ProfileInfoCard
              icon="person"
              title="Username"
              value={username}
              editable={true}
              onEdit={handleUsernameEdit}
              isEditing={isEditingUsername}
            />
            
            <ProfileInfoCard
              icon="mail"
              title="Email"
              value={email}
              editable={false}
            />
          </View>

          
          <SectionHeader 
            title="Privacy Settings" 
            description="Control who can see your information"
          />
          
          <View style={{backgroundColor: '#111111',borderRadius: 12,padding: 16,marginBottom: 8}}>
            <SettingCard
              icon="eye"
              title="Profile Visibility"
              description="Allow others to see your profile"
              value={profileVisible}
              onValueChange={setProfileVisible}
              fieldName="profileVisible"
            />
            
            <SettingCard
              icon="mail"
              title="Show Email"
              description="Display email on your profile"
              value={showEmail}
              onValueChange={setShowEmail}
              fieldName="showEmail"
            />
          </View>

          <SectionHeader 
            title="Notification Settings" 
            description="Choose what notifications you receive"
          />
          
          <View style={{backgroundColor: '#111111',borderRadius: 12,padding: 16,marginBottom: 8}}>
            
            <SettingCard
              icon="gift"
              title="Promotions & Offers"
              description="Receive special offers and discounts"
              value={promotions}
              onValueChange={setPromotions}
              fieldName="promotions"
            />
            
            <SettingCard
              icon="mail-open"
              title="Email Notifications"
              description="Receive notifications via email"
              value={emailNotifications}
              onValueChange={setEmailNotifications}
              fieldName="emailNotifications"
            />
          </View>

        </ScrollView>
        <StatusBar style="light"/>
      </SafeAreaView>
    </View>
  );
};

export default Privacynotificationsetting;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000"
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 12,
    paddingVertical: 15,
    backgroundColor: secondary
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    color: white,
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32
  },
  sectionHeader: {
    marginTop: 24,
    marginBottom: 12
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 4,
    color: white
  },
  sectionDescription: {
    color: '#666',
    fontSize: 14,
    marginBottom: 8
  },
  section: {
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8
  },
  profileInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222'
  },
  profileInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  profileInfoText: {
    marginLeft: 12,
    flex: 1
  },
  profileInfoTitle: {
    fontSize: 14,
    color: '#999',
    marginBottom: 2
  },
  profileInfoValue: {
    fontSize: 16,
    color: white,
    fontWeight: '500'
  },
  profileInfoActions: {
    marginLeft: 12
  },
  editInput: {
    fontSize: 16,
    color: white,
    fontWeight: '500',
    borderBottomWidth: 1,
    borderBottomColor: '#ff9900',
    paddingVertical: 2,
    minWidth: 120
  },
  editActions: {
    flexDirection: 'row',
    gap: 12
  },
  editButton: {
    padding: 4
  },
  referralCard: {
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 20,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: '#ff9900'
  },
  referralHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  referralTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: white,
    marginLeft: 8
  },
  referralDescription: {
    color: '#999',
    fontSize: 14,
    marginBottom: 16
  },
  referralCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#222',
    borderRadius: 8,
    padding: 12
  },
  referralCodeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff9900',
    letterSpacing: 1
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff9900',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6
  },
  copyButtonText: {
    color: white,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4
  },
  settingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222'
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  settingIconContainer: {
    width: 24,
    alignItems: 'center'
  },
  settingTextContainer: {
    marginLeft: 12,
    flex: 1
  },
  settingTitle: {
    fontSize: 16,
    color: white,
    marginBottom: 2
  },
  settingDescription: {
    fontSize: 14,
    color: '#999'
  }
});