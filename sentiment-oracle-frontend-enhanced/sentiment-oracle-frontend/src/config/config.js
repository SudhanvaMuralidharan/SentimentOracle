/**
 * Configuration for Sentiment Oracle Frontend
 * 
 * IMPORTANT: Update these values for your deployment
 */

// Contract configuration
export const CONTRACT_CONFIG = {
  // Replace with your deployed SentimentOracle contract address
  ADDRESS: "0x0000000000000000000000000000000000000000", // UPDATE THIS!
  
  // Network configuration
  CHAIN_ID: 80001, // Polygon Mumbai testnet (change for mainnet)
  CHAIN_NAME: "Polygon Mumbai",
  RPC_URL: "https://rpc-mumbai.maticvigil.com",
  
  // Block explorer
  EXPLORER_URL: "https://mumbai.polygonscan.com",
};

// Supported cryptocurrencies
export const CRYPTOCURRENCIES = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    color: "#F7931A",
    icon: "₿",
  },
  {
    id: "ethereum", 
    name: "Ethereum",
    symbol: "ETH",
    color: "#627EEA",
    icon: "Ξ",
  },
  {
    id: "solana",
    name: "Solana",
    symbol: "SOL", 
    color: "#14F195",
    icon: "◎",
  },
];

// Sentiment thresholds
export const SENTIMENT_THRESHOLDS = {
  EXTREME_NEGATIVE: 30,  // Below this = extreme bearish
  NEGATIVE: 45,          // Below this = bearish
  NEUTRAL_LOW: 45,       // Neutral range start
  NEUTRAL_HIGH: 55,      // Neutral range end
  POSITIVE: 55,          // Above this = bullish
  EXTREME_POSITIVE: 70,  // Above this = extreme bullish
};

// Alert configuration
export const ALERT_CONFIG = {
  SHOW_EXTREME_ALERTS: true,
  AUTO_REFRESH_INTERVAL: 30000, // 30 seconds (in milliseconds)
  ENABLE_NOTIFICATIONS: true,
};

// Contract ABI - Only the functions we need
export const CONTRACT_ABI = [
  // Read function: getSentiment
  {
    inputs: [{ name: "_crypto", type: "string" }],
    name: "getSentiment",
    outputs: [
      {
        components: [
          { name: "vibeScore", type: "int256" },
          { name: "confidence", type: "uint256" },
          { name: "sampleSize", type: "uint256" },
          { name: "timestamp", type: "uint256" },
          { name: "updater", type: "address" },
        ],
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  
  // Write function: updateSentiment (for "Analyze" button)
  {
    inputs: [
      { name: "_crypto", type: "string" },
      { name: "_vibeScore", type: "int256" },
      { name: "_confidence", type: "uint256" },
      { name: "_sampleSize", type: "uint256" },
    ],
    name: "updateSentiment",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  
  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "cryptocurrency", type: "string" },
      { indexed: false, name: "vibeScore", type: "int256" },
      { indexed: false, name: "confidence", type: "uint256" },
      { indexed: false, name: "sampleSize", type: "uint256" },
      { indexed: false, name: "timestamp", type: "uint256" },
    ],
    name: "SentimentUpdated",
    type: "event",
  },
];

// Helper function to convert sentiment from contract format (-1000 to 1000) to display format (0-100)
export const convertSentimentToDisplay = (vibeScore) => {
  // vibeScore comes from contract as -1000 to 1000
  // Convert to 0-100 scale
  return Math.round(((vibeScore / 1000 + 1) / 2) * 100);
};

// Helper function to convert display format (0-100) to contract format (-1000 to 1000)
export const convertSentimentToContract = (displayScore) => {
  // displayScore is 0-100
  // Convert to -1000 to 1000 scale
  return Math.round(((displayScore / 100) * 2 - 1) * 1000);
};

// Helper function to get sentiment label
export const getSentimentLabel = (score) => {
  if (score < SENTIMENT_THRESHOLDS.EXTREME_NEGATIVE) return "Extreme Bearish";
  if (score < SENTIMENT_THRESHOLDS.NEGATIVE) return "Bearish";
  if (score < SENTIMENT_THRESHOLDS.NEUTRAL_HIGH) return "Neutral";
  if (score < SENTIMENT_THRESHOLDS.EXTREME_POSITIVE) return "Bullish";
  return "Extreme Bullish";
};

// Helper function to get sentiment color
export const getSentimentColor = (score) => {
  if (score < SENTIMENT_THRESHOLDS.EXTREME_NEGATIVE) return "#DC2626"; // Red
  if (score < SENTIMENT_THRESHOLDS.NEGATIVE) return "#F97316"; // Orange
  if (score < SENTIMENT_THRESHOLDS.NEUTRAL_HIGH) return "#6B7280"; // Gray
  if (score < SENTIMENT_THRESHOLDS.EXTREME_POSITIVE) return "#10B981"; // Green
  return "#059669"; // Dark Green
};
