# 🚀 HabitHero App Store Deployment Guide

## ✅ **Step 1: Build Configuration - COMPLETED**
- ✅ Fixed .gitignore to exclude .expo directory
- ✅ Removed duplicate lock file (bun.lock)
- ✅ Verified all dependencies are up to date
- ✅ All expo-doctor checks passing

## 🍎 **Step 2: App Store Connect Setup**

### 2.1 Create App Store Connect Account
1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Sign in with your Apple Developer account ($99/year)

### 2.2 Create Your App
1. Click **"My Apps"** → **"+"** → **"New App"**
2. Fill in:
   - **Platform**: iOS
   - **Name**: Habit Hero
   - **Primary Language**: English
   - **Bundle ID**: `com.vibecode.habithero`
   - **SKU**: `habit-hero-vibecode`

### 2.3 Set Up In-App Purchases
Go to **"Features"** → **"In-App Purchases"** and create:

**Monthly Subscription:**
- **Type**: Auto-Renewable Subscription
- **Product ID**: `com.vibecode.habithero.monthly`
- **Price**: $1.99/month
- **Subscription Group**: "Pro Subscriptions"

**Lifetime Purchase:**
- **Type**: Non-Consumable
- **Product ID**: `com.vibecode.habithero.lifetime`
- **Price**: $25.00

### 2.4 Generate App-Specific Shared Secret
1. Go to **"App Information"**
2. Generate **App-Specific Shared Secret**
3. Copy and save it

### 2.5 Create API Key
1. Go to **"Users and Access"** → **"Keys"** → **"App Store Connect API"**
2. Create new key with **Developer** access
3. Download `.p8` file
4. Note **Key ID** and **Issuer ID**

## 🖥️ **Step 3: Backend Deployment**

### Option A: Deploy to Heroku (Recommended - Free)
1. **Install Heroku CLI**: https://devcenter.heroku.com/articles/heroku-cli
2. **Login to Heroku**:
   ```bash
   heroku login
   ```
3. **Create Heroku app**:
   ```bash
   cd backend-example
   heroku create habit-hero-backend
   ```
4. **Set environment variables**:
   ```bash
   heroku config:set APPLE_ISSUER_ID=your_issuer_id
   heroku config:set APPLE_KEY_ID=your_key_id
   heroku config:set APPLE_PRIVATE_KEY="$(cat your-private-key.p8)"
   heroku config:set APPLE_SHARED_SECRET=your_shared_secret
   ```
5. **Deploy**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push heroku main
   ```

### Option B: Deploy to Railway (Alternative)
1. Go to [Railway](https://railway.app)
2. Connect your GitHub repository
3. Select the `backend-example` folder
4. Set environment variables in Railway dashboard
5. Deploy

### Option C: Deploy to Vercel (Alternative)
1. Go to [Vercel](https://vercel.com)
2. Import your project
3. Set environment variables
4. Deploy

## 🔗 **Step 4: Configure Webhook URL**

1. **Get your backend URL** (e.g., `https://habit-hero-backend.herokuapp.com`)
2. **In App Store Connect**:
   - Go to your app → **"App Information"**
   - Set **Server-to-Server Notifications URL** to: `https://your-backend-url.com/api/webhooks/apple`

## 📱 **Step 5: Update App Configuration**

Update your React Native app with the backend URL:

1. **Create `.env` file** in your project root:
   ```env
   EXPO_PUBLIC_BACKEND_URL=https://your-backend-url.com
   EXPO_PUBLIC_API_KEY=your_api_key
   ```

2. **Update payment service** to use the backend URL

## 🧪 **Step 6: Testing**

### 6.1 Test Backend
```bash
# Test webhook endpoint
curl -X POST https://your-backend-url.com/api/webhooks/apple \
  -H "Content-Type: application/json" \
  -d '{"test": "webhook"}'
```

### 6.2 Test App
1. **Build for testing**:
   ```bash
   npx expo build:ios --type simulator
   ```
2. **Test in sandbox**:
   - Create test user in App Store Connect
   - Test purchases in sandbox mode
   - Verify subscription status updates

## 📦 **Step 7: Final App Store Submission**

### 7.1 Build for Production
```bash
# Build for App Store
npx expo build:ios --type archive
```

### 7.2 Upload to App Store Connect
1. Use **Transporter** app or **Xcode**
2. Upload your `.ipa` file
3. Submit for review

### 7.3 App Store Review Checklist
- ✅ App metadata complete
- ✅ Screenshots uploaded
- ✅ Privacy policy URL set
- ✅ Terms of use URL set
- ✅ In-app purchases configured
- ✅ Backend deployed and tested
- ✅ Webhook URL configured

## 🎉 **You're Ready!**

Once you complete these steps, your app will be ready for App Store submission!

**Estimated time**: 2-3 hours
**Cost**: $99/year for Apple Developer account (one-time setup)

## 🆘 **Need Help?**

If you run into any issues:
1. Check the logs in your backend deployment
2. Verify all environment variables are set correctly
3. Test the webhook endpoint manually
4. Check App Store Connect for any configuration errors
