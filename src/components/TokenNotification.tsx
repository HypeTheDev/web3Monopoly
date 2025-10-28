import React, { useState, useEffect } from 'react';
import BKMToken, { TokenTransaction } from '../lib/BKMToken';
import './TokenNotification.css';

interface Notification {
  id: string;
  transaction: TokenTransaction;
  timestamp: number;
}

const TokenNotification: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const tokenService = BKMToken.getInstance();

  useEffect(() => {
    let lastTxCount = tokenService.getTransactions(1).length;

    const checkForNewTransactions = setInterval(() => {
      const currentTxs = tokenService.getTransactions(5);
      const currentCount = currentTxs.length;

      if (currentCount > lastTxCount && currentTxs.length > 0) {
        const latestTx = currentTxs[0];
        
        if (latestTx.type === 'earn' || latestTx.type === 'reward') {
          const notification: Notification = {
            id: latestTx.id,
            transaction: latestTx,
            timestamp: Date.now()
          };

          setNotifications(prev => [...prev, notification]);

          setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== notification.id));
          }, 5000);
        }
      }

      lastTxCount = currentCount;
    }, 500);

    return () => clearInterval(checkForNewTransactions);
  }, [tokenService]);

  return (
    <div className="token-notifications">
      {notifications.map((notification) => (
        <div key={notification.id} className="token-notification earn">
          <div className="notification-icon">💎</div>
          <div className="notification-content">
            <div className="notification-title">Tokens Earned!</div>
            <div className="notification-amount">
              +{notification.transaction.amount} BKM
            </div>
            <div className="notification-desc">
              {notification.transaction.description}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TokenNotification;
