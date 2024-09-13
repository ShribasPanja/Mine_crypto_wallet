import React, { useState, useEffect } from 'react';
import axios from 'axios';

const apikey = import.meta.env.VITE_ALCHEMY_API_KEY;
const getSolanaBalance = async (walletAddress) => {
  const RPC_URL = `https://solana-mainnet.g.alchemy.com/v2/${apikey}`;
  
  try {
    const response = await axios.post(RPC_URL, {
      jsonrpc: '2.0',
      id: 1,
      method: 'getBalance',
      params: [walletAddress],
    });

    const balanceLamports = response.data.result.value;
    const balanceSOL = balanceLamports / 1e9;
    return balanceSOL;
  } catch (error) {
    console.error('Error fetching balance:', error);
    throw new Error('Failed to fetch balance');
  }
};
const SolanaBalance = ({ walletAddress }) => {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const balanceSOL = await getSolanaBalance(walletAddress);
        setBalance(balanceSOL);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [walletAddress]);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && balance !== null && (
        <div>
          <p>{balance} SOL</p>
        </div>
      )}
    </div>
  );
};

export default SolanaBalance;
