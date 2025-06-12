import React from 'react';
import { Link } from 'react-router-dom';
import { Music, Youtube, ArrowRight, Play } from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-spotify-green via-green-500 to-green-600">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="bg-white/20 backdrop-blur-sm p-6 rounded-2xl">
                <div className="flex items-center space-x-4">
                  <div className="bg-white p-3 rounded-xl">
                    <Music className="h-8 w-8 text-spotify-green" />
                  </div>
                  <ArrowRight className="h-6 w-6 text-white" />
                  <div className="bg-white p-3 rounded-xl">
                    <Youtube className="h-8 w-8 text-red-500" />
                  </div>
                </div>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Sync Your Music
              <br />
              <span className="text-green-100">Across Platforms</span>
            </h1>
            
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Seamlessly transfer your Spotify playlists to YouTube. Keep your music synchronized across all your favorite platforms.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/auth?mode=signup"
                className="bg-white text-spotify-green px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-lg flex items-center justify-center group"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                to="/auth"
                className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/30 transition-colors border border-white/30 flex items-center justify-center"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Link>
            </div>
          </div>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-white rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white rounded-full animate-pulse delay-500"></div>
          <div className="absolute bottom-40 right-1/3 w-8 h-8 bg-white rounded-full animate-pulse delay-700"></div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white dark:bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose BeatSync?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              The easiest way to keep your music library synchronized across Spotify and YouTube
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Music,
                title: 'Easy Integration',
                description: 'Connect your Spotify and YouTube accounts with just a few clicks'
              },
              {
                icon: ArrowRight,
                title: 'Smart Syncing',
                description: 'Automatically match and transfer your playlists with high accuracy'
              },
              {
                icon: Play,
                title: 'Real-time Updates',
                description: 'Keep track of sync progress and get notified when complete'
              }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center p-6 rounded-xl bg-gray-50 dark:bg-gray-800 hover:shadow-lg transition-shadow">
                  <div className="bg-spotify-green p-4 rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};