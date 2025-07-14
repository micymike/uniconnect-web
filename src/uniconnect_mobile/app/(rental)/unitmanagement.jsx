import { useState, useEffect } from "react"
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert,FlatList, ActivityIndicator,Dimensions } from "react-native"
import { SafeAreaView,useSafeAreaInsets } from "react-native-safe-area-context"
import { white,secondary,Primary,silver,Gray,Red } from "../../utils/colors"
import { Ionicons,Feather,MaterialIcons,FontAwesome } from '@expo/vector-icons';
import { router ,useLocalSearchParams} from "expo-router";
import Header from "../../components/header";
import AntDesign from '@expo/vector-icons/AntDesign';
import { getUnitFotProperty } from "../../lib/rentals/rental";
import { useToast } from "@/context/ToastProvider";
import { deleteUnit } from "../../lib/rentals/rental";
import { useAuthGuard } from '../../utils/useAuthGuard'

const windowWidth = Dimensions.get('window').width;
const Unitmanagement = () => {
    const { showSuccess, showError } = useToast();
     const {id} = useLocalSearchParams()
     const insets = useSafeAreaInsets();
     const [isFetchingUnits, setisFetchingUnits] = useState(false)
     const [units, setunits] = useState([])
    const [unitStatsArray, setUnitStatsArray] = useState([]);
    const [deletingId, setDeletingId] = useState(null);
    const { isAuthenticated, checking } = useAuthGuard('/');




      useEffect(() => {
    if (!id) {
      router.replace("/dashindex");
    } else {
      fetchUnits(); // Fetch on mount or id change
    }
  }, [id]);

  const fetchUnits = async () => {
    setisFetchingUnits(true);
    try {
      const result = await getUnitFotProperty({ id });

      if(!result.success){
        showError("Oops! We couldn't fetch your units.Please try again or check your connection.")
      }

      if (result.success) {
        const fetchedUnits = result.result;
        setunits(fetchedUnits);

        const totalUnits = fetchedUnits.length;
        const vacantUnits = fetchedUnits.filter(unit => unit.vacancyStatus === true).length;
        const occupiedUnits = fetchedUnits.filter(unit => unit.vacancyStatus === false).length;

        setUnitStatsArray([
          { name: "Total", value: totalUnits },
          { name: "Vacant", value: vacantUnits },
          { name: "Occupied", value: occupiedUnits }
        ]);
      }
    } catch (error) {
      console.log("Failed to fetch units:", error);
      showError("Failed to load units.");
    } finally {
      setisFetchingUnits(false);
    }
  };

  const handleDelete = (unitId) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this unit?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setDeletingId(unitId); 
            try {
              const result = await deleteUnit(unitId);
              if(!result.success){
                showError("Failed to delete your unit, try again or check your connection.")
                return
              }

              if(result.success){
                showSuccess("Unit deleted successfully.");
                fetchUnits(); 
              }
            } catch (error) {
              console.log("deleteUnit failed", error);
            }finally {
              setDeletingId(null); 
            }
          },
        },
      ]
    );
  };


    const Emptyreturn = () => {
        if(isFetchingUnits === true && units.length === 0 ){
            return(
                <View style={{justifyContent: "center",alignItems: "center",}}>
                    <ActivityIndicator size={20} color={Primary}/>
                    <Text style={{textAlign: "center",color: white,marginVertical: 4,fontSize: 15}}>Loading units...</Text>
                </View>
            )
        }else if(isFetchingUnits === false && units.length === 0 ){
            return(
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No units found</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => {
                        router.push({
                        pathname: "/createunit",
                        params: { id: id }
                      });
                    }}
                >
                    <Text style={styles.addButtonText}>+ Add Your First Unit</Text>
                </TouchableOpacity>
            </View>
            )
        }
    } 

    const UnitCard = ({item}) => {
        return(
            <View style={{borderRadius: 8,paddingHorizontal: 16,paddingVertical: 7,marginBottom: 16,borderWidth: 0.5,borderColor: "#374151",width: windowWidth * 0.94,}}>
                 <View style={styles.unitHeader}>
                <View style={styles.unitHeaderLeft}>
                  <Text style={styles.unitName}>{item.type}</Text>
                  {item.vacancyStatus  && (
                  <View style={[styles.statusBadge, { backgroundColor: "#2a1205" }]}>
                    <Text style={styles.statusText}>Vacant</Text>
                  </View>)}
                </View>
                <View style={styles.unitActions}>
                  <TouchableOpacity
                   activeOpacity={0.7}
                    style={styles.actionButton}
                    onPress={() => {
                        router.push({
                          pathname: '/editunit',
                          params: { id: item.$id }
                        });
                    }}
                  >
                    <AntDesign name="edit" size={10} color={white} style={{paddingHorizontal: 3}} />
                  </TouchableOpacity>
                  <TouchableOpacity
                  activeOpacity={0.7}
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => {
                      handleDelete(item.$id)
                    }}
                     disabled={deletingId === item.$id}
                  >
                    {deletingId === item.$id ? (
                      <ActivityIndicator size={14} color={Red} style={{ marginLeft: 4 }} />
                    ) : (
                      <AntDesign name="delete" size={10} color={white} style={{paddingHorizontal: 3}} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.unitDetails}>
                <View style={styles.unitDetailRow}>
                  <Text style={styles.unitDetailText}>
                    🛏️ {item.noOfBedrooms} Bedroom{item.noOfBedrooms > 1 ? "s" : ""}
                  </Text>
                  <Text style={styles.unitDetailText}>
                    🚿 {item.noOfBathrooms} Bathroom{item.noOfBathrooms > 1 ? "s" : ""}
                  </Text>
                </View>

                <View style={styles.unitFooter}>
                  <Text style={{color: Primary,fontSize: 14,fontWeight: "500",}}>KSh {item.price?.toLocaleString()}/month</Text>
                  <TouchableOpacity 
                  // activeOpacity={0.9}
                  // style={{ backgroundColor: "#374151",paddingHorizontal: 12,paddingVertical: 5,borderRadius: 4,}}
                  >
                    {/* <Text style={styles.typeText}>View</Text> */}
                  </TouchableOpacity>
                </View>

              </View>
            

            </View>
        )
    }

    const Overview = () => {
        return(
            <View style={{paddingHorizontal: 20,marginVertical: 4}}>
                <FlatList
                data={unitStatsArray}
                keyExtractor={(item) => item.name}
                renderItem={({ item }) => {
                    return(
                        <View style={{backgroundColor: secondary,padding: 16, borderRadius: 8, alignItems: "center",width: windowWidth *0.26}}>
                            <Text style={styles.summaryNumber}>{item.value}</Text>
                            <Text style={styles.summaryLabel}>{item.name}</Text>
                        </View>
                    )
                }}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{justifyContent: "space-between",alignItems: "center",flex: 1}}
                />
            </View>
        )
    }

  return (
    <SafeAreaView style={{flex: 1,backgroundColor: "#000"}}>
       <Header
        showBackButton={true}
        title="Manage Units"
        color={white}
        Size={17}
        showIcons={false}
       />
    
       <View style={styles.content}>
        {/* Summary Cards */}
        <View style={{width: "94%",flexDirection: "row",justifyContent: "space-between",marginVertical: 3,alignItems: "center",alignSelf:"center"}}>
          <View>
            <Text style={{fontSize: 16,fontWeight: 500,marginVertical:10,color: white}}>Overview</Text>
          </View>
          <View style={{flexDirection: "row", alignItems: "center"}}>
            
            <TouchableOpacity
             activeOpacity={0.7}
              onPress={() => {
                // router.push("/createunit");
                router.push({
                        pathname: "/createunit",
                        params: { id: id }
                      });
              }}
              style={{
                paddingVertical: 5,
                paddingHorizontal: 14,
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: Primary,
                borderRadius: 7,
              }}>
              <Ionicons name="add" size={16} color="white" style={{marginRight: 4}} />
              <Text style={{color: "white", fontWeight: 600, fontSize: 14}}>Add Unit</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{}}>
            <Overview/>
        </View>
        
        
        <Text style={{fontSize: 16,fontWeight: 500,marginVertical:10,color: white, width: "94%",alignSelf:"center"}}>All Units</Text>
        
          <FlatList
          data={units}
          keyExtractor={(item) => item.$id}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          style={{flex: 1,}}
          renderItem={({ item }) => <UnitCard key={item.$id} item={item} />}
          contentContainerStyle={{alignItems: "center"}} 
          ListEmptyComponent={
            <View style={{justifyContent: "center",alignItems: "center",paddingVertical: 100}}>
                <Emptyreturn/>
            </View>
          }
          
          />
        </View>
    </SafeAreaView>
  )
}

export default Unitmanagement

const styles = StyleSheet.create({
    header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'transparent',
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  backButton: {
    marginRight: 12,
    padding: 8,
  },
  backButtonText: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
  },
  headerTitle: {
    color: white,
    fontSize: 18,
    fontWeight: "600",
  },
  headerSubtitle: {
    color: "#9ca3af",
    fontSize: 14,
  },
  addButton: {
    backgroundColor: "#ea580c",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 14,
  },
  content: {
    flex: 1,
  },
 
  summaryCard: {
    backgroundColor: secondary,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  summaryNumber: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
  },
  summaryLabel: {
    color: "#9ca3af",
    fontSize: 12,
    marginTop: 4,
  },
   unitsSection: {
    padding: 16,
  },
  sectionTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  unitCard: {
    backgroundColor: "#1f2937",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#374151",
  },
  unitHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  unitHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  unitName: {
    color: white,
    fontSize: 14,
    fontWeight: "600",
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: Primary,
    fontSize: 12,
    fontWeight: "500",
  },
  unitActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 4,
  },
  actionButtonText: {
    fontSize: 16,
  },
  unitDetails: {
    gap: 12,
  },
  unitDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  unitDetailText: {
    color: "#9ca3af",
    fontSize: 12,
  },
  unitFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rentText: {
    
  },
  typeTag: {
   
  },
  typeText: {
    color: "#9ca3af",
    fontSize: 12,
  },
  tenantInfo: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#374151",
  },
   tenantText: {
    color: "#d1d5db",
    fontSize: 14,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
  },
  emptyStateText: {
    color: "#9ca3af",
    fontSize: 16,
    marginBottom: 16,
  },
})