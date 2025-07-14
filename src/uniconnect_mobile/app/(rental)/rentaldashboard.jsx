import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl } from "react-native";
import { fetchRentals } from "../../lib/rentals/rental";
import { Account, Client } from "react-native-appwrite";
import Myrentalcard from "../../components/myrentalcard";
import { useRouter } from "expo-router";
import { Primary, white } from "../../utils/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import Header from "../../components/header";

const RentalDashboard = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState("");
  const router = useRouter();
 
  const loadRentals = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchRentals();
      if (res.success) {
        setRentals(res.data);
      } else {
        setError(res.message || "Failed to fetch rentals");
      }
    } catch (err) {
      setError("Failed to fetch rentals");
    }
    setLoading(false);
  };

  useEffect(() => {
    // Fetch current user ID
    const client = new Client()
      .setEndpoint("https://cloud.appwrite.io/v1")
      .setProject("67fc0576000b05b9e495");
    const account = new Account(client);
    account.get().then(user => {
      setUserId(user.$id);
    }).catch(() => setUserId(""));

    loadRentals();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadRentals().finally(() => setRefreshing(false));
  }, []);

  const renderRental = ({ item }) => (
    <Myrentalcard
      item={{
        ...item.property,
        rentalId: item.$id, // Pass the rental document ID
      }}
    />
  );

  return (
    <View style={styles.container}>
      

      <Header
      showBackButton={true}
      title="Rental Dashboard"
      color={white}
      Size={19}
      showIcons={false}
      />

      <View style={{width: "96%",flexDirection: "row",justifyContent: "space-between",marginVertical: 4,alignItems: "center",paddingHorizontal: 10}}>
        <View>
          <Text style={{fontSize: 15,fontWeight: 500,marginVertical:10,color: white}}>My Prorperties</Text>
        </View>
        <View style={{flexDirection: "row", alignItems: "center"}}>
          
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              router.push("/(rental)/createrental");
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
            <Text style={{color: "white", fontWeight: 600, fontSize: 14}}>Add Property</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={Primary} style={{ marginTop: 40 }} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : rentals.length === 0 ? (
        <Text style={styles.emptyText}>No rentals found. Add your first rental!</Text>
      ) : (
        <FlatList
          data={rentals.filter(item => userId && item.property.userId === userId)}
          keyExtractor={(item) => item.property.$id}
          renderItem={renderRental}
          contentContainerStyle={{ paddingBottom: 30 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
};

export default RentalDashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    paddingTop: 30,
    paddingHorizontal: 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    marginBottom: 10,
  },
  title: {
    color: white,
    fontSize: 24,
    fontWeight: "bold",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addButtonText: {
    color: white,
    fontSize: 16,
    marginLeft: 6,
    fontWeight: "600",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
  },
  emptyText: {
    color: "#aaa",
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
  },
});
