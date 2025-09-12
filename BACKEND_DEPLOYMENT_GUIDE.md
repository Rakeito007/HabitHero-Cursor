# Backend Deployment Guide

## Quick Deployment Options

### Option 1: Railway (Recommended)
1. Go to [Railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository and choose the `backend-example` folder
5. Railway will automatically detect it's a Node.js app and deploy it
6. Copy the generated URL (e.g., `https://habit-hero-backend-production.up.railway.app`)

### Option 2: Render
1. Go to [Render.com](https://render.com)
2. Sign up with GitHub
3. Click "New" → "Web Service"
4. Connect your GitHub repository
5. Select the `backend-example` folder
6. Set:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
7. Deploy and copy the URL

### Option 3: Vercel
1. Go to [Vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Import your repository
4. Select the `backend-example` folder
5. Deploy and copy the URL

## Environment Variables
After deployment, set these environment variables in your hosting platform:

```
APPLE_ISSUER_ID=your_issuer_id
APPLE_KEY_ID=your_key_id
APPLE_PRIVATE_KEY=your_private_key_content
APPLE_SHARED_SECRET=your_shared_secret
```

## Test Your Deployment
Once deployed, test these endpoints:
- `GET /health` - Should return `{"status":"OK"}`
- `POST /api/webhooks/apple` - Should return `{"success":true}`

## Update App Configuration
After getting your backend URL, update your `.env` file:
```
EXPO_PUBLIC_BACKEND_URL=https://your-deployed-backend-url.com
```

## Next Steps
1. Deploy backend using one of the options above
2. Get the backend URL
3. Update app configuration
4. Build app for production
5. Submit to App Store
