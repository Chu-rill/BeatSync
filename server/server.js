const express = require("express");
let requests = require("requests");
const cors = require("cors");
const dotenv = require("dotenv");
const querystring = require("querystring");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.send("Welcome to the server!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
// app.get("/api", (req, res) => {
//     const query = req.query;
//     const url = `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_API_KEY}&cx=${process.env.CUSTOM_SEARCH_ENGINE_ID}&${querystring.stringify(query)}`;

//     requests(url)
//         .on("data", (chunk) => {
//             res.write(chunk);
//         })
//         .on("end", () => {
//             res.end();
//         })
//         .on("error", (err) => {
//             console.error(err);
//             res.status(500).send("Error fetching data");
//         });
// });
