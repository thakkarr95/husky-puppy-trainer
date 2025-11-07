# Production Deployment Guide

## 🌐 Deploy to Production (Free!)

Your app is split into two parts that need separate deployment:

### Option 1: Railway (Recommended - Easiest)

**Backend Server (Railway)**

1. **Sign up** at [railway.app](https://railway.app) (free with GitHub)

2. **Create new project** → "Deploy from GitHub repo"

3. **Select your repo**: `husky-puppy-trainer`

4. **Configure**:
   - Root Directory: `/`
   - Build Command: `npm install`
   - Start Command: `node server/server.js`
   - Add Environment Variable: `PORT=3001`

5. **Deploy** - Railway will give you a URL like: `https://your-app.railway.app`

6. **Update frontend** - Create `.env.production`:
   ```bash
   VITE_API_URL=https://your-app.railway.app
   ```

**Frontend (GitHub Pages)**

1. Update `.env.production` with your Railway URL

2. Deploy:
   ```bash
   npm run deploy
   ```

3. Your app will be live at: `https://thakkarr95.github.io/husky-puppy-trainer`

---

### Option 2: Render.com (Also Free)

**Backend Server**

1. **Sign up** at [render.com](https://render.com)

2. **New Web Service** → Connect GitHub repo

3. **Configure**:
   - Name: `husky-puppy-trainer-api`
   - Root Directory: `.`
   - Build Command: `npm install`
   - Start Command: `node server/server.js`
   - Instance Type: Free

4. **Add environment variable**:
   - Key: `PORT`
   - Value: `10000` (or leave default)

5. Render gives you: `https://husky-puppy-trainer-api.onrender.com`

**Frontend (GitHub Pages)**

Same as above, use Render URL in `.env.production`

---

### Option 3: All-in-One Vercel (Requires Changes)

We can modify the app to work as a serverless API on Vercel. Would you like me to set this up?

---

## 📱 Quick Deploy Instructions

### Step 1: Choose Backend Host

Pick one: Railway (easiest) or Render (also great)

### Step 2: Deploy Backend

Follow the steps above for your chosen platform.

**Important:** Copy the URL they give you (e.g., `https://your-app.railway.app`)

### Step 3: Configure Frontend

Create `.env.production` file:

```bash
VITE_API_URL=https://your-backend-url-here.railway.app
```

### Step 4: Deploy Frontend

```bash
npm run deploy
```

### Step 5: Access Your App! 🎉

Open: `https://thakkarr95.github.io/husky-puppy-trainer`

---

## 💰 Cost

**100% FREE** with limitations:
- **Railway**: 500 hours/month free (plenty for personal use)
- **Render**: Always-on free tier (may sleep after inactivity)
- **GitHub Pages**: Unlimited for public repos

---

## 🔄 Updating Your App

**Backend Updates:**
1. Push code to GitHub
2. Railway/Render auto-deploys

**Frontend Updates:**
1. Make changes
2. Run `npm run deploy`
3. Live in ~2 minutes!

---

## ⚡ Performance Notes

**Free tier limitations:**
- Render free tier "sleeps" after 15 min inactivity (first request takes ~30 sec to wake)
- Railway stays awake with 500 hours/month limit
- Both are perfect for personal use!

**Solution for sleeping:**
- Use Railway (doesn't sleep)
- Or set up a ping service (UptimeRobot) to keep Render awake

---

## 🌍 Accessing from Phone

Once deployed:
1. Open Safari/Chrome on phone
2. Go to: `https://thakkarr95.github.io/husky-puppy-trainer`
3. Add to Home Screen
4. Use like a native app!

No IP addresses needed - works from anywhere with internet! 📱✨
