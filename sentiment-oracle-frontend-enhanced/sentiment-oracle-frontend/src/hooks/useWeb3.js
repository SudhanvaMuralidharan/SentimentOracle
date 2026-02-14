/**
 * useWeb3 Hook
 * 
 * Manages Web3 connection and wallet state
 */

import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_CONFIG, CONTRACT_ABI } from '../config/config';

export const useWeb3 = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  // Initialize provider (read-only)
  useEffect(() => {
    const initProvider = async () => {
      try {
        // Try to use injected provider (MetaMask, etc.)
        if (window.ethereum) {
          const web3Provider = new ethers.BrowserProvider(window.ethereum);
          setProvider(web3Provider);
          
          // Create read-only contract instance
          const readOnlyContract = new ethers.Contract(
            CONTRACT_CONFIG.ADDRESS,
            CONTRACT_ABI,
            web3Provider
          );
          setContract(readOnlyContract);
        } else {
          // Fallback to RPC provider (read-only)
          const rpcProvider = new ethers.JsonRpcProvider(CONTRACT_CONFIG.RPC_URL);
          setProvider(rpcProvider);
          
          const readOnlyContract = new ethers.Contract(
            CONTRACT_CONFIG.ADDRESS,
            CONTRACT_ABI,
            rpcProvider
          );
          setContract(readOnlyContract);
        }
      } catch (err) {
        console.error('Error initializing provider:', err);
        setError(err.message);
      }
    };

    initProvider();
  }, []);

  // Connect wallet
  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      setError('Please install MetaMask or another Web3 wallet');
      return false;
    }

    setIsConnecting(true);
    setError(null);

    try {
      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      const web3Signer = await web3Provider.getSigner();
      const network = await web3Provider.getNetwork();
      
      setAccount(accounts[0]);
      setSigner(web3Signer);
      setChainId(Number(network.chainId));
      
      // Create contract instance with signer (for transactions)
      const contractWithSigner = new ethers.Contract(
        CONTRACT_CONFIG.ADDRESS,
        CONTRACT_ABI,
        web3Signer
      );
      setContract(contractWithSigner);
      
      // Check if on correct network
      if (Number(network.chainId) !== CONTRACT_CONFIG.CHAIN_ID) {
        setError(`Please switch to ${CONTRACT_CONFIG.CHAIN_NAME}`);
      }
      
      setIsConnecting(false);
      return true;
    } catch (err) {
      console.error('Error connecting wallet:', err);
      setError(err.message);
      setIsConnecting(false);
      return false;
    }
  }, []);

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    setAccount(null);
    setSigner(null);
    setChainId(null);
    
    // Reinitialize read-only contract
    if (provider) {
      const readOnlyContract = new ethers.Contract(
        CONTRACT_CONFIG.ADDRESS,
        CONTRACT_ABI,
        provider
      );
      setContract(readOnlyContract);
    }
  }, [provider]);

  // Listen for account changes
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else if (accounts[0] !== account) {
        connectWallet();
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, [account, connectWallet, disconnectWallet]);

  return {
    provider,
    signer,
    contract,
    account,
    chainId,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
    isConnected: !!account,
    isCorrectNetwork: chainId === CONTRACT_CONFIG.CHAIN_ID,
  };
};
