import { useState, useEffect } from "react";
import {
  Music,
  Search,
  Filter,
  Play,
  ExternalLink,
  Clock,
  Users,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { SpotifyPlaylist } from "../types";
import { spotifyApi } from "../utils/api";
import { LoadingSpinner } from "../components/layout/LoadingSpinner";

export const PlaylistsPage = () => {
  const { user, tokens } = useAuth();
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "public" | "private">(
    "all"
  );
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPlaylists = async () => {
      if (!tokens || !user?.connectedServices.spotify) {
        setLoading(false);
        return;
      }

      try {
        const data = await spotifyApi.getSpotifyPlaylists(tokens.accessToken);
        setPlaylists(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch playlists"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, [tokens, user]);

  const filteredPlaylists = playlists.filter((playlist) => {
    const matchesSearch = playlist.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterType === "all" ||
      (filterType === "public" && playlist.isPublic) ||
      (filterType === "private" && !playlist.isPublic);

    return matchesSearch && matchesFilter;
  });

  const formatDuration = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  if (!user?.connectedServices.spotify) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="bg-spotify-green p-4 rounded-full w-16 h-16 mx-auto mb-6">
            <Music className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Connect Spotify First
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You need to connect your Spotify account to view and manage your
            playlists.
          </p>
          <button
            onClick={() =>
              (window.location.href = `${
                import.meta.env.VITE_API_BASE_URL ||
                "http://localhost:8888/api/v1"
              }/auth/spotify/login`)
            }
            className="bg-spotify-green text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors"
          >
            Connect Spotify
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Your Spotify Playlists
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and sync your Spotify playlists to YouTube
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search playlists..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-spotify-green focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                value={filterType}
                onChange={(e) =>
                  setFilterType(e.target.value as "all" | "public" | "private")
                }
                className="pl-10 pr-8 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-spotify-green focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none"
              >
                <option value="all">All Playlists</option>
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        ) : filteredPlaylists.length === 0 ? (
          <div className="text-center py-12">
            <Music className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No playlists found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm
                ? "Try adjusting your search terms"
                : "Create some playlists in Spotify to get started"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlaylists.map((playlist) => (
              <div
                key={playlist.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-200 group"
              >
                <div className="aspect-square bg-gradient-to-br from-spotify-green to-green-600 relative overflow-hidden">
                  {playlist.imageUrl ? (
                    <img
                      src={playlist.imageUrl}
                      alt={playlist.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Music className="h-16 w-16 text-white opacity-80" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                    <Play className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-lg leading-tight">
                      {playlist.name}
                    </h3>
                    <ExternalLink className="h-4 w-4 text-gray-400 hover:text-spotify-green cursor-pointer flex-shrink-0 ml-2" />
                  </div>

                  {playlist.description && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                      {playlist.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center">
                      <Music className="h-4 w-4 mr-1" />
                      <span>{playlist.trackCount} tracks</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{formatDuration(playlist.duration)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Users className="h-4 w-4 mr-1" />
                      <span>by {playlist.owner}</span>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        playlist.isPublic
                          ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {playlist.isPublic ? "Public" : "Private"}
                    </span>
                  </div>

                  <button className="w-full bg-spotify-green text-white py-2 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors">
                    Sync to YouTube
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
