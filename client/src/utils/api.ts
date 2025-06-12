import { User, AuthTokens, SpotifyPlaylist, SpotifyTrack, YouTubePlaylist, SyncStatus, ApiError } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8888/api/v1';

class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error: ApiError = await response.json();
        throw new Error(error.message || 'API request failed');
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  private authHeaders(token: string) {
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<{ user: User; tokens: AuthTokens }> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async signup(email: string, password: string, username: string): Promise<{ user: User; tokens: AuthTokens }> {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, username }),
    });
  }

  async getProfile(token: string): Promise<User> {
    return this.request('/auth/profile', {
      headers: this.authHeaders(token),
    });
  }

  async disconnectService(service: string, token: string): Promise<void> {
    return this.request(`/auth/disconnect/${service}`, {
      method: 'POST',
      headers: this.authHeaders(token),
    });
  }

  // Spotify endpoints
  async getSpotifyPlaylists(token: string): Promise<SpotifyPlaylist[]> {
    return this.request('/spotify/playlists', {
      headers: this.authHeaders(token),
    });
  }

  async getSpotifyPlaylist(playlistId: string, token: string): Promise<SpotifyPlaylist> {
    return this.request(`/spotify/playlists/${playlistId}`, {
      headers: this.authHeaders(token),
    });
  }

  async getSpotifyTracks(playlistId: string, token: string): Promise<SpotifyTrack[]> {
    return this.request(`/spotify/playlists/${playlistId}/tracks`, {
      headers: this.authHeaders(token),
    });
  }

  // YouTube endpoints
  async getYouTubePlaylists(token: string): Promise<YouTubePlaylist[]> {
    return this.request('/youtube/playlists', {
      headers: this.authHeaders(token),
    });
  }

  async syncPlaylist(spotifyPlaylistId: string, token: string): Promise<SyncStatus> {
    return this.request('/sync/start', {
      method: 'POST',
      headers: this.authHeaders(token),
      body: JSON.stringify({ spotifyPlaylistId }),
    });
  }

  async getSyncStatus(syncId: string, token: string): Promise<SyncStatus> {
    return this.request(`/sync/${syncId}`, {
      headers: this.authHeaders(token),
    });
  }

  async getSyncHistory(token: string): Promise<SyncStatus[]> {
    return this.request('/sync/history', {
      headers: this.authHeaders(token),
    });
  }
}

export const authApi = new ApiClient();
export const spotifyApi = new ApiClient();
export const youtubeApi = new ApiClient();
export const syncApi = new ApiClient();