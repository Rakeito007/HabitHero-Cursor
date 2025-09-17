#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// App Store required dimensions
const TARGET_WIDTH = 1290;
const TARGET_HEIGHT = 2796;

// Create directories
const createDirectories = () => {
  const dirs = [
    'appstore-ready',
    'appstore-ready/screenshots',
    'appstore-ready/metadata'
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
  
  console.log('✅ Created appstore-ready directory structure');
};

// Check if ImageMagick is installed
const checkImageMagick = () => {
  try {
    execSync('which convert', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
};

// Resize image using ImageMagick
const resizeImage = (inputPath, outputPath) => {
  try {
    const command = `convert "${inputPath}" -resize ${TARGET_WIDTH}x${TARGET_HEIGHT}! "${outputPath}"`;
    execSync(command, { stdio: 'pipe' });
    return true;
  } catch (error) {
    console.error(`❌ Error resizing ${inputPath}:`, error.message);
    return false;
  }
};

// Create App Store metadata
const createMetadata = () => {
  const metadata = {
    appName: "Habit Hero",
    version: "1.0.1",
    buildNumber: "3",
    bundleId: "com.vibecode.habithero",
    screenshots: [
      {
        filename: "01_Dashboard.png",
        description: "Main dashboard showing habit tracking cards with progress visualization"
      },
      {
        filename: "02_Analytics.png", 
        description: "Analytics screen with habit insights and progress charts"
      },
      {
        filename: "03_Habit_Detail.png",
        description: "Individual habit detail view with statistics and activity chart"
      },
      {
        filename: "04_Add_Habit.png",
        description: "Add new habit screen with customization options"
      },
      {
        filename: "05_Settings.png",
        description: "Settings screen showing pro features and app configuration"
      },
      {
        filename: "06_Onboarding.png",
        description: "Onboarding screen with subscription plan options"
      }
    ]
  };
  
  fs.writeFileSync(
    'appstore-ready/metadata/app-info.json', 
    JSON.stringify(metadata, null, 2)
  );
  
  console.log('✅ Created App Store metadata');
};

// Main function
const main = () => {
  console.log('📱 Habit Hero - App Store Screenshot Preparation\n');
  
  // Check ImageMagick
  if (!checkImageMagick()) {
    console.log('❌ ImageMagick not found. Please install it first:');
    console.log('   brew install imagemagick');
    console.log('\nOr manually resize your screenshots to 1290x2796 pixels');
    return;
  }
  
  // Create directories
  createDirectories();
  
  // Create metadata
  createMetadata();
  
  console.log('\n📋 Instructions:');
  console.log('1. Place your screenshots in the current directory');
  console.log('2. Name them: dashboard.png, analytics.png, habit-detail.png, add-habit.png, settings.png, onboarding.png');
  console.log('3. Run: node resize-screenshots.js process');
  console.log('\n📁 Output will be in: appstore-ready/screenshots/');
  console.log('📄 Metadata will be in: appstore-ready/metadata/');
};

// Process screenshots
const processScreenshots = () => {
  const screenshots = [
    { input: 'dashboard.png', output: '01_Dashboard.png' },
    { input: 'analytics.png', output: '02_Analytics.png' },
    { input: 'habit-detail.png', output: '03_Habit_Detail.png' },
    { input: 'add-habit.png', output: '04_Add_Habit.png' },
    { input: 'settings.png', output: '05_Settings.png' },
    { input: 'onboarding.png', output: '06_Onboarding.png' }
  ];
  
  console.log('🔄 Processing screenshots...\n');
  
  screenshots.forEach(({ input, output }) => {
    if (fs.existsSync(input)) {
      console.log(`📸 Resizing ${input}...`);
      const success = resizeImage(input, `appstore-ready/screenshots/${output}`);
      if (success) {
        console.log(`✅ ${output} ready for App Store`);
      }
    } else {
      console.log(`⚠️  ${input} not found - skipping`);
    }
  });
  
  console.log('\n🎉 Screenshot processing complete!');
  console.log('📁 Check appstore-ready/screenshots/ for your resized images');
};

// Run based on command
if (process.argv[2] === 'process') {
  processScreenshots();
} else {
  main();
}
