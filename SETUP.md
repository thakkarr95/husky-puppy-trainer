# 🐺 Husky Puppy Trainer - Multi-Device Setup Guide

## Architecture Overview

The app now uses a **client-server architecture** to sync data across multiple devices:

- **Frontend**: React app (runs on any device)
- **Backend**: Node.js Express server (stores data in files)
- **Storage**: JSON files on disk (in `server/data/` directory)

### How It Works

1. **Central Server**: One device (e.g., your laptop) runs the backend server
2. **Multiple Clients**: All devices (phones, tablets, laptops) connect to this server
3. **Automatic Sync**: Data is saved to the server and synced across all connected devices
4. **Offline Support**: If the server is unavailable, data is saved locally and will sync when reconnected

## 🚀 Quick Start

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Start the Server

On the device that will act as the central server (e.g., your main computer):

```bash
npm run server
```

The server will start on port 3001. You'll see:
```
🚀 Husky Puppy Trainer API server running on port 3001
📁 Data directory: /path/to/server/data
```

### Step 3: Start the Frontend

**Option A: Run both frontend and server together (recommended for development)**
```bash
npm run dev:all
```

**Option B: Run frontend only**
```bash
npm run dev
```

The app will open at `http://localhost:5173`

## 📱 Access from Other Devices

### Find Your Server's IP Address

**On Mac:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

**On Windows:**
```bash
ipconfig
```

Look for your local IP (usually starts with `192.168.x.x` or `10.x.x.x`)

### Configure Other Devices

1. **Find your server IP** (e.g., `192.168.1.100`)

2. **Update `.env` file** on each device to point to the server:
   ```
   VITE_API_URL=http://192.168.1.100:3001
   ```

3. **Access the app** from any device on your network:
   - Phone: Open browser to `http://192.168.1.100:5173`
   - Tablet: Same URL
   - Other computers: Same URL

### Make Server Accessible on Network

By default, Vite only listens on localhost. To make it accessible on your network:

**Update `package.json`:**
```json
"dev": "vite --host"
```

Or run:
```bash
npm run dev -- --host
```

## 🗂️ Data Storage

All data is stored in JSON files in the `server/data/` directory:

```
server/data/
├── training-tasks.json    # Weekly training progress
├── food-entries.json      # Feeding logs
├── potty-entries.json     # Potty training logs
└── puppy-info.json        # Puppy birth date and info
```

### Backup Your Data

Simply copy the `server/data/` folder to back up all your puppy training data!

```bash
# Backup
cp -r server/data ~/backups/husky-data-$(date +%Y%m%d)

# Restore
cp -r ~/backups/husky-data-20250107/data server/
```

## 🌐 Production Deployment

### Deploy to Cloud Server

You can deploy the backend to any cloud service:

**Option 1: Use a Cloud VM (DigitalOcean, AWS, etc.)**
1. Set up a Linux server
2. Install Node.js
3. Copy the `server/` directory
4. Run `node server/server.js`
5. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start server/server.js --name husky-api
   pm2 save
   pm2 startup
   ```

**Option 2: Use a Platform (Railway, Render, Heroku)**
1. Push your code to GitHub
2. Connect the repository to your platform
3. Set build command: `npm install`
4. Set start command: `node server/server.js`

### Deploy Frontend

**Option 1: GitHub Pages (current setup)**
```bash
npm run deploy
```

**Option 2: Vercel/Netlify**
1. Connect your GitHub repo
2. Build command: `npm run build`
3. Output directory: `dist`
4. Set environment variable: `VITE_API_URL=https://your-api-domain.com`

## 🔒 Security Considerations

**For Home Network Use:**
- Default setup is fine for local network access
- Server only accepts connections from your local network

**For Public Internet Access:**
- Add authentication to the API
- Use HTTPS (SSL certificates)
- Implement rate limiting
- Consider using a VPN

## 🛠️ Troubleshooting

### Can't connect from phone/tablet

1. **Check firewall**: Make sure port 3001 is allowed
   ```bash
   # Mac
   sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add node
   
   # Or disable firewall temporarily to test
   ```

2. **Verify network**: All devices must be on the same WiFi network

3. **Check server is running**: Visit `http://YOUR-IP:3001/api/health` in browser

### Data not syncing

1. Check the **offline banner** - if visible, the app can't reach the server
2. Open browser console (F12) and look for error messages
3. Verify the `VITE_API_URL` in `.env` is correct

### Server crashes

Check the console for errors. Common issues:
- Port 3001 already in use (change `PORT` in `server/server.js`)
- File permission issues (ensure `server/data/` is writable)

## 📊 API Endpoints

The server provides these endpoints:

- `GET /api/health` - Health check
- `GET /api/sync` - Get all data at once
- `GET/POST /api/training-tasks` - Training progress
- `GET/POST /api/food-entries` - Food logs
- `GET/POST /api/potty-entries` - Potty logs
- `GET/POST /api/puppy-info` - Puppy information

## 🎯 Development vs Production

### Development (Current Setup)
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3001`
- Data: Local JSON files

### Production (Recommended)
- Frontend: Deployed to Vercel/Netlify
- Backend: Deployed to Railway/Render/Cloud VM
- Data: Persistent storage with backups

## 📝 Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Local development
VITE_API_URL=http://localhost:3001

# Network access (other devices on same WiFi)
# VITE_API_URL=http://192.168.1.100:3001

# Production
# VITE_API_URL=https://your-api-domain.com
```

## 🔄 Migration from LocalStorage

Don't worry! Your existing data is safe:
- The app automatically falls back to localStorage if the server is unavailable
- First time you connect to the server, you can manually copy data from localStorage
- Or the server will start fresh and you can re-enter initial data

## 📞 Support

If you encounter issues:
1. Check the console for error messages
2. Verify network connectivity
3. Ensure the server is running
4. Check firewall settings

Happy puppy training! 🐾
