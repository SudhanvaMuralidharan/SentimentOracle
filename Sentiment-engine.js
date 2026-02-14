// ===============================
// HUGGING FACE SENTIMENT ENGINE
// Model: cardiffnlp/twitter-roberta-base-sentiment-latest
// ===============================

// If Node < 18 uncomment below:
// import fetch from "node-fetch";

import "dotenv/config";

// Hugging Face Router API (NEW ENDPOINT)
const API_URL =
  "https://router.huggingface.co/hf-inference/models/cardiffnlp/twitter-roberta-base-sentiment-latest";

const API_TOKEN = process.env.HF_TOKEN;

// Fake Tweets (Hackathon Demo Data)
const tweets = [
  "Bitcoin is bullish 🚀",
  "Huge crypto crash incoming",
  "ETH looking amazing today",
  "Market very bearish now",
  "I think BTC will moon soon 🚀"
];

// Label Mapping for this model
const labelMap = {
  LABEL_0: "Negative",
  LABEL_1: "Neutral",
  LABEL_2: "Positive",
};

// ===============================
// Call Hugging Face API (Batch Mode)
// ===============================
async function analyzeTweets(tweetsArray) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: tweetsArray,
    }),
  });

  const result = await response.json();
  return result;
}

// ===============================
// Main Sentiment Engine
// ===============================
async function runSentimentEngine() {
  console.log("\n===== CRYPTO SENTIMENT DASHBOARD =====\n");

  const analysisResults = await analyzeTweets(tweets);

  let totalScore = 0;

  analysisResults.forEach((analysis, index) => {
    // Pick highest confidence label
    const best = analysis.reduce((max, item) =>
      item.score > max.score ? item : max
    );

    const sentiment = labelMap[best.label];
    const confidence = (best.score * 100).toFixed(2);

    totalScore += parseFloat(confidence);

    console.log(`Tweet ${index + 1}: ${tweets[index]}`);
    console.log(`Sentiment: ${sentiment}`);
    console.log(`Confidence: ${confidence}%`);
    console.log("----------------------------------");
  });

  // ===============================
  // Market Mood Score (Hackathon Feature)
  // ===============================
  const marketMood = (totalScore / tweets.length).toFixed(2);

  console.log("\n🔥 Overall Market Mood Score:", marketMood + "%");

  if (marketMood > 65) {
    console.log("Market Trend: BULLISH 🚀");
  } else if (marketMood < 35) {
    console.log("Market Trend: BEARISH 📉");
  } else {
    console.log("Market Trend: NEUTRAL ⚖️");
  }

  console.log("\n======================================\n");
}

runSentimentEngine();

