import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useHabitStore } from '../state/habitStore';
import { getTheme } from '../utils/theme';
import { SubscriptionStatus } from '../types/habit';
import { initializeSampleData } from '../utils/sampleData';
import { paymentService } from '../services/paymentService';

interface OnboardingScreenProps {
  navigation: any;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigation }) => {
  const { settings, updateSubscription, completeOnboarding } = useHabitStore();
  const theme = getTheme(settings.theme);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionStatus>('free');
  const [isProcessing, setIsProcessing] = useState(false);

  const subscriptionPlans = [
    {
      id: 'free' as SubscriptionStatus,
      title: 'Free',
      price: '$0',
      period: '',
      features: [
        'Track up to 3 habits',
        'Basic progress charts',
        'Local data storage',
        'Light & dark themes'
      ],
      popular: false,
      color: theme.textSecondary,
    },
    {
      id: 'monthly' as SubscriptionStatus,
      title: 'Pro Monthly',
      price: '$1.99',
      period: '/month',
      features: [
        'Unlimited habits',
        'Advanced analytics',
        'Data export & import',
        'Premium customization',
        'Priority support'
      ],
      popular: false,
      color: theme.primary,
    },
    {
      id: 'lifetime' as SubscriptionStatus,
      title: 'Pro Lifetime',
      price: '$25.00',
      period: 'one-time',
      features: [
        'All Pro features forever',
        'No recurring payments',
        'Future updates included',
        'Premium support',
        'Best value!'
      ],
      popular: true,
      color: theme.success,
    },
  ];

  const handleSubscribe = async (planId: SubscriptionStatus) => {
    if (planId === 'free') {
      completeOnboarding();
      
      // Add sample data for free users
      setTimeout(() => {
        initializeSampleData();
      }, 100);
      
      navigation.replace('Main');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Initialize payment service if not already done
      const isInitialized = await paymentService.initialize();
      if (!isInitialized) {
        throw new Error('Payment service initialization failed');
      }

      // Map plan ID to product ID
      const productId = planId === 'monthly' 
        ? 'com.vibecode.habithero.monthly'
        : 'com.vibecode.habithero.lifetime';

      // Attempt to purchase the product
      const result = await paymentService.purchaseProduct(productId);
      
      if (result.responseCode === 0) { // IAPResponseCode.OK
        // Purchase successful - the payment service will handle the rest
        completeOnboarding();
        
        // Add sample data after subscription and onboarding completion
        setTimeout(() => {
          initializeSampleData();
        }, 100);
        
        // Navigate to main screen
        navigation.replace('Main');
      } else {
        // Purchase failed - show error message
        throw new Error('Purchase failed');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      Alert.alert(
        'Subscription Failed',
        'There was an issue processing your subscription. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const PlanCard = ({ plan, isSelected, onSelect }: any) => (
    <Pressable
      onPress={() => {
        setSelectedPlan(plan.id);
        onSelect(plan.id);
      }}
      className={`rounded-2xl p-6 mb-4 border-2 ${plan.popular ? 'relative' : ''}`}
      style={{
        backgroundColor: isSelected ? plan.color + '10' : theme.cardBackground,
        borderColor: isSelected ? plan.color : theme.border,
      }}
    >
      {plan.popular && (
        <View 
          className="absolute -top-3 left-4 px-3 py-1 rounded-full"
          style={{ backgroundColor: plan.color }}
        >
          <Text className="text-white text-xs font-bold">MOST POPULAR</Text>
        </View>
      )}
      
      <View className="items-center mb-4">
        <Text 
          className="text-xl font-bold mb-1"
          style={{ color: theme.text }}
        >
          {plan.title}
        </Text>
        <View className="flex-row items-baseline">
          <Text 
            className="text-3xl font-bold"
            style={{ color: plan.color }}
          >
            {plan.price}
          </Text>
          {plan.period && (
            <Text 
              className="text-base ml-1"
              style={{ color: theme.textSecondary }}
            >
              {plan.period}
            </Text>
          )}
        </View>
      </View>
      
      <View className="space-y-3">
        {plan.features.map((feature: string, index: number) => (
          <View key={index} className="flex-row items-center">
            <Ionicons 
              name="checkmark-circle" 
              size={20} 
              color={plan.color} 
              style={{ marginRight: 12 }}
            />
            <Text 
              className="text-base flex-1"
              style={{ color: theme.text }}
            >
              {feature}
            </Text>
          </View>
        ))}
      </View>
      
      {isSelected && (
        <View className="mt-4 pt-4" style={{ borderTopColor: theme.border, borderTopWidth: 1 }}>
          <View className="flex-row items-center justify-center">
            <Ionicons name="checkmark-circle" size={20} color={plan.color} />
            <Text 
              className="text-base font-medium ml-2"
              style={{ color: plan.color }}
            >
              Selected
            </Text>
          </View>
        </View>
      )}
    </Pressable>
  );

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background }}>
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="px-6 py-4">
          <View className="items-center mb-2">
            <View 
              className="w-16 h-16 rounded-full items-center justify-center mb-4"
              style={{ backgroundColor: theme.primary + '20' }}
            >
              <Ionicons name="trophy" size={32} color={theme.primary} />
            </View>
            <Text 
              className="text-3xl font-bold text-center"
              style={{ color: theme.text }}
            >
              Welcome to Habit Hero!
            </Text>
            <Text 
              className="text-lg text-center mt-2"
              style={{ color: theme.textSecondary }}
            >
              Choose your plan to start building better habits
            </Text>
          </View>
        </View>
        
        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
          {subscriptionPlans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isSelected={selectedPlan === plan.id}
              onSelect={setSelectedPlan}
            />
          ))}
          
          {/* Continue Button */}
          <Pressable
            onPress={() => handleSubscribe(selectedPlan)}
            disabled={isProcessing}
            className="mt-4 mb-6 py-4 px-6 rounded-2xl items-center"
            style={{ 
              backgroundColor: isProcessing ? theme.textTertiary : theme.primary,
              opacity: isProcessing ? 0.6 : 1
            }}
          >
            {isProcessing ? (
              <Text className="text-white font-bold text-lg">Processing...</Text>
            ) : (
              <Text className="text-white font-bold text-lg">
                {selectedPlan === 'free' ? 'Continue with Free' : `Subscribe ${selectedPlan === 'monthly' ? 'Monthly' : 'Lifetime'}`}
              </Text>
            )}
          </Pressable>
          
          {/* Terms */}
          <View className="items-center mb-8">
            <Text 
              className="text-xs text-center leading-4"
              style={{ color: theme.textTertiary }}
            >
              By continuing, you agree to our Terms of Use and Privacy Policy.{'\n'}
              Subscriptions auto-renew unless cancelled 24 hours before renewal.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default OnboardingScreen;