# Habit Hero Backend Production Setup Guide

This guide will help you deploy your Habit Hero backend to production with complete Apple Store integration.

## Prerequisites

1. **Railway Account**: Sign up at [railway.app](https://railway.app)
2. **Apple Developer Account**: With App Store Connect access
3. **Node.js**: Version 18 or higher

## Step 1: Apple Store Connect Configuration

### 1.1 Create Your App in App Store Connect
1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Create a new app with bundle ID: `com.vibecode.habithero`
3. Note down your **App Store Connect Team ID**

### 1.2 Create In-App Purchase Products
1. Go to **Features** → **In-App Purchases**
2. Create a **Subscription Group** (e.g., "Habit Hero Pro")
3. Add two products:
   - **Monthly Subscription**: `com.vibecode.habithero.monthly` - $1.99/month
   - **Lifetime Purchase**: `com.vibecode.habithero.lifetime` - $25.00 one-time

### 1.3 Generate App Store Server API Key
1. Go to **Users and Access** → **Keys** → **App Store Connect API**
2. Click **Generate API Key**
3. Download the `.p8` file
4. Note down:
   - **Issuer ID** (e.g., `12345678-1234-1234-1234-123456789012`)
   - **Key ID** (e.g., `ABC123DEF4`)
   - **Private Key** (content of the .p8 file)

### 1.4 Get App-Specific Shared Secret
1. Go to **My Apps** → Select your app → **App Information**
2. Scroll down to **App Store Connect Server-to-Server Notifications**
3. Generate or copy your **App-Specific Shared Secret**

## Step 2: Backend Deployment

### 2.1 Install Railway CLI
```bash
npm install -g @railway/cli
```

### 2.2 Login to Railway
```bash
railway login
```

### 2.3 Configure Environment Variables
1. Copy the environment template:
   ```bash
   cp backend-example/env.production.example backend-example/.env
   ```

2. Update `backend-example/.env` with your actual values:
   ```env
   # Server Configuration
   PORT=3000
   NODE_ENV=production

   # API Security (generate a secure random string)
   API_KEY=your_secure_api_key_here_2024

   # Apple App Store Configuration
   BUNDLE_ID=com.vibecode.habithero
   APPLE_SHARED_SECRET=your_app_store_shared_secret_here

   # Apple Store Server API (from App Store Connect)
   APPLE_ISSUER_ID=your_issuer_id_here
   APPLE_KEY_ID=your_key_id_here
   APPLE_PRIVATE_KEY=your_private_key_here
   ```

### 2.4 Deploy to Railway
```bash
./deploy-backend-production.sh
```

This script will:
- Install dependencies
- Deploy to Railway
- Provide you with the backend URL
- Show next steps

## Step 3: Configure App Store Connect Webhook

1. Go to **App Store Connect** → **My Apps** → Your App → **App Information**
2. Scroll to **Server-to-Server Notifications**
3. Set the webhook URL to: `https://your-backend-url.railway.app/webhooks/apple`
4. Enable notifications for:
   - SUBSCRIBED
   - DID_RENEW
   - DID_FAIL_TO_RENEW
   - DID_CHANGE_RENEWAL_PREF
   - DID_CHANGE_RENEWAL_STATUS
   - GRACE_PERIOD_EXPIRED
   - DID_RECOVER
   - REVOKE
   - REFUND

## Step 4: Update Frontend Configuration

1. Update your `.env` file with the new backend URL:
   ```env
   EXPO_PUBLIC_BACKEND_URL=https://your-backend-url.railway.app
   EXPO_PUBLIC_API_KEY=your_secure_api_key_here_2024
   EXPO_PUBLIC_APPLE_BUNDLE_ID=com.vibecode.habithero
   EXPO_PUBLIC_APPLE_SHARED_SECRET=your_app_store_shared_secret_here
   ```

2. Test the connection:
   ```bash
   curl https://your-backend-url.railway.app/health
   ```

## Step 5: Test the Integration

### 5.1 Test Backend Endpoints
```bash
# Health check
curl https://your-backend-url.railway.app/health

# Test receipt validation (with proper headers)
curl -X POST https://your-backend-url.railway.app/validate-receipt \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_api_key" \
  -d '{"receiptData":"test","productId":"com.vibecode.habithero.monthly","transactionId":"test123"}'
```

### 5.2 Test in App
1. Build a production version of your app
2. Test the subscription flow
3. Verify receipts are validated correctly
4. Check webhook notifications are received

## Step 6: Production Monitoring

### 6.1 Railway Dashboard
- Monitor server logs
- Check deployment status
- View resource usage

### 6.2 App Store Connect
- Monitor subscription metrics
- Check webhook delivery status
- Review transaction reports

## Troubleshooting

### Common Issues

1. **Webhook Not Receiving Notifications**
   - Check webhook URL is correct
   - Verify SSL certificate is valid
   - Check server logs for errors

2. **Receipt Validation Failing**
   - Verify Apple credentials are correct
   - Check bundle ID matches
   - Ensure shared secret is correct

3. **API Authentication Errors**
   - Verify API key is correct
   - Check Authorization header format
   - Ensure API key is set in environment variables

### Support

- **Railway Support**: [docs.railway.app](https://docs.railway.app)
- **Apple Developer Support**: [developer.apple.com/support](https://developer.apple.com/support)
- **Expo Support**: [docs.expo.dev](https://docs.expo.dev)

## Security Best Practices

1. **Never commit .env files** to version control
2. **Use strong API keys** (32+ characters, random)
3. **Rotate credentials** regularly
4. **Monitor logs** for suspicious activity
5. **Use HTTPS** for all communications
6. **Validate all inputs** on the backend
7. **Implement rate limiting** for production

## Next Steps

Once your backend is deployed and tested:

1. **Submit your app** to the App Store
2. **Test with TestFlight** users
3. **Monitor performance** and user feedback
4. **Scale resources** as needed
5. **Implement analytics** for subscription metrics

Your Habit Hero backend is now ready for production! 🎉



