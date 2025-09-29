import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DeviceEventEmitter, Alert, LogBox } from "react-native";
import * as SplashScreenExpo from 'expo-splash-screen';
import RootNavigator from "./src/navigation/RootNavigator";
import { useHabitStore } from "./src/state/habitStore";
import { getTheme } from "./src/utils/theme";
import NotificationManager from "./src/components/NotificationManager";
import SplashScreen from "./src/components/SplashScreen";
import { simpleSecurityManager } from "./src/security/SimpleSecurityManager";
import ErrorBoundary from "./src/components/ErrorBoundary";
import { widgetService } from "./src/services/WidgetService";

// Keep the splash screen visible while we fetch resources
SplashScreenExpo.preventAutoHideAsync();

// Suppress debugger warnings and annoying notifications
LogBox.ignoreLogs([
  'SafeAreaView has been deprecated',
  'Viewing debugger warnings',
  'Debugger integration',
  'Welcome to React Native DevTools',
  'Running "main" with',
  'Project ID is: undefined'
]);

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
  const { settings } = useHabitStore();
  const theme = getTheme(settings?.theme || 'light');
  const [appReady, setAppReady] = useState(false);
  
  useEffect(() => {
    // Simplified initialization to prevent memory crashes
    const initializeApp = async () => {
      try {
        console.log('Initializing app...');
        
        // Skip complex security initialization to prevent memory issues
        console.log('Skipping security initialization to prevent crashes');
        
        // Initialize widget service
        widgetService.setupListeners();
        await widgetService.updateWidgetData();
        console.log('Widget service initialized');
        
        // Minimal delay to show splash screen
        setTimeout(async () => {
          console.log('App ready');
          setAppReady(true);
          // Hide the native splash screen
          await SplashScreenExpo.hideAsync();
        }, 2000);
        
      } catch (error) {
        console.warn('App initialization warning:', error);
        setAppReady(true); // Continue anyway
        await SplashScreenExpo.hideAsync();
      }
    };

    initializeApp();
  }, []);

  // Show loading while initializing
  if (!appReady) {
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
