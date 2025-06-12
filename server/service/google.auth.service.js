import axios from "axios";
import { URLSearchParams } from "url";
import { UserRepository } from "../repository/user.repository.js";
import { EmailService } from "../utils/email.js";
import dotenv from "dotenv";
dotenv.config();

export class GoogleAuthService {
  constructor() {
    this.clientId = process.env.GOOGLE_CLIENT_ID;
    this.clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    this.redirectUri = process.env.GOOGLE_REDIRECT_URI;
    this.frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    this.userRespository = new UserRepository();
    this.emailService = new EmailService();

    // Google OAuth endpoints
    this.authUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    this.tokenUrl = "https://oauth2.googleapis.com/token";
    this.userInfoUrl = "https://www.googleapis.com/oauth2/v2/userinfo";
    this.revokeUrl = "https://oauth2.googleapis.com/revoke";

    // Validate required environment variables
    const missingVars = [];
    if (!this.clientId) missingVars.push("GOOGLE_CLIENT_ID");
    if (!this.clientSecret) missingVars.push("GOOGLE_CLIENT_SECRET");
    if (!this.redirectUri) missingVars.push("GOOGLE_REDIRECT_URI");

    if (missingVars.length > 0) {
      throw new Error(
        `Missing required Google OAuth environment variables: ${missingVars.join(
          ", "
        )}\n` + `Please add them to your .env file.`
      );
    }
  }

  getAuthorizationUrl(state = null) {
    const scopes = ["openid", "profile", "email"].join(" ");

    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: "code",
      scope: scopes,
      access_type: "offline", // Required for refresh tokens
      prompt: "consent", // Force consent screen to ensure refresh token
      include_granted_scopes: "true",
    });

    // Add state parameter for CSRF protection
    if (state) {
      params.append("state", state);
    }

    return `${this.authUrl}?${params.toString()}`;
  }

  async exchangeCodeForToken(code) {
    const requestData = new URLSearchParams({
      client_id: this.clientId,
      client_secret: this.clientSecret,
      code: code,
      grant_type: "authorization_code",
      redirect_uri: this.redirectUri,
    });

    try {
      const response = await axios.post(this.tokenUrl, requestData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (!response.data.access_token) {
        throw new Error("No access token received from Google");
      }

      return {
        access_token: response.data.access_token,
        refresh_token: response.data.refresh_token,
        expires_in: response.data.expires_in,
        token_type: response.data.token_type,
        scope: response.data.scope,
        id_token: response.data.id_token,
      };
    } catch (error) {
      console.error(
        "Google token exchange error:",
        error.response?.data || error.message
      );
      throw new Error("Failed to exchange authorization code for access token");
    }
  }

  async getUserInfo(accessToken) {
    try {
      const response = await axios.get(this.userInfoUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      let user = await this.userRespository.findUserByEmail(
        response.data.email
      );

      if (!user) {
        user = await this.userRespository.createUser({
          email: response.data.email,
          username: response.data.name,
        });
        console.log("user:", user);
        const data = {
          subject: "BeatSync Inviation",
          username: user.username,
        };

        await this.emailService.sendEmailWithTemplate(user.email, data);
      }

      return {
        id: response.data.id,
        email: response.data.email,
        username: response.data.name,
        // given_name: response.data.given_name,
        // family_name: response.data.family_name,
        // picture: response.data.picture,
        // verified_email: response.data.verified_email,
      };
    } catch (error) {
      console.error(
        "Get user info error:",
        error.response?.data || error.message
      );
      throw new Error("Failed to get user information");
    }
  }

  async refreshAccessToken(refreshToken) {
    const requestData = new URLSearchParams({
      client_id: this.clientId,
      client_secret: this.clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    });

    try {
      const response = await axios.post(this.tokenUrl, requestData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      return {
        access_token: response.data.access_token,
        expires_in: response.data.expires_in,
        token_type: response.data.token_type,
        scope: response.data.scope,
      };
    } catch (error) {
      console.error(
        "Token refresh error:",
        error.response?.data || error.message
      );
      throw new Error("Failed to refresh access token");
    }
  }

  async revokeToken(token) {
    try {
      await axios.post(`${this.revokeUrl}?token=${token}`);
      return true;
    } catch (error) {
      console.error(
        "Token revocation error:",
        error.response?.data || error.message
      );
      throw new Error("Failed to revoke token");
    }
  }

  getFrontendRedirectUrl(data) {
    const params = new URLSearchParams({
      access_token: data.access_token,
      user_id: data.user.id,
      user_email: data.user.email,
      user_name: data.user.name,
    });

    if (data.refresh_token) {
      params.append("refresh_token", data.refresh_token);
    }

    return `${this.frontendUrl}/auth/success?${params.toString()}`;
  }
}
