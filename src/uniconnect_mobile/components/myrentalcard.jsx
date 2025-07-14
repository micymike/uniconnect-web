
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View, Modal, TextInput, Switch, Alert,ActivityIndicator } from 'react-native';
import { Gray, Primary, Red, secondary, silver, white } from '../utils/colors';
import AntDesign from '@expo/vector-icons/AntDesign';
import { deletePropertyUnit } from '../lib/rentals/rental';
import { useToast } from "@/context/ToastProvider";

const windowWidth = Dimensions.get('window').width;

const Myrentalcard = ({item}) => {
  const { showSuccess, showError } = useToast();
  const [showMenu, setShowMenu] = useState(false);
  const [manageVisible, setManageVisible] = useState(false);
  const [priceInput, setPriceInput] = useState(item.price || item.Price || item.rent || item.amount || "");
  const [isTaken, setIsTaken] = useState(!!item.taken);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [deletingId, setDeletingId] = useState(null);


  const toggleMenu = () => setShowMenu(!showMenu);

  // Placeholder update and delete functions
  const handleUpdate = async () => {
    setLoading(true);
    try {
      // Dynamically import updateRental
      const { updateRental } = await import("../lib/rentals/rental");
      await updateRental(item.$id, {
        Price: priceInput,
        taken: isTaken,
      });
      Alert.alert("Success", "Rental updated successfully.");
      setManageVisible(false);
    } catch (err) {
      Alert.alert("Error", "Failed to update rental.");
    }
    setLoading(false);
  };

  const handleDelete = (propertyId) => {
  Alert.alert(
    "Confirm Deletion",
    "Are you sure you want to delete this property and all its units?",
    [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          setDeletingId(propertyId);
          try {
            const result = await deletePropertyUnit(propertyId);
            if(!result.success){
              showError("Failed to delete property.try again or check your connection");
            }
            if(result.success){
              showSuccess("Property and its units deleted successfully.");
              router.replace("/dashindex")

            }
    
          } catch (error) {
            console.log("Deletion failed:", error);
            showError("Failed to delete property.");
          }finally{
            setDeletingId(null);
          }
        },
      },
    ]
  );
};

  return (
     <TouchableOpacity
        activeOpacity={1}
        style={{
            paddingVertical: 6,
            paddingHorizontal: 10,
            borderRadius: 12,
            marginBottom: 6,
            flexDirection: "row",
            alignItems: "center",
            justifyContent:"space-between"
        }}>


          <View style={{backgroundColor: secondary,width: 85,height: 90,borderRadius: 8,overflow: "hidden"}}>
            <Image
              source={
              item
                ? { uri: item?.frontImage }
                : require("../assets/images/blog2.jpg")
            }
              style={{width: "100%",height: "100%",}}
              />

        </View>
        <View style={{width: "70%",height: 80,paddingVertical: 5,justifyContent: "space-between"}}>
              <View style={{width: "100%"}}>

                <View style={{flexDirection: "row",justifyContent: "space-between",alignItems: "center"}}>
                  <Text numberOfLines={1} style={{fontWeight: 600,color: white}}>{item.title}</Text>
                  <TouchableOpacity
                    activeOpacity={0.7}
                     onPress={toggleMenu}
                    style={styles.menuButton}>
                    <Entypo name="dots-three-horizontal" size={15} color={white} />
                  </TouchableOpacity>
                  {showMenu && (
                  <View style={styles.dropdownMenu}>
                    <TouchableOpacity 
                    activeOpacity={0.7}
                    onPress={() => {
                      router.push({
                          pathname: '/editproperty',
                          params: { id: item.$id },
                      })
                    }}
                    style={{flexDirection: "row",alignItems: "center",marginBottom: 4}}>
                      <AntDesign name="edit" size={12} color={white} style={{paddingHorizontal: 3}} />
                      <Text style={{color: white,marginHorizontal: 2}}>Edit</Text>
                    </TouchableOpacity>
                    <View style={{height: 0.4,width: "98%",backgroundColor: Gray}}/>
                    <TouchableOpacity 
                    activeOpacity={0.7}
                    disabled={deletingId === item.$id}
                    onPress={() => {
                      handleDelete(item.$id)
                    }}
                    style={{flexDirection: "row",alignItems: "center"}}>
                      <AntDesign name="delete" size={12} color={Red} style={{paddingHorizontal: 3}} />
                      {/* <Text style={{color: Red,marginHorizontal: 2}}>Delete</Text> */}
                      {deletingId === item.$id ? (
                        <ActivityIndicator size={12} color={Red} style={{ marginLeft: 4 }} />
                      ) : (
                        <Text style={{ color: Red, marginHorizontal: 2 }}>Delete</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                )}
                </View>
                
                <View style={{flexDirection:"row", alignItems: "center",marginVertical: 3}}>
                    <Ionicons name="location-outline" size={13} color={Gray} style={{marginLeft:4,}}/>
                    <Text style={{ color:silver, marginHorizontal: 3,fontSize: 12 }}>{item.location || "No location"}</Text>
                </View>
              </View>

              <View style={{flexDirection:"row", alignItems: "center",justifyContent: "space-between",marginTop: 4}}>
                <View style={{flexDirection:"row", alignItems: "center"}}>
              
                </View>
                <TouchableOpacity 
                  activeOpacity={0.7}
                  style={{flexDirection: "row",alignItems: "center",backgroundColor: Primary,paddingHorizontal: 14,paddingVertical: 4,borderRadius: 6,}}
                  onPress={() => {
                    if (item.$id) {
                      router.push({
                        pathname: "/unitmanagement",
                        params: { id: item.$id }
                      });
                    } else {
                      console.warn("No rental ID found for this rental.");
                    }
                  }}
                >
                  <Text style={{color: "white",fontWeight: "600",fontSize: 12,}}>Manage</Text>
                </TouchableOpacity>
              </View>


        </View>
          
        </TouchableOpacity>
  )
}

export default Myrentalcard

const styles = StyleSheet.create({
  card: {
    width: windowWidth * 0.96,
    backgroundColor: "#181818",
    minHeight: 250,
    marginVertical: 10,
    borderRadius: 14,
    overflow: "hidden",
    borderColor: secondary,
    borderWidth: 1.2,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  imageContainer: {
    width: "100%",
    height: 150,
    backgroundColor: "#222",
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    overflow: "hidden",
  },
  image: {
    resizeMode: "contain",
    width: '100%',
    height: '100%',
    borderRadius: 8,
    alignSelf: "center",
    justifyContent: "center"
  },
  infoContainer: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 6,
    backgroundColor: "transparent",
  },
  menuRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 2,
  },
  menuButton: {
    padding: 5,
  },
  titleText: {
    color: white,
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 6,
    marginTop: 2,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  metaText: {
    color: "#bbb",
    marginLeft: 4,
    fontSize: 14,
    fontWeight: "500",
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#222",
    backgroundColor: "#191919",
  },
  priceText: {
    color: Primary,
    fontWeight: "700",
    fontSize: 16,
    marginLeft: 2,
  },
  viewsText: {
    color: "#aaa",
    fontSize: 13,
    marginLeft: 14,
    fontWeight: "500",
    alignSelf: "center",
  },
 
  dropdownMenu: {
    position: "absolute",
    top: 20,
    right: 5,
    backgroundColor: secondary,
    borderRadius: 6,
    padding: 10,
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 8
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center"
  },
  modalContent: {
    backgroundColor: "#222",
    borderRadius: 14,
    padding: 24,
    width: "85%",
    alignItems: "stretch"
  },
  modalTitle: {
    color: white,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 18,
    alignSelf: "center"
  },
  modalLabel: {
    color: "#eee",
    fontSize: 15,
    marginBottom: 6,
    marginTop: 10
  },
  input: {
    backgroundColor: "#333",
    color: white,
    borderRadius: 7,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    marginBottom: 8
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10
  },
  modalButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 10,
    borderRadius: 7,
    alignItems: "center"
  }
});
