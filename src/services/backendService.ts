import { Platform } from 'react-native';

// Backend API configuration
const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'https://habit-hero-backend-production.up.railway.app';
const API_KEY = process.env.EXPO_PUBLIC_API_KEY || 'habit-hero-api-key-2024';

export interface ReceiptValidationRequest {
  receiptData: string;
  productId: string;
  transactionId: string;
  userId?: string;
}

export interface ReceiptValidationResponse {
  isValid: boolean;
  subscriptionStatus: 'active' | 'expired' | 'cancelled' | 'invalid';
  expiresDate?: string;
  originalTransactionId?: string;
  error?: string;
}

export interface SubscriptionStatus {
  isActive: boolean;
  productId: string;
  expiresDate?: Date;
  autoRenew: boolean;
  isTrial: boolean;
}

class BackendService {
  private static instance: BackendService;
  private userId: string | null = null;

  static getInstance(): BackendService {
    if (!BackendService.instance) {
      BackendService.instance = new BackendService();
    }
    return BackendService.instance;
  }

  // Set user ID for subscription tracking
  setUserId(userId: string) {
    this.userId = userId;
  }

  // Generate a unique user ID if not set
  private getUserId(): string {
    if (!this.userId) {
      // Generate a unique user ID based on device
      this.userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    return this.userId;
  }

  // Validate receipt with Apple and backend
  async validateReceipt(receiptData: string, productId: string, transactionId: string): Promise<ReceiptValidationResponse> {
    try {
      const request: ReceiptValidationRequest = {
        receiptData,
        productId,
        transactionId,
        userId: this.getUserId()
      };

      const response = await fetch(`${BACKEND_URL}/validate-receipt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
          'X-Platform': Platform.OS,
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`Backend validation failed: ${response.status}`);
      }

      const result: ReceiptValidationResponse = await response.json();
      return result;
    } catch (error) {
      console.error('❌ Receipt validation failed:', error);
      
      // Fallback: Basic validation without backend
      return this.fallbackValidation(productId);
    }
  }

  // Fallback validation when backend is unavailable
  private fallbackValidation(productId: string): ReceiptValidationResponse {
    console.warn('⚠️ Using fallback validation - implement backend for production');
    
    // Basic validation - in production, this should be replaced with proper backend
    const validProducts = [
      'com.vibecode.habithero.monthly',
      'com.vibecode.habithero.lifetime'
    ];

    if (validProducts.includes(productId)) {
      return {
        isValid: true,
        subscriptionStatus: 'active',
        expiresDate: productId.includes('lifetime') 
          ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 year from now
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        originalTransactionId: `fallback_${Date.now()}`
      };
    }

    return {
      isValid: false,
      subscriptionStatus: 'invalid',
      error: 'Invalid product ID'
    };
  }

  // Get subscription status from backend
  async getSubscriptionStatus(): Promise<SubscriptionStatus | null> {
    try {
      const response = await fetch(`${BACKEND_URL}/subscription-status`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'X-User-ID': this.getUserId(),
          'X-Platform': Platform.OS,
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to get subscription status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('❌ Failed to get subscription status:', error);
      return null;
    }
  }

  // Update subscription status on backend
  async updateSubscriptionStatus(subscriptionData: {
    productId: string;
    transactionId: string;
    expiresDate?: Date;
    isActive: boolean;
  }): Promise<boolean> {
    try {
      const response = await fetch(`${BACKEND_URL}/update-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
          'X-User-ID': this.getUserId(),
          'X-Platform': Platform.OS,
        },
        body: JSON.stringify(subscriptionData)
      });

      return response.ok;
    } catch (error) {
      console.error('❌ Failed to update subscription status:', error);
      return false;
    }
  }

  // Check if backend is available
  async isBackendAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${BACKEND_URL}/health`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
        }
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

export const backendService = BackendService.getInstance();