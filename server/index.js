const { google } = require("googleapis");
const youtube = google.youtube("v3");

const search = async () => {
  const res = await youtube.search.list({
    key: "YOUR_API_KEY",
    q: "Coldplay Yellow",
    part: "snippet",
    type: "video",
  });
  console.log(res.data.items);
};

search();
