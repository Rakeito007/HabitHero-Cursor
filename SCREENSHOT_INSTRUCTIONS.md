# 📱 Habit Hero - App Store Screenshot Instructions

## ✅ You Have These Screenshots:
1. **Dashboard** - Main screen with habit cards
2. **Analytics** - Progress insights and charts  
3. **Habit Detail** - Individual habit tracking
4. **Add Habit** - Creating new habits
5. **Settings** - Pro features unlocked
6. **Onboarding** - Subscription plans

## 🎯 Required Size: 1290 x 2796 pixels

## 📋 Quick Steps:

### 1. Save Your Screenshots
- Save all 6 screenshots to your project folder
- Name them: `dashboard.png`, `analytics.png`, `habit-detail.png`, `add-habit.png`, `settings.png`, `onboarding.png`

### 2. Resize Automatically
Run this command to resize all screenshots:
```bash
node resize-screenshots.js process
```

### 3. Check Results
- Resized screenshots will be in `appstore-ready/screenshots/`
- They'll be named: `01_Dashboard.png`, `02_Analytics.png`, etc.

### 4. Upload to App Store Connect
- Go to [App Store Connect](https://appstoreconnect.apple.com)
- Select your Habit Hero app
- Go to App Store tab → App Screenshots
- Upload all 6 screenshots for iPhone 6.7" Display

## 🚀 Ready to Build & Submit?
After screenshots are ready, run:
```bash
eas build --platform ios --profile production
```

Then submit to App Store Connect!

