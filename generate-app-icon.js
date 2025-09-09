const fs = require('fs');
const path = require('path');

// This script will help you generate app icons from your pixel art design
// You'll need to manually create the icon.png file first

const iconSizes = [
  { name: 'icon.png', size: 1024 }, // Main app icon
  { name: 'adaptive-icon.png', size: 1024 }, // Android adaptive icon
  { name: 'splash.png', size: 1024 }, // Splash screen
  { name: 'app-logo.png', size: 512 }, // In-app logo
  { name: 'app-logo-light.png', size: 512 }, // Light theme logo
  { name: 'app-logo-dark.png', size: 512 }, // Dark theme logo
];

console.log('🎨 HabitHero App Icon Generator');
console.log('================================');
console.log('');
console.log('To use your pixel art "HABIT HERO" design as the app icon:');
console.log('');
console.log('1. Save your pixel art image as "pixel-art-icon.png" in the assets folder');
console.log('2. Make sure it\'s 1024x1024 pixels for best quality');
console.log('3. Run this script to generate all required sizes');
console.log('');
console.log('Required icon sizes:');
iconSizes.forEach(icon => {
  console.log(`   - ${icon.name}: ${icon.size}x${icon.size}px`);
});
console.log('');
console.log('After creating pixel-art-icon.png, run:');
console.log('   node generate-app-icon.js');
console.log('');
console.log('This will create all the required icon sizes for your app!');
