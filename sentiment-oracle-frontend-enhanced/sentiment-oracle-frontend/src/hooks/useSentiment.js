/**
 * useSentiment Hook
 * 
 * Fetches and manages sentiment data from the oracle contract
 */

import { useState, useEffect, useCallback } from 'react';
import { convertSentimentToDisplay } from '../config/config';

export const useSentiment = (contract, crypto) => {
  const [sentiment, setSentiment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch sentiment from contract
  const fetchSentiment = useCallback(async () => {
    if (!contract || !crypto) return;

    setLoading(true);
    setError(null);

    try {
      // Call getSentiment function on contract
      const result = await contract.getSentiment(crypto.name);
      
      // Parse the result
      const [vibeScore, confidence, sampleSize, timestamp, updater] = result;
      
      // Convert from contract format to display format
      const displayScore = convertSentimentToDisplay(Number(vibeScore));
      const displayConfidence = Number(confidence) / 10; // Convert from 1000 scale to 100 scale
      
      setSentiment({
        score: displayScore,
        confidence: displayConfidence,
        sampleSize: Number(sampleSize),
        timestamp: Number(timestamp),
        updater: updater,
      });
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching sentiment:', err);
      
      // If no data exists, set default neutral values
      if (err.message.includes('execution reverted')) {
        setSentiment({
          score: 50,
          confidence: 0,
          sampleSize: 0,
          timestamp: 0,
          updater: '0x0000000000000000000000000000000000000000',
        });
      } else {
        setError(err.message);
      }
      
      setLoading(false);
    }
  }, [contract, crypto]);

  // Fetch on mount and when contract/crypto changes
  useEffect(() => {
    fetchSentiment();
  }, [fetchSentiment]);

  return {
    sentiment,
    loading,
    error,
    refetch: fetchSentiment,
  };
};

// Hook to fetch all sentiments for multiple cryptos
export const useAllSentiments = (contract, cryptos) => {
  const [sentiments, setSentiments] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllSentiments = useCallback(async () => {
    if (!contract || !cryptos || cryptos.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      const results = await Promise.all(
        cryptos.map(async (crypto) => {
          try {
            const result = await contract.getSentiment(crypto.name);
            const [vibeScore, confidence, sampleSize, timestamp, updater] = result;
            
            return {
              id: crypto.id,
              sentiment: {
                score: convertSentimentToDisplay(Number(vibeScore)),
                confidence: Number(confidence) / 10,
                sampleSize: Number(sampleSize),
                timestamp: Number(timestamp),
                updater: updater,
              },
            };
          } catch (err) {
            // Return default values if no data
            return {
              id: crypto.id,
              sentiment: {
                score: 50,
                confidence: 0,
                sampleSize: 0,
                timestamp: 0,
                updater: '0x0000000000000000000000000000000000000000',
              },
            };
          }
        })
      );

      // Convert array to object keyed by crypto id
      const sentimentsObj = results.reduce((acc, { id, sentiment }) => {
        acc[id] = sentiment;
        return acc;
      }, {});

      setSentiments(sentimentsObj);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching all sentiments:', err);
      setError(err.message);
      setLoading(false);
    }
  }, [contract, cryptos]);

  useEffect(() => {
    fetchAllSentiments();
  }, [fetchAllSentiments]);

  return {
    sentiments,
    loading,
    error,
    refetch: fetchAllSentiments,
  };
};
