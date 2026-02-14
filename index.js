



import express from "express";
import cors from "cors";
import "dotenv/config";

import { hfAnalyze } from "./hfSentimentService.js";
import { pushToChain } from "./oracle.js";

const app = express();
app.use(cors());
app.use(express.json());

// TEST route
app.get("/", (req, res) => {
  res.send("Sentiment Oracle Backend is running 🚀");
});

// MAIN analyze route
app.post("/analyze", async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({ error: "topic is required" });
    }

    // Dummy posts for hackathon demo
    const posts = [
      `${topic} is going to the moon 🚀🚀`,
      `People are scared, but ${topic} looks strong`,
      `${topic} is overhyped, might dump soon`,
      `Huge whales are buying ${topic}, bullish vibes`,
      `${topic} sentiment looks mixed right now`
    ];

    // AI Sentiment Score using Gemini
    const vibeScore = await hfAnalyze(posts);

    // Push score on-chain
    const txHash = await pushToChain(vibeScore);

    return res.json({
      vibeScore,
      txHash,
      message: "Sentiment analyzed with Gemini and pushed on-chain",
    });
  } catch (err) {
    console.error("ERROR:", err.message);
    return res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});