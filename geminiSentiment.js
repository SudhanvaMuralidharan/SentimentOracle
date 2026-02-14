const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function geminiAnalyze(posts) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
You are a crypto sentiment oracle.
Given these social media posts, output ONLY a single integer between 0 and 100.

0 = extremely bearish sentiment
50 = neutral
100 = extremely bullish sentiment

Posts:
${posts.map((p, i) => `${i + 1}. ${p}`).join("\n")}

Return ONLY the number, nothing else.
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();

  const vibeScore = parseInt(text);

  if (isNaN(vibeScore)) {
    throw new Error("Gemini returned non-numeric response: " + text);
  }

  return Math.max(0, Math.min(100, vibeScore));
}

module.exports = { geminiAnalyze };