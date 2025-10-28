import React, { useState, useEffect } from 'react';
import BKMToken, { TokenBalance, TokenTransaction } from '../lib/BKMToken';
import './TokenWallet.css';

interface TokenWalletProps {
  compact?: boolean;
}

const TokenWallet: React.FC<TokenWalletProps> = ({ compact = false }) => {
  const [balance, setBalance] = useState<TokenBalance | null>(null);
  const [transactions, setTransactions] = useState<TokenTransaction[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [transferAddress, setTransferAddress] = useState('');
  const [transferAmount, setTransferAmount] = useState('');

  const tokenService = BKMToken.getInstance();

  useEffect(() => {
    const unsubscribe = tokenService.onBalanceChange((newBalance) => {
      setBalance(newBalance);
    });

    setTransactions(tokenService.getTransactions(20));

    return () => {
      unsubscribe();
    };
  }, [tokenService]);

  const handleTransfer = () => {
    if (!transferAddress || !transferAmount) return;
    
    try {
      const amount = parseFloat(transferAmount);
      tokenService.transferTokens(transferAddress, amount);
      setTransferAddress('');
      setTransferAmount('');
      setShowTransfer(false);
      setTransactions(tokenService.getTransactions(20));
    } catch (error: any) {
      alert(error.message);
    }
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatTimestamp = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString();
  };

  if (!balance) {
    return <div className="token-wallet loading">Loading wallet...</div>;
  }

  if (compact) {
    return (
      <div className="token-wallet-compact" onClick={() => setShowHistory(!showHistory)}>
        <div className="wallet-icon">💎</div>
        <div className="wallet-balance">
          <span className="balance-label">BKM</span>
          <span className="balance-amount">{formatNumber(balance.available)}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="token-wallet">
      <div className="wallet-header">
        <h3>💎 BKM Token Wallet</h3>
        <div className="wallet-controls">
          <button
            className="wallet-btn"
            onClick={() => setShowHistory(!showHistory)}
          >
            {showHistory ? 'Hide' : 'History'}
          </button>
          <button
            className="wallet-btn"
            onClick={() => setShowTransfer(!showTransfer)}
          >
            Transfer
          </button>
        </div>
      </div>

      <div className="balance-display">
        <div className="balance-main">
          <div className="balance-label">Available Balance</div>
          <div className="balance-value">{formatNumber(balance.available)} BKM</div>
        </div>
        
        <div className="balance-stats">
          <div className="stat">
            <span className="stat-label">Total Earned</span>
            <span className="stat-value text-green">{formatNumber(balance.earned)}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Total Spent</span>
            <span className="stat-value text-pink">{formatNumber(balance.spent)}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Locked</span>
            <span className="stat-value text-yellow">{formatNumber(balance.locked)}</span>
          </div>
        </div>
      </div>

      {showTransfer && (
        <div className="transfer-panel">
          <h4>Transfer BKM Tokens</h4>
          <div className="transfer-form">
            <input
              type="text"
              className="transfer-input"
              placeholder="Recipient Address (0x...)"
              value={transferAddress}
              onChange={(e) => setTransferAddress(e.target.value)}
            />
            <input
              type="number"
              className="transfer-input"
              placeholder="Amount"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              min="1"
              max={balance.available}
            />
            <div className="transfer-actions">
              <button className="btn btn-success" onClick={handleTransfer}>
                Send
              </button>
              <button className="btn" onClick={() => setShowTransfer(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showHistory && (
        <div className="transaction-history">
          <h4>Transaction History</h4>
          <div className="transactions-list">
            {transactions.length === 0 ? (
              <div className="no-transactions">No transactions yet</div>
            ) : (
              transactions.map((tx) => (
                <div key={tx.id} className={`transaction-item ${tx.type}`}>
                  <div className="tx-header">
                    <span className={`tx-type ${tx.type}`}>
                      {tx.type === 'earn' && '⬆ EARN'}
                      {tx.type === 'spend' && '⬇ SPEND'}
                      {tx.type === 'transfer' && '➡ TRANSFER'}
                      {tx.type === 'reward' && '🎁 REWARD'}
                    </span>
                    <span className={`tx-amount ${tx.amount > 0 ? 'positive' : 'negative'}`}>
                      {tx.amount > 0 ? '+' : ''}{formatNumber(tx.amount)} BKM
                    </span>
                  </div>
                  <div className="tx-description">{tx.description}</div>
                  <div className="tx-footer">
                    <span className="tx-time">{formatTimestamp(tx.timestamp)}</span>
                    <span className={`tx-status ${tx.status}`}>
                      {tx.status === 'confirmed' && '✓ Confirmed'}
                      {tx.status === 'pending' && '⏳ Pending'}
                      {tx.status === 'failed' && '✗ Failed'}
                    </span>
                  </div>
                  {tx.blockchainHash && (
                    <div className="tx-hash" title={tx.blockchainHash}>
                      {tx.blockchainHash.substring(0, 20)}...
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TokenWallet;
