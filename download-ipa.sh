#!/bin/bash
# Direct download script for Habit Hero .ipa file

echo "📱 Downloading Habit Hero .ipa file..."
echo "Version: 1.0.1 | Build: 13"
echo ""

# Download the .ipa file directly
curl -L -o "HabitHero-v1.0.1-build13.ipa" "https://expo.dev/artifacts/eas/6HWzfRuotDLSMeWymUkSg6.ipa"

if [ $? -eq 0 ]; then
    echo "✅ Download complete!"
    echo "📁 File saved as: HabitHero-v1.0.1-build13.ipa"
    echo "🚀 Ready to upload to App Store Connect!"
else
    echo "❌ Download failed. Please try again."
fi
