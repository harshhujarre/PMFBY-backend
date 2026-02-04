# PMFBY Deployment Guide

Complete guide for deploying the PMFBY (Pradhan Mantri Fasal Bima Yojana) application to production.

## 🏗️ Architecture

- **Backend**: Express.js API (deployed to Render.com)
- **Frontend**: Vite + React (deployed to Vercel)
- **Data**: In-memory storage (demo purposes - data resets on server restart

)

---

## 📦 Backend Deployment (Render)

### Prerequisites

- GitHub account
- Render.com account (free tier works)
- Git repository with your code

### Step 1: Push Code to GitHub

```bash
cd c:\Documents\sold_projects\PMFBY
git init
git add .
git commit -m "Initial commit - PMFBY application"
git remote add origin <your-github-repo-url>
git push -u origin main
```

### Step 2: Create Render Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure settings:
   - **Name**: `pmfby-backend` (or your choice)
   - **Region**: Oregon (or nearest to you)
   - **Branch**: `main`
   - **Root Directory**: `.` (root)
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

5. Add Environment Variables:
   - Click "Advanced" → "Add Environment Variable"
   - Add: `NODE_ENV` = `production`
   - Add: `FRONTEND_URL` = `https://your-app.vercel.app` (add this after frontend deployment)

6. Click "Create Web Service"

### Step 3: Wait for Deployment

- Render will automatically build and deploy
- Wait for "Live" status (3-5 minutes)
- Note your backend URL: `https://pmfby-backend.onrender.com`

### Step 4: Test Backend

Visit `https://your-backend-url.onrender.com/api/health`

Expected response:

```json
{
  "status": "healthy",
  "timestamp": "2026-02-04T12:00:00.000Z",
  "environment": "production"
}
```

---

## 🚀 Frontend Deployment (Vercel)

### Prerequisites

- Vercel account (free tier works)
- Backend deployed and URL noted

### Step 1: Update Environment Variable

Edit `client/.env.production`:

```env
VITE_API_BASE_URL=https://your-backend-url.onrender.com
```

Commit this change:

```bash
git add client/.env.production
git commit -m "Update production API URL"
git push
```

### Step 2: Deploy to Vercel

#### Option A: Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend
cd client

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

#### Option B: Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. Add Environment Variable:
   - Key: `VITE_API_BASE_URL`
   - Value: `https://your-backend-url.onrender.com`

6. Click "Deploy"

### Step 3: Update Backend CORS

After getting your Vercel URL (e.g., `https://pmfby.vercel.app`):

1. Go to Render Dashboard
2. Select your backend service
3. Go to "Environment"
4. Update `FRONTEND_URL` to your Vercel URL
5. Save changes (triggers auto-redeploy)

---

## ✅ Post-Deployment Verification

### 1. Test Frontend

- Visit your Vercel URL
- Map should load with satellite imagery
- Farm polygons should appear with green/yellow overlays

### 2. Test API Connection

- Open browser DevTools (F12) → Network tab
- Should see successful API calls to your Render backend
- No CORS errors in Console

### 3. Test Features

- ✅ Map displays all 8 farms
- ✅ Click on farm plots shows farmer details
- ✅ Officer Dashboard loads
- ✅ "Show Stats" button works
- ✅ Claims section displays data

### 4. Check NDVI Monitoring

- Wait 5 minutes
- NDVI data should update (check browser console logs)
- Alerts should generate for farms

---

## 🔧 Troubleshooting

### CORS Errors

**Problem**: Console shows "CORS policy" errors

**Solution**:

1. Verify `FRONTEND_URL` in Render matches your Vercel URL exactly
2. Include `https://` protocol
3. No trailing slash
4. Wait 1-2 minutes for Render to redeploy

### API Not Connecting

**Problem**: API calls fail or timeout

**Solution**:

1. Check `VITE_API_BASE_URL` in Vercel environment variables
2. Verify Render service is "Live" (not sleeping)
3. Test health endpoint: `https://your-backend.onrender.com/api/health`

### Build Failures

**Backend Build Fails**:

- Check Node version (requires >=18.0.0)
- Verify `package.json` is at repository root
- Check Render build logs

**Frontend Build Fails**:

- Check root directory is set to `client`
- Verify `package.json` exists in `client/` folder
- Check Vercel build logs

### Free Tier Limitations

**Render Free Tier**:

- Server spins down after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds
- Data resets on every redeploy/restart

**Solution**: Upgrade to paid tier for 24/7 uptime and persistent data

---

## 🔄 Future Updates

### Update Backend

```bash
git add .
git commit -m "Backend updates"
git push
```

Render auto-deploys on push to `main` branch.

### Update Frontend

```bash
cd client
git add .
git commit -m "Frontend updates"
git push
```

Vercel auto-deploys on push to `main` branch.

---

## 📝 Environment Variables Reference

### Backend (.env on Render)

```env
NODE_ENV=production
PORT=10000  # Auto-set by Render
FRONTEND_URL=https://your-app.vercel.app
```

### Frontend (.env on Vercel)

```env
VITE_API_BASE_URL=https://your-backend.onrender.com
```

---

## 🎯 Production URLs

After deployment, save your URLs:

- **Frontend**: `https://__________.vercel.app`
- **Backend API**: `https://__________.onrender.com`
- **Health Check**: `https://__________.onrender.com/api/health`

---

## 💡 Tips

1. **Custom Domain**: Both Render and Vercel support custom domains (free on Vercel, paid on Render)
2. **Monitoring**: Use Render's logs and Vercel's analytics for monitoring
3. **Performance**: Render free tier has cold starts; consider keeping it warm with a cron job
4. **Scaling**: Both platforms auto-scale; Vercel is serverless, Render needs manual scaling

---

## ⚠️ Important Notes

- **Data Persistence**: Current implementation uses in-memory storage
- **Free Tier Resets**: Backend data resets on Render server restart (~weekly or on deploy)
- **For Production**: Consider adding a database (PostgreSQL, MongoDB) for data persistence
