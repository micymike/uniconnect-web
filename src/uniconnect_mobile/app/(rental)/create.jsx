import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import * as Location from 'expo-location'
import AntDesign from '@expo/vector-icons/AntDesign'
import * as DocumentPicker from 'expo-document-picker'
import { useRouter } from "expo-router"
import { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, Dimensions, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Account, Client } from "react-native-appwrite"
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomInput from '../../components/custominput'
import Dropdown from '../../components/dropdown'
import Header from '../../components/header'
import Productimg from '../../components/productimg'
import Textarea from '../../components/textarea'
import { getBusinessByUserId } from '../../lib/business/business'
import { createRental, getPropertyTypes } from '../../lib/rentals/rental'
import { Gray, secondary, silver, white } from '../../utils/colors'

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

export default function Create() {
    const [tabIndex, setTabIndex] = useState(0);
    const [frontImage, setFrontImage] = useState("");
    const [backImage, setBackImage] = useState("");
    const [title, setTitle] = useState("")
    const [price, setPrice] = useState("")
    const [category , setCategory] = useState("")
    const [condition, setCondition] = useState("")
    const [description, setdescription] = useState("")
    const [location, setlocation] = useState("")
    const [latitude, setLatitude] = useState(null)
    const [longitude, setLongitude] = useState(null)
    const [agreed, setAgreed] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [propertyTypes, setPropertyTypes] = useState([]);
    const [userId, setUserId] = useState("");
    const maxLength = 200;
    const [businessId, setBusinessId] = useState("");
    const [showBusinessModal, setShowBusinessModal] = useState(false);
    const router = useRouter();

    // Appwrite client setup
    useEffect(() => {
      // Fetch property types from DB
      getPropertyTypes().then(types => {
        if (types && types.length > 0) setPropertyTypes(types);
        else setPropertyTypes([
          'Apartment', 'House', 'Bedsitter', 'Single Room', 'Hostel', 'Studio', 'Shared Room', 'Guest House', 'Duplex', 'Townhouse', 'Cottage', 'Bungalow', 'Villa', 'Commercial Space', 'Office', 'Shop', 'Warehouse', 'Others'
        ]);
      });

      // Fetch current user ID and business ID
      const client = new Client()
        .setEndpoint("https://cloud.appwrite.io/v1")
        .setProject("67fc0576000b05b9e495");
      const account = new Account(client);
      account.get().then(user => {
        setUserId(user.$id);
        // Fetch businessId for this user
        getBusinessByUserId(user.$id).then(res => {
          if (res.success && res.business) {
            setBusinessId(res.business.$id);
          } else {
            setBusinessId("");
          }
        });
      }).catch(() => {
        setUserId("");
        setBusinessId("");
      });
    }, []);

    // Reset form state on mount
    useEffect(() => {
        setTabIndex(0);
        setFrontImage("");
        setBackImage("");
        setTitle("");
        setPrice("");
        setCategory("");
        setCondition("");
        setdescription("");
        setlocation("");
        setAgreed(false);
        setIsExpanded(false);
        setIsPublishing(false);
    }, []);

    
    // Image picker logic
    const pickImage = async (which) => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'image/*',
                copyToCacheDirectory: true,
                multiple: false,
            });
            if (result.canceled || result.type === 'cancel') {
                console.log('User canceled image picker');
                return;
            }
            // For SDK 49+, result.assets; for older, result.uri
            handleImageResponse(result, which);
        } catch (error) {
            console.error('Document picker error:', error);
            Alert.alert("Error", "Failed to pick image. Please try again.");
        }
    };
    
    const handleImageResponse = (response, which) => {
        try {
            let imageUri = null;
            if (response.assets && response.assets.length > 0) {
                // SDK 49+ format
                imageUri = response.assets[0].uri;
            } else if (response.uri) {
                // Older format
                imageUri = response.uri;
            }
            if (imageUri) {
                if (which === "front") setFrontImage(imageUri);
                if (which === "back") setBackImage(imageUri);
            } else {
                Alert.alert("Error", "No image was selected or there was a problem with the selected image.");
            }
        } catch (error) {
            console.error('Error handling image response:', error);
            Alert.alert("Error", "There was a problem processing the selected image.");
        }
    };

    const checklist = [
        "Verify your price is competitive by checking similar rentals in the marketplace.",
    ];

    const handleNext = () => {
        if (tabIndex < 4) {
          setTabIndex(tabIndex + 1);
        } else {
          console.log("Submit the form");
        }
    };
    const handleBack = () => {
        if (tabIndex > 0) {
          setTabIndex(tabIndex - 1);
        }
      };

    // Render subheading for each step
    const renderSubHeading = ({title, paragraph}) => {
        return (
            <View>
                <View style={{alignItems: "center", justifyContent: "center", flexDirection: "row",marginVertical: 3}}>
                    <View style={{width:tabIndex === 0 ?18 : 18,backgroundColor: "#F07500",height: 5,borderRadius: 2}}/>
                    <View style={{width: tabIndex > 0 && tabIndex >= 1 ? 18: 15,backgroundColor:tabIndex > 0 && tabIndex >= 1 ? "#F07500" : Gray,height: 5,borderRadius: 4,marginHorizontal: 2}}/>
                    <View style={{width: tabIndex > 0 && tabIndex >= 2 ? 18: 15,backgroundColor:tabIndex > 0 && tabIndex >= 2 ? "#F07500" : Gray,height: 5,borderRadius: 3,marginHorizontal: 2}}/>
                    <View style={{width: tabIndex > 0 && tabIndex >= 3 ? 18: 15,backgroundColor:tabIndex > 0 && tabIndex >= 3 ? "#F07500" : Gray,height: 5,borderRadius: 3,marginHorizontal: 2}}/>
                    <View style={{width: tabIndex > 0 && tabIndex >= 4 ? 18: 15,backgroundColor:tabIndex > 0 && tabIndex >= 4 ? "#F07500" : Gray,height: 5,borderRadius: 3,marginHorizontal: 2}}/>
                </View>
                <Text style={styles.heading}>{title}</Text>
                <Text style={styles.subText}>{paragraph}</Text>
            </View>
        );
    };

    // Render each step/tab
    const renderTab = () => {
        switch (tabIndex) {
          case 0:
            return (
              <View style={styles.tabContainer}>
                {renderSubHeading({
                    title: "Add Photos",
                    paragraph: "Add up to 2 photos of your rental property"
                })}

                <View style={{flexDirection: "row",justifyContent: "space-evenly",alignItems: "center"}}>
                  <View style={{ position: "relative", width: "45%" }}>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={[styles.imageBox, frontImage && styles.imageBoxFilled]}
                      onPress={() => pickImage("front")}
                    >
                      {frontImage ? (
                        <Image resizeMode='contain' source={{ uri: frontImage }} style={styles.image} />
                      ) : (
                        <>
                          <Ionicons name="camera-outline" size={20} color={Gray} />
                          <Text style={styles.placeholder}>Image one</Text>
                        </>
                      )}
                    </TouchableOpacity>
                    {frontImage ? (
                      <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setFrontImage("")}
                      >
                        <Ionicons name="close" size={10} color="#fff" />
                      </TouchableOpacity>
                    ) : null}
                  </View>
                  <View style={{ position: "relative", width: "45%" }}>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={[styles.imageBox, backImage && styles.imageBoxFilled]}
                      onPress={() => pickImage("back")}
                    >
                      {backImage ? (
                        <Image resizeMode='contain' source={{ uri: backImage }} style={styles.image} />
                      ) : (
                        <>
                          <Ionicons name="camera-outline" size={20} color="gray" />
                          <Text style={styles.placeholder}>Back view</Text>
                        </>
                      )}
                    </TouchableOpacity>
                    {backImage ? (
                      <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setBackImage("")}
                      >
                        <Ionicons name="close" size={10} color="#fff" />
                      </TouchableOpacity>
                    ) : null}
                  </View>
                </View>

                <Text style={styles.tip}>Tip: Include photos of rooms, exterior, and any special features</Text>

      <TouchableOpacity
      activeOpacity={0.7}
        style={[
            {
              backgroundColor: '#F07500',
              paddingHorizontal: 14,
              paddingVertical: 9,
              borderRadius: 6,
              alignItems: 'center',
              marginTop: 16,
            },
            !(frontImage && backImage) && styles.disabled
          ]}
        disabled={!(frontImage && backImage)}
        onPress={() => setTabIndex(1)}
      >
        <Text style={styles.nextText}>Next</Text>
      </TouchableOpacity>
              </View>
            );
          case 1:
            return (
              <View style={styles.tabContainer}>
                {renderSubHeading({
                    title: "Property Details",
                    paragraph: "Tell us about your rental property"
                })}
                <ScrollView
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                 >

                <View style={{width: windowWidth * 0.9,height: "auto",marginTop: 12,justifyContent: "center",alignItems:"center",borderRadius: 12,paddingVertical: 20}}>
                <CustomInput
                  label="Title "
                  placeholder="eg. Cozy 2-bedroom in Egerton"
                  value={title}
                  onChangeText={(text) => {
                   setTitle(text);
                   }}
                 style={{marginVertical: 5}}
                />

                <CustomInput
                  label="Price/month (Ksh) "
                  placeholder="eg. 8000"
                  value={price}
                  onChangeText={(text) => {
                   setPrice(text);
                   }}
                 style={{marginVertical: 5}}
                />

               <Dropdown
                 label="Property Type"
                 options={propertyTypes}
                 selectedValue={category}
                 onSelect={(value) => setCategory(value)}
                 iconName="chevron-down"
               />

                <Dropdown
                 label="Bathroom in house"
                 options={['None - outside', 'In house']}
                 selectedValue={condition}
                 onSelect={(value) => setCondition(value)}
                 iconName="chevron-down"
               />

                </View>

                <View style={{width: windowWidth * 0.8,alignItems: "center",justifyContent: "space-between",flexDirection: "row",marginTop: 10,marginLeft: 14}}>
                    <TouchableOpacity
                    activeOpacity={0.7}
                        onPress={() => {
                                handleBack()
                        }}
                       style={{paddingVertical: 7,paddingHorizontal: 10,backgroundColor:"transparent",borderRadius: 5,justifyContent: "center",alignItems: "center"}}>
                        <Text style={{color: white}}>back</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => {
                      handleNext()
                    }}
                     style={[styles.nextBtn, !(title && price && category && condition) && styles.disabled]}
                     disabled={!(title && price && category && condition )}
                    >
                      <Text style={styles.nextText}>Next</Text>
                   </TouchableOpacity>
               </View>
               </ScrollView>
              </View>
            );
          case 2:
            return (
              <View style={styles.tabContainer}>
                {renderSubHeading({
                    title: "Location & Details",
                    paragraph: "Add more information about your property"
                })}

                <ScrollView
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                 >

                <View style={{width: windowWidth * 0.9,height: "auto",marginTop: 12,justifyContent: "center",alignItems:"center",borderRadius: 12,paddingVertical: 20}}>
                 <Textarea
                 label="Description "
                 placeholder="Describe your property in details.Include information like bill payments ,amenities  etc"
                 value={description}
                 numberOfLines={5}
                 onChangeText={(text) => {
                    setdescription(text);
                  }}
                  style={{marginVertical: 7}}     
                  maxWords={1000} 

                 />

               <Dropdown
               label="Location"
               options={['Egerton', 'JKUAT']}
               selectedValue={location}
               onSelect={(value) => setlocation(value)}
               iconName="location-outline"
               desc="Select the area your rental is located."
             />
             <TouchableOpacity
               style={{
                 marginTop: 12,
                 backgroundColor: "#F07500",
                 padding: 10,
                 borderRadius: 8,
                 alignItems: "center"
               }}
               onPress={async () => {
                 let { status } = await Location.requestForegroundPermissionsAsync();
                 if (status !== 'granted') {
                   Alert.alert('Permission denied', 'Location permission is required to fetch your coordinates.');
                   return;
                 }
                 let loc = await Location.getCurrentPositionAsync({});
                 setLatitude(loc.coords.latitude);
                 setLongitude(loc.coords.longitude);
                 Alert.alert('Location Set', `Latitude: ${loc.coords.latitude}\nLongitude: ${loc.coords.longitude}`);
               }}
             >
               <Text style={{ color: "#fff", fontWeight: "bold" }}>
                 Use Current Location
               </Text>
             </TouchableOpacity>
             {latitude && longitude && (
               <Text style={{ marginTop: 8, color: "#333", fontSize: 13 }}>
                 Coordinates: {latitude}, {longitude}
               </Text>
             )}
            </View>

            <View style={{width: windowWidth * 0.8,alignItems: "center",justifyContent: "space-between",flexDirection: "row",marginTop: 10,marginLeft: 14}}>
                    <TouchableOpacity
                        onPress={() => {
                                handleBack()
                        }}
                       style={{paddingVertical: 7,paddingHorizontal: 10,backgroundColor:"transparent",borderRadius: 5,justifyContent: "center",alignItems: "center",}}>
                        <Text style={{color: white}}>back</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                     style={[styles.nextBtn, !(title && price && category && condition && description && location) && styles.disabled]}
                     disabled={!(title && price && category && condition && description && location )}
                     onPress={() => {
                      handleNext()
                    }}>
                      <Text style={styles.nextText}>Next</Text>
                   </TouchableOpacity>
               </View>
            </ScrollView>
              </View>
            );
            case 3:
            return (
              <View style={styles.tabContainer}>
                {renderSubHeading({
                    title: "Preview Listing",
                    paragraph: "This is how your listing will appear to buyers"
                })}
                <ScrollView
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                 >
                    <View style={{marginTop: 6}}>
                       <Productimg title={title} price={price} image={frontImage} />

                       <View  style={{width: windowWidth,justifyContent: "space-evenly",flexDirection: "column",padding: 12}}>
                  <View style={{flexDirection: "row",alignItems: "center"}}>
                    <Ionicons name="location-outline" size={16} color="grey" style={{marginTop:1,marginHorizontal: 6}}/>
                    <Text numberOfLines={2} style={{fontSize: 14,color: "#666",lineHeight: 22,}}>{location}</Text>
                  </View>
                  
                  <View style={{flexDirection: "row",alignItems: "center",padding: 3,marginTop: 3}}>
                     <AntDesign name="tago" size={16} color="grey" style={{marginLeft:4,}} />
                     <Text style={{color: "#666",fontSize: 14,marginLeft: 8,lineHeight: 22,}}>{category}</Text>
                  </View>
                  <View style={{flexDirection: "row",alignItems: "center",padding: 3,marginTop: 3}}>
                     <AntDesign name="check" size={16} color="grey" style={{marginLeft:4,}} />
                     <Text style={{color: "#F07500",fontSize: 14,marginLeft: 8,lineHeight: 22,}}>{condition}</Text>
                  </View>
          </View>

           <Text style={{fontSize: 16,fontWeight:500,color: "#666"}}>Description</Text>
                        
                                <Text style={{fontSize: 14,color: "#666",marginTop: 7,lineHeight: 22,}}>
                                {isExpanded ? description : (description.length > maxLength ? description.slice(0, maxLength) + '...' : description)}
                              </Text>
                              {description.length > maxLength && (
                                <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
                                  <Text style={{color: "#F07500",marginTop: 4,fontWeight: 500,alignSelf: "flex-end"}}>
                                    {isExpanded ? 'Show Less' : 'Show More'}
                                  </Text>
                                </TouchableOpacity>
                              )}
                    </View>
                    

                  <View style={{width: windowWidth * 0.8,alignItems: "center",justifyContent: "space-between",flexDirection: "row",marginTop: 10,marginLeft: 14}}>
                    <TouchableOpacity
                        onPress={() => {
                                handleBack()
                        }}
                       style={{paddingVertical: 7,paddingHorizontal: 10,backgroundColor:"transparent",borderRadius: 5,justifyContent: "center",alignItems: "center",borderColor: "#f3f4f4",borderWidth: 1}}>
                        <Text>back</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                     style={[styles.nextBtn, !(title && price && category && condition && description && location) && styles.disabled]}
                     disabled={!(title && price && category && condition && description && location )}
                     onPress={() => {
                      handleNext()
                    }}
                     >
                      <Text style={styles.nextText}>Publish Rental</Text>
                   </TouchableOpacity>
               </View>

                 </ScrollView>

              </View>
              
           );
           case 4:
            return (
              <View style={styles.tabContainer}>
                {renderSubHeading({
                    title: "Final Review",
                    paragraph: "Review and approve your listing before publishing"
                })}
                <ScrollView
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                 >

                 <View style={{width: windowWidth * 0.9,backgroundColor: "#fff",height: "auto",marginTop: 12,justifyContent: "center",alignItems:"center",borderRadius: 12,borderWidth: 1,borderColor: "#f3f4f4",paddingVertical: 20}}>
                  <View style={{flexDirection: "row",alignItems: "center", marginBottom: 4, gap: 3,width: "95%"}}>
                   <View style={{backgroundColor: "#dcfce7", padding: 4, borderRadius: 30}}>
                    <Ionicons name="shield-checkmark-outline" size={20} color="#16a34a"/>
                   </View>
                   <View style={{marginLeft: 10}}>
                     <Text style={{fontWeight: 600,fontSize: 14}} >Listing Review</Text>
                     <Text style={{fontSize: 12, color: '#666'}}>Final check before your rental goes live</Text>
                   </View>
                  </View>

                  <View style={{width: "90%", marginTop: 10}}>
                    <Text style={{ fontWeight: 'bold',marginBottom: 12,}}>Listing Summary</Text>

                    <View style={{flexDirection: 'row',flexWrap: 'wrap',justifyContent: 'space-between',marginLeft: 6}}>
                      <View style={{width: '47%',marginBottom: 12,}}>
                        <Text style={{ color: 'gray',marginBottom: 2,}}>Title:</Text>
                        <Text style={{color: '#000',}}>{title}</Text>
                      </View>
                      <View style={{width: '47%',marginBottom: 12,}}>
                        <Text style={{ color: 'gray',marginBottom: 2,}}>Price:</Text>
                        <Text style={{ fontWeight: '600',color: '#000',}}>Ksh {price}</Text>
                      </View>
                      <View style={{width: '47%',marginBottom: 12,}}>
                        <Text style={{ color: 'gray',marginBottom: 2,}}>Category:</Text>
                        <Text style={{ fontWeight: '600',color: '#000',}}>{category}</Text>
                      </View>
                      <View style={{width: '47%',marginBottom: 12,}}>
                         <Text style={{ color: 'gray',marginBottom: 2,}}>Condition:</Text>
                         <Text style={{ fontWeight: '600',color: '#000',}}>{condition}</Text>
                      </View>
                      <View style={{width: '47%',marginBottom: 12,}}>
                         <Text style={{ color: 'gray',marginBottom: 2,}}>Location:</Text>
                         <Text style={{color: '#000',}}>{location}</Text>
                      </View>
                      <View style={{width: '47%',marginBottom: 12,}}>
                         <Text style={{ color: 'gray',marginBottom: 2,}}>Photos:</Text>
                         <Text style={{ fontWeight: '600',color: '#000',}}>{frontImage && backImage ? "2 photos" : frontImage || backImage ? "1 photo" : "No photos"}</Text>
                       </View>
                    </View>

                  </View>
                 </View>

                 <View style={{marginTop: 8,backgroundColor: '#fff',padding: 16,borderRadius: 10,}}>
                   <Text style={{fontWeight: 'bold',marginBottom: 12,fontSize: 15,}}>Before you publish:</Text>

                   {checklist.map((item, index) => (
                     <View key={index} style={{flexDirection: 'row',alignItems: 'flex-start',gap: 8,marginBottom: 12,}}>
                       <MaterialIcons name="error-outline" size={18} color="orange" style={{ marginTop: 3 }} />
                        <Text style={{ flex: 1,fontSize: 13.5,color: '#333',}}>{item}</Text>
                      </View>
                    ))}

                    <View style={styles.separator} />

                    <TouchableOpacity 
                    activeOpacity={0.7}
                    style={styles.agreementRow} onPress={() => setAgreed(!agreed)}>
                      <View style={styles.checkbox}>
                        {agreed && <View style={styles.checkboxChecked} />}
                      </View>
                      <View style={styles.termsTextContainer}>
                       <Text style={styles.agreeText}>
                          I agree to the <Text style={{ fontWeight: 'bold' }}>marketplace terms</Text>
                       </Text>
                      <Text style={styles.subText}>
                        I confirm that my listing complies with all marketplace policies and that the information provided is accurate and complete.
                      </Text>
                     </View>
                   </TouchableOpacity>
                  
                  </View>

                  <View style={{width: windowWidth * 0.8,alignItems: "center",justifyContent: "space-between",flexDirection: "row",marginTop: 10,marginLeft: 14}}>
                    <TouchableOpacity
                        onPress={() => {
                                handleBack()
                        }}
                       style={{paddingVertical: 7,paddingHorizontal: 10,backgroundColor:"transparent",borderRadius: 5,justifyContent: "center",alignItems: "center",borderColor: "#F07500",borderWidth: 1,width: "47%"}}>
                        <Text style={{color: "#F07500"}}>Back to preview</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                     style={[styles.nextBtn, !(agreed) && styles.disabled]}
                     disabled={isPublishing || !(title && price && category && condition && description && location && agreed)}
                     onPress={async () => {
                        setIsPublishing(true);
                        try {
                          if (!businessId) {
                            setShowBusinessModal(true);
                            setIsPublishing(false);
                            return;
                          }
                          console.log("Attempting to publish with businessId:", businessId);
                          const result = await createRental({
                            title,
                            price,
                            category,
                            condition,
                            description,
                            location,
                            latitude,
                            longitude,
                            frontImage,
                            backImage,
                            userId,
                            businessId
                          });
                          if (result && result.success) {
                            Alert.alert("Success", "Your rental listing has been published!");
                            router.push("/(rental)/rentaldashboard");
                          } else {
                            Alert.alert("Error", result.message || "Failed to publish listing.");
                          }
                        } catch (err) {
                          console.error("Publish Rental Error:", err);
                          Alert.alert("Error", err?.message ? err.message : JSON.stringify(err) || "An unexpected error occurred.");
                        } finally {
                          setIsPublishing(false);
                        }
                     }}>
                      {isPublishing ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <Text style={styles.nextText}>Publish Listing</Text>
                      )}
                   </TouchableOpacity>
                  </View>

                 </ScrollView>

              </View>
              
           )
        }
      };

  const renderContent = () => {
    return (
      <SafeAreaView style={{ flex: 1,  height: windowHeight, width: windowWidth }}>
         <Header
          title="List Property"
          showBackButton={true}
          color={white}
        />
         
        {renderTab()}
      </SafeAreaView>
    );
  }
  
  return (
    <>
      {renderContent()}
      <Modal
        visible={showBusinessModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowBusinessModal(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <View style={{
            backgroundColor: "#fff",
            borderRadius: 12,
            padding: 24,
            width: "80%",
            alignItems: "center"
          }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10, color: "#F07500" }}>
              Business Profile Required
            </Text>
            <Text style={{ fontSize: 15, color: "#333", textAlign: "center", marginBottom: 18 }}>
              You must create a business profile before publishing a rental listing.
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: "#F07500",
                paddingHorizontal: 18,
                paddingVertical: 10,
                borderRadius: 8,
                marginBottom: 10,
                width: "100%",
                alignItems: "center"
              }}
              onPress={() => {
                setShowBusinessModal(false);
                router.push("/(dashboard)/createbusiness");
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
                Create Business Profile
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                padding: 8,
                borderRadius: 8,
                width: "100%",
                alignItems: "center"
              }}
              onPress={() => setShowBusinessModal(false)}
            >
              <Text style={{ color: "#F07500", fontWeight: "600", fontSize: 15 }}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
      },
      tabContainer: {
        flex: 1,
        padding: 16,
      },
      heading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        color: "#F07500",
      },
      subText: {
        fontSize: 14,
        color: Gray,
        marginBottom: 16,
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
        top: 5,
        right: 5,
        zIndex: 1, 
        backgroundColor: '#374151',
        borderRadius: 10,
        padding: 2,
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
      tip: {
        fontSize: 13,
        marginTop: 8,
        color: Gray,
      },
      required: {
        fontSize: 12,
        color: '#888',
        marginTop: 2,
      },
      nextBtn: {
        backgroundColor: '#F07500',
        paddingHorizontal: 14,
        paddingVertical: 9,
        borderRadius: 6,
        alignItems: 'center',
        width: "47%"
      },
      nextText: {
        color: '#fff',
        fontWeight: '600',
      },
      disabled: {
        backgroundColor: secondary,
      },
      separator: {
        height: 1,
        backgroundColor: '#EAEAEA',
        marginVertical: 16,
      },
      agreementRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
      },
      checkbox: {
        width: 12,
        height: 12,
        borderRadius: 4,
        borderWidth: 1.5,
        borderColor: '#FF9900',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 3,
      },
      checkboxChecked: {
        width: 7,
        height: 7,
        backgroundColor: '#FF9900',
        borderRadius: 2,
      },
      termsTextContainer: {
        flex: 1,
      },
      agreeText: {
        fontSize: 13.5,
        marginBottom: 2,
      },
      subTextAlt: {
        fontSize: 12,
        color: silver,
      },
})
