export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: string;
  connectedServices: {
    spotify: boolean;
    google: boolean;
  };
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  trackCount: number;
  duration: number;
  owner: string;
  isPublic: boolean;
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: string[];
  album: string;
  duration: number;
  previewUrl?: string;
  isAvailable: boolean;
}

export interface YouTubePlaylist {
  id: string;
  title: string;
  description: string;
  videoCount: number;
  thumbnailUrl?: string;
}

export interface SyncStatus {
  id: string;
  spotifyPlaylistId: string;
  youtubePlaylistId?: string;
  status: 'pending' | 'syncing' | 'completed' | 'failed';
  progress: number;
  totalTracks: number;
  syncedTracks: number;
  failedTracks: string[];
  createdAt: string;
  completedAt?: string;
}

export interface ApiError {
  message: string;
  code: string;
  status: number;
}