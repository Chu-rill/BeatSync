import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthForm } from '../components/auth/AuthForm';
import { OAuthButtons } from '../components/auth/OAuthButtons';
import { useAuth } from '../contexts/AuthContext';

export const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [mode, setMode] = useState<'login' | 'signup'>(() => {
    const params = new URLSearchParams(location.search);
    return params.get('mode') === 'signup' ? 'signup' : 'login';
  });

  useEffect(() => {
    if (user) {
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const toggleMode = () => {
    const newMode = mode === 'login' ? 'signup' : 'login';
    setMode(newMode);
    navigate(`/auth${newMode === 'signup' ? '?mode=signup' : ''}`, { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <AuthForm mode={mode} onToggleMode={toggleMode} />
        <OAuthButtons />
      </div>
    </div>
  );
};