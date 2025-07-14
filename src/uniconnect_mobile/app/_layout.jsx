import { NotificationProvider } from "@/context/NotificationContext";
import { ThemeProvider, DarkTheme } from "@react-navigation/native";
import { Stack } from "expo-router";
import * as Notifications from "expo-notifications";
import * as SplashScreen from "expo-splash-screen";
import { NetworkProvider } from "@/context/NetworkProvider";
import PromoModalProvider from "@/context/PromoModalContext"; 
import { ToastProvider } from "@/context/ToastProvider";
import { useState, useEffect } from "react";
import { UpdateProvider } from "../context/UpdateContext";
import UpdateModal from "../components/UpdateModal";


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

SplashScreen.preventAutoHideAsync();


export default function RootLayout() {

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await new Promise(resolve => setTimeout(resolve, 100)); 
        
        setIsReady(true);
      } catch (e) {
        console.warn(e);
      } finally {
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  if (!isReady) {
    return null; 
  }

  return (
    <UpdateProvider>
      <UpdateModal />
      <NetworkProvider>
        <NotificationProvider>
          <PromoModalProvider>
            <ToastProvider>
              <ThemeProvider value={DarkTheme}>
                <Stack>
                  <Stack.Screen name="index" options={{headerShown: false}}/>
                  <Stack.Screen name="(auth)" options={{ headerShown: false }}/>
                  <Stack.Screen name="(dashboard)" options={{ headerShown: false }}/>
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }}/>
                  <Stack.Screen name="(chat)" options={{ headerShown: false }}/>
                  <Stack.Screen name="(rental)" options={{ headerShown: false }}/>
                  <Stack.Screen name="(market)" options={{ headerShown: false }}/>
                  <Stack.Screen name="(others)" options={{ headerShown: false }}/>
                </Stack>
              </ThemeProvider>
            </ToastProvider>
          </PromoModalProvider>
        </NotificationProvider>
      </NetworkProvider>
    </UpdateProvider>
  );
}
