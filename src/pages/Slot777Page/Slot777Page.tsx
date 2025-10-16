/**
 * Slot777Page - Casino Gambling Games Hub
 *
 * A Mario Party-style casino terminal featuring multiple gambling mini-games,
 * loot crates, and slot machines in a cyberpunk terminal interface.
 */

import React, { useState, useEffect } from 'react';
import { PageType } from '../PageRouter';
import './Slot777Page.css';

interface Slot777PageProps {
  onPageChange: (page: PageType) => void;
}

type GameType = 'slots' | 'blackjack' | 'roulette' | 'lootbox';

const Slot777Page: React.FC<Slot777PageProps> = ({ onPageChange }) => {
  const [activeGame, setActiveGame] = useState<GameType>('slots');
  const [balance, setBalance] = useState(1000);
  const [spinResult, setSpinResult] = useState<string[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [lootBoxItems, setLootBoxItems] = useState<string[]>([]);
  const [isOpeningLootbox, setIsOpeningLootbox] = useState(false);

  // Slot machine effects
  const [slotEffects, setSlotEffects] = useState<Array<{id: number, symbol: string, x: number, delay: number}>>([]);

  useEffect(() => {
    // Generate initial slot effects
    const chars = '💎7️⃣⭐💰🎰🍒💰🎰🍒💎⭐💰';
    const initialEffects = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      symbol: chars[Math.floor(Math.random() * chars.length)],
      x: Math.random() * 100,
      delay: Math.random() * 3000
    }));
    setSlotEffects(initialEffects);
  }, []);

  const games = [
    {
      id: 'slots' as GameType,
      name: 'SLOT MACHINE',
      icon: '🎰',
      description: 'Spin the reels for massive payouts!',
      cost: 10
    },
    {
      id: 'blackjack' as GameType,
      name: 'BLACKJACK',
      icon: '🃏',
      description: 'Beat the dealer at 21!',
      cost: 25
    },
    {
      id: 'roulette' as GameType,
      name: 'ROULETTE',
      icon: '🎡',
      description: 'Red or black? Place your bets!',
      cost: 5
    },
    {
      id: 'lootbox' as GameType,
      name: 'LOOT CRATES',
      icon: '📦',
      description: 'Spin for rare digital prizes!',
      cost: 50
    }
  ];

  const spinSlots = () => {
    if (balance < 10 || isSpinning) return;

    setIsSpinning(true);
    setBalance(prev => prev - 10);

    // Generate spinning results
    setTimeout(() => {
      const symbols = ['💎', '7️⃣', '⭐', '💰', '🍒', '🎰'];
      const result = [
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)]
      ];
      setSpinResult(result);
      setIsSpinning(false);

      // Calculate winnings
      const payoutMultiplier = calculatePayout(result);
      if (payoutMultiplier > 0) {
        const winnings = payoutMultiplier * 10;
        setBalance(prev => prev + winnings);
        setTimeout(() => {
          alert(`🎉 JACKPOT! You won ${winnings} credits!`);
        }, 1000);
      }
    }, 2000);
  };

  const calculatePayout = (result: string[]) => {
    if (result.every(symbol => symbol === '💎')) return 100; // Triple diamond jackpot
    if (result.every(symbol => symbol === '7️⃣')) return 50;  // Triple 7 jackpot
    if (result.every(symbol => symbol === '⭐')) return 25;  // Triple star
    if (result.every(symbol => symbol === '💰')) return 15;  // Triple moneybag
    if (result.every(symbol => symbol === result[0])) return 10; // Three of a kind
    if (result[0] === result[1] || result[1] === result[2] || result[0] === result[2]) return 2; // Any two match
    return 0;
  };

  const openLootbox = () => {
    if (balance < 50 || isOpeningLootbox) return;

    setIsOpeningLootbox(true);
    setBalance(prev => prev - 50);

    setTimeout(() => {
      const prizes = [
        'Legendary Cyber Slime',
        'Rare Quantum Rabbit',
        'Epic Bitcoin Badger',
        'Ghost Hulk NFT',
        'Plasma Phoenix',
        'Cosmic Gorilla'
      ];

      const winningItems = [];
      for (let i = 0; i < Math.floor(Math.random() * 3) + 1; i++) {
        winningItems.push(prizes[Math.floor(Math.random() * prizes.length)]);
      }

      setLootBoxItems(winningItems);
      setIsOpeningLootbox(false);
    }, 3000);
  };

  return (
    <div className="slot777-page">
      {/* Falling coin and symbol effects */}
      <div className="floating-effects">
        {slotEffects.map(effect => (
          <div
            key={effect.id}
            className="floating-symbol"
            style={{
              left: `${effect.x}%`,
              animationDelay: `${effect.delay}ms`
            }}
          >
            {effect.symbol}
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <button
            className="back-btn"
            onClick={() => onPageChange(PageType.HOME)}
          >
            ← BACK TO HOME
          </button>
          <h1 className="game-title">🎰 777 🎰</h1>
          <div className="player-balance">
            Balance: <span className="balance-amount">{balance} Credits</span>
          </div>
        </div>
      </div>

      {/* Main Casino Hub */}
      <div className="slot777-content">
        <div className="game-selection">
          <h2>Choose Your Game</h2>
          <div className="game-grid">
            {games.map(game => (
              <div
                key={game.id}
                className={`game-card ${activeGame === game.id ? 'active' : ''}`}
                onClick={() => setActiveGame(game.id)}
              >
                <div className="game-icon">{game.icon}</div>
                <h3>{game.name}</h3>
                <p>{game.description}</p>
                <div className="game-cost">Cost: {game.cost} credits</div>
              </div>
            ))}
          </div>
        </div>

        {/* Game Display Area */}
        <div className="game-display">
          {activeGame === 'slots' && (
            <div className="slots-game">
              <h3>🎰 TRIPLE SEVENS SLOT MACHINE 🎰</h3>
              <div className="slot-machine">
                <div className="reel-container">
                  {[0, 1, 2].map(reelIndex => (
                    <div key={reelIndex} className={`reel ${isSpinning ? 'spinning' : ''}`}>
                      <div className="reel-symbols">
                        <div className="symbol">{isSpinning ? '🎰' : (spinResult[reelIndex] || '💎')}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  className="spin-btn"
                  onClick={spinSlots}
                  disabled={isSpinning || balance < 10}
                >
                  {isSpinning ? 'SPINNING...' : 'SPIN! 🎰'}
                </button>
              </div>

              <div className="slot-info">
                <h4>Payout Table</h4>
                <div className="payout-grid">
                  <div className="payout-item">💎💎💎 = 1000 credits</div>
                  <div className="payout-item">7️⃣7️⃣7️⃣ = 500 credits</div>
                  <div className="payout-item">⭐⭐⭐ = 250 credits</div>
                  <div className="payout-item">💰💰💰 = 150 credits</div>
                  <div className="payout-item">3-of-a-kind = 100 credits</div>
                </div>
              </div>
            </div>
          )}

          {activeGame === 'blackjack' && (
            <div className="blackjack-game">
              <h3>🃏 BLACKJACK TABLE 🃏</h3>
              <div className="coming-soon-card">
                <div className="card-icon">♠️</div>
                <h2>COMING SOON</h2>
                <p>21 or bust! Ace high, queen low. Dealer's got the Pearl.</p>
                <div className="feature-preview">
                  <h4>Features:</h4>
                  <ul>
                    <li>• Simplified rules for quick gameplay</li>
                    <li>• Double down and insurance</li>
                    <li>• Achievements for lucky streaks</li>
                    <li>• AI dealer that never cheats</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeGame === 'roulette' && (
            <div className="roulette-game">
              <h3>🎡 ROULETTE WHEEL 🎡</h3>
              <div className="coming-soon-card">
                <div className="card-icon">🎯</div>
                <h2>COMING SOON</h2>
                <p>Red or black? Never tell them your odds.</p>
                <div className="feature-preview">
                  <h4>Features:</h4>
                  <ul>
                    <li>• American roulette with double zero</li>
                    <li>• Inside and outside bets</li>
                    <li>• Sound effects for that casino atmosphere</li>
                    <li>• Strategy hints for new players</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeGame === 'lootbox' && (
            <div className="lootbox-game">
              <h3>📦 MYSTERY LOOT CRATES 📦</h3>
              <div className="lootbox-container">
                <div className={`lootbox ${isOpeningLootbox ? 'opening' : ''}`}>
                  <div className="box-icon">📦</div>
                  <button
                    className="open-btn"
                    onClick={openLootbox}
                    disabled={isOpeningLootbox || balance < 50}
                  >
                    {isOpeningLootbox ? 'OPENING...' : 'OPEN LOOTBOX!'}
                  </button>
                </div>

                {lootBoxItems.length > 0 && (
                  <div className="loot-results">
                    <h4>🎁 Your Loot!</h4>
                    <div className="item-grid">
                      {lootBoxItems.map((item, index) => (
                        <div key={index} className="loot-item">
                          <div className="item-name">{item}</div>
                        </div>
                      ))}
                    </div>
                    <button
                      className="collect-btn"
                      onClick={() => setLootBoxItems([])}
                    >
                      COLLECT ALL
                    </button>
                  </div>
                )}
              </div>

              <div className="lootbox-info">
                <h4>Rare Items Include:</h4>
                <div className="rarity-tier">
                  <div className="tier">⭐ Legendary <span>(1% chance)</span></div>
                  <div className="tier">✨ Epic <span>(5% chance)</span></div>
                  <div className="tier">💎 Rare <span>(15% chance)</span></div>
                  <div className="tier">🔹 Common <span>(79% chance)</span></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <footer className="page-footer">
        <p>BkM 777 Casino Terminal v0.1 - Welcome Lucky Player!</p>
      </footer>
    </div>
  );
};

export default Slot777Page;
