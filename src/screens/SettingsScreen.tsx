import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Switch, Alert, Share, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { useHabitStore } from '../state/habitStore';
import { getTheme, habitColors, colorGroups } from '../utils/theme';
import ColorPicker from '../components/ColorPicker';
import { showSuccessNotification, showErrorNotification, showHabitNotification, showWarningNotification, showNotification } from '../components/NotificationManager';
import { useProFeatures } from '../utils/proFeatures';
import { paymentService } from '../services/paymentService';

// Debug function to unlock pro features for screenshots
const unlockProForScreenshots = () => {
  const { updateSubscription, updateSettings } = useHabitStore.getState();
  updateSubscription('lifetime');
  updateSettings({
    subscriptionStatus: 'lifetime',
    subscriptionDate: new Date(),
  });
  Alert.alert('Pro Unlocked', 'Pro features unlocked for screenshots!');
};

// Make it available globally for easy access
(global as any).unlockProForScreenshots = unlockProForScreenshots;

interface SettingsScreenProps {
  navigation: any;
  route: any;
}

const HABIT_ICONS = [
  'star-outline', 'fitness-outline', 'water-outline', 'book-outline', 'musical-notes-outline',
  'bed-outline', 'restaurant-outline', 'heart-outline', 'leaf-outline', 'barbell-outline',
  'walk-outline', 'bicycle-outline', 'car-outline', 'airplane-outline', 'phone-portrait-outline',
  'laptop-outline', 'camera-outline', 'brush-outline', 'game-controller-outline', 'headset-outline',
  'home-outline', 'business-outline', 'school-outline', 'library-outline', 'medical-outline',
  'cash-outline', 'gift-outline', 'flash-outline', 'sunny-outline', 'moon-outline',
];

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation, route }) => {
  const { settings, updateSettings, exportData, importData, clearAllData } = useHabitStore();
  const theme = getTheme(settings.theme);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showSubscriptionPlans, setShowSubscriptionPlans] = useState(route?.params?.showSubscriptionPlans || false);
  const { isProUser, canExportData } = useProFeatures();
  
  useEffect(() => {
    if (route?.params?.showSubscriptionPlans) {
      setShowSubscriptionPlans(true);
    }
  }, [route?.params?.showSubscriptionPlans]);
  
  const handleThemeToggle = () => {
    updateSettings({ theme: settings.theme === 'light' ? 'dark' : 'light' });
  };
  
  const handleNotificationToggle = () => {
    updateSettings({ notifications: !settings.notifications });
  };
  
  const handleFirstDayToggle = () => {
    updateSettings({ firstDayOfWeek: settings.firstDayOfWeek === 0 ? 1 : 0 });
  };
  
  const handleDefaultIconChange = (icon: string) => {
    updateSettings({ defaultHabitIcon: icon });
    setShowIconPicker(false);
  };
  
  const handleDefaultColorChange = (color: string) => {
    updateSettings({ defaultHabitColor: color });
    setShowColorPicker(false);
  };
  
  const handleExportData = async () => {
    if (!canExportData) {
      setShowSubscriptionPlans(true);
      return;
    }
    
    try {
      setIsExporting(true);
      const data = exportData();
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `habit-hero-backup-${timestamp}.json`;
      
      // Create file in document directory
      const fileUri = FileSystem.documentDirectory + filename;
      await FileSystem.writeAsStringAsync(fileUri, data);
      
      // Share the file
      await Share.share({
        url: fileUri,
        title: 'Export Habit Data',
      });
      
      showSuccessNotification(
        'Export Successful',
        'Your habit data has been exported successfully.'
      );
    } catch (error) {
      showErrorNotification('Export Failed', 'Failed to export data. Please try again.');
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };
  
  const handleImportData = async () => {
    try {
      setIsImporting(true);
      
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
        copyToCacheDirectory: false,
      });
      
      if (!result.canceled && result.assets[0]) {
        const content = await FileSystem.readAsStringAsync(result.assets[0].uri);
        
        Alert.alert(
          'Import Data',
          'This will replace all your current habit data. Are you sure you want to continue?',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Import',
              style: 'destructive',
              onPress: () => {
                try {
                  importData(content);
                  showSuccessNotification('Import Successful', 'Your habit data has been imported successfully.');
                } catch (error) {
                  showErrorNotification('Import Failed', 'The selected file is not valid or corrupted.');
                }
              },
            },
          ]
        );
      }
    } catch (error) {
      showErrorNotification('Import Failed', 'Failed to import data. Please try again.');
      console.error('Import error:', error);
    } finally {
      setIsImporting(false);
    }
  };
  
  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your habits and data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            clearAllData();
            showSuccessNotification('Data Cleared', 'All your data has been cleared.');
          },
        },
      ]
    );
  };

  const handleRestorePurchases = async () => {
    try {
      showNotification({
        title: 'Restoring Purchases',
        message: 'Please wait while we restore your purchases...',
        type: 'info',
      });

      // Initialize payment service if not already done
      const isInitialized = await paymentService.initialize();
      if (!isInitialized) {
        throw new Error('Payment service initialization failed');
      }

      // Restore purchases
      await paymentService.restorePurchases();
      
      showSuccessNotification(
        'Purchases Restored',
        'Your previous purchases have been restored successfully.'
      );
    } catch (error) {
      console.error('Restore purchases error:', error);
      showErrorNotification(
        'Restore Failed',
        'Unable to restore purchases. Please try again or contact support.'
      );
    }
  };
  
  const SettingRow = ({ 
    icon, 
    title, 
    subtitle, 
    rightComponent, 
    onPress, 
    showChevron = false 
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    rightComponent?: React.ReactNode;
    onPress?: () => void;
    showChevron?: boolean;
  }) => (
    <Pressable
      onPress={onPress}
      className="flex-row items-center px-6 py-4"
      style={{ backgroundColor: theme.cardBackground }}
    >
      <View 
        className="w-10 h-10 rounded-full items-center justify-center mr-4"
        style={{ backgroundColor: theme.surface }}
      >
        <Ionicons name={icon as any} size={20} color={theme.primary} />
      </View>
      
      <View className="flex-1">
        <Text 
          className="text-base font-medium"
          style={{ color: theme.text }}
        >
          {title}
        </Text>
        {subtitle && (
          <Text 
            className="text-sm mt-1"
            style={{ color: theme.textSecondary }}
          >
            {subtitle}
          </Text>
        )}
      </View>
      
      {rightComponent}
      
      {showChevron && (
        <Ionicons 
          name="chevron-forward" 
          size={20} 
          color={theme.textTertiary} 
        />
      )}
    </Pressable>
  );
  
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
            Settings
          </Text>
        </View>
        
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Subscription Status */}
          <View className="mb-6">
            <Text 
              className="text-sm font-medium px-6 py-2 uppercase tracking-wide"
              style={{ color: theme.textTertiary }}
            >
              Subscription
            </Text>
            
            <View 
              className="rounded-xl mx-6 overflow-hidden"
              style={{ backgroundColor: theme.cardBackground }}
            >
              <SettingRow
                icon={settings.subscriptionStatus === 'free' ? 'gift-outline' : 'diamond-outline'}
                title={settings.subscriptionStatus === 'free' ? 'Free Plan' : 'Pro Plan'}
                subtitle={
                  settings.subscriptionStatus === 'free'
                    ? 'Upgrade to unlock all features'
                    : settings.subscriptionStatus === 'monthly'
                    ? 'Monthly subscription active'
                    : 'Lifetime subscription active'
                }
                onPress={() => setShowSubscriptionPlans(true)}
                showChevron
                rightComponent={
                  settings.subscriptionStatus !== 'free' ? (
                    <View 
                      className="px-2 py-1 rounded-full mr-2"
                      style={{ backgroundColor: theme.success + '20' }}
                    >
                      <Text 
                        className="text-xs font-medium"
                        style={{ color: theme.success }}
                      >
                        PRO
                      </Text>
                    </View>
                  ) : undefined
                }
              />
              
              <SettingRow
                icon="refresh-outline"
                title="Restore Purchases"
                subtitle="Restore your previous purchases"
                onPress={handleRestorePurchases}
              />
            </View>
          </View>
          
          {/* Appearance */}
          <View className="mb-6">
            <Text 
              className="text-sm font-medium px-6 py-2 uppercase tracking-wide"
              style={{ color: theme.textTertiary }}
            >
              Appearance
            </Text>
            
            <View 
              className="rounded-xl mx-6"
              style={{ backgroundColor: theme.cardBackground }}
            >
              <SettingRow
                icon="moon-outline"
                title="Dark Mode"
                subtitle="Switch between light and dark themes"
                rightComponent={
                  <Switch
                    value={settings.theme === 'dark'}
                    onValueChange={handleThemeToggle}
                    trackColor={{ false: theme.border, true: theme.primary }}
                    thumbColor={settings.theme === 'dark' ? 'white' : theme.surface}
                  />
                }
              />
            </View>
          </View>
          
          {/* Notifications */}
          <View className="mb-6">
            <Text 
              className="text-sm font-medium px-6 py-2 uppercase tracking-wide"
              style={{ color: theme.textTertiary }}
            >
              Notifications
            </Text>
            
            <View 
              className="rounded-xl mx-6"
              style={{ backgroundColor: theme.cardBackground }}
            >
              <SettingRow
                icon="notifications-outline"
                title="Daily Reminders"
                subtitle="Get reminded to complete your habits"
                rightComponent={
                  <Switch
                    value={settings.notifications}
                    onValueChange={handleNotificationToggle}
                    trackColor={{ false: theme.border, true: theme.primary }}
                    thumbColor={settings.notifications ? 'white' : theme.surface}
                  />
                }
              />
            </View>
          </View>
          
          {/* Calendar */}
          <View className="mb-6">
            <Text 
              className="text-sm font-medium px-6 py-2 uppercase tracking-wide"
              style={{ color: theme.textTertiary }}
            >
              Calendar
            </Text>
            
            <View 
              className="rounded-xl mx-6"
              style={{ backgroundColor: theme.cardBackground }}
            >
              <SettingRow
                icon="calendar-outline"
                title="First Day of Week"
                subtitle={settings.firstDayOfWeek === 0 ? 'Sunday' : 'Monday'}
                rightComponent={
                  <Switch
                    value={settings.firstDayOfWeek === 1}
                    onValueChange={handleFirstDayToggle}
                    trackColor={{ false: theme.border, true: theme.primary }}
                    thumbColor={settings.firstDayOfWeek === 1 ? 'white' : theme.surface}
                  />
                }
              />
            </View>
          </View>
          
          {/* Default Habit Settings */}
          <View className="mb-6">
            <Text 
              className="text-sm font-medium px-6 py-2 uppercase tracking-wide"
              style={{ color: theme.textTertiary }}
            >
              Default Habit Settings
            </Text>
            
            <View 
              className="rounded-xl mx-6 overflow-hidden"
              style={{ backgroundColor: theme.cardBackground }}
            >
              <SettingRow
                icon="shapes-outline"
                title="Default Icon"
                subtitle="Icon used for new habits"
                onPress={() => setShowIconPicker(!showIconPicker)}
                showChevron
                rightComponent={
                  <View 
                    className="w-8 h-8 rounded-full items-center justify-center mr-2"
                    style={{ backgroundColor: theme.surface }}
                  >
                    <Ionicons 
                      name={settings.defaultHabitIcon as any} 
                      size={16} 
                      color={theme.primary} 
                    />
                  </View>
                }
              />
              
              {showIconPicker && (
                <View className="px-6 pb-4">
                  <View className="flex-row flex-wrap">
                    {HABIT_ICONS.map((icon) => (
                      <Pressable
                        key={icon}
                        onPress={() => handleDefaultIconChange(icon)}
                        className="w-10 h-10 rounded-xl items-center justify-center m-1"
                        style={{
                          backgroundColor: settings.defaultHabitIcon === icon 
                            ? theme.primary + '20' 
                            : theme.surface,
                          borderColor: settings.defaultHabitIcon === icon 
                            ? theme.primary 
                            : theme.border,
                          borderWidth: 1
                        }}
                      >
                        <Ionicons 
                          name={icon as any} 
                          size={18} 
                          color={settings.defaultHabitIcon === icon ? theme.primary : theme.textSecondary} 
                        />
                      </Pressable>
                    ))}
                  </View>
                </View>
              )}
              
              <View 
                className="ml-14 mr-6"
                style={{ height: 1, backgroundColor: theme.border }}
              />
              
              <SettingRow
                icon="color-palette-outline"
                title="Default Color"
                subtitle="Color used for new habits"
                onPress={() => setShowColorPicker(!showColorPicker)}
                showChevron
                rightComponent={
                  <View 
                    className="w-8 h-8 rounded-full mr-2"
                    style={{ backgroundColor: settings.defaultHabitColor }}
                  />
                }
              />
              
              {showColorPicker && (
                <View className="px-6 pb-4">
                  <ColorPicker
                    selectedColor={settings.defaultHabitColor}
                    onColorSelect={handleDefaultColorChange}
                    theme={theme}
                  />
                </View>
              )}
            </View>
          </View>
          
          {/* Data Management */}
          <View className="mb-6">
            <Text 
              className="text-sm font-medium px-6 py-2 uppercase tracking-wide"
              style={{ color: theme.textTertiary }}
            >
              Data Management
            </Text>
            
            <View 
              className="rounded-xl mx-6 overflow-hidden"
              style={{ backgroundColor: theme.cardBackground }}
            >
              <SettingRow
                icon="download-outline"
                title="Export Data"
                subtitle={canExportData ? "Save your habit data as a backup file" : "PRO feature - Export your data"}
                onPress={handleExportData}
                showChevron
                rightComponent={
                  isExporting ? (
                    <View className="mr-2">
                      <Text style={{ color: theme.textSecondary }}>Exporting...</Text>
                    </View>
                  ) : !canExportData ? (
                    <View 
                      className="px-2 py-1 rounded-full mr-2"
                      style={{ backgroundColor: '#FFD700' }}
                    >
                      <Text className="text-xs font-bold" style={{ color: '#000' }}>
                        PRO
                      </Text>
                    </View>
                  ) : undefined
                }
              />
              
              <View 
                className="ml-14 mr-6"
                style={{ height: 1, backgroundColor: theme.border }}
              />
              
              <SettingRow
                icon="cloud-upload-outline"
                title="Import Data"
                subtitle="Restore your habits from a backup file"
                onPress={handleImportData}
                showChevron
                rightComponent={
                  isImporting ? (
                    <View className="mr-2">
                      <Text style={{ color: theme.textSecondary }}>Importing...</Text>
                    </View>
                  ) : undefined
                }
              />
              
              <View 
                className="ml-14 mr-6"
                style={{ height: 1, backgroundColor: theme.border }}
              />
              
              <SettingRow
                icon="trash-outline"
                title="Clear All Data"
                subtitle="Permanently delete all habits and data"
                onPress={handleClearData}
                showChevron
              />
            </View>
          </View>
          
          {/* Privacy */}
          <View className="mb-6">
            <Text 
              className="text-sm font-medium px-6 py-2 uppercase tracking-wide"
              style={{ color: theme.textTertiary }}
            >
              Privacy
            </Text>
            
            <View 
              className="rounded-xl mx-6 p-4"
              style={{ backgroundColor: theme.cardBackground }}
            >
              <View className="flex-row items-start">
                <View 
                  className="w-10 h-10 rounded-full items-center justify-center mr-4"
                  style={{ backgroundColor: theme.success + '20' }}
                >
                  <Ionicons name="shield-checkmark" size={20} color={theme.success} />
                </View>
                
                <View className="flex-1">
                  <Text 
                    className="text-base font-medium mb-2"
                    style={{ color: theme.text }}
                  >
                    Privacy First
                  </Text>
                  <Text 
                    className="text-sm leading-5"
                    style={{ color: theme.textSecondary }}
                  >
                    All your habit data is stored locally on your device. We don't collect or store any personal information. Your privacy is our priority.
                  </Text>
                </View>
              </View>
            </View>
          </View>
          
          {/* Legal */}
          <View className="mb-6">
            <Text 
              className="text-sm font-medium px-6 py-2 uppercase tracking-wide"
              style={{ color: theme.textTertiary }}
            >
              Legal
            </Text>
            
            <View 
              className="rounded-xl mx-6 overflow-hidden"
              style={{ backgroundColor: theme.cardBackground }}
            >
              <SettingRow
                icon="document-text-outline"
                title="Privacy Policy"
                subtitle="How we handle your data"
                onPress={() => navigation.navigate('PrivacyPolicy')}
                showChevron
              />
              
              <View 
                className="ml-14 mr-6"
                style={{ height: 1, backgroundColor: theme.border }}
              />
              
              <SettingRow
                icon="contract-outline"
                title="Terms of Use"
                subtitle="Agreement for using this app"
                onPress={() => navigation.navigate('TermsOfUse')}
                showChevron
              />
            </View>
          </View>
          
          {/* Notifications Demo */}
          <View className="mb-6">
            <Text 
              className="text-sm font-medium px-6 py-2 uppercase tracking-wide"
              style={{ color: theme.textTertiary }}
            >
              Notification Demo
            </Text>
            
            <View 
              className="rounded-xl mx-6 overflow-hidden"
              style={{ backgroundColor: theme.cardBackground }}
            >
              <SettingRow
                icon="checkmark-circle-outline"
                title="Success Notification"
                subtitle="Show success banner"
                onPress={() => showSuccessNotification('Success!', 'This is a success notification with grid tile styling.')}
                showChevron
              />
              
              <View 
                className="ml-14 mr-6"
                style={{ height: 1, backgroundColor: theme.border }}
              />
              
              <SettingRow
                icon="trophy-outline"
                title="Habit Notification"
                subtitle="Show habit completion banner"
                onPress={() => showHabitNotification('Streak Master!', 'You completed Exercise! 🔥 7-day streak achieved!', '#34C759')}
                showChevron
              />
              
              <View 
                className="ml-14 mr-6"
                style={{ height: 1, backgroundColor: theme.border }}
              />
              
              <SettingRow
                icon="warning-outline"
                title="Warning Notification"
                subtitle="Show warning banner"
                onPress={() => showWarningNotification('Warning', 'This is a warning notification with action button.', { label: 'Action', onPress: () => console.log('Action pressed') })}
                showChevron
              />
              
              <View 
                className="ml-14 mr-6"
                style={{ height: 1, backgroundColor: theme.border }}
              />
              
              <SettingRow
                icon="close-circle-outline"
                title="Error Notification"
                subtitle="Show error banner"
                onPress={() => showErrorNotification('Error!', 'This is an error notification demonstrating the banner system.')}
                showChevron
              />
            </View>
          </View>
          
          {/* About */}
          <View className="mb-6">
            <Text 
              className="text-sm font-medium px-6 py-2 uppercase tracking-wide"
              style={{ color: theme.textTertiary }}
            >
              About
            </Text>
            
            <View 
              className="rounded-xl mx-6 p-4"
              style={{ backgroundColor: theme.cardBackground }}
            >
              <Text 
                className="text-center font-medium mb-1"
                style={{ color: theme.text }}
              >
                Habit Hero
              </Text>
              <Text 
                className="text-center text-sm"
                style={{ color: theme.textSecondary }}
              >
                Version 1.0.0
              </Text>
            </View>
          </View>
          
          {/* Debug Section - Remove before production */}
          {__DEV__ && (
            <View className="mb-6">
              <Text 
                className="text-sm font-medium px-6 py-2 uppercase tracking-wide"
                style={{ color: theme.textTertiary }}
              >
                Debug Tools
              </Text>
              
              <View 
                className="rounded-xl mx-6 overflow-hidden"
                style={{ backgroundColor: theme.cardBackground }}
              >
                <Pressable
                  onPress={unlockProForScreenshots}
                  className="py-4 px-6 flex-row items-center"
                >
                  <View 
                    className="w-10 h-10 rounded-full items-center justify-center mr-4"
                    style={{ backgroundColor: theme.primary + '20' }}
                  >
                    <Ionicons name="diamond" size={20} color={theme.primary} />
                  </View>
                  <View className="flex-1">
                    <Text 
                      className="text-base font-medium"
                      style={{ color: theme.text }}
                    >
                      Unlock Pro for Screenshots
                    </Text>
                    <Text 
                      className="text-sm"
                      style={{ color: theme.textSecondary }}
                    >
                      Temporarily enable all pro features
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={theme.textTertiary} />
                </Pressable>
              </View>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
      
      {/* Subscription Plans Modal */}
      <Modal
        visible={showSubscriptionPlans}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSubscriptionPlans(false)}
      >
        <View className="flex-1 items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View 
            className="mx-4 p-6 rounded-2xl max-h-[85%]"
            style={{ backgroundColor: theme.background }}
          >
            <View className="items-center mb-6">
              <View 
                className="w-16 h-16 rounded-full items-center justify-center mb-3"
                style={{ backgroundColor: '#FFD700' }}
              >
                <Text className="text-xl font-bold" style={{ color: '#000' }}>
                  PRO
                </Text>
              </View>
              <Text className="text-2xl font-bold text-center" style={{ color: theme.text }}>
                Choose Your Plan
              </Text>
              <Text className="text-sm text-center mt-2" style={{ color: theme.textSecondary }}>
                Unlock premium features and advanced analytics
              </Text>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Free Plan */}
              <Pressable
                onPress={() => {
                  setShowSubscriptionPlans(false);
                  updateSettings({ subscriptionStatus: 'free' });
                  showSuccessNotification('Free Plan Active!', 'Continue enjoying core features.');
                }}
                className="p-4 rounded-xl mb-3"
                style={{ 
                  backgroundColor: theme.surface,
                  borderWidth: 2,
                  borderColor: theme.border
                }}
              >
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-lg font-bold" style={{ color: theme.text }}>
                    Free Plan
                  </Text>
                  <View 
                    className="px-2 py-1 rounded"
                    style={{ backgroundColor: theme.textSecondary + '20' }}
                  >
                    <Text className="text-xs font-medium" style={{ color: theme.textSecondary }}>
                      CURRENT
                    </Text>
                  </View>
                </View>
                <Text className="text-2xl font-bold mb-1" style={{ color: theme.text }}>
                  $0<Text className="text-sm font-normal" style={{ color: theme.textSecondary }}>/forever</Text>
                </Text>
                <View className="mt-2">
                  <Text className="text-sm mb-1" style={{ color: theme.text }}>• Up to 5 habits</Text>
                  <Text className="text-sm mb-1" style={{ color: theme.text }}>• Basic progress tracking</Text>
                  <Text className="text-sm" style={{ color: theme.text }}>• Core features included</Text>
                </View>
              </Pressable>
              
              {/* Monthly Plan */}
              <Pressable
                onPress={() => {
                  setShowSubscriptionPlans(false);
                  updateSettings({ subscriptionStatus: 'monthly' });
                  showSuccessNotification('Subscription Active!', 'Welcome to PRO! All features unlocked.');
                }}
                className="p-4 rounded-xl mb-3 border-2"
                style={{ 
                  backgroundColor: theme.surface,
                  borderColor: theme.primary
                }}
              >
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-lg font-bold" style={{ color: theme.text }}>
                    Monthly PRO
                  </Text>
                  <View 
                    className="px-2 py-1 rounded"
                    style={{ backgroundColor: theme.primary + '20' }}
                  >
                    <Text className="text-xs font-medium" style={{ color: theme.primary }}>
                      POPULAR
                    </Text>
                  </View>
                </View>
                <Text className="text-2xl font-bold mb-3" style={{ color: theme.text }}>
                  $1.99<Text className="text-sm font-normal" style={{ color: theme.textSecondary }}>/month</Text>
                </Text>
                
                <View className="mb-2">
                  <Text className="text-sm font-medium mb-2" style={{ color: theme.text }}>
                    ✨ What you get:
                  </Text>
                  <Text className="text-sm mb-1" style={{ color: theme.text }}>
                    • Unlimited habits (vs 5 free)
                  </Text>
                  <Text className="text-sm mb-1" style={{ color: theme.text }}>
                    • Detailed analytics & progress insights
                  </Text>
                  <Text className="text-sm mb-1" style={{ color: theme.text }}>
                    • Data export & backup functionality
                  </Text>
                  <Text className="text-sm mb-1" style={{ color: theme.text }}>
                    • Priority customer support
                  </Text>
                  <Text className="text-sm mb-3" style={{ color: theme.text }}>
                    • All future premium features
                  </Text>
                </View>
                
                <Text className="text-xs" style={{ color: theme.textSecondary }}>
                  Cancel anytime • No commitment required
                </Text>
              </Pressable>
              
              {/* Yearly Plan */}
              <Pressable
                onPress={() => {
                  setShowSubscriptionPlans(false);
                  updateSettings({ subscriptionStatus: 'yearly' });
                  showSuccessNotification('Subscription Active!', 'Welcome to PRO! 50% savings unlocked.');
                }}
                className="p-4 rounded-xl mb-3 border-2"
                style={{ 
                  backgroundColor: '#FFD700' + '10',
                  borderColor: '#FFD700'
                }}
              >
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-lg font-bold" style={{ color: theme.text }}>
                    Yearly PRO
                  </Text>
                  <View 
                    className="px-2 py-1 rounded"
                    style={{ backgroundColor: '#FFD700' }}
                  >
                    <Text className="text-xs font-bold" style={{ color: '#000' }}>
                      SAVE 50%
                    </Text>
                  </View>
                </View>
                <Text className="text-2xl font-bold mb-1" style={{ color: theme.text }}>
                  $9.99<Text className="text-sm font-normal" style={{ color: theme.textSecondary }}>/year</Text>
                </Text>
                <Text className="text-sm font-medium mb-3" style={{ color: '#B8860B' }}>
                  Just $0.83/month • Save $14/year vs monthly
                </Text>
                
                <View className="mb-2">
                  <Text className="text-sm font-medium mb-2" style={{ color: theme.text }}>
                    🏆 Everything in Monthly PRO, plus:
                  </Text>
                  <Text className="text-sm mb-1" style={{ color: theme.text }}>
                    • 50% savings over monthly billing
                  </Text>
                  <Text className="text-sm mb-1" style={{ color: theme.text }}>
                    • Locked-in pricing (no price increases)
                  </Text>
                  <Text className="text-sm mb-1" style={{ color: theme.text }}>
                    • Priority feature requests & feedback
                  </Text>
                  <Text className="text-sm mb-1" style={{ color: theme.text }}>
                    • Early access to beta features
                  </Text>
                  <Text className="text-sm mb-3" style={{ color: theme.text }}>
                    • Yearly habit achievement rewards
                  </Text>
                </View>
                
                <Text className="text-xs" style={{ color: theme.textSecondary }}>
                  Best value • Pay once per year • Full refund within 30 days
                </Text>
              </Pressable>
              
              {/* Lifetime Plan */}
              <Pressable
                onPress={() => {
                  setShowSubscriptionPlans(false);
                  updateSettings({ subscriptionStatus: 'lifetime' });
                  showSuccessNotification('Lifetime PRO Activated!', 'You now own PRO forever! 🎉');
                }}
                className="p-4 rounded-xl mb-4"
                style={{ 
                  backgroundColor: '#27ae60' + '08',
                  borderWidth: 2,
                  borderColor: '#27ae60'
                }}
              >
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-lg font-bold" style={{ color: theme.text }}>
                    Lifetime PRO
                  </Text>
                  <View 
                    className="px-2 py-1 rounded"
                    style={{ backgroundColor: '#27ae60' }}
                  >
                    <Text className="text-xs font-bold" style={{ color: '#fff' }}>
                      BEST DEAL
                    </Text>
                  </View>
                </View>
                <Text className="text-2xl font-bold mb-1" style={{ color: theme.text }}>
                  $19.99<Text className="text-sm font-normal" style={{ color: theme.textSecondary }}> once</Text>
                </Text>
                <Text className="text-sm font-medium mb-3" style={{ color: '#27ae60' }}>
                  Pay once, own forever • Pays for itself in 10 months
                </Text>
                
                <View className="mb-2">
                  <Text className="text-sm font-medium mb-2" style={{ color: theme.text }}>
                    💎 Everything in Yearly PRO, plus:
                  </Text>
                  <Text className="text-sm mb-1" style={{ color: theme.text }}>
                    • Never pay again - lifetime access
                  </Text>
                  <Text className="text-sm mb-1" style={{ color: theme.text }}>
                    • VIP customer status & support
                  </Text>
                  <Text className="text-sm mb-1" style={{ color: theme.text }}>
                    • Exclusive lifetime member features
                  </Text>
                  <Text className="text-sm mb-1" style={{ color: theme.text }}>
                    • First access to all future updates
                  </Text>
                  <Text className="text-sm mb-1" style={{ color: theme.text }}>
                    • Transferable to family members
                  </Text>
                  <Text className="text-sm mb-3" style={{ color: theme.text }}>
                    • Special lifetime achievement badges
                  </Text>
                </View>
                
                <Text className="text-xs" style={{ color: theme.textSecondary }}>
                  Ultimate value • No recurring charges • Lifetime guarantee
                </Text>
              </Pressable>
            </ScrollView>
            
            <Pressable
              onPress={() => setShowSubscriptionPlans(false)}
              className="py-3 rounded-full mt-4"
              style={{ backgroundColor: theme.surface }}
            >
              <Text className="text-center font-medium" style={{ color: theme.text }}>
                Maybe Later
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SettingsScreen;