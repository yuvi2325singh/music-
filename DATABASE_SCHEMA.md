# Pulse Music - Database Schema

This document outlines the complete database structure for the Pulse Music streaming platform.

## Tables

### 1. users
Core user information and profile data.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  bio TEXT,
  avatar_url VARCHAR(500),
  premium_tier VARCHAR(50) DEFAULT 'free', -- free, pro, unlimited
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 2. songs
Music track information and metadata.

```sql
CREATE TABLE songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  artist_id UUID NOT NULL REFERENCES artists(id),
  album_id UUID REFERENCES albums(id),
  duration INTEGER, -- duration in seconds
  audio_url VARCHAR(500) NOT NULL,
  cover_image_url VARCHAR(500),
  lyrics TEXT,
  genre VARCHAR(100),
  release_date DATE,
  plays COUNT DEFAULT 0,
  color VARCHAR(7), -- hex color for UI
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 3. artists
Artist information and metadata.

```sql
CREATE TABLE artists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) UNIQUE NOT NULL,
  bio TEXT,
  image_url VARCHAR(500),
  genre VARCHAR(100),
  followers_count INT DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 4. albums
Album information and collection data.

```sql
CREATE TABLE albums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  artist_id UUID NOT NULL REFERENCES artists(id),
  cover_image_url VARCHAR(500),
  description TEXT,
  release_date DATE,
  total_tracks INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 5. playlists
User-created playlists and collections.

```sql
CREATE TABLE playlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  cover_image_url VARCHAR(500),
  is_public BOOLEAN DEFAULT false,
  is_collaborative BOOLEAN DEFAULT false,
  total_songs INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 6. playlist_songs
Mapping table for songs in playlists (with order).

```sql
CREATE TABLE playlist_songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id UUID NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
  song_id UUID NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
  position INT NOT NULL,
  added_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(playlist_id, song_id)
);
```

### 7. liked_songs
User liked/favorited songs.

```sql
CREATE TABLE liked_songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  song_id UUID NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
  liked_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, song_id)
);
```

### 8. followed_artists
Tracks which artists a user follows.

```sql
CREATE TABLE followed_artists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  followed_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, artist_id)
);
```

### 9. listening_history
Complete listening history and statistics.

```sql
CREATE TABLE listening_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  song_id UUID NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
  played_at TIMESTAMP DEFAULT NOW(),
  duration_listened INT, -- in seconds
  completed BOOLEAN DEFAULT false
);
```

### 10. notifications
User notifications for various events.

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50), -- 'like', 'follow', 'release', 'playlist_update'
  related_user_id UUID REFERENCES users(id),
  related_artist_id UUID REFERENCES artists(id),
  related_song_id UUID REFERENCES songs(id),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 11. queue
User's current play queue state.

```sql
CREATE TABLE queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  songs JSONB NOT NULL DEFAULT '[]',
  current_position INT DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 12. analytics
Platform analytics and statistics.

```sql
CREATE TABLE analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  song_id UUID REFERENCES songs(id) ON DELETE SET NULL,
  artist_id UUID REFERENCES artists(id) ON DELETE SET NULL,
  total_plays INT DEFAULT 0,
  unique_listeners INT DEFAULT 0,
  avg_completion_rate DECIMAL(5,2) DEFAULT 0,
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Indexes

```sql
-- Performance indexes
CREATE INDEX idx_songs_artist ON songs(artist_id);
CREATE INDEX idx_songs_album ON songs(album_id);
CREATE INDEX idx_songs_genre ON songs(genre);
CREATE INDEX idx_playlists_user ON playlists(user_id);
CREATE INDEX idx_playlist_songs_playlist ON playlist_songs(playlist_id);
CREATE INDEX idx_liked_songs_user ON liked_songs(user_id);
CREATE INDEX idx_followed_artists_user ON followed_artists(user_id);
CREATE INDEX idx_listening_history_user ON listening_history(user_id);
CREATE INDEX idx_listening_history_date ON listening_history(played_at);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
```

## Row-Level Security (RLS) Policies

### Users Table
- Users can read their own profile
- Users can update their own profile
- All users can read public artist and musician profiles

### Playlists Table
- Users can see their own playlists
- Users can see public playlists
- Only playlist owner can edit or delete

### Liked Songs, Followed Artists, Queue
- Users can only see/edit their own data

### Notifications
- Users can only read their own notifications
- System can create notifications for users

## File Storage

### Supabase Storage Buckets

1. **audio-files** - Audio tracks
   - Path: `/songs/{song_id}/{filename}.mp3`
   - Access: Private with signed URLs

2. **images** - User uploads
   - Path: `/covers/{song_id}`, `/avatars/{user_id}`
   - Access: Public or private as needed

3. **analytics** - Analytics data exports
   - Path: `/exports/{user_id}/{date}`
   - Access: Private

## Migration Steps

1. Run all CREATE TABLE statements
2. Create indexes for performance
3. Set up RLS policies
4. Configure storage buckets
5. Create storage policies
6. Set up functions for auto-increment plays, etc.

## Constraints and Rules

- Song titles cannot be empty
- Artist names must be unique
- Playlist titles cannot be empty
- Duplicate likes/follows are prevented via UNIQUE constraints
- Cascading deletes ensure referential integrity
