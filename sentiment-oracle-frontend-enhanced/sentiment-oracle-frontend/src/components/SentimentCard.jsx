/**
 * SentimentCard Component
 * 
 * Displays a single cryptocurrency's sentiment score
 * Shows alerts for extreme sentiment
 * Has "Analyze" button to trigger oracle update
 */

import React from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, RefreshCw } from 'lucide-react';
import { 
  getSentimentLabel, 
  getSentimentColor,
  SENTIMENT_THRESHOLDS 
} from '../config/config';
import './SentimentCard.css';

const SentimentCard = ({ 
  crypto, 
  sentiment, 
  loading, 
  onAnalyze 
}) => {
  const { name, symbol, color, icon } = crypto;
  const score = sentiment?.score ?? 50; // Default to neutral if no data
  const confidence = sentiment?.confidence ?? 0;
  const lastUpdate = sentiment?.timestamp;
  const sampleSize = sentiment?.sampleSize ?? 0;
  
  const sentimentLabel = getSentimentLabel(score);
  const sentimentColor = getSentimentColor(score);
  
  // Determine if we should show an alert
  const isExtremePositive = score >= SENTIMENT_THRESHOLDS.EXTREME_POSITIVE;
  const isExtremeNegative = score <= SENTIMENT_THRESHOLDS.EXTREME_NEGATIVE;
  const showAlert = isExtremePositive || isExtremeNegative;
  
  // Format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp * 1000); // Convert from seconds to milliseconds
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="sentiment-card" style={{ borderTopColor: color }}>
      {/* Header */}
      <div className="card-header">
        <div className="crypto-info">
          <span className="crypto-icon" style={{ color: color }}>
            {icon}
          </span>
          <div>
            <h3 className="crypto-name">{name}</h3>
            <span className="crypto-symbol">{symbol}</span>
          </div>
        </div>
      </div>
      
      {/* Sentiment Score */}
      <div className="sentiment-score">
        <div className="score-display">
          <div 
            className="score-number" 
            style={{ color: sentimentColor }}
          >
            {score}
          </div>
          <div className="score-label" style={{ color: sentimentColor }}>
            {sentimentLabel}
          </div>
        </div>
        
        {/* Visual Bar */}
        <div className="score-bar">
          <div 
            className="score-fill" 
            style={{ 
              width: `${score}%`,
              backgroundColor: sentimentColor 
            }}
          />
        </div>
      </div>
      
      {/* Alert Banner */}
      {showAlert && (
        <div className={`alert ${isExtremePositive ? 'alert-positive' : 'alert-negative'}`}>
          <AlertTriangle size={16} />
          <span>
            {isExtremePositive 
              ? '⚠️ Extreme Bullish Sentiment - Consider profit taking'
              : '⚠️ Extreme Bearish Sentiment - High risk of further decline'
            }
          </span>
        </div>
      )}
      
      {/* Metadata */}
      <div className="card-metadata">
        <div className="metadata-item">
          <span className="metadata-label">Confidence:</span>
          <span className="metadata-value">{confidence}%</span>
        </div>
        <div className="metadata-item">
          <span className="metadata-label">Samples:</span>
          <span className="metadata-value">{sampleSize.toLocaleString()}</span>
        </div>
        <div className="metadata-item">
          <span className="metadata-label">Updated:</span>
          <span className="metadata-value">{formatTimestamp(lastUpdate)}</span>
        </div>
      </div>
      
      {/* Sentiment Trend Indicator */}
      <div className="trend-indicator">
        {score > 50 ? (
          <TrendingUp size={20} style={{ color: sentimentColor }} />
        ) : (
          <TrendingDown size={20} style={{ color: sentimentColor }} />
        )}
        <span style={{ color: sentimentColor }}>
          {score > 50 ? 'Bullish Trend' : 'Bearish Trend'}
        </span>
      </div>
      
      {/* Analyze Button */}
      <button 
        className="analyze-button"
        onClick={() => onAnalyze(crypto)}
        disabled={loading}
        style={{ borderColor: color }}
      >
        {loading ? (
          <>
            <RefreshCw size={16} className="spinning" />
            <span>Analyzing...</span>
          </>
        ) : (
          <>
            <RefreshCw size={16} />
            <span>Analyze Now</span>
          </>
        )}
      </button>
    </div>
  );
};

export default SentimentCard;
