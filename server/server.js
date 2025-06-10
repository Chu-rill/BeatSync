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
//auth/spotify

// app.get("/callback", (req, res) => {
//   const code = req.query.code;
//   if (!code) {
//     return res.status(400).send("No code provided");
//   }

//   const tokenUrl = "https://accounts.spotify.com/api/token";
//   const body = querystring.stringify({
//     grant_type: "authorization_code",
//     code: code,
//     redirect_uri: redirect_url,
//     client_id: client_id,
//     client_secret: client_secret,
//   });

//   requests(tokenUrl, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/x-www-form-urlencoded",
//     },
//     body: body,
//   })
//     .on("data", (chunk) => {
//       res.write(chunk);
//     })
//     .on("end", () => {
//       res.end();
//     })
//     .on("error", (err) => {
//       console.error(err);
//       res.status(500).send("Error fetching access token");
//     });
// });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
