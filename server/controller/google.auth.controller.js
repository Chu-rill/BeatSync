import { GoogleAuthService } from "../service/google.auth.service";

export class GoogleAuthController {
  constructor() {
    this.googleAuthService = new GoogleAuthService();
  }

  login = (req, res) => {
    try {
      const { state } = req.query; // Optional state parameter for CSRF protection
      const authUrl = this.googleAuthService.getAuthorizationUrl(state);
      res.redirect(authUrl);
    } catch (error) {
      console.error("Google login error:", error);
      res.status(500).json({ error: "Failed to initiate Google login" });
    }
  };

  callback = async (req, res) => {
    try {
      const { code, error, state } = req.query;

      // Handle authorization errors
      if (error) {
        console.error("Google authorization error:", error);
        const errorUrl = `${
          this.googleAuthService.frontendUrl
        }/auth/error?error=${encodeURIComponent(error)}`;
        return res.redirect(errorUrl);
      }

      if (!code) {
        return res
          .status(400)
          .json({ error: "No authorization code provided" });
      }

      const tokenData = await this.googleAuthService.exchangeCodeForToken(code);
      const userInfo = await this.googleAuthService.getUserInfo(
        tokenData.access_token
      );

      // Store tokens securely (in production, use secure HTTP-only cookies or sessions)
      const redirectUrl = this.googleAuthService.getFrontendRedirectUrl({
        ...tokenData,
        user: userInfo,
      });

      res.redirect(redirectUrl);
    } catch (error) {
      console.error("Google callback error:", error);
      const errorUrl = `${this.googleAuthService.frontendUrl}/auth/error?error=authentication_failed`;
      res.redirect(errorUrl);
    }
  };

  refreshToken = async (req, res) => {
    try {
      const { refresh_token } = req.body;

      if (!refresh_token) {
        return res.status(400).json({ error: "Refresh token is required" });
      }

      const tokenData = await this.googleAuthService.refreshAccessToken(
        refresh_token
      );
      res.json(tokenData);
    } catch (error) {
      console.error("Token refresh error:", error);
      res.status(401).json({ error: "Failed to refresh token" });
    }
  };

  logout = async (req, res) => {
    try {
      const { access_token } = req.body;

      if (access_token) {
        await this.googleAuthService.revokeToken(access_token);
      }

      res.json({ message: "Logged out successfully" });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({ error: "Failed to logout" });
    }
  };
}
