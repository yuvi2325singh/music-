import { supabase } from './supabase.js';

const demoSongs = [
  {
    id: 's1',
    title: 'MF Gabhru',
    artist: 'Karan Aujla',
    album: 'P-Pop Culture',
    image: '../assets/images/Gabhru.jpg',
    audio_url: 'assets/songs/gabhru.mp3',
    duration: '3:28',
    plays: 128000,
    color: '#0f7a4f',
    lyrics: ['Rakhda main gabru jatt da style, nazran vich rehnda wild.', 'Raat diyan gallan ch tu suni mere naal, dil kehnda rehnda dilbar mild.'],
  },
  {
    id: 's2',
    title: 'Barood',
    artist: 'Sidhu Moosewala',
    album: 'Sidhu',
    image: '../assets/images/barood.jpg',
    audio_url: 'assets/songs/barood.mp3',
    duration: '4:12',
    plays: 94000,
    color: '#4e8cdb',
    lyrics: ['Barood di teer ch chalde ne yaar mere naal.', 'Gal mukdi nahi, es zindagi diyan raahan vich jawaan haal.'],
  },
  {
    id: 's3',
    title: 'Don',
    artist: 'Diljit Dosanjh',
    album: 'Diljit',
    image: '../assets/images/Don.jpg',
    audio_url: 'assets/songs/Don.mp3',
    duration: '3:58',
    plays: 113500,
    color: '#a24878',
    lyrics: ['Don jiven raah chon guzar jaavan, hamesha style mere nal.', 'Gallan karan duniya nal, par dil vich bas tu hi khas.'],
  },
  {
    id: 's4',
    title: 'Vancouver',
    artist: 'Cheema Y',
    album: 'G.O.A.T.',
    image: '../assets/images/Young.jpg',
    audio_url: 'assets/songs/Vancouver.mp3',
    duration: '4:04',
    plays: 76000,
    color: '#dd6c5f',
    lyrics: ['Vancouver di raat ch tu mere naal, shehar di roshni bana lai paas.', 'Yaar mere kehnde oh jehri gallan, dil vich rehndiyan ne akhri aas.'],
  },
];

const demoAlbums = [
  {
    id: 'a1',
    title: 'Neon Drift',
    artist: 'Luna Matrix',
    image: 'https://images.unsplash.com/photo-1507878866276-a947ef722fee?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'a2',
    title: 'Astral Waves',
    artist: 'Nyx Odyssey',
    image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'a3',
    title: 'Afterglow',
    artist: 'Echo Harbor',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'a4',
    title: 'Midnight Motion',
    artist: 'Nova Echo',
    image: 'https://images.unsplash.com/photo-1511376777868-611b54f68947?auto=format&fit=crop&w=800&q=80',
  },
];

const demoArtists = [
  {
    id: 'ar1',
    name: 'Karan Aujla',
    genre: 'Punjabi Pop',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    followers: 1200000,
    songs: ['s1'],
  },
  {
    id: 'ar2',
    name: 'Sidhu Moosewala',
    genre: 'Hip Hop',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
    followers: 950000,
    songs: ['s2'],
  },
  {
    id: 'ar3',
    name: 'Diljit Dosanjh',
    genre: 'Bhangra',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    followers: 2100000,
    songs: ['s3'],
  },
  {
    id: 'ar4',
    name: 'Cheema Y',
    genre: 'Electronica',
    image: 'https://images.unsplash.com/photo-1497032205916-ac775f0649ae?auto=format&fit=crop&w=800&q=80',
    followers: 450000,
    songs: ['s4'],
  },
];

const demoPlaylists = [
  { id: 'p1', title: 'Late Night Drive' },
  { id: 'p2', title: 'Chill Vibes' },
  { id: 'p3', title: 'Focus Flow' },
  { id: 'p4', title: 'Weekend Energy' },
  { id: 'p5', title: 'Morning Pulse' },
];

const state = {
  session: null,
  user: null,
  songs: demoSongs,
  playlists: [],
  likedSongs: [],
  followedArtists: [],
  currentIndex: 0,
  isPlaying: false,
  queue: [...demoSongs],
  repeatMode: false,
  shuffleMode: false,
  recentlyPlayed: [],
  notifications: [],
};

const dom = {
  searchInput: document.querySelector('#global-search'),
  searchResultsSection: document.querySelector('#search-results-section'),
  searchResults: document.querySelector('#search-results'),
  searchSuggestions: document.querySelector('#search-suggestions'),
  trendingCards: document.querySelector('#trending-cards'),
  madeCards: document.querySelector('#made-cards'),
  albumCards: document.querySelector('#album-cards'),
  topArtistCards: document.querySelector('#top-artist-cards'),
  recentlyPlayed: document.querySelector('#recently-played'),
  sidebarPlaylists: document.querySelector('#sidebar-playlists'),
  notificationPanel: document.querySelector('#notification-panel'),
  notificationList: document.querySelector('#notification-list'),
  clearNotificationsBtn: document.querySelector('#clear-notifications'),
  premiumBtn: document.querySelector('#premium-btn'),
  premiumSection: document.querySelector('#premium-section'),
  sidebarUsername: document.querySelector('#sidebar-username'),
  topbarName: document.querySelector('#topbar-name'),
  playerCover: document.querySelector('#player-cover'),
  playerTitle: document.querySelector('#player-song-title'),
  playerArtist: document.querySelector('#player-artist'),
  playerLike: document.querySelector('#player-like'),
  playPauseBtn: document.querySelector('#play-pause-btn'),
  prevBtn: document.querySelector('#prev-btn'),
  nextBtn: document.querySelector('#next-btn'),
  shuffleBtn: document.querySelector('#shuffle-btn'),
  repeatBtn: document.querySelector('#repeat-btn'),
  queueBtn: document.querySelector('#queue-btn'),
  deviceBtn: document.querySelector('#device-btn'),
  volumeSlider: document.querySelector('#volume-slider'),
  muteBtn: document.querySelector('#mute-btn'),
  currentTime: document.querySelector('#current-time'),
  totalTime: document.querySelector('#total-time'),
  progressTrack: document.querySelector('#progress-track'),
  progressFill: document.querySelector('#progress-fill'),
  progressThumb: document.querySelector('#progress-thumb'),
  lyricsModal: document.querySelector('#lyrics-modal'),
  closeLyrics: document.querySelector('#close-lyrics'),
  audioPlayer: document.querySelector('#audio-player'),
  heroPlay: document.querySelector('#hero-play'),
  toastContainer: document.querySelector('#toast-container'),
  modalOverlay: document.querySelector('#modal-overlay'),
  modalTitle: document.querySelector('#modal-title'),
  modalText: document.querySelector('#modal-text'),
  modalInput: document.querySelector('#modal-input'),
  modalPrimary: document.querySelector('#modal-primary'),
  modalSecondary: document.querySelector('#modal-secondary'),
  modalClose: document.querySelector('#modal-close'),
  librarySection: document.querySelector('#library-section'),
  libraryGrid: document.querySelector('#library-grid'),
  openLikedSongsBtn: document.querySelector('#open-liked-songs'),
  loginForm: document.querySelector('#login-form'),
  signupForm: document.querySelector('#signup-form'),
  loginEmail: document.querySelector('#login-email'),
  loginPassword: document.querySelector('#login-password'),
  signupEmail: document.querySelector('#signup-email'),
  signupPassword: document.querySelector('#signup-password'),
  signupUsername: document.querySelector('#signup-username'),
};

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}

function getStoredState() {
  const stored = localStorage.getItem('pulse-state');
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch (err) {
    return null;
  }
}

function saveStoredState() {
  const snapshot = {
    playlists: state.playlists,
    likedSongs: state.likedSongs,
    followedArtists: state.followedArtists,
    queue: state.queue,
    currentIndex: state.currentIndex,
    isPlaying: state.isPlaying,
    currentTime: dom.audioPlayer?.currentTime || 0,
    recentlyPlayed: state.recentlyPlayed,
  };
  localStorage.setItem('pulse-state', JSON.stringify(snapshot));
}

function savePlaybackState() {
  const playbackData = {
    currentSongId: state.queue[state.currentIndex]?.id,
    currentTime: dom.audioPlayer?.currentTime || 0,
    isPlaying: state.isPlaying,
    volume: dom.audioPlayer?.volume || 0.75,
  };
  localStorage.setItem('pulse-playback', JSON.stringify(playbackData));
}

function restorePlaybackState() {
  const playbackData = localStorage.getItem('pulse-playback');
  if (!playbackData) return;
  try {
    const { currentSongId, currentTime, isPlaying, volume } = JSON.parse(playbackData);
    if (currentSongId) {
      const songIndex = state.queue.findIndex((song) => song.id === currentSongId);
      if (songIndex !== -1) {
        state.currentIndex = songIndex;
        const song = state.queue[state.currentIndex];
        dom.audioPlayer.src = song.audio_url;
        dom.audioPlayer.currentTime = currentTime || 0;
        if (dom.volumeSlider) dom.volumeSlider.value = volume || 0.75;
        dom.audioPlayer.volume = volume || 0.75;
        updatePlayerDetails(song);
        if (isPlaying) {
          dom.audioPlayer.play().catch(() => {
            state.isPlaying = false;
            dom.playPauseBtn.textContent = '▶';
          });
          state.isPlaying = true;
          if (dom.playPauseBtn) dom.playPauseBtn.textContent = '▮▮';
        }
      }
    }
  } catch (err) {
    console.log('Error restoring playback state');
  }
}

function openSongPage(id) {
  window.location.href = `song.html?id=${encodeURIComponent(id)}`;
}

function openAlbumPage(id) {
  window.location.href = `album.html?id=${encodeURIComponent(id)}`;
}

function openPlaylistPage(id) {
  window.location.href = `playlist.html?id=${encodeURIComponent(id)}`;
}

function openArtistPage(id) {
  window.location.href = `index.html?artist=${encodeURIComponent(id)}`;
}

function getSongById(id) {
  return state.songs.find((song) => song.id === id);
}

function getAlbumById(id) {
  return demoAlbums.find((album) => album.id === id);
}

function getArtistById(id) {
  return demoArtists.find((artist) => artist.id === id);
}

function getPlaylistById(id) {
  return state.playlists.find((playlist) => playlist.id === id) || demoPlaylists.find((playlist) => playlist.id === id);
}

function renderSidebarPlaylists() {
  if (!dom.sidebarPlaylists) return;
  dom.sidebarPlaylists.innerHTML = '';
  const playlists = state.playlists.length ? state.playlists : demoPlaylists;
  playlists.forEach((playlist) => {
    const item = document.createElement('button');
    item.className = 'playlist-chip';
    item.textContent = playlist.title;
    item.addEventListener('click', () => {
      openPlaylistPage(playlist.id);
    });
    dom.sidebarPlaylists.append(item);
  });
}

function renderRecentlyPlayed() {
  if (!dom.recentlyPlayed) return;
  dom.recentlyPlayed.innerHTML = '';
  if (!state.recentlyPlayed.length) {
    dom.recentlyPlayed.innerHTML = '<p class="muted">Play some songs to build your recently played list.</p>';
    return;
  }

  state.recentlyPlayed.forEach((songId) => {
    const song = getSongById(songId);
    if (!song) return;
    const item = document.createElement('button');
    item.className = 'recently-item';
    item.innerHTML = `
      <span>
        <strong>${song.title}</strong>
        <small>${song.artist}</small>
      </span>
      <span>${song.duration}</span>
    `;
    item.addEventListener('click', () => playSongById(song.id));
    dom.recentlyPlayed.append(item);
  });
}

function renderTopArtists() {
  renderCardSection(dom.topArtistCards, demoArtists);
}

function addNotification(message) {
  state.notifications.unshift({
    id: Date.now(),
    message,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  });
  if (state.notifications.length > 5) {
    state.notifications.length = 5;
  }
  renderNotifications();
}

function renderNotifications() {
  if (!dom.notificationList) return;
  if (!state.notifications.length) {
    dom.notificationList.innerHTML = '<div class="notification-empty">No notifications yet. Play a song or like a track to see updates.</div>';
    return;
  }
  dom.notificationList.innerHTML = state.notifications.map((note) => `
    <div class="notification-item">
      <div>
        <strong>${note.message}</strong>
        <small>${note.time}</small>
      </div>
    </div>
  `).join('');
}

function toggleNotificationPanel() {
  if (!dom.notificationPanel) return;
  const open = dom.notificationPanel.classList.toggle('visible');
  if (open) {
    renderNotifications();
  }
}

function openPremiumSection() {
  if (!dom.premiumSection) return;
  document.body.classList.remove('search-active');
  if (dom.searchResultsSection) dom.searchResultsSection.hidden = true;
  document.querySelectorAll('.section-block').forEach((section) => {
    if (section.id !== 'premium-section') section.hidden = true;
  });
  const hero = document.querySelector('.hero-panel');
  if (hero) hero.hidden = true;
  dom.premiumSection.hidden = false;
  setActiveView('premium');
}

function clearNotifications() {
  state.notifications = [];
  renderNotifications();
  showToast('Notifications cleared');
}

function updateRecentlyPlayed(songId) {
  if (!songId) return;
  const index = state.recentlyPlayed.indexOf(songId);
  if (index !== -1) state.recentlyPlayed.splice(index, 1);
  state.recentlyPlayed.unshift(songId);
  state.recentlyPlayed = state.recentlyPlayed.slice(0, 5);
  saveStoredState();
  renderRecentlyPlayed();
  const song = getSongById(songId);
  if (song) addNotification(`Played ${song.title} by ${song.artist}`);
}

function renderCardSection(container, items) {
  if (!container) return;
  container.innerHTML = '';
  items.forEach((item) => {
    const title = item.title || item.name || 'Untitled';
    const subtitle = item.artist || item.album || item.genre || 'Playlist';
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <img src="${item.image}" alt="${title}" />
      <div class="card-content">
        <div>
          <h3>${title}</h3>
          <p>${subtitle}</p>
        </div>
        <div class="card-actions">
          <button class="text-btn play-card" data-id="${item.id}">${item.audio_url ? 'Play' : item.name ? 'Follow' : 'Open'}</button>
          <button class="text-btn favorite-card" data-id="${item.id}">${item.audio_url ? '♥' : item.name ? 'View' : '♥'}</button>
        </div>
      </div>
    `;

    const playButton = card.querySelector('.play-card');
    const faveButton = card.querySelector('.favorite-card');

    card.addEventListener('click', (event) => {
      if (event.target.closest('button')) return;
      if (item.audio_url) {
        openSongPage(item.id);
      } else if (item.name) {
        openArtistPage(item.id);
      } else {
        openAlbumPage(item.id);
      }
    });

    if (item.audio_url) {
      playButton.addEventListener('click', (event) => {
        event.stopPropagation();
        playSongById(item.id);
      });
      faveButton.addEventListener('click', (event) => {
        event.stopPropagation();
        toggleLike(item.id);
      });
    } else if (item.name) {
      playButton.addEventListener('click', (event) => {
        event.stopPropagation();
        toggleFollow(item.id);
        const isFollowing = state.followedArtists.includes(item.id);
        playButton.textContent = isFollowing ? 'Following' : 'Follow';
      });
      faveButton.addEventListener('click', (event) => {
        event.stopPropagation();
        openArtistPage(item.id);
      });
    } else {
      playButton.addEventListener('click', (event) => {
        event.stopPropagation();
        openAlbumPage(item.id);
      });
      faveButton.addEventListener('click', (event) => {
        event.stopPropagation();
        showToast(`Saved “${item.title}” to your library`);
      });
    }

    container.append(card);
  });
}

function renderSections() {
  renderCardSection(dom.trendingCards, state.songs);
  renderCardSection(dom.madeCards, state.songs.slice().reverse());
  renderCardSection(dom.albumCards, demoAlbums);
  renderTopArtists();
  
  // Hide premium and artist sections
  const premiumSection = document.querySelector('#premium-section');
  const artistSection = document.querySelector('#artist-profile-section');
  if (premiumSection) premiumSection.hidden = true;
  if (artistSection) artistSection.hidden = true;
}

function updatePlayerDetails(song) {
  if (!song) return;
  dom.playerCover.src = song.image;
  dom.playerTitle.textContent = song.title;
  dom.playerArtist.textContent = song.artist;
  dom.playerLike.textContent = state.likedSongs.includes(song.id) ? '♥' : '♡';
}

function playSongById(id) {
  const index = state.queue.findIndex((song) => song.id === id);
  if (index === -1) return;
  state.currentIndex = index;
  const song = state.queue[state.currentIndex];
  updateRecentlyPlayed(song.id);
  dom.audioPlayer.src = song.audio_url;
  dom.audioPlayer.play().catch(() => {
    showToast('Failed to play audio. Please try another song.');
    state.isPlaying = false;
    dom.playPauseBtn.textContent = '▶';
  });
  state.isPlaying = true;
  updatePlayerDetails(song);
  dom.playPauseBtn.textContent = '▮▮';
  showToast(`Now playing “${song.title}”`);
  saveStoredState();
}

function toggleLike(id) {
  const exists = state.likedSongs.includes(id);
  if (exists) {
    state.likedSongs = state.likedSongs.filter((songId) => songId !== id);
    showToast('Removed from liked songs');
    addNotification(`Removed ${getSongById(id)?.title || 'track'} from likes`);
  } else {
    state.likedSongs.push(id);
    showToast('Added to liked songs');
    addNotification(`Liked ${getSongById(id)?.title || 'track'}`);
  }
  if (state.queue[state.currentIndex]?.id === id) {
    dom.playerLike.textContent = exists ? '♡' : '♥';
  }
  saveStoredState();
}

function toggleFollow(artistId) {
  const exists = state.followedArtists.includes(artistId);
  const artist = getArtistById(artistId);
  if (exists) {
    state.followedArtists = state.followedArtists.filter((id) => id !== artistId);
    showToast(`Unfollowed ${artist?.name}`);
    addNotification(`Unfollowed ${artist?.name}`);
  } else {
    state.followedArtists.push(artistId);
    showToast(`Following ${artist?.name}`);
    addNotification(`Started following ${artist?.name}`);
  }
  saveStoredState();
  const followBtn = document.querySelector('#artist-follow-btn');
  if (followBtn) {
    followBtn.textContent = exists ? 'Follow' : 'Following';
    followBtn.classList.toggle('following', !exists);
  }
}

function togglePlayPause() {
  if (!dom.audioPlayer.src) {
    playSongById(state.queue[state.currentIndex].id);
    return;
  }
  if (state.isPlaying) {
    dom.audioPlayer.pause();
    dom.playPauseBtn.textContent = '▶';
  } else {
    dom.audioPlayer.play().catch(() => {
      showToast('Failed to play audio.');
      state.isPlaying = false;
      dom.playPauseBtn.textContent = '▶';
    });
    dom.playPauseBtn.textContent = '▮▮';
  }
  state.isPlaying = !state.isPlaying;
}

function nextSong() {
  if (state.shuffleMode) {
    state.currentIndex = Math.floor(Math.random() * state.queue.length);
  } else {
    state.currentIndex = (state.currentIndex + 1) % state.queue.length;
  }
  playSongById(state.queue[state.currentIndex].id);
}

function prevSong() {
  state.currentIndex = (state.currentIndex - 1 + state.queue.length) % state.queue.length;
  playSongById(state.queue[state.currentIndex].id);
}

function updateProgress() {
  const current = dom.audioPlayer.currentTime;
  const duration = dom.audioPlayer.duration || 0;
  const percent = duration ? (current / duration) * 100 : 0;
  dom.progressFill.style.width = `${percent}%`;
  dom.progressThumb.style.left = `${percent}%`;
  dom.currentTime.textContent = formatTime(current);
  dom.totalTime.textContent = formatTime(duration);
}

function seekPlayer(event) {
  const rect = dom.progressTrack.getBoundingClientRect();
  const position = Math.min(Math.max(0, event.clientX - rect.left), rect.width);
  const percent = position / rect.width;
  dom.audioPlayer.currentTime = percent * dom.audioPlayer.duration;
}

function updateVolume(value) {
  dom.audioPlayer.volume = value;
  dom.muteBtn.textContent = value > 0.05 ? '🔊' : '🔇';
}

function toggleSearchMode(active) {
  document.body.classList.toggle('search-active', active);
  if (!active) {
    dom.searchResultsSection.hidden = true;
  }
}

function displaySearchResults(query) {
  if (!dom.searchResultsSection) return;
  const trimmed = query.trim();
  if (!trimmed) {
    toggleSearchMode(false);
    dom.searchSuggestions.classList.remove('active');
    dom.searchResults.innerHTML = '';
    return;
  }

  toggleSearchMode(true);
  const lowerQuery = trimmed.toLowerCase();
  const terms = lowerQuery.split(/\s+/).filter(Boolean);
  const matches = state.songs.filter((song) => {
    const haystack = `${song.title} ${song.artist} ${song.album}`.toLowerCase();
    return terms.every((term) => haystack.includes(term));
  });

  dom.searchResults.innerHTML = '';
  if (!matches.length) {
    dom.searchResults.innerHTML = `<p class="muted">No results found for “${query}”.</p>`;
    dom.searchResultsSection.hidden = false;
    return;
  }

  matches.forEach((song) => {
    const tile = document.createElement('div');
    tile.className = 'card';
    tile.innerHTML = `
      <img src="${song.image}" alt="${song.title}" />
      <div class="card-content">
        <h3>${song.title}</h3>
        <p>${song.artist}</p>
        <div class="card-actions">
          <button class="text-btn play-card" data-id="${song.id}">Play</button>
          <button class="text-btn favorite-card" data-id="${song.id}">♥</button>
        </div>
      </div>
    `;
    tile.addEventListener('click', (event) => {
      if (event.target.closest('button')) return;
      openSongPage(song.id);
    });
    tile.querySelector('.play-card').addEventListener('click', (event) => {
      event.stopPropagation();
      playSongById(song.id);
    });
    tile.querySelector('.favorite-card').addEventListener('click', (event) => {
      event.stopPropagation();
      toggleLike(song.id);
    });
    dom.searchResults.append(tile);
  });
  dom.searchResultsSection.hidden = false;
}

function showSuggestions(query) {
  if (!dom.searchSuggestions) return;
  if (!query.trim()) {
    dom.searchSuggestions.classList.remove('active');
    dom.searchSuggestions.innerHTML = '';
    return;
  }
  const lowerQuery = query.toLowerCase();
  const songSuggestions = state.songs.filter((song) => {
    return song.title.toLowerCase().includes(lowerQuery) 
      || song.artist.toLowerCase().includes(lowerQuery);
  }).slice(0, 5);
  
  if (songSuggestions.length === 0) {
    dom.searchSuggestions.classList.remove('active');
    dom.searchSuggestions.innerHTML = '';
    return;
  }
  
  dom.searchSuggestions.classList.add('active');
  dom.searchSuggestions.innerHTML = songSuggestions.map((song) => `<button class="text-btn suggestion-item" data-id="${song.id}">${song.title} • ${song.artist}</button>`).join('');
  dom.searchSuggestions.querySelectorAll('.suggestion-item').forEach((btn) => {
    btn.addEventListener('click', () => {
      const songId = btn.dataset.id;
      const song = state.songs.find((item) => item.id === songId);
      dom.searchInput.value = song ? song.title : btn.textContent;
      displaySearchResults(dom.searchInput.value);
      playSongById(songId);
      dom.searchSuggestions.classList.remove('active');
    });
  });
}

function showToast(message) {
  if (!dom.toastContainer) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  dom.toastContainer.append(toast);
  setTimeout(() => toast.remove(), 3400);
}

function closeDialog() {
  if (!dom.modalOverlay) return;
  dom.modalOverlay.hidden = true;
  if (dom.modalInput) {
    dom.modalInput.hidden = true;
    dom.modalInput.value = '';
  }
}

function showDialog(options) {
  if (!dom.modalOverlay || !dom.modalTitle || !dom.modalText || !dom.modalPrimary || !dom.modalSecondary) return;
  dom.modalTitle.textContent = options.title || 'Confirm action';
  dom.modalText.textContent = options.message || '';
  dom.modalPrimary.textContent = options.primaryLabel || 'Confirm';
  dom.modalSecondary.textContent = options.secondaryLabel || 'Cancel';
  dom.modalOverlay.hidden = false;
  if (dom.modalInput) {
    dom.modalInput.hidden = !options.showInput;
    dom.modalInput.value = options.defaultValue || '';
    if (options.showInput) {
      setTimeout(() => dom.modalInput.focus(), 80);
    }
  }

  const close = () => {
    closeDialog();
    dom.modalPrimary.removeEventListener('click', onPrimaryClick);
    dom.modalSecondary.removeEventListener('click', onSecondaryClick);
    dom.modalClose?.removeEventListener('click', onSecondaryClick);
  };

  const onPrimaryClick = () => {
    if (typeof options.onPrimary === 'function') {
      options.onPrimary(dom.modalInput?.value.trim());
    }
    close();
  };

  const onSecondaryClick = () => {
    if (typeof options.onSecondary === 'function') {
      options.onSecondary();
    }
    close();
  };

  dom.modalPrimary.addEventListener('click', onPrimaryClick);
  dom.modalSecondary.addEventListener('click', onSecondaryClick);
  dom.modalClose?.addEventListener('click', onSecondaryClick);
}

function renderLibrary() {
  if (!dom.libraryGrid) return;
  dom.libraryGrid.innerHTML = '';

  const liked = state.likedSongs
    .map((id) => state.songs.find((song) => song.id === id))
    .filter(Boolean);

  if (liked.length === 0) {
    dom.libraryGrid.innerHTML = '<p class="muted">No liked songs yet. Hit ♥ on a track to save it.</p>';
    return;
  }

  liked.forEach((song) => {
    const item = document.createElement('article');
    item.className = 'card';
    item.innerHTML = `
      <img src="${song.image}" alt="${song.title}" />
      <div class="card-content">
        <div>
          <h3>${song.title}</h3>
          <p>${song.artist}</p>
        </div>
        <div class="card-actions">
          <button class="text-btn play-card" data-id="${song.id}">Play</button>
          <button class="text-btn favorite-card" data-id="${song.id}">♥</button>
        </div>
      </div>
    `;
    item.addEventListener('click', (event) => {
      if (event.target.closest('button')) return;
      openSongPage(song.id);
    });
    item.querySelector('.play-card').addEventListener('click', (event) => {
      event.stopPropagation();
      playSongById(song.id);
    });
    item.querySelector('.favorite-card').addEventListener('click', (event) => {
      event.stopPropagation();
      toggleLike(song.id);
    });
    dom.libraryGrid.append(item);
  });
}

function renderSongDetailPage() {
  const songId = new URLSearchParams(window.location.search).get('id');
  const song = getSongById(songId);
  if (!song) {
    document.body.innerHTML = '<div class="detail-shell"><div class="detail-content"><h1>Song not found</h1><p>Try returning to the home page.</p><a class="text-btn" href="index.html">Back to home</a></div></div>';
    return;
  }

  document.title = `${song.title} • Pulse Music`;
  
  const art = document.querySelector('#detail-song-art');
  const title = document.querySelector('#detail-title');
  const subtitle = document.querySelector('#detail-subtitle');
  const plays = document.querySelector('#detail-plays');
  const lyricsDisplay = document.querySelector('#lyrics-display');
  const relatedGrid = document.querySelector('#detail-related');

  if (art) art.src = song.image;
  if (title) title.textContent = song.title;
  if (subtitle) subtitle.textContent = `${song.artist} · ${song.album}`;
  if (plays) plays.textContent = `${song.plays.toLocaleString()} plays`;
  
  if (lyricsDisplay) {
    lyricsDisplay.innerHTML = song.lyrics.length > 0 
      ? song.lyrics.map((line) => `<p class="lyric-line">${line}</p>`).join('')
      : '<p class="muted">No lyrics available for this song.</p>';
  }
  
  if (relatedGrid) {
    relatedGrid.innerHTML = '';
    state.songs.filter((item) => item.id !== song.id).slice(0, 6).forEach((item) => {
      const card = document.createElement('article');
      card.className = 'card';
      card.innerHTML = `
        <img src="${item.image}" alt="${item.title}" />
        <div class="card-content">
          <h3>${item.title}</h3>
          <p>${item.artist}</p>
          <div class="card-actions">
            <button class="text-btn play-card">Play</button>
            <button class="text-btn">Open</button>
          </div>
        </div>
      `;
      card.addEventListener('click', (event) => {
        if (event.target.closest('button')) return;
        openSongPage(item.id);
      });
      card.querySelector('.play-card').addEventListener('click', (event) => {
        event.stopPropagation();
        playSongById(item.id);
      });
      card.querySelector('.text-btn:last-child').addEventListener('click', (event) => {
        event.stopPropagation();
        openSongPage(item.id);
      });
      relatedGrid.append(card);
    });
  }
}

function renderAlbumDetailPage() {
  const albumId = new URLSearchParams(window.location.search).get('id');
  const album = getAlbumById(albumId);
  const albumTitle = document.querySelector('#album-title');
  const albumArtist = document.querySelector('#album-artist');
  const albumArt = document.querySelector('#album-art');
  const albumDescription = document.querySelector('#album-description');
  const albumTracks = document.querySelector('#album-tracks');

  if (!album) {
    document.body.innerHTML = '<div class="detail-shell"><div class="detail-content"><h1>Album not found</h1><p>Return to the home page to explore other music.</p><a class="text-btn" href="index.html">Back to home</a></div></div>';
    return;
  }

  document.title = `${album.title} • Pulse Music`;
  if (albumArt) albumArt.src = album.image;
  if (albumTitle) albumTitle.textContent = album.title;
  if (albumArtist) albumArtist.textContent = album.artist;
  if (albumDescription) albumDescription.textContent = `Discover the full album ${album.title} by ${album.artist}, including curated tracks and bonus content.`;
  const tracks = state.songs.filter((song) => song.album === album.title);
  if (albumTracks) {
    albumTracks.innerHTML = tracks.length ? tracks.map((song, index) => `
      <li class="track-item">
        <span>${index + 1}. ${song.title}</span>
        <div class="track-actions">
          <button class="text-btn" data-id="${song.id}">Play</button>
          <button class="text-btn" data-id="${song.id}">Open</button>
        </div>
      </li>
    `).join('') : '<li class="muted">No tracks found for this album yet.</li>';
    albumTracks.querySelectorAll('.text-btn').forEach((button) => {
      const id = button.dataset.id;
      button.addEventListener('click', (event) => {
        event.stopPropagation();
        if (button.textContent.includes('Play')) {
          playSongById(id);
        } else {
          openSongPage(id);
        }
      });
    });
  }
}

function renderPlaylistDetailPage() {
  const playlistId = new URLSearchParams(window.location.search).get('id');
  const playlist = getPlaylistById(playlistId);
  const playlistTitle = document.querySelector('#playlist-title');
  const playlistDescription = document.querySelector('#playlist-description');
  const playlistTracks = document.querySelector('#playlist-tracks');

  if (!playlist) {
    document.body.innerHTML = '<div class="detail-shell"><div class="detail-content"><h1>Playlist not found</h1><p>Try another selection from the sidebar.</p><a class="text-btn" href="index.html">Back to home</a></div></div>';
    return;
  }

  document.title = `${playlist.title} • Pulse Music`;
  if (playlistTitle) playlistTitle.textContent = playlist.title;
  if (playlistDescription) playlistDescription.textContent = `A curated collection for ${playlist.title.toLowerCase()}, updated just for you.`;
  const songs = state.songs.slice(0, 6);
  if (playlistTracks) {
    playlistTracks.innerHTML = songs.map((song, index) => `
      <li class="track-item">
        <span>${index + 1}. ${song.title}</span>
        <div class="track-actions">
          <button class="text-btn" data-id="${song.id}">Play</button>
          <button class="text-btn" data-id="${song.id}">Open</button>
        </div>
      </li>
    `).join('');
    playlistTracks.querySelectorAll('.text-btn').forEach((button) => {
      const id = button.dataset.id;
      button.addEventListener('click', (event) => {
        event.stopPropagation();
        if (button.textContent.includes('Play')) {
          playSongById(id);
        } else {
          openSongPage(id);
        }
      });
    });
  }
}

function renderArtistProfilePage() {
  const artistId = new URLSearchParams(window.location.search).get('artist');
  const artist = getArtistById(artistId);
  
  if (!artist) {
    return;
  }

  const artistNameEl = document.querySelector('#artist-name');
  const artistGenreEl = document.querySelector('#artist-genre');
  const artistStatsEl = document.querySelector('#artist-stats');
  const artistCoverEl = document.querySelector('#artist-cover');
  const artistFollowBtn = document.querySelector('#artist-follow-btn');
  const artistPlayBtn = document.querySelector('#artist-play-btn');
  const artistSongsGrid = document.querySelector('#artist-songs-grid');
  const artistProfileSection = document.querySelector('#artist-profile-section');
  const artistSongsSection = document.querySelector('#artist-songs-section');

  if (artistNameEl) artistNameEl.textContent = artist.name;
  if (artistGenreEl) artistGenreEl.textContent = artist.genre;
  if (artistStatsEl) artistStatsEl.textContent = `${artist.followers?.toLocaleString()} followers`;
  if (artistCoverEl) artistCoverEl.src = artist.image;
  
  const isFollowing = state.followedArtists.includes(artistId);
  if (artistFollowBtn) {
    artistFollowBtn.textContent = isFollowing ? 'Following' : 'Follow';
    artistFollowBtn.classList.toggle('following', isFollowing);
    artistFollowBtn.addEventListener('click', () => {
      toggleFollow(artistId);
    });
  }

  if (artistPlayBtn) {
    const artistSongs = state.songs.filter((song) => demoArtists.find((a) => a.id === artistId)?.songs?.includes(song.id));
    if (artistSongs.length > 0) {
      artistPlayBtn.addEventListener('click', () => playSongById(artistSongs[0].id));
    }
  }

  const artistSongs = state.songs.filter((song) => demoArtists.find((a) => a.id === artistId)?.songs?.includes(song.id));
  if (artistSongsGrid) {
    artistSongsGrid.innerHTML = '';
    if (artistSongs.length > 0) {
      renderCardSection(artistSongsGrid, artistSongs);
    } else {
      artistSongsSection.hidden = true;
    }
  }

  if (artistProfileSection) {
    artistProfileSection.hidden = false;
  }
}

function setActiveView(view) {
  document.querySelectorAll('.menu-item').forEach((button) => {
    button.classList.toggle('active', button.dataset.view === view);
  });

  const hero = document.querySelector('.hero-panel');
  if (hero) hero.hidden = view !== 'home';

  document.querySelectorAll('.section-block').forEach((section) => {
    if (view === 'home') {
      section.hidden = section.id === 'search-results-section' || section.id === 'library-section' || section.id === 'premium-section' || section.id === 'artist-profile-section';
    } else if (view === 'search') {
      section.hidden = section.id !== 'search-results-section';
    } else if (view === 'library') {
      section.hidden = section.id !== 'library-section';
    } else if (view === 'premium') {
      section.hidden = section.id !== 'premium-section';
    } else if (view === 'artist') {
      section.hidden = section.id !== 'artist-profile-section';
    }
  });

  if (view === 'home') {
    if (dom.searchInput) dom.searchInput.value = '';
    if (dom.searchSuggestions) dom.searchSuggestions.classList.remove('active');
    renderSections();
  }

  if (view === 'search' && dom.searchInput) {
    dom.searchInput.focus();
    showSuggestions(dom.searchInput.value);
  }

  if (view === 'library') {
    renderLibrary();
  }
}

async function handleLogin(event) {
  event.preventDefault();
  const email = dom.loginEmail.value.trim();
  const password = dom.loginPassword.value.trim();
  if (!email || !password) return showToast('Please enter email and password.');

  if (!supabase) {
    // Demo mode: simulate login
    if (email === 'demo@pulse.com' && password === 'demo123') {
      localStorage.setItem('demo-session', JSON.stringify({ user: { email, username: 'Demo User' } }));
      showToast('Demo login successful! Redirecting...');
      setTimeout(() => window.location.href = 'index.html', 1000);
    } else {
      showToast('Demo credentials: demo@pulse.com / demo123');
    }
    return;
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    showToast(error.message || 'Login failed');
    return;
  }
  showToast('Welcome back! Redirecting...');
  window.location.href = 'index.html';
}

async function handleSignup(event) {
  event.preventDefault();
  const email = dom.signupEmail.value.trim();
  const password = dom.signupPassword.value.trim();
  const username = dom.signupUsername.value.trim();
  if (!email || !password || !username) {
    return showToast('Complete all fields to continue.');
  }
  if (password.length < 8) {
    return showToast('Password must be at least 8 characters.');
  }

  if (!supabase) {
    // Demo mode: simulate signup
    localStorage.setItem('demo-session', JSON.stringify({ user: { email, username } }));
    showToast('Demo account created! Redirecting...');
    setTimeout(() => window.location.href = 'index.html', 1000);
    return;
  }

  const { data, error } = await supabase.auth.signUp({ email, password }, { data: { username } });
  if (error) {
    showToast(error.message || 'Signup failed');
    return;
  }
  showToast('Account created! Check your email for verification.');
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1200);
}

async function loadSession() {
  if (!supabase) {
    // Demo mode: check localStorage
    const demoSession = localStorage.getItem('demo-session');
    if (demoSession) {
      const session = JSON.parse(demoSession);
      state.session = { user: session.user };
      state.user = session.user;
      const profile = state.user.username || state.user.email?.split('@')[0];
      if (dom.sidebarUsername) dom.sidebarUsername.textContent = profile;
      if (dom.topbarName) dom.topbarName.textContent = profile;
    }
    return;
  }

  const { data } = await supabase.auth.getSession();
  state.session = data.session;
  if (state.session) {
    state.user = state.session.user;
    const profile = state.user.user_metadata?.username || state.user.email?.split('@')[0];
    if (dom.sidebarUsername) dom.sidebarUsername.textContent = profile;
    if (dom.topbarName) dom.topbarName.textContent = profile;
  }
}

async function handleLogout() {
  if (!supabase) {
    localStorage.removeItem('demo-session');
    window.location.href = 'login.html';
    return;
  }
  await supabase.auth.signOut();
  window.location.href = 'login.html';
}


function attachPlayerEvents() {
  if (!dom.audioPlayer) return;
  dom.audioPlayer.addEventListener('timeupdate', updateProgress);
  dom.audioPlayer.addEventListener('ended', () => {
    savePlaybackState();
    if (state.repeatMode) {
      playSongById(state.queue[state.currentIndex].id);
      return;
    }
    nextSong();
  });
  dom.audioPlayer.addEventListener('play', () => {
    savePlaybackState();
  });
  dom.audioPlayer.addEventListener('pause', () => {
    savePlaybackState();
  });
  dom.audioPlayer.addEventListener('timeupdate', () => {
    savePlaybackState();
  });
  dom.audioPlayer.addEventListener('error', () => {
    showToast('Failed to load audio. Please try another song.');
    state.isPlaying = false;
    dom.playPauseBtn.textContent = '▶';
  });

  dom.playPauseBtn?.addEventListener('click', togglePlayPause);
  dom.prevBtn?.addEventListener('click', prevSong);
  dom.nextBtn?.addEventListener('click', nextSong);
  dom.shuffleBtn?.addEventListener('click', () => {
    state.shuffleMode = !state.shuffleMode;
    dom.shuffleBtn.classList.toggle('active', state.shuffleMode);
    showToast(state.shuffleMode ? 'Shuffle enabled' : 'Shuffle disabled');
  });
  dom.repeatBtn?.addEventListener('click', () => {
    state.repeatMode = !state.repeatMode;
    dom.repeatBtn.classList.toggle('active', state.repeatMode);
    showToast(state.repeatMode ? 'Repeat mode on' : 'Repeat mode off');
  });
  dom.volumeSlider?.addEventListener('input', (event) => {
    updateVolume(event.target.value);
  });
  dom.muteBtn?.addEventListener('click', () => {
    const newVolume = dom.audioPlayer.volume > 0.05 ? 0 : 0.75;
    dom.volumeSlider.value = newVolume;
    updateVolume(newVolume);
  });
  dom.progressTrack?.addEventListener('click', seekPlayer);
  dom.heroPlay?.addEventListener('click', () => playSongById(state.queue[0].id));
  dom.playerLike?.addEventListener('click', () => toggleLike(state.queue[state.currentIndex]?.id));

  document.querySelectorAll('.menu-item').forEach((button) => {
    button.addEventListener('click', () => {
      setActiveView(button.dataset.view || 'home');
      if (button.dataset.view === 'search' && !dom.searchInput?.value) {
        displaySearchResults('');
      }
    });
  });

  document.querySelectorAll('.playlist-action').forEach((button) => {
    button.addEventListener('click', () => {
      if (button.textContent.includes('Create')) {
        showDialog({
          title: 'Create Playlist',
          message: 'Enter a name for your new playlist.',
          primaryLabel: 'Create playlist',
          showInput: true,
          defaultValue: `New Playlist ${state.playlists.length + 1}`,
          onPrimary: (value) => {
            if (!value) return showToast('Playlist name is required.');
            const id = `p${Date.now()}`;
            state.playlists.unshift({ id, title: value });
            renderSidebarPlaylists();
            renderLibrary();
            showToast(`Playlist “${value}” created`);
          },
        });
      } else {
        setActiveView('library');
      }
    });
  });

  dom.openLikedSongsBtn?.addEventListener('click', () => {
    setActiveView('library');
  });

  document.querySelector('#view-more-trending')?.addEventListener('click', () => {
    showToast('Showing more trending tracks soon.');
  });
  document.querySelector('#discover-more')?.addEventListener('click', () => {
    showToast('Discover new playlists tailored to you.');
  });
  dom.premiumBtn?.addEventListener('click', openPremiumSection);
  document.querySelector('#upgrade-btn')?.addEventListener('click', () => {
    showToast('Upgrade coming soon — stay tuned!');
  });
  document.querySelector('.notification-btn')?.addEventListener('click', toggleNotificationPanel);
  dom.clearNotificationsBtn?.addEventListener('click', clearNotifications);

  document.querySelectorAll('.detail-tab').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.detail-tab').forEach((tab) => tab.classList.remove('active'));
      button.classList.add('active');
      document.querySelectorAll('#detail-overview, #detail-lyrics, #detail-related').forEach((section) => {
        if (section) section.hidden = section.id !== `detail-${button.dataset.tab}`;
      });
    });
  });

  document.querySelector('#detail-play')?.addEventListener('click', () => {
    const id = new URLSearchParams(window.location.search).get('id');
    if (id) playSongById(id);
  });
  document.querySelector('#detail-like')?.addEventListener('click', () => {
    const id = new URLSearchParams(window.location.search).get('id');
    if (id) {
      toggleLike(id);
      const btn = document.querySelector('#detail-like');
      if (btn) {
        const song = getSongById(id);
        btn.textContent = state.likedSongs.includes(id) ? '♥ Added to favorites' : '♥ Add to favorites';
      }
    }
  });
  document.querySelector('#detail-add')?.addEventListener('click', () => {
    showToast('Add to playlist action coming soon.');
  });
  document.querySelector('#album-play-all')?.addEventListener('click', () => {
    const albumId = new URLSearchParams(window.location.search).get('id');
    const album = getAlbumById(albumId);
    const tracks = state.songs.filter((song) => song.album === album?.title);
    if (tracks.length) playSongById(tracks[0].id);
  });
  document.querySelector('#detail-profile-btn')?.addEventListener('click', () => {
    showDialog({
      title: 'Profile',
      message: 'You are logged in as Demo User',
      primaryLabel: 'Sign out',
      secondaryLabel: 'Cancel',
      onPrimary: handleLogout,
    });
  });

  if (dom.closeLyrics) {
    dom.closeLyrics.addEventListener('click', () => {
      if (dom.lyricsModal) dom.lyricsModal.hidden = true;
    });
  }
  if (dom.lyricsModal) {
    dom.lyricsModal.addEventListener('click', (event) => {
      if (event.target === dom.lyricsModal) dom.lyricsModal.hidden = true;
    });
  }

  if (dom.searchInput) {
    dom.searchInput.addEventListener('input', (event) => {
      showSuggestions(event.target.value);
      displaySearchResults(event.target.value);
    });
    dom.searchInput.addEventListener('blur', () => {
      setTimeout(() => dom.searchSuggestions.classList.remove('active'), 150);
    });
  }

  window.addEventListener('beforeunload', () => {
    savePlaybackState();
  });

  document.addEventListener('keydown', (event) => {
    if (event.target.tagName === 'INPUT') return;
    if (event.code === 'Space') {
      event.preventDefault();
      togglePlayPause();
    }
    if (event.code === 'ArrowRight') nextSong();
    if (event.code === 'ArrowLeft') prevSong();
    if (event.code === 'ArrowUp') {
      const nextVolume = Math.min(dom.audioPlayer.volume + 0.1, 1);
      dom.volumeSlider.value = nextVolume;
      updateVolume(nextVolume);
    }
    if (event.code === 'ArrowDown') {
      const nextVolume = Math.max(dom.audioPlayer.volume - 0.1, 0);
      dom.volumeSlider.value = nextVolume;
      updateVolume(nextVolume);
    }
  });
}

function initializeState() {
  const stored = getStoredState();
  if (stored) {
    state.playlists = stored.playlists || demoPlaylists;
    state.likedSongs = stored.likedSongs || [];
    state.followedArtists = stored.followedArtists || [];
    state.queue = stored.queue.length ? stored.queue.map((songRef) => demoSongs.find((song) => song.id === songRef.id) || songRef) : [...demoSongs];
    state.currentIndex = stored.currentIndex || 0;
    state.isPlaying = stored.isPlaying || false;
    state.recentlyPlayed = stored.recentlyPlayed || [];
  } else {
    state.playlists = demoPlaylists;
    state.likedSongs = [];
    state.followedArtists = [];
  }
  if (dom.lyricsModal) dom.lyricsModal.hidden = true;
  updatePlayerDetails(state.queue[state.currentIndex]);
  if (dom.searchInput) dom.searchInput.value = '';
  restorePlaybackState();
}

function mountProfileActions() {
  const profileBtn = document.querySelector('#profile-dropdown-btn');
  if (!profileBtn) return;
  profileBtn.addEventListener('click', () => {
    showDialog({
      title: 'Sign out',
      message: 'Do you want to sign out and return to the login screen?',
      primaryLabel: 'Sign out',
      secondaryLabel: 'Cancel',
      onPrimary: handleLogout,
    });
  });
  
  // Set profile pictures to be consistent
  const avatarElements = document.querySelectorAll('.avatar');
  const userInitial = state.user?.user_metadata?.username?.charAt(0).toUpperCase() || 
                     state.user?.email?.charAt(0).toUpperCase() || 'U';
  avatarElements.forEach((avatar) => {
    avatar.textContent = userInitial;
  });
}

function setupScrollEffects() {
  const topbar = document.querySelector('#topbar');
  if (!topbar) return;
  window.addEventListener('scroll', () => {
    topbar.classList.toggle('scrolled', window.scrollY > 40);
  });
}

async function bootstrap() {
  await loadSession();
  if (dom.loginForm) {
    dom.loginForm.addEventListener('submit', handleLogin);
  }
  if (dom.signupForm) {
    dom.signupForm.addEventListener('submit', handleSignup);
  }

  // Add password toggle functionality
  const passwordToggle = document.querySelector('#password-toggle');
  const loginPasswordInput = document.querySelector('#login-password');
  if (passwordToggle && loginPasswordInput) {
    passwordToggle.addEventListener('click', (e) => {
      e.preventDefault();
      const isPassword = loginPasswordInput.type === 'password';
      loginPasswordInput.type = isPassword ? 'text' : 'password';
      passwordToggle.textContent = isPassword ? '🙈' : '👁️';
    });
  }

  const signupPasswordToggle = document.querySelector('#signup-password-toggle');
  const signupPasswordInput = document.querySelector('#signup-password');
  if (signupPasswordToggle && signupPasswordInput) {
    signupPasswordToggle.addEventListener('click', (e) => {
      e.preventDefault();
      const isPassword = signupPasswordInput.type === 'password';
      signupPasswordInput.type = isPassword ? 'text' : 'password';
      signupPasswordToggle.textContent = isPassword ? '🙈' : '👁️';
    });
  }

  const path = window.location.pathname;
  if (path.endsWith('index.html') || path.endsWith('/')) {
    if (!state.session) {
      window.location.href = 'login.html';
      return;
    }
    initializeState();
    
    const artistId = new URLSearchParams(window.location.search).get('artist');
    if (artistId) {
      // Render artist profile
      renderSidebarPlaylists();
      renderArtistProfilePage();
      attachPlayerEvents();
      mountProfileActions();
      setupScrollEffects();
    } else {
      // Render home page
      renderSections();
      renderSidebarPlaylists();
      renderRecentlyPlayed();
      attachPlayerEvents();
      mountProfileActions();
      setupScrollEffects();
      if (dom.premiumSection) dom.premiumSection.hidden = true;
    }
  } else if (path.endsWith('song.html')) {
    if (!state.session) {
      window.location.href = 'login.html';
      return;
    }
    initializeState();
    renderSidebarPlaylists();
    attachPlayerEvents();
    mountProfileActions();
    setupScrollEffects();
    renderSongDetailPage();
  } else if (path.endsWith('album.html')) {
    if (!state.session) {
      window.location.href = 'login.html';
      return;
    }
    initializeState();
    renderSidebarPlaylists();
    attachPlayerEvents();
    mountProfileActions();
    setupScrollEffects();
    renderAlbumDetailPage();
  } else if (path.endsWith('playlist.html')) {
    if (!state.session) {
      window.location.href = 'login.html';
      return;
    }
    initializeState();
    renderSidebarPlaylists();
    attachPlayerEvents();
    mountProfileActions();
    setupScrollEffects();
    renderPlaylistDetailPage();
  }
}

bootstrap();
