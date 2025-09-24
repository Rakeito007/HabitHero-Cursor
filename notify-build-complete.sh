#!/bin/bash

# Build Completion Notifier
BUILD_ID="bd3e6727-a79c-4ca6-a566-26a2ea201b20"

echo "🔔 Monitoring Build 16 for completion..."
echo "Build ID: $BUILD_ID"
echo "Started: $(date)"
echo ""

while true; do
    # Check build status
    STATUS=$(eas build:list --platform ios --limit 1 --non-interactive --json | jq -r '.[0].status' 2>/dev/null)
    
    if [ "$STATUS" = "finished" ]; then
        echo ""
        echo "🎉🎉🎉 BUILD 16 COMPLETED! 🎉🎉🎉"
        echo "=================================="
        echo "✅ Status: FINISHED"
        echo "⏰ Completed: $(date)"
        echo ""
        
        # Get download URL
        DOWNLOAD_URL=$(eas build:list --platform ios --limit 1 --non-interactive --json | jq -r '.[0].artifacts.buildUrl' 2>/dev/null)
        
        if [ "$DOWNLOAD_URL" != "null" ] && [ "$DOWNLOAD_URL" != "" ]; then
            echo "📱 Downloading IPA file..."
            mkdir -p downloads
            curl -L -o "downloads/HabitHero-Build16-v1.0.3.ipa" "$DOWNLOAD_URL"
            
            if [ $? -eq 0 ]; then
                echo "✅ IPA downloaded successfully!"
                echo "📁 Location: $(pwd)/downloads/HabitHero-Build16-v1.0.3.ipa"
                echo "📏 Size: $(ls -lh downloads/HabitHero-Build16-v1.0.3.ipa | awk '{print $5}')"
                echo ""
                echo "🚀 READY FOR APP STORE SUBMISSION!"
                echo "📋 Version: 1.0.3 (Build 16)"
                echo "🔗 Build URL: https://expo.dev/accounts/rakeito/projects/habit-hero/builds/$BUILD_ID"
            else
                echo "❌ Failed to download IPA"
            fi
        else
            echo "❌ Could not get download URL"
        fi
        break
        
    elif [ "$STATUS" = "errored" ]; then
        echo ""
        echo "❌❌❌ BUILD 16 FAILED! ❌❌❌"
        echo "=============================="
        echo "💥 Status: ERRORED"
        echo "⏰ Failed: $(date)"
        echo "🔍 Check logs: https://expo.dev/accounts/rakeito/projects/habit-hero/builds/$BUILD_ID"
        break
        
    else
        # Show progress every 2 minutes
        echo "⏳ Still building... (Status: $STATUS) - $(date +%H:%M:%S)"
        sleep 120
    fi
done

echo ""
echo "🏁 Build monitoring complete at $(date)"

