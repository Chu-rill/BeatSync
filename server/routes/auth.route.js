import { Router } from "express";
import dotenv from "dotenv";
import { SpotifyAuthController } from "../controller/spotify.auth.controller.js";
import { GoogleAuthController } from "../controller/google.auth.controller.js";
dotenv.config();

const spotifyController = new SpotifyAuthController();
const googleAuthController = new GoogleAuthController();

const authRoutes = Router();

//SPOTIFY AUTH ROUTES
authRoutes.get("/spotify/login", spotifyController.login);
authRoutes.get("/spotify/callback", spotifyController.callback);

//GOOGLE AUTH ROUTES
authRoutes.get("/google/login", googleAuthController.login);
authRoutes.get("/google/callback", googleAuthController.callback);
authRoutes.post("/google/refresh", googleAuthController.refreshToken);
authRoutes.post("/google/logout", googleAuthController.logout);

export default authRoutes;
