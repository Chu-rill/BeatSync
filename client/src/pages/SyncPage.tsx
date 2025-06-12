import { useState, useEffect } from "react";
import {
  //   Play,
  //   Pause,
  CheckCircle,
  XCircle,
  Clock,
  Music,
  Youtube,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { SyncStatus } from "../types";
import { syncApi } from "../utils/api";
import { LoadingSpinner } from "../components/layout/LoadingSpinner";

export const SyncPage = () => {
  const { user, tokens } = useAuth();
  const [syncHistory, setSyncHistory] = useState<SyncStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeSyncs, setActiveSyncs] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchSyncHistory = async () => {
      if (!tokens) {
        setLoading(false);
        return;
      }

      try {
        const data = await syncApi.getSyncHistory(tokens.accessToken);
        setSyncHistory(data);

        // Track active syncs
        const active = new Set(
          data
            .filter(
              (sync) => sync.status === "syncing" || sync.status === "pending"
            )
            .map((sync) => sync.id)
        );
        setActiveSyncs(active);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch sync history"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSyncHistory();
  }, [tokens]);

  // Poll for active sync updates
  useEffect(() => {
    if (activeSyncs.size === 0) return;

    const interval = setInterval(async () => {
      if (!tokens) return;

      try {
        const updatedSyncs = await Promise.all(
          Array.from(activeSyncs).map((syncId) =>
            syncApi.getSyncStatus(syncId, tokens.accessToken)
          )
        );

        setSyncHistory((prev) => {
          const updated = [...prev];
          updatedSyncs.forEach((sync) => {
            const index = updated.findIndex((s) => s.id === sync.id);
            if (index !== -1) {
              updated[index] = sync;
            }
          });
          return updated;
        });

        // Remove completed syncs from active tracking
        const stillActive = new Set<string>();
        updatedSyncs.forEach((sync) => {
          if (sync.status === "syncing" || sync.status === "pending") {
            stillActive.add(sync.id);
          }
        });
        setActiveSyncs(stillActive);
      } catch (err) {
        console.error("Failed to update sync status:", err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [activeSyncs, tokens]);

  const getStatusIcon = (status: SyncStatus["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "syncing":
        return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />;
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: SyncStatus["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800";
      case "syncing":
        return "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800";
      case "completed":
        return "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800";
      case "failed":
        return "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";
      default:
        return "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateProgress = (sync: SyncStatus) => {
    if (sync.totalTracks === 0) return 0;
    return Math.round((sync.syncedTracks / sync.totalTracks) * 100);
  };

  if (!user?.connectedServices.spotify || !user?.connectedServices.google) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="flex justify-center mb-6">
            <div className="bg-spotify-green p-3 rounded-xl mr-2">
              <Music className="h-6 w-6 text-white" />
            </div>
            <div className="bg-red-500 p-3 rounded-xl">
              <Youtube className="h-6 w-6 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Connect Both Services
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You need to connect both Spotify and Google accounts to sync
            playlists.
          </p>
          <div className="space-y-3">
            {!user?.connectedServices.spotify && (
              <button
                onClick={() =>
                  (window.location.href = `${
                    import.meta.env.VITE_API_BASE_URL ||
                    "http://localhost:8888/api/v1"
                  }/auth/spotify/login`)
                }
                className="w-full bg-spotify-green text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors"
              >
                Connect Spotify
              </button>
            )}
            {!user?.connectedServices.google && (
              <button
                onClick={() =>
                  (window.location.href = `${
                    import.meta.env.VITE_API_BASE_URL ||
                    "http://localhost:8888/api/v1"
                  }/auth/google/login`)
                }
                className="w-full bg-red-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-600 transition-colors"
              >
                Connect Google
              </button>
            )}
          </div>
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
            Playlist Synchronization
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your playlist sync progress and history
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: "Total Syncs",
              value: syncHistory.length.toString(),
              icon: RefreshCw,
              color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20",
            },
            {
              label: "Completed",
              value: syncHistory
                .filter((s) => s.status === "completed")
                .length.toString(),
              icon: CheckCircle,
              color: "text-green-600 bg-green-50 dark:bg-green-900/20",
            },
            {
              label: "In Progress",
              value: syncHistory
                .filter((s) => s.status === "syncing" || s.status === "pending")
                .length.toString(),
              icon: Clock,
              color: "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20",
            },
            {
              label: "Failed",
              value: syncHistory
                .filter((s) => s.status === "failed")
                .length.toString(),
              icon: XCircle,
              color: "text-red-600 bg-red-50 dark:bg-red-900/20",
            },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sync History */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Sync History
            </h3>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : error ? (
            <div className="p-6">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-center">
                <p className="text-red-600 dark:text-red-400">{error}</p>
              </div>
            </div>
          ) : syncHistory.length === 0 ? (
            <div className="p-12 text-center">
              <RefreshCw className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No sync history yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Start syncing playlists from the Playlists page to see them here
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {syncHistory.map((sync) => (
                <div key={sync.id} className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(sync.status)}
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          Playlist Sync #{sync.id.slice(-8)}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Started {formatDate(sync.createdAt)}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                        sync.status
                      )}`}
                    >
                      {sync.status.charAt(0).toUpperCase() +
                        sync.status.slice(1)}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  {(sync.status === "syncing" ||
                    sync.status === "completed") && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <span>Progress</span>
                        <span>
                          {sync.syncedTracks} / {sync.totalTracks} tracks
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-spotify-green h-2 rounded-full transition-all duration-300"
                          style={{ width: `${calculateProgress(sync)}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Failed Tracks */}
                  {sync.failedTracks.length > 0 && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                      <div className="flex items-center mb-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mr-2" />
                        <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                          {sync.failedTracks.length} tracks couldn't be synced
                        </span>
                      </div>
                      <details className="text-sm text-yellow-700 dark:text-yellow-300">
                        <summary className="cursor-pointer hover:text-yellow-800 dark:hover:text-yellow-200">
                          View failed tracks
                        </summary>
                        <ul className="mt-2 space-y-1 ml-4">
                          {sync.failedTracks.map((track, index) => (
                            <li key={index} className="list-disc">
                              {track}
                            </li>
                          ))}
                        </ul>
                      </details>
                    </div>
                  )}

                  {/* Completion Time */}
                  {sync.completedAt && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      Completed {formatDate(sync.completedAt)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
