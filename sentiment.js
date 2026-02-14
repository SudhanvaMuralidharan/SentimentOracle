const Sentiment = require("sentiment");
const sentiment = new Sentiment();

function analyzeText(textArray) {
  let totalScore = 0;

  textArray.forEach((text) => {
    const result = sentiment.analyze(text);
    totalScore += result.score;
  });

  // Normalize into 0–100 vibe score
  let vibeScore = Math.round(((totalScore + 50) / 100) * 100);

  // clamp
  if (vibeScore > 100) vibeScore = 100;
  if (vibeScore < 0) vibeScore = 0;

  return vibeScore;
}

module.exports = { analyzeText };