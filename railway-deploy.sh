#!/bin/bash

# Deploy Habit Hero Backend to Railway
# This script will deploy your backend API for secure payments

echo "🚀 Deploying Habit Hero Backend to Railway..."

# Install Railway CLI if not installed
if ! command -v railway &> /dev/null; then
    echo "📦 Installing Railway CLI..."
    npm install -g @railway/cli
fi

# Login to Railway
echo "🔐 Logging into Railway..."
railway login

# Create new project
echo "🏗️ Creating Railway project..."
railway project create habit-hero-backend

# Set environment variables
echo "⚙️ Setting environment variables..."
railway variables set NODE_ENV=production
railway variables set PORT=3000
railway variables set APPLE_BUNDLE_ID=com.vibecode.habithero
railway variables set API_KEY=$(openssl rand -hex 32)

echo "📝 Please set your Apple App Store Connect Shared Secret:"
echo "   Run: railway variables set APPLE_SHARED_SECRET=your_shared_secret_here"
echo "   Get it from: https://appstoreconnect.apple.com/ → Your App → App Information"

# Deploy the backend
echo "🚀 Deploying backend..."
railway up

echo "✅ Backend deployed! Get your URL with: railway domain"
echo "🔗 Your backend URL will be: https://habit-hero-backend-production.up.railway.app"






