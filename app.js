import { supabase } from './supabase.js';

const demoSongs = [
  {
    id: 's1',
    title: 'Night Pulse',
    artist: 'Luna Matrix',
    album: 'Neon Drift',
    image: '../assets/images/Gabhru.jpg',
    audio_url: 'assets/songs/gabhru.mp3',
    duration: '3:28',
    plays: 128000,
    color: '#0f7a4f',
    lyrics: ['Fluid nights and laser lights, your heartbeat finds a rhythm.', 'When the pulse rises, the city comes alive.'],
  },
  {
    id: 's2',
    title: 'Solar Drift',
    artist: 'Nyx Odyssey',
    album: 'Astral Waves',
    image: '../assets/images/barood.jpg',
    audio_url: 'assets/songs/barood.mp3',
    duration: '4:12',
    plays: 94000,
    color: '#4e8cdb',
    lyrics: ['Skies ignite as we collide, chasing dawn beyond the edge.', 'The beat becomes the air we breathe.'],
  },
  {
    id: 's3',
    title: 'Velvet Sky',
    artist: 'Echo Harbor',
    album: 'Afterglow',
    image: '../assets/images/Don.jpg',
    audio_url: 'assets/songs/Don.mp3',
    duration: '3:58',
    plays: 113500,
    color: '#a24878',
    lyrics: ['Soft chords paint the sky in velvet purple.', 'Hold tight while the rhythm wraps around you.'],
  },
  {
    id: 's4',
    title: 'Echo Drift',
    artist: 'Nova Echo',
    album: 'Midnight Motion',
    image: '../assets/images/Young.jpg',
    audio_url: 'assets/songs/Vancouver.mp3',
    duration: '4:04',
    plays: 76000,
    color: '#dd6c5f',
    lyrics: ['Your echo in the dark becomes the guiding light.', 'We move as one beneath the mirrored moon.'],
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
  currentIndex: 0,
  isPlaying: false,
  queue: [...demoSongs],
  repeatMode: false,
  shuffleMode: false,
};

const dom = {
  searchInput: document.querySelector('#global-search'),
  searchResultsSection: document.querySelector('#search-results-section'),
  searchResults: document.querySelector('#search-results'),
  searchSuggestions: document.querySelector('#search-suggestions'),
  trendingCards: document.querySelector('#trending-cards'),
  madeCards: document.querySelector('#made-cards'),
  albumCards: document.querySelector('#album-cards'),
  sidebarPlaylists: document.querySelector('#sidebar-playlists'),
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
    queue: state.queue,
    currentIndex: state.currentIndex,
  };
  localStorage.setItem('pulse-state', JSON.stringify(snapshot));
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
      showToast(`Loaded “${playlist.title}” playlist`);
    });
    dom.sidebarPlaylists.append(item);
  });
}

function renderCardSection(container, items) {
  if (!container) return;
  container.innerHTML = '';
  items.forEach((item) => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <img src="${item.image}" alt="${item.title}" />
      <div class="card-content">
        <div>
          <h3>${item.title}</h3>
          <p>${item.artist || item.album || 'Playlist'}</p>
        </div>
        <div class="card-actions">
          <button class="text-btn play-card" data-id="${item.id}">Play</button>
          <button class="text-btn favorite-card" data-id="${item.id}">♥</button>
        </div>
      </div>
    `;

    const playButton = card.querySelector('.play-card');
    const faveButton = card.querySelector('.favorite-card');

    if (item.audio_url) {
      playButton.addEventListener('click', () => playSongById(item.id));
      faveButton.addEventListener('click', () => toggleLike(item.id));
    } else {
      playButton.addEventListener('click', () => showToast(`Opening album “${item.title}”`));
      faveButton.addEventListener('click', () => showToast(`Saved “${item.title}” to your library`));
    }

    container.append(card);
  });
}

function renderSections() {
  renderCardSection(dom.trendingCards, state.songs);
  renderCardSection(dom.madeCards, state.songs.slice().reverse());
  renderCardSection(dom.albumCards, demoAlbums);
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
  } else {
    state.likedSongs.push(id);
    showToast('Added to liked songs');
  }
  if (state.queue[state.currentIndex]?.id === id) {
    dom.playerLike.textContent = exists ? '♡' : '♥';
  }
  saveStoredState();
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

function displaySearchResults(query) {
  if (!dom.searchResultsSection) return;
  if (!query.trim()) {
    dom.searchResultsSection.hidden = true;
    dom.searchSuggestions.classList.remove('active');
    return;
  }

  const lowerQuery = query.toLowerCase();
  const matches = state.songs.filter((song) => {
    return song.title.toLowerCase().includes(lowerQuery)
      || song.artist.toLowerCase().includes(lowerQuery)
      || song.album.toLowerCase().includes(lowerQuery);
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
    tile.querySelector('.play-card').addEventListener('click', () => playSongById(song.id));
    tile.querySelector('.favorite-card').addEventListener('click', () => toggleLike(song.id));
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
  const suggestions = ['Top hits', 'Chill vibes', 'Dance floor', 'Indie pop'].filter((term) => term.toLowerCase().includes(query.toLowerCase()));
  dom.searchSuggestions.classList.add('active');
  dom.searchSuggestions.innerHTML = suggestions.map((term) => `<button class="text-btn suggestion-item">${term}</button>`).join('');
  dom.searchSuggestions.querySelectorAll('.suggestion-item').forEach((btn) => {
    btn.addEventListener('click', () => {
      dom.searchInput.value = btn.textContent;
      displaySearchResults(btn.textContent);
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
    item.querySelector('.play-card').addEventListener('click', () => playSongById(song.id));
    item.querySelector('.favorite-card').addEventListener('click', () => toggleLike(song.id));
    dom.libraryGrid.append(item);
  });
}

function setActiveView(view) {
  document.querySelectorAll('.menu-item').forEach((button) => {
    button.classList.toggle('active', button.dataset.view === view);
  });

  const hero = document.querySelector('.hero-panel');
  if (hero) hero.hidden = view !== 'home';

  if (dom.searchResultsSection) dom.searchResultsSection.hidden = view !== 'search';
  if (dom.librarySection) dom.librarySection.hidden = view !== 'library';

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
    if (state.repeatMode) {
      playSongById(state.queue[state.currentIndex].id);
      return;
    }
    nextSong();
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
  document.querySelector('.top-actions .ghost-btn')?.addEventListener('click', () => {
    showToast('Upgrade coming soon — stay tuned!');
  });
  document.querySelector('.notification-btn')?.addEventListener('click', () => {
    showToast('No new notifications yet.');
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
  }

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
    state.queue = stored.queue.length ? stored.queue.map((songRef) => demoSongs.find((song) => song.id === songRef.id) || songRef) : [...demoSongs];
    state.currentIndex = stored.currentIndex || 0;
  } else {
    state.playlists = demoPlaylists;
    state.likedSongs = [];
  }
  if (dom.lyricsModal) dom.lyricsModal.hidden = true;
  updatePlayerDetails(state.queue[state.currentIndex]);
  if (dom.searchInput) dom.searchInput.value = '';
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
  if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
    if (!state.session) {
      window.location.href = 'login.html';
      return;
    }
    initializeState();
    renderSections();
    renderSidebarPlaylists();
    attachPlayerEvents();
    mountProfileActions();
    setupScrollEffects();
  }
}

bootstrap();
