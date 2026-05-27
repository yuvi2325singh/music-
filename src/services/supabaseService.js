/**
 * Supabase Service Module
 * Handles all database operations and authentication
 */

import { supabase } from '../../supabase.js';

export class SupabaseService {
  /**
   * Initialize database schema tables
   */
  static async initializeSchema() {
    if (!supabase) {
      console.warn('Supabase not configured. Using demo mode.');
      return false;
    }

    try {
      // Tables will be created manually or via migration
      console.log('Database schema ready');
      return true;
    } catch (error) {
      console.error('Schema initialization failed:', error);
      return false;
    }
  }

  // ===== AUTHENTICATION =====

  /**
   * Sign up new user
   */
  static async signUp(email, password, username) {
    if (!supabase) {
      return { error: 'Supabase not configured' };
    }

    try {
      const { data, error } = await supabase.auth.signUp(
        { email, password },
        { data: { username } }
      );

      if (error) return { error };

      // Create user profile
      if (data.user) {
        await this.createUserProfile(data.user.id, email, username);
      }

      return { data };
    } catch (error) {
      return { error };
    }
  }

  /**
   * Sign in existing user
   */
  static async signIn(email, password) {
    if (!supabase) {
      return { error: 'Supabase not configured' };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { data, error };
  }

  /**
   * Sign out current user
   */
  static async signOut() {
    if (!supabase) {
      return { error: 'Supabase not configured' };
    }

    const { error } = await supabase.auth.signOut();
    return { error };
  }

  /**
   * Get current session
   */
  static async getSession() {
    if (!supabase) {
      return { data: { session: null } };
    }

    const { data } = await supabase.auth.getSession();
    return { data };
  }

  /**
   * Update user profile
   */
  static async updateProfile(userId, updates) {
    if (!supabase) return { error: 'Supabase not configured' };

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId);

    return { data, error };
  }

  /**
   * Create user profile
   */
  static async createUserProfile(userId, email, username) {
    if (!supabase) return { error: 'Supabase not configured' };

    const { data, error } = await supabase.from('users').insert({
      id: userId,
      email,
      username,
      created_at: new Date(),
      updated_at: new Date(),
    });

    return { data, error };
  }

  // ===== SONGS =====

  /**
   * Get all songs
   */
  static async getSongs() {
    if (!supabase) return { data: [], error: 'Supabase not configured' };

    const { data, error } = await supabase.from('songs').select('*');
    return { data, error };
  }

  /**
   * Get song by ID
   */
  static async getSongById(id) {
    if (!supabase) return { data: null, error: 'Supabase not configured' };

    const { data, error } = await supabase
      .from('songs')
      .select('*')
      .eq('id', id)
      .single();

    return { data, error };
  }

  // ===== PLAYLISTS =====

  /**
   * Get user playlists
   */
  static async getUserPlaylists(userId) {
    if (!supabase) return { data: [], error: 'Supabase not configured' };

    const { data, error } = await supabase
      .from('playlists')
      .select('*')
      .eq('user_id', userId);

    return { data, error };
  }

  /**
   * Create playlist
   */
  static async createPlaylist(userId, title, description = '') {
    if (!supabase) return { error: 'Supabase not configured' };

    const { data, error } = await supabase.from('playlists').insert({
      user_id: userId,
      title,
      description,
      is_public: false,
      created_at: new Date(),
      updated_at: new Date(),
    });

    return { data, error };
  }

  /**
   * Update playlist
   */
  static async updatePlaylist(playlistId, updates) {
    if (!supabase) return { error: 'Supabase not configured' };

    const { data, error } = await supabase
      .from('playlists')
      .update(updates)
      .eq('id', playlistId);

    return { data, error };
  }

  /**
   * Delete playlist
   */
  static async deletePlaylist(playlistId) {
    if (!supabase) return { error: 'Supabase not configured' };

    const { error } = await supabase
      .from('playlists')
      .delete()
      .eq('id', playlistId);

    return { error };
  }

  /**
   * Add song to playlist
   */
  static async addSongToPlaylist(playlistId, songId) {
    if (!supabase) return { error: 'Supabase not configured' };

    const { data, error } = await supabase.from('playlist_songs').insert({
      playlist_id: playlistId,
      song_id: songId,
    });

    return { data, error };
  }

  /**
   * Remove song from playlist
   */
  static async removeSongFromPlaylist(playlistId, songId) {
    if (!supabase) return { error: 'Supabase not configured' };

    const { error } = await supabase
      .from('playlist_songs')
      .delete()
      .eq('playlist_id', playlistId)
      .eq('song_id', songId);

    return { error };
  }

  // ===== LIKED SONGS =====

  /**
   * Get user liked songs
   */
  static async getLikedSongs(userId) {
    if (!supabase) return { data: [], error: 'Supabase not configured' };

    const { data, error } = await supabase
      .from('liked_songs')
      .select('song_id')
      .eq('user_id', userId);

    return { data, error };
  }

  /**
   * Like song
   */
  static async likeSong(userId, songId) {
    if (!supabase) return { error: 'Supabase not configured' };

    const { data, error } = await supabase.from('liked_songs').insert({
      user_id: userId,
      song_id: songId,
      liked_at: new Date(),
    });

    return { data, error };
  }

  /**
   * Unlike song
   */
  static async unlikeSong(userId, songId) {
    if (!supabase) return { error: 'Supabase not configured' };

    const { error } = await supabase
      .from('liked_songs')
      .delete()
      .eq('user_id', userId)
      .eq('song_id', songId);

    return { error };
  }

  // ===== FOLLOWED ARTISTS =====

  /**
   * Get followed artists
   */
  static async getFollowedArtists(userId) {
    if (!supabase) return { data: [], error: 'Supabase not configured' };

    const { data, error } = await supabase
      .from('followed_artists')
      .select('artist_id')
      .eq('user_id', userId);

    return { data, error };
  }

  /**
   * Follow artist
   */
  static async followArtist(userId, artistId) {
    if (!supabase) return { error: 'Supabase not configured' };

    const { data, error } = await supabase.from('followed_artists').insert({
      user_id: userId,
      artist_id: artistId,
      followed_at: new Date(),
    });

    return { data, error };
  }

  /**
   * Unfollow artist
   */
  static async unfollowArtist(userId, artistId) {
    if (!supabase) return { error: 'Supabase not configured' };

    const { error } = await supabase
      .from('followed_artists')
      .delete()
      .eq('user_id', userId)
      .eq('artist_id', artistId);

    return { error };
  }

  // ===== LISTENING HISTORY =====

  /**
   * Add to listening history
   */
  static async recordPlay(userId, songId, duration) {
    if (!supabase) return { error: 'Supabase not configured' };

    const { data, error } = await supabase.from('listening_history').insert({
      user_id: userId,
      song_id: songId,
      played_at: new Date(),
      duration_listened: duration,
    });

    return { data, error };
  }

  /**
   * Get listening history
   */
  static async getListeningHistory(userId, limit = 50) {
    if (!supabase) return { data: [], error: 'Supabase not configured' };

    const { data, error } = await supabase
      .from('listening_history')
      .select('*')
      .eq('user_id', userId)
      .order('played_at', { ascending: false })
      .limit(limit);

    return { data, error };
  }

  // ===== NOTIFICATIONS =====

  /**
   * Get user notifications
   */
  static async getNotifications(userId, limit = 10) {
    if (!supabase) return { data: [], error: 'Supabase not configured' };

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    return { data, error };
  }

  /**
   * Create notification
   */
  static async createNotification(userId, title, message, type = 'info') {
    if (!supabase) return { error: 'Supabase not configured' };

    const { data, error } = await supabase.from('notifications').insert({
      user_id: userId,
      title,
      message,
      type,
      is_read: false,
      created_at: new Date(),
    });

    return { data, error };
  }

  /**
   * Mark notification as read
   */
  static async markNotificationAsRead(notificationId) {
    if (!supabase) return { error: 'Supabase not configured' };

    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    return { data, error };
  }
}

export default SupabaseService;
