import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/v1/auth", authRoutes);

//Default endpoint to check if the server is running
app.get("/", (req, res) => {
  res.send("Welcome to the server!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
