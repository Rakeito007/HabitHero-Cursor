# 📱 App Store Connect Setup Guide

## 🎯 **Step 1: Configure In-App Purchases**

### **1.1 Go to App Store Connect**
- Visit: https://appstoreconnect.apple.com
- Select your Habit Hero app
- Go to **"Features"** → **"In-App Purchases"**

### **1.2 Create Monthly Subscription**
```
Product ID: com.vibecode.habithero.monthly
Type: Auto-Renewable Subscription
Reference Name: Monthly Pro Subscription
Subscription Group: Pro Features
Price: $1.99/month
```

### **1.3 Create Lifetime Purchase**
```
Product ID: com.vibecode.habithero.lifetime
Type: Non-Consumable
Reference Name: Lifetime Pro Purchase
Price: $25.00
```

## 🔗 **Step 2: Configure Webhook**

### **2.1 Set Webhook URL**
- Go to **"App Information"** → **"App Store Server Notifications"**
- Webhook URL: `https://cd-backend-example-production.up.railway.app/webhooks/apple`
- Enable: ✅

## 🔐 **Step 3: Apple Store Server API**

### **3.1 Generate API Key**
- Go to **"Users and Access"** → **"Keys"** → **"App Store Connect API"**
- Create new key with **"App Manager"** role
- Download the `.p8` file
- Note the **Key ID** and **Issuer ID**

### **3.2 Update Railway Environment Variables**
Add these to your Railway backend:
```
APPLE_ISSUER_ID=your-issuer-id-here
APPLE_KEY_ID=your-key-id-here
APPLE_PRIVATE_KEY=your-private-key-content-here
```

## 📋 **Step 4: App Information**

### **4.1 App Description**
```
Build lasting habits with your personal AI coach. Track progress, get insights, and achieve your goals with Habit Hero's minimalist approach to habit formation.

Features:
• Simple habit tracking
• Progress analytics
• Data export
• Dark/Light themes
• Pro subscription for unlimited habits
```

### **4.2 Keywords**
```
habit,tracker,productivity,goals,analytics,coach,minimalist
```

### **4.3 Screenshots**
Use the screenshots from: `appstore-ready/screenshots/`

## 🚀 **Step 5: Submit for Review**

### **5.1 Build Information**
- **Version**: 1.0.2
- **Build**: 15
- **Bundle ID**: com.vibecode.habithero

### **5.2 Review Information**
- **Contact Information**: Your contact details
- **Demo Account**: Not required
- **Notes**: "App includes subscription functionality with backend integration"

## ✅ **Verification Checklist**

- [ ] Monthly subscription created ($1.99/month)
- [ ] Lifetime purchase created ($25.00)
- [ ] Webhook URL configured
- [ ] Apple Store Server API key generated
- [ ] Railway environment variables updated
- [ ] App description and metadata complete
- [ ] Screenshots uploaded
- [ ] Build 15 submitted for review

## 🎉 **Ready for Launch!**

Once approved, your app will be live on the App Store with full subscription functionality!


