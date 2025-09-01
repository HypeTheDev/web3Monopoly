import { Player, Property, GameState, ChanceCard, GameStats } from '../types/GameTypes';

// AI Difficulty Levels
export enum AIDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  EXPERT = 'expert'
}

// Game Engine for AI Demo
export class MonopolyGameEngine {
  private gameState: GameState;
  private aiPlayers: AIPlayer[];
  private gameLog: GameEntry[];
  private playerBalances: Map<string, number[]>;
  private turnCount: number = 0;
  private maxTurns: number;
  private gameInterval: NodeJS.Timeout | null = null;
  private onGameUpdate: (gameState: GameState, log: GameEntry) => void;

  constructor(maxTurns: number = 1000, onGameUpdate?: (gameState: GameState, log: GameEntry) => void) {
    this.maxTurns = maxTurns;
    this.onGameUpdate = onGameUpdate || (() => {});
    this.gameLog = [];
    this.playerBalances = new Map();
    this.aiPlayers = [];

    this.gameState = this.initializeGameState();
  }

  private initializeGameState(): GameState {
    // Initialize 4 AI players
    const players: Player[] = [
      { id: 'ai-1', name: 'Terry', money: 1500, position: 0, properties: [], inJail: false, jailTurns: 0, tokenId: 'terry-token', color: '#FF6B6B' },
      { id: 'ai-2', name: 'Alice', money: 1500, position: 0, properties: [], inJail: false, jailTurns: 0, tokenId: 'alice-token', color: '#4ECDC4' },
      { id: 'ai-3', name: 'Bob', money: 1500, position: 0, properties: [], inJail: false, jailTurns: 0, tokenId: 'bob-token', color: '#45B7D1' },
      { id: 'ai-4', name: 'Carol', money: 1500, position: 0, properties: [], inJail: false, jailTurns: 0, tokenId: 'carol-token', color: '#F9CA24' }
    ];

    const properties = this.initializeProperties();

    return {
      players,
      currentPlayerIndex: 0,
      properties,
      gameStatus: 'playing',
      diceRolls: [],
      bankMoney: 20580, // Starting bank amount
      freeParkingPot: 0,
      roundNumber: 1,
      chanceCards: this.initializeChanceCards(),
      communityChestCards: this.initializeCommunityChestCards(),
      currentCard: null
    };
  }

  private initializeProperties(): Property[] {
    return [
      { id: 0, name: 'GO', type: 'corner', position: 0, price: 0, rent: [0], mortgageValue: 0, mortgaged: false, owner: null, color: 'transparent', houses: 0 },
      { id: 1, name: 'Mediterranean Ave', type: 'property', position: 1, price: 60, rent: [2, 10, 30, 90, 160, 250], mortgageValue: 30, mortgaged: false, owner: null, color: '#964B00', houses: 0 },
      { id: 2, name: 'Community Chest', type: 'card', position: 2, price: 0, rent: [0], mortgageValue: 0, mortgaged: false, owner: null, color: '#87CEEB', houses: 0 },
      { id: 3, name: 'Baltic Ave', type: 'property', position: 3, price: 60, rent: [4, 20, 60, 180, 320, 450], mortgageValue: 30, mortgaged: false, owner: null, color: '#964B00', houses: 0 },
      { id: 4, name: 'Income Tax', type: 'tax', position: 4, price: 0, rent: [0], mortgageValue: 0, mortgaged: false, owner: null, color: '#708090', houses: 0 },
      { id: 5, name: 'Reading Railroad', type: 'railroad', position: 5, price: 200, rent: [25, 50, 100, 200], mortgageValue: 100, mortgaged: false, owner: null, color: '#000000', houses: 0 },
      { id: 6, name: 'Oriental Ave', type: 'property', position: 6, price: 100, rent: [6, 30, 90, 270, 400, 550], mortgageValue: 50, mortgaged: false, owner: null, color: '#FF6B6B', houses: 0 },
      { id: 7, name: 'Chance', type: 'card', position: 7, price: 0, rent: [0], mortgageValue: 0, mortgaged: false, owner: null, color: '#FFD93D', houses: 0 },
      { id: 8, name: 'Vermont Ave', type: 'property', position: 8, price: 100, rent: [6, 30, 90, 270, 400, 550], mortgageValue: 50, mortgaged: false, owner: null, color: '#FF6B6B', houses: 0 },
      { id: 9, name: 'Connecticut Ave', type: 'property', position: 9, price: 120, rent: [8, 40, 100, 300, 450, 600], mortgageValue: 60, mortgaged: false, owner: null, color: '#FF6B6B', houses: 0 },
      { id: 10, name: 'Just Visiting Jail', type: 'corner', position: 10, price: 0, rent: [0], mortgageValue: 0, mortgaged: false, owner: null, color: 'transparent', houses: 0 },
      { id: 11, name: 'St. Charles Place', type: 'property', position: 11, price: 140, rent: [10, 50, 150, 450, 625, 750], mortgageValue: 70, mortgaged: false, owner: null, color: '#87CEEB', houses: 0 },
      { id: 12, name: 'Electric Company', type: 'utility', position: 12, price: 150, rent: [4, 10], mortgageValue: 75, mortgaged: false, owner: null, color: '#98FB98', houses: 0 },
      { id: 13, name: 'States Ave', type: 'property', position: 13, price: 140, rent: [10, 50, 150, 450, 625, 750], mortgageValue: 70, mortgaged: false, owner: null, color: '#87CEEB', houses: 0 },
      { id: 14, name: 'Virginia Ave', type: 'property', position: 14, price: 160, rent: [12, 60, 180, 500, 700, 900], mortgageValue: 80, mortgaged: false, owner: null, color: '#87CEEB', houses: 0 },
      { id: 15, name: 'Pennsylvania Railroad', type: 'railroad', position: 15, price: 200, rent: [25, 50, 100, 200], mortgageValue: 100, mortgaged: false, owner: null, color: '#000000', houses: 0 },
      { id: 16, name: 'St. James Place', type: 'property', position: 16, price: 180, rent: [14, 70, 200, 550, 750, 950], mortgageValue: 90, mortgaged: false, owner: null, color: '#FFB347', houses: 0 },
      { id: 17, name: 'Community Chest', type: 'card', position: 17, price: 0, rent: [0], mortgageValue: 0, mortgaged: false, owner: null, color: '#87CEEB', houses: 0 },
      { id: 18, name: 'Tennessee Ave', type: 'property', position: 18, price: 180, rent: [14, 70, 200, 550, 750, 950], mortgageValue: 90, mortgaged: false, owner: null, color: '#FFB347', houses: 0 },
      { id: 19, name: 'New York Ave', type: 'property', position: 19, price: 200, rent: [16, 80, 220, 600, 800, 1000], mortgageValue: 100, mortgaged: false, owner: null, color: '#FFB347', houses: 0 },
      { id: 20, name: 'Free Parking', type: 'corner', position: 20, price: 0, rent: [0], mortgageValue: 0, mortgaged: false, owner: null, color: 'transparent', houses: 0 },
      { id: 21, name: 'Kentucky Ave', type: 'property', position: 21, price: 220, rent: [18, 90, 250, 700, 875, 1050], mortgageValue: 110, mortgaged: false, owner: null, color: '#FF69B4', houses: 0 },
      { id: 22, name: 'Chance', type: 'card', position: 22, price: 0, rent: [0], mortgageValue: 0, mortgaged: false, owner: null, color: '#FFD93D', houses: 0 },
      { id: 23, name: 'Indiana Ave', type: 'property', position: 23, price: 220, rent: [18, 90, 250, 700, 875, 1050], mortgageValue: 110, mortgaged: false, owner: null, color: '#FF69B4', houses: 0 },
      { id: 24, name: 'Illinois Ave', type: 'property', position: 24, price: 240, rent: [20, 100, 300, 750, 925, 1100], mortgageValue: 120, mortgaged: false, owner: null, color: '#FF69B4', houses: 0 },
      { id: 25, name: 'B&O Railroad', type: 'railroad', position: 25, price: 200, rent: [25, 50, 100, 200], mortgageValue: 100, mortgaged: false, owner: null, color: '#000000', houses: 0 },
      { id: 26, name: 'Atlantic Ave', type: 'property', position: 26, price: 260, rent: [22, 110, 330, 800, 975, 1150], mortgageValue: 130, mortgaged: false, owner: null, color: '#FFFF99', houses: 0 },
      { id: 27, name: 'Ventnor Ave', type: 'property', position: 27, price: 260, rent: [22, 110, 330, 800, 975, 1150], mortgageValue: 130, mortgaged: false, owner: null, color: '#FFFF99', houses: 0 },
      { id: 28, name: 'Water Works', type: 'utility', position: 28, price: 150, rent: [4, 10], mortgageValue: 75, mortgaged: false, owner: null, color: '#98FB98', houses: 0 },
      { id: 29, name: 'Marvin Gardens', type: 'property', position: 29, price: 280, rent: [24, 120, 360, 850, 1025, 1200], mortgageValue: 140, mortgaged: false, owner: null, color: '#FFFF99', houses: 0 },
      { id: 30, name: 'Go To Jail', type: 'corner', position: 30, price: 0, rent: [0], mortgageValue: 0, mortgaged: false, owner: null, color: 'transparent', houses: 0 },
      { id: 31, name: 'Pacific Ave', type: 'property', position: 31, price: 300, rent: [26, 130, 390, 900, 1100, 1275], mortgageValue: 150, mortgaged: false, owner: null, color: '#32CD32', houses: 0 },
      { id: 32, name: 'North Carolina Ave', type: 'property', position: 32, price: 300, rent: [26, 130, 390, 900, 1100, 1275], mortgageValue: 150, mortgaged: false, owner: null, color: '#32CD32', houses: 0 },
      { id: 33, name: 'Community Chest', type: 'card', position: 33, price: 0, rent: [0], mortgageValue: 0, mortgaged: false, owner: null, color: '#87CEEB', houses: 0 },
      { id: 34, name: 'Pennsylvania Ave', type: 'property', position: 34, price: 320, rent: [28, 150, 450, 1000, 1200, 1400], mortgageValue: 160, mortgaged: false, owner: null, color: '#32CD32', houses: 0 },
      { id: 35, name: 'Short Line', type: 'railroad', position: 35, price: 200, rent: [25, 50, 100, 200], mortgageValue: 100, mortgaged: false, owner: null, color: '#000000', houses: 0 },
      { id: 36, name: 'Chance', type: 'card', position: 36, price: 0, rent: [0], mortgageValue: 0, mortgaged: false, owner: null, color: '#087823EB', houses: 0 },
      { id: 37, name: 'Park Place', type: 'property', position: 37, price: 350, rent: [35, 175, 500, 1100, 1300, 1500], mortgageValue: 175, mortgaged: false, owner: null, color: '#8A2BE2', houses: 0 },
      { id: 38, name: 'Luxury Tax', type: 'tax', position: 38, price: 0, rent: [0], mortgageValue: 0, mortgaged: false, owner: null, color: '#708090', houses: 0 },
      { id: 39, name: 'Boardwalk', type: 'property', position: 39, price: 400, rent: [50, 200, 600, 1400, 1700, 2000], mortgageValue: 200, mortgaged: false, owner: null, color: '#8A2BE2', houses: 0 }
    ];
  }

  private initializeChanceCards(): ChanceCard[] {
    return [
      { id: 'chance-1', title: 'Advance to GO', description: 'Advance to GO (Collect $200)', action: (player) => {
        player.position = 0;
        player.money += 200;
      }, type: 'chance' },
      { id: 'chance-2', title: 'Speeding Fine', description: 'Speeding fine $15', action: (player) => {
        player.money -= 15;
      }, type: 'chance' },
      { id: 'chance-3', title: 'Bank Dividend', description: 'Bank pays dividend of $50', action: (player) => {
        player.money += 50;
      }, type: 'chance' }
    ];
  }

  private initializeCommunityChestCards(): ChanceCard[] {
    return [
      { id: 'chest-1', title: 'Life Insurance', description: 'Life insurance matures - Collect $100', action: (player) => {
        player.money += 100;
      }, type: 'community-chest' },
      { id: 'chest-2', title: 'Doctor\'s Fee', description: 'Doctor\'s fee. Pay $50', action: (player) => {
        player.money -= 50;
      }, type: 'community-chest' },
      { id: 'chest-3', title: 'Income Tax Refund', description: 'Income tax refund. Collect $20', action: (player) => {
        player.money += 20;
      }, type: 'community-chest' }
    ];
  }

  public startGameLoop(speed: number = 1000) {
    this.logEntry('GAME_START', 'Starting AI Monopoly demo with 4 players');
    this.logEntry('CONFIG', `Turn speed: ${speed}ms, Max turns: ${this.maxTurns}`);
    this.initializeAIPlayers();

    this.gameInterval = setInterval(() => {
      const logEntry = this.playAITurn();
      this.onGameUpdate(this.gameState, logEntry);

      if (this.shouldEndGame()) {
        this.endGame();
      }
    }, speed);
  }

  public stopGameLoop() {
    if (this.gameInterval) {
      clearInterval(this.gameInterval);
      this.gameInterval = null;
      this.logEntry('GAME_END', 'Game loop stopped');
    }
  }

  private initializeAIPlayers() {
    this.aiPlayers = this.gameState.players.map(player => new AIPlayer(player, AIDifficulty.EXPERT));
    this.aiPlayers.forEach(player => {
      this.playerBalances.set(player.player.id, [player.player.money]);
    });
  }

  private playAITurn(): GameEntry {
    const currentAI = this.aiPlayers[this.gameState.currentPlayerIndex];
    const action = currentAI.takeTurn(this.gameState);

    this.executeAIAction(action, currentAI.player);

    // Next player
    this.gameState.currentPlayerIndex = (this.gameState.currentPlayerIndex + 1) % this.aiPlayers.length;
    if (this.gameState.currentPlayerIndex === 0) {
      this.gameState.roundNumber++;
    }
    this.turnCount++;

    return new GameEntry(this.turnCount, currentAI.player.name, action.type, action.details);
  }

  private executeAIAction(action: AIActions, player: Player) {
    switch (action.type) {
      case 'ROLL_DICE':
        const dice1 = Math.floor(Math.random() * 6) + 1;
        const dice2 = Math.floor(Math.random() * 6) + 1;
        this.gameState.diceRolls = [dice1, dice2];

        player.position = (player.position + dice1 + dice2) % 40;
        const landed = this.gameState.properties[player.position];

        if (landed.owner && landed.owner.id !== player.id) {
          const rent = landed.type === 'property' ? landed.rent[landed.houses] : landed.rent[0];
          player.money -= rent;
          landed.owner.money += rent;
        }
        break;

      case 'BUY_PROPERTY':
        const propertyToBuy = this.gameState.properties[player.position];
        if (propertyToBuy.price > 0 && !propertyToBuy.owner && player.money >= propertyToBuy.price) {
          player.money -= propertyToBuy.price;
          propertyToBuy.owner = player;
          player.properties.push(propertyToBuy);
        }
        break;

      case 'TRADE_PROPERTY':
        // Implement property trading logic
        break;

      case 'BUILD_HOUSE':
        // Implement house building logic
        break;
    }
  }

  private shouldEndGame(): boolean {
    return this.turnCount >= this.maxTurns ||
           this.gameState.players.filter(p => p.money > 0).length <= 1;
  }

  private endGame() {
    this.stopGameLoop();
    const winner = this.gameState.players.reduce((prev, current) =>
      prev.money > current.money ? prev : current
    );
    this.logEntry('GAME_END', `Winner: ${winner.name} with $${winner.money}`);

    // Save game summary to logs
    this.saveGameSummary();
  }

  private saveGameSummary() {
    const summary: GameStats = {
      gameId: Math.random().toString(36).substring(7),
      duration: this.turnCount,
      winner: this.gameState.players.reduce((prev, current) =>
        prev.money > current.money ? prev : current
      ),
      finalBalances: this.gameState.players.map(p => ({ name: p.name, money: p.money })),
      totalTransactions: this.gameLog.filter(l => l.actionType === 'BUY_PROPERTY' || l.actionType === 'TRADE').length,
      totalTurns: this.gameState.roundNumber,
      raceEndTime: Date.now()
    };

    // Save to localStorage for now (could be expanded to file system logging)
    const existingSummaries = JSON.parse(localStorage.getItem('monopoly-summaries') || '[]');
    existingSummaries.push(summary);
    localStorage.setItem('monopoly-summaries', JSON.stringify(existingSummaries));
  }

  private logEntry(actionType: string, details: string) {
    const entry = new GameEntry(this.turnCount, 'SYSTEM', actionType, details);
    this.gameLog.push(entry);
  }

  public getGameState(): GameState {
    return this.gameState;
  }

  public getGameLog(): GameEntry[] {
    return this.gameLog;
  }

  public getPlayerBalances(): Map<string, number[]> {
    return this.playerBalances;
  }

  public adjustSpeed(newSpeed: number) {
    this.stopGameLoop();
    this.startGameLoop(newSpeed);
  }
}

// AI Actions Interface
interface AIActions {
  type: 'ROLL_DICE' | 'BUY_PROPERTY' | 'TRADE_PROPERTY' | 'BUILD_HOUSE' | 'MORTGAGE' | 'END_TURN';
  details: string;
  targetProperty?: Property;
}

// AI Player Class
class AIPlayer {
  constructor(public player: Player, private difficulty: AIDifficulty) {}

  takeTurn(gameState: GameState): AIActions {
    // AI decision making based on difficulty
    const rollDice = Math.random() > 0.2;
    if (rollDice) {
      return { type: 'ROLL_DICE', details: 'AI player rolled dice' };
    }

    // Check if can buy current property
    const currentProperty = gameState.properties[this.player.position];
    if (currentProperty.price > 0 && !currentProperty.owner && this.player.money >= currentProperty.price) {
      if (this.shouldBuyProperty(currentProperty)) {
        return { type: 'BUY_PROPERTY', details: `AI player bought ${currentProperty.name}` };
      }
    }

    return { type: 'END_TURN', details: 'AI player ended turn' };
  }

  private shouldBuyProperty(property: Property): boolean {
    // AI decision logic based on property value and player money
    const valueRatio = property.price / (this.player.money || 1);
    const shouldBuy = valueRatio < 0.3 && property.price < 500; // Buy if affordable and valuable
    return shouldBuy;
  }
}

// Game Log Entry
export class GameEntry {
  constructor(
    public turn: number,
    public playerName: string,
    public actionType: string,
    public details: string,
    public timestamp: number = Date.now()
  ) {}
}

// Extend GameTypes
declare module '../types/GameTypes' {
  interface GameStats {
    gameId: string;
    duration: number;
    winner: Player;
    finalBalances: { name: string; money: number }[];
    totalTransactions: number;
    totalTurns: number;
    raceEndTime: number;
  }
}
