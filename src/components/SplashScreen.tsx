import React, { useState } from 'react';
import { View, Text, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHabitStore } from '../state/habitStore';

// Import the app icon - try multiple sources (matching app.json)
const iconJpg = require('../../assets/icon.jpg');
const appIcon = require('../../assets/icon.png');
const appLogo = require('../../assets/app-logo.png');

interface SplashScreenProps {
  theme: any;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ theme }) => {
  const { settings } = useHabitStore();
  const [imageError, setImageError] = useState(false);
  const [currentImageSource, setCurrentImageSource] = useState(iconJpg);

  // Debug: Log all available icons
  console.log('Available icons:', {
    iconJpg: iconJpg,
    iconPng: appIcon,
    appLogo: appLogo
  });

  return (
    <SafeAreaView 
      className="flex-1 items-center justify-center"
      style={{ backgroundColor: '#000000' }}
    >
      <View className="items-center">
        {/* App Logo */}
        <View 
          className="w-40 h-40 rounded-3xl items-center justify-center mb-6"
          style={{ backgroundColor: '#1a1a1a' }}
        >
          <Image
            source={currentImageSource}
            style={{ width: 120, height: 120, borderRadius: 20 }}
            resizeMode="contain"
            onError={(error) => {
              console.log('❌ Image failed to load:', error);
              console.log('Trying next image source...');
              
              // Try different image sources
              if (currentImageSource === iconJpg) {
                console.log('Trying icon.png...');
                setCurrentImageSource(appIcon);
              } else if (currentImageSource === appIcon) {
                console.log('Trying app-logo.png...');
                setCurrentImageSource(appLogo);
              } else {
                console.log('All image sources failed, showing fallback');
                setImageError(true);
              }
            }}
            onLoad={() => {
              console.log('✅ Image loaded successfully:', currentImageSource);
              setImageError(false);
            }}
          />
          {imageError && (
            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: '#ffffff', fontSize: 48, fontWeight: 'bold' }}>H</Text>
              <Text style={{ color: '#cccccc', fontSize: 12, marginTop: 4 }}>Habit Hero</Text>
            </View>
          )}
        </View>
        
        {/* App Name */}
        <Text 
          className="text-3xl font-bold mb-2"
          style={{ color: '#ffffff' }}
        >
          Habit Hero
        </Text>
        
        <Text 
          className="text-lg mb-8"
          style={{ color: '#cccccc' }}
        >
          Building Better Habits
        </Text>
        
        {/* Loading Indicator */}
        <ActivityIndicator 
          size="large" 
          color="#ffffff"
        />
      </View>
    </SafeAreaView>
  );
};

export default SplashScreen;
