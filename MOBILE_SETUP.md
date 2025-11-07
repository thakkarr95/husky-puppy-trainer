# 📱 Mobile Device Setup Guide

## Quick Setup for Phone/Tablet

### Step 1: Find Your Computer's IP Address

Your computer (running the server) needs to share its IP address with your phone.

**On the computer running the server:**

Open Terminal/Command Prompt and run:

**Mac/Linux:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

**Windows:**
```bash
ipconfig
```

Look for your local IP address (example: `192.168.1.100`)

### Step 2: Access from Your Phone

1. **Make sure your phone is on the same WiFi network** as the computer running the server

2. **Open your phone's browser** (Safari, Chrome, etc.)

3. **Navigate to:** `http://YOUR-COMPUTER-IP:5173`
   - Example: `http://192.168.1.100:5173`

4. **Bookmark the page** for easy access!

### Step 3: Add to Home Screen (iOS)

1. Tap the **Share** button in Safari
2. Scroll down and tap **"Add to Home Screen"**
3. Name it "Husky Trainer"
4. Tap **Add**

Now you have a quick-launch icon on your home screen! 📲

### Step 4: Add to Home Screen (Android)

1. Tap the **Menu** (three dots) in Chrome
2. Tap **"Add to Home screen"**
3. Name it "Husky Trainer"
4. Tap **Add**

## Testing the Connection

1. **On your computer**, start the server:
   ```bash
   npm run dev:all
   ```
   
2. **On your phone**, open the browser and go to:
   ```
   http://YOUR-IP:5173
   ```

3. You should see the Husky Puppy Trainer app!

4. **Test logging**: Try logging a potty break or food entry on your phone

5. **Check sync**: Open the app on your computer and verify the entry appears there too!

## Troubleshooting

### Can't connect from phone

**Check 1: Same WiFi Network**
- Phone and computer must be on the same WiFi
- Not using cellular data
- Not using VPN

**Check 2: Server is Running**
- On computer, you should see "server running on port 3001" in terminal
- Visit `http://localhost:3001/api/health` on computer - should show "ok"

**Check 3: Firewall**
- Your computer's firewall might be blocking connections
- On Mac: System Settings > Network > Firewall > Allow connections to Node
- On Windows: Allow Node.js through Windows Firewall

**Check 4: Correct IP**
- IP addresses can change when you reconnect to WiFi
- Get fresh IP address if connection stops working

### Offline Mode

If you see "⚠️ Offline Mode" banner:
- The phone can't reach the server
- Data is saved locally on that device only
- Will sync when connection is restored

### Data not syncing

1. **Force refresh**: Pull down to refresh in mobile browser
2. **Clear cache**: Settings > Safari/Chrome > Clear Data
3. **Restart app**: Close and reopen the browser tab
4. **Check server**: Make sure computer hasn't gone to sleep

## Network Configuration

### Running on Home Network

**Computer Setup:**
1. Start server: `npm run dev:all`
2. Keep computer awake (prevent sleep)
3. Stay connected to WiFi

**Phone Setup:**
1. Connect to same WiFi
2. Use IP address to access
3. Bookmark for easy access

### Making Computer Stay Awake (Mac)

```bash
# Prevent sleep while command is running
caffeinate -i npm run dev:all
```

Or in System Settings:
- System Settings > Battery > Prevent automatic sleeping on power adapter

### Making Computer Stay Awake (Windows)

- Settings > System > Power & Sleep
- Set "When plugged in, PC goes to sleep after" to "Never"

## Advanced: Static IP Address

To avoid IP changes, set a static IP for your computer:

**Mac:**
1. System Settings > Network > WiFi > Details
2. TCP/IP tab
3. Configure IPv4: Manually
4. Set IP, Subnet Mask, Router

**Windows:**
1. Settings > Network > WiFi > Properties
2. IP Settings > Edit
3. Manual IPv4
4. Set IP, Subnet, Gateway, DNS

Use this static IP in your bookmark: `http://192.168.1.100:5173`

## Using on Multiple Phones

All phones can connect simultaneously:
- Each phone uses the same URL
- All see the same data
- All changes sync instantly
- No limit on number of devices

## Best Practices

1. **Keep one device as the server** (desktop/laptop that stays on)
2. **Bookmark on mobile** for quick access
3. **Check "offline mode" banner** before logging critical data
4. **Use WiFi, not cellular** (unless you set up port forwarding)
5. **Restart server daily** to ensure fresh connection

## Quick Reference Card

Print this and keep it handy:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🐺 HUSKY PUPPY TRAINER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SERVER IP: ________________
          (write your IP here)

PHONE URL: http://________:5173
                (your IP)

BOOKMARK THIS! ⭐

To Start Server:
  npm run dev:all

Troubleshooting:
  ✓ Same WiFi?
  ✓ Server running?
  ✓ Correct IP?
  
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Happy training from anywhere! 🐾📱
