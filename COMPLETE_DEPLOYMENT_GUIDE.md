# Complete Habit Hero Build 15 Deployment Guide

## ✅ What's Already Done:
- ✅ App configured as Build 15 (version 1.0.2)
- ✅ Backend code ready for deployment
- ✅ Payment systems integrated
- ✅ Production environment configured

## 🚀 Complete These Steps:

### Step 1: Deploy Backend to Railway (Manual)

1. **Go to Railway Dashboard:**
   - Visit [railway.app](https://railway.app)
   - Sign in with your account

2. **Create New Project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo" or "Empty Project"
   - Name it: `habit-hero-backend`

3. **Deploy the Backend:**
   - Upload the `backend-example` folder contents
   - Or connect your GitHub repo if you've pushed it

4. **Set Environment Variables:**
   In Railway dashboard, go to Variables tab and add:
   ```
   API_KEY=129c97b630a6e7a036659b3b85cf004c077c3d40dbdcfd8ba6eaa95dd1f092cc
   BUNDLE_ID=com.vibecode.habithero
   NODE_ENV=production
   PORT=3000
   ```

5. **Get Your Backend URL:**
   - Railway will provide a URL like: `https://habit-hero-backend-production.up.railway.app`
   - Copy this URL

### Step 2: Update Frontend Environment

1. **Copy the production config:**
   ```bash
   cp production-config.env .env
   ```

2. **Update the backend URL in .env:**
   Replace `https://habit-hero-backend-production.up.railway.app` with your actual Railway URL

### Step 3: Test the Backend

1. **Test health endpoint:**
   ```bash
   curl https://your-railway-url.railway.app/health
   ```

2. **Test with our script:**
   ```bash
   ./test-backend.sh https://your-railway-url.railway.app 129c97b630a6e7a036659b3b85cf004c077c3d40dbdcfd8ba6eaa95dd1f092cc
   ```

### Step 4: Build iOS App (Build 15)

1. **Build for iOS:**
   ```bash
   npx expo run:ios
   ```

2. **Or create production build:**
   ```bash
   npx expo build:ios
   ```

## 🎉 You're Done!

Your Habit Hero app is now:
- ✅ Build 15 configured
- ✅ Version 1.0.2
- ✅ Production backend ready
- ✅ Payment systems integrated
- ✅ Ready for App Store submission

## 📱 Next Steps:

1. **Test the app** with the new backend
2. **Configure Apple Store Connect** with your products
3. **Submit to App Store** for review

## 🔧 Troubleshooting:

If you need help with any step, let me know and I'll guide you through it!


