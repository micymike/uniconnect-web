import { useToast } from "@/context/ToastProvider";
import Ionicons from '@expo/vector-icons/Ionicons';
import * as DocumentPicker from 'expo-document-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View,Switch,ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/header';
import { categories } from '../../lib/market/category';
import { getProductById,updateproduct } from '../../lib/market/market';
import { Primary, secondary, silver, white } from '../../utils/colors';
import Dropdown from '../../components/dropdown'
import { useAuthGuard } from '../../utils/useAuthGuard'


 const StyledInput = ({ label, placeholder, value, onChangeText, multiline = false, keyboardType = 'default', icon, style, onFocus, onBlur, focused }) => (
     <View style={[{marginBottom: 8,}, style]}>
         <Text style={{fontSize: 12,fontWeight: '500',color: "#788481",marginBottom: 4,}}>{label}</Text>
         <View style={[{flexDirection: 'row',alignItems: 'center',backgroundColor: '#1A1A1A',borderRadius: 8,borderWidth: 1,borderColor: focused? Primary :'#374151',paddingHorizontal: 9,}]}>
             <TextInput
                 style={[{flex: 1,fontSize: 14,color: white,paddingVertical: 10,}, multiline && styles.multilineInput,]}
                 placeholder={placeholder}
                 placeholderTextColor="#6B7280"
                 value={value}
                 onChangeText={onChangeText}
                 multiline={multiline}
                 keyboardType={keyboardType}
                 textAlignVertical={multiline ? "top" : "center"}
                 onFocus={onFocus}
                 onBlur={onBlur}
             />
         </View>
     </View>
 );

 const PhoneInput = ({ label, value, onChangeText, onFocus, onBlur, focused }) => (
    <View style={{marginBottom: 8}}>
         <Text style={{fontSize: 12,fontWeight: '500',color: "#788481",marginBottom: 4,}}>{label}</Text>
         <View style={[{flexDirection: 'row',alignItems: 'center',backgroundColor: '#1A1A1A',borderRadius: 8,borderWidth: 1,borderColor: focused? Primary :'#374151',paddingHorizontal: 9,}]}>
             <View style={{backgroundColor: '#2A2A2A',paddingHorizontal: 6,paddingVertical: 9,borderRightWidth: 1,borderRightColor: '#374151',}}>
                 <Text style={{fontSize: 14,fontWeight: '600',color: white,}}>🇰🇪 +254</Text>
             </View>
             <TextInput
                 style={{flex: 1,fontSize: 14,color: white,paddingHorizontal: 6,paddingVertical: 6,marginLeft: 4}}
                 placeholder="712345678"
                 placeholderTextColor="#6B7280"
                 keyboardType="number-pad"
                 value={value}
                 onChangeText={(text) => {
                     const digitsOnly = text.replace(/[^0-9]/g, ''); 
                     const trimmed = digitsOnly.slice(0, 9);
                     onChangeText(trimmed);
                 }}
                 onFocus={onFocus}
                 onBlur={onBlur}
             />
         </View>
     </View>
 );

 
const StyledSwitch = ({ label, value, onValueChange, description, icon }) => (
     <View style={{marginBottom: 5,}}>
         <View style={{flexDirection: 'row',justifyContent: 'space-between',alignItems: 'center',backgroundColor: '#1A1A1A',padding: 12,borderRadius: 9,}}>
             <View style={{flexDirection: 'row',alignItems: 'center',}}>
                 <View style={{ width: 30,height: 30,borderRadius: 20,backgroundColor: `${Primary}15`,justifyContent: 'center',alignItems: 'center',marginRight: 5,}}>
                     <Ionicons name={icon} size={17} color={Primary} />
                 </View>
                 <View>
                     <Text style={{fontSize: 13,fontWeight: '500',color: white,marginBottom: 2,}}>{label}</Text>
                     <Text style={{fontSize: 12,color: silver,}}>{description}</Text>
                 </View>
             </View>
             <Switch
                 value={value}
                 onValueChange={onValueChange}
                 trackColor={{ false: '#374151', true: `${Primary}40` }}
                 thumbColor={value ? Primary : '#9CA3AF'}
                 ios_backgroundColor="#374151"
             />
         </View>
     </View>
 );

const Editproduct = () => {
    const { showSuccess, showError } = useToast();
    const {id} = useLocalSearchParams();
          const { isAuthenticated, checking } = useAuthGuard('/');
    
    
    const [allowUpload, setAllowUpload] = useState(true);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [focusedInput, setFocusedInput] = useState('');

     const [frontImage, setFrontImage] = useState("");
     const [backImage, setBackImage] = useState("");
     const [subOptions, setSubOptions] = useState([]);

    // Original data state to store the initial values
    const [originalData, setOriginalData] = useState({});
    const [hasChanges, setHasChanges] = useState(false);

    const [form, setForm] = useState({ 
        frontImage: '',
        backImage: "",
        title: '',
        description:"",
        price: "",
        category: "",
        location: "",
        subcategory: '',
        condition: "",
        deliveryOptions: false,
        isAvailable: false,
        contactPhone: '',
    });

    // Function to compare form data with original data
    const checkForChanges = (currentForm, original) => {
        const keys = Object.keys(currentForm);
        for (let key of keys) {
            if (currentForm[key] !== original[key]) {
                return true;
            }
        }
        return false;
    };

    // Update hasChanges whenever form changes
    useEffect(() => {
        if (Object.keys(originalData).length > 0) {
            const changes = checkForChanges(form, originalData);
            setHasChanges(changes);
        }
    }, [form, originalData]);

    useEffect(() => {
     const fetchProduct = async () => {
         if (!id) {
             router.back();
         } else {
             setLoading(true)
             try {

                 const result = await getProductById(id);

                 if(!result.success){
                    showError("Failed to fetch the initial details for the product")
                    router.replace("/dashindex")
                    return
                 }

                 if (result.success) {
                     console.log(result.result)
                     const productData = {
                         frontImage: result.result.frontImage || '',
                         backImage:  result.result.backImage || '',
                         title: result.result.title || '',
                         description: result.result.description || '',
                         price: result.result.price || '',
                         category: result.result.category || '',
                         location: result.result.location || '',
                         subcategory: result.result.subcategory || '',
                         condition: result.result.condition || '',
                         deliveryOptions: result.result.deliveryOptions || false,
                         isAvailable: result.result.isAvailable || false,
                         contactPhone: result.result.contactPhone || '',
                     };

                     // Set both form and original data
                     setForm(productData);
                     setOriginalData(productData);
                    
                     if (result.result.category) {
                         const selected = categories.find(cat => cat.name === result.result.category);
                         setSubOptions(selected?.subcategories || []);
                     }
                 } else {
                     showError(result.message || 'Failed to fetch product');
                 }
             } catch (error) {
                 console.log(error);
                 showError(error.message || 'An error occurred while fetching the product');
             } finally {
                 setLoading(false)
             }
         }
     };

     fetchProduct();
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

    const handleChange = (key, value) => {
         if (key === 'category') {
             // When category changes, update subcategory options and handle subcategory
             const selectedCategory = categories.find(cat => cat.name === value);
             const newSubOptions = selectedCategory?.subcategories || [];
             setSubOptions(newSubOptions);
             
             // Check if current subcategory is valid for the new category
             const currentSubcategory = form.subcategory;
             const isSubcategoryValid = newSubOptions.includes(currentSubcategory);
             
             if (isSubcategoryValid) {
                 // Keep the current subcategory if it exists in the new category
                 setForm((prev) => ({ ...prev, [key]: value }));
             } else {
                 // Reset subcategory if it doesn't exist in the new category
                 setForm((prev) => ({ 
                     ...prev, 
                     [key]: value,
                     subcategory: '' // Clear subcategory when changing to incompatible category
                 }));
                 
                 // Show user feedback about subcategory reset
                 if (currentSubcategory && !isSubcategoryValid) {
                     showSuccess(`Category changed. Please select a new subcategory.`);
                 }
             }
         } else {
             setForm((prev) => ({ ...prev, [key]: value }));
         }
     };

    // Reset form to original values
    const handleReset = () => {
        setForm(originalData);
        setHasChanges(false);
        showSuccess("Form reset to original values");
    };

    const handleUpdate = async () => {
        // Check if there are changes
        if (!hasChanges) {
            showError("No changes detected. Please modify some fields before saving.");
            return;
        }

       const requiredFields = [
            { field: form.title, name: 'Title' },
            { field: form.frontImage, name: 'Front Image' },
            { field: form.backImage, name: 'Back Image' },
            { field: form.description, name: 'Description' },
            { field: form.price, name: 'Price' },
            { field: form.category, name: 'Category' },
            { field: form.location, name: 'Location' },
            { field: form.condition, name: 'Condition' },
            { field: form.subcategory, name: 'Subcategory' },
           
        ];

        const emptyFields = requiredFields.filter(item => {
            const value = item.field;
            return !value || (typeof value === 'string' && value.trim() === '');
        });

        if (emptyFields.length > 0) {
            const fieldNames = emptyFields.map(item => item.name).join(', ');
            showError(`Please fill in the following required fields: ${fieldNames}`);
            return;
        }

        if (form.price && isNaN(Number(form.price))) {
            showError("Price must be a valid number");
            return;
        }

        if (form.price && Number(form.price) <= 0) {
            showError("Price must be greater than 0");
            return;
        }

        setSubmitting(true);
        try{
            const updatedListing = await updateproduct(id, form);

            if(!updatedListing.success){
                showError("Failed to  updated product, check your connection or try again");
            }

            if(updatedListing.success){
                showSuccess("Your product has been updated successfully");
                setOriginalData({ ...form });
                setHasChanges(false);
                router.replace("/dashindex");
            }
        }catch(error){
            showError("An error occurred, we are unable to update your property, Try Again!")
            console.log(error)
        }finally{
            setSubmitting(false);
        }  
    }

  return (
    <SafeAreaView style={{flex: 1,backgroundColor: '#000',}}>
         <Header
             title="Update product"
             showBackButton={true}
             color={white}
             showIcons={false}
             Size={15}
            backPath="/dashindex"
         />
         <KeyboardAvoidingView
             style={{ flex: 1 }}
             behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
             keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
         >
            <ScrollView 
             showsHorizontalScrollIndicator={false}
             showsVerticalScrollIndicator={false}
             contentContainerStyle={{padding: 16}}>
                <View style={{flexDirection: 'row',alignItems: 'center',backgroundColor: '#111111',paddingHorizontal: 10,paddingVertical: 6,borderRadius: 10,marginBottom: 12,borderWidth: 1,borderColor: '#1F1F1F',}}>
                    <View style={{ width: 30,height: 30,borderRadius: 25,backgroundColor: `${Primary}20`,justifyContent: 'center',alignItems: 'center',marginRight: 9,}}>
                        <Ionicons name="create-outline" size={17} color={Primary} />
                    </View>
                    <View style={{ flex: 1,}}>
                        <Text style={{fontSize: 13,fontWeight: '700',color: white,marginBottom: 4}}>Edit Product Information</Text>
                        {hasChanges && (
                            <Text style={{fontSize: 11,color: '#FFA500',}}>• Changes detected - ready to save</Text>
                        )}
                    </View>
                    {hasChanges && (
                        <TouchableOpacity activeOpacity={0.7} onPress={handleReset} style={{padding: 4}}>
                            <Ionicons name="refresh-outline" size={16} color={Primary} />
                        </TouchableOpacity>
                    )}
                </View>

                <View style={{flexDirection: 'row',alignItems: 'center',marginBottom: 8,paddingHorizontal: 19}}>
                    <Ionicons name="camera-outline" size={16} color={silver} />
                    <Text style={{fontSize: 14,fontWeight: '600',color: silver,marginLeft: 10,}}>Product Images</Text>
                </View>
                <View style={{backgroundColor: '#111111',borderRadius: 6,padding: 20,marginBottom: 20,borderWidth: 1,borderColor: '#1F1F1F',width: "94%",alignSelf: "center"}}>
                    <View style={{flexDirection: 'row',justifyContent: 'space-between',gap: 16,}}>
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
                        style={{flex: 1,height: 150,borderRadius: 6,borderWidth: form.frontImage?  0: 1,borderColor: '#374151',borderStyle: 'dashed',justifyContent: 'center',alignItems: 'center',backgroundColor: '#1A1A1A',position: 'relative',}}
                        >
                            {form.frontImage ? (
                                <>
                                    <Image source={{uri: form.frontImage}} style={{width: '100%',height: '100%',borderRadius: 10,}} />
                                    <View style={{position: 'absolute',bottom: 0,left: 0,right: 0,backgroundColor: 'rgba(0,0,0,0.8)',borderBottomLeftRadius: 10,borderBottomRightRadius: 10,paddingVertical: 8,alignItems: 'center',flexDirection: 'row',justifyContent: 'center',}}>
                                        <Ionicons name="camera-outline" size={20} color={white} />
                                        <Text style={{color: white,fontSize: 12,fontWeight: '500',marginLeft: 4,}}>Change Image</Text>
                                    </View>
                                </>
                            ) : (
                                <View style={{alignItems: 'center',}}>
                                    <View style={{width: 30,height: 30,borderRadius: 20,backgroundColor: `${Primary}15`,justifyContent: 'center',alignItems: 'center',marginBottom: 12,}}>
                                        <Ionicons name="camera-outline" size={16} color={Primary} />
                                    </View>
                                    <Text style={{fontSize: 14,fontWeight: '500',color: white,marginBottom: 4,}}>Front View</Text>
                                    <Text style={{fontSize: 12,color: '#6B7280',}}>Tap to upload</Text>
                                </View>
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
                        style={{flex: 1,height: 150,borderRadius: 6,borderWidth: form.backImage?  0: 1,borderColor: '#374151',borderStyle: 'dashed',justifyContent: 'center',alignItems: 'center',backgroundColor: '#1A1A1A',position: 'relative',}}
                        >
                            {form.backImage ? (
                                <>
                                    <Image source={{uri: form.backImage}} style={{width: '100%',height: '100%',borderRadius: 10,}} />
                                    <View style={{position: 'absolute',bottom: 0,left: 0,right: 0,backgroundColor: 'rgba(0,0,0,0.8)',borderBottomLeftRadius: 10,borderBottomRightRadius: 10,paddingVertical: 8,alignItems: 'center',flexDirection: 'row',justifyContent: 'center',}}>
                                        <Ionicons name="camera-outline" size={20} color={white} />
                                        <Text style={{color: white,fontSize: 12,fontWeight: '500',marginLeft: 4,}}>Change Image</Text>
                                    </View>
                                </>
                            ) : (
                                <View style={{alignItems: 'center',}}>
                                    <View style={{width: 30,height: 30,borderRadius: 20,backgroundColor: `${Primary}15`,justifyContent: 'center',alignItems: 'center',marginBottom: 12,}}>
                                        <Ionicons name="camera-outline" size={16} color={Primary} />
                                    </View>
                                    <Text style={{fontSize: 14,fontWeight: '500',color: white,marginBottom: 4,}}>Back View</Text>
                                    <Text style={{fontSize: 12,color: '#6B7280',}}>Tap to upload</Text>
                                </View>
                            )}
                        </TouchableOpacity>

                   </View>         
                </View>

                
                <View style={{flexDirection: 'row',alignItems: 'center',marginBottom: 8,paddingHorizontal: 19}}>
                    <Ionicons name="information-circle-outline" size={16} color={silver} />
                    <Text style={{fontSize: 14,fontWeight: '600',color: silver,marginLeft: 10,}}>Basic Information</Text>
                </View>

                <View style={{backgroundColor: '#111111',borderRadius: 6,padding: 20,marginBottom: 20,borderWidth: 1,borderColor: '#1F1F1F',width: "94%",alignSelf: "center"}}>
                    <StyledInput
                        label="Product Name"
                        placeholder="e.g., Cozy bedsitter near campus"
                        value={form.title}
                        onChangeText={(text) => handleChange('title', text)}
                        icon="home-outline"
                        onFocus={() => setFocusedInput('title')}
                        onBlur={() => setFocusedInput('')}
                        focused={focusedInput === 'title'}
                    />

                    <StyledInput
                        label="Description"
                        placeholder="Brief description of the Product..."
                        value={form.description}
                        onChangeText={(text) => handleChange('description', text)}
                        multiline={true}
                        icon="document-text-outline"
                        onFocus={() => setFocusedInput('description')}
                        onBlur={() => setFocusedInput('')}
                        focused={focusedInput === 'description'}
                    />

                    <StyledInput
                        label="Price (KES)"
                        placeholder="e.g., 15,000"
                        value={form.price}
                        onChangeText={(text) => handleChange('price', text)}
                        keyboardType="numeric"
                        icon="cash-outline"
                        onFocus={() => setFocusedInput('price')}
                        onBlur={() => setFocusedInput('')}
                        focused={focusedInput === 'price'}
                    />

                    <PhoneInput
                        label="Contact Phone"
                        value={form.contactPhone}
                        onChangeText={(text) => handleChange('contactPhone', text)}
                        onFocus={() => setFocusedInput('phone')}
                        onBlur={() => setFocusedInput('')}
                        focused={focusedInput === 'phone'}
                    />
                </View>

                <View style={{flexDirection: 'row',alignItems: 'center',marginBottom: 8,paddingHorizontal: 19}}>
                    <Ionicons name="location-outline" size={16} color={silver} />
                    <Text style={{fontSize: 14,fontWeight: '600',color: silver,marginLeft: 10,}}>Location & Category</Text>
                </View>

             <View style={{backgroundColor: '#111111',borderRadius: 6,padding: 20,marginBottom: 20,borderWidth: 1,borderColor: '#1F1F1F',width: "94%",alignSelf: "center"}}>

                <Dropdown
                    label="Location"
                    options={['Egerton', 'JKUAT']}
                    selectedValue={form.location}
                    onSelect={(value) => handleChange('location', value)}
                    iconName="location-outline"
                    desc="Select the area your item is located."
                    labell="Nearby Institution"
                    backgroundColor="#1A1A1A"
                    bordercolor="#374151"
                />

                <Dropdown
                    label="Category"
                    options={categories.map(cat => cat.name)}
                    selectedValue={form.category}
                    onSelect={(value) => handleChange('category', value)}
                    iconName="list-outline"
                    desc="Select the category of your Product"
                    backgroundColor="#1A1A1A"
                    bordercolor="#374151"
                />

                <Dropdown
                    label="Subcategory"
                    options={subOptions}
                    selectedValue={form.subcategory}
                    onSelect={(value) => handleChange('subcategory', value)}
                    iconName="chevron-down"
                    desc={
                        !form.category 
                            ? "Please select a category first" 
                            : subOptions.length === 0 
                                ? "No subcategories available for this category"
                                : form.subcategory && !subOptions.includes(form.subcategory)
                                    ? "⚠️ Current subcategory is not valid for selected category"
                                    : "Select a specific subcategory"
                    }
                    disabled={!form.category || subOptions.length === 0}
                    key={`subcategory-${form.category}-${subOptions.length}`}
                    backgroundColor="#1A1A1A"
                    bordercolor="#374151"
                />

                <Dropdown
                    label="Condition"
                    options={['New', 'Like New', 'Good', 'Fair', 'Poor']}
                    selectedValue={form.condition}
                    onSelect={(value) => handleChange('condition', value)}
                    iconName="checkmark-circle-outline"
                    desc="Select the condition of your Product"
                    backgroundColor="#1A1A1A"
                    bordercolor="#374151"
                />
            </View>

            <View style={{flexDirection: 'row',alignItems: 'center',marginBottom: 8,paddingHorizontal: 19}}>
                <Ionicons name="settings-outline" size={16} color={silver} />
                <Text style={{fontSize: 14,fontWeight: '600',color: silver,marginLeft: 10,}}>Additional Options</Text>
            </View>

            <View style={{backgroundColor: '#111111',borderRadius: 6,padding: 20,marginBottom: 8,borderWidth: 1,borderColor: '#1F1F1F',width: "94%",alignSelf: "center"}}>

                <StyledSwitch
                    label="Delivery Available"
                    value={form.deliveryOptions}
                    onValueChange={(value) => handleChange('deliveryOptions', value)}
                    description={form.deliveryOptions ? "Delivery services are offered" : "No delivery services"}
                    icon="car-outline"
                />

                <StyledSwitch
                    label="Currently Available"
                    value={form.isAvailable}
                    onValueChange={(value) => handleChange('isAvailable', value)}
                    description={form.isAvailable ? "Product is available " : "Product is not available"}
                    icon="time-outline"
                />
            </View>

             <TouchableOpacity
                style={[
                    styles.uploadButton,
                    !hasChanges && styles.disabledButton
                ]}
                onPress={handleUpdate}
                disabled={loading || submitting || !hasChanges}
                activeOpacity={0.7}
            >
                {submitting ?
                    <>
                    <ActivityIndicator size={12} color="white"/>
                    </> : 
                <>
                <Ionicons name="save" size={16} color={!hasChanges ? "#666" : "#fff"} style={{ marginRight: 6 }} />
                <Text style={[styles.uploadText, !hasChanges && styles.disabledText]}>
                    {hasChanges ? "Save Changes" : "No Changes to Save"}
                </Text>
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
            {loading && (
                    <View style={styles.loadingOverlay}>
                      <View style={styles.loadingBox}>
                        <ActivityIndicator size="small" color={white} />
                        <Text style={{ marginTop: 10, color: white }}>Loading product...</Text>
                      </View>
                    </View>
                  )}
        </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default Editproduct

const styles = StyleSheet.create({
    sectionContainer: {
        backgroundColor: '#111111',
        borderRadius: 16,
        padding: 20,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#1F1F1F',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: white,
        marginLeft: 18,
    },
    sectionSubtitle: {
        fontSize: 13,
        color: '#6B7280',
        marginBottom: 10,
        marginLeft: 30,
    },
    multilineInput: {
         minHeight: 80,
         textAlignVertical: 'top',
         paddingVertical: 6,
    },
    uploadButton: {
        marginTop: 6,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Primary,
        paddingVertical: 11,
        borderRadius: 8,
        justifyContent: 'center',
    },
    uploadText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '500',
    },
    disabledButton: {
        backgroundColor: secondary,
        opacity: 0.6,
    },
    disabledText: {
        color: '#9CA3AF',
    },
    resetButton: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'transparent',
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Primary,
        justifyContent: 'center',
    },
    resetText: {
        color: Primary,
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
})