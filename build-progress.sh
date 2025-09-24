#!/bin/bash

# Real-time Build Progress Monitor
BUILD_ID="bd3e6727-a79c-4ca6-a566-26a2ea201b20"

echo "🚀 Habit Hero Build 16 - Real-time Progress"
echo "=============================================="
echo "Build ID: $BUILD_ID"
echo "SDK Version: 53.0.0 (CORRECT!)"
echo "Started: $(date)"
echo ""

# Function to display progress bar
show_progress() {
    local status=$1
    local elapsed=$2
    
    case $status in
        "in progress")
            echo "⏳ Status: IN PROGRESS"
            echo "⏰ Elapsed: ${elapsed} minutes"
            echo "🔧 Building with correct SDK 53.0.0..."
            ;;
        "finished")
            echo "✅ Status: FINISHED"
            echo "🎉 Build completed successfully!"
            ;;
        "errored")
            echo "❌ Status: ERRORED"
            echo "💥 Build failed - checking logs..."
            ;;
    esac
}

# Monitor loop
while true; do
    clear
    echo "🚀 Habit Hero Build 16 - Real-time Progress"
    echo "=============================================="
    echo "Build ID: $BUILD_ID"
    echo "SDK Version: 53.0.0 (CORRECT!)"
    echo "Started: 8:25 PM"
    echo ""
    
    # Get current time for elapsed calculation
    current_time=$(date +%s)
    start_time=$(date -j -f "%Y-%m-%d %H:%M:%S" "2025-09-21 20:25:21" +%s 2>/dev/null || echo $((current_time - 300)))
    elapsed=$(( (current_time - start_time) / 60 ))
    
    # Check build status
    STATUS=$(eas build:list --platform ios --limit 1 --non-interactive --json | jq -r '.[0].status' 2>/dev/null)
    
    show_progress "$STATUS" "$elapsed"
    
    if [ "$STATUS" = "finished" ]; then
        echo ""
        echo "📱 Downloading IPA file..."
        
        # Get download URL
        DOWNLOAD_URL=$(eas build:list --platform ios --limit 1 --non-interactive --json | jq -r '.[0].artifacts.buildUrl' 2>/dev/null)
        
        if [ "$DOWNLOAD_URL" != "null" ] && [ "$DOWNLOAD_URL" != "" ]; then
            mkdir -p downloads
            curl -L -o "downloads/HabitHero-Build16-v1.0.3.ipa" "$DOWNLOAD_URL"
            
            if [ $? -eq 0 ]; then
                echo "✅ IPA downloaded successfully!"
                echo "📁 Location: $(pwd)/downloads/HabitHero-Build16-v1.0.3.ipa"
                echo "📏 Size: $(ls -lh downloads/HabitHero-Build16-v1.0.3.ipa | awk '{print $5}')"
                echo ""
                echo "🎉 BUILD 16 READY FOR APP STORE!"
                break
            else
                echo "❌ Failed to download IPA"
                break
            fi
        else
            echo "❌ Could not get download URL"
            break
        fi
        
    elif [ "$STATUS" = "errored" ]; then
        echo ""
        echo "🔍 Check logs at:"
        echo "https://expo.dev/accounts/rakeito/projects/habit-hero/builds/$BUILD_ID"
        break
    else
        echo ""
        echo "⏰ Next check in 30 seconds..."
        sleep 30
    fi
done

echo ""
echo "🏁 Build monitoring complete at $(date)"

