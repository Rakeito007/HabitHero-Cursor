# 💳 Subscription Testing Guide

## 🧪 **Current Testing Status**

Your app now has **enhanced simulation mode** for testing subscriptions in Expo Go!

## ✅ **What You Can Test Now (Expo Go)**

### **1. Subscription Flow Simulation**
- [ ] **Onboarding screen** - Try selecting monthly or lifetime plans
- [ ] **Purchase simulation** - You'll see a simulation alert
- [ ] **Pro features unlock** - Analytics, unlimited habits, etc.
- [ ] **Settings subscription status** - Shows active subscription
- [ ] **Restore purchases** - Simulates restoring previous purchases

### **2. How to Test Subscriptions**

1. **Open your app** in Expo Go
2. **Go through onboarding** and select a paid plan
3. **You'll see a simulation alert** explaining this is for testing
4. **Pro features will unlock** after the simulated purchase
5. **Check Settings** to see subscription status

## 🔧 **Simulation vs Real Subscriptions**

### **Current (Simulation Mode)**
- ✅ **UI/UX testing** - All subscription flows work
- ✅ **Pro features** - Analytics, unlimited habits unlock
- ✅ **Settings integration** - Subscription status updates
- ✅ **Error handling** - Purchase failures, network errors
- ❌ **Real payments** - No actual money charged
- ❌ **Apple Store integration** - Uses mock data

### **Production (Real Subscriptions)**
- ✅ **Real Apple Store** - Actual purchase dialogs
- ✅ **Real payments** - Users charged real money
- ✅ **Receipt validation** - Backend verifies with Apple
- ✅ **Webhook processing** - Real-time subscription updates
- ✅ **Restore purchases** - Queries Apple Store

## 🚀 **Testing Real Subscriptions**

To test **real subscriptions**, you need to:

### **Option 1: Development Build (Recommended)**
```bash
# Build development version with real IAP
npx expo build:ios --type simulator --dev-client
```

### **Option 2: TestFlight (Production Testing)**
```bash
# Build for TestFlight
npx expo build:ios --type archive
```

### **Option 3: App Store Sandbox**
- Deploy to App Store Connect
- Test with sandbox users
- Use real Apple Store (sandbox mode)

## 📱 **Step-by-Step Testing in Expo Go**

### **Test 1: Onboarding Subscription**
1. **Launch app** in Expo Go
2. **Select "Pro Monthly"** or "Pro Lifetime"
3. **Tap "Subscribe"** button
4. **See simulation alert** - tap "Continue Simulation"
5. **Wait 2 seconds** for simulated purchase
6. **Pro features unlock** automatically
7. **Navigate to main app**

### **Test 2: Settings Subscription Management**
1. **Go to Settings** (gear icon)
2. **Check subscription status** - should show "Pro Plan"
3. **Tap "Restore Purchases"**
4. **See simulation message** in console
5. **Subscription status updates**

### **Test 3: Pro Features**
1. **Try to add more than 3 habits** (should work with Pro)
2. **Open Analytics** (should work with Pro)
3. **Try Data Export** (should work with Pro)
4. **Check all Pro features** are unlocked

### **Test 4: Free Plan**
1. **Reset app data** (or reinstall)
2. **Select "Free" plan** in onboarding
3. **Try to add 4th habit** - should show upgrade prompt
4. **Try Analytics** - should show upgrade prompt
5. **Try Data Export** - should show upgrade prompt

## 🔍 **What to Look For**

### **✅ Working Correctly**
- Simulation alerts appear
- Pro features unlock after purchase
- Subscription status updates in Settings
- Upgrade prompts show for free users
- All UI flows work smoothly

### **❌ Issues to Fix**
- App crashes during purchase
- Pro features don't unlock
- Subscription status doesn't update
- UI doesn't respond to purchases
- Error messages not user-friendly

## 🛠️ **Debugging Tips**

### **Check Console Logs**
Look for these messages:
- `🔧 SIMULATION MODE: Simulating Apple Store purchase`
- `✅ Purchase successful`
- `🔄 Restoring purchases...`
- `🛒 Attempting to purchase: com.vibecode.habithero.monthly`

### **Common Issues**
1. **Purchase doesn't work** - Check if simulation mode is active
2. **Pro features don't unlock** - Check subscription status in store
3. **App crashes** - Check console for error messages

## 🎯 **Next Steps After Testing**

Once you've tested the simulation:

1. **Fix any issues** you find
2. **Deploy backend server** for real subscription testing
3. **Set up App Store Connect** with real products
4. **Build development build** for real IAP testing
5. **Test with sandbox users** in App Store Connect

## 📊 **Testing Checklist**

- [ ] Onboarding subscription flow works
- [ ] Simulation alerts appear
- [ ] Pro features unlock after purchase
- [ ] Settings show correct subscription status
- [ ] Restore purchases works
- [ ] Free plan limitations work
- [ ] Upgrade prompts display correctly
- [ ] No crashes or errors
- [ ] UI is responsive and smooth

## 🎉 **Ready for Real Testing!**

Your subscription system is now ready for testing! The simulation mode lets you test all the UI and logic, while the real implementation will work with actual Apple Store purchases.

**Start testing now in Expo Go!** 🚀
