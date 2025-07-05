import React from "react";
import { Music, Youtube, Check, AlertCircle } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

export const ServiceConnections = () => {
  const { user, connectSpotify, connectGoogle, disconnectService } = useAuth();

  const services = [
    {
      name: "Spotify",
      icon: Music,
      connected: user?.connectedServices?.spotify || false,
      color: "text-spotify-green",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      borderColor: "border-green-200 dark:border-green-800",
      connectAction: connectSpotify,
      disconnectAction: () => disconnectService("spotify"),
    },
    {
      name: "YouTube",
      icon: Youtube,
      connected: user?.connectedServices?.google || false,
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      borderColor: "border-red-200 dark:border-red-800",
      connectAction: connectGoogle,
      disconnectAction: () => disconnectService("google"),
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Connected Services
      </h3>

      <div className="space-y-4">
        {services.map((service) => {
          const Icon = service.icon;

          return (
            <div
              key={service.name}
              className={`p-4 rounded-lg border ${service.borderColor} ${service.bgColor} transition-all hover:shadow-sm`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-2 rounded-lg bg-white dark:bg-gray-700 ${service.color}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {service.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {service.connected ? "Connected" : "Not connected"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {service.connected ? (
                    <>
                      <div className="flex items-center text-green-600 dark:text-green-400">
                        <Check className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">Connected</span>
                      </div>
                      <button
                        onClick={service.disconnectAction}
                        className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm font-medium"
                      >
                        Disconnect
                      </button>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 text-gray-400" />
                      <button
                        onClick={service.connectAction}
                        className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                      >
                        Connect
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          💡 Connect both services to sync your Spotify playlists to YouTube
        </p>
      </div>
    </div>
  );
};
