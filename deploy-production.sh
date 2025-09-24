#!/bin/bash

# Habit Hero Production Deployment Script
# This script deploys the backend to Railway for production

echo "🚀 Deploying Habit Hero Backend to Production..."

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

# Login to Railway
echo "🔐 Logging into Railway..."
railway login

# Initialize Railway project
echo "📦 Initializing Railway project..."
railway init

# Set environment variables
echo "🔧 Setting environment variables..."
railway variables set NODE_ENV=production
railway variables set API_KEY=habit-hero-api-key-2024

echo "⚠️  IMPORTANT: You need to set your Apple App Store Shared Secret:"
echo "   railway variables set APPLE_SHARED_SECRET=your_shared_secret_here"
echo ""
echo "   Get your shared secret from:"
echo "   https://appstoreconnect.apple.com → Your App → App Information"

# Deploy to Railway
echo "🚀 Deploying to Railway..."
railway up

# Get the deployment URL
echo "✅ Deployment complete!"
echo "📱 Your backend URL:"
railway domain

echo ""
echo "🎉 Backend deployed successfully!"
echo "📝 Next steps:"
echo "   1. Set your Apple App Store Shared Secret"
echo "   2. Update your app's backend URL"
echo "   3. Build and submit to App Store"





