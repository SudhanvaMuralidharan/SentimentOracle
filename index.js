const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { analyzeText } = require("./sentiment");
const { pushScoreOnChain } = require("./blockchain");

const app = express();
app.use(cors());
app.use(express.json());

// Store latest vibeScore in memory for GET endpoint
let latestVibeScore = null;

// Root route
app.get("/", (req, res) => {
  res.send("Sentiment Oracle Backend Running ✅");
});

// POST /analyze → analyze sentiment and push to blockchain
app.post("/analyze", async (req, res) => {
  try {
    const { posts } = req.body;

    if (!posts || !Array.isArray(posts)) {
      return res.status(400).json({ error: "posts array required" });
    }

    // Analyze sentiment
    const vibeScore = analyzeText(posts);

    // Push to blockchain (mocked for hackathon)
    const txHash = await pushScoreOnChain(vibeScore);

    // Save latest score in memory
    latestVibeScore = vibeScore;

    res.json({
      vibeScore,
      txHash,
      message: "Sentiment analyzed and pushed on-chain",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /sentiment/BTC → fetch latest score
app.get("/sentiment/BTC", (req, res) => {
  if (latestVibeScore === null) {
    return res.status(404).json({ error: "No sentiment available yet" });
  }

  res.json({
    vibeScore: latestVibeScore,
    message: "Latest sentiment fetched successfully",
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});