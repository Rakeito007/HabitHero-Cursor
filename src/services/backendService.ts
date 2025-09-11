// Backend service for Apple Store Server API integration
// This handles receipt validation, webhook processing, and subscription management

export interface AppleReceiptData {
  receiptData: string;
  password?: string; // App-specific shared secret
}

export interface AppleSubscriptionInfo {
  originalTransactionId: string;
  productId: string;
  subscriptionStatus: 'active' | 'expired' | 'cancelled' | 'billing_retry' | 'billing_grace_period';
  expiresDate: Date;
  autoRenewStatus: boolean;
  isTrialPeriod: boolean;
  isInIntroOfferPeriod: boolean;
  environment: 'Sandbox' | 'Production';
}

export interface WebhookNotification {
  notificationType: string;
  subtype?: string;
  notificationUUID: string;
  data: {
    appAppleId: number;
    bundleId: string;
    bundleVersion: string;
    environment: string;
    signedTransactionInfo: string;
    signedRenewalInfo: string;
  };
  version: string;
  signedDate: number;
}

export class BackendService {
  private static instance: BackendService;
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    // In production, these should come from environment variables
    this.baseUrl = process.env.EXPO_PUBLIC_BACKEND_URL || 'https://api.vibecodeapp.com';
    this.apiKey = process.env.EXPO_PUBLIC_API_KEY || '';
  }

  static getInstance(): BackendService {
    if (!BackendService.instance) {
      BackendService.instance = new BackendService();
    }
    return BackendService.instance;
  }

  // Verify receipt with Apple App Store Server API
  async verifyReceipt(receiptData: string): Promise<AppleSubscriptionInfo | null> {
    try {
      console.log('🔍 Verifying receipt with backend...');
      
      const response = await fetch(`${this.baseUrl}/api/subscriptions/verify-receipt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          receiptData,
          bundleId: 'com.vibecode.habithero',
        }),
      });

      if (!response.ok) {
        throw new Error(`Receipt verification failed: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success && result.subscription) {
        console.log('✅ Receipt verified successfully');
        return result.subscription;
      } else {
        console.log('❌ Receipt verification failed:', result.error);
        return null;
      }
    } catch (error) {
      console.error('❌ Receipt verification error:', error);
      return null;
    }
  }

  // Get subscription status for a user
  async getSubscriptionStatus(userId: string): Promise<AppleSubscriptionInfo | null> {
    try {
      console.log('📊 Getting subscription status for user:', userId);
      
      const response = await fetch(`${this.baseUrl}/api/subscriptions/status/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get subscription status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success && result.subscription) {
        return result.subscription;
      } else {
        return null;
      }
    } catch (error) {
      console.error('❌ Get subscription status error:', error);
      return null;
    }
  }

  // Update subscription status
  async updateSubscriptionStatus(
    userId: string, 
    subscriptionInfo: AppleSubscriptionInfo
  ): Promise<boolean> {
    try {
      console.log('🔄 Updating subscription status for user:', userId);
      
      const response = await fetch(`${this.baseUrl}/api/subscriptions/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          userId,
          subscription: subscriptionInfo,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update subscription: ${response.status}`);
      }

      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error('❌ Update subscription status error:', error);
      return false;
    }
  }

  // Process webhook notification from Apple
  async processWebhookNotification(notification: WebhookNotification): Promise<boolean> {
    try {
      console.log('🔔 Processing webhook notification:', notification.notificationType);
      
      const response = await fetch(`${this.baseUrl}/api/webhooks/apple`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(notification),
      });

      if (!response.ok) {
        throw new Error(`Webhook processing failed: ${response.status}`);
      }

      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error('❌ Webhook processing error:', error);
      return false;
    }
  }

  // Get transaction history for a user
  async getTransactionHistory(userId: string): Promise<any[]> {
    try {
      console.log('📜 Getting transaction history for user:', userId);
      
      const response = await fetch(`${this.baseUrl}/api/subscriptions/history/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get transaction history: ${response.status}`);
      }

      const result = await response.json();
      return result.transactions || [];
    } catch (error) {
      console.error('❌ Get transaction history error:', error);
      return [];
    }
  }

  // Validate subscription access
  async validateSubscriptionAccess(userId: string, feature: string): Promise<boolean> {
    try {
      const subscription = await this.getSubscriptionStatus(userId);
      
      if (!subscription) {
        return false;
      }

      // Check if subscription is active
      if (subscription.subscriptionStatus !== 'active') {
        return false;
      }

      // Check if subscription has expired
      if (subscription.expiresDate && new Date() > subscription.expiresDate) {
        return false;
      }

      // Feature-specific access checks
      switch (feature) {
        case 'unlimited_habits':
          return subscription.subscriptionStatus === 'active';
        case 'analytics':
          return subscription.subscriptionStatus === 'active';
        case 'data_export':
          return subscription.subscriptionStatus === 'active';
        default:
          return false;
      }
    } catch (error) {
      console.error('❌ Validate subscription access error:', error);
      return false;
    }
  }

  // Sync subscription status with Apple
  async syncWithApple(userId: string): Promise<boolean> {
    try {
      console.log('🔄 Syncing subscription with Apple for user:', userId);
      
      const response = await fetch(`${this.baseUrl}/api/subscriptions/sync/${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Sync with Apple failed: ${response.status}`);
      }

      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error('❌ Sync with Apple error:', error);
      return false;
    }
  }
}

// Export singleton instance
export const backendService = BackendService.getInstance();
