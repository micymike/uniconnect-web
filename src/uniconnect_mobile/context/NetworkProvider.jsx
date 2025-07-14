import React, { createContext, useState, useEffect, useContext } from "react";
import NetInfo from "@react-native-community/netinfo";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Primary, secondary, silver, white } from "@/utils/colors";

const NetworkContext = createContext();
export const useNetwork = () => useContext(NetworkContext);

export const NetworkProvider = ({ children }) => {
  const [isOffline, setIsOffline] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const offline = !state.isConnected || !state.isInternetReachable;
      setIsOffline(offline);
    });

    return () => unsubscribe();
  }, []);

  const handleClose = () => {
    setIsOffline(false);
  };

  const retryConnection = async () => {
    setIsRetrying(true);
    const state = await NetInfo.fetch();
    const offline = !state.isConnected || !state.isInternetReachable;
    setIsOffline(offline);
    setIsRetrying(false);
  };

  return (
    <NetworkContext.Provider value={{ isOffline }}>
      {children}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isOffline}
        onRequestClose={handleClose}
      >
        <TouchableWithoutFeedback onPress={handleClose}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.title}>Connect to the internet</Text>
                <Text style={styles.description}>
                  You're offline. Check your internet connection.
                </Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={retryConnection}
                  disabled={isRetrying}
                  style={styles.retryButton}
                >
                  {isRetrying ? (
                    <ActivityIndicator color="#fff" size={16} />
                  ) : (
                    <Text style={styles.retryText}>Retry</Text>
                  )}
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </NetworkContext.Provider>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContent: {
    width: "100%",
    paddingHorizontal: 20,
    backgroundColor: secondary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 30,
  },
  title: {
    color: white,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    color: silver,
    fontSize: 14,
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: Primary,
    width: "90%",
    alignSelf: "center",
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 10,
    marginVertical: 12,
  },
  retryText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
});
