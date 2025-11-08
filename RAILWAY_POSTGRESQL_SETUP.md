# 🚂 Railway PostgreSQL Setup Guide

## Problem
Railway's filesystem is ephemeral - files reset on every deployment, causing data loss.

## Solution
Use Railway's PostgreSQL database for persistent storage.

---

## Step 1: Add PostgreSQL Database

1. **Go to your Railway project**
   - https://railway.app/project/your-project

2. **Add PostgreSQL**
   - Click "New" button
   - Select "Database"
   - Choose "Add PostgreSQL"
   - Railway will provision the database automatically

3. **Wait for provisioning**
   - Takes ~30 seconds
   - You'll see a new "Postgres" service in your project

---

## Step 2: Connect Database to Your Server

Railway automatically creates a `DATABASE_URL` variable that's shared across services.

**No manual configuration needed!** The connection happens automatically.

---

## Step 3: Update Your Server Code

**Option A: Automatic (Recommended)**

The repository already has `server/server-postgres.js` ready to use.

1. **Update Railway configuration:**
   - Go to your service (husky-puppy-trainer)
   - Click "Settings"
   - Under "Start Command", change from:
     ```
     node server/server.js
     ```
     to:
     ```
     node server/server-postgres.js
     ```
   - Click "Save"

2. **Redeploy:**
   - Railway will automatically redeploy
   - Database tables will be created automatically
   - Your data will now persist!

**Option B: Manual (if you want to understand the changes)**

Rename the PostgreSQL version to be the main server:

```bash
cd server
mv server.js server-file.js.backup
mv server-postgres.js server.js
```

Then commit and push:

```bash
git add .
git commit -m "Switch to PostgreSQL for persistent storage"
git push
```

---

## Step 4: Verify It's Working

1. **Check Railway logs:**
   - Open your service
   - Click "Deployments" → Latest deployment
   - Check logs for: `✅ Database tables initialized`

2. **Test the app:**
   - Open https://thakkarr95.github.io/husky-puppy-trainer
   - Add a potty log
   - Trigger a redeployment (push any change)
   - Check if data persists ✅

---

## Architecture Change Summary

### Before (File-based)
```
server/data/
├── training-tasks.json  ❌ Lost on deployment
├── food-entries.json    ❌ Lost on deployment
└── potty-entries.json   ❌ Lost on deployment
```

### After (PostgreSQL)
```
Railway PostgreSQL Database
├── training_tasks table   ✅ Persistent
├── food_entries table     ✅ Persistent
├── potty_entries table    ✅ Persistent
├── puppy_info table       ✅ Persistent
└── todo_entries table     ✅ Persistent
```

---

## Benefits

✅ **Persistent Storage** - Data survives deployments  
✅ **No Code Changes** - Just switch the server file  
✅ **Automatic Backups** - Railway backs up databases  
✅ **Free Tier** - 100MB storage, 100 hours included  
✅ **Scalable** - Can handle more data as puppy grows  

---

## Data Migration (Optional)

If you have existing data in localStorage, it will continue to work as a fallback. New data will be saved to PostgreSQL automatically.

---

## Troubleshooting

**Issue: "Connection refused" or "DATABASE_URL not found"**

Solution:
1. Ensure PostgreSQL is added to the same project
2. Verify `DATABASE_URL` exists in environment variables:
   - Service → Variables → Should see `DATABASE_URL` (shared)
3. Redeploy the service

**Issue: "Tables not created"**

Solution:
1. Check deployment logs for errors
2. Ensure `node-postgres` (pg) is in dependencies
3. Verify `initDatabase()` runs on startup

---

## Cost

**Railway Free Tier:**
- PostgreSQL: 100MB storage
- 100 compute hours/month
- Perfect for personal use!

**If you exceed free tier:**
- ~$5/month for PostgreSQL
- Only charged for what you use

---

## Next Steps

Once PostgreSQL is working:

1. ✅ Data persists across deployments
2. ✅ No more lost potty logs!
3. ✅ Scale to multiple puppies (if needed)
4. ✅ Easy to backup/restore via Railway dashboard

Happy puppy training! 🐾
