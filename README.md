# Moody Player - Spotify Integration

A mood detection app that uses AI to analyze your facial expressions and suggests songs from Spotify based on your detected mood.

## Features

- 🤖 AI-powered mood detection using face-api.js
- 🎵 Spotify integration for music recommendations
- 📱 Responsive design with beautiful UI
- 🎨 Mood-based color themes and animations
- 🔄 Fallback mode when AI models aren't available

## Setup Instructions

### 1. Spotify API Setup

To use this app, you need to create a Spotify application and get your Client ID:

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in with your Spotify account
3. Click "Create App"
4. Fill in the app details:
   - **App name**: Moody Player (or any name you prefer)
   - **App description**: AI mood detection music app
   - **Website**: `http://localhost:3000` (for local development)
   - **Redirect URI**: `http://localhost:3000` (for local development)
5. Accept the terms and create the app
6. Copy your **Client ID** from the app dashboard

### 2. Update the Code

Open `main.js` and replace `YOUR_SPOTIFY_CLIENT_ID` with your actual Spotify Client ID:

```javascript
const SPOTIFY_CLIENT_ID = 'your_actual_client_id_here';
```

### 3. Run the App

1. **Option 1: Simple HTTP Server**
   ```bash
   # Using Python (if you have Python installed)
   python -m http.server 3000
   
   # Using Node.js (if you have Node.js installed)
   npx http-server -p 3000
   ```

2. **Option 2: Live Server (VS Code)**
   - Install the "Live Server" extension in VS Code
   - Right-click on `index.html` and select "Open with Live Server"

3. **Option 3: Any Local Server**
   - Use any local server that serves files from the project directory
   - Make sure it runs on `http://localhost:3000` (or update the redirect URI in Spotify dashboard)

### 4. Using the App

1. Open the app in your browser
2. Allow camera permissions when prompted
3. Click "Connect Spotify" to authenticate with your Spotify account
4. Position your face in the camera
5. Click "Detect My Mood" to analyze your facial expression
6. Get personalized song recommendations based on your mood!

## How It Works

1. **Mood Detection**: Uses face-api.js to analyze facial expressions and detect emotions
2. **Spotify Integration**: Searches Spotify's catalog for songs matching the detected mood
3. **Song Recommendations**: Displays song suggestions with album artwork and direct links to Spotify

## Mood Categories

- 😊 **Happy**: Upbeat, positive, energetic songs
- 😢 **Sad**: Emotional, melancholic ballads
- 😐 **Neutral**: Chill, relaxing, ambient music
- 😠 **Angry**: Rock, powerful, aggressive tracks
- 😲 **Surprised**: Exciting, energetic, surprising music
- 😨 **Fearful**: Calm, soothing, peaceful songs
- 🤢 **Disgusted**: Alternative, indie, experimental music

## Technical Details

- **Frontend**: HTML5, CSS3 (Tailwind CSS), JavaScript (ES6+)
- **AI**: face-api.js for facial expression recognition
- **Music API**: Spotify Web API
- **Authentication**: OAuth 2.0 with Implicit Grant Flow
- **Storage**: LocalStorage for token persistence

## Troubleshooting

### Common Issues

1. **"No Spotify access token available"**
   - Make sure you've set up the Spotify app correctly
   - Check that your Client ID is correct in the code
   - Ensure your redirect URI matches in both code and Spotify dashboard

2. **Camera not working**
   - Allow camera permissions in your browser
   - Try refreshing the page
   - Check if your camera is being used by another application

3. **AI models not loading**
   - The app will work in fallback mode with random mood detection
   - Check your internet connection
   - Try refreshing the page

4. **Songs not loading**
   - Check if you're authenticated with Spotify
   - Try clicking "Connect Spotify" again
   - Check the browser console for error messages

### Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Security Notes

- The app uses client-side authentication with Spotify
- Access tokens are stored in localStorage
- No server-side code is required
- All API calls are made directly from the browser

## License

This project is open source and available under the MIT License.

## Credits

- Built with ❤️ by Suman
- Uses [face-api.js](https://github.com/justadudewhohacks/face-api.js) for facial recognition
- Powered by [Spotify Web API](https://developer.spotify.com/documentation/web-api/)
- Styled with [Tailwind CSS](https://tailwindcss.com/) 