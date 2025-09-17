import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DeviceEventEmitter, Alert } from "react-native";
import RootNavigator from "./src/navigation/RootNavigator";
import { useHabitStore } from "./src/state/habitStore";
import { getTheme } from "./src/utils/theme";
import NotificationManager from "./src/components/NotificationManager";
import SplashScreen from "./src/components/SplashScreen";
import { simpleSecurityManager } from "./src/security/SimpleSecurityManager";
import ErrorBoundary from "./src/components/ErrorBoundary";

/*
IMPORTANT NOTICE: DO NOT REMOVE
There are already environment keys in the project. 
Before telling the user to add them, check if you already have access to the required keys through bash.
Directly access them with process.env.${key}

Correct usage:
process.env.EXPO_PUBLIC_VIBECODE_{key}
//directly access the key

Incorrect usage:
import { OPENAI_API_KEY } from '@env';
//don't use @env, its depreicated

Incorrect usage:
import Constants from 'expo-constants';
const openai_api_key = Constants.expoConfig.extra.apikey;
//don't use expo-constants, its depreicated

*/

export default function App() {
  const { settings, updateSecurityStatus } = useHabitStore();
  const theme = getTheme(settings.theme);
  const [securityInitialized, setSecurityInitialized] = useState(false);
  const [minSplashElapsed, setMinSplashElapsed] = useState(false);
  
  useEffect(() => {
    // Initialize simple security manager
    const initializeSecurity = async () => {
      try {
        await simpleSecurityManager.initialize();
        setSecurityInitialized(true);
      } catch (error) {
        setSecurityInitialized(true); // Continue anyway
      }
    };

    initializeSecurity();

    // Defer sample data initialization
    if (settings.hasCompletedOnboarding) {
      setTimeout(() => {
        import("./src/utils/sampleData")
          .then(({ initializeSampleData }) => {
            initializeSampleData();
          })
          .catch(() => {});
      }, 100);
    }
  }, [settings.hasCompletedOnboarding]);

  // Watchdog: do not block UI if init stalls
  useEffect(() => {
    if (!securityInitialized) {
      const t = setTimeout(() => setSecurityInitialized(true), 5000);
      return () => clearTimeout(t);
    }
  }, [securityInitialized]);

  // Ensure splash is visible for at least 3 seconds
  useEffect(() => {
    const t = setTimeout(() => setMinSplashElapsed(true), 3000);
    return () => clearTimeout(t);
  }, []);
  
  // Show loading while initializing or before min splash time elapses
  if (!securityInitialized || !minSplashElapsed) {
    return <SplashScreen theme={theme} />;
  }
  
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <NotificationManager>
            <ErrorBoundary>
              <RootNavigator />
            </ErrorBoundary>
          </NotificationManager>
          <StatusBar style={settings.theme === "light" ? "dark" : "light"} />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
