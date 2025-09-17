#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Apple App Store screenshot requirements
const SCREENSHOT_SIZES = {
  'iPhone 6.7"': { width: 1290, height: 2796, name: 'iPhone_6_7' },
  'iPhone 6.5"': { width: 1284, height: 2778, name: 'iPhone_6_5' },
  'iPhone 5.5"': { width: 1242, height: 2208, name: 'iPhone_5_5' }
};

// Create screenshots directory structure
const createScreenshotStructure = () => {
  const screenshotsDir = path.join(__dirname, 'appstore-screenshots');
  
  // Create main directory
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }
  
  // Create subdirectories for each size
  Object.values(SCREENSHOT_SIZES).forEach(size => {
    const sizeDir = path.join(screenshotsDir, size.name);
    if (!fs.existsSync(sizeDir)) {
      fs.mkdirSync(sizeDir, { recursive: true });
    }
  });
  
  console.log('✅ Created screenshot directory structure');
  return screenshotsDir;
};

// Generate screenshot naming guide
const generateNamingGuide = () => {
  const guide = `
# App Store Screenshot Guide

## Required Screenshots for Each Size:

### iPhone 6.7" (1290 x 2796) - iPhone 15 Pro Max, 16 Plus
- 01_Dashboard_Main.png
- 02_Habit_Detail.png  
- 03_Add_Habit.png
- 04_Analytics.png
- 05_Settings.png

### iPhone 6.5" (1284 x 2778) - iPhone 14 Plus, 15 Plus
- 01_Dashboard_Main.png
- 02_Habit_Detail.png
- 03_Add_Habit.png
- 04_Analytics.png
- 05_Settings.png

### iPhone 5.5" (1242 x 2208) - iPhone 8 Plus
- 01_Dashboard_Main.png
- 02_Habit_Detail.png
- 03_Add_Habit.png
- 04_Analytics.png
- 05_Settings.png

## Screenshots You Have:
✅ Dashboard (Main screen with habit cards)
✅ Analytics (Progress insights and charts)
✅ Habit Detail (Individual habit tracking)
✅ Add Habit (Creating new habits)

## Still Needed:
❌ Settings screen (showing pro features)
❌ Onboarding screen (subscription plans)

## Instructions:
1. Take screenshots in iOS Simulator using Cmd+S
2. Save them to the appropriate size folders
3. Name them according to the guide above
4. Ensure they meet the exact pixel dimensions
`;

  fs.writeFileSync(path.join(__dirname, 'SCREENSHOT_GUIDE.md'), guide);
  console.log('✅ Created screenshot naming guide');
};

// Create the structure
const screenshotsDir = createScreenshotStructure();
generateNamingGuide();

console.log(`
📱 App Store Screenshot Setup Complete!

📁 Screenshots directory: ${screenshotsDir}
📋 Naming guide: SCREENSHOT_GUIDE.md

Next steps:
1. Take screenshots in iOS Simulator (Cmd+S)
2. Save them to the appropriate size folders
3. Name them according to the guide
4. Upload to App Store Connect

Current screenshots you have:
✅ Dashboard (Main screen)
✅ Analytics (Progress insights)  
✅ Habit Detail (Individual tracking)
✅ Add Habit (Creation screen)

Still needed:
❌ Settings screen (pro features)
❌ Onboarding screen (subscription)
`);

