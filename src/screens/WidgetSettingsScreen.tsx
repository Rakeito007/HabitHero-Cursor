import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useHabitStore } from '../state/habitStore';
import { getTheme } from '../utils/theme';
import { useProFeatures } from '../utils/proFeatures';

interface WidgetSettingsScreenProps {
  navigation: any;
}

const WidgetSettingsScreen: React.FC<WidgetSettingsScreenProps> = ({ navigation }) => {
  const { habits, settings } = useHabitStore();
  const theme = getTheme(settings.theme);
  const { isProUser } = useProFeatures();
  const [selectedHabits, setSelectedHabits] = useState<string[]>([]);

  const activeHabits = habits.filter(habit => !habit.archived);

  useEffect(() => {
    // Load previously selected habits for widgets
    const saved = settings.widgetHabits || [];
    setSelectedHabits(saved);
  }, [settings.widgetHabits]);

  const handleHabitToggle = (habitId: string) => {
    if (!isProUser && selectedHabits.length >= 3) {
      Alert.alert(
        'Widget Limit Reached',
        'Free users can add up to 3 habit widgets. Upgrade to PRO for unlimited widgets!',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Upgrade to PRO', onPress: () => navigation.navigate('Settings', { showSubscriptionPlans: true }) }
        ]
      );
      return;
    }

    setSelectedHabits(prev => {
      const newSelection = prev.includes(habitId) 
        ? prev.filter(id => id !== habitId)
        : [...prev, habitId];
      
      // Save to settings
      useHabitStore.getState().updateSettings({ 
        widgetHabits: newSelection 
      });
      
      return newSelection;
    });
  };

  const openWidgetSettings = () => {
    Alert.alert(
      'Add Widget to Home Screen',
      'To add a habit widget:\n\n1. Long press on your home screen\n2. Tap the "+" button\n3. Search for "Habit Hero"\n4. Select the widget size\n5. Choose your habit\n\nMake sure you have selected habits below first!',
      [
        { text: 'Got it!', style: 'default' },
        { text: 'Open Settings', onPress: () => Linking.openSettings() }
      ]
    );
  };

  const HabitRow = ({ habit }: { habit: any }) => {
    const isSelected = selectedHabits.includes(habit.id);
    const stats = useHabitStore.getState().getHabitStats(habit.id);
    
    return (
      <Pressable
        onPress={() => handleHabitToggle(habit.id)}
        className="flex-row items-center p-4 rounded-xl mb-3"
        style={{ 
          backgroundColor: theme.cardBackground,
          borderWidth: isSelected ? 2 : 1,
          borderColor: isSelected ? theme.primary : theme.border
        }}
      >
        <View 
          className="w-12 h-12 rounded-full items-center justify-center mr-4"
          style={{ backgroundColor: habit.color + '20' }}
        >
          <Ionicons 
            name={habit.icon as any} 
            size={24} 
            color={habit.color} 
          />
        </View>
        
        <View className="flex-1">
          <Text 
            className="text-lg font-semibold"
            style={{ color: theme.text }}
          >
            {habit.name}
          </Text>
          <Text 
            className="text-sm"
            style={{ color: theme.textSecondary }}
          >
            {stats.currentStreak} day streak • {Math.round(stats.completionRate)}% completion
          </Text>
        </View>
        
        <View className="flex-row items-center">
          {isSelected && (
            <View 
              className="w-6 h-6 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: theme.primary }}
            >
              <Ionicons name="checkmark" size={16} color="white" />
            </View>
          )}
          
          <Ionicons 
            name={isSelected ? "radio-button-on" : "radio-button-off"} 
            size={24} 
            color={isSelected ? theme.primary : theme.textTertiary} 
          />
        </View>
      </Pressable>
    );
  };

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background }}>
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center px-6 py-4">
          <Pressable onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color={theme.text} />
          </Pressable>
          
          <Text 
            className="text-xl font-semibold ml-4"
            style={{ color: theme.text }}
          >
            Widget Settings
          </Text>
        </View>
        
        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
          {/* Instructions */}
          <View 
            className="p-4 rounded-xl mb-6"
            style={{ backgroundColor: theme.primary + '10' }}
          >
            <View className="flex-row items-start">
              <Ionicons 
                name="information-circle" 
                size={20} 
                color={theme.primary} 
                style={{ marginTop: 2, marginRight: 12 }}
              />
              <View className="flex-1">
                <Text 
                  className="text-base font-semibold mb-2"
                  style={{ color: theme.text }}
                >
                  Add Habit Widgets
                </Text>
                <Text 
                  className="text-sm leading-5"
                  style={{ color: theme.textSecondary }}
                >
                  Select habits below, then add widgets to your home screen for quick habit tracking.
                </Text>
              </View>
            </View>
          </View>

          {/* Pro Status */}
          {!isProUser && (
            <View 
              className="p-4 rounded-xl mb-6"
              style={{ backgroundColor: '#FFD700' + '20' }}
            >
              <View className="flex-row items-center">
                <Ionicons name="diamond" size={20} color="#FFD700" />
                <Text 
                  className="text-base font-semibold ml-2"
                  style={{ color: theme.text }}
                >
                  Free Plan: {selectedHabits.length}/3 widgets
                </Text>
              </View>
              <Text 
                className="text-sm mt-1"
                style={{ color: theme.textSecondary }}
              >
                Upgrade to PRO for unlimited widgets
              </Text>
            </View>
          )}

          {/* Selected Count */}
          <View className="flex-row items-center justify-between mb-4">
            <Text 
              className="text-lg font-semibold"
              style={{ color: theme.text }}
            >
              Select Habits for Widgets
            </Text>
            <Text 
              className="text-sm"
              style={{ color: theme.textSecondary }}
            >
              {selectedHabits.length} selected
            </Text>
          </View>

          {/* Habits List */}
          {activeHabits.length === 0 ? (
            <View className="items-center py-12">
              <Ionicons 
                name="leaf-outline" 
                size={64} 
                color={theme.textTertiary} 
              />
              <Text 
                className="text-lg font-medium mt-4 mb-2"
                style={{ color: theme.text }}
              >
                No habits yet
              </Text>
              <Text 
                className="text-center px-8"
                style={{ color: theme.textSecondary }}
              >
                Create some habits first to add them as widgets
              </Text>
            </View>
          ) : (
            <>
              {activeHabits.map((habit) => (
                <HabitRow key={habit.id} habit={habit} />
              ))}
            </>
          )}

          {/* Add Widget Button */}
          {selectedHabits.length > 0 && (
            <Pressable
              onPress={openWidgetSettings}
              className="py-4 rounded-xl mb-6"
              style={{ backgroundColor: theme.primary }}
            >
              <Text 
                className="text-center font-semibold text-lg"
                style={{ color: 'white' }}
              >
                Add Widget to Home Screen
              </Text>
            </Pressable>
          )}

          {/* Widget Features */}
          <View 
            className="p-4 rounded-xl mb-6"
            style={{ backgroundColor: theme.surface }}
          >
            <Text 
              className="text-base font-semibold mb-3"
              style={{ color: theme.text }}
            >
              Widget Features
            </Text>
            
            <View className="space-y-2">
              <View className="flex-row items-center">
                <Ionicons name="checkmark-circle" size={16} color={theme.success} />
                <Text 
                  className="ml-2 text-sm"
                  style={{ color: theme.text }}
                >
                  Quick habit completion with one tap
                </Text>
              </View>
              
              <View className="flex-row items-center">
                <Ionicons name="checkmark-circle" size={16} color={theme.success} />
                <Text 
                  className="ml-2 text-sm"
                  style={{ color: theme.text }}
                >
                  View current streak and completion rate
                </Text>
              </View>
              
              <View className="flex-row items-center">
                <Ionicons name="checkmark-circle" size={16} color={theme.success} />
                <Text 
                  className="ml-2 text-sm"
                  style={{ color: theme.text }}
                >
                  Beautiful, customizable design
                </Text>
              </View>
              
              <View className="flex-row items-center">
                <Ionicons name="checkmark-circle" size={16} color={theme.success} />
                <Text 
                  className="ml-2 text-sm"
                  style={{ color: theme.text }}
                >
                  Updates automatically throughout the day
                </Text>
              </View>
            </View>
          </View>

          {/* Upgrade Prompt */}
          {!isProUser && (
            <Pressable
              onPress={() => navigation.navigate('Settings', { showSubscriptionPlans: true })}
              className="p-4 rounded-xl mb-6"
              style={{ 
                backgroundColor: '#FFD700' + '20',
                borderWidth: 1,
                borderColor: '#FFD700'
              }}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text 
                    className="text-base font-semibold"
                    style={{ color: theme.text }}
                  >
                    Upgrade to PRO
                  </Text>
                  <Text 
                    className="text-sm mt-1"
                    style={{ color: theme.textSecondary }}
                  >
                    Unlimited widgets and premium features
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={theme.textTertiary} />
              </View>
            </Pressable>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default WidgetSettingsScreen;
