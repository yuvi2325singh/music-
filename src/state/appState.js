/**
 * State Management Module
 * Centralized state for the entire application
 */

import { storage } from '../utils/helpers.js';

export class AppState {
  constructor(initialState = {}) {
    this.state = {
      // Auth
      session: null,
      user: null,
      isAuthenticated: false,

      // Music Library
      songs: initialState.songs || [],
      albums: initialState.albums || [],
      artists: initialState.artists || [],

      // User Library
      playlists: [],
      likedSongs: [],
      followedArtists: [],
      recentlyPlayed: [],

      // Playback
      currentIndex: 0,
      isPlaying: false,
      queue: [],
      currentTime: 0,
      duration: 0,

      // Playback Settings
      volume: 0.75,
      repeatMode: 0, // 0: off, 1: all, 2: one
      shuffleMode: false,
      isMuted: false,

      // Audio
      audioLoading: false,
      audioError: null,

      // UI
      activeView: 'home',
      notifications: [],
      toasts: [],
      isModalOpen: false,
      searchQuery: '',
      searchResults: [],

      // App Settings
      isDarkMode: true,
      language: 'en',
      premiumEnabled: false,

      ...initialState,
    };

    this.listeners = [];
  }

  /**
   * Get entire state
   */
  getState() {
    return this.state;
  }

  /**
   * Get specific state value
   */
  get(path) {
    const keys = path.split('.');
    let value = this.state;
    for (const key of keys) {
      value = value?.[key];
    }
    return value;
  }

  /**
   * Set state values
   */
  set(path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    let obj = this.state;

    for (const key of keys) {
      if (!(key in obj)) {
        obj[key] = {};
      }
      obj = obj[key];
    }

    obj[lastKey] = value;
    this.notify(path, value);
  }

  /**
   * Update state (shallow merge)
   */
  update(updates) {
    Object.assign(this.state, updates);
    this.notify('state', this.state);
  }

  /**
   * Subscribe to state changes
   */
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  /**
   * Notify listeners of state changes
   */
  notify(path, value) {
    this.listeners.forEach((listener) => {
      listener(path, value);
    });
  }

  /**
   * Save state to localStorage
   */
  save(key = 'app-state') {
    const stateToPersist = {
      playlists: this.state.playlists,
      likedSongs: this.state.likedSongs,
      followedArtists: this.state.followedArtists,
      recentlyPlayed: this.state.recentlyPlayed,
      currentIndex: this.state.currentIndex,
      currentTime: this.state.currentTime,
      volume: this.state.volume,
      repeatMode: this.state.repeatMode,
      shuffleMode: this.state.shuffleMode,
    };
    storage.set(key, stateToPersist);
  }

  /**
   * Load state from localStorage
   */
  load(key = 'app-state') {
    const persisted = storage.get(key, {});
    if (Object.keys(persisted).length > 0) {
      this.update(persisted);
      return true;
    }
    return false;
  }

  /**
   * Reset state to defaults
   */
  reset() {
    this.state = {
      session: null,
      user: null,
      isAuthenticated: false,
      songs: this.state.songs, // Keep songs
      albums: this.state.albums,
      artists: this.state.artists,
      playlists: [],
      likedSongs: [],
      followedArtists: [],
      recentlyPlayed: [],
      currentIndex: 0,
      isPlaying: false,
      queue: [],
      currentTime: 0,
      duration: 0,
      volume: 0.75,
      repeatMode: 0,
      shuffleMode: false,
      isMuted: false,
      audioLoading: false,
      audioError: null,
      activeView: 'home',
      notifications: [],
      toasts: [],
      isModalOpen: false,
      searchQuery: '',
      searchResults: [],
      isDarkMode: true,
      language: 'en',
      premiumEnabled: false,
    };
    this.notify('state', this.state);
  }

  /**
   * Add notification
   */
  addNotification(message, type = 'info', duration = 5000) {
    const notification = {
      id: Date.now(),
      message,
      type, // 'info', 'success', 'error', 'warning'
      time: new Date().toLocaleTimeString(),
    };

    const current = this.state.notifications || [];
    const updated = [notification, ...current].slice(0, 5);
    this.set('notifications', updated);

    if (duration > 0) {
      setTimeout(() => {
        this.set(
          'notifications',
          this.state.notifications.filter((n) => n.id !== notification.id)
        );
      }, duration);
    }

    return notification.id;
  }

  /**
   * Remove notification
   */
  removeNotification(id) {
    this.set(
      'notifications',
      this.state.notifications.filter((n) => n.id !== id)
    );
  }

  /**
   * Add toast message
   */
  addToast(message, type = 'info', duration = 3000) {
    const toast = {
      id: Date.now(),
      message,
      type,
    };

    const current = this.state.toasts || [];
    this.set('toasts', [...current, toast]);

    if (duration > 0) {
      setTimeout(() => {
        this.set(
          'toasts',
          this.state.toasts.filter((t) => t.id !== toast.id)
        );
      }, duration);
    }

    return toast.id;
  }

  /**
   * Get current song
   */
  getCurrentSong() {
    return this.state.queue[this.state.currentIndex];
  }

  /**
   * Check if song is liked
   */
  isLiked(songId) {
    return this.state.likedSongs.includes(songId);
  }

  /**
   * Check if artist is followed
   */
  isFollowing(artistId) {
    return this.state.followedArtists.includes(artistId);
  }

  /**
   * Get all playlists
   */
  getPlaylists() {
    return this.state.playlists;
  }

  /**
   * Get playlist by ID
   */
  getPlaylistById(id) {
    return this.state.playlists.find((p) => p.id === id);
  }
}

export default AppState;
