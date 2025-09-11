# 📱 Testing with Expo Go - Quick Setup

## ✅ **Current Status**
Your app is now running in **Expo Go mode** which is perfect for testing before App Store submission!

## 📱 **How to Test Your App**

### **Option 1: Test on Your Phone (Recommended)**
1. **Download Expo Go** from the App Store
2. **Scan the QR code** that appears in your terminal
3. **Your app will open** in Expo Go

### **Option 2: Test on iOS Simulator**
1. **Press `i`** in the terminal to open iOS simulator
2. **Install Expo Go** in the simulator if needed
3. **Scan the QR code** or use the development URL

### **Option 3: Test on Web**
1. **Press `w`** in the terminal to open in web browser
2. **Test basic functionality** (some features may not work on web)

## 🧪 **What to Test**

### **Core Functionality**
- [ ] App launches successfully
- [ ] Onboarding screen works
- [ ] Can add habits (up to 3 on free plan)
- [ ] Can complete habits
- [ ] Settings screen works
- [ ] Theme switching works
- [ ] Navigation works smoothly

### **Pro Features (Simulated)**
- [ ] Analytics screen opens (shows upgrade prompt)
- [ ] Data export shows upgrade prompt
- [ ] Subscription plans display correctly

### **UI/UX**
- [ ] All screens look good
- [ ] Animations are smooth
- [ ] No crashes or errors
- [ ] Text is readable
- [ ] Buttons work properly

## ⚠️ **Limitations in Expo Go**

**What works:**
- ✅ All UI and navigation
- ✅ Local data storage
- ✅ Theme switching
- ✅ Habit tracking
- ✅ Settings and preferences

**What doesn't work:**
- ❌ Real in-app purchases (subscriptions)
- ❌ Camera/microphone permissions
- ❌ Some native features

**Note:** This is normal! For testing subscriptions, you'll need to build a development build or test in production.

## 🚀 **Next Steps After Testing**

Once you've tested the core functionality:

1. **Fix any issues** you find
2. **Deploy your backend** (for subscription testing)
3. **Set up App Store Connect** (for real subscription testing)
4. **Build for production** when ready

## 🐛 **Common Issues & Solutions**

### **Issue: App doesn't load**
- **Solution**: Make sure Expo Go is installed and you're on the same network
- **Try**: Restart the development server

### **Issue: Some features don't work**
- **Solution**: This is normal in Expo Go - some native features require a development build

### **Issue: App crashes**
- **Solution**: Check the terminal for error messages and fix the code

## 📞 **Need Help?**

If you encounter any issues:
1. Check the terminal output for error messages
2. Look at the Expo Go logs
3. Restart the development server if needed

**Your app is ready for testing!** 🎉