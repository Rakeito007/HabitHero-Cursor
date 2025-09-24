#!/bin/bash

# Habit Hero Build 16 Monitor
# Monitoring the fresh Build 16

BUILD_ID="38546b15-e809-4656-9712-87cc347e0070"
PROJECT_NAME="@rakeito/habit-hero"

echo "🚀 Monitoring Habit Hero Build 16 (Fresh Start)..."
echo "Build ID: $BUILD_ID"
echo "Started: $(date)"
echo ""

while true; do
    echo "⏰ Checking build status at $(date +%H:%M:%S)..."
    
    # Check build status
    STATUS=$(eas build:list --platform ios --limit 1 --non-interactive --json | jq -r '.[0].status' 2>/dev/null)
    
    if [ "$STATUS" = "finished" ]; then
        echo "✅ Build 16 completed successfully!"
        
        # Get the download URL
        DOWNLOAD_URL=$(eas build:list --platform ios --limit 1 --non-interactive --json | jq -r '.[0].artifacts.buildUrl' 2>/dev/null)
        
        if [ "$DOWNLOAD_URL" != "null" ] && [ "$DOWNLOAD_URL" != "" ]; then
            echo "📱 Downloading IPA file..."
            
            # Create downloads directory
            mkdir -p downloads
            
            # Download the IPA
            curl -L -o "downloads/HabitHero-Build16-v1.0.3.ipa" "$DOWNLOAD_URL"
            
            if [ $? -eq 0 ]; then
                echo "✅ IPA downloaded successfully!"
                echo "📁 Location: $(pwd)/downloads/HabitHero-Build16-v1.0.3.ipa"
                echo ""
                echo "🎉 BUILD 16 READY FOR APP STORE!"
                echo "📱 IPA File: HabitHero-Build16-v1.0.3.ipa"
                echo "📏 Size: $(ls -lh downloads/HabitHero-Build16-v1.0.3.ipa | awk '{print $5}')"
                echo "📋 Version: 1.0.3 (Build 16)"
                echo ""
                echo "🚀 Next steps:"
                echo "1. Upload to App Store Connect"
                echo "2. Configure subscription products"
                echo "3. Submit for review"
                break
            else
                echo "❌ Failed to download IPA file"
                break
            fi
        else
            echo "❌ Could not get download URL"
            break
        fi
        
    elif [ "$STATUS" = "errored" ]; then
        echo "❌ Build 16 failed!"
        echo "Check the logs at: https://expo.dev/accounts/rakeito/projects/habit-hero/builds/$BUILD_ID"
        break
        
    else
        echo "⏳ Build 16 still in progress... (Status: $STATUS)"
        echo "⏰ Waiting 2 minutes before next check..."
        sleep 120
    fi
done

echo "🏁 Build 16 monitoring complete at $(date)"
