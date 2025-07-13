import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Switch,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { Primary, secondary, white } from "../../utils/colors";

export default function RentalAdmin() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [property, setProperty] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [frontImage, setFrontImage] = useState("");
  const [backImage, setBackImage] = useState("");
  const [price, setPrice] = useState("");
  const [isTaken, setIsTaken] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchProperty();
  }, [id]);

  async function fetchProperty() {
    setLoading(true);
    try {
      const { fetchRentalById } = await import("../../lib/rentals/rental");
      const res = await fetchRentalById(id);
      if (res.success && res.data) {
        setProperty(res.data);
        setTitle(res.data.title || res.data.name || res.data.propertyName || "");
        setDescription(res.data.description || "");
        setLocation(res.data.location || "");
        setCategory(res.data.category || "");
        setCondition(res.data.condition || "");
        let images = [];
        try {
          images = JSON.parse(res.data.images || "[]");
        } catch {}
        setFrontImage(images[0] || "");
        setBackImage(images[1] || "");
        setPrice(
          res.data.price ||
          res.data.Price ||
          res.data.rent ||
          res.data.amount ||
          ""
        );
        setIsTaken(!!res.data.taken);
      } else {
        Alert.alert("Error", "Failed to fetch property details.");
        router.back();
      }
    } catch (err) {
      Alert.alert("Error", "Failed to fetch property details.");
      router.back();
    }
    setLoading(false);
  }

  async function handleUpdate() {
    setSaving(true);
    try {
      const { updateRental } = await import("../../lib/rentals/rental");
      await updateRental(id, {
        title,
        description,
        location,
        category,
        condition,
        images: JSON.stringify([frontImage, backImage].filter(Boolean)),
        Price: price,
        taken: isTaken,
      });
      Alert.alert("Success", "Rental updated successfully.");
      fetchProperty();
    } catch (err) {
      Alert.alert("Error", "Failed to update rental.");
    }
    setSaving(false);
  }

  async function handleDelete() {
    Alert.alert(
      "Delete Rental",
      "Are you sure you want to delete this rental?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setSaving(true);
            try {
              const { deleteRental } = await import("../../lib/rentals/rental");
              await deleteRental(id);
              Alert.alert("Deleted", "Rental deleted successfully.");
              router.replace("/(rental)/rentaldashboard");
            } catch (err) {
              Alert.alert("Error", "Failed to delete rental.");
            }
            setSaving(false);
          },
        },
      ]
    );
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Primary} />
      </View>
    );
  }

  if (!property) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: white }}>Property not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Rental Admin Panel</Text>
      {/* Analytics Section */}
      <View style={styles.analyticsCard}>
        <Text style={styles.analyticsTitle}>Interactivity Analytics</Text>
        <View style={styles.analyticsRow}>
          <Text style={styles.analyticsLabel}>Total Views</Text>
          <Text style={styles.analyticsValue}>{typeof property.views === "number" ? property.views : 0}</Text>
        </View>
        {/* Placeholder for a simple "views over time" bar chart */}
        <View style={styles.barChartContainer}>
          {/* Mock data: 7 days of views */}
          {[12, 18, 7, 22, 15, 30, 25].map((v, i) => (
            <View key={i} style={styles.barWrapper}>
              <View style={[styles.bar, { height: 10 + v * 2 }]} />
              <Text style={styles.barLabel}>D{i + 1}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.analyticsHint}>* Analytics are for demonstration. Real-time stats coming soon.</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter title"
          editable={!saving}
        />
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
          placeholder="Enter description"
          editable={!saving}
          multiline
        />
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          value={location}
          onChangeText={setLocation}
          placeholder="Enter location"
          editable={!saving}
        />
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Category</Text>
        <TextInput
          style={styles.input}
          value={category}
          onChangeText={setCategory}
          placeholder="Enter category"
          editable={!saving}
        />
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Condition</Text>
        <TextInput
          style={styles.input}
          value={condition}
          onChangeText={setCondition}
          placeholder="Enter condition"
          editable={!saving}
        />
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Front Image URL</Text>
        <TextInput
          style={styles.input}
          value={frontImage}
          onChangeText={setFrontImage}
          placeholder="Front image URL"
          editable={!saving}
        />
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Back Image URL</Text>
        <TextInput
          style={styles.input}
          value={backImage}
          onChangeText={setBackImage}
          placeholder="Back image URL"
          editable={!saving}
        />
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Price</Text>
        <TextInput
          style={styles.input}
          value={price}
          onChangeText={setPrice}
          placeholder="Enter price"
          keyboardType="numeric"
          editable={!saving}
        />
      </View>
      <View style={styles.sectionRow}>
        <Text style={styles.label}>Mark as Taken</Text>
        <Switch
          value={isTaken}
          onValueChange={setIsTaken}
          disabled={saving}
        />
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#e11d48" }]}
          onPress={handleDelete}
          disabled={saving}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: Primary }]}
          onPress={handleUpdate}
          disabled={saving}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>
            {saving ? "Saving..." : "Save"}
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={{ marginTop: 20, alignSelf: "center" }}
        onPress={() => router.back()}
        disabled={saving}
      >
        <Text style={{ color: "#aaa", fontSize: 15 }}>Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#181818",
    padding: 24,
    minHeight: "100%",
    flexGrow: 1,
  },
  centered: {
    flex: 1,
    backgroundColor: "#181818",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: white,
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 24,
    alignSelf: "center",
  },
  section: {
    marginBottom: 18,
  },
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  label: {
    color: "#eee",
    fontSize: 15,
    marginBottom: 4,
  },
  value: {
    color: white,
    fontSize: 16,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#333",
    color: white,
    borderRadius: 7,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    marginTop: 2,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
  },
  button: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 12,
    borderRadius: 7,
    alignItems: "center",
  },
  // --- Analytics styles ---
  analyticsCard: {
    backgroundColor: "#23272e",
    borderRadius: 12,
    padding: 18,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  analyticsTitle: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 10,
  },
  analyticsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  analyticsLabel: {
    color: "#bbb",
    fontSize: 15,
  },
  analyticsValue: {
    color: Primary,
    fontSize: 18,
    fontWeight: "bold",
  },
  barChartContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 60,
    marginTop: 8,
    marginBottom: 4,
  },
  barWrapper: {
    alignItems: "center",
    flex: 1,
  },
  bar: {
    width: 14,
    backgroundColor: Primary,
    borderRadius: 4,
    marginBottom: 2,
  },
  barLabel: {
    color: "#aaa",
    fontSize: 11,
    marginTop: 2,
  },
  analyticsHint: {
    color: "#888",
    fontSize: 12,
    marginTop: 8,
    fontStyle: "italic",
    textAlign: "center",
  },
});
