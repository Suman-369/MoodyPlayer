// Moody Player - main.js

// API Configuration
// Spotify API Configuration
const SPOTIFY_CLIENT_ID = 'f02c2740d6214d13b3cd28791ba5e0a5';
const SPOTIFY_REDIRECT_URI = window.location.origin + window.location.pathname;
const SPOTIFY_SCOPES = 'user-read-private user-read-email';

// Elements
const webcam = document.getElementById('webcam');
const moodDisplay = document.getElementById('mood-display');
const songSuggestion = document.getElementById('song-suggestion');
const moodCheckBtn = document.getElementById('mood-check-btn');
const loadingSpinner = document.getElementById('loading-spinner');

// Check if face-api is available
let faceApiAvailable = false;
let modelsLoaded = false;
let webcamStarted = false;
let spotifyAccessToken = null;

// Mood emojis and colors
const moodConfig = {
  happy: { emoji: '😊', color: 'from-yellow-400 to-orange-400', bgColor: 'bg-yellow-50' },
  sad: { emoji: '😢', color: 'from-blue-400 to-indigo-400', bgColor: 'bg-blue-50' },
  neutral: { emoji: '😐', color: 'from-gray-400 to-slate-400', bgColor: 'bg-gray-50' },
  angry: { emoji: '😠', color: 'from-red-400 to-pink-400', bgColor: 'bg-red-50' },
  surprised: { emoji: '😲', color: 'from-purple-400 to-pink-400', bgColor: 'bg-purple-50' },
  fearful: { emoji: '😨', color: 'from-indigo-400 to-purple-400', bgColor: 'bg-indigo-50' },
  disgusted: { emoji: '🤢', color: 'from-green-400 to-teal-400', bgColor: 'bg-green-50' }
};

// Show Spotify setup prompt
function showSpotifySetup() {
  songSuggestion.innerHTML = `
    <div class="text-center text-white text-opacity-80">
      <i class="fab fa-spotify text-2xl mb-2"></i>
      <h3 class="text-lg font-semibold mb-2">Connect to Spotify</h3>
      <p class="mb-4">Connect your Spotify account to get personalized song suggestions based on your mood.</p>
      <button onclick="authenticateSpotify()" 
              class="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105">
        <i class="fab fa-spotify mr-2"></i>
        Connect Spotify
      </button>
    </div>
  `;
}

// Spotify Authentication Functions
function getSpotifyAuthUrl() {
  console.log('Creating Spotify auth URL with Client ID:', SPOTIFY_CLIENT_ID);
  console.log('Redirect URI:', SPOTIFY_REDIRECT_URI);
  
  const params = new URLSearchParams({
    client_id: SPOTIFY_CLIENT_ID,
    response_type: 'token',
    redirect_uri: SPOTIFY_REDIRECT_URI,
    scope: SPOTIFY_SCOPES,
    show_dialog: 'true',
    state: Math.random().toString(36).substring(7) // Add state for security
  });
  
  const authUrl = `https://accounts.spotify.com/authorize?${params.toString()}`;
  console.log('Auth URL:', authUrl);
  return authUrl;
}

function handleSpotifyCallback() {
  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);
  const accessToken = params.get('access_token');
  const error = params.get('error');
  
  if (error) {
    console.error('Spotify auth error:', error);
    showSpotifyError(`Authentication failed: ${error}`);
    return false;
  }
  
  if (accessToken) {
    spotifyAccessToken = accessToken;
    localStorage.setItem('spotify_token', accessToken);
    localStorage.setItem('spotify_token_timestamp', Date.now().toString());
    // Clean up URL
    window.history.replaceState({}, document.title, window.location.pathname);
    return true;
  }
  return false;
}

function checkSpotifyAuth() {
  // Check if we have a valid token in localStorage
  const savedToken = localStorage.getItem('spotify_token');
  const tokenTimestamp = localStorage.getItem('spotify_token_timestamp');
  
  if (savedToken && tokenTimestamp) {
    // Check if token is not expired (Spotify tokens expire in 1 hour)
    const tokenAge = Date.now() - parseInt(tokenTimestamp);
    if (tokenAge < 3600000) { // 1 hour in milliseconds
      spotifyAccessToken = savedToken;
      return true;
    } else {
      // Token expired, remove it
      localStorage.removeItem('spotify_token');
      localStorage.removeItem('spotify_token_timestamp');
    }
  }
  
  // Check if we're returning from Spotify auth
  if (handleSpotifyCallback()) {
    return true;
  }
  
  return false;
}

function authenticateSpotify() {
  console.log('Authenticating Spotify with Client ID:', SPOTIFY_CLIENT_ID);
  console.log('Current redirect URI:', SPOTIFY_REDIRECT_URI);
  
  if (!SPOTIFY_CLIENT_ID || SPOTIFY_CLIENT_ID === 'YOUR_SPOTIFY_CLIENT_ID_HERE') {
    console.log('Client ID not set up yet');
    showSpotifySetupError();
    return;
  }
  
  if (!checkSpotifyAuth()) {
    console.log('No existing auth, redirecting to Spotify...');
    try {
      window.location.href = getSpotifyAuthUrl();
    } catch (error) {
      console.error('Error redirecting to Spotify:', error);
      showRedirectUriError();
    }
  } else {
    console.log('Already authenticated');
    showSpotifyConnected();
  }
}

function showSpotifyConnected() {
  songSuggestion.innerHTML = `
    <div class="text-center text-white text-opacity-80">
      <i class="fab fa-spotify text-2xl mb-2 text-green-400"></i>
      <h3 class="text-lg font-semibold mb-2">Spotify Connected!</h3>
      <p>Your Spotify account is connected. Click "Detect My Mood" to get started.</p>
    </div>
  `;
}

function showSpotifyError(message) {
  songSuggestion.innerHTML = `
    <div class="text-center text-white text-opacity-80">
      <i class="fas fa-exclamation-triangle text-2xl mb-2 text-red-400"></i>
      <h3 class="text-lg font-semibold mb-2">Spotify Error</h3>
      <p class="mb-4">${message}</p>
      <button onclick="authenticateSpotify()" 
              class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
        <i class="fab fa-spotify mr-2"></i>
        Try Again
      </button>
    </div>
  `;
}

function showRedirectUriError() {
  const currentRedirectUri = window.location.origin + window.location.pathname;
  songSuggestion.innerHTML = `
    <div class="text-center text-white text-opacity-80">
      <i class="fas fa-exclamation-triangle text-2xl mb-2 text-yellow-400"></i>
      <h3 class="text-lg font-semibold mb-2">Redirect URI Mismatch</h3>
      <div class="bg-white bg-opacity-10 rounded-lg p-4 mb-4 text-left text-sm">
        <p class="mb-2"><strong>Your Spotify app redirect URI doesn't match your current URL.</strong></p>
        <p class="mb-2">Current URL: <code class="bg-black bg-opacity-30 px-1 rounded">${window.location.href}</code></p>
        <p class="mb-2">Expected Redirect URI: <code class="bg-black bg-opacity-30 px-1 rounded">${currentRedirectUri}</code></p>
        <ol class="list-decimal list-inside space-y-1 mt-3">
          <li>Go to <a href="https://developer.spotify.com/dashboard" target="_blank" class="text-green-400 underline">Spotify Developer Dashboard</a></li>
          <li>Find your app and click "Edit Settings"</li>
          <li>Add this Redirect URI: <code class="bg-black bg-opacity-30 px-1 rounded">${currentRedirectUri}</code></li>
          <li>Click "Save"</li>
          <li>Refresh this page and try again</li>
        </ol>
      </div>
      <button onclick="window.open('https://developer.spotify.com/dashboard', '_blank')" 
              class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
        <i class="fab fa-spotify mr-2"></i>
        Fix Spotify Settings
      </button>
    </div>
  `;
}

function showSpotifySetupError() {
  const currentRedirectUri = window.location.origin + window.location.pathname;
  songSuggestion.innerHTML = `
    <div class="text-center text-white text-opacity-80">
      <i class="fab fa-spotify text-2xl mb-2"></i>
      <h3 class="text-lg font-semibold mb-2">Spotify Setup Required</h3>
      <div class="bg-white bg-opacity-10 rounded-lg p-4 mb-4 text-left text-sm">
        <p class="mb-2"><strong>To use Spotify integration:</strong></p>
        <ol class="list-decimal list-inside space-y-1">
          <li>Go to <a href="https://developer.spotify.com/dashboard" target="_blank" class="text-green-400 underline">Spotify Developer Dashboard</a></li>
          <li>Create a new app or select existing one</li>
          <li>Copy your Client ID and replace it in main.js</li>
          <li>Add these Redirect URIs in your app settings:</li>
          <ul class="list-disc list-inside ml-4 mt-1 space-y-1">
            <li><code class="bg-black bg-opacity-30 px-1 rounded">${currentRedirectUri}</code></li>
            <li><code class="bg-black bg-opacity-30 px-1 rounded">${window.location.origin}</code></li>
            <li><code class="bg-black bg-opacity-30 px-1 rounded">http://localhost:3000</code></li>
            <li><code class="bg-black bg-opacity-30 px-1 rounded">http://127.0.0.1:3000</code></li>
          </ul>
          <li>Click "Save"</li>
        </ol>
        <p class="mt-2 text-xs text-yellow-300">Current URL: <code class="bg-black bg-opacity-30 px-1 rounded">${window.location.href}</code></p>
      </div>
      <button onclick="window.open('https://developer.spotify.com/dashboard', '_blank')" 
              class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
        <i class="fab fa-spotify mr-2"></i>
        Go to Spotify Dashboard
      </button>
    </div>
  `;
}

// Spotify API Functions
async function searchSpotifyTracks(query, limit = 20) {
  if (!spotifyAccessToken) {
    throw new Error('No Spotify access token available');
  }
  
  try {
    const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}&market=US`, {
      headers: {
        'Authorization': `Bearer ${spotifyAccessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        // Token expired, re-authenticate
        localStorage.removeItem('spotify_token');
        localStorage.removeItem('spotify_token_timestamp');
        showSpotifyError('Your session expired. Please reconnect to Spotify.');
        return null;
      }
      throw new Error(`Spotify API error: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Spotify API request failed:', error);
    throw error;
  }
}

async function getSpotifyUserProfile() {
  if (!spotifyAccessToken) {
    return null;
  }
  
  const response = await fetch('https://api.spotify.com/v1/me', {
    headers: {
      'Authorization': `Bearer ${spotifyAccessToken}`
    }
  });
  
  if (response.ok) {
    return await response.json();
  }
  return null;
}

// Check if face-api.js is loaded
function checkFaceApi() {
  if (typeof faceapi !== 'undefined') {
    faceApiAvailable = true;
    console.log('Face-api.js loaded successfully');
    return true;
  } else {
    console.error('Face-api.js not loaded');
    return false;
  }
}

// Load face-api models with fallback
async function loadModels() {
  try {
    if (!checkFaceApi()) {
      console.log('Face-api not available, skipping model loading');
      return false;
    }
    
    // Try multiple CDN sources for models
    const modelUrls = [
      'https://unpkg.com/face-api.js@0.22.2/weights',
      'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/weights',
      'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights'
    ];
    
    let loaded = false;
    for (const baseUrl of modelUrls) {
      try {
        console.log(`Trying to load models from: ${baseUrl}`);
        await faceapi.nets.tinyFaceDetector.loadFromUri(baseUrl);
        await faceapi.nets.faceExpressionNet.loadFromUri(baseUrl);
        console.log('Models loaded successfully from:', baseUrl);
        loaded = true;
        break;
      } catch (error) {
        console.warn(`Failed to load from ${baseUrl}:`, error);
        continue;
      }
    }
    
    if (!loaded) {
      console.log('All model sources failed, using fallback mode');
      return false;
    }
    
    modelsLoaded = true;
    return true;
  } catch (error) {
    console.error('Error loading models:', error);
    return false;
  }
}

// Start webcam
async function startWebcam() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: { 
        width: { ideal: 640 },
        height: { ideal: 480 },
        facingMode: 'user'
      } 
    });
    webcam.srcObject = stream;
    webcam.onloadedmetadata = () => {
      console.log('Webcam started successfully');
    };
    webcamStarted = true;
    return true;
  } catch (err) {
    console.error('Webcam error:', err);
    return false;
  }
}

// Detect mood with timeout and optimization
async function detectMood() {
  if (!webcam || webcam.readyState !== 4) {
    showError('Camera not ready. Please wait a moment.');
    return null;
  }
  
  try {
    // If face-api is not available, use fallback
    if (!faceApiAvailable || !modelsLoaded) {
      console.log('Using fallback mood detection');
      return getRandomMood();
    }
    
    // Set timeout for detection (5 seconds max)
    const detectionPromise = faceapi.detectSingleFace(webcam, new faceapi.TinyFaceDetectorOptions())
      .withFaceExpressions();
    
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Detection timeout')), 5000)
    );
    
    const detections = await Promise.race([detectionPromise, timeoutPromise]);
    
    if (detections && detections.expressions) {
      return getDominantMood(detections.expressions);
    } else {
      return null;
    }
  } catch (error) {
    console.error('Detection error:', error);
    if (error.message === 'Detection timeout') {
      showError('Detection took too long. Please try again.');
    }
    return null;
  }
}

// Fallback: Get random mood if face detection fails
function getRandomMood() {
  const moods = ['happy', 'sad', 'neutral', 'surprised'];
  return moods[Math.floor(Math.random() * moods.length)];
}

// Get dominant mood
function getDominantMood(expressions) {
  let max = 0;
  let mood = 'neutral';
  for (const [key, value] of Object.entries(expressions)) {
    if (value > max) {
      max = value;
      mood = key;
    }
  }
  return mood;
}

// Show error message
function showError(message) {
  moodDisplay.innerHTML = `
    <div class="flex items-center justify-center text-red-400">
      <i class="fas fa-exclamation-triangle mr-2"></i>
      <span>${message}</span>
    </div>
  `;
}

// Show success message
function showSuccess(message) {
  moodDisplay.innerHTML = `
    <div class="text-center">
      <div class="text-4xl mb-3">🎵</div>
      <h2 class="text-xl font-semibold text-white mb-2">Ready to detect your mood!</h2>
      <p class="text-white text-opacity-80">${message}</p>
    </div>
  `;
}

// Suggest song using Spotify API
async function suggestSong(mood) {
  const moodToTerm = {
    happy: 'happy upbeat positive energy',
    sad: 'sad emotional ballad melancholic',
    neutral: 'chill relaxing ambient',
    angry: 'rock powerful aggressive',
    surprised: 'surprise energetic exciting',
    fearful: 'calm soothing peaceful',
    disgusted: 'alternative indie experimental'
  };
  
  const term = moodToTerm[mood] || 'pop';
  
  try {
    // Check if we need to authenticate
    if (!spotifyAccessToken) {
      showSpotifySetup();
      return;
    }
    
    const data = await searchSpotifyTracks(term, 20);
    
    if (data && data.tracks && data.tracks.items && data.tracks.items.length > 0) {
      const song = data.tracks.items[Math.floor(Math.random() * data.tracks.items.length)];
      const moodInfo = moodConfig[mood] || moodConfig.neutral;
      
      songSuggestion.innerHTML = `
        <div class="mood-card bg-white bg-opacity-90 rounded-2xl p-6 shadow-lg border border-white border-opacity-20 slide-up">
          <div class="text-center mb-4">
            <div class="text-4xl mb-2">${moodInfo.emoji}</div>
            <h3 class="text-xl font-bold text-gray-800 mb-1">${capitalize(mood)} Mood</h3>
            <p class="text-gray-600 text-sm">Here's a song that matches your mood</p>
          </div>
          
          <div class="bg-gradient-to-r ${moodInfo.color} rounded-xl p-4 mb-4">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-4">
                <i class="fab fa-spotify text-white text-lg"></i>
              </div>
              <div class="flex-1">
                <h4 class="text-white font-semibold text-lg">${song.name}</h4>
                <p class="text-white text-opacity-90">${song.artists.map(artist => artist.name).join(', ')}</p>
              </div>
            </div>
          </div>
          
          <div class="flex space-x-3">
            <a href="${song.external_urls.spotify}" target="_blank" 
               class="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white text-center py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <i class="fab fa-spotify mr-2"></i>
              Play on Spotify
            </a>
            <button id="refresh-song-btn" 
                    class="px-4 py-3 bg-white bg-opacity-20 text-white rounded-xl hover:bg-opacity-30 transition-all duration-300">
              <i class="fas fa-sync-alt"></i>
            </button>
          </div>
          
          ${song.album.images && song.album.images.length > 0 ? `
            <div class="mt-4 text-center">
              <img src="${song.album.images[0].url}" alt="Album Cover" class="w-16 h-16 rounded-lg mx-auto shadow-md">
            </div>
          ` : ''}
        </div>
      `;
      
      // Add event listener to the refresh button
      setTimeout(() => {
        const refreshBtn = document.getElementById('refresh-song-btn');
        if (refreshBtn) {
          refreshBtn.addEventListener('click', () => suggestSong(mood));
        }
      }, 100);
    } else {
      songSuggestion.innerHTML = `
        <div class="text-center text-white text-opacity-80">
          <i class="fas fa-music text-2xl mb-2"></i>
          <p>No songs found for this mood. Try again!</p>
        </div>
      `;
    }
  } catch (error) {
    console.error('Song suggestion error:', error);
    songSuggestion.innerHTML = `
      <div class="text-center text-white text-opacity-80">
        <i class="fas fa-exclamation-triangle text-2xl mb-2"></i>
        <p>Unable to fetch song suggestions. Please try again.</p>
        <button onclick="showSpotifySetup()" 
                class="mt-3 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
          <i class="fab fa-spotify mr-2"></i>
          Connect Spotify
        </button>
      </div>
    `;
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Handle Mood Check button
moodCheckBtn.addEventListener('click', async () => {
  // Clear previous results
  moodDisplay.innerHTML = '';
  songSuggestion.innerHTML = '';
  
  // Show loading state
  loadingSpinner.classList.remove('hidden');
  moodCheckBtn.disabled = true;
  moodCheckBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-3"></i>Analyzing...';
  
  try {
    // Detect mood with timeout
    const mood = await detectMood();
    
    // Hide loading
    loadingSpinner.classList.add('hidden');
    moodCheckBtn.disabled = false;
    moodCheckBtn.innerHTML = '<i class="fas fa-brain mr-3"></i>Detect My Mood';
    
    if (mood) {
      const moodInfo = moodConfig[mood] || moodConfig.neutral;
      
      // Show mood result with animation
      moodDisplay.innerHTML = `
        <div class="flex items-center justify-center space-x-3 slide-up">
          <div class="text-3xl">${moodInfo.emoji}</div>
          <div>
            <h2 class="text-2xl font-bold text-white">${capitalize(mood)}</h2>
            <p class="text-white text-opacity-80 text-sm">
              ${!modelsLoaded ? 'Fallback mode - AI models not loaded' : 'Mood detected successfully!'}
            </p>
          </div>
        </div>
      `;
      
      // Get song suggestion
      await suggestSong(mood);
    } else {
      moodDisplay.innerHTML = `
        <div class="flex items-center justify-center text-white text-opacity-80">
          <i class="fas fa-user-slash mr-2"></i>
          <span>No face detected. Please position your face in the camera.</span>
        </div>
      `;
    }
  } catch (error) {
    console.error('Error during mood detection:', error);
    loadingSpinner.classList.add('hidden');
    moodCheckBtn.disabled = false;
    moodCheckBtn.innerHTML = '<i class="fas fa-brain mr-3"></i>Detect My Mood';
    showError('Something went wrong. Please try again.');
  }
});

// Initialize
window.addEventListener('DOMContentLoaded', async () => {
  try {
    console.log('Starting initialization...');
    
    // Check Spotify authentication
    checkSpotifyAuth();
    
    // Wait a bit for face-api.js to load
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Try to load models (this will fail gracefully if face-api is not available)
    const modelsResult = await loadModels();
    
    // Try to start webcam
    const webcamResult = await startWebcam();
    
    // Determine what to show based on what loaded successfully
    if (webcamResult) {
      if (modelsResult) {
        showSuccess('AI models loaded successfully! Click the button to detect your mood.');
      } else {
        showSuccess('Using fallback mode - AI models not available. Click the button for mood-based music!');
      }
    } else {
      // If webcam fails, show error but still allow fallback mode
      moodDisplay.innerHTML = `
        <div class="text-center">
          <div class="text-4xl mb-3">⚠️</div>
          <h2 class="text-xl font-semibold text-white mb-2">Camera Access Required</h2>
          <p class="text-white text-opacity-80 mb-4">Please allow camera permissions to use mood detection.</p>
          <p class="text-white text-opacity-60 text-sm">You can still try the app in fallback mode!</p>
        </div>
      `;
      // Disable the button if no webcam
      moodCheckBtn.disabled = true;
      moodCheckBtn.innerHTML = '<i class="fas fa-camera-slash mr-3"></i>Camera Required';
    }
    
    // Show Spotify setup by default
    showSpotifySetup();
    
    console.log('Initialization complete. Models:', modelsResult, 'Webcam:', webcamResult);
    
  } catch (error) {
    console.error('Initialization error:', error);
    showSuccess('App loaded with limited functionality. Click the button to try mood-based music!');
    showSpotifySetup();
  }
});

// Add some interactive effects
document.addEventListener('DOMContentLoaded', () => {
  // Add hover effects to the main card
  const mainCard = document.querySelector('.glass-effect');
  if (mainCard) {
    mainCard.addEventListener('mouseenter', () => {
      mainCard.style.transform = 'scale(1.02)';
    });
    mainCard.addEventListener('mouseleave', () => {
      mainCard.style.transform = 'scale(1)';
    });
  }
});
