# 🚀 React Frontend - Quick Setup Guide

## What You're Getting

A beautiful, production-ready React frontend that displays crypto sentiment from your blockchain oracle.

## Key Files

### 1. **App.jsx** - Main Application
- Shows 3 sentiment cards (Bitcoin, Ethereum, Solana)
- Wallet connection button
- Auto-refresh toggle
- Notification system

### 2. **config.js** - Configuration
- **CONTRACT_ADDRESS** - UPDATE THIS with your deployed contract!
- Contract ABI
- Supported cryptocurrencies
- Sentiment thresholds (when to show alerts)
- Helper functions for score conversion

### 3. **SentimentCard.jsx** - Card Component
- Displays single crypto sentiment
- Shows score (0-100)
- Color-coded based on sentiment
- Alert banner for extreme values
- "Analyze" button to trigger updates
- Metadata: confidence, samples, timestamp

## Setup (3 Steps)

### Step 1: Install Dependencies
```bash
cd sentiment-oracle-frontend
npm install
```

### Step 2: Configure Contract Address
Edit `src/config/config.js`:
```javascript
export const CONTRACT_CONFIG = {
  ADDRESS: "0xYOUR_DEPLOYED_CONTRACT_ADDRESS_HERE", // ← CHANGE THIS!
  CHAIN_ID: 80001, // Polygon Mumbai testnet
  // ...
};
```

### Step 3: Run
```bash
npm run dev
```

Opens at: http://localhost:3000

## How It Works

```
┌─────────────────┐
│  Smart Contract │  ← Stores sentiment data on-chain
└────────┬────────┘
         │
         │ Read via Web3
         │
         ↓
┌─────────────────┐
│   useWeb3 Hook  │  ← Connects to blockchain
└────────┬────────┘
         │
         ↓
┌──────────────────┐
│ useSentiment Hook│  ← Fetches data from contract
└────────┬─────────┘
         │
         ↓
┌─────────────────┐
│    App.jsx      │  ← Manages state
└────────┬────────┘
         │
         ↓
┌──────────────────┐
│ SentimentCard.jsx│  ← Displays data
└──────────────────┘
```

## Key Features

✅ **No Backend Required** - Reads directly from blockchain  
✅ **Wallet Optional** - Works without connecting (read-only)  
✅ **Auto-refresh** - Updates every 30 seconds  
✅ **Extreme Alerts** - Shows warnings for extreme sentiment  
✅ **Responsive** - Works on mobile, tablet, desktop  
✅ **Color-coded** - Visual sentiment indicators  

## Sentiment Scale

| Score | Label | Color |
|-------|-------|-------|
| 0-30 | Extreme Bearish | Red |
| 30-45 | Bearish | Orange |
| 45-55 | Neutral | Gray |
| 55-70 | Bullish | Green |
| 70-100 | Extreme Bullish | Dark Green |

## Important Notes

### This Frontend is DISPLAY ONLY

It does NOT:
- ❌ Calculate sentiment
- ❌ Scrape social media
- ❌ Run NLP analysis
- ❌ Update the contract

It ONLY:
- ✅ Reads data from smart contract
- ✅ Displays sentiment scores
- ✅ Shows alerts
- ✅ Triggers backend analysis (via "Analyze" button)

### The "Analyze" Button

When clicked, it should call your backend API:

```javascript
// In production, replace the demo code with:
const response = await fetch('YOUR_API_URL/api/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ crypto: 'Bitcoin' })
});

// Your backend oracle service will:
// 1. Scrape social media
// 2. Run NLP sentiment analysis
// 3. Update the smart contract
// 4. Frontend auto-refreshes and shows new data
```

## File Structure

```
sentiment-oracle-frontend/
│
├── src/
│   ├── components/
│   │   ├── SentimentCard.jsx    ← Individual crypto card
│   │   └── SentimentCard.css    ← Card styling
│   │
│   ├── config/
│   │   └── config.js            ← CONTRACT ADDRESS HERE!
│   │
│   ├── hooks/
│   │   ├── useWeb3.js           ← Blockchain connection
│   │   └── useSentiment.js      ← Data fetching
│   │
│   ├── App.jsx                  ← Main component
│   ├── App.css                  ← Main styles
│   └── main.jsx                 ← Entry point
│
├── index.html
├── package.json
└── vite.config.js
```

## Customization

### Add More Cryptos

Edit `src/config/config.js`:

```javascript
export const CRYPTOCURRENCIES = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    color: "#F7931A",
    icon: "₿",
  },
  {
    id: "cardano",
    name: "Cardano",
    symbol: "ADA",
    color: "#0033AD",
    icon: "₳",
  },
  // Add more...
];
```

### Change Alert Thresholds

```javascript
export const SENTIMENT_THRESHOLDS = {
  EXTREME_NEGATIVE: 30,  // Show alert below 30
  EXTREME_POSITIVE: 70,  // Show alert above 70
  // Customize as needed
};
```

### Change Colors

Edit `src/App.css` and `src/components/SentimentCard.css`

## Deployment

### Build for Production
```bash
npm run build
# Creates /dist folder
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

## Troubleshooting

**Problem**: Cards all show "50" (neutral)
- **Solution**: Contract not deployed or wrong address in config.js

**Problem**: Wallet won't connect
- **Solution**: Install MetaMask, check network matches CHAIN_ID

**Problem**: Data not updating
- **Solution**: Check contract address, verify blockchain RPC is working

**Problem**: Build errors
- **Solution**: Delete node_modules, run `npm install` again

## Next Steps

1. ✅ Install dependencies (`npm install`)
2. ✅ Update contract address in `config.js`
3. ✅ Run development server (`npm run dev`)
4. ✅ Test with MetaMask
5. ✅ Connect to your backend API
6. ✅ Build for production (`npm run build`)
7. ✅ Deploy to hosting

## Integration with Full System

```
┌──────────────┐
│ React Frontend│ ← THIS PROJECT
└──────┬───────┘
       │
       │ Reads from ↓
       │
┌──────────────────┐
│ Smart Contract   │ ← Deploy this (Solidity)
└──────┬───────────┘
       │
       │ Updated by ↓
       │
┌───────────────────┐
│ Oracle Service    │ ← Backend (Python)
│ - Scrapes social  │
│ - NLP analysis    │
│ - Updates contract│
└───────────────────┘
```

## Commands Cheat Sheet

```bash
npm install           # Install dependencies
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Lint code
npm run format       # Format code
```

## Success Checklist

- [ ] Installed dependencies
- [ ] Updated CONTRACT_CONFIG.ADDRESS
- [ ] App runs at localhost:3000
- [ ] Can see 3 sentiment cards
- [ ] Wallet connects (optional)
- [ ] Data loads from contract
- [ ] Analyze button works
- [ ] Alerts show for extreme sentiment

---

**You're ready to go! 🚀**

This is a complete, production-ready React frontend.  
Just update the contract address and you're live!
