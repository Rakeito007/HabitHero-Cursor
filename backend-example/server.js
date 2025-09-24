// Backend Server Example for Apple Store Integration
// This is a Node.js/Express server that handles Apple Store Server API integration
// You'll need to deploy this to a server and configure the webhook URL in App Store Connect

const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Authentication middleware
const authenticateRequest = (req, res, next) => {
  const apiKey = req.headers.authorization?.replace('Bearer ', '');
  const expectedApiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey !== expectedApiKey) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  next();
};

// Configuration
const APPLE_STORE_SERVER_API_URL = 'https://api.storekit.itunes.apple.com/inApps/v1';
const APPLE_PUBLIC_KEYS_URL = 'https://api.storekit.itunes.apple.com/inApps/v1/notifications/history';
const BUNDLE_ID = 'com.vibecode.habithero';
const APPLE_ISSUER_ID = process.env.APPLE_ISSUER_ID;
const APPLE_KEY_ID = process.env.APPLE_KEY_ID;
const APPLE_PRIVATE_KEY = process.env.APPLE_PRIVATE_KEY;

// In-memory storage (use a real database in production)
const subscriptions = new Map();
const users = new Map();

// Generate JWT token for Apple Store Server API
function generateAppleJWT() {
  const now = Math.floor(Date.now() / 1000);
  
  const payload = {
    iss: APPLE_ISSUER_ID,
    iat: now,
    exp: now + 3600, // 1 hour
    aud: 'appstoreconnect-v1',
    bid: BUNDLE_ID,
  };

  return jwt.sign(payload, APPLE_PRIVATE_KEY, {
    algorithm: 'ES256',
    keyid: APPLE_KEY_ID,
  });
}

// Verify Apple's signed payload
async function verifyAppleSignature(signedPayload, environment) {
  try {
    // In production, you would:
    // 1. Fetch Apple's public keys
    // 2. Verify the JWT signature
    // 3. Validate the claims
    
    // For now, we'll just decode the payload
    const decoded = jwt.decode(signedPayload, { complete: true });
    return decoded.payload;
  } catch (error) {
    console.error('Signature verification failed:', error);
    return null;
  }
}

// Verify receipt with Apple - matches frontend endpoint
app.post('/validate-receipt', authenticateRequest, async (req, res) => {
  try {
    const { receiptData, productId, transactionId, userId } = req.body;
    
    if (!receiptData || !productId || !transactionId) {
      return res.status(400).json({ 
        isValid: false, 
        subscriptionStatus: 'invalid',
        error: 'Missing required fields' 
      });
    }

    // Generate JWT for Apple Store Server API
    const token = generateAppleJWT();
    
    // Verify receipt with Apple
    const response = await axios.post(
      `${APPLE_STORE_SERVER_API_URL}/verifyReceipt`,
      {
        receiptData,
        password: process.env.APPLE_SHARED_SECRET, // App-specific shared secret
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data.status === 0) {
      // Receipt is valid
      const latestReceiptInfo = response.data.latest_receipt_info[0];
      const subscription = {
        originalTransactionId: latestReceiptInfo.original_transaction_id,
        productId: latestReceiptInfo.product_id,
        subscriptionStatus: 'active',
        expiresDate: new Date(parseInt(latestReceiptInfo.expires_date_ms)),
        autoRenewStatus: response.data.latest_receipt_info[0].auto_renew_status === '1',
        isTrialPeriod: latestReceiptInfo.is_trial_period === 'true',
        isInIntroOfferPeriod: latestReceiptInfo.is_in_intro_offer_period === 'true',
        environment: response.data.environment,
      };

      // Store subscription in database
      subscriptions.set(latestReceiptInfo.original_transaction_id, subscription);

      // Return response matching frontend expectations
      res.json({ 
        isValid: true, 
        subscriptionStatus: 'active',
        expiresDate: subscription.expiresDate.toISOString(),
        originalTransactionId: subscription.originalTransactionId
      });
    } else {
      res.json({ 
        isValid: false, 
        subscriptionStatus: 'invalid',
        error: 'Invalid receipt' 
      });
    }
  } catch (error) {
    console.error('Receipt verification error:', error);
    res.status(500).json({ 
      isValid: false, 
      subscriptionStatus: 'invalid',
      error: 'Internal server error' 
    });
  }
});

// Get subscription status - matches frontend endpoint
app.get('/subscription-status', authenticateRequest, async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const subscription = subscriptions.get(userId);
    
    if (subscription) {
      res.json({
        isActive: subscription.subscriptionStatus === 'active',
        productId: subscription.productId,
        expiresDate: subscription.expiresDate,
        autoRenew: subscription.autoRenewStatus,
        isTrial: subscription.isTrialPeriod
      });
    } else {
      res.json({ 
        isActive: false, 
        productId: null,
        expiresDate: null,
        autoRenew: false,
        isTrial: false
      });
    }
  } catch (error) {
    console.error('Get subscription status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update subscription status - matches frontend endpoint
app.post('/update-subscription', authenticateRequest, async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const { productId, transactionId, expiresDate, isActive } = req.body;
    
    const subscription = {
      productId,
      transactionId,
      expiresDate: expiresDate ? new Date(expiresDate) : undefined,
      subscriptionStatus: isActive ? 'active' : 'inactive',
      autoRenewStatus: true,
      isTrialPeriod: false,
      isInIntroOfferPeriod: false,
      environment: 'production'
    };
    
    subscriptions.set(userId, subscription);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Update subscription error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Apple webhook endpoint for Server-to-Server Notifications
app.post('/webhooks/apple', async (req, res) => {
  try {
    const notification = req.body;
    
    console.log('Received Apple webhook:', notification.notificationType);
    
    // Verify the webhook signature
    const transactionInfo = await verifyAppleSignature(
      notification.data.signedTransactionInfo,
      notification.data.environment
    );
    
    const renewalInfo = await verifyAppleSignature(
      notification.data.signedRenewalInfo,
      notification.data.environment
    );

    if (!transactionInfo || !renewalInfo) {
      return res.status(400).json({ success: false, error: 'Invalid signature' });
    }

    // Process the notification
    const success = await processWebhookNotification(notification, transactionInfo, renewalInfo);
    
    if (success) {
      res.json({ success: true });
    } else {
      res.status(500).json({ success: false, error: 'Failed to process notification' });
    }
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Process webhook notifications
async function processWebhookNotification(notification, transactionInfo, renewalInfo) {
  try {
    const { notificationType, subtype } = notification;
    const originalTransactionId = transactionInfo.original_transaction_id;
    
    console.log(`Processing ${notificationType}${subtype ? ` (${subtype})` : ''} for ${originalTransactionId}`);
    
    let subscriptionStatus = 'active';
    
    switch (notificationType) {
      case 'SUBSCRIBED':
        subscriptionStatus = 'active';
        break;
      case 'DID_RENEW':
        subscriptionStatus = 'active';
        break;
      case 'DID_FAIL_TO_RENEW':
        subscriptionStatus = 'billing_retry';
        break;
      case 'DID_CHANGE_RENEWAL_PREF':
        subscriptionStatus = 'active';
        break;
      case 'DID_CHANGE_RENEWAL_STATUS':
        subscriptionStatus = 'active';
        break;
      case 'GRACE_PERIOD_EXPIRED':
        subscriptionStatus = 'expired';
        break;
      case 'DID_RECOVER':
        subscriptionStatus = 'active';
        break;
      case 'REVOKE':
        subscriptionStatus = 'cancelled';
        break;
      case 'REFUND':
        subscriptionStatus = 'cancelled';
        break;
      default:
        console.log(`Unknown notification type: ${notificationType}`);
        return true;
    }
    
    // Update subscription in database
    const subscription = {
      originalTransactionId,
      productId: transactionInfo.product_id,
      subscriptionStatus,
      expiresDate: transactionInfo.expires_date ? new Date(parseInt(transactionInfo.expires_date)) : undefined,
      autoRenewStatus: renewalInfo.auto_renew_status === 1,
      isTrialPeriod: transactionInfo.is_trial_period === 'true',
      isInIntroOfferPeriod: transactionInfo.is_in_intro_offer_period === 'true',
      environment: transactionInfo.environment,
    };
    
    subscriptions.set(originalTransactionId, subscription);
    
    console.log(`Updated subscription for ${originalTransactionId}: ${subscriptionStatus}`);
    return true;
  } catch (error) {
    console.error('Error processing webhook notification:', error);
    return false;
  }
}

// Get transaction history
app.get('/api/subscriptions/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    // In production, fetch from database
    const transactions = []; // Placeholder
    
    res.json({ success: true, transactions });
  } catch (error) {
    console.error('Get transaction history error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Sync subscription with Apple
app.post('/api/subscriptions/sync/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // In production, fetch latest subscription status from Apple
    // and update local database
    
    res.json({ success: true });
  } catch (error) {
    console.error('Sync with Apple error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📱 Bundle ID: ${BUNDLE_ID}`);
  console.log(`🔗 Webhook URL: https://your-domain.com/api/webhooks/apple`);
  console.log(`📋 Configure this URL in App Store Connect under Server-to-Server Notifications`);
});

module.exports = app;
