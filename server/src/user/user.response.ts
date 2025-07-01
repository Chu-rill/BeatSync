export interface SignUpResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    id?: string;
    name?: string;
    email?: string;
    username?: string;
  } | null;
}

export interface LoginResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    id?: string;
    name?: string;
    email?: string;
    username?: string;
  } | null;
  token?: string; // Optional JWT token for authenticated requests
}
