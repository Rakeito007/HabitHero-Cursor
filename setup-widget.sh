#!/bin/bash

echo "🎯 Setting up Habit Hero Widget for Xcode..."

# Check if we're in the right directory
if [ ! -d "ios/HabitHero.xcworkspace" ]; then
    echo "❌ Error: Please run this script from the HabitHero-Cursor directory"
    echo "Current directory: $(pwd)"
    exit 1
fi

# Create widget directory in ios folder if it doesn't exist
mkdir -p ios/HabitHeroWidget

echo "📁 Widget files are ready in ios/HabitHeroWidget/"
echo ""
echo "🔧 Next steps:"
echo "1. Open Xcode: open ios/HabitHero.xcworkspace"
echo "2. Follow the setup guide: SETUP_WIDGET_XCODE.md"
echo ""
echo "📱 Widget files created:"
ls -la ios/HabitHeroWidget/

echo ""
echo "✅ Ready to add widget extension to Xcode!"
echo "📖 See SETUP_WIDGET_XCODE.md for detailed instructions"
