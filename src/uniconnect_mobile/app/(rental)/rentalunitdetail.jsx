import { StyleSheet, Text, View, ActivityIndicator,ScrollView,Dimensions,TouchableOpacity ,Platform, Linking} from 'react-native'
import { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from "react-native-safe-area-context";
import Header from '../../components/header';
import { Primary, secondary, silver, white,Gray } from '../../utils/colors';
import { router, useLocalSearchParams } from "expo-router";
import { useToast } from "@/context/ToastProvider";
import Detailimgage from '../../components/detailimgage';
import { Ionicons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import Contactcard from '../../components/contactcard'
import { getUnitWithProperty } from '../../lib/rentals/rental';
import { useAuthGuard } from '../../utils/useAuthGuard'


const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const Rentalunitdetail = () => {
  const { showSuccess, showError } = useToast();
  const {unitId} = useLocalSearchParams()
  const [isloading, setIsLoading] = useState(false)
  const [unit, setUnit] = useState(null);
  const [property, setProperty] = useState(null);
  const { isAuthenticated, checking } = useAuthGuard('/');


  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 200;

  const truncatedText = property?.description?.length > maxLength
    ? property.description.slice(0, maxLength) + '...'
    : property?.description || '';

  useEffect(() => {
    if(!unitId){
      console.log("no unit")
      router.replace("/rentals")
    } else {
      const fetchData = async () => {
        setIsLoading(true)
        try {
          const res = await getUnitWithProperty(unitId);
          
          if(!res.success){
            router.back()
            showError("Oops! We couldn't fetch the property details.Please try again.")
          }

          if (res.success) {
            setUnit(res.unit);
            setProperty(res.property);
          } 
        } catch(error) {
          console.log(error)
        } finally {
          setIsLoading(false)
        }
      };

      fetchData();
    }
  }, [unitId])
  
  const ReturnDetails = () => {
      return(
        <View style={{height: "100%", width: "100%"}}>
          <Detailimgage price={unit?.price} title={property?.title} frontImage={property?.frontImage} backImage={property?.backImage}/>

          <View  style={{width: "100%",justifyContent: "space-evenly",paddingHorizontal: 16,marginTop: 10,paddingVertical: 10}}>
            <Text style={{fontSize: 14, fontWeight:500, marginBottom: 10, color: white}}>
              Property Summary
            </Text>
           <View style={{borderRadius: 8, overflow: "hidden" }}>
              {/* Table Header */}
              <View style={{ flexDirection: "row", backgroundColor: secondary, paddingVertical: 6 }}>
                <View style={{ width: "50%", alignItems: "center" }}>
                  <Text style={{ fontWeight: "bold", fontSize: 12, color: white }}>Deposit</Text>
                </View>
                <View style={{ width: "50%", alignItems: "center" }}>
                  <Text style={{ fontWeight: "bold", fontSize: 12, color: white }}>Managed By</Text>
                </View>
              </View>

              {/* Row 1 */}
              <View style={{ flexDirection: "row", paddingVertical: 6 }}>
                <View style={{ flexDirection: "row", alignItems: "center", width: "50%", justifyContent: "center" }}>
                  <Ionicons name="wallet" size={15} color={Gray} style={{ marginRight: 6 }} />
                  <Text style={{ fontSize: 14, color: silver }}>{unit?.deposit || "N/A"}</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", width: "50%", justifyContent: "center" }}>
                  <Ionicons name="person-outline" size={15} color={Gray} style={{ marginRight: 6 }} />
                  <Text style={{ fontSize: 14, color: silver }}>{property?.managedBy || "N/A"}</Text>
                </View>
              </View>

              {/* Table Header Row 2 */}
              <View style={{ flexDirection: "row", backgroundColor: secondary, paddingVertical: 6 }}>
                <View style={{ width: "50%", alignItems: "center" }}>
                  <Text style={{ fontWeight: "bold", fontSize: 14, color: white }}>Type</Text>
                </View>
                <View style={{ width: "50%", alignItems: "center" }}>
                  <Text style={{ fontWeight: "bold", fontSize: 14, color: white }}>Location</Text>
                </View>
              </View>

              {/* Row 2 */}
              <View style={{ flexDirection: "row",paddingVertical: 6 }}>
                <View style={{ flexDirection: "row", alignItems: "center", width: "50%", justifyContent: "center" }}>
                  <Ionicons name="bed-outline" size={15} color={Gray} style={{ marginRight: 6 }} />
                  <Text style={{ fontSize: 14, color: silver }}>{unit?.type || "N/A"}</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", width: "50%", justifyContent: "center" }}>
                  <Ionicons name="location-outline" size={15} color={Gray} style={{ marginRight: 6 }} />
                  <Text numberOfLines={2} style={{ fontSize: 14, color: silver }}>{property?.location || "N/A"}</Text>
                </View>
              </View>
            </View>

            
           <View style={{flexDirection: "row",width: "100%",justifyContent: "space-evenly"}}>
              
          </View>
          </View>

          <View style={{ flex: 1,padding: 16,}}>
              <Text style={{fontSize: 14,fontWeight:500,color: white}}>Description</Text>
                        
              <Text style={{fontSize: 14,color: Gray,marginTop: 7,lineHeight: 22,}}>
              {isExpanded ? property?.description : truncatedText}
            </Text>
            {property?.description?.length > maxLength && (
              <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
                <Text style={{color: "#F07500",marginTop: 4,fontWeight: 500,alignSelf: "flex-end"}}>
                  {isExpanded ? 'Show Less' : 'Show More'}
                </Text>
              </TouchableOpacity>
            )}

          <Text style={{fontSize: 14,fontWeight:500,color: white,marginVertical: 10}}>Amenities</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 5 }}>
           {Array.isArray(JSON.parse(unit?.amenities || "[]")) &&
            JSON.parse(unit?.amenities || "[]").map((item, index) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: "48%", 
                  marginBottom: 5,
                }}
              >
                <Ionicons name="checkmark-outline" size={16} color={silver} style={{ marginRight: 6 }} />
                <Text style={{ fontSize: 13, color: silver }}>{item}</Text>
              </View>
          ))}
          </View>
          
          <Text style={{fontSize: 14,fontWeight:500,color: white,marginVertical: 10}}>Contact details</Text>
          <View style={{marginVertical: 8,padding: 5,alignItems: 'center',borderColor: secondary,borderWidth: 1,borderRadius: 10,}}>
              <Contactcard name={property?.title} type={property?.managedBy} phoneNumber={property?.contactPhone} ownerId={property?.userId}/>
          </View>

          <View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                if (!property?.latitude || !property?.longitude) {
                Alert.alert("Location Error", "Location coordinates are not available.");
                return;
                }

                const lat = parseFloat(property.latitude);
                const lng = parseFloat(property.longitude);

                if (isNaN(lat) || isNaN(lng)) {
                showError("Location Error", "Invalid location data.");
                return;
                }

                const geoURL = Platform.select({
                ios: `http://maps.apple.com/?ll=${lat},${lng}`,
                android: `geo:${lat},${lng}?q=${lat},${lng}`
                });

                const fallbackURL = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

                Linking.openURL(geoURL).catch(() => {
                Linking.openURL(fallbackURL);
              });
            }}
              disabled={!(property?.latitude && property?.longitude)}
              style={{
                marginVertical: 8,
                padding: 12,
                alignItems: 'center',
                borderRadius: 10,
                backgroundColor: Primary,
                flexDirection: "row",
                justifyContent: "center"
              }}>
              <Ionicons name="location" size={16} color="#fff" />
              <Text style={{color: "white",fontWeight: 600,fontSize: 14,marginLeft: 5}}>
                Get Direction
              </Text>
            </TouchableOpacity>
          </View>
          
          </View>
          
        </View>
      )
  }
  return (
    
      <SafeAreaView style={{ flex: 1 }}>
        <Header
          title="Property info"
          color={white}
          Size={16}
          showBackButton={true}
          showIcons={false}
        />
        <ScrollView style={{flex: 1,}} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
          <View style={{height: "auto",overflow: "scroll"}}>
            <ReturnDetails/>
          </View>
        </ScrollView>

        {isloading && (
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingBox}>
              <ActivityIndicator size={22} color={white} />
              <Text style={{ marginTop: 10, color: white }}>Loading property...</Text>
            </View>
          </View>
        )}
      </SafeAreaView>

  )
}

export default Rentalunitdetail

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