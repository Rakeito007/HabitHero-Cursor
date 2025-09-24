const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// App Store Connect screenshot requirements
const screenshotSizes = {
  'iPhone-6.7-Portrait': { width: 1242, height: 2688, name: 'iPhone 6.7" Portrait' },
  'iPhone-6.7-Landscape': { width: 2688, height: 1242, name: 'iPhone 6.7" Landscape' },
  'iPhone-6.5-Portrait': { width: 1284, height: 2778, name: 'iPhone 6.5" Portrait' },
  'iPhone-6.5-Landscape': { width: 2778, height: 1284, name: 'iPhone 6.5" Landscape' }
};

async function resizeScreenshots(inputPath) {
  if (!fs.existsSync(inputPath)) {
    console.log('❌ Input file not found:', inputPath);
    return;
  }

  console.log('📱 Resizing screenshots for App Store Connect...');
  
  for (const [key, size] of Object.entries(screenshotSizes)) {
    const outputPath = `appstore-ready/screenshots/${key}_Dashboard.png`;
    
    try {
      await sharp(inputPath)
        .resize(size.width, size.height, {
          fit: 'cover',
          position: 'center'
        })
        .png()
        .toFile(outputPath);
      
      console.log(`✅ Created ${size.name} screenshot: ${outputPath}`);
    } catch (error) {
      console.log(`❌ Error creating ${size.name} screenshot:`, error.message);
    }
  }
  
  console.log('🎯 All screenshots resized for App Store Connect!');
}

// Get input file from command line argument
const inputFile = process.argv[2];
if (!inputFile) {
  console.log('Usage: node resize-screenshots.js <input-image-path>');
  console.log('Example: node resize-screenshots.js dashboard-screenshot.png');
  process.exit(1);
}

resizeScreenshots(inputFile);