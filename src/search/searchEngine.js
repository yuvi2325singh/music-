/**
 * Search Module
 * Handles search functionality with debouncing, fuzzy matching, and ranking
 */

import { debounce } from '../utils/helpers.js';

export class SearchEngine {
  constructor(songs = [], albums = [], artists = []) {
    this.songs = songs;
    this.albums = albums;
    this.artists = artists;
    this.debounceDelay = 300;
    this.fuzzyThreshold = 0.6;
  }

  /**
   * Fuzzy string matching - check if pattern matches text
   */
  fuzzyMatch(pattern, text) {
    const p = pattern.toLowerCase();
    const t = text.toLowerCase();

    let pIdx = 0;
    let tIdx = 0;
    let matches = 0;

    while (pIdx < p.length && tIdx < t.length) {
      if (p[pIdx] === t[tIdx]) {
        matches++;
        pIdx++;
      }
      tIdx++;
    }

    return pIdx === p.length ? matches / t.length : 0;
  }

  /**
   * Search songs by query
   */
  searchSongs(query) {
    if (!query || query.trim().length === 0) return [];

    const q = query.toLowerCase();
    const results = [];

    this.songs.forEach((song) => {
      let score = 0;

      // Direct matches get highest score
      if (song.title.toLowerCase().includes(q)) score += 100;
      if (song.artist.toLowerCase().includes(q)) score += 80;
      if (song.album.toLowerCase().includes(q)) score += 60;

      // Fuzzy matches
      const titleFuzzy = this.fuzzyMatch(q, song.title);
      const artistFuzzy = this.fuzzyMatch(q, song.artist);

      if (titleFuzzy > this.fuzzyThreshold) score += titleFuzzy * 50;
      if (artistFuzzy > this.fuzzyThreshold) score += artistFuzzy * 40;

      if (score > 0) {
        results.push({
          ...song,
          type: 'song',
          score,
          matchedFields: {
            title: song.title.toLowerCase().includes(q),
            artist: song.artist.toLowerCase().includes(q),
            album: song.album.toLowerCase().includes(q),
          },
        });
      }
    });

    return results.sort((a, b) => b.score - a.score);
  }

  /**
   * Search artists by query
   */
  searchArtists(query) {
    if (!query || query.trim().length === 0) return [];

    const q = query.toLowerCase();
    const results = [];

    this.artists.forEach((artist) => {
      let score = 0;

      if (artist.name.toLowerCase().includes(q)) score += 100;
      if (artist.genre.toLowerCase().includes(q)) score += 50;

      const nameFuzzy = this.fuzzyMatch(q, artist.name);
      if (nameFuzzy > this.fuzzyThreshold) score += nameFuzzy * 50;

      if (score > 0) {
        results.push({
          ...artist,
          type: 'artist',
          score,
        });
      }
    });

    return results.sort((a, b) => b.score - a.score);
  }

  /**
   * Search albums by query
   */
  searchAlbums(query) {
    if (!query || query.trim().length === 0) return [];

    const q = query.toLowerCase();
    const results = [];

    this.albums.forEach((album) => {
      let score = 0;

      if (album.title.toLowerCase().includes(q)) score += 100;
      if (album.artist.toLowerCase().includes(q)) score += 80;

      const titleFuzzy = this.fuzzyMatch(q, album.title);
      const artistFuzzy = this.fuzzyMatch(q, album.artist);

      if (titleFuzzy > this.fuzzyThreshold) score += titleFuzzy * 50;
      if (artistFuzzy > this.fuzzyThreshold) score += artistFuzzy * 40;

      if (score > 0) {
        results.push({
          ...album,
          type: 'album',
          score,
        });
      }
    });

    return results.sort((a, b) => b.score - a.score);
  }

  /**
   * Combined search across all content
   */
  search(query, limit = 20) {
    const songs = this.searchSongs(query).slice(0, limit / 3);
    const artists = this.searchArtists(query).slice(0, limit / 3);
    const albums = this.searchAlbums(query).slice(0, limit / 3);

    // Combine and sort by score
    const combined = [...songs, ...artists, ...albums];
    return combined.sort((a, b) => b.score - a.score).slice(0, limit);
  }

  /**
   * Get search suggestions
   */
  getSuggestions(query, limit = 5) {
    if (!query || query.trim().length < 2) return [];

    const results = this.search(query, limit);
    return results.map((item) => ({
      id: item.id,
      title: item.title || item.name,
      subtitle: item.artist || item.genre || 'Collection',
      type: item.type,
    }));
  }

  /**
   * Get trending/popular content
   */
  getTrending(limit = 10) {
    const trending = [...this.songs]
      .sort((a, b) => (b.plays || 0) - (a.plays || 0))
      .slice(0, limit);

    return trending;
  }

  /**
   * Get recommended content based on search history
   */
  getRecommended(recentSearches = [], limit = 10) {
    if (recentSearches.length === 0) {
      return this.getTrending(limit);
    }

    // Find songs similar to recent searches
    const recommended = new Map();

    recentSearches.forEach((search) => {
      const results = this.search(search, 5);
      results.forEach((item) => {
        const key = `${item.type}_${item.id}`;
        recommended.set(key, (recommended.get(key) || 0) + item.score);
      });
    });

    const sorted = Array.from(recommended.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([key, score]) => {
        const [type, id] = key.split('_');
        let item;
        if (type === 'song') item = this.songs.find((s) => s.id === id);
        else if (type === 'artist') item = this.artists.find((a) => a.id === id);
        else item = this.albums.find((a) => a.id === id);
        return item;
      })
      .filter(Boolean);

    return sorted;
  }

  /**
   * Update data sources
   */
  updateSongs(songs) {
    this.songs = songs;
  }

  updateArtists(artists) {
    this.artists = artists;
  }

  updateAlbums(albums) {
    this.albums = albums;
  }
}

export default SearchEngine;
