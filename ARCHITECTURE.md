# Pulse Music - Project Architecture Documentation

## Overview

Pulse Music has been completely restructured into a modern, modular architecture with separated concerns, reusable components, and professional-grade code organization.

## Directory Structure

```
project-root/
├── src/
│   ├── auth/                    # Authentication logic
│   │   └── authService.js      # Auth operations & session management
│   ├── player/                  # Audio player functionality
│   │   ├── audioManager.js     # Audio loading & playback with error handling
│   │   └── playerControl.js    # Player UI controls & state management
│   ├── search/                  # Search functionality
│   │   └── searchEngine.js     # Fuzzy search, suggestions, recommendations
│   ├── playlists/               # Playlist management
│   │   └── playlistManager.js  # Create, edit, reorder playlists
│   ├── services/                # External services
│   │   ├── supabaseService.js  # Database operations
│   │   └── analyticsService.js # Tracking & analytics
│   ├── state/                   # State management
│   │   └── appState.js         # Centralized application state
│   ├── utils/                   # Utility functions
│   │   ├── helpers.js          # Common helper functions
│   │   ├── constants.js        # App constants & configuration
│   │   └── validation.js       # Input validation utilities
│   ├── components/              # UI Components
│   │   ├── UIComponent.js      # Reusable UI component factory
│   │   └── NotificationManager.js
│   └── styles/                  # Stylesheets
│       ├── modern-ui.css       # Modern components & animations
│       └── responsive.css      # Mobile & responsive styles
├── assets/                      # Static assets
│   ├── images/                  # Album covers, artist photos
│   ├── songs/                   # Audio files
│   └── icons/                   # Icon assets
├── pages/                       # Static pages (legacy)
├── components/                  # Legacy components
├── app.js                       # Main application entry (to be refactored)
├── index.html                   # Main page
├── login.html                   # Login page
├── signup.html                  # Signup page
└── DATABASE_SCHEMA.md           # Database schema documentation
```

## Core Modules

### 1. Audio Manager (`src/player/audioManager.js`)

Handles all audio playback with professional error handling.

```javascript
import { AudioManager } from './src/player/audioManager.js';

const audio = document.querySelector('#audio-player');
const audioManager = new AudioManager(audio, {
  maxRetries: 3,
  onLoadStart: () => showSpinner(),
  onLoadEnd: () => hideSpinner(),
  onError: (msg) => showToast(msg),
  onAutoSkip: (title) => showToast(`Skipping ${title}...`),
});

// Load and play
await audioManager.loadAndPlay(songObject);

// Preload next song
audioManager.preloadNext(() => getNextSong());
```

**Features:**
- Automatic retry logic (up to 3 attempts)
- Error detection and user-friendly messages
- Next song preloading for smooth transitions
- Failed song tracking to prevent repeated attempts
- Proper Promise handling for modern browsers

### 2. Application State (`src/state/appState.js`)

Centralized state management with observers.

```javascript
import { AppState } from './src/state/appState.js';

const state = new AppState({
  songs: demoSongs,
  albums: demoAlbums,
  artists: demoArtists,
});

// Subscribe to changes
state.subscribe((path, value) => {
  console.log(`${path} changed to`, value);
  updateUI();
});

// Get state
const isLiked = state.isLiked(songId);
const playlists = state.getPlaylists();

// Update state
state.set('isPlaying', true);
state.addNotification('Song added to playlist', 'success');

// Save/Load from localStorage
state.save();
state.load();
```

**Features:**
- Reactive state with subscribers
- Nested path access (`state.get('user.profile.name')`)
- Built-in persistence with localStorage
- Notification system
- Type-safe state updates

### 3. Search Engine (`src/search/searchEngine.js`)

Advanced search with fuzzy matching and ranking.

```javascript
import { SearchEngine } from './src/search/searchEngine.js';

const search = new SearchEngine(songs, albums, artists);

// Search with fuzzy matching
const results = search.search('adele rolling');
// Returns ranked results for "rolling in the deep"

// Get suggestions while typing
const suggestions = search.getSuggestions('adele', 5);

// Get trending songs
const trending = search.getTrending(10);

// Get recommendations based on history
const recommended = search.getRecommended(recentSearches, 10);
```

**Features:**
- Fuzzy string matching for typo tolerance
- Multi-field search (title, artist, album, genre)
- Smart ranking and scoring
- Suggestion generation
- Trending content
- Personalized recommendations

### 4. Playlist Manager (`src/playlists/playlistManager.js`)

Complete playlist operations with drag-and-drop support.

```javascript
import { PlaylistManager } from './src/playlists/playlistManager.js';

const playlists = new PlaylistManager();

// Create playlist
const playlist = playlists.createPlaylist(userId, 'My Favorite Songs');

// Add/remove songs
playlists.addSongToPlaylist(playlistId, song);
playlists.removeSongFromPlaylist(playlistId, songId);

// Reorder (drag and drop)
playlists.reorderSongs(playlistId, oldIndex, newIndex);

// Collaborate
playlists.makeCollaborative(playlistId, [userId1, userId2]);
playlists.addCollaborator(playlistId, newUserId);

// Export/Import
const json = playlists.exportPlaylist(playlistId);
playlists.importSongs(playlistId, songs);
```

**Features:**
- Create, edit, delete playlists
- Add/remove songs with position tracking
- Drag-and-drop reordering
- Collaborative playlists
- Import/export functionality
- Duplicate playlists
- Public/private visibility

### 5. Supabase Service (`src/services/supabaseService.js`)

Database operations and API integration.

```javascript
import { SupabaseService } from './src/services/supabaseService.js';

// Authentication
await SupabaseService.signUp(email, password, username);
await SupabaseService.signIn(email, password);
const { data } = await SupabaseService.getSession();

// User data
await SupabaseService.likeSong(userId, songId);
await SupabaseService.unlikeSong(userId, songId);
const liked = await SupabaseService.getLikedSongs(userId);

// Playlists
await SupabaseService.createPlaylist(userId, title);
await SupabaseService.addSongToPlaylist(playlistId, songId);

// Analytics
await SupabaseService.recordPlay(userId, songId, duration);
```

**Features:**
- User authentication and profiles
- CRUD operations for all data
- Relationship management
- Error handling
- Fallback to demo mode if Supabase unavailable

### 6. UI Components (`src/components/UIComponent.js`)

Factory for creating modern UI elements.

```javascript
import { UIComponent } from './src/components/UIComponent.js';

// Create card
const card = UIComponent.createCard(song, 'song');
container.appendChild(card);

// Show toast notification
const toast = UIComponent.createToast('Song added!', 'success', 3000);
document.body.appendChild(toast);

// Show modal
const modal = UIComponent.createModal({
  title: 'Create Playlist',
  message: 'Enter playlist name:',
  showInput: true,
  onPrimary: (value) => createPlaylist(value),
});
document.body.appendChild(modal);

// Show loading skeleton
const skeletons = UIComponent.createSkeleton('card', 6);
container.appendChild(...skeletons);

// Show spinner
const spinner = UIComponent.createSpinner('medium');
loadingDiv.appendChild(spinner);
```

**Features:**
- Card components with hover effects
- Toast notifications (success, error, warning, info)
- Modal dialogs
- Loading skeletons
- Spinners
- Queue items with drag handles
- Search suggestions

### 7. Utility Helpers (`src/utils/helpers.js`)

Common utility functions.

```javascript
import { formatTime, debounce, storage, truncate } from './src/utils/helpers.js';

// Format time
const formatted = formatTime(245); // "4:05"

// Debounce search
const search = debounce((query) => {
  // Expensive search operation
}, 300);
input.addEventListener('input', (e) => search(e.target.value));

// Safe localStorage
storage.set('key', { data: 'value' });
const data = storage.get('key', {});
storage.remove('key');

// Text utilities
const truncated = truncate('Long text...', 20); // "Long text..."
const escaped = escapeHtml('<script>alert()'); // "&lt;script&gt;..."
```

**Features:**
- Time formatting (MM:SS)
- Debounce/throttle for performance
- Safe localStorage operations
- Text truncation and escaping
- Lazy image loading
- Number formatting
- Query string parsing

## Usage Examples

### Initialize Application

```javascript
import { AppState } from './src/state/appState.js';
import { AudioManager } from './src/player/audioManager.js';
import { SearchEngine } from './src/search/searchEngine.js';
import { PlaylistManager } from './src/playlists/playlistManager.js';
import { UIComponent } from './src/components/UIComponent.js';

// Initialize state
const appState = new AppState({
  songs: demoSongs,
  albums: demoAlbums,
  artists: demoArtists,
});

// Initialize audio player
const audioManager = new AudioManager(
  document.querySelector('#audio-player'),
  {
    onLoadStart: () => UIComponent.createSpinner(),
    onError: (msg) => UIComponent.createToast(msg, 'error'),
  }
);

// Initialize search
const searchEngine = new SearchEngine(demoSongs, demoAlbums, demoArtists);

// Initialize playlists
const playlistManager = new PlaylistManager();

// Subscribe to state changes
appState.subscribe((path, value) => {
  if (path === 'isPlaying') {
    updatePlayButton();
  }
});
```

### Play Song

```javascript
async function playSong(song) {
  appState.set('currentSong', song);
  appState.addToast(`▶ Playing ${song.title}`, 'info');

  const success = await audioManager.loadAndPlay(song);
  if (success) {
    appState.set('isPlaying', true);
    audioManager.preloadNext(() => getNextSong());
    appState.recordPlay(song.id);
  }
}
```

### Search with Suggestions

```javascript
const searchInput = document.querySelector('#search-input');

searchInput.addEventListener('input', debounce((e) => {
  const query = e.target.value;
  const suggestions = searchEngine.getSuggestions(query, 5);

  suggestionsList.innerHTML = '';
  suggestions.forEach((item) => {
    const suggestion = UIComponent.createSearchSuggestion(item);
    suggestionsList.appendChild(suggestion);
  });
}, 300));
```

### Create and Manage Playlists

```javascript
function createPlaylist() {
  const modal = UIComponent.createModal({
    title: 'Create Playlist',
    message: 'What should we call your playlist?',
    showInput: true,
    onPrimary: (title) => {
      const playlist = playlistManager.createPlaylist(userId, title);
      appState.addNotification(`Playlist "${title}" created!`, 'success');
    },
  });
  document.body.appendChild(modal);
}

function reorderPlaylist(playlistId, oldIndex, newIndex) {
  playlistManager.reorderSongs(playlistId, oldIndex, newIndex);
  appState.addToast('Playlist reordered', 'success');
  renderPlaylist(playlistId);
}
```

## Performance Optimizations

1. **Code Splitting** - Lazy load modules as needed
2. **Debouncing** - Search queries debounced by 300ms
3. **Preloading** - Next song preloaded during current playback
4. **Caching** - Playlist data cached in state and localStorage
5. **Lazy Loading** - Images lazy loaded with IntersectionObserver
6. **Audio Pooling** - Reuse audio elements instead of creating new ones

## Testing

```javascript
// Unit tests for modules
import { AudioManager } from './src/player/audioManager.js';

describe('AudioManager', () => {
  it('should retry failed playback', async () => {
    const manager = new AudioManager(audioEl);
    const song = { id: '1', audio_url: 'invalid.mp3' };

    const result = await manager.loadAndPlay(song);
    expect(manager.failedSongs.has('1')).toBe(true);
  });
});
```

## Migration Path

From old monolithic `app.js` to new modular structure:

1. ✅ Create `src/` directory structure
2. ✅ Extract audio logic → `AudioManager`
3. ✅ Extract search logic → `SearchEngine`
4. ✅ Extract playlists → `PlaylistManager`
5. ✅ Extract state → `AppState`
6. Create refactored `app.js` using new modules
7. Update HTML to import new modules
8. Test and validate all features
9. Remove legacy code

## Best Practices

1. **Always use AppState** for data that needs to persist
2. **Use AudioManager** for all playback operations
3. **Debounce search input** to avoid excessive queries
4. **Use UIComponent factory** for consistency
5. **Subscribe to state changes** for reactive updates
6. **Handle errors gracefully** with user-friendly messages
7. **Lazy load images** for better performance
8. **Use localStorage** for offline functionality

## Future Enhancements

- [ ] Service Worker for offline support
- [ ] Real-time collaborative playlists
- [ ] Advanced analytics dashboard
- [ ] Voice search functionality
- [ ] Lyrics synchronization
- [ ] Social features (sharing, comments)
- [ ] Progressive Web App (PWA)
- [ ] Real-time notifications
