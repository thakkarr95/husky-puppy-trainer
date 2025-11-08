# 🔧 Quick Fix: Prevent Data Loss on Railway

## The Problem
Your potty logs disappear after each Railway deployment because the file system is ephemeral.

## The Solution
Switch to PostgreSQL database (included free on Railway).

---

## 📋 Steps to Fix (5 minutes)

### 1. Add PostgreSQL to Railway
1. Go to https://railway.app (your project)
2. Click **"New"** → **"Database"** → **"Add PostgreSQL"**
3. Wait 30 seconds for provisioning ✅

### 2. Update Server Configuration
1. In Railway, go to your service (husky-puppy-trainer)
2. Click **"Settings"**
3. Find **"Start Command"**
4. Change from:
   ```
   node server/server.js
   ```
   To:
   ```
   node server/server-postgres.js
   ```
5. Click **"Save"**

### 3. Deploy
Railway will automatically redeploy with the new configuration.

---

## ✅ Verify It Works

1. **Check logs** - Look for: `✅ Database tables initialized`
2. **Test the app** - Add a potty log
3. **Trigger redeploy** - Change something and push
4. **Check data** - Logs should still be there! 🎉

---

## 📁 What Changed

**Before:**
- Data stored in files: `server/data/*.json`
- Files deleted on every deployment ❌

**After:**
- Data stored in PostgreSQL database
- Persists across deployments ✅

---

## 💰 Cost

**FREE** on Railway's free tier:
- 100MB PostgreSQL storage
- 100 compute hours/month
- Perfect for personal use!

---

## 📚 More Details

See `RAILWAY_POSTGRESQL_SETUP.md` for complete documentation.

---

## 🆘 Need Help?

If you run into issues:
1. Check Railway deployment logs
2. Verify `DATABASE_URL` exists in environment variables
3. Ensure PostgreSQL service is running

---

**That's it!** Your data will now persist across deployments. 🐾
