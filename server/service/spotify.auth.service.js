import querystring from "querystring";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export class SpotifyAuthService {
  constructor() {
    this.clientId = process.env.SPOTIFY_CLIENT_ID;
    this.clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    this.redirectUri = process.env.SPOTIFY_REDIRECT_URI;
    this.frontendUrl =
      process.env.FRONTEND_URL || "http://localhost:3000/playlist";

    // Validate required environment variables
    if (!this.clientId || !this.clientSecret || !this.redirectUri) {
      throw new Error("Missing required Spotify configuration");
    }
  }

  getAuthorizationUrl() {
    const scopes = [
      "user-read-private",
      "user-read-email",
      "user-library-read",
      "user-library-modify",
      "playlist-read-private",
      "playlist-modify-public",
      "playlist-modify-private",
    ].join(" ");

    const params = querystring.stringify({
      response_type: "code",
      client_id: this.clientId,
      scope: scopes,
      redirect_uri: this.redirectUri,
    });

    return `https://accounts.spotify.com/authorize?${params}`;
  }

  async exchangeCodeForToken(code) {
    const authHeader = this.getBasicAuthHeader();

    const requestData = {
      grant_type: "authorization_code",
      code: code,
      redirect_uri: this.redirectUri,
    };

    try {
      const response = await axios.post(
        "https://accounts.spotify.com/api/token",
        new URLSearchParams(requestData),
        {
          headers: {
            Authorization: authHeader,
            // "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      if (!response.data.access_token) {
        throw new Error("No access token received from Spotify");
      }

      return response.data.access_token;
    } catch (error) {
      console.error(
        "Token exchange error:",
        error.response?.data || error.message
      );
      throw new Error("Failed to exchange authorization code for access token");
    }
  }

  getBasicAuthHeader() {
    const credentials = Buffer.from(
      `${this.clientId}:${this.clientSecret}`
    ).toString("base64");
    return `Basic ${credentials}`;
  }

  getFrontendRedirectUrl(accessToken) {
    return `${this.frontendUrl}?access_token=${accessToken}`;
  }
}
