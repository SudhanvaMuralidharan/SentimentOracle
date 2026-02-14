/**
 * Main App Component
 * 
 * Displays sentiment cards for Bitcoin, Ethereum, and Solana
 * Manages Web3 connection and oracle interactions
 */

import React, { useState, useEffect } from 'react';
import { Wallet, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import SentimentCard from './components/SentimentCard';
import { useWeb3 } from './hooks/useWeb3';
import { useAllSentiments } from './hooks/useSentiment';
import { 
  CRYPTOCURRENCIES, 
  ALERT_CONFIG,
  CONTRACT_CONFIG 
} from './config/config';
import './App.css';

function App() {
  const {
    contract,
    account,
    isConnecting,
    error: web3Error,
    connectWallet,
    disconnectWallet,
    isConnected,
    isCorrectNetwork,
  } = useWeb3();

  const {
    sentiments,
    loading: sentimentsLoading,
    error: sentimentError,
    refetch: refetchSentiments,
  } = useAllSentiments(contract, CRYPTOCURRENCIES);

  const [analyzingCrypto, setAnalyzingCrypto] = useState(null);
  const [notification, setNotification] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Auto-refresh sentiments
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      refetchSentiments();
    }, ALERT_CONFIG.AUTO_REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [autoRefresh, refetchSentiments]);

  // Show notification
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // Handle analyze button click
  const handleAnalyze = async (crypto) => {
    // Note: In production, this would trigger the backend oracle service
    // For demo purposes, we'll just show a message
    
    setAnalyzingCrypto(crypto.id);
    showNotification(
      `Analysis triggered for ${crypto.name}. Oracle service will update the sentiment shortly.`,
      'info'
    );

    // Simulate analysis time
    setTimeout(() => {
      setAnalyzingCrypto(null);
      refetchSentiments();
      showNotification(
        `${crypto.name} sentiment analysis complete!`,
        'success'
      );
    }, 3000);

    // In production, you would call your backend API here:
    // try {
    //   const response = await fetch('/api/analyze', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ crypto: crypto.name })
    //   });
    //   const data = await response.json();
    //   // Handle response...
    // } catch (err) {
    //   showNotification(`Error analyzing ${crypto.name}: ${err.message}`, 'error');
    // }
  };

  // Format account address
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div className="app">
      {/* Animated background pattern */}
      <div className="background-pattern">
        {/* Particle stars */}
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>
      
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo">🔮</div>
            <div>
              <h1 className="app-title">Sentiment Oracle</h1>
              <p className="app-subtitle">Real-time crypto sentiment analysis</p>
            </div>
          </div>

          <div className="header-actions">
            {/* Auto-refresh toggle */}
            <button
              className="refresh-button"
              onClick={() => setAutoRefresh(!autoRefresh)}
              title={autoRefresh ? 'Disable auto-refresh' : 'Enable auto-refresh'}
            >
              <RefreshCw size={16} className={autoRefresh ? 'spinning' : ''} />
              {autoRefresh ? 'Auto' : 'Manual'}
            </button>

            {/* Wallet connection */}
            {isConnected ? (
              <button className="wallet-button connected" onClick={disconnectWallet}>
                <Wallet size={16} />
                <span>{formatAddress(account)}</span>
              </button>
            ) : (
              <button 
                className="wallet-button" 
                onClick={connectWallet}
                disabled={isConnecting}
              >
                <Wallet size={16} />
                <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Network warning */}
        {isConnected && !isCorrectNetwork && (
          <div className="network-warning">
            <AlertCircle size={16} />
            <span>Please switch to {CONTRACT_CONFIG.CHAIN_NAME}</span>
          </div>
        )}

        {/* Contract info */}
        <div className="contract-info">
          <span className="info-label">Oracle Contract:</span>
          <a 
            href={`${CONTRACT_CONFIG.EXPLORER_URL}/address/${CONTRACT_CONFIG.ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            className="contract-address"
          >
            {formatAddress(CONTRACT_CONFIG.ADDRESS)}
          </a>
        </div>
      </header>

      {/* Notification */}
      {notification && (
        <div className={`notification notification-${notification.type}`}>
          {notification.type === 'success' ? (
            <CheckCircle size={16} />
          ) : notification.type === 'error' ? (
            <AlertCircle size={16} />
          ) : (
            <AlertCircle size={16} />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Error display */}
      {(web3Error || sentimentError) && (
        <div className="error-banner">
          <AlertCircle size={20} />
          <div>
            <div className="error-title">Connection Error</div>
            <div className="error-message">{web3Error || sentimentError}</div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="app-main">
        <div className="cards-container">
          {CRYPTOCURRENCIES.map((crypto) => (
            <SentimentCard
              key={crypto.id}
              crypto={crypto}
              sentiment={sentiments[crypto.id]}
              loading={
                sentimentsLoading || analyzingCrypto === crypto.id
              }
              onAnalyze={handleAnalyze}
            />
          ))}
        </div>

        {/* Info section */}
        <div className="info-section">
          <h3>How It Works</h3>
          <ol>
            <li>
              <strong>View Sentiment:</strong> Each card displays the current sentiment score (0-100)
              read from the blockchain oracle
            </li>
            <li>
              <strong>Analyze:</strong> Click "Analyze Now" to trigger the oracle service to fetch
              fresh sentiment data from social media and update the smart contract
            </li>
            <li>
              <strong>Alerts:</strong> Extreme sentiment levels trigger automatic alerts to help
              you make informed trading decisions
            </li>
          </ol>
          
          <div className="sentiment-guide">
            <h4>Sentiment Scale:</h4>
            <ul>
              <li><span className="badge badge-extreme-negative">0-30</span> Extreme Bearish</li>
              <li><span className="badge badge-negative">30-45</span> Bearish</li>
              <li><span className="badge badge-neutral">45-55</span> Neutral</li>
              <li><span className="badge badge-positive">55-70</span> Bullish</li>
              <li><span className="badge badge-extreme-positive">70-100</span> Extreme Bullish</li>
            </ul>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>
          Powered by <strong>Tokenized Sentiment Oracle</strong>
        </p>
        <p className="disclaimer">
          ⚠️ This is a demo. Sentiment scores are for informational purposes only.
          Not financial advice.
        </p>
      </footer>
    </div>
  );
}

export default App;
