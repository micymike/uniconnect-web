import { StyleSheet, Text, View, Button, Image, ScrollView, ActivityIndicator,Dimensions,TouchableOpacity,TextInput,KeyboardAvoidingView, Platform, } from 'react-native'
import React,{ useEffect,useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { Primary, white,Gray,silver, secondary } from '../../utils/colors'
import { updateBusiness } from '../../lib/business/business'
import CustomInput from '../../components/custominput'
import Header from '../../components/header'
import { useToast } from "@/context/ToastProvider";
import { SafeAreaView } from 'react-native-safe-area-context';
import Dropdown from '../../components/dropdown'
import Ionicons from '@expo/vector-icons/Ionicons';

const { height: screenHeight } = Dimensions.get('window');

const Editbusiness = () => {
    const { showSuccess, showError } = useToast();
    const {id} = useLocalSearchParams();
    const [isDescriptionFocused, setIsDescriptionFocused] = useState(false);

    const [loading, setLoading] = useState(false);

    const [isFocused, setIsFocused] = useState(false);
    const [businessname, setBusinessName] = useState('');
    const [businessemail, setBusinessEmail] = useState('');
    const [businessphonenumber, setBusinessPhoneNumber] = useState('');
    const [businessWebsite, setBusinessWebsite] = useState("");
    const [selectedServices, setSelectedServices] = useState([]);
    const [businessDescription, setBusinessDescription] = useState("");
    const [primaryLocation,setPrimaryLocation] = useState("");
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    useEffect(() => {
        if (!id) {
            router.back(); 
        }else {
            setLoading(true)
            try{

            }catch(error){

            }finally{
              setLoading(false)
            }
        }
    },[id])

    const handleUpdate = async () => {
        try {
          setLoading(true);
          const updates = {
            name: businessname,
            email: businessemail,
            phone: businessphonenumber,
            website: businessWebsite,
            type: JSON.stringify(selectedServices),
            about: businessDescription,
            location: primaryLocation,
            terms: agreedToTerms,
          };
          const result = await updateBusiness(id, updates);
          if (result.success) {
            showSuccess("Business updated successfully");
            // Optionally navigate or refresh data here
          } else {
            showError(result.message || "Failed to update business");
          }
        } catch (error) {
          showError("An error occurred while updating business");
        } finally {
          setLoading(false);
        }
    }

  return (
    <SafeAreaView style={styles.container}>
        <Header
            title="Update info"
            showBackButton={true}
            color={white}
            showIcons={false}
            backPath="/dashindex"
        />
        <KeyboardAvoidingView
            style={styles.keyboardAvoidingView}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
            <ScrollView 
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollViewContent}
                keyboardShouldPersistTaps="handled"
                bounces={false}
            >
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Update Business Details</Text>
                    <Text style={styles.cardDescription}>Keep your business information up to date.</Text>
                    <View style={styles.inputGroup}>

                        <CustomInput
                            label="Your business name"
                            placeholder=" eg. Hostel Essentials Kenya"
                            value={businessname}
                            onChangeText={(text) => {
                                setBusinessName(text);
                                // if (text.length > 0) setBusinessNameError("");
                            }}
                            style={{marginVertical: 5}}
                        />

                         <CustomInput
                            label="Business email "
                            placeholder=" eg. business@example.com"
                            value={businessemail}
                            onChangeText={(text) => {
                                setBusinessEmail(text);
                                // if (text.length > 0) setBusinessEmailError("");
                            }}
                            style={{marginVertical: 5}}
                        />

                        <View style={{ marginVertical: 6 }}>
                            <Text style={{ fontSize: 14, marginBottom: 6, color: '#788481', fontWeight: '500' }}>
                                Phone number
                            </Text>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: secondary,
                                borderColor: isFocused ? Primary : Gray,
                                borderWidth: 1,
                                borderRadius: 8,
                                paddingHorizontal: 10,
                            }}>
                                <Text style={{ color: white, fontSize: 16, marginRight: 5 }}>+254</Text>
                                <TextInput
                                placeholder="712345678"
                                placeholderTextColor={silver}
                                keyboardType="number-pad"
                                value={businessphonenumber}
                                onChangeText={(text) => {
                                    const digitsOnly = text.replace(/[^0-9]/g, ''); 
                                    const trimmed = digitsOnly.slice(0, 9);
                                    setBusinessPhoneNumber(trimmed);
            
                                    // if (trimmed.length > 0) setPhoneError("");
                                }}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => {
                                    setIsFocused(false);
                                    if (businessphonenumber.length < 9) {
                                    }
                                }}
                                style={{
                                    color: white,
                                    flex: 1,
                                    fontSize: 16,
                                    paddingVertical: 10,
                                }}
                                />
                            </View>
                        </View>

                        <CustomInput
                            label="Website (optional)"
                            placeholder=" eg. www.yourbusiness.com"
                            value={businessWebsite}
                            onChangeText={(text) => {
                                setBusinessWebsite(text);
                            }}
                            style={{marginVertical: 5}}
                        />

                        <View style={{marginTop: 10}}>
                        <Text style={{fontSize: 14,fontWeight: '500',marginBottom: 6,color: "#788481"}}>Description</Text>
                        <TextInput
                            style={[{ height: 85,borderColor: isDescriptionFocused  ? Primary : Gray,borderWidth: 1,borderRadius: 8,padding: 10,fontSize: 14,backgroundColor: secondary,color: "#fff" }]}
                            textAlignVertical="top"
                            multiline
                            placeholder="Brief description your business..."
                            placeholderTextColor={silver}
                            value={businessDescription}
                            onChangeText={setBusinessDescription}
                            onFocus={() => setIsDescriptionFocused(true)}
                            onBlur={() => setIsDescriptionFocused(false)}
                        />
                        </View>

                        <View style={{marginTop: 10}}>
                            <Text style={{fontSize: 14,fontWeight: '500',marginBottom: 6,color: "#788481"}}>Location</Text>
                         <Dropdown
                            options={['Egerton', 'JKUAT']}
                            selectedValue={primaryLocation}
                            onSelect={(value) => {
                                setPrimaryLocation(value);
                                // if (value) setprimarylocationError("");
                            }}
                            iconName="location-outline"
                            desc="Select the campus your business is near."
                            labell="Location"
                            />
                        </View>

                    </View>
                    <TouchableOpacity
                        style={styles.uploadButton}
                        onPress={handleUpdate}
                        >
                            {loading ?
                                <ActivityIndicator size={12} color="white"/>
                                :
                                <>
                                    <Ionicons name="save" size={16} color="#fff" style={{ marginRight: 6 }} />
                                    <Text style={styles.uploadText}>Save Changes</Text>
                                </>
                            }
                        </TouchableOpacity>

                        <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => router.back()}
                        >
                        <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                    
                </View>

            </ScrollView>
        </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default Editbusiness

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000'
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollViewContent: {
        flexGrow: 1,
        padding: 16,
        paddingBottom: 50, // Extra padding at bottom
    },
    card: {
        borderRadius: 8,
        padding: 16,
        elevation: 1,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
        color: white
    },
    cardDescription: {
        fontSize: 13,
        color: '#6B7280',
        marginBottom: 12,
    },
    inputGroup: {
        // Remove any flex: 1 if present
    },
    uploadButton: {
        marginTop: 16,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Primary,
        paddingVertical: 12,
        borderRadius: 8,
        justifyContent: 'center',
    },
    uploadText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '500',
    },
    cancelButton: {
        marginTop: 10,
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelText: {
        color: Primary,
        fontSize: 15,
        fontWeight: '500',
    },
})
