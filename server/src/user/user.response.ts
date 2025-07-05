export interface User {
  id?: string;
  name?: string;
  email?: string;
  createdAt?: string;
  connectedServices?: {
    spotify: boolean;
    google: boolean;
  };
}

export interface UserResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: User | null;
}

export interface LoginResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: User | null;
  token: string; // Optional JWT token for authenticated requests
}
