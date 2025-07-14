import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import AntDesign from '@expo/vector-icons/AntDesign'
import { useState } from 'react'
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View,TextInput,ActivityIndicator} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomInput from '../../components/custominput'
import Dropdown from '../../components/dropdown'
import Header from '../../components/header'
import Textarea from '../../components/textarea'
import { Gray, Primary, secondary, silver, white } from '../../utils/colors'
import * as DocumentPicker from 'expo-document-picker'
import Imgurimodal from '../../components/imgurimodal'
import { useToast } from "@/context/ToastProvider";
import { createupload } from '../../lib/rentals/rental'
import { router } from 'expo-router'
import { useAuthGuard } from '../../utils/useAuthGuard'


const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const Createrental = () => {
    const { showSuccess, showError } = useToast();
    const [tabIndex, setTabIndex] = useState(0);
    const [allowUpload, setAllowUpload] = useState(true);
    const [showImageUriModal, setShowImageUriModal] = useState(false);
    const [currentImageType, setCurrentImageType] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
        const { isAuthenticated, checking } = useAuthGuard('/');
    



    // Modal state for code entry
    const [codeModalVisible, setCodeModalVisible] = useState(false);
    const [codeModalLoading, setCodeModalLoading] = useState(false);
    const [codeModalError, setCodeModalError] = useState('');
    const [frontImage, setFrontImage] = useState("");
    const [backImage, setBackImage] = useState("");
    const [title, setTitle] = useState("")
    const [description, setdescription] = useState("")
    const [latitude, setlatitude] = useState("")
    const [longitude, setlongitude] = useState("")
    const [location, setlocation] = useState("")
    const [managedBy, setmanagedBy] = useState("")
    const [contactPhone, setcontactPhone] = useState("")
    const [agreed, setAgreed] = useState(false);


    const pickImage = async (selectedType, side) => {
      const result = await DocumentPicker.getDocumentAsync({
        type: selectedType === "image" ? ["image/png", "image/jpg", "image/jpeg"] : "*/*",
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        const image = result.assets[0];

        if (selectedType === "image") {

          if (side === "front") {
            console.log("image",image )
            setFrontImage(image);
          } else if (side === "back") {
            setBackImage(image);
          }

          console.log(`Updated ${side} image:`, image.uri);
        }
      }
    };

     const handleUpload = async() => {
      if (!frontImage || !backImage) {
        showError("Atleast 2 images are needed!.");
        return;
      }
      if (!title) {
        showError("Title can't be empty.");
        return;
      }
      if (!description) {
        showError("Even a little description can help people to understand more about your property.");
        return;
      }
      
      if (!contactPhone) {
        showError("Please provide a contact phone number so interested tenants can reach you.");
        return;
      }

      if (contactPhone.length < 9) {
        showError("Phone number must be at least 9 digits long.");
        return;
      }

      if (!managedBy) {
        showError("Please specify who manages the property — either a landlord or an agent.");
        return;
      }
      

      if (!latitude || !longitude) {
        showError("Property location coordinates are required to help tenants easily find your rental.");
        return;
      }

      if (!location) {
        showError("Please select the institution closest to your rental property to help students find it easily.");
        return;
      }

      if (!agreed) {
        showError("You must agree to the rental listing terms before publishing your property.");
        return;
      }
      setUploading(true)
      try{
        const result = await createupload({frontImage,backImage,title,description,location,latitude,longitude,agreed,managedBy,contactPhone})
        
        if(result.success){
          showSuccess("Your Property has been posted successfully!")
          router.replace("/rentaldashboard")
        }

        if(!result.success){
          showError("Failed to create your property,Check your connection and try again")
          return
        }

        console.log("uploaded", result)

      }catch(error){
        console.error("Upload Error:", error);
      }finally{
        setUploading(false)
      }


     }

    const checklist = [
        "Remember to add the individual rental units available within it.",
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

      const renderSubHeading = ({title, paragraph}) => {
        return(
            <View>
                <View style={{alignItems: "center", justifyContent: "center", flexDirection: "row",marginVertical: 3}}>
                    <View style={{width:tabIndex === 0 ?18 : 18,backgroundColor: "#F07500",height: 5,borderRadius: 2}}/>
                    <View style={{width: tabIndex > 0 && tabIndex >= 1 ? 18: 15,backgroundColor:tabIndex > 0 && tabIndex >= 1 ? "#F07500" : Gray,height: 5,borderRadius: 4,marginHorizontal: 2}}/>
                    <View style={{width: tabIndex > 0 && tabIndex >= 2 ? 18: 15,backgroundColor:tabIndex > 0 && tabIndex >= 2 ? "#F07500" : Gray,height: 5,borderRadius: 3,marginHorizontal: 2}}/>
                    <View style={{width: tabIndex > 0 && tabIndex >= 3 ? 18: 15,backgroundColor:tabIndex > 0 && tabIndex >= 3 ? "#F07500" : Gray,height: 5,borderRadius: 3,marginHorizontal: 2}}/>
                </View>
                <Text  style={styles.heading}>{title}</Text>
                <Text style={styles.subText}>{paragraph}</Text>
            </View>
        )
      }
 
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
                style={[ styles.imageBox, frontImage && styles.imageBoxFilled ]}>
                {frontImage ? (
                    <>
                      <TouchableOpacity style={styles.closeButton} onPress={() => setFrontImage(null)}>
                        <Ionicons name="close" size={10} color="#fff"/>
                      </TouchableOpacity>
                      <Image resizeMode='contain'   source={{ uri: frontImage?.uri || frontImage }} style={styles.image} />
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
               style={[ styles.imageBox, backImage && styles.imageBoxFilled ]}>
               {backImage ? (
                <>
                <TouchableOpacity style={styles.closeButton} onPress={() => setBackImage(null)}>
                  <Ionicons name="close" size={10} color="#fff" />
                </TouchableOpacity>
                 <Image resizeMode='contain' source={{ uri: backImage?.uri || backImage }} style={styles.image} />
               </>
               ) : (
                 <>
                <Ionicons name="camera-outline" size={20} color="gray" />
                <Text style={styles.placeholder}>Back view</Text>
                </>
               )}
              </TouchableOpacity>
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
                  label="Property Name "
                  placeholder="eg. Cozy 2-bedroom in Egerton"
                  value={title}
                  onChangeText={(text) => {
                   setTitle(text);
                    // if (text.trim()) setUsernameError("");
                   }}
                 style={{marginVertical: 5}}
                />

              <Textarea
                 label="Description "
                 placeholder="Describe your property in details.Include information like bill payments ,amenities  etc"
                 value={description}
                 numberOfLines={5}
                 onChangeText={(text) => {
                    setdescription(text);
                    // if (text.trim() !== '') setdescriptionError('');
                  }}
                  style={{marginVertical: 7,color: "fff"}}     
                  maxWords={1000} 

                 />

                 <View style={{ marginVertical: 6 ,width: "90%"}}>
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
                      value={contactPhone}
                      onChangeText={(text) => {
                        const digitsOnly = text.replace(/[^0-9]/g, ''); 
                        const trimmed = digitsOnly.slice(0, 9);
                        setcontactPhone(trimmed);
  
                        // if (trimmed.length > 0) setPhoneError("");
                      }}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => {
                        setIsFocused(false);
                        // if (contactPhone.length < 9) {
                        //   setPhoneError("Phone number must be 9 digits");
                        // }
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

                 <Dropdown
                    label="Managed By"
                    options={['Landlord/Landlady', 'Agent']}
                    selectedValue={managedBy}
                    onSelect={(value) => setmanagedBy(value)}
                    iconName="person"
                    labell="Who Manages This Property"
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
                     style={[styles.nextBtn, !(title && description) && styles.disabled]}
                     disabled={!(title && description )}
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
                 <CustomInput
                  label="Latitude"
                  placeholder="-1.3625416878306622"
                  value={latitude}
                  onChangeText={(text) => {
                   setlatitude(text);
                    // if (text.trim()) setUsernameError("");
                   }}
                 style={{marginVertical: 5}}
                />

                <CustomInput
                  label="Longitude "
                  placeholder="36.65722939768087"
                  value={longitude}
                  onChangeText={(text) => {
                   setlongitude(text);
                    // if (text.trim()) setUsernameError("");
                   }}
                 style={{marginVertical: 5}}
                />

               <Dropdown
               label="Location"
               options={['Egerton', 'JKUAT']}
               selectedValue={location}
               onSelect={(value) => setlocation(value)}
               iconName="location-outline"
               desc="Select the area your item is located."
               labell="Nearby Institution"
             />
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
                     style={[styles.nextBtn, !(latitude && longitude && location) && styles.disabled]}
                     disabled={!(latitude && longitude && location )}
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
                    title: "Final Review",
                    paragraph: "Review and approve your listing before publishing"
                })}
                <ScrollView
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                 >

                 <View style={{width: windowWidth * 0.9,height: "auto",marginTop: 12,justifyContent: "center",alignItems:"center",borderRadius: 12,paddingVertical: 20}}>
                  <View style={{flexDirection: "row",alignItems: "center", marginBottom: 4, gap: 3,width: "95%"}}>
                   <View style={{backgroundColor: "#2a1205", padding: 4, borderRadius: 30}} className="bg-green-100 p-2 rounded-full">
                    <Ionicons name="shield-checkmark-outline" size={20} color={Primary}/>
                   </View>
                   <View style={{marginLeft: 10}}>
                     <Text style={{fontWeight: 600,fontSize: 14,color: white}} >Property Review</Text>
                     <Text style={{fontSize: 12,color: "gray" }} className="text-sm text-gray-500">Final check before your property goes live</Text>
                   </View>
                  </View>

                  <View style={{width: "90%", marginTop: 10}}>
                    <Text style={{ fontWeight: 'bold',marginBottom: 12,}}>Listing Summary</Text>

                    <View style={{flexDirection: 'row',flexWrap: 'wrap',justifyContent: 'space-between',marginLeft: 6}}>
                      <View style={{width: '47%',marginBottom: 12,}}>
                        <Text style={{ color: white,marginBottom: 2,}}>Title:</Text>
                        <Text numberOfLines={1} style={{color: "gray",}}>{title}</Text>
                      </View>
                      <View style={{width: '47%',marginBottom: 12,}}>
                        <Text style={{ color: white,marginBottom: 2,}}>location:</Text>
                        <Text numberOfLines={1} style={{ fontWeight: '600',color: 'gray',}}>{location}</Text>
                      </View>
                      <View style={{width: '47%',marginBottom: 12,}}>
                         <Text style={{ color:white,marginBottom: 2,}}>Managed By:</Text>
                         <Text style={{ fontWeight: '600',color: 'gray',}}>{managedBy}</Text>
                       </View>
                       <View style={{width: '47%',marginBottom: 12,}}>
                         <Text style={{ color:white,marginBottom: 2,}}>Contact detail:</Text>
                         <Text style={{ fontWeight: '600',color: 'gray',}}>+254{contactPhone}</Text>
                       </View>
                      
                    </View>

                  </View>
                  <View style={{width: '90%',marginBottom: 12,}}>
                         <Text style={{ color: white,marginBottom: 2,}}>Description:</Text>
                         <Text numberOfLines={3} style={{color: 'gray',}}>{description}</Text>
                  </View>

                 </View>

                 <View style={{marginTop: 8,padding: 16,borderRadius: 10,}}>
                   <Text style={{fontWeight: 'bold',marginBottom: 12,fontSize: 15,color: "#fff"}}>After you publish:</Text>

                   {checklist.map((item, index) => (
                     <View key={index} style={{flexDirection: 'row',alignItems: 'flex-start',gap: 8,marginBottom: 12,}}>
                       <MaterialIcons name="error-outline" size={18} color="orange" style={{ marginTop: 3 }} />
                        <Text style={{ flex: 1,fontSize: 13.5,color: 'gray',}}>{item}</Text>
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
                          I agree to the <Text style={{ fontWeight: 'bold' }}>rental listing terms</Text>
                       </Text>
                      <Text style={styles.subTextSmall}>
                              I confirm that this property listing complies with all rental policies and that the information provided is accurate, truthful, and up to date.
                      </Text>
                     </View>
                   </TouchableOpacity>
                  
                  </View>

                  <View style={{width: windowWidth * 0.8,alignItems: "center",justifyContent: "space-between",flexDirection: "row",marginTop: 10,marginLeft: 14}}>
                    <TouchableOpacity
                    activeOpacity={0.7}
                        onPress={() => {
                                handleBack()
                        }}
                       style={{paddingVertical: 7,paddingHorizontal: 10,backgroundColor:"transparent",borderRadius: 5,justifyContent: "center",alignItems: "center",borderColor: "#F07500",borderWidth: 1,width: "47%"}}>
                        <Text style={{color: "#F07500"}}>Back</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                    activeOpacity={0.7}
                     style={[styles.nextBtn, !(agreed) && styles.disabled]}
                     disabled={uploading || !agreed}
                     onPress={() => {
                      handleUpload()
                     }}>
                      {uploading ? (
                          <ActivityIndicator size={14} color="#fff" />
                        ) : (
                          <Text style={styles.nextText}>Publish Property</Text>
                        )}
                   </TouchableOpacity>
                  </View>

                 </ScrollView>

              </View>
              
           )
        }
      };

  return (
    <SafeAreaView style={{ flex: 1,  height: windowHeight, width: windowWidth }}>
       <Header
        title="List Property"
        showBackButton={true}
        color={white}
        showIcons={false}
        backPath="/dashindex"
      />
       
      {renderTab()}
      <Imgurimodal
        showImageUriModal={showImageUriModal}
        setShowImageUriModal={setShowImageUriModal}
        currentImageType={currentImageType}
        setFrontImage={setFrontImage}
        setBackImage={setBackImage}
      />

    </SafeAreaView>
  )
}

export default Createrental

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
        backgroundColor: Gray,
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
        color: white
      },
      subTextSmall: {
        fontSize: 12,
        color: silver,
      },
})
