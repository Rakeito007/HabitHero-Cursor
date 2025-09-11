# Habit Hero Backend - Apple Store Integration

This backend server handles Apple Store Server API integration for Habit Hero, including receipt validation, webhook processing, and subscription management.

## Features

- ✅ **Receipt Validation** - Verify purchases with Apple Store Server API
- ✅ **Webhook Processing** - Handle Server-to-Server Notifications (RTDN)
- ✅ **Subscription Management** - Track and update subscription status
- ✅ **JWT Authentication** - Secure API endpoints
- ✅ **Transaction History** - Store and retrieve purchase history

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend-example
npm install
```

### 2. Configure Environment Variables

Create a `.env` file with the following variables:

```env
# Apple Store Server API Configuration
APPLE_ISSUER_ID=your_issuer_id_from_app_store_connect
APPLE_KEY_ID=your_key_id_from_app_store_connect
APPLE_PRIVATE_KEY=your_private_key_content
APPLE_SHARED_SECRET=your_app_specific_shared_secret

# Server Configuration
PORT=3000
NODE_ENV=production

# Security
JWT_SECRET=your_jwt_secret_for_api_authentication
API_KEY=your_api_key_for_client_authentication
```

### 3. Apple Store Connect Setup

1. **Create App-Specific Shared Secret:**
   - Go to App Store Connect → Your App → App Information
   - Generate an App-Specific Shared Secret

2. **Create API Key:**
   - Go to App Store Connect → Users and Access → Keys
   - Create a new key with "App Store Connect API" access
   - Download the private key (.p8 file)
   - Note the Key ID and Issuer ID

3. **Configure Webhook URL:**
   - Go to App Store Connect → Your App → App Information
   - Set the Server-to-Server Notifications URL to: `https://your-domain.com/api/webhooks/apple`

### 4. Deploy the Server

Deploy this server to a cloud provider (AWS, Google Cloud, Heroku, etc.) and ensure it's accessible via HTTPS.

### 5. Update Client Configuration

Update your React Native app's backend URL in the environment variables:

```env
EXPO_PUBLIC_BACKEND_URL=https://your-domain.com
EXPO_PUBLIC_API_KEY=your_api_key_for_client_authentication
```

## API Endpoints

### Receipt Validation
```
POST /api/subscriptions/verify-receipt
```

### Get Subscription Status
```
GET /api/subscriptions/status/:userId
```

### Update Subscription
```
POST /api/subscriptions/update
```

### Apple Webhook
```
POST /api/webhooks/apple
```

### Transaction History
```
GET /api/subscriptions/history/:userId
```

### Sync with Apple
```
POST /api/subscriptions/sync/:userId
```

## Webhook Notifications Handled

- `SUBSCRIBED` - User subscribed to a subscription
- `DID_RENEW` - Subscription renewed successfully
- `DID_FAIL_TO_RENEW` - Subscription renewal failed
- `DID_CHANGE_RENEWAL_PREF` - User changed renewal preferences
- `DID_CHANGE_RENEWAL_STATUS` - Renewal status changed
- `GRACE_PERIOD_EXPIRED` - Grace period expired
- `DID_RECOVER` - Subscription recovered from billing retry
- `REVOKE` - Subscription revoked
- `REFUND` - Refund processed

## Security Considerations

1. **JWT Verification** - All webhook payloads are verified using Apple's public keys
2. **HTTPS Required** - Apple requires HTTPS for webhook endpoints
3. **Rate Limiting** - Implement rate limiting for API endpoints
4. **Database Security** - Use a secure database with proper access controls
5. **API Authentication** - Secure all API endpoints with proper authentication

## Production Checklist

- [ ] Deploy to HTTPS-enabled server
- [ ] Configure environment variables
- [ ] Set up database (PostgreSQL, MongoDB, etc.)
- [ ] Configure webhook URL in App Store Connect
- [ ] Test receipt validation
- [ ] Test webhook processing
- [ ] Monitor logs and errors
- [ ] Set up monitoring and alerting

## Testing

Use Apple's Sandbox environment for testing:

1. Create test users in App Store Connect
2. Test purchases in sandbox mode
3. Verify webhook notifications are received
4. Test receipt validation
5. Test subscription status updates

## Support

For issues or questions, refer to:
- [Apple Store Server API Documentation](https://developer.apple.com/documentation/appstoreserverapi)
- [Server-to-Server Notifications](https://developer.apple.com/documentation/appstoreservernotifications)
- [Receipt Validation](https://developer.apple.com/documentation/appstorereceipts)
