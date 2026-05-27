/**
 * Audio Manager Module
 * Handles audio loading, playback, error handling, and retry logic
 */

export class AudioManager {
  constructor(audioElement, options = {}) {
    this.audio = audioElement;
    this.preloadTimer = null;
    this.failedSongs = new Set();
    this.maxRetries = options.maxRetries || 3;
    this.retryDelay = options.retryDelay || 1000;
    this.preloadDelay = options.preloadDelay || 1000;
    this.audioLoading = false;
    this.currentRetries = 0;
    this.callbacks = {
      onLoadStart: options.onLoadStart || (() => {}),
      onLoadEnd: options.onLoadEnd || (() => {}),
      onError: options.onError || (() => {}),
      onRetry: options.onRetry || (() => {}),
      onAutoSkip: options.onAutoSkip || (() => {}),
    };
  }

  /**
   * Load and play audio with error handling
   */
  async loadAndPlay(song) {
    if (!song) return false;

    this.audioLoading = true;
    this.callbacks.onLoadStart();

    try {
      const audioUrl = encodeURI(song.audio_url);
      this.audio.src = audioUrl;

      // Small delay to ensure src is set
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Try to play
      const playPromise = this.audio.play();
      if (playPromise instanceof Promise) {
        await playPromise;
      }

      this.audioLoading = false;
      this.callbacks.onLoadEnd();
      this.currentRetries = 0;
      this.failedSongs.delete(song.id);

      return true;
    } catch (error) {
      console.error('Audio playback error:', error);
      return this.handlePlaybackError(song, error);
    }
  }

  /**
   * Handle playback errors with retry logic
   */
  async handlePlaybackError(song, error) {
    this.audioLoading = false;
    this.callbacks.onLoadEnd();

    const errorMessage = this.getErrorMessage(error);
    console.warn(`Playback failed for ${song.title}:`, errorMessage);

    // Check if we should retry
    if (this.currentRetries < this.maxRetries) {
      this.currentRetries++;
      this.callbacks.onRetry(this.currentRetries, this.maxRetries);

      // Wait before retry
      await new Promise((resolve) => setTimeout(resolve, this.retryDelay));
      return this.loadAndPlay(song);
    }

    // Max retries exceeded
    this.failedSongs.add(song.id);
    this.currentRetries = 0;

    this.callbacks.onAutoSkip(song.title);

    return false;
  }

  /**
   * Get user-friendly error message
   */
  getErrorMessage(error) {
    if (!error) return 'Unknown error';
    if (error.name === 'NotAllowedError') return 'Autoplay denied by browser';
    if (error.name === 'NotSupportedError') return 'Audio format not supported';
    if (error.name === 'AbortError') return 'Playback aborted';
    return error.message || 'Playback failed';
  }

  /**
   * Preload next song for smoother transitions
   */
  preloadNext(getNextSong) {
    if (this.preloadTimer) clearTimeout(this.preloadTimer);

    this.preloadTimer = setTimeout(() => {
      const nextSong = getNextSong();

      if (nextSong && !this.failedSongs.has(nextSong.id)) {
        const audio = new Audio();
        audio.src = encodeURI(nextSong.audio_url);
        // Just preload, don't play
      }
    }, this.preloadDelay);
  }

  /**
   * Validate if audio file exists and is accessible
   */
  async validateAudio(url) {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Check if a song has failed too many times
   */
  hasFailed(songId) {
    return this.failedSongs.has(songId);
  }

  /**
   * Clear failed songs cache
   */
  clearFailedSongs() {
    this.failedSongs.clear();
  }

  /**
   * Get current audio error
   */
  getAudioError() {
    if (!this.audio.error) return null;

    const errorCode = this.audio.error.code;
    const errorMessages = {
      1: 'Audio loading was aborted',
      2: 'Network error while loading audio',
      3: 'Audio loading was aborted',
      4: 'Unsupported audio format',
    };

    return errorMessages[errorCode] || 'Unknown audio error';
  }
}

export default AudioManager;
