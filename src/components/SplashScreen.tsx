import React, { useState } from 'react';
import { View, Text, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHabitStore } from '../state/habitStore';

interface SplashScreenProps {
  theme: any;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ theme }) => {
  // Built-in placeholder logo to avoid asset issues until real PNGs are uploaded
  const defaultLogoDataUri = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAIUlEQVR4nO3BMQEAAADCoPdPbQ43oAAAAAAAAAAAAAAAAPgGi58AATkKYY0AAAAASUVORK5CYII=";
  const { settings } = useHabitStore();

  // Use local assets only - no external URLs for TestFlight compatibility
  const logoLight = require("../../assets/app-logo-light.png");
  const logoDark = require("../../assets/app-logo-dark.png");
  const logoDefault = require("../../assets/app-logo.png");
  const [displaySource, setDisplaySource] = useState<any>(logoDefault);
  const [usedDefaultOnce, setUsedDefaultOnce] = useState(false);

  React.useEffect(() => {
    // Use local assets based on theme
    const logoSource = settings.theme === 'dark' ? logoDark : logoLight;
    setDisplaySource(logoSource);
    setUsedDefaultOnce(false);
  }, [settings.theme]);

  return (
    <SafeAreaView 
      className="flex-1 items-center justify-center"
      style={{ backgroundColor: theme.background }}
    >
      <View className="items-center">
        {/* App Logo */}
          <View 
          className="w-40 h-40 rounded-3xl items-center justify-center mb-6"
          style={{ backgroundColor: theme.surface }}
        >
          <Image
            source={displaySource}
            style={{ width: 160, height: 160, borderRadius: 24 }}
            resizeMode="contain"
            onError={() => {
              console.log('Image load error, falling back to default');
              if (!usedDefaultOnce) {
                setDisplaySource(logoDefault);
                setUsedDefaultOnce(true);
              } else {
                setDisplaySource({ uri: defaultLogoDataUri } as any);
              }
            }}
            onLoad={() => {
              console.log('Image loaded successfully');
            }}
          />
        </View>
        
        {/* App Name */}
        <Text 
          className="text-3xl font-bold mb-2"
          style={{ color: theme.text }}
        >
          Habit Hero
        </Text>
        
        <Text 
          className="text-lg mb-8"
          style={{ color: theme.textSecondary }}
        >
          Building Better Habits
        </Text>
        
        {/* Loading Indicator */}
        <ActivityIndicator 
          size="large" 
          color={theme.primary}
        />
      </View>
    </SafeAreaView>
  );
};

export default SplashScreen;
