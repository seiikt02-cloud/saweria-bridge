const express = require("express");
const app = express();

app.use(express.json());

const SECRET = "SZ_SAWERIA_2026_x7K9pLm2";
let latestDonation = null;

// Saweria mengirim webhook ke sini
app.post("/webhook", (req, res) => {
  const data = req.body;

  if (!data) {
    return res.status(400).send("No data");
  }

  latestDonation = {
    id: data.id || String(Date.now()),
    name: data.donator_name || data.name || "Anonymous",
    amount: data.amount || 0,
    message: data.message || "",
  };

  console.log("Donation received:", latestDonation);

  res.status(200).send("OK");
});

// Roblox mengambil donasi terbaru dari sini
app.get("/latest", (req, res) => {
  const auth = req.headers.authorization;

  if (auth !== SECRET) {
    return res.status(401).send("Unauthorized");
  }

  if (latestDonation) {
    res.json(latestDonation);
    latestDonation = null;
  } else {
    res.json(null);
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Bridge running on port ${PORT}`);
});
