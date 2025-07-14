import React, { createContext, useContext, useState, useCallback } from "react";
import { View, Text, Animated, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

// Toast context
const ToastContext = createContext({
  showSuccess: (msg) => {},
  showError: (msg) => {},
});

// Toast UI component
const Toast = ({ type, message, onHide }) => {
  const toastColors = {
    success: "#15803d",
    error: "#b91c1c",
    info: "#ea580c",
    warning: "#0f766e",
  };

  const toastIcons = {
    success: "check-circle",
    error: "error",
    info: "info",
    warning: "warning",
  };

  const toastTitles = {
    success: "Success",
    error: "Error",
    info: "Info",
    warning: "Warning",
  };

  const bgColor = toastColors[type] || toastColors.info;
  const iconName = toastIcons[type] || toastIcons.info;
  const title = toastTitles[type] || toastTitles.info;

  return (
    <View style={[styles.toastContainer, { backgroundColor: bgColor }]}>
      <TouchableOpacity style={styles.closeButton} onPress={onHide}>
        <MaterialIcons name="close" size={20} color="#fff" />
      </TouchableOpacity>

      <View style={styles.content}>
        <MaterialIcons name={iconName} size={22} color="#fff" style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.toastTitle}>{title}</Text>
          <Text style={styles.toastText}>{message}</Text>
        </View>
      </View>
    </View>
  );
};

// Provider logic
export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({ type: "", message: "", visible: false });

  const showToast = useCallback((type, message) => {
    setToast({ type, message, visible: true });

    // Auto-hide after 3 seconds
    setTimeout(() => {
      setToast({ type: "", message: "", visible: false });
    }, 3000);
  }, []);

  const showSuccess = (msg) => showToast("success", msg);
  const showError = (msg) => showToast("error", msg);

  return (
    <ToastContext.Provider value={{ showSuccess, showError }}>
      {children}
      {toast.visible && (
        <Toast
          type={toast.type}
          message={toast.message}
          onHide={() => setToast({ ...toast, visible: false })}
        />
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);

// Styles
const styles = StyleSheet.create({
  toastContainer: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
    borderRadius: 10,
    padding: 14,
    zIndex: 100,
    elevation: 4,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  toastTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
    marginBottom: 2,
  },
  toastText: {
    color: "#fff",
    fontSize: 14,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 4,
    zIndex: 1,
  },
});
