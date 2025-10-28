# BKM Token System Documentation

## Overview
The BKM Token is the native cryptocurrency/points system for the BKM Terminal platform. Players earn tokens by playing games, completing achievements, and engaging with the platform.

## Features

### 💎 Token Earning
- Earn tokens across all games
- Blockchain-backed transactions
- Real-time balance updates
- Transaction history
- Achievement rewards

### 🎮 Game Integration
Tokens can be earned from:
- **Monopoly** - Win games, bankrupt players, complete property sets
- **DBA** - Win matches, perfect weeks, successful trades
- **Spades** - Win games, nil bids, perfect hands
- **Chess** - Checkmates, wins, strategic plays
- **777 Casino** - Jackpots, win streaks
- **Messaging** - Active usage, encrypted messages

### 🏆 Token Rewards

#### Monopoly
- `monopoly_win` - 100 BKM (1.5x multiplier) = **150 BKM**
- `monopoly_bankrupt_player` - 50 BKM
- `monopoly_complete_set` - 25 BKM
- `monopoly_pass_go` - 5 BKM
- `monopoly_trade` - 10 BKM

#### DBA (Fantasy Basketball)
- `dba_win_match` - 80 BKM
- `dba_perfect_week` - 150 BKM (1.5x) = **225 BKM**
- `dba_trade` - 15 BKM
- `dba_draft_pick` - 20 BKM

#### Spades
- `spades_win` - 60 BKM
- `spades_nil_bid` - 40 BKM (1.5x) = **60 BKM**
- `spades_perfect_hand` - 100 BKM (2x) = **200 BKM**

#### Chess
- `chess_win` - 70 BKM
- `chess_checkmate` - 50 BKM
- `chess_stalemate` - 30 BKM

#### 777 Casino
- `casino_jackpot` - 500 BKM (3x) = **1,500 BKM**
- `casino_win` - 30 BKM
- `casino_streak_5` - 150 BKM (2x) = **300 BKM**

#### Messaging & Platform
- `messaging_active` - 5 BKM
- `messaging_encrypted` - 2 BKM
- `daily_login` - 10 BKM
- `first_game` - 20 BKM
- `achievement_unlock` - 50 BKM

## Implementation

### 1. Token Service (BKMToken.ts)
```typescript
import BKMToken from './lib/BKMToken';

const tokenService = BKMToken.getInstance();

// Earn tokens
tokenService.earnTokens('monopoly_win');

// Check balance
const balance = tokenService.getBalance();
console.log(balance.available); // Available tokens

// Listen to balance changes
const unsubscribe = tokenService.onBalanceChange((balance) => {
  console.log('New balance:', balance.available);
});
```

### 2. Integrating Tokens into Games

#### Example: Monopoly
```typescript
import BKMToken from './lib/BKMToken';

class MonopolyEngine {
  private tokenService = BKMToken.getInstance();
  
  handlePlayerWin(player: Player) {
    // Award tokens for winning
    this.tokenService.earnTokens('monopoly_win');
  }
  
  handlePassGo(player: Player) {
    // Award tokens for passing GO
    this.tokenService.earnTokens('monopoly_pass_go');
  }
  
  handleBankruptcy(bankruptPlayer: Player, winner: Player) {
    // Award tokens for bankrupting another player
    this.tokenService.earnTokens('monopoly_bankrupt_player');
  }
  
  handlePropertySetComplete(player: Player) {
    // Award tokens for completing a property set
    this.tokenService.earnTokens('monopoly_complete_set');
  }
}
```

### 3. Components

#### TokenWallet Component
```typescript
import TokenWallet from './components/TokenWallet';

// Full wallet (in sidebar or modal)
<TokenWallet />

// Compact version (in header)
<TokenWallet compact={true} />
```

#### TokenNotification Component
```typescript
import TokenNotification from './components/TokenNotification';

// Add to App.tsx for platform-wide notifications
<TokenNotification />
```

## Token Balance Structure

```typescript
interface TokenBalance {
  total: number;       // Lifetime total tokens
  available: number;   // Spendable tokens
  locked: number;      // Tokens locked in games/bets
  earned: number;      // Total earned
  spent: number;       // Total spent
}
```

## Transaction Types

### Earn
```typescript
{
  type: 'earn',
  amount: 100,
  source: 'monopoly_win',
  description: 'Win Monopoly Game',
  status: 'confirmed',
  blockchainHash: '0x...'
}
```

### Spend
```typescript
{
  type: 'spend',
  amount: -50,
  source: 'platform',
  description: 'Casino Bet',
  status: 'confirmed'
}
```

### Transfer
```typescript
{
  type: 'transfer',
  amount: -25,
  source: '0x123...',
  description: 'Transfer to 0x123...',
  status: 'pending'
}
```

## Blockchain Integration

### Transaction Hashing
All transactions receive a blockchain-style hash for verification:
```typescript
transaction.blockchainHash = "0x..." // 64-character hex
```

### Transaction Status
- `pending` - Transaction initiated
- `confirmed` - Transaction confirmed (1-2 seconds)
- `failed` - Transaction failed

## User Interface

### Token Display Locations
1. **UserHeader** - Compact balance display (top of page)
2. **HomePage** - Token wallet panel
3. **GamePages** - Earnings notifications
4. **Wallet Modal** - Full transaction history

### Visual Feedback
- **Earn tokens** - Green notification with glow effect
- **Spend tokens** - Pink/red indicator
- **Balance update** - Animated counter
- **Transaction** - Slide-in notification (5s duration)

## Storage

### LocalStorage Keys
- `bkm_token_balance` - User balance data
- `bkm_token_transactions` - Transaction history
- `bkm_last_login` - Daily login tracking

### Data Persistence
- Balances persist across sessions
- Transaction history limited to last 50 transactions
- Export/import functionality for backup

## Future Enhancements

### Planned Features
- [ ] Token staking for passive income
- [ ] NFT marketplace (buy/sell with BKM)
- [ ] Tournament entry fees (BKM tokens)
- [ ] Premium features unlock
- [ ] Multiplayer betting/wagering
- [ ] Season passes with token rewards
- [ ] Referral rewards
- [ ] Achievement multipliers

### Blockchain Integration
- [ ] True blockchain deployment (Ethereum/Polygon)
- [ ] Smart contract for token logic
- [ ] DEX listing
- [ ] Liquidity pools
- [ ] Cross-chain bridges

### Social Features
- [ ] Token leaderboard
- [ ] P2P token transfers
- [ ] Gift tokens to friends
- [ ] Token-gated content
- [ ] Community voting with tokens

## API Reference

### BKMToken Methods

```typescript
// Singleton instance
const token = BKMToken.getInstance();

// Earn tokens
token.earnTokens(rewardKey: string, customAmount?: number): TokenTransaction

// Spend tokens
token.spendTokens(amount: number, description: string): TokenTransaction

// Transfer tokens
token.transferTokens(toAddress: string, amount: number): TokenTransaction

// Get balance
token.getBalance(): TokenBalance

// Get transactions
token.getTransactions(limit: number = 50): TokenTransaction[]

// Listen to balance changes
token.onBalanceChange(callback: (balance: TokenBalance) => void): () => void

// Get available rewards
token.getAvailableRewards(): Record<string, TokenReward>

// Reset balance (admin/dev only)
token.resetBalance(): void

// Export data (backup)
token.exportData(): string

// Import data (restore)
token.importData(data: string): void
```

## Best Practices

### Game Integration
1. **Award tokens immediately** after achievement
2. **Show notification** for user feedback
3. **Update UI** reactively (use onBalanceChange)
4. **Log all awards** for debugging

### Performance
1. **Debounce rapid awards** (e.g., passing GO repeatedly)
2. **Batch transactions** when possible
3. **Limit transaction history** display
4. **Use compact wallet** in headers

### User Experience
1. **Clear visual feedback** on token earn
2. **Accessible balance** display at all times
3. **Transaction history** easily viewable
4. **Export/backup** options available

## Testing

### Manual Testing
```typescript
// Award test tokens
const token = BKMToken.getInstance();

// Test earning
token.earnTokens('monopoly_win');
token.earnTokens('daily_login');

// Test spending
token.spendTokens(50, 'Test purchase');

// Test transfer
token.transferTokens('0xtest123', 25);

// Check balance
console.log(token.getBalance());

// View transactions
console.log(token.getTransactions());
```

### Reset for Testing
```typescript
// Clear all data
BKMToken.getInstance().resetBalance();
localStorage.clear();
```

## Support & Troubleshooting

### Common Issues

**Tokens not appearing**
- Check browser console for errors
- Verify localStorage is enabled
- Ensure TokenNotification component is mounted

**Balance not updating**
- Check if using onBalanceChange subscription
- Verify component re-renders on balance change
- Check React DevTools for state updates

**Transactions missing**
- Transactions are limited to last 50
- Export data before clearing
- Check localStorage quota

## License & Credits

BKM Token System
© 2025 BKM Terminal Platform
Built with Web3 & React
