import { StyleSheet, Text, View,Dimensions,TouchableOpacity ,Image} from 'react-native'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { secondary,Primary, silver, white, Gray } from '../utils/colors';

const windowWidth = Dimensions.get('window').width;
const Rentalcard = ({item}) => {
  const property = item.property || {};
  return (
    
     <TouchableOpacity
        onPress={() =>{
          router.push({
            pathname: '/rentalunitdetail',
            params: { unitId: item.$id  }
          });
        }}
        activeOpacity={0.7}
        style={{
            paddingVertical: 6,
            paddingHorizontal: 10,
            borderRadius: 12,
            marginBottom: 6,
            flexDirection: "row",
            alignItems: "center",
            justifyContent:"space-between"
        }}>
        <View style={{backgroundColor: secondary,width: 85,height: 85,borderRadius: 8,overflow: "hidden"}}>
            <Image
            source={{uri: property?.frontImage}}
            style={{width: "100%",height: "100%",}}
            />

        </View>
        <View style={{width: "70%",height: 80,paddingVertical: 5,justifyContent: "space-between"}}>
              <View>
                <Text style={{fontWeight: 600,color: white}}>  {property.title || "Unnamed Property"}</Text>
                <View style={{flexDirection:"row", alignItems: "center",marginVertical: 3}}>
                    <Ionicons name="location-outline" size={13} color={Gray} style={{marginLeft:4,}}/>
                    <Text style={{ color:silver, marginHorizontal: 3,fontSize: 12 }}>{property.location || "Unknown location"}</Text>
                </View>
                <View style={{flexDirection: "row",alignItems: "center",marginVertical: 2}}>
                  
                  {item.isFurnished && (
                      <Text style={{backgroundColor: "#2a1205",padding:2,color: Primary,borderRadius: 8,paddingHorizontal: 12,fontSize: 11,marginHorizontal: 2}}>Furnished</Text>
                    )}
                    {item.vacancyStatus && (
                      <Text style={{backgroundColor: "#2a1205",padding:2,color: Primary,borderRadius: 8,paddingHorizontal: 12,fontSize: 11,marginHorizontal: 2}}>Vacant</Text>
                    )}
                </View>
              </View>

              <View style={{flexDirection:"row", alignItems: "center",justifyContent: "space-between",marginTop: 4}}>
                <View style={{flexDirection:"row", alignItems: "center"}}>
                    <Ionicons name="bed" size={13} color={Gray} style={{marginLeft:4,}}/>
                    <Text style={{ color:silver, marginHorizontal: 3,fontSize: 12 }}>{item.type || "N/A"}</Text>
                </View>
                <Text style={{ color:Primary, marginHorizontal: 3 ,fontWeight: 700,fontSize: 13}}>Ksh. {item.price?.toLocaleString() || "0"}</Text>
              </View>


        </View>
        
    </TouchableOpacity>
  )
}

export default Rentalcard

const styles = StyleSheet.create({})
