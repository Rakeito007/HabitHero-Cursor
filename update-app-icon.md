# 🎨 Update HabitHero App Icon

## Current Status
Your HabitHero app is running with the existing icon. To use your pixel art "HABIT HERO" design:

## Steps to Update the Icon

### 1. Prepare Your Pixel Art Image
- Save your pixel art "HABIT HERO" design as `pixel-art-icon.png`
- Make it **1024x1024 pixels** for best quality
- Place it in the `/assets/` folder

### 2. Generate All Required Sizes
The app needs these icon sizes:
- `icon.png` (1024x1024) - Main app icon
- `adaptive-icon.png` (1024x1024) - Android adaptive icon  
- `splash.png` (1024x1024) - Splash screen
- `app-logo.png` (512x512) - In-app logo
- `app-logo-light.png` (512x512) - Light theme logo
- `app-logo-dark.png` (512x512) - Dark theme logo

### 3. Quick Method (if you have the pixel art file)
```bash
# If you have ImageMagick installed:
convert pixel-art-icon.png -resize 1024x1024 assets/icon.png
convert pixel-art-icon.png -resize 1024x1024 assets/adaptive-icon.png
convert pixel-art-icon.png -resize 1024x1024 assets/splash.png
convert pixel-art-icon.png -resize 512x512 assets/app-logo.png
convert pixel-art-icon.png -resize 512x512 assets/app-logo-light.png
convert pixel-art-icon.png -resize 512x512 assets/app-logo-dark.png
```

### 4. Alternative: Use Online Tools
- Upload your pixel art to an online icon generator
- Generate all required sizes
- Replace the files in the `/assets/` folder

### 5. Test the New Icon
After updating the icons:
```bash
npx expo start --clear
```
Then scan the QR code to see your new pixel art icon!

## Current App Status
✅ Expo server is running  
✅ QR code is displayed  
✅ Ready to test with new icon  

The app will automatically use the new icon once you replace the files in the assets folder.
