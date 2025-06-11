import axios from "axios";
import { Request, Response, NextFunction } from "express";
const jwt = require("jsonwebtoken");
const User = require("../model/User");
const verifyGoogleToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No valid authorization header" });
    }

    const token = authHeader.substring(7);

    // Verify token with Google
    const response = await axios.get(
      `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`
    );

    if (response.data.error) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // Add user info to request
    req.user = {
      id: response.data.user_id,
      email: response.data.email,
      scope: response.data.scope,
    };

    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({ error: "Token verification failed" });
  }
};

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract token from the Bearer token in the Authorization header
      token = req.headers.authorization.split(" ")[1];

      // Verify the token using the JWT_SECRET
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user from the database based on the decoded token (without password)
      req.user = await User.findById(decoded.id).select("-password");

      // Proceed to the next middleware or route handler
      next();
    } catch (err) {
      console.error("Token verification failed", err);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

export { protect, verifyGoogleToken };
