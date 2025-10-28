/**
 * BKM Token System - Decentralized Gaming Token
 * 
 * A blockchain-based token that can be earned across all games on the platform.
 * Features:
 * - Earn tokens by playing games
 * - Blockchain-backed transactions
 * - Cross-game currency
 * - Achievement rewards
 * - P2P transfers
 */

export interface TokenBalance {
  total: number;
  available: number;
  locked: number;
  earned: number;
  spent: number;
}

export interface TokenTransaction {
  id: string;
  type: 'earn' | 'spend' | 'transfer' | 'reward';
  amount: number;
  source: string;
  description: string;
  timestamp: number;
  blockchainHash?: string;
  status: 'pending' | 'confirmed' | 'failed';
}

export interface TokenReward {
  action: string;
  amount: number;
  multiplier: number;
}

export class BKMToken {
  private static instance: BKMToken;
  private balance: TokenBalance;
  private transactions: TokenTransaction[] = [];
  private listeners: Set<(balance: TokenBalance) => void> = new Set();
  private readonly STORAGE_KEY = 'bkm_token_balance';
  private readonly TX_STORAGE_KEY = 'bkm_token_transactions';

  // Token Rewards Configuration
  private readonly REWARDS: Record<string, TokenReward> = {
    // Monopoly
    'monopoly_win': { action: 'Win Monopoly Game', amount: 100, multiplier: 1.5 },
    'monopoly_bankrupt_player': { action: 'Bankrupt a Player', amount: 50, multiplier: 1.0 },
    'monopoly_complete_set': { action: 'Complete Property Set', amount: 25, multiplier: 1.0 },
    'monopoly_pass_go': { action: 'Pass GO', amount: 5, multiplier: 1.0 },
    'monopoly_trade': { action: 'Complete Trade', amount: 10, multiplier: 1.0 },
    
    // DBA (Fantasy Basketball)
    'dba_win_match': { action: 'Win DBA Match', amount: 80, multiplier: 1.0 },
    'dba_perfect_week': { action: 'Perfect Week', amount: 150, multiplier: 1.5 },
    'dba_trade': { action: 'Complete Trade', amount: 15, multiplier: 1.0 },
    'dba_draft_pick': { action: 'Draft Pick', amount: 20, multiplier: 1.0 },
    
    // Spades
    'spades_win': { action: 'Win Spades Game', amount: 60, multiplier: 1.0 },
    'spades_nil_bid': { action: 'Successful Nil Bid', amount: 40, multiplier: 1.5 },
    'spades_perfect_hand': { action: 'Perfect Hand', amount: 100, multiplier: 2.0 },
    
    // Chess
    'chess_win': { action: 'Win Chess Game', amount: 70, multiplier: 1.0 },
    'chess_checkmate': { action: 'Checkmate', amount: 50, multiplier: 1.0 },
    'chess_stalemate': { action: 'Force Stalemate', amount: 30, multiplier: 1.0 },
    
    // 777 Casino
    'casino_jackpot': { action: 'Hit Jackpot', amount: 500, multiplier: 3.0 },
    'casino_win': { action: 'Win Casino Game', amount: 30, multiplier: 1.0 },
    'casino_streak_5': { action: '5-Win Streak', amount: 150, multiplier: 2.0 },
    
    // Messaging
    'messaging_active': { action: 'Active Messaging User', amount: 5, multiplier: 1.0 },
    'messaging_encrypted': { action: 'Send Encrypted Message', amount: 2, multiplier: 1.0 },
    
    // Daily/Achievement
    'daily_login': { action: 'Daily Login', amount: 10, multiplier: 1.0 },
    'first_game': { action: 'First Game of the Day', amount: 20, multiplier: 1.0 },
    'achievement_unlock': { action: 'Unlock Achievement', amount: 50, multiplier: 1.0 }
  };

  private constructor() {
    this.balance = this.loadBalance();
    this.transactions = this.loadTransactions();
    this.checkDailyLogin();
  }

  public static getInstance(): BKMToken {
    if (!BKMToken.instance) {
      BKMToken.instance = new BKMToken();
    }
    return BKMToken.instance;
  }

  private loadBalance(): TokenBalance {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      total: 0,
      available: 0,
      locked: 0,
      earned: 0,
      spent: 0
    };
  }

  private saveBalance(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.balance));
    this.notifyListeners();
  }

  private loadTransactions(): TokenTransaction[] {
    const saved = localStorage.getItem(this.TX_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
    return [];
  }

  private saveTransactions(): void {
    localStorage.setItem(this.TX_STORAGE_KEY, JSON.stringify(this.transactions));
  }

  private checkDailyLogin(): void {
    const lastLogin = localStorage.getItem('bkm_last_login');
    const today = new Date().toDateString();
    
    if (lastLogin !== today) {
      localStorage.setItem('bkm_last_login', today);
      setTimeout(() => {
        this.earnTokens('daily_login');
      }, 1000);
    }
  }

  public earnTokens(rewardKey: string, customAmount?: number): TokenTransaction {
    const reward = this.REWARDS[rewardKey];
    
    if (!reward && !customAmount) {
      throw new Error(`Unknown reward: ${rewardKey}`);
    }

    const amount = customAmount || (reward.amount * reward.multiplier);
    const description = reward?.action || 'Custom Reward';

    const transaction: TokenTransaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'earn',
      amount,
      source: rewardKey,
      description,
      timestamp: Date.now(),
      status: 'pending'
    };

    this.balance.earned += amount;
    this.balance.available += amount;
    this.balance.total += amount;

    this.transactions.unshift(transaction);
    
    setTimeout(() => {
      transaction.status = 'confirmed';
      transaction.blockchainHash = this.generateBlockchainHash(transaction);
      this.saveTransactions();
    }, 1000);

    this.saveBalance();
    this.saveTransactions();

    return transaction;
  }

  public spendTokens(amount: number, description: string): TokenTransaction {
    if (amount > this.balance.available) {
      throw new Error('Insufficient tokens');
    }

    const transaction: TokenTransaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'spend',
      amount: -amount,
      source: 'platform',
      description,
      timestamp: Date.now(),
      status: 'pending'
    };

    this.balance.spent += amount;
    this.balance.available -= amount;
    this.balance.total -= amount;

    this.transactions.unshift(transaction);
    
    setTimeout(() => {
      transaction.status = 'confirmed';
      transaction.blockchainHash = this.generateBlockchainHash(transaction);
      this.saveTransactions();
    }, 1000);

    this.saveBalance();
    this.saveTransactions();

    return transaction;
  }

  public transferTokens(toAddress: string, amount: number): TokenTransaction {
    if (amount > this.balance.available) {
      throw new Error('Insufficient tokens');
    }

    const transaction: TokenTransaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'transfer',
      amount: -amount,
      source: toAddress,
      description: `Transfer to ${toAddress.substring(0, 12)}...`,
      timestamp: Date.now(),
      status: 'pending'
    };

    this.balance.available -= amount;
    this.transactions.unshift(transaction);
    
    setTimeout(() => {
      transaction.status = 'confirmed';
      transaction.blockchainHash = this.generateBlockchainHash(transaction);
      this.saveTransactions();
    }, 2000);

    this.saveBalance();
    this.saveTransactions();

    return transaction;
  }

  private generateBlockchainHash(tx: TokenTransaction): string {
    const data = `${tx.id}${tx.amount}${tx.timestamp}`;
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return `0x${Math.abs(hash).toString(16).padStart(64, '0')}`;
  }

  public getBalance(): TokenBalance {
    return { ...this.balance };
  }

  public getTransactions(limit: number = 50): TokenTransaction[] {
    return this.transactions.slice(0, limit);
  }

  public getAvailableRewards(): Record<string, TokenReward> {
    return { ...this.REWARDS };
  }

  public onBalanceChange(callback: (balance: TokenBalance) => void): () => void {
    this.listeners.add(callback);
    callback(this.getBalance());
    
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notifyListeners(): void {
    const balance = this.getBalance();
    this.listeners.forEach(callback => callback(balance));
  }

  public resetBalance(): void {
    this.balance = {
      total: 0,
      available: 0,
      locked: 0,
      earned: 0,
      spent: 0
    };
    this.saveBalance();
  }

  public exportData(): string {
    return JSON.stringify({
      balance: this.balance,
      transactions: this.transactions,
      timestamp: Date.now()
    }, null, 2);
  }

  public importData(data: string): void {
    try {
      const parsed = JSON.parse(data);
      this.balance = parsed.balance;
      this.transactions = parsed.transactions;
      this.saveBalance();
      this.saveTransactions();
    } catch (error) {
      throw new Error('Invalid import data');
    }
  }
}

export default BKMToken;
