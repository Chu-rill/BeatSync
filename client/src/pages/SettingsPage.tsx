import { useState } from "react";
import {
  Settings,
  Moon,
  Sun,
  Bell,
  Shield,
  Download,
  //   Trash2,
  AlertTriangle,
  //   Check,
  Music,
  Youtube,
  Globe,
  //   Clock,
  //   Volume2,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";

export const SettingsPage = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, disconnectService } = useAuth();

  const [settings, setSettings] = useState({
    notifications: {
      syncComplete: true,
      syncFailed: true,
      weeklyReport: false,
      newFeatures: true,
    },
    sync: {
      autoSync: false,
      syncQuality: "high",
      skipUnavailable: true,
      createPublicPlaylists: false,
    },
    privacy: {
      shareActivity: false,
      allowAnalytics: true,
      dataCollection: true,
    },
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSettingChange = (
    category: string,
    setting: string,
    value: any
  ) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value,
      },
    }));
  };

  const handleExportData = () => {
    // Implementation for data export
    console.log("Exporting user data...");
  };

  const handleDeleteAccount = () => {
    // Implementation for account deletion
    console.log("Deleting account...");
    setShowDeleteConfirm(false);
  };

  const SettingToggle = ({
    enabled,
    onChange,
    label,
    description,
  }: {
    enabled: boolean;
    onChange: (value: boolean) => void;
    label: string;
    description: string;
  }) => (
    <div className="flex items-center justify-between py-4">
      <div className="flex-1">
        <h4 className="font-medium text-gray-900 dark:text-white">{label}</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          enabled ? "bg-spotify-green" : "bg-gray-200 dark:bg-gray-700"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Customize your BeatSync experience
          </p>
        </div>

        <div className="space-y-8">
          {/* Appearance */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="bg-purple-100 dark:bg-purple-900/20 p-2 rounded-lg mr-3">
                  <Settings className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Appearance
                </h3>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Theme
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Choose your preferred color scheme
                  </p>
                </div>
                <button
                  onClick={toggleTheme}
                  className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-3 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {theme === "light" ? (
                    <>
                      <Sun className="h-5 w-5 text-yellow-500" />
                      <span className="text-gray-900 dark:text-white">
                        Light
                      </span>
                    </>
                  ) : (
                    <>
                      <Moon className="h-5 w-5 text-blue-400" />
                      <span className="text-gray-900 dark:text-white">
                        Dark
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-lg mr-3">
                  <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Notifications
                </h3>
              </div>
            </div>
            <div className="p-6 space-y-1 divide-y divide-gray-200 dark:divide-gray-700">
              <SettingToggle
                enabled={settings.notifications.syncComplete}
                onChange={(value) =>
                  handleSettingChange("notifications", "syncComplete", value)
                }
                label="Sync Complete"
                description="Get notified when playlist synchronization is finished"
              />
              <SettingToggle
                enabled={settings.notifications.syncFailed}
                onChange={(value) =>
                  handleSettingChange("notifications", "syncFailed", value)
                }
                label="Sync Failed"
                description="Get notified when playlist synchronization fails"
              />
              <SettingToggle
                enabled={settings.notifications.weeklyReport}
                onChange={(value) =>
                  handleSettingChange("notifications", "weeklyReport", value)
                }
                label="Weekly Report"
                description="Receive a weekly summary of your sync activity"
              />
              <SettingToggle
                enabled={settings.notifications.newFeatures}
                onChange={(value) =>
                  handleSettingChange("notifications", "newFeatures", value)
                }
                label="New Features"
                description="Be the first to know about new BeatSync features"
              />
            </div>
          </div>

          {/* Sync Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-lg mr-3">
                  <Music className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Sync Settings
                </h3>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <SettingToggle
                enabled={settings.sync.autoSync}
                onChange={(value) =>
                  handleSettingChange("sync", "autoSync", value)
                }
                label="Auto Sync"
                description="Automatically sync new playlists when they're created"
              />

              <div className="py-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Sync Quality
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Choose the quality preference for track matching
                    </p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  {["high", "medium", "fast"].map((quality) => (
                    <button
                      key={quality}
                      onClick={() =>
                        handleSettingChange("sync", "syncQuality", quality)
                      }
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        settings.sync.syncQuality === quality
                          ? "bg-spotify-green text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                    >
                      {quality.charAt(0).toUpperCase() + quality.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <SettingToggle
                enabled={settings.sync.skipUnavailable}
                onChange={(value) =>
                  handleSettingChange("sync", "skipUnavailable", value)
                }
                label="Skip Unavailable Tracks"
                description="Continue syncing even if some tracks aren't available on YouTube"
              />

              <SettingToggle
                enabled={settings.sync.createPublicPlaylists}
                onChange={(value) =>
                  handleSettingChange("sync", "createPublicPlaylists", value)
                }
                label="Create Public Playlists"
                description="Make synced YouTube playlists public by default"
              />
            </div>
          </div>

          {/* Connected Services */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="bg-orange-100 dark:bg-orange-900/20 p-2 rounded-lg mr-3">
                  <Globe className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Connected Services
                </h3>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-spotify-green p-2 rounded-lg mr-3">
                    <Music className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Spotify
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {user?.connectedServices.spotify
                        ? "Connected"
                        : "Not connected"}
                    </p>
                  </div>
                </div>
                {user?.connectedServices.spotify ? (
                  <button
                    onClick={() => disconnectService("spotify")}
                    className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm font-medium"
                  >
                    Disconnect
                  </button>
                ) : (
                  <button className="bg-spotify-green text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors">
                    Connect
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-red-500 p-2 rounded-lg mr-3">
                    <Youtube className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Google/YouTube
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {user?.connectedServices.google
                        ? "Connected"
                        : "Not connected"}
                    </p>
                  </div>
                </div>
                {user?.connectedServices.google ? (
                  <button
                    onClick={() => disconnectService("google")}
                    className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm font-medium"
                  >
                    Disconnect
                  </button>
                ) : (
                  <button className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors">
                    Connect
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Privacy */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="bg-indigo-100 dark:bg-indigo-900/20 p-2 rounded-lg mr-3">
                  <Shield className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Privacy & Data
                </h3>
              </div>
            </div>
            <div className="p-6 space-y-1 divide-y divide-gray-200 dark:divide-gray-700">
              <SettingToggle
                enabled={settings.privacy.shareActivity}
                onChange={(value) =>
                  handleSettingChange("privacy", "shareActivity", value)
                }
                label="Share Activity"
                description="Allow others to see your sync activity and statistics"
              />
              <SettingToggle
                enabled={settings.privacy.allowAnalytics}
                onChange={(value) =>
                  handleSettingChange("privacy", "allowAnalytics", value)
                }
                label="Analytics"
                description="Help improve BeatSync by sharing anonymous usage data"
              />
              <SettingToggle
                enabled={settings.privacy.dataCollection}
                onChange={(value) =>
                  handleSettingChange("privacy", "dataCollection", value)
                }
                label="Data Collection"
                description="Allow collection of usage patterns for feature improvements"
              />
            </div>
          </div>

          {/* Data Management */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg mr-3">
                  <Download className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Data Management
                </h3>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Export Data
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Download a copy of your account data and sync history
                  </p>
                </div>
                <button
                  onClick={handleExportData}
                  className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-red-200 dark:border-red-800">
            <div className="p-6 border-b border-red-200 dark:border-red-800">
              <div className="flex items-center">
                <div className="bg-red-100 dark:bg-red-900/20 p-2 rounded-lg mr-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-red-900 dark:text-red-100">
                  Danger Zone
                </h3>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-red-900 dark:text-red-100">
                    Delete Account
                  </h4>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    Permanently delete your account and all associated data
                  </p>
                </div>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md mx-4">
              <div className="flex items-center mb-4">
                <AlertTriangle className="h-6 w-6 text-red-500 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Delete Account
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete your account? This action cannot
                be undone and will permanently remove all your data.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Yes, Delete Account
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
