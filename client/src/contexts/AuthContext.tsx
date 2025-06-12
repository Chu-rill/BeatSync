import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User, AuthTokens } from "../types";
import { authApi } from "../utils/api";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  user: User | null;
  tokens: AuthTokens | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, username: string) => Promise<void>;
  logout: () => void;
  connectSpotify: () => void;
  connectGoogle: () => void;
  disconnectService: (service: "spotify" | "google") => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      const storedTokens = localStorage.getItem("beatsync-tokens");
      if (storedTokens) {
        try {
          const parsedTokens = JSON.parse(storedTokens);
          if (parsedTokens.expiresAt > Date.now()) {
            setTokens(parsedTokens);
            const userData = await authApi.getProfile(parsedTokens.accessToken);
            setUser(userData);
          } else {
            localStorage.removeItem("beatsync-tokens");
          }
        } catch (error) {
          console.error("Failed to initialize auth:", error);
          localStorage.removeItem("beatsync-tokens");
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authApi.login(email, password);
    setTokens(response.tokens);
    setUser(response.user);
    localStorage.setItem("beatsync-tokens", JSON.stringify(response.tokens));
  };

  const signup = async (email: string, password: string, username: string) => {
    const response = await authApi.signup(email, password, username);
    navigate("/auth?mode=login", {
      state: { message: "Account created successfully! Please log in." },
    });
  };

  const logout = () => {
    setUser(null);
    setTokens(null);
    localStorage.removeItem("beatsync-tokens");
  };

  const connectSpotify = () => {
    window.location.href = `${
      import.meta.env.VITE_API_BASE_URL || "http://localhost:8888/api/v1"
    }/auth/spotify/login`;
  };

  const connectGoogle = () => {
    window.location.href = `${
      import.meta.env.VITE_API_BASE_URL || "http://localhost:8888/api/v1"
    }/auth/google/login`;
  };

  const disconnectService = async (service: "spotify" | "google") => {
    if (!tokens) return;

    await authApi.disconnectService(service, tokens.accessToken);
    const updatedUser = await authApi.getProfile(tokens.accessToken);
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        tokens,
        loading,
        login,
        signup,
        logout,
        connectSpotify,
        connectGoogle,
        disconnectService,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
