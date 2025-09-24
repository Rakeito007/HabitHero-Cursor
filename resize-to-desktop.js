const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Get desktop path
const desktopPath = path.join(os.homedir(), 'Desktop');

// App Store Connect screenshot requirements
const screenshotSizes = {
  'iPhone-6.7-Portrait': { width: 1242, height: 2688, name: 'iPhone 6.7" Portrait' },
  'iPhone-6.7-Landscape': { width: 2688, height: 1242, name: 'iPhone 6.7" Landscape' },
  'iPhone-6.5-Portrait': { width: 1284, height: 2778, name: 'iPhone 6.5" Portrait' },
  'iPhone-6.5-Landscape': { width: 2778, height: 1284, name: 'iPhone 6.5" Landscape' }
};

async function resizeToDesktop(inputPath) {
  if (!fs.existsSync(inputPath)) {
    console.log('❌ Input file not found:', inputPath);
    console.log('📱 Please save your screenshot as "main-screenshot.png" in this folder first');
    return;
  }

  console.log('📱 Resizing screenshots for App Store Connect...');
  console.log('📁 Saving to Desktop for easy access...');
  
  for (const [key, size] of Object.entries(screenshotSizes)) {
    const outputPath = path.join(desktopPath, `HabitHero_${key}.png`);
    
    try {
      await sharp(inputPath)
        .resize(size.width, size.height, {
          fit: 'cover',
          position: 'center'
        })
        .png()
        .toFile(outputPath);
      
      console.log(`✅ Created ${size.name}: ${outputPath}`);
    } catch (error) {
      console.log(`❌ Error creating ${size.name}:`, error.message);
    }
  }
  
  console.log('🎉 All screenshots saved to your Desktop!');
  console.log('📱 You can now easily upload these to App Store Connect!');
}

// Get input file from command line argument
const inputFile = process.argv[2];
if (!inputFile) {
  console.log('Usage: node resize-to-desktop.js <input-image-path>');
  console.log('Example: node resize-to-desktop.js main-screenshot.png');
  process.exit(1);
}

resizeToDesktop(inputFile);

