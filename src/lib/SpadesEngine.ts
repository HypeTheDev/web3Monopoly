import { GameState, GameMode, SpadesGameState, SpadesCard, SpadesTrick, GameEntry } from '../types/GameTypes';

export class SpadesGameEngine {
  private gameState: SpadesGameState;
  private onGameUpdate: (gameState: GameState, logEntry: GameEntry) => void;
  private gameLog: GameEntry[];
  private gameInterval: NodeJS.Timeout | null = null;
  private isRunning: boolean = false;

  constructor(onGameUpdate?: (gameState: GameState, logEntry: GameEntry) => void) {
    this.onGameUpdate = onGameUpdate || (() => {});
    this.gameLog = [];
    this.gameState = this.initializeGameState();
  }

  private initializeGameState(): SpadesGameState {
    // Create themed player names for Spades
    const spadesPlayers = [
      { id: 'blade-master', name: 'Blade Master', money: 0, position: 0, properties: [], inJail: false, jailTurns: 0, tokenId: 'blade-token', color: '#E74C3C' },
      { id: 'shadow-dealer', name: 'Shadow Dealer', money: 0, position: 0, properties: [], inJail: false, jailTurns: 0, tokenId: 'shadow-token', color: '#8E44AD' },
      { id: 'trick-runner', name: 'Trick Runner', money: 0, position: 0, properties: [], inJail: false, jailTurns: 0, tokenId: 'trick-token', color: '#3498DB' },
      { id: 'void-nil', name: 'Void Nil', money: 0, position: 0, properties: [], inJail: false, jailTurns: 0, tokenId: 'void-token', color: '#2C3E50' }
    ];

    return {
      gameMode: GameMode.SPADES,
      players: spadesPlayers,
      currentPlayerIndex: 0,
      gameStatus: 'waiting',
      roundNumber: 1,
      teams: { 
        team1: ['blade-master', 'trick-runner'], 
        team2: ['shadow-dealer', 'void-nil'] 
      },
      currentDealer: 0,
      currentTrick: [],
      bidPhase: false,
      playPhase: false,
      bids: {},
      tricks: {},
      spadesBroken: false,
      deck: this.createDeck(),
      hands: {},
      trickHistory: [],
      score: { team1: 0, team2: 0 }
    };
  }

  private createDeck(): SpadesCard[] {
    const suits = ['hearts', 'diamonds', 'clubs', 'spades'] as const;
    const deck: SpadesCard[] = [];
    
    suits.forEach(suit => {
      for (let rank = 2; rank <= 14; rank++) { // 2-14 (Ace is 14)
        deck.push({
          suit,
          rank,
          id: `${suit}-${rank}`
        });
      }
    });
    
    return this.shuffleDeck(deck);
  }

  private shuffleDeck(deck: SpadesCard[]): SpadesCard[] {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  private dealCards(): void {
    const players = this.gameState.players;
    const cardsPerPlayer = 13;
    
    // Initialize hands
    this.gameState.hands = {};
    players.forEach(player => {
      this.gameState.hands[player.id] = [];
    });
    
    // Deal cards
    for (let i = 0; i < cardsPerPlayer; i++) {
      players.forEach(player => {
        if (this.gameState.deck.length > 0) {
          const card = this.gameState.deck.pop()!;
          this.gameState.hands[player.id].push(card);
        }
      });
    }
    
    // Sort hands by suit and rank
    Object.values(this.gameState.hands).forEach(hand => {
      hand.sort((a, b) => {
        if (a.suit !== b.suit) {
          const suitOrder = ['spades', 'hearts', 'diamonds', 'clubs'];
          return suitOrder.indexOf(a.suit) - suitOrder.indexOf(b.suit);
        }
        return b.rank - a.rank; // High to low
      });
    });
  }

  public startGameLoop(speed: number): void {
    this.logEntry('SPADES_START', '♠️ Starting Spades 2v2 tournament...');
    this.isRunning = true;
    this.gameState.gameStatus = 'playing';
    
    // Deal initial cards
    this.dealCards();
    this.startBiddingPhase();

    // Start game simulation
    this.gameInterval = setInterval(() => {
      if (this.isRunning && this.gameState.gameStatus === 'playing') {
        this.processGamePhase();
      }
    }, speed);

    this.onGameUpdate(this.gameState, new GameEntry(0, 'SYSTEM', 'SPADES_START', '♠️ Spades tournament begins! Teams battle for tricks!'));
  }

  public stopGameLoop(): void {
    this.isRunning = false;
    if (this.gameInterval) {
      clearInterval(this.gameInterval);
      this.gameInterval = null;
    }
    this.logEntry('SPADES_STOP', 'Spades game paused');
  }

  private startBiddingPhase(): void {
    this.gameState.bidPhase = true;
    this.gameState.playPhase = false;
    this.gameState.bids = {};
    
    this.logEntry('BID_PHASE', '🎯 Bidding phase begins - teams predict their tricks');
  }

  private processGamePhase(): void {
    if (this.gameState.bidPhase) {
      this.processBidding();
    } else if (this.gameState.playPhase) {
      this.processCardPlay();
    } else {
      this.processHandEnd();
    }
  }

  private processBidding(): void {
    const currentPlayer = this.gameState.players[this.gameState.currentPlayerIndex];
    
    // AI bidding logic (simplified)
    const hand = this.gameState.hands[currentPlayer.id] || [];
    const spades = hand.filter(card => card.suit === 'spades').length;
    const highCards = hand.filter(card => card.rank >= 11).length; // J, Q, K, A
    
    let bid = Math.max(1, Math.floor(spades * 0.7 + highCards * 0.3));
    
    // Nil bid chance (5% for dramatic effect)
    if (Math.random() < 0.05) {
      bid = 0; // Nil bid
      this.logEntry('NIL_BID', `💀 ${currentPlayer.name} bids NIL! Risky move!`);
    } else {
      this.logEntry('BID_MADE', `🎯 ${currentPlayer.name} bids ${bid} tricks`);
    }
    
    this.gameState.bids[currentPlayer.id] = bid;
    
    // Move to next player
    this.gameState.currentPlayerIndex = (this.gameState.currentPlayerIndex + 1) % this.gameState.players.length;
    
    // Check if all players have bid
    if (Object.keys(this.gameState.bids).length === this.gameState.players.length) {
      this.startPlayPhase();
    }
  }

  private startPlayPhase(): void {
    this.gameState.bidPhase = false;
    this.gameState.playPhase = true;
    this.gameState.tricks = {};
    this.gameState.currentTrick = [];
    
    // Initialize trick counts
    this.gameState.players.forEach(player => {
      this.gameState.tricks[player.id] = 0;
    });
    
    this.logEntry('PLAY_PHASE', '🃏 Card play begins! Let the tricks commence!');
  }

  private processCardPlay(): void {
    const currentPlayer = this.gameState.players[this.gameState.currentPlayerIndex];
    const hand = this.gameState.hands[currentPlayer.id] || [];
    
    if (hand.length === 0) {
      this.processHandEnd();
      return;
    }
    
    // AI card selection (simplified)
    let selectedCard: SpadesCard;
    
    if (this.gameState.currentTrick.length === 0) {
      // Leading - play middle strength card
      selectedCard = hand[Math.floor(hand.length / 2)];
    } else {
      // Following - try to win or play low
      const leadSuit = this.gameState.currentTrick[0].suit;
      const suitCards = hand.filter(card => card.suit === leadSuit);
      
      if (suitCards.length > 0) {
        // Must follow suit
        selectedCard = suitCards[Math.floor(suitCards.length / 2)];
      } else {
        // Can play anything - maybe spade if broken
        if (this.gameState.spadesBroken || hand.every(card => card.suit === 'spades')) {
          selectedCard = hand[Math.floor(Math.random() * hand.length)];
        } else {
          // Play non-spade
          const nonSpades = hand.filter(card => card.suit !== 'spades');
          selectedCard = nonSpades.length > 0 ? nonSpades[0] : hand[0];
        }
      }
    }
    
    // Remove card from hand and add to trick
    const cardIndex = hand.indexOf(selectedCard);
    hand.splice(cardIndex, 1);
    this.gameState.currentTrick.push(selectedCard);
    
    // Check if spades broken
    if (selectedCard.suit === 'spades' && !this.gameState.spadesBroken) {
      this.gameState.spadesBroken = true;
      this.logEntry('SPADES_BROKEN', '💥 Spades have been broken! All suits now playable');
    }
    
    this.logEntry('CARD_PLAYED', `🃏 ${currentPlayer.name} plays ${this.getCardName(selectedCard)}`);
    
    // Move to next player
    this.gameState.currentPlayerIndex = (this.gameState.currentPlayerIndex + 1) % this.gameState.players.length;
    
    // Check if trick is complete (4 cards)
    if (this.gameState.currentTrick.length === 4) {
      this.processTrickWin();
    }
  }

  private processTrickWin(): void {
    const trick = this.gameState.currentTrick;
    const leadSuit = trick[0].suit;
    
    // Find highest card (spades win, then highest of lead suit)
    let winningCardIndex = 0;
    let winningCard = trick[0];
    
    for (let i = 1; i < trick.length; i++) {
      const card = trick[i];
      if (card.suit === 'spades' && winningCard.suit !== 'spades') {
        winningCard = card;
        winningCardIndex = i;
      } else if (card.suit === winningCard.suit && card.rank > winningCard.rank) {
        winningCard = card;
        winningCardIndex = i;
      }
    }
    
    const winner = this.gameState.players[winningCardIndex];
    this.gameState.tricks[winner.id]++;
    
    // Save trick to history
    const trickResult: SpadesTrick = {
      cards: [...trick],
      winner: winner.id,
      leadPlayer: this.gameState.players[0].id // Simplified
    };
    this.gameState.trickHistory.push(trickResult);
    
    this.logEntry('TRICK_WON', `🏆 ${winner.name} wins the trick with ${this.getCardName(winningCard)}`);
    
    // Reset for next trick
    this.gameState.currentTrick = [];
    this.gameState.currentPlayerIndex = winningCardIndex; // Winner leads next trick
  }

  private processHandEnd(): void {
    this.gameState.playPhase = false;
    
    // Calculate scores
    const team1Score = this.calculateTeamScore('team1');
    const team2Score = this.calculateTeamScore('team2');
    
    this.gameState.score.team1 += team1Score;
    this.gameState.score.team2 += team2Score;
    
    this.logEntry('HAND_END', `📊 Hand complete! Team 1: +${team1Score}, Team 2: +${team2Score}`);
    
    // Check for game end (first to 500 points)
    if (this.gameState.score.team1 >= 500 || this.gameState.score.team2 >= 500) {
      const winner = this.gameState.score.team1 >= 500 ? 'Team 1' : 'Team 2';
      this.gameState.gameStatus = 'ended';
      this.stopGameLoop();
      this.logEntry('GAME_END', `🏆 ${winner} wins the tournament! Final score: ${this.gameState.score.team1} - ${this.gameState.score.team2}`);
    } else {
      // Start new hand
      this.gameState.deck = this.createDeck();
      this.dealCards();
      this.gameState.currentPlayerIndex = (this.gameState.currentDealer + 1) % 4;
      this.gameState.currentDealer = this.gameState.currentPlayerIndex;
      this.startBiddingPhase();
    }
  }

  private calculateTeamScore(team: 'team1' | 'team2'): number {
    const teamPlayers = this.gameState.teams[team];
    let totalBid = 0;
    let totalTricks = 0;
    
    teamPlayers.forEach(playerId => {
      totalBid += this.gameState.bids[playerId] || 0;
      totalTricks += this.gameState.tricks[playerId] || 0;
    });
    
    // Simplified scoring: make bid = 10 * bid + tricks, fail = -10 * bid
    if (totalTricks >= totalBid) {
      return totalBid * 10 + (totalTricks - totalBid);
    } else {
      return -totalBid * 10;
    }
  }

  private getCardName(card: SpadesCard): string {
    const rankNames: { [key: number]: string } = {
      2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9', 10: '10',
      11: 'J', 12: 'Q', 13: 'K', 14: 'A'
    };
    const suitSymbols = { hearts: '♥️', diamonds: '♦️', clubs: '♣️', spades: '♠️' };
    
    return `${rankNames[card.rank]}${suitSymbols[card.suit]}`;
  }

  private logEntry(actionType: string, details: string): void {
    const entry = new GameEntry(this.gameLog.length + 1, 'SYSTEM', actionType, details);
    this.gameLog.push(entry);
    this.onGameUpdate(this.gameState, entry);
  }

  public getGameState(): GameState {
    return this.gameState;
  }

  public getGameLog(): GameEntry[] {
    return this.gameLog.slice();
  }

  public resetGame(): void {
    this.stopGameLoop();
    this.gameState = this.initializeGameState();
    this.gameLog = [];
    this.logEntry('SPADES_RESET', 'Spades game has been reset');
  }

  public adjustSpeed(speed: number): void {
    if (this.gameInterval) {
      this.stopGameLoop();
      this.startGameLoop(speed);
    }
  }
}

export default SpadesGameEngine;