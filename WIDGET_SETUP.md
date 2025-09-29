# 📱 Habit Hero Widget Setup Guide

## Overview
This guide explains how to set up the iOS widget extension for Habit Hero, allowing users to add habit cards directly to their home screen.

## 🎯 Features
- **Quick Habit Completion**: Tap to complete habits directly from the home screen
- **Live Data**: Shows current streak, completion rate, and progress
- **Beautiful Design**: Customizable widgets with habit colors and icons
- **Multiple Sizes**: Support for small and medium widget sizes
- **Pro Gating**: Free users get 3 widgets, PRO users get unlimited

## 📋 Setup Steps

### 1. Add Widget Extension to Xcode Project

1. Open `ios/HabitHero.xcworkspace` in Xcode
2. File → New → Target
3. Choose "Widget Extension"
4. Product Name: `HabitHeroWidget`
5. Bundle Identifier: `com.vibecode.habithero.widget`
6. Include Configuration Intent: ✅ **YES**
7. Click "Finish"

### 2. Add Widget Files

Copy the following files to the widget extension target:

```
ios/HabitHeroWidget/
├── HabitHeroWidget.swift
├── HabitSelectionIntent.swift
├── HabitProvider.swift
└── Info.plist
```

### 3. Configure App Groups

1. Select the main app target
2. Go to "Signing & Capabilities"
3. Add "App Groups" capability
4. Add group: `group.com.vibecode.habithero`
5. Repeat for the widget extension target

### 4. Update Widget Extension Target

1. Select the widget extension target
2. Go to "Build Settings"
3. Set "Deployment Target" to iOS 15.0
4. Add the following to "Other Linker Flags":
   - `-weak_framework WidgetKit`
   - `-weak_framework Intents`

### 5. Configure Intent Definition

1. Create a new file: `HabitSelectionIntent.intentdefinition`
2. Add the following intents:
   - `HabitSelectionIntent` (with `habitId` parameter)
   - `CompleteHabitIntent` (with `habitId` parameter)
3. Add to both app and widget targets

## 🔧 Implementation Details

### Data Sharing
- Uses App Groups to share data between app and widget
- Widget data is updated when habits change
- Real-time completion status updates

### Widget Sizes
- **Small (2x2)**: Shows habit name, streak, and completion button
- **Medium (4x2)**: Shows additional progress bar and completion rate

### User Experience
1. User selects habits in app settings
2. User adds widget to home screen
3. Widget shows selected habit with live data
4. User can complete habits directly from widget
5. Data syncs back to main app

## 🎨 Widget Design

### Visual Elements
- **Background**: Black rounded rectangle
- **Habit Icon**: SF Symbol with habit color
- **Habit Name**: White text, truncated if needed
- **Streak**: Orange flame icon with count
- **Completion Rate**: Green chart icon with percentage
- **Progress Bar**: Colored bar showing completion
- **Complete Button**: Rounded button with habit color

### Layout (Small Widget)
```
┌─────────────────┐
│ 🏃 Exercise     │
│ 🔥 7 day streak │
│ 📊 85% complete │
│ ████████░░ 85%  │
│     [Complete]  │
└─────────────────┘
```

## 🚀 Testing

### Simulator Testing
1. Build and run the app
2. Add some habits
3. Go to Settings → Widget Settings
4. Select habits for widgets
5. Long press home screen → Add Widget
6. Search for "Habit Hero"
7. Add widget and test completion

### Device Testing
1. Install on physical device
2. Follow same steps as simulator
3. Test widget interactions
4. Verify data sync between app and widget

## 📱 User Instructions

### Adding Widgets
1. Open Habit Hero app
2. Go to Settings → Widget Settings
3. Select habits you want as widgets
4. Long press on home screen
5. Tap the "+" button
6. Search for "Habit Hero"
7. Choose widget size
8. Select your habit
9. Tap "Add Widget"

### Using Widgets
- **View Progress**: See current streak and completion rate
- **Complete Habit**: Tap the "Complete" button
- **Update Data**: Widget refreshes automatically

## 🔒 Pro Features
- **Free Users**: Up to 3 habit widgets
- **PRO Users**: Unlimited habit widgets
- **Upgrade Prompt**: Shown when limit reached

## 🐛 Troubleshooting

### Common Issues
1. **Widget not showing data**: Check App Groups configuration
2. **Completion not syncing**: Verify intent handling
3. **Widget not updating**: Check timeline refresh policy
4. **Build errors**: Ensure all files are in correct targets

### Debug Steps
1. Check Xcode console for widget logs
2. Verify App Groups are properly configured
3. Test data sharing between app and widget
4. Check intent definitions are correct

## 📈 Future Enhancements
- **Large Widget**: Show multiple habits
- **Customization**: More widget themes and layouts
- **Smart Suggestions**: AI-powered habit recommendations
- **Complications**: Apple Watch support
- **Shortcuts**: Siri integration for habit completion

## 🎉 Success!
Once set up, users will be able to:
- Add beautiful habit widgets to their home screen
- Complete habits with a single tap
- See live progress and streak data
- Enjoy a seamless habit tracking experience

The widget feature adds significant value to Habit Hero and provides users with quick access to their most important habits! 🚀
