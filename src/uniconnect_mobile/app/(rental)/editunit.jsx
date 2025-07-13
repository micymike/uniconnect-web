import { useState, useEffect } from "react"
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch,TextInput, ActivityIndicator,Dimensions,KeyboardAvoidingView, Platform, } from "react-native"
import { SafeAreaView,useSafeAreaInsets } from "react-native-safe-area-context"
import { white,secondary,Primary,silver,Gray } from "../../utils/colors"
import Header from "../../components/header";
import { router, useLocalSearchParams } from "expo-router";
import { useToast } from "@/context/ToastProvider";
import { Ionicons,Feather,MaterialIcons,FontAwesome } from '@expo/vector-icons';
import { readOneUnit,updateOneUnit } from "../../lib/rentals/rental";
import { useAuthGuard } from '../../utils/useAuthGuard'

const Editunit = () => {
    const { showSuccess, showError } = useToast();
    const {id} = useLocalSearchParams()
    console.log("unit id",id)

    const [initialData, setInitialData] = useState(null);
    const [isLoading, setIsLoading] = useState(false)
    const [uploading, setUploading] = useState(false);
    const { isAuthenticated, checking } = useAuthGuard('/');

    const [unitType, setUnitType] = useState('');
    const [noOfBedrooms, setnoOfBedrooms] = useState(null);
    const [noOfBathrooms, setnoOfBathrooms] = useState('');
    const [rent, setrent] = useState('');
    const [deposit, setdeposit] = useState('');
    const [isVacant, setIsVacant] = useState(true);
    const [isFurnished, setIsFurnished] = useState(false);
     const [amenities, setAmenities] = useState([]);

    const [unitTypeactive, setUnitTypeactive] = useState(false);
    const [noOfBedroomsactive, setnoOfBedroomsactive] = useState(false);
    const [noOfBathroomsactive, setnoOfBathroomsactive] = useState(false);
    const [rentactive, setrentactive] = useState(false);
    const [depositactive, setdepositactive] = useState(false);
    const [amenitiesactive, setAmenitiesactive] = useState(false);

   useEffect(() => {
      const fetchUnit = async () => {
        if (!id) {
          router.replace('/dashindex');
          return;
        }
        setIsLoading(true);
        try {
          const result = await readOneUnit(id); 

          if(!result.success){
            showError("Failed to get initial data, check your connection and try again")
            router.replace("dashindex")
            return
          }
          
          if (result.success) {
            console.log('Fetched result:', result);
            
            let parsedAmenities = '';
            if (result.result.amenities) {
              try {
                const amenitiesArray = JSON.parse(result.result.amenities);
                parsedAmenities = amenitiesArray.join(', ');
                console.log('Parsed amenities:', parsedAmenities);
              } catch (error) {
                console.error('Error parsing amenities:', error);
                parsedAmenities = result.amenities; 
              }
            }

            const original = {
              type: result.result.type || '',
              price: result.result.price?.toString() || '',
              isFurnished: result.result.isFurnished ?? false,
              vacancyStatus: result.result.vacancyStatus ?? false,
              amenities: parsedAmenities,
              deposit: result.result.deposit?.toString() || '',
              noOfBedrooms: result.result.noOfBedrooms?.toString() || '',
              noOfBathrooms: result.result.noOfBathrooms?.toString() || '',
            };

            console.log('Original data:', original);
            setInitialData(original);

            setUnitType(original.type);
            setnoOfBedrooms(original.noOfBedrooms);
            setnoOfBathrooms(original.noOfBathrooms);
            setrent(original.price);
            setdeposit(original.deposit);
            setIsFurnished(original.isFurnished);
            setIsVacant(original.vacancyStatus);
            setAmenities(original.amenities); 
            
          }

        } catch (error) {
          console.log('Error fetching unit:', error);
          showError("Failed to fetch data to be updated, try again");
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchUnit();
    }, [id]);

    const hasChanges = () => {
      if (!initialData) return false;
      
      return (
        unitType !== initialData.type ||
        noOfBedrooms !== initialData.noOfBedrooms ||
        noOfBathrooms !== initialData.noOfBathrooms ||
        rent !== initialData.price ||
        deposit !== initialData.deposit ||
        isFurnished !== initialData.isFurnished ||
        isVacant !== initialData.vacancyStatus ||
        amenities !== initialData.amenities
      );
    };

    const handleSave = async () => {
      if (!hasChanges()) return;

      setUploading(true);

      try {
        let amenitiesArray = [];
        if (amenities && amenities.trim()) {
          amenitiesArray = amenities.split(',').map(item => item.trim()).filter(item => item);
        }

       const updatedListing = await updateOneUnit(id, {
          type: unitType,
          noOfBedrooms: parseInt(noOfBedrooms) || 0,
          noOfBathrooms: parseInt(noOfBathrooms) || 0,
          price: parseInt(rent) || 0,
          deposit: parseInt(deposit) || 0,
          isFurnished,
          vacancyStatus: isVacant,
          amenities: JSON.stringify(amenitiesArray)
        });

        if(!updatedListing.success){
          showError("Failed to update your property unit, try again or check your connection")
        }
        if(updatedListing.success){
            showSuccess("Your property unit has been updated succesfully")
            router.replace("/dashindex")
        }
        console.log("Awaited result: ", updatedListing);
      } catch (error) {
        console.error('Error updating unit:', error);
        showError('Failed to update unit. Please try again.');
      } finally {
        setUploading(false);
      }
    };



  return (
    <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
    <SafeAreaView style={{flex: 1,backgroundColor: "#000"}}>
      <Header
        showBackButton={true}
        title="Edit Units"
        color={white}
        Size={19}
        showIcons={false}
       />
        <ScrollView 
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}>
        {/* Paper Information Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Edit Information</Text>
          <Text style={styles.cardDescription}>Update Unit details</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Unit Type</Text>
            <TextInput
              style={[styles.input, {borderColor: unitTypeactive  ? Primary : "#374151",color: "#fff" }]}
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
                style={[styles.input, {borderColor: noOfBedroomsactive  ? Primary : "#374151",color: "#fff" }]}
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
              <Text style={styles.label}>No. of bathrooms</Text>
              <TextInput
                style={[styles.input, {borderColor: noOfBathroomsactive  ? Primary : "#374151",color: "#fff" }]}
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
                style={[styles.input, {borderColor: rentactive  ? Primary : "#374151",color: "#fff" }]}
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
                style={[styles.input, {borderColor: depositactive  ? Primary : "#374151" ,color: "#fff"}]}
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
              style={[styles.input, {borderColor: amenitiesactive  ? Primary : "#374151",color: "#fff" }]}
              placeholder="e.g., Water, Parking, Free electricity"
              value={amenities}
              onChangeText={setAmenities}
              maxLength={500}
              onFocus={() => setAmenitiesactive(true)}
              onBlur={() => setAmenitiesactive(false)}
            />
          </View>
          
        </View>

        {/* Buttons */}
        <TouchableOpacity
          style={styles.uploadButton}
          activeOpacity={0.7}
          disabled={!hasChanges()}
          onPress={() => {
            handleSave();
          }}
        >
          {uploading ? (
              <ActivityIndicator size={16} color="#fff" />
            ) : (
              <>
                 <Ionicons name="save" size={16} color="#fff" style={{ marginRight: 6 }} />
                <Text style={styles.uploadText}>Save Changes</Text>
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
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingBox}>
            <ActivityIndicator size="small" color={white} />
            <Text style={{ marginTop: 10, color: white }}>Loading unit...</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
    </KeyboardAvoidingView>
  )
}

export default Editunit

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