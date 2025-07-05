# 🚀 GitHub Pages Spotify Setup

## The Problem
You're running your app on GitHub Pages (`https://suman-369.github.io/MoodyPlayer/`) and Spotify needs this exact URL in its redirect URIs.

## Quick Fix (2 Steps)

### Step 1: Go to Spotify Developer Dashboard
1. Open [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Click on your app (or create a new one)
3. Click **"Edit Settings"**

### Step 2: Add GitHub Pages Redirect URIs
In the **"Redirect URIs"** section, add these URLs:

```
https://suman-369.github.io/MoodyPlayer/
https://suman-369.github.io/MoodyPlayer
https://suman-369.github.io/
```

**Important:** Make sure to include the trailing slash `/` in the first URL!

### Step 3: Save and Test
1. Click **"Save"**
2. Go back to your app: `https://suman-369.github.io/MoodyPlayer/`
3. Refresh the page
4. Click "Connect Spotify"
5. You should now be redirected to Spotify for authorization

## If You Still Get Errors

### Check Your Client ID
Make sure your Client ID in `main.js` is correct:
```javascript
const SPOTIFY_CLIENT_ID = 'f02c2740d6214d13b3cd28791ba5e0a5';
```

### Common GitHub Pages Issues
- ❌ **Wrong redirect URI format** - Must be exact match
- ❌ **Missing trailing slash** - `https://suman-369.github.io/MoodyPlayer/` vs `https://suman-369.github.io/MoodyPlayer`
- ❌ **Wrong Client ID** - Make sure it matches your Spotify app

### Debug Steps
1. Open browser console (F12)
2. Look for error messages
3. Check if the redirect URI in the error matches exactly what you added to Spotify

## Alternative: Use Your Own Spotify App
If the current Client ID doesn't work:

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Click **"Create App"**
3. Fill in:
   - **App name**: `Moody Player`
   - **App description**: `AI mood detection music app`
   - **Website**: `https://suman-369.github.io/MoodyPlayer/`
   - **Redirect URI**: `https://suman-369.github.io/MoodyPlayer/`
4. Click **"Save"**
5. Copy your new Client ID
6. Replace it in `main.js` line 5

## Success!
Once working, you should see:
- ✅ "Spotify Connected!" message
- ✅ Ability to detect mood and get song suggestions
- ✅ Direct links to play songs on Spotify 