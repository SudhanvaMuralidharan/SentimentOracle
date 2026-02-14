// ======================================================
// Hugging Face Sentiment Service
// Model: cardiffnlp/twitter-roberta-base-sentiment-latest
// ======================================================

import "dotenv/config";

// Hugging Face Router API
const API_URL =
  "https://router.huggingface.co/hf-inference/models/cardiffnlp/twitter-roberta-base-sentiment-latest";

const API_TOKEN = process.env.HF_TOKEN;

// ======================================================
// MAIN FUNCTION — RETURNS vibeScore (0–100)
// ======================================================
async function hfAnalyze(posts) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: posts,
    }),
  });

  const data = await response.json();

  // -------------------------------
  // SAFETY CHECK
  // -------------------------------
  if (!Array.isArray(data)) {
    console.error("HF RAW RESPONSE:", data);
    throw new Error("HuggingFace API Error");
  }

  let totalScore = 0;

  // ======================================================
  // SMART SENTIMENT SCORING (FIXED VERSION)
  // ======================================================
  data.forEach((analysis) => {
    const best = analysis.reduce((max, item) =>
      item.score > max.score ? item : max
    );

    const label = best.label.toLowerCase();

    // Supports BOTH:
    // LABEL_0 / LABEL_1 / LABEL_2
    // AND negative / neutral / positive
    if (label.includes("positive") || label === "label_2") {
      totalScore += 100;
    } else if (label.includes("neutral") || label === "label_1") {
      totalScore += 50;
    } else {
      totalScore += 0;
    }
  });

  // Average into 0–100 vibeScore
  const vibeScore = Math.round(totalScore / posts.length);

  return vibeScore;
}

// ======================================================
// EXPORT (ES MODULE)
// ======================================================
export { hfAnalyze };
