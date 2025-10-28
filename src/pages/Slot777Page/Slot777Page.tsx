/**
 * Slot777Page - Casino Gambling Games Hub
 *
 * A Mario Party-style casino terminal featuring multiple gambling mini-games,
 * loot crates, and slot machines in a cyberpunk terminal interface.
 */

import React, { useState, useEffect } from 'react';
import { PageType } from '../PageRouter';
import './Slot777Page.css';

// Pinball Game Component
const PinballGame: React.FC<{balance: number, onBalanceChange: (amount: number) => void}> = ({balance, onBalanceChange}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [ballsLeft, setBallsLeft] = useState(3);
  const [gameEnded, setGameEnded] = useState(true);

  const startGame = () => {
    if (balance < 5) return;
    onBalanceChange(-5);
    setIsPlaying(true);
    setGameEnded(false);
    setScore(0);
    setBallsLeft(3);
  };

  const endGame = () => {
    setIsPlaying(false);
    setGameEnded(true);
    if (score > 0) {
      const winnings = Math.floor(score / 10);
      onBalanceChange(winnings);
    }
  };

  const launchBall = () => {
    if (ballsLeft <= 0) return;
    setBallsLeft(prev => prev - 1);
    setScore(prev => prev + Math.floor(Math.random() * 50) + 10);

    // Auto end after some time or when no balls left
    setTimeout(() => {
      if (ballsLeft <= 1) {
        endGame();
      }
    }, 2000);
  };

  return (
    <div className="pinball-game">
      <h3>🎳 PINBALL WIZARD 🎳</h3>
      <div className="pinball-machine">
        {!isPlaying && !gameEnded ? (
          <button className="start-pinball-btn" onClick={startGame} disabled={balance < 5}>
            START GAME - 5 CREDITS
          </button>
        ) : gameEnded ? (
          <div className="game-results">
            <h4>Game Over!</h4>
            <p>Score: {score} points</p>
            {score > 0 && <p>Winnings: {Math.floor(score / 10)} credits</p>}
            <button className="play-again-btn" onClick={() => setGameEnded(false)}>
              Play Again
            </button>
          </div>
        ) : (
          <div className="game-play">
            <div className="pinball-display">
              <div className="score-display">SCORE: {score}</div>
              <div className="balls-display">BALLS: {ballsLeft}</div>
            </div>
            <div className="pinball-table">
              <div className="bumpers">
                <div className="bumper">🎯</div>
                <div className="bumper">⭐</div>
                <div className="bumper">💎</div>
              </div>
              <div className="flippers">
                <button className="flipper left-flipper" onClick={() => setScore(prev => prev + 5)}>◀</button>
                <button className="flipper right-flipper" onClick={() => setScore(prev => prev + 5)}>▶</button>
              </div>
            </div>
            <button className="launch-btn" onClick={launchBall} disabled={ballsLeft <= 0}>
              LAUNCH BALL!
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Blackjack Game Component
const BlackjackGame: React.FC<{balance: number, onBalanceChange: (amount: number) => void}> = ({balance, onBalanceChange}) => {
  const [playerCards, setPlayerCards] = useState<string[]>([]);
  const [dealerCards, setDealerCards] = useState<string[]>([]);
  const [gameState, setGameState] = useState<'betting' | 'playing' | 'dealer-turn' | 'ended'>('betting');
  const [bet, setBet] = useState(0);
  const [message, setMessage] = useState('Place your bet to start!');

  const cardValues = {
    '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
    'J': 10, 'Q': 10, 'K': 10, 'A': 11
  };

  const suits = ['♠', '♥', '♦', '♣'];
  const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

  const getRandomCard = () => {
    const rank = ranks[Math.floor(Math.random() * ranks.length)];
    const suit = suits[Math.floor(Math.random() * suits.length)];
    return rank + suit;
  };

  const calculateHandValue = (hand: string[]) => {
    let value = 0;
    let aces = 0;
    for (const card of hand) {
      const rank = card.slice(0, -1);
      if (rank === 'A') aces++;
      value += cardValues[rank as keyof typeof cardValues];
    }

    // Handle aces
    while (value > 21 && aces > 0) {
      value -= 10;
      aces--;
    }

    return value;
  };

  const placeBet = (amount: number) => {
    if (balance >= amount) {
      setBet(amount);
      onBalanceChange(-amount);
      setGameState('playing');
      dealInitialCards();
      setMessage('Hit or Stand?');
    }
  };

  const dealInitialCards = () => {
    const playerHand = [getRandomCard(), getRandomCard()];
    const dealerHand = [getRandomCard()];
    setPlayerCards(playerHand);
    setDealerCards(dealerHand);
  };

  const hit = () => {
    const newCard = getRandomCard();
    const newHand = [...playerCards, newCard];
    setPlayerCards(newHand);

    const value = calculateHandValue(newHand);
    if (value > 21) {
      setGameState('ended');
      setMessage('Bust! You lose.');
    } else {
      setMessage('Hit or Stand?');
    }
  };

  const stand = () => {
    setGameState('dealer-turn');
    dealerPlay();
  };

  const dealerPlay = () => {
    let dealerHand = [...dealerCards];
    while (calculateHandValue(dealerHand) < 17) {
      dealerHand.push(getRandomCard());
    }
    setDealerCards(dealerHand);

    const playerValue = calculateHandValue(playerCards);
    const dealerValue = calculateHandValue(dealerHand);

    let result: string;
    let won = false;

    if (dealerValue > 21) {
      result = 'Dealer busts! You win!';
      won = true;
    } else if (playerValue > dealerValue) {
      result = 'You win!';
      won = true;
    } else if (playerValue < dealerValue) {
      result = 'Dealer wins!';
    } else {
      result = 'Push! It\'s a tie.';
      onBalanceChange(bet); // Return the bet
    }

    if (won) {
      onBalanceChange(bet * 2);
    }

    setGameState('ended');
    setMessage(result);
  };

  const resetGame = () => {
    setPlayerCards([]);
    setDealerCards([]);
    setGameState('betting');
    setBet(0);
    setMessage('Place your bet to start!');
  };

  return (
    <div className="blackjack-game">
      <h3>🃏 BLACKJACK TABLE 🃏</h3>
      <div className="blackjack-table">
        <div className="message">{message}</div>

        {/* Dealer Cards */}
        <div className="dealer-section">
          <h4>Dealer</h4>
          <div className="cards">
            {dealerCards.map((card, index) => (
              <div key={index} className="playing-card">{card}</div>
            ))}
          </div>
          {gameState === 'dealer-turn' || gameState === 'ended' ?
            <div className="hand-value">Value: {calculateHandValue(dealerCards)}</div> :
            <div className="hand-value">Value: ?</div>
          }
        </div>

        {/* Player Cards */}
        <div className="player-section">
          <h4>Player</h4>
          <div className="cards">
            {playerCards.map((card, index) => (
              <div key={index} className="playing-card">{card}</div>
            ))}
          </div>
          <div className="hand-value">Value: {calculateHandValue(playerCards)}</div>
        </div>

        {/* Betting */}
        {gameState === 'betting' && (
          <div className="betting-section">
            <h4>Place Your Bet</h4>
            <div className="bet-buttons">
              <button onClick={() => placeBet(10)} disabled={balance < 10}>10</button>
              <button onClick={() => placeBet(25)} disabled={balance < 25}>25</button>
              <button onClick={() => placeBet(50)} disabled={balance < 50}>50</button>
            </div>
            <div className="min-max">Min: 10 | Max: 50</div>
          </div>
        )}

        {/* Game Controls */}
        {gameState === 'playing' && (
          <div className="game-controls">
            <button className="hit-btn" onClick={hit}>HIT</button>
            <button className="stand-btn" onClick={stand}>STAND</button>
          </div>
        )}

        {/* Play Again */}
        {gameState === 'ended' && (
          <button className="play-again-btn" onClick={resetGame}>PLAY AGAIN</button>
        )}
      </div>
    </div>
  );
};

interface Slot777PageProps {
  onPageChange: (page: PageType) => void;
}

type GameType = 'slots' | 'pinball' | 'blackjack' | 'roulette' | 'lootbox';

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
      id: 'pinball' as GameType,
      name: 'PINBALL',
      icon: '🎳',
      description: 'Tilt the table and score big!',
      cost: 5
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
    console.log('Lootbox button clicked, balance:', balance, 'isOpening:', isOpeningLootbox);

    if (balance < 50 || isOpeningLootbox) {
      console.log('Cannot open lootbox:', { balance, isOpeningLootbox });
      return;
    }

    console.log('Opening lootbox...');
    setIsOpeningLootbox(true);
    setBalance(prev => {
      const newBalance = prev - 50;
      console.log('New balance after deduction:', newBalance);
      return newBalance;
    });

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

      console.log('Generated prizes:', winningItems);
      setLootBoxItems(winningItems);
      setIsOpeningLootbox(false);
      console.log('Lootbox opened successfully');
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
          <div className="game-carousel">
            {games.map((game, index) => (
              <div
                key={game.id}
                className={`playing-card ${activeGame === game.id ? 'selected' : ''}`}
                onClick={() => setActiveGame(game.id)}
              >
                <div className="card-suit">{game.icon}</div>
                <div className="card-content">
                  <h3>{game.name}</h3>
                  <p>{game.description}</p>
                  <div className="game-cost">Cost: {game.cost} credits</div>
                </div>
                <div className="card-suit bottom">{game.icon}</div>
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

          {activeGame === 'pinball' && (
            <PinballGame balance={balance} onBalanceChange={setBalance} />
          )}

          {activeGame === 'blackjack' && (
            <BlackjackGame balance={balance} onBalanceChange={setBalance} />
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
