import { Router } from "express";
import dotenv from "dotenv";
import { AuthController } from "../controller/auth.controller.js";
dotenv.config();

const authRoutes = Router();
const authController = new AuthController();

//SPOTIFY AUTH ROUTES
authRoutes.get("/spotify/login", authController.login);
authRoutes.get("/spotify/callback", authController.callback);

export default authRoutes;
