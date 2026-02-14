const { ethers } = require("ethers");
require("dotenv").config();

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const RPC_URL = process.env.RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

// Minimal ABI (only the function we call)
const ABI = [
  "function updateVibeScore(uint256 score) public",
];

async function pushScoreOnChain(score) {
  console.log("Pushing to blockchain:", score);
  // return fake tx hash for demo
  return "0xFAKE_TX_HASH";
}

module.exports = { pushScoreOnChain };

module.exports = { pushScoreOnChain };