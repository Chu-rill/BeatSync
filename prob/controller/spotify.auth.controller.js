import { SpotifyAuthService } from "../service/spotify.auth.service.js";

export class SpotifyAuthController {
  constructor() {
    this.spotifyAuthService = new SpotifyAuthService();
  }

  login = (req, res) => {
    try {
      const authUrl = this.spotifyAuthService.getAuthorizationUrl();
      res.redirect(authUrl);
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Failed to initiate login" });
    }
  };

  callback = async (req, res) => {
    try {
      const { code } = req.query;

      if (!code) {
        return res
          .status(400)
          .json({ error: "No authorization code provided" });
      }

      const accessToken = await this.spotifyAuthService.exchangeCodeForToken(
        code
      );
      const redirectUrl =
        this.spotifyAuthService.getFrontendRedirectUrl(accessToken);

      res.redirect(redirectUrl);
    } catch (error) {
      console.error("Callback error:", error);
      res.status(500).json({ error: "Authentication failed" });
    }
  };
}
