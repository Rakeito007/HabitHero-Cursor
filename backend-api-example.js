// Backend API Example for Habit Hero
// This is a Node.js/Express example - implement this on your server

const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Apple App Store verification
const APPLE_VERIFY_URL = 'https://buy.itunes.apple.com/verifyReceipt';
const APPLE_SANDBOX_URL = 'https://sandbox.itunes.apple.com/verifyReceipt';

// Verify receipt with Apple
async function verifyReceiptWithApple(receiptData, isProduction = true) {
  try {
    const url = isProduction ? APPLE_VERIFY_URL : APPLE_SANDBOX_URL;
    
    const response = await axios.post(url, {
      'receipt-data': receiptData,
      'password': process.env.APPLE_SHARED_SECRET, // Your App Store Connect shared secret
      'exclude-old-transactions': true
    });

    const data = response.data;
    
    if (data.status === 0) {
      // Valid receipt
      return {
        isValid: true,
        latestReceiptInfo: data.latest_receipt_info,
        pendingRenewalInfo: data.pending_renewal_info
      };
    } else if (data.status === 21007) {
      // Sandbox receipt sent to production, retry with sandbox
      return await verifyReceiptWithApple(receiptData, false);
    } else {
      // Invalid receipt
      return {
        isValid: false,
        error: `Apple verification failed with status: ${data.status}`
      };
    }
  } catch (error) {
    console.error('Apple verification error:', error);
    return {
      isValid: false,
      error: 'Apple verification failed'
    };
  }
}

// In-memory storage (use a real database in production)
const subscriptions = new Map();

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Validate receipt endpoint
app.post('/validate-receipt', async (req, res) => {
  try {
    const { receiptData, productId, transactionId, userId } = req.body;
    
    console.log('Validating receipt for product:', productId);
    
    // Verify with Apple
    const appleVerification = await verifyReceiptWithApple(receiptData);
    
    if (!appleVerification.isValid) {
      return res.status(400).json({
        isValid: false,
        subscriptionStatus: 'invalid',
        error: appleVerification.error
      });
    }
    
    // Find the specific transaction
    const transaction = appleVerification.latestReceiptInfo.find(
      t => t.transaction_id === transactionId
    );
    
    if (!transaction) {
      return res.status(400).json({
        isValid: false,
        subscriptionStatus: 'invalid',
        error: 'Transaction not found in receipt'
      });
    }
    
    // Determine subscription status
    let subscriptionStatus = 'active';
    let expiresDate = null;
    
    if (productId.includes('lifetime')) {
      // Lifetime purchase - never expires
      expiresDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(); // 1 year from now
    } else if (productId.includes('monthly')) {
      // Monthly subscription
      expiresDate = new Date(parseInt(transaction.expires_date_ms)).toISOString();
      
      // Check if subscription is still active
      if (new Date(expiresDate) < new Date()) {
        subscriptionStatus = 'expired';
      }
    }
    
    // Store subscription in database
    subscriptions.set(userId, {
      productId,
      transactionId,
      expiresDate,
      isActive: subscriptionStatus === 'active',
      originalTransactionId: transaction.original_transaction_id,
      purchaseDate: new Date(parseInt(transaction.purchase_date_ms)).toISOString()
    });
    
    res.json({
      isValid: true,
      subscriptionStatus,
      expiresDate,
      originalTransactionId: transaction.original_transaction_id
    });
    
  } catch (error) {
    console.error('Receipt validation error:', error);
    res.status(500).json({
      isValid: false,
      subscriptionStatus: 'invalid',
      error: 'Internal server error'
    });
  }
});

// Get subscription status endpoint
app.get('/subscription-status', (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const subscription = subscriptions.get(userId);
    
    if (!subscription) {
      return res.json({
        isActive: false,
        productId: null,
        expiresDate: null,
        autoRenew: false,
        isTrial: false
      });
    }
    
    res.json({
      isActive: subscription.isActive,
      productId: subscription.productId,
      expiresDate: subscription.expiresDate,
      autoRenew: subscription.productId.includes('monthly'),
      isTrial: false
    });
    
  } catch (error) {
    console.error('Get subscription status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update subscription status endpoint
app.post('/update-subscription', (req, res) => {
  try {
    const { productId, transactionId, expiresDate, isActive } = req.body;
    const userId = req.headers['x-user-id'];
    
    subscriptions.set(userId, {
      productId,
      transactionId,
      expiresDate: expiresDate ? new Date(expiresDate).toISOString() : null,
      isActive,
      updatedAt: new Date().toISOString()
    });
    
    res.json({ success: true });
    
  } catch (error) {
    console.error('Update subscription error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Habit Hero Backend API running on port ${PORT}`);
  console.log(`📱 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;






