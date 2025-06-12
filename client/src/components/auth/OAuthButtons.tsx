import React from 'react';
import { Music, Youtube } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const OAuthButtons = () => {
  const { connectSpotify, connectGoogle } = useAuth();

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300 dark:border-gray-600" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
            Or connect with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={connectSpotify}
          className="flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors group"
        >
          <Music className="h-5 w-5 mr-2 text-spotify-green group-hover:scale-110 transition-transform" />
          <span className="font-medium">Spotify</span>
        </button>

        <button
          onClick={connectGoogle}
          className="flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors group"
        >
          <Youtube className="h-5 w-5 mr-2 text-red-500 group-hover:scale-110 transition-transform" />
          <span className="font-medium">Google</span>
        </button>
      </div>
    </div>
  );
};