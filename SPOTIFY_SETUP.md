# 🔧 Quick Spotify Setup Fix

## The Problem
You're getting "INVALID_CLIENT" error because the Spotify Client ID is not set up correctly.

## Quick Fix (3 Steps)

### Step 1: Create Spotify App
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Click **"Create App"**
3. Fill in:
   - **App name**: `Moody Player` (or any name)
   - **App description**: `AI mood detection music app`
   - **Website**: `http://localhost:3000`
   - **Redirect URI**: `http://localhost:3000`
4. Click **"Save"**

### Step 2: Get Your Client ID
1. After creating the app, you'll see your **Client ID**
2. Copy it (it looks like: `abc123def456ghi789`)

### Step 3: Update the Code
1. Open `main.js`
2. Find this line:
   ```javascript
   const SPOTIFY_CLIENT_ID = 'YOUR_SPOTIFY_CLIENT_ID_HERE';
   ```
3. Replace `YOUR_SPOTIFY_CLIENT_ID_HERE` with your actual Client ID:
   ```javascript
   const SPOTIFY_CLIENT_ID = 'abc123def456ghi789'; // Your actual Client ID here
   ```

## Test It
1. Refresh your app
2. Click "Detect My Mood"
3. Click "Connect Spotify"
4. You should now be redirected to Spotify to authorize

## Common Issues

**Still getting INVALID_CLIENT?**
- Make sure you copied the Client ID correctly (no extra spaces)
- Check that your Redirect URI in Spotify dashboard matches exactly: `http://localhost:3000`

**Getting "INVALID_CLIENT: Invalid redirect URI"?**
- This is the most common error!
- Your Spotify app redirect URI doesn't match your current URL
- **Quick Fix**: Add ALL these redirect URIs to your Spotify app:
  - `http://localhost:3000`
  - `http://localhost:3000/`
  - `http://127.0.0.1:3000`
  - `http://127.0.0.1:3000/`
  - `http://localhost:5500` (if using Live Server)
  - `http://127.0.0.1:5500` (if using Live Server)

**Getting a different error?**
- Make sure you're running the app on a local server (not just opening the HTML file)
- Try clearing your browser cache
- Check the browser console for more details

## Need Help?
- Check the full README.md for detailed instructions
- Make sure you're using a local server (not just opening the HTML file directly) 