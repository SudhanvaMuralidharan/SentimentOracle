import { ethers } from "ethers";
import "dotenv/config";

async function pushToChain(score) {
  console.log("Pushing to blockchain:", score);

  // Your real blockchain logic goes here
  // For hackathon demo returning fake hash
  return "0xFAKE_TX_HASH";
}

export { pushToChain };
