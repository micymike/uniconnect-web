import React, { createContext, useContext, useEffect, useState } from "react";
import { Linking } from "react-native";
import Constants from "expo-constants";

const UpdateContext = createContext();

export const UpdateProvider = ({ children }) => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [latestVersion, setLatestVersion] = useState(null);

  useEffect(() => {
    // Fetch latest version info from remote JSON
    const checkForUpdate = async () => {
      try {
        const response = await fetch("https://uniconnect.store/version.json");
        if (!response.ok) return;
        const data = await response.json();
        setLatestVersion(data.version);

        // Get current app version from Constants
        const currentVersion = Constants.manifest.version;
        if (
          data.version &&
          currentVersion &&
          compareVersions(data.version, currentVersion) > 0
        ) {
          setUpdateAvailable(true);
        }
      } catch (e) {
        // Fail silently
      }
    };

    checkForUpdate();
  }, []);

  // Simple version comparison: returns 1 if v1 > v2, -1 if v1 < v2, 0 if equal
  function compareVersions(v1, v2) {
    const a = v1.split(".").map(Number);
    const b = v2.split(".").map(Number);
    for (let i = 0; i < Math.max(a.length, b.length); i++) {
      const diff = (a[i] || 0) - (b[i] || 0);
      if (diff !== 0) return diff > 0 ? 1 : -1;
    }
    return 0;
  }

  const goToStore = () => {
    Linking.openURL("https://uniconnect.store");
  };

  return (
    <UpdateContext.Provider
      value={{
        updateAvailable,
        latestVersion,
        goToStore,
      }}
    >
      {children}
    </UpdateContext.Provider>
  );
};

export const useUpdate = () => useContext(UpdateContext);
