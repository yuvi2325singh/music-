/**
 * Playlist Manager Module
 * Handles playlist operations, creation, editing, and song management
 */

import { generateId } from '../utils/helpers.js';

export class PlaylistManager {
  constructor(supabaseService = null) {
    this.supabase = supabaseService;
    this.playlists = [];
  }

  /**
   * Create new playlist
   */
  createPlaylist(userId, title, description = '', isPublic = false) {
    const playlist = {
      id: generateId('pl'),
      user_id: userId,
      title,
      description,
      is_public: isPublic,
      songs: [],
      created_at: new Date(),
      updated_at: new Date(),
    };

    this.playlists.push(playlist);
    return playlist;
  }

  /**
   * Get all playlists for a user
   */
  getUserPlaylists(userId) {
    return this.playlists.filter((p) => p.user_id === userId);
  }

  /**
   * Get playlist by ID
   */
  getPlaylistById(id) {
    return this.playlists.find((p) => p.id === id);
  }

  /**
   * Update playlist metadata
   */
  updatePlaylist(playlistId, updates) {
    const playlist = this.getPlaylistById(playlistId);
    if (!playlist) return null;

    Object.assign(playlist, updates, {
      updated_at: new Date(),
    });

    return playlist;
  }

  /**
   * Delete playlist
   */
  deletePlaylist(playlistId) {
    const index = this.playlists.findIndex((p) => p.id === playlistId);
    if (index === -1) return false;

    this.playlists.splice(index, 1);
    return true;
  }

  /**
   * Add song to playlist
   */
  addSongToPlaylist(playlistId, song) {
    const playlist = this.getPlaylistById(playlistId);
    if (!playlist) return false;

    // Check if song already in playlist
    if (playlist.songs.some((s) => s.id === song.id)) {
      return false;
    }

    playlist.songs.push({
      ...song,
      addedAt: new Date(),
      position: playlist.songs.length,
    });

    playlist.updated_at = new Date();
    return true;
  }

  /**
   * Remove song from playlist
   */
  removeSongFromPlaylist(playlistId, songId) {
    const playlist = this.getPlaylistById(playlistId);
    if (!playlist) return false;

    const initialLength = playlist.songs.length;
    playlist.songs = playlist.songs.filter((s) => s.id !== songId);

    if (playlist.songs.length < initialLength) {
      // Re-index positions
      playlist.songs.forEach((song, index) => {
        song.position = index;
      });
      playlist.updated_at = new Date();
      return true;
    }

    return false;
  }

  /**
   * Reorder playlist songs (drag and drop)
   */
  reorderSongs(playlistId, oldIndex, newIndex) {
    const playlist = this.getPlaylistById(playlistId);
    if (!playlist) return false;

    if (oldIndex < 0 || oldIndex >= playlist.songs.length) return false;
    if (newIndex < 0 || newIndex >= playlist.songs.length) return false;

    const [song] = playlist.songs.splice(oldIndex, 1);
    playlist.songs.splice(newIndex, 0, song);

    // Re-index positions
    playlist.songs.forEach((s, index) => {
      s.position = index;
    });

    playlist.updated_at = new Date();
    return true;
  }

  /**
   * Get playlist songs
   */
  getPlaylistSongs(playlistId) {
    const playlist = this.getPlaylistById(playlistId);
    return playlist ? playlist.songs : [];
  }

  /**
   * Clear playlist
   */
  clearPlaylist(playlistId) {
    const playlist = this.getPlaylistById(playlistId);
    if (!playlist) return false;

    playlist.songs = [];
    playlist.updated_at = new Date();
    return true;
  }

  /**
   * Duplicate playlist
   */
  duplicatePlaylist(playlistId, userId, newTitle = '') {
    const original = this.getPlaylistById(playlistId);
    if (!original) return null;

    const title = newTitle || `${original.title} (Copy)`;
    const duplicate = this.createPlaylist(
      userId,
      title,
      original.description,
      original.is_public
    );

    // Copy songs
    duplicate.songs = JSON.parse(JSON.stringify(original.songs));

    return duplicate;
  }

  /**
   * Search playlists
   */
  searchPlaylists(query, userId = null) {
    const q = query.toLowerCase();
    let results = this.playlists;

    if (userId) {
      results = results.filter((p) => p.user_id === userId);
    }

    return results.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  /**
   * Get public playlists
   */
  getPublicPlaylists(limit = 20) {
    return this.playlists
      .filter((p) => p.is_public)
      .slice(0, limit);
  }

  /**
   * Make playlist collaborative
   */
  makeCollaborative(playlistId, collaboratorIds = []) {
    const playlist = this.getPlaylistById(playlistId);
    if (!playlist) return false;

    playlist.is_collaborative = true;
    playlist.collaborators = collaboratorIds;
    playlist.updated_at = new Date();
    return true;
  }

  /**
   * Add collaborator to playlist
   */
  addCollaborator(playlistId, userId) {
    const playlist = this.getPlaylistById(playlistId);
    if (!playlist) return false;

    if (!playlist.collaborators) {
      playlist.collaborators = [];
    }

    if (!playlist.collaborators.includes(userId)) {
      playlist.collaborators.push(userId);
      playlist.updated_at = new Date();
      return true;
    }

    return false;
  }

  /**
   * Remove collaborator from playlist
   */
  removeCollaborator(playlistId, userId) {
    const playlist = this.getPlaylistById(playlistId);
    if (!playlist) return false;

    if (playlist.collaborators) {
      const index = playlist.collaborators.indexOf(userId);
      if (index !== -1) {
        playlist.collaborators.splice(index, 1);
        playlist.updated_at = new Date();
        return true;
      }
    }

    return false;
  }

  /**
   * Export playlist as JSON
   */
  exportPlaylist(playlistId) {
    const playlist = this.getPlaylistById(playlistId);
    if (!playlist) return null;

    return {
      title: playlist.title,
      description: playlist.description,
      songs: playlist.songs.map((s) => ({
        title: s.title,
        artist: s.artist,
        album: s.album,
      })),
      exportedAt: new Date().toISOString(),
    };
  }

  /**
   * Import songs from external source
   */
  importSongs(playlistId, songs) {
    const playlist = this.getPlaylistById(playlistId);
    if (!playlist) return false;

    songs.forEach((song) => {
      if (!playlist.songs.some((s) => s.id === song.id)) {
        playlist.songs.push({
          ...song,
          position: playlist.songs.length,
        });
      }
    });

    playlist.updated_at = new Date();
    return true;
  }
}

export default PlaylistManager;
