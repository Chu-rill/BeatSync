import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const URI = process.env.MONGODB_URI || "mongodb://localhost:27017/quizapp";

function connectDB() {
  mongoose
    .connect(URI, {
      // serverSelectionTimeoutMS: 3000000,
    })
    .then(() => {
      console.log("📦 Connected to MongoDB");
    })
    .catch((error) => {
      console.error("❌ Database connection failed:", error.message);
      console.error("Connection failed", error);
    });
}

export { connectDB };
