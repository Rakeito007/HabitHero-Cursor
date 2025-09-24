# 🚀 DEPLOY BACKEND NOW - Complete Payment System

## ⚡ **QUICK DEPLOYMENT (5 minutes)**

### **Option 1: Railway (Recommended - Free)**
```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login to Railway
railway login

# 3. Deploy backend
railway init
railway up

# 4. Get your backend URL
railway domain
```

### **Option 2: Heroku (Free tier available)**
```bash
# 1. Install Heroku CLI
# Download from: https://devcenter.heroku.com/articles/heroku-cli

# 2. Login to Heroku
heroku login

# 3. Create app
heroku create habit-hero-backend

# 4. Deploy
git init
git add .
git commit -m "Initial commit"
git push heroku main
```

## 🔧 **Configure Environment Variables**

After deployment, set these environment variables:

### **Required Variables:**
```bash
# Apple App Store Connect Shared Secret
APPLE_SHARED_SECRET=your_shared_secret_from_app_store_connect

# API Key (generate a random string)
API_KEY=your_secure_api_key_here
```

### **How to get Apple Shared Secret:**
1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Select your app → App Information
3. Copy the "App-Specific Shared Secret"

## 📱 **Update App Configuration**

Update your app's `.env` file:
```bash
# Replace with your actual backend URL
EXPO_PUBLIC_BACKEND_URL=https://your-backend-url.railway.app
EXPO_PUBLIC_API_KEY=your_secure_api_key_here
EXPO_PUBLIC_APPLE_BUNDLE_ID=com.vibecode.habithero
EXPO_PUBLIC_APPLE_SHARED_SECRET=your_shared_secret_here
```

## ✅ **Test Payment System**

1. **Deploy backend** (5 minutes)
2. **Update app config** (2 minutes)
3. **Build production app** (10 minutes)
4. **Test payments** (5 minutes)

## 💰 **Revenue Ready!**

Once deployed, your app will:
- ✅ Accept real Apple payments
- ✅ Validate receipts securely
- ✅ Unlock Pro features
- ✅ Generate real revenue

**Total setup time: ~20 minutes**






