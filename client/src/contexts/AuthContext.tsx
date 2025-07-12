import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User } from "../types";
import { authApi } from "../utils/api";
import { useNavigate } from "react-router-dom";
import { getToken, storeToken } from "../utils/jwt";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, username: string) => Promise<void>;
  logout: () => void;
  connectSpotify: () => void;
  connectGoogle: () => void;
  handleSpotifyCallback: () => Promise<void>;
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
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      const storedTokens = getToken();
      if (storedTokens) {
        try {
          setToken(storedTokens);
          const userData = await authApi.getProfile(storedTokens);
          // console.log(userData);
          setUser(userData);
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
    // console.log("Login response:", response);
    setToken(response.token);
    setUser(response.data);
    storeToken(response.token);
  };

  const signup = async (email: string, password: string, username: string) => {
    const response = await authApi.signup(email, password, username);
    navigate("/auth?mode=login", {
      state: { message: "Account created successfully! Please log in." },
    });
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("beatsync-tokens");
  };

  const connectSpotify = () => {
    // const storedTokens = getToken();
    const baseUrl =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:8888/api/v1";
    window.location.href = `${baseUrl}/auth/spotify/login`;
  };

  const handleSpotifyCallback = async () => {
    const storedTokens = getToken();
    if (storedTokens) {
      try {
        await authApi.connectService(storedTokens);
        // Refresh user data to show updated connection status
        const updatedUser = await authApi.getProfile(storedTokens);
        setUser(updatedUser);
      } catch (error) {
        console.error("Failed to connect Spotify service:", error);
      }
    }
  };

  const connectGoogle = () => {
    window.location.href = `${
      import.meta.env.VITE_API_BASE_URL || "http://localhost:8888/api/v1"
    }/auth/google/login`;
  };

  const disconnectService = async (service: "spotify" | "google") => {
    if (!token) return;

    await authApi.disconnectService(service, token);
    const updatedUser = await authApi.getProfile(token);
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        signup,
        logout,
        connectSpotify,
        connectGoogle,
        disconnectService,
        handleSpotifyCallback,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
