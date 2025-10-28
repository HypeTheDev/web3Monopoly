import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import BKMToken, { TokenBalance } from '../lib/BKMToken';
import './UserHeader.css';

const UserHeader: React.FC = () => {
  const { user, logout } = useUser();
  const [balance, setBalance] = useState<TokenBalance | null>(null);
  const [showWallet, setShowWallet] = useState(false);

  useEffect(() => {
    const tokenService = BKMToken.getInstance();
    const unsubscribe = tokenService.onBalanceChange((newBalance) => {
      setBalance(newBalance);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (!user) return null;

  const formatBalance = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="user-header">
      <div className="user-info">
        <span className="user-label">Logged in as:</span>
        <span className="username">{user.username}</span>
      </div>
      
      {balance && (
        <div 
          className="token-balance-compact"
          onClick={() => setShowWallet(!showWallet)}
          title="BKM Token Balance"
        >
          <span className="token-icon">💎</span>
          <span className="token-amount">{formatBalance(balance.available)}</span>
          <span className="token-label">BKM</span>
        </div>
      )}
      
      <button className="logout-button" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

export default UserHeader;
