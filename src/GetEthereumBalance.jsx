import React, { useState, useEffect } from 'react';
import axios from 'axios';

const apikey = import.meta.env.VITE_ALCHEMY_API_KEY;
const getEthereumBalance = async (walletAddress) => {
  const RPC_URL = `https://eth-mainnet.g.alchemy.com/v2/${apikey}`;
  
  try {
    const response = await axios.post(RPC_URL, {
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_getBalance',
      params: [walletAddress, 'latest'],
    });

    const balanceWei = response.data.result;
    const balanceETH = parseFloat(balanceWei) / 1e18;
    return balanceETH;
  } catch (error) {
    console.error('Error fetching balance:', error);
    throw new Error('Failed to fetch balance');
  }
};

const EthereumBalance = ({ walletAddress }) => {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const balanceETH = await getEthereumBalance(walletAddress);
        setBalance(balanceETH);
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
          <p>{balance} ETH</p>
        </div>
      )}
    </div>
  );
};

export default EthereumBalance;
