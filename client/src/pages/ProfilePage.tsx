import { useState } from "react";
import {
  User,
  Mail,
  Calendar,
  Music,
  Youtube,
  Edit3,
  Save,
  X,
  Shield,
  Clock,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { LoadingSpinner } from "../components/layout/LoadingSpinner";

export const ProfilePage = () => {
  const { user, tokens } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: user?.username || "",
    email: user?.email || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSave = async () => {
    if (!tokens) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // API call to update profile would go here
      // await authApi.updateProfile(editForm, tokens.accessToken);
      setSuccess("Profile updated successfully!");
      setIsEditing(false);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditForm({
      username: user?.username || "",
      email: user?.email || "",
    });
    setIsEditing(false);
    setError("");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Profile Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account information and connected services
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Profile Header */}
              <div className="bg-gradient-to-r from-spotify-green to-green-600 px-6 py-8">
                <div className="flex items-center space-x-4">
                  <div className="bg-white bg-opacity-20 backdrop-blur-sm p-4 rounded-full">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-spotify-green">
                        {user ? getInitials(user.username) : "U"}
                      </span>
                    </div>
                  </div>
                  <div className="text-white">
                    <h2 className="text-2xl font-bold">{user?.username}</h2>
                    <p className="text-green-100">{user?.email}</p>
                    <div className="flex items-center mt-2 text-green-100">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="text-sm">
                        Member since {user ? formatDate(user.createdAt) : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Form */}
              <div className="p-6">
                {success && (
                  <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <p className="text-green-600 dark:text-green-400 text-sm">
                      {success}
                    </p>
                  </div>
                )}

                {error && (
                  <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <p className="text-red-600 dark:text-red-400 text-sm">
                      {error}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Personal Information
                  </h3>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center text-spotify-green hover:text-green-600 transition-colors"
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSave}
                        disabled={loading}
                        className="flex items-center bg-spotify-green text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                      >
                        {loading ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Save
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 transition-colors"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Username
                    </label>
                    {isEditing ? (
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="text"
                          value={editForm.username}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              username: e.target.value,
                            }))
                          }
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-spotify-green focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <User className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-gray-900 dark:text-white">
                          {user?.username}
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    {isEditing ? (
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="email"
                          value={editForm.email}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-spotify-green focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <Mail className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-gray-900 dark:text-white">
                          {user?.email}
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Member Since
                    </label>
                    <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-gray-900 dark:text-white">
                        {user ? formatDate(user.createdAt) : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Connected Services */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Connected Services
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-spotify-green p-2 rounded-lg">
                      <Music className="h-4 w-4 text-white" />
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-900 dark:text-white">
                        Spotify
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {user?.connectedServices.spotify
                          ? "Connected"
                          : "Not connected"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {user?.connectedServices.spotify ? (
                      <div className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 px-2 py-1 rounded-full text-xs font-medium">
                        Active
                      </div>
                    ) : (
                      <button className="text-spotify-green hover:text-green-600 text-sm font-medium">
                        Connect
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-red-500 p-2 rounded-lg">
                      <Youtube className="h-4 w-4 text-white" />
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-900 dark:text-white">
                        Google/YouTube
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {user?.connectedServices.google
                          ? "Connected"
                          : "Not connected"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {user?.connectedServices.google ? (
                      <div className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 px-2 py-1 rounded-full text-xs font-medium">
                        Active
                      </div>
                    ) : (
                      <button className="text-red-500 hover:text-red-600 text-sm font-medium">
                        Connect
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Account Security */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Account Security
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-green-500 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Password
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Last updated 30 days ago
                      </p>
                    </div>
                  </div>
                  <button className="text-spotify-green hover:text-green-600 text-sm font-medium">
                    Change
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-blue-500 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Last Login
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Today at 2:30 PM
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
                Your Activity
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-blue-800 dark:text-blue-200">
                    Playlists Synced
                  </span>
                  <span className="font-semibold text-blue-900 dark:text-blue-100">
                    12
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-800 dark:text-blue-200">
                    Total Tracks
                  </span>
                  <span className="font-semibold text-blue-900 dark:text-blue-100">
                    1,247
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-800 dark:text-blue-200">
                    Success Rate
                  </span>
                  <span className="font-semibold text-blue-900 dark:text-blue-100">
                    94%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
