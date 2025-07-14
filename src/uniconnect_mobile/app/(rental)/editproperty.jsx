import { StyleSheet, Text, View, Button, Image, ScrollView, ActivityIndicator,Dimensions,TouchableOpacity,TextInput,KeyboardAvoidingView, Platform, } from 'react-native'
import React,{ useEffect,useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { fetchRentalById } from '../../lib/rentals/rental'
import * as DocumentPicker from 'expo-document-picker'
import { useToast } from "@/context/ToastProvider";
import { updateRentalProperty } from '../../lib/rentals/rental'
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import Header from '../../components/header'
import { Primary, white,Gray,silver, secondary } from '../../utils/colors'
import Dropdown from '../../components/dropdown'
import CustomInput from '../../components/custominput'
import Imgurimodal from '../../components/imgurimodal'
import { useAuthGuard } from '../../utils/useAuthGuard'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const Editproperty = () => {
    const { showSuccess, showError } = useToast();
    const {id} = useLocalSearchParams();
        const { isAuthenticated, checking } = useAuthGuard('/');

    const [property, setProperty] = useState(null);
    const [allowUpload, setAllowUpload] = useState(true);
    const [isDescriptionFocused, setIsDescriptionFocused] = useState(false);
    const [isPhoneFocused, setIsPhoneFocused] = useState(false);
    const [showImageUriModal, setShowImageUriModal] = useState(false);
    const [currentImageType, setCurrentImageType] = useState(null);
    
    

    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [frontImage, setFrontImage] = useState("");
    const [backImage, setBackImage] = useState("");

    const [form, setForm] = useState({ 
        title: '',
        frontImage: '',
        backImage: "",
        contactPhone: '',
        latitude: "",
        location: "",
        longitude: "",
        managedBy: "",
        description:""
    });
    
    useEffect(() => {
    if (!id) {
      router.back(); 
    } else {
      const loadData = async () => {
        setLoading(true);
        const response = await fetchRentalById(id);

        if(!response.success){
          showError("Failed to get initial data, check your connection and try again")
          router.replace("dashindex")
          return
        }

        if (response.success) {
            const data = response.data;
            setProperty(data);
            setForm({
            title: data.title || '',
            frontImage: data.frontImage || '',
            backImage: data.backImage || '',
            contactPhone: data.contactPhone || '',
            latitude: data.latitude?.toString() || '',
            location: data.location || '',
            longitude: data.longitude?.toString() || '',
            managedBy: data.managedBy || '',
            description: data.description || '',
            });
            
        } else {
            console.error(response.message);
            router.back(); 
        }

        setLoading(false);
        };

        loadData();
    }
  }, [id]);

  const pickImage = async (selectedType, side) => {
    const result = await DocumentPicker.getDocumentAsync({
        type: selectedType === "image" ? ["image/png", "image/jpg", "image/jpeg"] : "*/*",
        copyToCacheDirectory: true,
    });

    if (!result.canceled) {
        const image = result.assets[0];

        if (selectedType === "image") {
            if (side === "front") {
                setFrontImage(image);
                setForm(prev => ({ ...prev, frontImage: image.uri }));
            } else if (side === "back") {
                setBackImage(image);
                setForm(prev => ({ ...prev, backImage: image.uri }));
            }

            console.log(`Updated ${side} image:`, image.uri);
        }
        }
  };

  const handleUpdate = async () => {
    const requiredFields = [
        form.title,
        form.frontImage,
        form.backImage,
        form.contactPhone,
        form.latitude,
        form.longitude,
        form.location,
        form.managedBy,
        form.description,
    ];

    const allFieldsFilled = requiredFields.every((field) => field && field.toString().trim() !== "");

    if (!allFieldsFilled) {
        showError("Please fill in all fields before updating the property.");
        return;
    }
    setSubmitting(true);
    try{
        const updatedListing = await updateRentalProperty(id, form);
        if(!updatedListing.success){
          showError("Failed to update your property details, try again or check your connection")
        }
        if(updatedListing.success){
            showSuccess("Your property has been updated succesfully")
            router.replace("/dashindex")
        }
        console.log("Awaited result: ", updatedListing);
    }catch(error){
        showError("An error occured, we are unable to update your property, Try Again!")
        console.log(error)
    }finally{
    setSubmitting(false);
    }


  }
  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
   <SafeAreaView style={styles.container}>
        <Header
            title="Update Property"
            showBackButton={true}
            color={white}
            showIcons={false}
        />
      
      <ScrollView 
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Edit Information</Text>
          <Text style={styles.cardDescription}>Update Property details</Text>

          <View style={styles.inputGroup}>

            <View style={{flexDirection: "row",justifyContent: "space-evenly",alignItems: "center"}}>
                <TouchableOpacity 
                onPress={() => {
                    if(allowUpload){
                    pickImage("image", "front")
                    }else{
                    setCurrentImageType('front');
                    setShowImageUriModal(true);
                    } 
                }}

                activeOpacity={0.7}
                style={[ styles.imageBox, form.frontImage && styles.imageBoxFilled ]}>
                {form.frontImage? (
                    <>
                        <View style={styles.closeButton}>
                            <Ionicons name="camera-outline" size={14} color={white} />
                            <Text style={{color: white}}>Change </Text>
                        </View>
                        <Image resizeMode='contain'   source={{uri: form.frontImage }} style={styles.image} />
                    </>
                ) : (
                    <>
                    <Ionicons name="camera-outline" size={20} color={Gray} />
                    <Text style={styles.placeholder}>Image One</Text>
                    </>
                )}
                </TouchableOpacity>

                <TouchableOpacity 
                onPress={() => {
                    if(allowUpload){
                    pickImage("image", "back")
                    }else{
                    setCurrentImageType('back');
                    setShowImageUriModal(true);
                    } 
                }}
                activeOpacity={0.7}
                style={[ styles.imageBox, form.backImage && styles.imageBoxFilled ]}>
                {form.backImage ? (
                <>
                <View style={styles.closeButton}>
                    <Ionicons name="camera-outline" size={14} color={white} />
                    <Text style={{color: white}}>Change </Text>
                </View>
                    <Image resizeMode='contain' source={{ uri: form.backImage }} style={styles.image} />
                </>
                ) : (
                    <>
                <Ionicons name="camera-outline" size={20} color="gray" />
                <Text style={styles.placeholder}>Back view</Text>
                </>
                )}
                </TouchableOpacity>
            </View>
            
          </View>
          <CustomInput
            label="Prorpery Name"
            placeholder="e.g., Cozy bedsitter"
            value={form.title}
            onChangeText={(text) => handleChange('title', text)}
            style={{ marginVertical: 5 }}
            />


          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, { height: 80,borderColor: isDescriptionFocused  ? Primary : Gray }]}
              textAlignVertical="top"
              multiline
              placeholder="Brief description of the paper content..."
              value={form.description}
              onChangeText={(text) => handleChange('description', text)}
               onFocus={() => setIsDescriptionFocused(true)}
                onBlur={() => setIsDescriptionFocused(false)}
            />
          </View>

          <View style={{ marginVertical: 6 ,width: "98%"}}>
            <Text style={{ fontSize: 14, marginBottom: 6, color: '#788481', fontWeight: '500' }}>
            Phone number
            </Text>
            <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: secondary,
            borderColor: isPhoneFocused  ? Primary : Gray,
            borderWidth: 1,
            borderRadius: 8,
            paddingHorizontal: 10,
            }}>
            <Text style={{ color: white, fontSize: 16, marginRight: 5 }}>+254</Text>
            <TextInput
                placeholder="712345678"
                placeholderTextColor={silver}
                keyboardType="number-pad"
                value={form.contactPhone}
                onChangeText={(text) => {
                const digitsOnly = text.replace(/[^0-9]/g, ''); 
                const trimmed = digitsOnly.slice(0, 9);
                handleChange('contactPhone', trimmed);
                }}
                onFocus={() => setIsPhoneFocused(true)}
                onBlur={() => setIsPhoneFocused(false)}
                style={{
                color: white,
                flex: 1,
                fontSize: 16,
                paddingVertical: 10,
                }}
            />
            </View>
        </View>
        <Dropdown
        label="Managed By"
        options={['Landlord/Landlady', 'Agent']}
        selectedValue={form.managedBy} 
        onSelect={(value) => handleChange('managedBy', value)} 
        iconName="person"
        labell="Who Manages This Property"
        />
        <CustomInput
        label="Latitude"
        placeholder="-1.3625416878306622"
        value={form.latitude}
        onChangeText={(text) => handleChange('latitude', text)}
        style={{ marginVertical: 5 }}
        />

        <CustomInput
        label="Longitude"
        placeholder="36.65722939768087"
        value={form.longitude}
        onChangeText={(text) => handleChange('longitude', text)}
        style={{ marginVertical: 5 }}
        />

          <Dropdown
            label="Location"
            options={['Egerton', 'JKUAT']}
            selectedValue={form.location}
            onSelect={(value) => handleChange('location', value)}
            iconName="location-outline"
            desc="Select the area your item is located."
            labell="Nearby Institution"
        />

        </View>

        {/* Buttons */}
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={() => {
           handleUpdate()
          }}
        >
            {submitting ?
             <>
                <ActivityIndicator size={12} color="white"/>
             </> : 
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
      </ScrollView>
       <Imgurimodal
        showImageUriModal={showImageUriModal}
        setShowImageUriModal={setShowImageUriModal}
        currentImageType={currentImageType}
        setFrontImage={(text) => handleChange('frontImage', text)}
        setBackImage={(text) => handleChange('backImage', text)}
      />
      {loading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingBox}>
            <ActivityIndicator size="small" color={white} />
            <Text style={{ marginTop: 10, color: white }}>Loading property...</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
    </KeyboardAvoidingView>
  )
}

export default Editproperty

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  imageBox: {
        borderWidth: 1.5,
        borderColor: Gray,
        borderStyle: 'dashed',
        height: 140,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 8,
        borderRadius: 8,
        width:"45%",
        position: 'relative',
      },
      imageBoxFilled: {
        borderWidth: 0,
      },
      closeButton: {
        position: 'absolute',
        bottom: 15,
        zIndex: 1, 
        backgroundColor: '#374151',
        borderRadius: 10,
        padding: 2,
        alignSelf: "center",
        justifyContent: "center",
        flexDirection:"column",
        alignItems:"center"
      },
      placeholder: {
        color: '#888',
      },
      image: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
        alignSelf: "center",
        justifyContent: "center"
      },
  content: {
    padding: 16,
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
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 6,
    color: Gray
  },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    backgroundColor: secondary,
    color: "#fff"
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  column: {
    flex: 1,
  },
  helper: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 4,
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
});