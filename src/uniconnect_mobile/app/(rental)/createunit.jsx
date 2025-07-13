import { useState, useEffect } from "react"
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch,TextInput, ActivityIndicator,Dimensions,KeyboardAvoidingView, Platform, } from "react-native"
import { SafeAreaView,useSafeAreaInsets } from "react-native-safe-area-context"
import { white,secondary,Primary,silver,Gray } from "../../utils/colors"
import Header from "../../components/header";
import { router, useLocalSearchParams } from "expo-router";
import { useToast } from "@/context/ToastProvider";
import { Ionicons,Feather,MaterialIcons,FontAwesome } from '@expo/vector-icons';
import { createUnit } from "../../lib/rentals/rental";
import { useAuthGuard } from '../../utils/useAuthGuard'

const Createunit = () => {
    const {id} = useLocalSearchParams()

    useEffect(() => {
       const checkIdExists = () => {
        if(!id ){
          router.replace("/dashindex")
        }
       }
        checkIdExists()
    },[id])
  

    const { showSuccess, showError } = useToast();
    const [unitType, setUnitType] = useState('');
    const [noOfBedrooms, setnoOfBedrooms] = useState('');
    const [noOfBathrooms, setnoOfBathrooms] = useState('');
    const [rent, setrent] = useState('');
    const [deposit, setdeposit] = useState('');
    const [isVacant, setIsVacant] = useState(true);
    const [isFurnished, setIsFurnished] = useState(false);
     const [amenities, setAmenities] = useState("");
    const [uploading, setUploading] = useState(false);
    const { isAuthenticated, checking } = useAuthGuard('/');

    const [unitTypeactive, setUnitTypeactive] = useState(false);
    const [noOfBedroomsactive, setnoOfBedroomsactive] = useState(false);
    const [noOfBathroomsactive, setnoOfBathroomsactive] = useState(false);
    const [rentactive, setrentactive] = useState(false);
    const [depositactive, setdepositactive] = useState(false);
    const [amenitiesactive, setAmenitiesactive] = useState(false);

    const handleUpload = async() => {
       if (!unitType) {
        showError("unit type can't be empty.");
        return;
      }
       if (!noOfBathrooms) {
        showError("No of Bathrooms can't be empty, even zero can work.");
        return;
      }
       if (!noOfBedrooms) {
        showError("No of Bedrooms can't be empty, even zero can work.");
        return;
      }
       if (!rent) {
        showError("unit rent can't be empty.");
        return;
      }
       if (!deposit) {
        showError("unit deposit can't be empty.Even zero can work");
        return;
      }
       if (!amenities) {
        showError("Amenities can't be empty.input even one or more separate them with a comma");
        return;
      }
      const amenitiesArray = amenities.split(",").map((item) => item.trim());
      const ammenities = JSON.stringify(amenitiesArray);
      setUploading(true)
      try{
        const result = await createUnit({id,unitType, noOfBedrooms: parseInt(noOfBedrooms),
      noOfBathrooms: parseInt(noOfBathrooms),
      rent: parseInt(rent),              
      deposit: parseInt(deposit),isVacant,isFurnished,ammenities})

      if(!result.success){
        showError("Failed to create your property unit,Check your connection and try again")
        return
      }

        if(result.success){
          console.log(result)
          showSuccess("Your Property unit has been posted successfully!")
          router.replace("/dashindex")
        }

      }catch(error){
        console.error("Upload unit Error:", error);
        showError("Something went wrong. Please try again or check your internet connection.");
      }finally{
        setUploading(false)
      }

    }


  return (
    <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
    <SafeAreaView style={{flex: 1,backgroundColor: "#000"}}>
      <Header
        showBackButton={true}
        title="Create Units"
        color={white}
        Size={17}
        showIcons={false}
        backPath="/dashindex"
       />
        <ScrollView 
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}>
        {/* Paper Information Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>New Unit Information</Text>
          <Text style={styles.cardDescription}>Fill in the form below </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Unit Type</Text>
            <TextInput
              style={[styles.input, {borderColor: unitTypeactive  ? Primary : "#374151" ,color: "white"}]}
              placeholder="e.g., One bedroom"
              value={unitType}
              onChangeText={setUnitType}
              maxLength={500}
              onFocus={() => setUnitTypeactive(true)}
              onBlur={() => setUnitTypeactive(false)}
            />
          </View>

          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>No. of bedrooms</Text>
              <TextInput
                style={[styles.input, {borderColor: noOfBedroomsactive  ? Primary : "#374151",color: "white" }]}
                keyboardType="number-pad"
                placeholder="e.g., 1"
                value={noOfBedrooms}
                onChangeText={setnoOfBedrooms}
                maxLength={500}
                onFocus={() => setnoOfBedroomsactive(true)}
                onBlur={() => setnoOfBedroomsactive(false)}
              />
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>No. of bath/wash rooms</Text>
              <TextInput
                style={[styles.input, {borderColor: noOfBathroomsactive  ? Primary : "#374151",color: "white" }]}
                keyboardType="number-pad"
                placeholder="e.g., 2"
                value={noOfBathrooms}
                onChangeText={setnoOfBathrooms}
                maxLength={100}
                onFocus={() => setnoOfBathroomsactive(true)}
                onBlur={() => setnoOfBathroomsactive(false)}
              />
            </View>
          </View>

          <View style={[styles.row, {marginVertical: 6}]}>
            <View style={styles.column}>
              <Text style={styles.label}>Rent Per Month (Ksh)</Text>
              <TextInput
                style={[styles.input, {borderColor: rentactive  ? Primary : "#374151" ,color: "white"}]}
                keyboardType="number-pad"
                placeholder="e.g., 12000"
                value={rent}
                onChangeText={setrent}
                maxLength={500}
                onFocus={() => setrentactive(true)}
                onBlur={() => setrentactive(false)}
              />
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>Deposit (Ksh)</Text>
              <TextInput
                style={[styles.input, {borderColor: depositactive  ? Primary : "#374151",color: "white" }]}
                keyboardType="number-pad"
                placeholder="e.g., 5000"
                value={deposit}
                onChangeText={setdeposit}
                maxLength={100}
                onFocus={() => setdepositactive(true)}
                onBlur={() => setdepositactive(false)}
              />
            </View>
          </View>

          <View style={[styles.row, {marginVertical: 6}]}>
            <View style={styles.column}>
              <Text style={styles.label}>Vacancy status</Text>
              <View style={{flexDirection: 'row',justifyContent: 'space-between',alignItems: 'center',backgroundColor: secondary,width: "100%",borderWidth: 1,borderColor: "#374151",borderRadius: 8,paddingHorizontal: 12,paddingVertical: 6}}>
                <Text style={{color: "gray",fontSize: 14,fontWeight: 500}}>Vacant</Text>
                <Switch value={isVacant} 
                size={14}
                onValueChange={() => setIsVacant(!isVacant)} 
                trackColor={{ false: Gray , true: Gray }}
                thumbColor={isVacant ? Primary: white}
                />
            </View>
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>Furnish status</Text>
              <View style={{flexDirection: 'row',justifyContent: 'space-between',alignItems: 'center',backgroundColor: secondary,width: "100%",borderWidth: 1,borderColor: "#374151",borderRadius: 8,paddingHorizontal: 12,paddingVertical: 6}}>
                <Text style={{color: "gray",fontSize: 14,fontWeight: 500}}>Furnished</Text>
                <Switch value={isFurnished} 
                size={14}
                onValueChange={() => setIsFurnished(!isFurnished)} 
                trackColor={{ false: Gray , true: Gray }}
                thumbColor={isFurnished ? Primary: white}
                />
            </View>
            </View>
          </View>


          <View style={styles.inputGroup}>
            <Text style={styles.label}>Amenities</Text>
            <TextInput
              style={[styles.input, {borderColor: amenitiesactive  ? Primary : "#374151",color: "white" }]}
              placeholder="e.g., Free electricity, WiFi, Parking"
              value={amenities}
              onChangeText={setAmenities}
              maxLength={500}
              onFocus={() => setAmenitiesactive(true)}
              onBlur={() => setAmenitiesactive(false)}
            />
             <Text style={{ fontSize: 12, color: silver, marginTop: 4 }}>
              Separate each amenity with a comma (,)
            </Text>
          </View>
          
        </View>

        {/* Buttons */}
        <TouchableOpacity
          style={styles.uploadButton}
          activeOpacity={0.7}
          onPress={() => {
            handleUpload()
          }}
        >
          {uploading ? (
              <ActivityIndicator size={16} color="#fff" />
            ) : (
              <>
                <Text style={styles.uploadText}>Create Unit</Text>
              </>
            )}
          
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          activeOpacity={0.7}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
    </KeyboardAvoidingView>
  )
}

export default Createunit

const styles = StyleSheet.create({
    form: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#1f2937",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    color: "#ffffff",
    fontSize: 16,
  },
  inputError: {
    borderColor: "#dc2626",
  },
  textArea: {
    height: 100,
  },
  content: {
    padding: 16,
  },
  card: {
    // backgroundColor: '#fff',
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
    color: silver
  },
  input: {
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    backgroundColor: secondary,
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
})