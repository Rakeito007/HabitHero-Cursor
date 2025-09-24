import { Platform, Alert } from 'react-native';
import { useHabitStore } from '../state/habitStore';
import { backendService, ReceiptValidationResponse } from './backendService';

// Conditional import for IAP - only available in production builds
let InAppPurchases: any = null;

try {
  if (!__DEV__) {
    InAppPurchases = require('expo-in-app-purchases');
  }
} catch (error) {
  console.log('IAP not available in development mode');
}

// Mock IAP for development/Expo Go with simulation
const MockIAP = {
  connectAsync: () => Promise.resolve(),
  disconnectAsync: () => Promise.resolve(),
  getProductsAsync: () => Promise.resolve([
    {
      productId: 'com.vibecode.habithero.monthly',
      title: 'Pro Monthly',
      description: 'Monthly subscription to Habit Hero Pro',
      price: '$1.99',
      priceString: '$1.99',
      currencyCode: 'USD',
    },
    {
      productId: 'com.vibecode.habithero.lifetime',
      title: 'Pro Lifetime',
      description: 'Lifetime subscription to Habit Hero Pro',
      price: '$25.00',
      priceString: '$25.00',
      currencyCode: 'USD',
    }
  ]),
  purchaseItemAsync: (productId: string) => {
    // Simulate purchase with a delay
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate successful purchase
        resolve({ 
          responseCode: 0, 
          results: [{
            productId,
            transactionId: `mock_${Date.now()}`,
            originalTransactionId: `mock_${Date.now()}`,
            purchaseTime: Date.now(),
            purchaseState: 1, // Purchased
          }]
        });
      }, 2000);
    });
  },
  getPurchaseHistoryAsync: () => Promise.resolve([]),
  setPurchaseListener: () => {},
  setPurchaseHistoryListener: () => {},
  IAPResponseCode: {
    OK: 0,
    USER_CANCELED: 1,
    PAYMENT_INVALID: 2,
    PAYMENT_NOT_ALLOWED: 3,
    ITEM_UNAVAILABLE: 4,
    CLOUD_SERVICE_PERMISSION_DENIED: 5,
    CLOUD_SERVICE_NETWORK_CONNECTION_FAILED: 6,
    CLOUD_SERVICE_REVOKED: 7,
  }
};

// Use real IAP in production builds, mock only in Expo Go
const IAP = InAppPurchases || MockIAP;
const isSimulationMode = __DEV__ && !InAppPurchases;

// Product IDs for App Store Connect
const PRODUCT_IDS = {
  MONTHLY_SUBSCRIPTION: 'com.vibecode.habithero.monthly',
  LIFETIME_PURCHASE: 'com.vibecode.habithero.lifetime',
};

// Subscription status from Apple
export interface AppleSubscriptionStatus {
  isActive: boolean;
  productId: string;
  originalTransactionId: string;
  expiresDate?: Date;
  autoRenewStatus: boolean;
  isTrialPeriod: boolean;
  isInIntroOfferPeriod: boolean;
}

// Payment service class
export class PaymentService {
  private static instance: PaymentService;
  private isInitialized = false;
  private purchaseHistory: any[] = [];

  static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  // Initialize the payment service
  async initialize(): Promise<boolean> {
    try {
      if (this.isInitialized) return true;

      // Production mode - backend integration is ready
      if (!isSimulationMode) {
        console.log('✅ Production mode: Backend receipt validation enabled');
        console.log('✅ Production mode: Secure subscription management active');
      }

      // Connect to the store
      await IAP.connectAsync();
      
      // Set up purchase listener
      IAP.setPurchaseListener(this.handlePurchaseUpdate.bind(this));
      
      // Set up purchase history listener
      IAP.setPurchaseHistoryListener(this.handlePurchaseHistoryUpdate.bind(this));
      
      this.isInitialized = true;
      console.log('✅ Payment service initialized');
      return true;
    } catch (error) {
      console.error('❌ Payment service initialization failed:', error);
      return false;
    }
  }

  // Get available products
  async getProducts(): Promise<any[]> {
    try {
      const products = await IAP.getProductsAsync(Object.values(PRODUCT_IDS));
      return products;
    } catch (error) {
      console.error('❌ Failed to get products:', error);
      throw error;
    }
  }

  // Purchase a product
  async purchaseProduct(productId: string): Promise<any> {
    try {
      console.log(`🛒 Attempting to purchase: ${productId}`);
      
      // In development mode, simulate purchase
      if (isSimulationMode) {
        console.log('🔧 SIMULATION MODE: Simulating Apple Store purchase');
        console.log('📱 In production, this would show the real Apple Store purchase dialog');
        
        // Show simulation alert with proper paywall
        return new Promise((resolve, reject) => {
          Alert.alert(
            '💳 Purchase Required',
            `This is a simulated purchase for testing.\n\nProduct: ${productId}\nPrice: ${productId.includes('monthly') ? '$1.99/month' : '$25.00 one-time'}\n\nIn production, you would see the real Apple Store purchase dialog.`,
            [
              { 
                text: 'Cancel', 
                style: 'cancel',
                onPress: () => {
                  const cancelResult = {
                    responseCode: IAP.IAPResponseCode.USER_CANCELED,
                    results: []
                  };
                  resolve(cancelResult);
                }
              },
              { 
                text: 'Purchase', 
                style: 'default',
                onPress: async () => {
                  // Simulate purchase processing
                  setTimeout(async () => {
                    const mockResult = {
                      responseCode: IAP.IAPResponseCode.OK,
                      results: [{
                        responseCode: IAP.IAPResponseCode.OK,
                        productId,
                        purchaseTime: new Date().toISOString(),
                        transactionId: `mock_${Date.now()}`,
                        originalTransactionId: `mock_original_${Date.now()}`,
                      }]
                    };
                    
                    await this.handleSuccessfulPurchase(mockResult);
                    resolve(mockResult);
                  }, 2000);
                }
              }
            ]
          );
        });
      }
      
      const result = await IAP.purchaseItemAsync(productId);
      
      if (result.responseCode === IAP.IAPResponseCode.OK) {
        console.log('✅ Purchase successful');
        await this.handleSuccessfulPurchase(result);
      } else {
        console.log('❌ Purchase failed:', result.responseCode);
        this.handleFailedPurchase(result);
      }
      
      return result;
    } catch (error) {
      console.error('❌ Purchase error:', error);
      throw error;
    }
  }

  // Restore purchases
  async restorePurchases(): Promise<void> {
    try {
      console.log('🔄 Restoring purchases...');
      
      // In development mode, simulate restore
      if (isSimulationMode) {
        console.log('🔧 SIMULATION MODE: Simulating restore purchases');
        console.log('📱 In production, this would query Apple Store for previous purchases');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockPurchase = {
          responseCode: IAP.IAPResponseCode.OK,
          productId: PRODUCT_IDS.MONTHLY_SUBSCRIPTION,
          purchaseTime: new Date(Date.now() - 86400000).toISOString(),
          transactionId: `mock_restore_${Date.now()}`,
          originalTransactionId: `mock_original_restore_${Date.now()}`,
        };
        
        await this.handleSuccessfulPurchase({
          responseCode: IAP.IAPResponseCode.OK,
          results: [mockPurchase]
        });
        
        console.log('✅ Mock restore successful');
        return;
      }
      
      await IAP.getPurchaseHistoryAsync();
    } catch (error) {
      console.error('❌ Restore purchases failed:', error);
      throw error;
    }
  }

  // Handle purchase updates
  private async handlePurchaseUpdate(purchase: any): Promise<void> {
    console.log('📱 Purchase update received:', purchase);
    
    if (purchase.responseCode === IAP.IAPResponseCode.OK) {
      await this.handleSuccessfulPurchase({ responseCode: purchase.responseCode, results: [purchase] });
    } else {
      this.handleFailedPurchase({ responseCode: purchase.responseCode, results: [purchase] });
    }
  }

  // Handle purchase history updates
  private async handlePurchaseHistoryUpdate(purchaseHistory: any[]): Promise<void> {
    console.log('📜 Purchase history updated:', purchaseHistory.length, 'purchases');
    this.purchaseHistory = purchaseHistory;
    
    // Process purchase history to determine current subscription status
    await this.processPurchaseHistory(purchaseHistory);
  }

  // Handle successful purchase
  private async handleSuccessfulPurchase(result: any): Promise<void> {
    const purchase = result.results?.[0];
    if (!purchase) return;

    try {
      // SECURE: Verify purchase with backend
      console.log('🔐 Verifying purchase with backend...');
      const validation = await backendService.validateReceipt(
        purchase.receiptData || 'mock_receipt',
        purchase.productId,
        purchase.transactionId
      );

      if (!validation.isValid) {
        throw new Error(`Receipt validation failed: ${validation.error || 'Invalid receipt'}`);
      }

      // Update subscription status
      const { updateSubscription } = useHabitStore.getState();
      let subscriptionStatus: 'monthly' | 'lifetime' = 'monthly';
      
      if (purchase.productId === PRODUCT_IDS.LIFETIME_PURCHASE) {
        subscriptionStatus = 'lifetime';
      } else if (purchase.productId === PRODUCT_IDS.MONTHLY_SUBSCRIPTION) {
        subscriptionStatus = 'monthly';
      }
      
      // SECURE: Update subscription on backend
      const backendUpdated = await backendService.updateSubscriptionStatus({
        productId: purchase.productId,
        transactionId: purchase.transactionId,
        expiresDate: validation.expiresDate ? new Date(validation.expiresDate) : undefined,
        isActive: validation.subscriptionStatus === 'active'
      });

      if (!backendUpdated) {
        console.warn('⚠️ Failed to update backend, but purchase is valid');
      }
      
      // Update local subscription status
      updateSubscription(subscriptionStatus);
      
      // Store purchase in history
      this.purchaseHistory.push(purchase);
      
      // Show success message
      this.showSuccessMessage(purchase);
      
      console.log('✅ Purchase processed and validated successfully');
    } catch (error) {
      console.error('❌ Error handling successful purchase:', error);
      this.showError('Failed to process purchase');
    }
  }

  // Handle failed purchase
  private handleFailedPurchase(result: any): void {
    const purchase = result.results?.[0];
    if (!purchase) return;

    let errorMessage = 'Purchase failed';
    
    switch (result.responseCode) {
      case IAP.IAPResponseCode.USER_CANCELED:
        errorMessage = 'Purchase canceled';
        break;
      case IAP.IAPResponseCode.PAYMENT_INVALID:
        errorMessage = 'Payment invalid';
        break;
      case IAP.IAPResponseCode.PAYMENT_NOT_ALLOWED:
        errorMessage = 'Payment not allowed';
        break;
      case IAP.IAPResponseCode.ITEM_UNAVAILABLE:
        errorMessage = 'Item unavailable';
        break;
      case IAP.IAPResponseCode.CLOUD_SERVICE_PERMISSION_DENIED:
        errorMessage = 'Cloud service permission denied';
        break;
      case IAP.IAPResponseCode.CLOUD_SERVICE_NETWORK_CONNECTION_FAILED:
        errorMessage = 'Network connection failed';
        break;
      case IAP.IAPResponseCode.CLOUD_SERVICE_REVOKED:
        errorMessage = 'Cloud service revoked';
        break;
    }

    this.showError(errorMessage);
  }


  // Process purchase history to determine current subscription status
  private async processPurchaseHistory(purchases: any[]): Promise<void> {
    try {
      // Find the most recent valid subscription
      const validSubscriptions = purchases.filter(p => 
        p.responseCode === IAP.IAPResponseCode.OK &&
        Object.values(PRODUCT_IDS).includes(p.productId)
      );

      if (validSubscriptions.length === 0) {
        // No valid subscriptions found, set to free
        const { updateSubscription } = useHabitStore.getState();
        updateSubscription('free');
        return;
      }

      // Sort by purchase date (most recent first)
      validSubscriptions.sort((a, b) => 
        new Date(b.purchaseTime).getTime() - new Date(a.purchaseTime).getTime()
      );

      const latestPurchase = validSubscriptions[0];
      await this.updateLocalSubscriptionStatus(latestPurchase);
      
    } catch (error) {
      console.error('❌ Failed to process purchase history:', error);
    }
  }

  // Show success message
  private showSuccessMessage(purchase: any): void {
    const isLifetime = purchase.productId === PRODUCT_IDS.LIFETIME_PURCHASE;
    const message = isLifetime 
      ? 'Welcome to Habit Hero Pro Lifetime! You now have access to all premium features forever.'
      : 'Welcome to Habit Hero Pro! Your monthly subscription is now active.';
    
    Alert.alert('Subscription Successful!', message, [{ text: 'Get Started' }]);
  }

  // Show error message
  private showError(message: string): void {
    Alert.alert('Purchase Error', message, [{ text: 'OK' }]);
  }

  // Get current subscription status
  async getCurrentSubscriptionStatus(): Promise<AppleSubscriptionStatus | null> {
    try {
      // This would typically call your backend to get the current status
      // For now, return the local status
      const { settings } = useHabitStore.getState();
      
      return {
        isActive: settings.subscriptionStatus !== 'free',
        productId: settings.subscriptionStatus === 'lifetime' 
          ? PRODUCT_IDS.LIFETIME_PURCHASE 
          : PRODUCT_IDS.MONTHLY_SUBSCRIPTION,
        originalTransactionId: 'local', // This should come from backend
        autoRenewStatus: settings.subscriptionStatus === 'monthly',
        isTrialPeriod: false,
        isInIntroOfferPeriod: false,
      };
    } catch (error) {
      console.error('❌ Failed to get subscription status:', error);
      return null;
    }
  }

  // Disconnect from the store
  async disconnect(): Promise<void> {
    try {
      await IAP.disconnectAsync();
      this.isInitialized = false;
      console.log('✅ Payment service disconnected');
    } catch (error) {
      console.error('❌ Failed to disconnect payment service:', error);
    }
  }
}

// Export singleton instance
export const paymentService = PaymentService.getInstance();
