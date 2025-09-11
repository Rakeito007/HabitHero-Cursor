# 🧪 HabitHero Testing Checklist

## ✅ **Pre-Submission Testing**

### **1. App Functionality Tests**
- [ ] **Onboarding Flow**
  - [ ] App launches successfully
  - [ ] Onboarding screen displays correctly
  - [ ] Free plan selection works
  - [ ] Subscription plans display properly
  - [ ] Navigation to main app works

- [ ] **Habit Management**
  - [ ] Add new habit works
  - [ ] Edit habit works
  - [ ] Delete habit works
  - [ ] Complete habit works
  - [ ] Habit streak calculation works
  - [ ] Free plan limit (3 habits) enforced

- [ ] **Settings & Navigation**
  - [ ] Settings screen opens
  - [ ] Theme switching works (light/dark)
  - [ ] Notification settings work
  - [ ] Privacy policy opens
  - [ ] Terms of use opens
  - [ ] Data export works (Pro feature)
  - [ ] Data import works

- [ ] **Pro Features**
  - [ ] Analytics screen opens (Pro only)
  - [ ] Unlimited habits (Pro only)
  - [ ] Data export (Pro only)
  - [ ] Upgrade prompts display correctly

### **2. Subscription Testing (Sandbox)**
- [ ] **Monthly Subscription**
  - [ ] Purchase flow works
  - [ ] Receipt validation works
  - [ ] Subscription status updates
  - [ ] Pro features unlock

- [ ] **Lifetime Purchase**
  - [ ] Purchase flow works
  - [ ] Receipt validation works
  - [ ] Pro features unlock permanently

- [ ] **Purchase Restoration**
  - [ ] Restore purchases works
  - [ ] Previous purchases restored
  - [ ] Subscription status correct

### **3. Backend Testing**
- [ ] **Webhook Endpoint**
  - [ ] Webhook URL accessible
  - [ ] Receipt validation works
  - [ ] Subscription status updates
  - [ ] Error handling works

- [ ] **API Endpoints**
  - [ ] Health check works
  - [ ] Receipt validation endpoint works
  - [ ] Subscription status endpoint works

### **4. App Store Guidelines Compliance**
- [ ] **Content**
  - [ ] No objectionable content
  - [ ] Appropriate age rating (4+)
  - [ ] No misleading claims

- [ ] **Privacy**
  - [ ] Privacy policy accurate
  - [ ] No data collection
  - [ ] Local data storage only

- [ ] **Subscriptions**
  - [ ] Clear pricing display
  - [ ] Subscription terms visible
  - [ ] Auto-renewal disclosure
  - [ ] Cancellation information

### **5. Performance Testing**
- [ ] **App Performance**
  - [ ] App launches quickly
  - [ ] Smooth animations
  - [ ] No memory leaks
  - [ ] Responsive UI

- [ ] **Network Performance**
  - [ ] Offline functionality works
  - [ ] Network errors handled gracefully
  - [ ] Loading states display

## 🚀 **Quick Test Commands**

### **Start Development Server**
```bash
npx expo start --clear
```

### **Test on iOS Simulator**
```bash
npx expo start --ios
```

### **Test on Physical Device**
```bash
npx expo start --go
# Scan QR code with Expo Go app
```

### **Build for Testing**
```bash
# Build for simulator
npx expo build:ios --type simulator

# Build for device
npx expo build:ios --type archive
```

## 🐛 **Common Issues & Solutions**

### **Issue: App crashes on launch**
- **Solution**: Check for missing dependencies or configuration errors
- **Command**: `npx expo doctor`

### **Issue: Subscription not working**
- **Solution**: Verify App Store Connect configuration and backend deployment
- **Check**: Product IDs match exactly

### **Issue: Backend not responding**
- **Solution**: Check deployment logs and environment variables
- **Test**: `curl https://your-backend-url.com/health`

### **Issue: Build fails**
- **Solution**: Clear cache and reinstall dependencies
- **Commands**: 
  ```bash
  npx expo install --fix
  npx expo start --clear
  ```

## 📱 **Device Testing**

### **Test on Multiple Devices**
- [ ] iPhone (latest iOS)
- [ ] iPad (if supported)
- [ ] Different screen sizes
- [ ] Different iOS versions

### **Test Scenarios**
- [ ] Fresh install
- [ ] App update
- [ ] Subscription renewal
- [ ] Subscription cancellation
- [ ] Data export/import
- [ ] Theme switching

## ✅ **Final Checklist Before Submission**

- [ ] All tests pass
- [ ] App builds successfully
- [ ] No console errors
- [ ] Backend deployed and working
- [ ] App Store Connect configured
- [ ] Screenshots ready
- [ ] App description written
- [ ] Privacy policy URL set
- [ ] Terms of use URL set

## 🎉 **Ready for Submission!**

Once all tests pass, your app is ready for App Store submission!
