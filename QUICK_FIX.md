# 🚀 Quick Spotify Fix

## The Problem
You're seeing "Connect your Spotify account" and it's not working.

## Immediate Fix (3 Steps)

### Step 1: Run on Local Server
**Don't just open the HTML file!** You need a local server:

**Option A: Using Python (Easiest)**
```bash
python -m http.server 3000
```
Then open: `http://localhost:3000`

**Option B: Using Node.js**
```bash
npx http-server -p 3000
```
Then open: `http://localhost:3000`

**Option C: Using Live Server (VS Code)**
- Install "Live Server" extension
- Right-click `index.html` → "Open with Live Server"

### Step 2: Add Redirect URIs to Spotify
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Click your app → "Edit Settings"
3. Add these Redirect URIs:
   ```
   http://localhost:3000
   http://localhost:3000/
   http://127.0.0.1:3000
   http://127.0.0.1:3000/
   http://localhost:5500
   http://127.0.0.1:5500
   ```
4. Click "Save"

### Step 3: Test
1. Refresh your app
2. Click "Connect Spotify"
3. Authorize the app
4. You should now see "Spotify Connected!"

## If Still Not Working

**Check the browser console (F12) for errors:**
- Look for "INVALID_CLIENT" or "INVALID_REDIRECT_URI"
- The error message will tell you exactly what's wrong

**Common Issues:**
- ❌ Opening HTML file directly (file:// protocol)
- ❌ Wrong redirect URIs in Spotify Dashboard
- ❌ Not running on localhost

**Quick Test:**
- Make sure your URL starts with `http://localhost:` not `file://`
- The Spotify Client ID in the code should work now

## Need Your Own Client ID?
If you want to use your own Spotify app:
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create new app
3. Copy Client ID
4. Replace in `main.js` line 5
5. Add redirect URIs as shown above 