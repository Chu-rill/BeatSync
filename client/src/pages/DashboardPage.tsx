import { Music, Youtube, TrendingUp, Clock } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { ServiceConnections } from "../components/dashboard/ServiceConnections";

export const DashboardPage = () => {
  const { user } = useAuth();

  const stats = [
    {
      name: "Playlists Synced",
      value: "12",
      icon: Music,
      color: "text-spotify-green bg-green-50 dark:bg-green-900/20",
    },
    {
      name: "Total Tracks",
      value: "1,247",
      icon: TrendingUp,
      color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20",
    },
    {
      name: "YouTube Playlists",
      value: "8",
      icon: Youtube,
      color: "text-red-500 bg-red-50 dark:bg-red-900/20",
    },
    {
      name: "Last Sync",
      value: "2h ago",
      icon: Clock,
      color: "text-purple-600 bg-purple-50 dark:bg-purple-900/20",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Here's what's happening with your music sync
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.name}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
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
                      {stat.name}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Recent Activity
              </h3>
              <div className="space-y-4">
                {[
                  {
                    action: 'Synced playlist "Chill Vibes"',
                    time: "2 hours ago",
                    status: "success",
                  },
                  {
                    action: 'Created YouTube playlist "Workout Mix"',
                    time: "1 day ago",
                    status: "success",
                  },
                  {
                    action:
                      'Failed to sync "Rock Classics" - 3 tracks unavailable',
                    time: "2 days ago",
                    status: "warning",
                  },
                ].map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700"
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        activity.status === "success"
                          ? "bg-green-500"
                          : activity.status === "warning"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                    />
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 dark:text-white">
                        {activity.action}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button className="flex items-center p-4 bg-spotify-green text-white rounded-lg hover:bg-green-600 transition-colors">
                  <Music className="h-5 w-5 mr-3" />
                  <span>Sync New Playlist</span>
                </button>
                <button className="flex items-center p-4 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  <TrendingUp className="h-5 w-5 mr-3" />
                  <span>View Analytics</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <ServiceConnections />

            {/* Tips */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
                💡 Pro Tips
              </h3>
              <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                <li>
                  • Sync playlists during off-peak hours for better performance
                </li>
                <li>• Check for unavailable tracks before syncing</li>
                <li>• Keep playlist names under 100 characters</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
