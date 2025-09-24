#!/bin/bash

echo "🚀 Deploying Habit Hero Backend to Production..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo -e "${YELLOW}Railway CLI not found. Installing...${NC}"
    npm install -g @railway/cli
fi

# Check if user is logged in to Railway
if ! railway whoami &> /dev/null; then
    echo -e "${YELLOW}Please log in to Railway first:${NC}"
    railway login
fi

# Check if .env file exists in backend-example
if [ ! -f "backend-example/.env" ]; then
    echo -e "${YELLOW}Creating .env file from template...${NC}"
    cp backend-example/env.production.example backend-example/.env
    echo -e "${RED}⚠️  IMPORTANT: Please update backend-example/.env with your actual values before deploying!${NC}"
    echo -e "${BLUE}Required values:${NC}"
    echo "  - API_KEY: Generate a secure random string"
    echo "  - APPLE_SHARED_SECRET: From App Store Connect"
    echo "  - APPLE_ISSUER_ID: From App Store Connect"
    echo "  - APPLE_KEY_ID: From App Store Connect"
    echo "  - APPLE_PRIVATE_KEY: From App Store Connect (your .p8 key content)"
    echo ""
    read -p "Press Enter after updating .env file..."
fi

# Navigate to backend directory
cd backend-example

# Install dependencies
echo -e "${BLUE}Installing dependencies...${NC}"
npm install

# Deploy to Railway
echo -e "${BLUE}Deploying to Railway...${NC}"
railway up

# Get the deployed URL
echo -e "${BLUE}Getting deployment URL...${NC}"
DEPLOYED_URL=$(railway domain)

if [ ! -z "$DEPLOYED_URL" ]; then
    echo -e "${GREEN}✅ Backend deployed successfully!${NC}"
    echo -e "${GREEN}🌐 Backend URL: https://$DEPLOYED_URL${NC}"
    echo -e "${GREEN}🔗 Health Check: https://$DEPLOYED_URL/health${NC}"
    echo -e "${GREEN}📱 Webhook URL: https://$DEPLOYED_URL/webhooks/apple${NC}"
    echo ""
    echo -e "${YELLOW}Next steps:${NC}"
    echo "1. Update your frontend .env file with the new backend URL:"
    echo "   EXPO_PUBLIC_BACKEND_URL=https://$DEPLOYED_URL"
    echo ""
    echo "2. Configure the webhook URL in App Store Connect:"
    echo "   https://$DEPLOYED_URL/webhooks/apple"
    echo ""
    echo "3. Test the backend endpoints:"
    echo "   curl https://$DEPLOYED_URL/health"
    echo ""
    echo "4. Set up your Apple Store Server API credentials in Railway:"
    echo "   - Go to Railway dashboard"
    echo "   - Select your project"
    echo "   - Go to Variables tab"
    echo "   - Add the environment variables from your .env file"
else
    echo -e "${RED}❌ Deployment failed or URL not found${NC}"
    echo "Check Railway dashboard for deployment status"
fi

cd ..



