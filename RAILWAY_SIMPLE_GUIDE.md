# Simple Railway Deployment Guide

## Option 1: Railway Web Dashboard (Easiest)

### Step 1: Go to Railway Dashboard
1. Visit [railway.app](https://railway.app)
2. Click "Login" and sign in with your GitHub account
3. Click "New Project"

### Step 2: Deploy from GitHub
1. Select "Deploy from GitHub repo"
2. Choose your HabitHero-Cursor repository
3. Select the `backend-example` folder
4. Click "Deploy"

### Step 3: Set Environment Variables
1. Click on your deployed project
2. Go to "Variables" tab
3. Add these variables one by one:
   - `API_KEY` = `129c97b630a6e7a036659b3b85cf004c077c3d40dbdcfd8ba6eaa95dd1f092cc`
   - `BUNDLE_ID` = `com.vibecode.habithero`
   - `NODE_ENV` = `production`
   - `PORT` = `3000`

### Step 4: Get Your URL
1. Railway will give you a URL like: `https://habit-hero-backend-production.up.railway.app`
2. Copy this URL

## Option 2: Alternative - Use Render.com (Simpler)

### Step 1: Go to Render
1. Visit [render.com](https://render.com)
2. Sign up with GitHub
3. Click "New +" → "Web Service"

### Step 2: Connect Repository
1. Connect your GitHub repo
2. Select the `backend-example` folder
3. Set these settings:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: `Node`

### Step 3: Set Environment Variables
Add these in the Environment Variables section:
- `API_KEY` = `129c97b630a6e7a036659b3b85cf004c077c3d40dbdcfd8ba6eaa95dd1f092cc`
- `BUNDLE_ID` = `com.vibecode.habithero`
- `NODE_ENV` = `production`
- `PORT` = `3000`

### Step 4: Deploy
1. Click "Create Web Service"
2. Wait for deployment (2-3 minutes)
3. Copy the provided URL

## Option 3: Local Testing (No Deployment)

If you want to test locally first:

### Step 1: Start Backend Locally
```bash
cd backend-example
npm install
npm start
```

### Step 2: Update Frontend
1. Copy `production-config.env` to `.env`
2. Change the backend URL to: `http://localhost:3000`

### Step 3: Test
```bash
# In another terminal
curl http://localhost:3000/health
```

## Which option would you prefer?

1. **Railway Web Dashboard** (most reliable)
2. **Render.com** (simpler interface)
3. **Local testing first** (no deployment needed)

Let me know which one you'd like to try and I'll guide you through it step by step!



