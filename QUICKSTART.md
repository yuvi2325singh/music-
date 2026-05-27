# 🚀 Quick Start Guide - Pulse Music

Get up and running with Pulse Music in 5 minutes!

## Step 1: Clone & Run (2 min)

```bash
# Clone the repository
git clone <repository-url>
cd pulse-music

# Start a local server
python -m http.server 8000

# Open browser
# http://localhost:8000
```

## Step 2: Login (1 min)

**Demo Account:**
- Email: `demo@pulse.com`
- Password: `demo123`

Or create a new account.

## Step 3: Explore (2 min)

- 🏠 **Home** - Browse trending songs and playlists
- 🔍 **Search** - Find your favorite music
- 🎵 **Play** - Click any song to start playing
- ❤️ **Like** - Save songs to your library
- 📋 **Playlists** - Create and manage playlists

## 🎛️ Main Controls

| Control | Action |
|---------|--------|
| **Play/Pause** | ▶ / ▮▮ button |
| **Next Song** | ⏭ button |
| **Previous Song** | ⏮ button |
| **Volume** | 🔊 slider |
| **Shuffle** | 🔀 button |
| **Repeat** | 🔁 button |
| **Like** | ♥ button |
| **Search** | 🔍 bar at top |

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **Space** | Play/Pause |
| **→** | Next Song |
| **←** | Previous Song |
| **↑** | Volume Up |
| **↓** | Volume Down |

## 📚 Developer Quick Start

### Using the AudioManager
```javascript
import { AudioManager } from './src/player/audioManager.js';

const audioManager = new AudioManager(audioElement);
await audioManager.loadAndPlay(songObject);
```

### Using AppState
```javascript
import { AppState } from './src/state/appState.js';

const state = new AppState();
state.set('isPlaying', true);
state.subscribe((path, value) => console.log(path, value));
```

### Using Search
```javascript
import { SearchEngine } from './src/search/searchEngine.js';

const search = new SearchEngine(songs, albums, artists);
const results = search.search('query');
```

### Using UI Components
```javascript
import { UIComponent } from './src/components/UIComponent.js';

const card = UIComponent.createCard(song, 'song');
const toast = UIComponent.createToast('Success!', 'success');
```

## 🔧 Configuration

### Change Supabase URL
Edit `supabase.js`:
```javascript
const SUPABASE_URL = 'your-url.supabase.co';
const SUPABASE_ANON_KEY = 'your-key';
```

### Customize Theme Colors
Edit `style.css`:
```css
:root {
  --accent: #1db954;  /* Change primary color */
  --bg: #121212;      /* Change background */
}
```

## 📁 Important Files

| File | Purpose |
|------|---------|
| `index.html` | Main page |
| `app.js` | Main application logic |
| `style.css` | Global styles |
| `supabase.js` | Supabase configuration |
| `src/` | Modular code |
| `DATABASE_SCHEMA.md` | Database design |
| `ARCHITECTURE.md` | Technical architecture |

## ✅ Checklist

- [ ] Clone repository
- [ ] Start local server
- [ ] Open localhost:8000
- [ ] Login with demo account
- [ ] Play a song
- [ ] Create a playlist
- [ ] Read ARCHITECTURE.md for deep dive
- [ ] Explore src/ modules
- [ ] Customize to your needs

## 🆘 Common Issues

### "Songs won't play"
✅ Check browser console (F12 → Console)
✅ Verify audio files exist in `assets/songs/`
✅ Check file paths are correct

### "Search not working"
✅ Refresh page (Ctrl+R)
✅ Check console for errors
✅ Ensure data is loaded

### "Supabase connection fails"
✅ Use demo mode (set empty credentials)
✅ Verify internet connection
✅ Check Supabase credentials

### "Styling looks broken"
✅ Clear browser cache (Ctrl+Shift+Delete)
✅ Refresh page (Ctrl+R)
✅ Check CSS files are loaded

## 📖 Next Steps

1. **Read [ARCHITECTURE.md](./ARCHITECTURE.md)** - Understand module structure
2. **Explore `src/` directory** - See modular code
3. **Set up Supabase** - For full features
4. **Customize design** - Update colors and fonts
5. **Deploy** - Share your music platform

## 🎯 Tutorial: Create a Playlist

```javascript
import { playlistManager } from './src/modules.js';
import { UIComponent } from './src/components/UIComponent.js';

// 1. Create playlist
const playlist = playlistManager.createPlaylist(
  userId,
  'My Awesome Playlist'
);

// 2. Add songs
playlist.songs.forEach(song => {
  playlistManager.addSongToPlaylist(playlist.id, song);
});

// 3. Show success
const toast = UIComponent.createToast(
  'Playlist created!',
  'success'
);
document.body.appendChild(toast);

// 4. Render UI
renderPlaylistUI(playlist);
```

## 🚀 Deployment

### Quick Deploy to Vercel
```bash
npm install -g vercel
vercel deploy
```

### Or Manual Upload
1. Upload all files to your hosting
2. Configure HTTPS
3. Update Supabase credentials
4. Share the link!

## 💡 Pro Tips

- **Add more songs** - Put MP3 files in `assets/songs/`
- **Update images** - Add images to `assets/images/`
- **Dark mode only** - Theme is optimized for dark mode
- **Mobile first** - Responsive design works great on phones
- **No build needed** - Pure HTML/CSS/JavaScript!

## 🎓 Learning Resources

- **Supabase Docs** - https://supabase.com/docs
- **MDN JavaScript** - https://developer.mozilla.org/en-US/docs/Web/JavaScript
- **CSS Tricks** - https://css-tricks.com
- **Web.dev** - https://web.dev

## 📞 Getting Help

1. Check [ARCHITECTURE.md](./ARCHITECTURE.md)
2. Look at inline code comments
3. Check browser console for errors
4. Read function documentation in src/
5. Open an issue on GitHub

---

**Enjoy building! 🎵**

For detailed technical info, see [ARCHITECTURE.md](./ARCHITECTURE.md)
