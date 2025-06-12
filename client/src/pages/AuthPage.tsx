import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthForm } from "../components/auth/AuthForm";
import { OAuthButtons } from "../components/auth/OAuthButtons";
import { useAuth } from "../contexts/AuthContext";

export const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const message = location.state?.message;

  const [mode, setMode] = useState<"login" | "signup">(() => {
    const params = new URLSearchParams(location.search);
    return params.get("mode") === "signup" ? "signup" : "login";
  });

  useEffect(() => {
    if (user) {
      const from = (location.state as any)?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const toggleMode = () => {
    const newMode = mode === "login" ? "signup" : "login";
    setMode(newMode);
    navigate(`/auth${newMode === "signup" ? "?mode=signup" : ""}`, {
      replace: true,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {message && (
          <div className="rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-green-400">✓</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">{message}</p>
              </div>
            </div>
          </div>
        )}
        <AuthForm mode={mode} onToggleMode={toggleMode} />
        <OAuthButtons />
      </div>
    </div>
  );
};
