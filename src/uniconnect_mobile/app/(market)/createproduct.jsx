import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import AntDesign from '@expo/vector-icons/AntDesign'
import * as DocumentPicker from 'expo-document-picker'
import { LinearGradient } from 'expo-linear-gradient'
import { useState, useEffect  } from 'react'
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View,TextInput,Linking, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomInput from '../../components/custominput'
import Dropdown from '../../components/dropdown'
import Header from '../../components/header'
import Imgurimodal from '../../components/imgurimodal'
import Productimg from '../../components/productimg'
import Textarea from '../../components/textarea'
import { Gray, Primary, secondary, silver, white } from '../../utils/colors'
import { categories } from '../../lib/market/category'
import { useToast } from "@/context/ToastProvider";
import { createupload } from '../../lib/market/market'
import { router } from 'expo-router'
import { useAuthGuard } from '../../utils/useAuthGuard'

const PhoneInput = ({ label, value, onChangeText, onFocus, onBlur, focused }) => (
    <View style={{marginBottom: 8,width: "100%"}}>
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
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const Createproduct = () => {
    const { showSuccess, showError } = useToast();
    const { isAuthenticated, checking } = useAuthGuard('/');
    const [tabIndex, setTabIndex] = useState(0);
    const [isFocused, setIsFocused] = useState(false);
    const [frontImage, setFrontImage] = useState("");
    const [backImage, setBackImage] = useState("");
    const [allowUpload, setAllowUpload] = useState(true);
    const [showImageUriModal, setShowImageUriModal] = useState(false);
    const [currentImageType, setCurrentImageType] = useState(null);

    const [category,setcategory] = useState("")
    const [subcategory,setsubcategory] = useState("")
    const [condition,setcondition] = useState("")
    const [price,setprice] = useState("")
    const [title,settitle] = useState("")
    const [description,setDescription] = useState("")
    const [location,setlocation] = useState("")
    const [subOptions, setSubOptions] = useState([]);
    const [contactPhone, setcontactPhone] = useState("")
    const [focusedInput, setFocusedInput] = useState('');

    const [uploading, setUploading] = useState(false);


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
      
      if (!title) {
        showError("Title can't be empty.");
        return;
      }

      if (!frontImage) {
        showError("Front image is required.");
        return;
      }

      if (!backImage) {
        showError("Back image is required.");
        return;
      }

      if (!category) {
        showError("Please select a category.");
        return;
      }

      if (!subcategory) {
        showError("Please select a subcategory.");
        return;
      }

      if (!condition) {
        showError("Please specify the item's condition.");
        return;
      }

      if (!price) {
        showError("Price can't be empty.");
        return;
      }

      if (!description) {
        showError("Description is required.");
        return;
      }

      if (!contactPhone || contactPhone.trim().length < 9) {
        showError("Please enter a valid phone number (at least 9 digits).");
        return;
      }


      if (!location) {
        showError("Please select a location.");
        return;
      }
      setUploading(true)
      try{

        const result = await createupload({frontImage,backImage,title,description,location,price,category,subcategory,condition,contactPhone})

        if(!result.success){
          showError("Failed to list your product, check connection or try again!")
        }

        if(result.success){
          showSuccess("Your product has been posted successfully!")

          router.replace("/market")
        }

        console.log("uploaded", result)

      }catch(error){
        console.error("Upload Error:", error);
        showError("Something went wrong. Please try again or check your internet connection.");

      }finally{
        setUploading(false)
      }

    }

    useEffect(() => {
      const selected = categories.find(cat => cat.name === category);
      setSubOptions(selected?.subcategories || []);
      setsubcategory(""); 
    }, [category]);

    const [agreed, setAgreed] = useState(false);

    const [isExpanded, setIsExpanded] = useState(false);
    const maxLength = 200;

    const truncatedText = description.length > maxLength ? description.slice(0, maxLength) + '...' : description;


    const checklist = [
        "Verify your price is competitive by checking similar items in the marketplace.",
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
                    <View style={{width: tabIndex > 0 && tabIndex >= 1 ? 18: 15,backgroundColor:tabIndex > 0 && tabIndex >= 1 ? "#F07500" : secondary,height: 5,borderRadius: 4,marginHorizontal: 2}}/>
                    <View style={{width: tabIndex > 0 && tabIndex >= 2 ? 18: 15,backgroundColor:tabIndex > 0 && tabIndex >= 2 ? "#F07500" : secondary,height: 5,borderRadius: 3,marginHorizontal: 2}}/>
                    <View style={{width: tabIndex > 0 && tabIndex >= 3 ? 18: 15,backgroundColor:tabIndex > 0 && tabIndex >= 3 ? "#F07500" : secondary,height: 5,borderRadius: 3,marginHorizontal: 2}}/>
                    {/* <View style={{width: tabIndex > 0 && tabIndex >= 4 ? 18: 15,backgroundColor:tabIndex > 0 && tabIndex >= 4 ? "#F07500" : secondary,height: 5,borderRadius: 3,marginHorizontal: 2}}/> */}
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
                    paragraph: "Add 2 photos of your item (front and back view)"
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
                      <TouchableOpacity activeOpacity={0.7} style={styles.closeButton} onPress={() => setFrontImage("")}>
                        <Ionicons name="close" size={10} color="#fff"/>
                      </TouchableOpacity>
                      <Image resizeMode='contain'  source={{ uri: frontImage?.uri || frontImage }} style={styles.image} />
                    </>
                ) : (
                    <>
                    <Ionicons name="camera-outline" size={20} color="gray" />
                    <Text style={styles.placeholder}>Front view</Text>
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
                <TouchableOpacity activeOpacity={0.7} style={styles.closeButton} onPress={() => setBackImage(null)}>
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

                <Text style={styles.tip}>Tip: Upload clear photos in good lighting to attract more buyers</Text>
                <Text style={styles.required}>Required: 2 photos - one showing the front and one showing the back</Text>

                <TouchableOpacity
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
                  onPress={() => {handleNext()}}
                  activeOpacity={0.7}
                >
                  <Text style={styles.nextText}>Next</Text>
                </TouchableOpacity>


                
                
              </View>
            );
          case 1:
            return (
              <View style={styles.tabContainer}>
                {renderSubHeading({
                    title: "Item Details",
                    paragraph: "Tell us about your item"
                })}
                <ScrollView
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                 >

                <View style={{width: windowWidth * 0.9,height: "auto",marginTop: 12,justifyContent: "center",alignItems:"center",borderRadius: 12,paddingVertical: 20}}>
                <CustomInput
                  label="Title "
                  placeholder="eg. Wooden 5 * 6 Bed"
                  value={title}
                  onChangeText={(text) => {
                   settitle(text);
                   }}
                 style={{marginVertical: 5}}
                />

                <View style={{ marginVertical: 6,width: "90%" }}>
                  <Text style={{ fontSize: 14, marginBottom: 6, color: '#788481', fontWeight: '500' }}>
                    price
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
                    <TextInput
                      placeholder="ksh. 3000"
                      placeholderTextColor={silver}
                      keyboardType="number-pad"
                      value={price}
                      onChangeText={(text) => {
                        setprice(text);
                      }}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
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
                  label="Category"
                  options={categories.map(cat => cat.name)}
                  selectedValue={category}
                  onSelect={(value) => setcategory(value)}
                  iconName="chevron-down"
                />

                <Dropdown
                  label="Subcategory"
                  options={subOptions}
                  selectedValue={subcategory}
                  onSelect={(value) => setsubcategory(value)}
                  iconName="chevron-down"
                />
                <Dropdown
                 label="Condition "
                 options={['New', 'Used - Like New', 'Used - Good', 'Used - Fair']}
                 selectedValue={condition}
                 onSelect={(value) => setcondition(value)}
                 iconName="chevron-down"
               />

                

                </View>

                <View style={{width: windowWidth * 0.8,alignItems: "center",justifyContent: "space-between",flexDirection: "row",marginTop: 10,marginLeft: 14}}>
                    <TouchableOpacity
                      activeOpacity={0.7}
                        onPress={() => {
                                handleBack()
                        }}
                       style={{paddingVertical: 7,paddingHorizontal: 10,backgroundColor:"transparent",borderRadius: 5,justifyContent: "center",alignItems: "center",borderColor: secondary,borderWidth: 1,width: "25%",flexDirection: "row",alignItems: "center"}}>
                        <Ionicons name="arrow-back" size={13} color={white} />
                        <Text style={{color: white,marginLeft: 3}}>Back</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                    activeOpacity={0.7}
                     style={[styles.nextBtn, !(title && price && category && subcategory && condition) && styles.disabled]}
                     disabled={!(title && price && category && subcategory && condition )}
                    onPress={() => {handleNext()}}
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
                    title: "Final Details",
                    paragraph: "Almost done! Just a few more details"
                })}

                <ScrollView
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                 >

                <View style={{width: "100%",height: "auto",marginTop: 12,justifyContent: "center",alignItems:"center",borderRadius: 12,paddingVertical: 20}}>
                 <Textarea
                 label="Description"
                 placeholder="Describe your item in details.Include information like condition,brand etc"
                 placeholderTextColor={silver}
                 value={description}
                 numberOfLines={5}
                 onChangeText={(text) => {
                    setDescription(text);
                  }}
                  style={{
                    color: white,
                    flex: 1,
                    fontSize: 16,
                    paddingVertical: 10,
                  }}    
                  maxWords={500} 

                 />

                 <PhoneInput
                    label="Contact Phone"
                    value={contactPhone}
                    onChangeText={(text) => {
                      setcontactPhone(text);
                    }}
                    onFocus={() => setFocusedInput('phone')}
                    onBlur={() => setFocusedInput('')}
                    focused={focusedInput === 'phone'}
                />

               <Dropdown
               label="Location"
               options={['Egerton', 'JKUAT']}
               selectedValue={location}
               onSelect={(value) => setlocation(value)}
               iconName="location-outline"
               desc="Select the area your item is located."
             />
            </View>

            <View style={{width: windowWidth * 0.8,alignItems: "center",justifyContent: "space-between",flexDirection: "row",marginTop: 10,marginLeft: 14}}>
                    <TouchableOpacity
                      activeOpacity={0.7}
                        onPress={() => {
                                handleBack()
                        }}
                       style={{paddingVertical: 7,paddingHorizontal: 10,backgroundColor:"transparent",borderRadius: 5,justifyContent: "center",alignItems: "center",borderColor: secondary,borderWidth: 1,width: "25%",flexDirection: "row",alignItems: "center"}}>
                        <Ionicons name="arrow-back" size={13} color={white} />
                        <Text style={{color: white,marginLeft: 3}}>Back</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.7}
                     style={[styles.nextBtn, !(description && location ) && styles.disabled]}
                     disabled={!(description && location  )}
                     onPress={() => {handleNext()}}
                     >
                      <Text style={styles.nextText}>Next</Text>
                   </TouchableOpacity>
               </View>
            </ScrollView>

                

              </View>
            );
          //   case 3:
          //   return (
          //     <View style={styles.tabContainer}>
          //       {renderSubHeading({
          //           title: "Preview Listing",
          //           paragraph: "This is how your listing will appear to buyers"
          //       })}
          //       <ScrollView
          //         showsHorizontalScrollIndicator={false}
          //         showsVerticalScrollIndicator={false}
          //        >
          //           <View style={{marginTop: 6}}>
          //              <Productimg title={title} price={price}  frontImage={frontImage?.uri || frontImage} backImage={backImage?.uri || backImage}/>

          //              <View  style={{width: windowWidth,justifyContent: "space-evenly",flexDirection: "column",padding: 12}}>
          //         <View style={{flexDirection: "row",alignItems: "center"}}>
          //           <Ionicons name="location-outline" size={16} color="grey" style={{marginTop:1,marginHorizontal: 6}}/>
          //           <Text numberOfLines={2} style={{fontSize: 14,color: silver,lineHeight: 22,}}>{location}</Text>
          //         </View>
                  
          //         <View style={{flexDirection: "row",alignItems: "center",padding: 3,marginTop: 3}}>
          //            <AntDesign name="tago" size={16} color="grey" style={{marginLeft:4,}} />
          //            <Text style={{color: silver,marginLeft: 3,fontSize: 14,marginLeft: 8,lineHeight: 22,}}>{category} . {subcategory}</Text>
          //         </View>
          //         <View style={{flexDirection: "row",alignItems: "center",padding: 3,marginTop: 3}}>
          //            <AntDesign name="check" size={16} color="grey" style={{marginLeft:4,}} />
          //            <Text style={{color: "#F07500",marginLeft: 3,fontSize: 14,marginLeft: 8,lineHeight: 22,}}>{condition}</Text>
          //         </View>
          // </View>

          //  <Text style={{fontSize: 16,fontWeight:500,color: white}}>Description</Text>
                        
          //             <Text style={{fontSize: 14,color: silver,marginTop: 7,lineHeight: 22,}}>
          //             {isExpanded ? description : truncatedText}
          //           </Text>
          //           {description.length > maxLength && (
          //             <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
          //               <Text style={{color: "#F07500",marginTop: 4,fontWeight: 500,alignSelf: "flex-end"}}>
          //                 {isExpanded ? 'Show Less' : 'Show More'}
          //               </Text>
          //             </TouchableOpacity>
          //           )}
          //           </View>
                    

          //         <View style={{width: windowWidth * 0.8,alignItems: "center",justifyContent: "space-between",flexDirection: "row",marginTop: 20,marginLeft: 14}}>
          //           <TouchableOpacity
          //             activeOpacity={0.7}
          //               onPress={() => {
          //                 handleBack()
          //               }}
          //              style={{paddingVertical: 7,paddingHorizontal: 10,backgroundColor:"transparent",borderRadius: 5,justifyContent: "center",alignItems: "center",borderColor: secondary,borderWidth: 1,width: "25%",flexDirection: "row",alignItems: "center"}}>
          //               <Ionicons name="arrow-back" size={13} color={white} />
          //               <Text style={{color: white,marginLeft: 3}}>Back</Text>
          //           </TouchableOpacity>

          //           <TouchableOpacity
          //             activeOpacity={0.7}
          //            style={[styles.nextBtn, ]}
          //           //  disabled={!(formData.title && formData.price && formData.category && formData.condition )}
          //             onPress={() => {handleNext()}}>
          //             <Text style={styles.nextText}>Publish Item</Text>
          //          </TouchableOpacity>
          //      </View>

          //        </ScrollView>

          //     </View>
              
          //  );
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
                   <View style={{backgroundColor: "#dcfce7", padding: 4, borderRadius: 30}} className="bg-green-100 p-2 rounded-full">
                    <Ionicons name="shield-checkmark-outline" size={20} color="#16a34a"/>
                   </View>
                   <View style={{marginLeft: 10}}>
                     <Text style={{fontWeight: 600,fontSize: 14,color: white}} >Listing Review</Text>
                     <Text style={{fontSize: 12,color: silver }}>Final check before your item goes live</Text>
                   </View>
                  </View>

                  <View style={{width: "90%", marginTop: 10}}>
                    <Text style={{ fontWeight: 'bold',marginBottom: 12,color: white}}>Listing Summary</Text>

                    <View style={{flexDirection: 'row',flexWrap: 'wrap',justifyContent: 'space-between',marginLeft: 6}}>
                      <View style={{width: '47%',marginBottom: 12,}}>
                        <Text style={{ color: 'gray',marginBottom: 2,}}>Title:</Text>
                        <Text numberOfLines={1} style={{color: white,}}>{title}</Text>
                      </View>
                      <View style={{width: '47%',marginBottom: 12,}}>
                        <Text style={{ color: 'gray',marginBottom: 2,}}>Price:</Text>
                        <Text numberOfLines={1} style={{ fontWeight: '600',color: white,}}>Ksh {price}</Text>
                      </View>
                      <View style={{width: '47%',marginBottom: 12,}}>
                        <Text style={{ color: 'gray',marginBottom: 2,}}>Category:</Text>
                        <Text numberOfLines={1} style={{ fontWeight: '600',color: white,}}>{category}</Text>
                      </View>
                      <View style={{width: '47%',marginBottom: 12,}}>
                         <Text style={{ color: 'gray',marginBottom: 2,}}>Sub-category</Text>
                         <Text numberOfLines={1} style={{color: white,}}>{subcategory}</Text>
                       </View>
                      <View style={{width: '47%',marginBottom: 12,}}>
                         <Text style={{ color: 'gray',marginBottom: 2,}}>Condition:</Text>
                         <Text numberOfLines={1} style={{ fontWeight: '600',color: white,}}>{condition}</Text>
                      </View>
                      <View style={{width: '47%',marginBottom: 12,}}>
                         <Text style={{ color: 'gray',marginBottom: 2,}}>Location:</Text>
                         <Text numberOfLines={1} style={{color: white,}}>{location}</Text>
                      </View>
                      <View style={{width: '47%',marginBottom: 12,}}>
                         <Text style={{ color: 'gray',marginBottom: 2,}}>Photos:</Text>
                         <Text numberOfLines={1} style={{ fontWeight: '600',color: white,}}>2 photos</Text>
                       </View>
                       
                    </View>

                  </View>

                  

                 </View>

                 <View style={{marginTop: 8,backgroundColor: secondary,padding: 16,borderRadius: 10,}}>
                   <Text style={{fontWeight: 'bold',marginBottom: 12,fontSize: 15,color: white}}>Before you publish:</Text>

                   {checklist.map((item, index) => (
                     <View key={index} style={{flexDirection: 'row',alignItems: 'flex-start',gap: 8,marginBottom: 12,}}>
                       <MaterialIcons name="error-outline" size={18} color={Primary} style={{ marginTop: 3 }} />
                        <Text style={{ flex: 1,fontSize: 13.5,color: silver,}}>{item}</Text>
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
                          I agree to the <Text onPress={() => {Linking.openURL('https://www.uniconnect.store/terms')}} style={{ fontWeight: 'bold',color: Primary }}>marketplace terms</Text>
                       </Text>
                      <Text style={styles.subText}>
                        I confirm that my listing complies with all marketplace policies and that the information provided is accurate and complete.
                      </Text>
                     </View>
                   </TouchableOpacity>
                  
                  </View>

                  <View style={{width: windowWidth * 0.8,alignItems: "center",justifyContent: "space-between",flexDirection: "row",marginTop: 20,marginLeft: 14}}>
                    <TouchableOpacity
                      activeOpacity={0.7}
                        onPress={() => {
                          handleBack()
                        }}
                       style={{paddingVertical: 7,paddingHorizontal: 10,backgroundColor:"transparent",borderRadius: 5,justifyContent: "center",alignItems: "center",borderColor: secondary,borderWidth: 1,width: "25%",flexDirection: "row",alignItems: "center"}}>
                        <Ionicons name="arrow-back" size={13} color={white} />
                        <Text style={{color: white,marginLeft: 3}}>Back</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                     activeOpacity={0.7}
                     style={[styles.nextBtn, !(agreed) && styles.disabled]}
                    //  disabled={!(title && price && category && condition && subcategory && description && location && frontImage && backImage )}
                     onPress={() => {handleUpload()}}>
                      {uploading ? (
                        <ActivityIndicator color="#fff" size="small" />
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

  return (
    <LinearGradient
      colors={['#030406', '#000']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
    <SafeAreaView style={{ flex: 1,}}>
       <Header
        title="List item"
        showBackButton={true}
        color={white} 
        Size={17}
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
    </LinearGradient>
  )
}

export default Createproduct

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
      },
      tabContainer: {
        flex: 1,
        padding: 16,
      },
      heading: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: Primary,
      },
      
      imageBox: {
        borderWidth: 1.5,
        borderColor: Gray,
        borderStyle: 'dashed',
        height: 140,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 16,
        borderRadius: 8,
        width:"45%",
        position: 'relative',
        
      },
      imageBoxFilled: {
        borderWidth: 0,
      },
      closeButton: {
        position: 'absolute',
        top: 4,
        right: 2,
        zIndex: 1, 
        backgroundColor: '#374151',
        borderRadius: 10,
        padding: 3,
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
        color: '#666',
      },
      required: {
        fontSize: 12,
        color: Gray,
        marginTop: 2,
      },
      nextBtn: {
        backgroundColor: '#F07500',
        paddingHorizontal: 5,
        paddingVertical: 9,
        borderRadius: 6,
        alignItems: 'center',
        width: "36%"
      },
      nextText: {
        color: "white",
        fontWeight: '600',
      },
      disabled: {
        backgroundColor: secondary,
      },
      separator: {
        height: 0.6,
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
      subText: {
        fontSize: 12,
        color: silver,
      },
})