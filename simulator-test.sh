#!/bin/bash

# Simulator Test Script for Build 18
BUILD_ID="d00a1876-9e0a-41d7-a1a0-be52a7b312aa"

echo "🧪 Habit Hero Build 18 - Simulator Test Setup"
echo "=============================================="
echo "Build ID: $BUILD_ID"
echo "Version: 1.0.3 (Build 17) - CORRECT!"
echo "Started: $(date)"
echo ""

# Function to check build status
check_build() {
    STATUS=$(eas build:list --platform ios --limit 1 --non-interactive --json | jq -r '.[0].status' 2>/dev/null)
    echo "⏰ Checking build status at $(date +%H:%M:%S)..."
    echo "📊 Status: $STATUS"
    
    if [ "$STATUS" = "finished" ]; then
        return 0
    elif [ "$STATUS" = "errored" ]; then
        return 2
    else
        return 1
    fi
}

# Monitor build
while true; do
    check_build
    result=$?
    
    if [ $result -eq 0 ]; then
        echo ""
        echo "✅ BUILD 18 COMPLETED SUCCESSFULLY!"
        echo "📱 Version: 1.0.3 (Build 17) - Ready for Simulator Test"
        echo ""
        
        # Get download URL
        DOWNLOAD_URL=$(eas build:list --platform ios --limit 1 --non-interactive --json | jq -r '.[0].artifacts.buildUrl' 2>/dev/null)
        
        if [ "$DOWNLOAD_URL" != "null" ] && [ "$DOWNLOAD_URL" != "" ]; then
            echo "📥 Downloading IPA for simulator test..."
            mkdir -p downloads
            curl -L -o "downloads/HabitHero-Build18-v1.0.3.ipa" "$DOWNLOAD_URL"
            
            if [ $? -eq 0 ]; then
                echo "✅ IPA downloaded successfully!"
                echo "📁 Location: $(pwd)/downloads/HabitHero-Build18-v1.0.3.ipa"
                echo "📏 Size: $(ls -lh downloads/HabitHero-Build18-v1.0.3.ipa | awk '{print $5}')"
                echo ""
                echo "🧪 SIMULATOR TEST OPTIONS:"
                echo "=========================="
                echo ""
                echo "Option 1 - Install via Simulator:"
                echo "1. Open iOS Simulator"
                echo "2. Drag & drop the IPA file onto the simulator"
                echo "3. The app will install and launch"
                echo ""
                echo "Option 2 - Install via Xcode:"
                echo "1. Open Xcode"
                echo "2. Window → Devices and Simulators"
                echo "3. Select your simulator"
                echo "4. Drag & drop the IPA file"
                echo ""
                echo "Option 3 - Install via Command Line:"
                echo "xcrun simctl install booted downloads/HabitHero-Build18-v1.0.3.ipa"
                echo ""
                echo "🎯 Ready to test Build 18 in simulator!"
                break
            else
                echo "❌ Failed to download IPA"
                break
            fi
        else
            echo "❌ Could not get download URL"
            break
        fi
        
    elif [ $result -eq 2 ]; then
        echo ""
        echo "❌ BUILD 18 FAILED!"
        echo "🔍 Check logs: https://expo.dev/accounts/rakeito/projects/habit-hero/builds/$BUILD_ID"
        break
        
    else
        echo "⏳ Build still in progress... waiting 2 minutes"
        sleep 120
    fi
done

echo ""
echo "🏁 Build monitoring complete at $(date)"

