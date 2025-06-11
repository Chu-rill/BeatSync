import { Router } from "express";
import dotenv from "dotenv";
import { SpotifyAuthController } from "../controller/spotify.auth.controller";
import { GoogleAuthController } from "../controller/google.auth.controller";
dotenv.config();

const spotifyController = new SpotifyAuthController();
const googleAuthController = new GoogleAuthController();

const authRoutes = Router();

//SPOTIFY AUTH ROUTES
authRoutes.get("/spotify/login", spotifyController.login);
authRoutes.get("/spotify/callback", spotifyController.callback);

//GOOGLE AUTH ROUTES
authRoutes.get("/login", GoogleAuthController.login);
authRoutes.get("/callback", googleAuthController.callback);
authRoutes.post("/refresh", googleAuthController.refreshToken);
authRoutes.post("/logout", googleAuthController.logout);

export default authRoutes;
