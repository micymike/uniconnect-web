import React from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity, Linking } from "react-native";
import { useUpdate } from "../context/UpdateContext";

const UpdateModal = () => {
  const { updateAvailable, latestVersion, goToStore } = useUpdate();

  if (!updateAvailable) return null;

  return (
    <Modal
      visible={true}
      transparent
      animationType="fade"
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Update Available</Text>
          <Text style={styles.message}>
            A new version ({latestVersion}) of Uniconnect is available. Please download the latest update for the best experience.
          </Text>
          <TouchableOpacity style={styles.button} onPress={goToStore}>
            <Text style={styles.buttonText}>Download from uniconnect.store</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    width: "80%",
    alignItems: "center",
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#222",
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
    color: "#444",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default UpdateModal;
