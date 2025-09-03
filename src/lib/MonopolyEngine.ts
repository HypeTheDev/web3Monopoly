import { GameState, GameMode, MonopolyGameState, Player, Property, GameEntry } from '../types/GameTypes';

// Monopoly Board Properties Configuration
const MONOPOLY_PROPERTIES: Omit<Property, 'owner' | 'mortgaged' | 'houses'>[] = [
  // Brown Properties
  { id: 1, name: 'Mediterranean Avenue', type: 'property', position: 1, price: 60, rent: [2, 10, 30, 90, 160, 250], mortgageValue: 30, color: '#8B4513', housesPrice: 50, hotelPrice: 50 },
  { id: 3, name: 'Baltic Avenue', type: 'property', position: 3, price: 60, rent: [4, 20, 60, 180, 320, 450], mortgageValue: 30, color: '#8B4513', housesPrice: 50, hotelPrice: 50 },
  
  // Light Blue Properties
  { id: 6, name: 'Oriental Avenue', type: 'property', position: 6, price: 100, rent: [6, 30, 90, 270, 400, 550], mortgageValue: 50, color: '#87CEEB', housesPrice: 50, hotelPrice: 50 },
  { id: 8, name: 'Vermont Avenue', type: 'property', position: 8, price: 100, rent: [6, 30, 90, 270, 400, 550], mortgageValue: 50, color: '#87CEEB', housesPrice: 50, hotelPrice: 50 },
  { id: 9, name: 'Connecticut Avenue', type: 'property', position: 9, price: 120, rent: [8, 40, 100, 300, 450, 600], mortgageValue: 60, color: '#87CEEB', housesPrice: 50, hotelPrice: 50 },
  
  // Pink Properties
  { id: 11, name: 'St. Charles Place', type: 'property', position: 11, price: 140, rent: [10, 50, 150, 450, 625, 750], mortgageValue: 70, color: '#FF1493', housesPrice: 100, hotelPrice: 100 },
  { id: 13, name: 'States Avenue', type: 'property', position: 13, price: 140, rent: [10, 50, 150, 450, 625, 750], mortgageValue: 70, color: '#FF1493', housesPrice: 100, hotelPrice: 100 },
  { id: 14, name: 'Virginia Avenue', type: 'property', position: 14, price: 160, rent: [12, 60, 180, 500, 700, 900], mortgageValue: 80, color: '#FF1493', housesPrice: 100, hotelPrice: 100 },
  
  // Orange Properties
  { id: 16, name: 'St. James Place', type: 'property', position: 16, price: 180, rent: [14, 70, 200, 550, 750, 950], mortgageValue: 90, color: '#FFA500', housesPrice: 100, hotelPrice: 100 },
  { id: 18, name: 'Tennessee Avenue', type: 'property', position: 18, price: 180, rent: [14, 70, 200, 550, 750, 950], mortgageValue: 90, color: '#FFA500', housesPrice: 100, hotelPrice: 100 },
  { id: 19, name: 'New York Avenue', type: 'property', position: 19, price: 200, rent: [16, 80, 220, 600, 800, 1000], mortgageValue: 100, color: '#FFA500', housesPrice: 100, hotelPrice: 100 },
  
  // Red Properties
  { id: 21, name: 'Kentucky Avenue', type: 'property', position: 21, price: 220, rent: [18, 90, 250, 700, 875, 1050], mortgageValue: 110, color: '#FF0000', housesPrice: 150, hotelPrice: 150 },
  { id: 23, name: 'Indiana Avenue', type: 'property', position: 23, price: 220, rent: [18, 90, 250, 700, 875, 1050], mortgageValue: 110, color: '#FF0000', housesPrice: 150, hotelPrice: 150 },
  { id: 24, name: 'Illinois Avenue', type: 'property', position: 24, price: 240, rent: [20, 100, 300, 750, 925, 1100], mortgageValue: 120, color: '#FF0000', housesPrice: 150, hotelPrice: 150 },
  
  // Yellow Properties
  { id: 26, name: 'Atlantic Avenue', type: 'property', position: 26, price: 260, rent: [22, 110, 330, 800, 975, 1150], mortgageValue: 130, color: '#FFFF00', housesPrice: 150, hotelPrice: 150 },
  { id: 27, name: 'Ventnor Avenue', type: 'property', position: 27, price: 260, rent: [22, 110, 330, 800, 975, 1150], mortgageValue: 130, color: '#FFFF00', housesPrice: 150, hotelPrice: 150 },
  { id: 29, name: 'Marvin Gardens', type: 'property', position: 29, price: 280, rent: [24, 120, 360, 850, 1025, 1200], mortgageValue: 140, color: '#FFFF00', housesPrice: 150, hotelPrice: 150 },
  
  // Green Properties
  { id: 31, name: 'Pacific Avenue', type: 'property', position: 31, price: 300, rent: [26, 130, 390, 900, 1100, 1275], mortgageValue: 150, color: '#00FF00', housesPrice: 200, hotelPrice: 200 },
  { id: 32, name: 'North Carolina Avenue', type: 'property', position: 32, price: 300, rent: [26, 130, 390, 900, 1100, 1275], mortgageValue: 150, color: '#00FF00', housesPrice: 200, hotelPrice: 200 },
  { id: 34, name: 'Pennsylvania Avenue', type: 'property', position: 34, price: 320, rent: [28, 150, 450, 1000, 1200, 1400], mortgageValue: 160, color: '#00FF00', housesPrice: 200, hotelPrice: 200 },
  
  // Dark Blue Properties
  { id: 37, name: 'Park Place', type: 'property', position: 37, price: 350, rent: [35, 175, 500, 1100, 1300, 1500], mortgageValue: 175, color: '#000080', housesPrice: 200, hotelPrice: 200 },
  { id: 39, name: 'Boardwalk', type: 'property', position: 39, price: 400, rent: [50, 200, 600, 1400, 1700, 2000], mortgageValue: 200, color: '#000080', housesPrice: 200, hotelPrice: 200 },
  
  // Railroads
  { id: 5, name: 'Reading Railroad', type: 'railroad', position: 5, price: 200, rent: [25, 50, 100, 200], mortgageValue: 100, color: '#000000' },
  { id: 15, name: 'Pennsylvania Railroad', type: 'railroad', position: 15, price: 200, rent: [25, 50, 100, 200], mortgageValue: 100, color: '#000000' },
  { id: 25, name: 'B&O Railroad', type: 'railroad', position: 25, price: 200, rent: [25, 50, 100, 200], mortgageValue: 100, color: '#000000' },
  { id: 35, name: 'Short Line', type: 'railroad', position: 35, price: 200, rent: [25, 50, 100, 200], mortgageValue: 100, color: '#000000' },
  
  // Utilities
  { id: 12, name: 'Electric Company', type: 'utility', position: 12, price: 150, rent: [4, 10], mortgageValue: 75, color: '#FFFFFF' },
  { id: 28, name: 'Water Works', type: 'utility', position: 28, price: 150, rent: [4, 10], mortgageValue: 75, color: '#FFFFFF' },
  
  // Special Squares
  { id: 0, name: 'GO', type: 'corner', position: 0, price: 0, rent: [0], mortgageValue: 0, color: '#32CD32' },
  { id: 2, name: 'Community Chest', type: 'card', position: 2, price: 0, rent: [0], mortgageValue: 0, color: '#87CEEB' },
  { id: 4, name: 'Income Tax', type: 'tax', position: 4, price: 0, rent: [200], mortgageValue: 0, color: '#FF6347' },
  { id: 7, name: 'Chance', type: 'card', position: 7, price: 0, rent: [0], mortgageValue: 0, color: '#FF6347' },
  { id: 10, name: 'Jail', type: 'corner', position: 10, price: 0, rent: [0], mortgageValue: 0, color: '#FFA500' },
  { id: 17, name: 'Community Chest', type: 'card', position: 17, price: 0, rent: [0], mortgageValue: 0, color: '#87CEEB' },
  { id: 20, name: 'Free Parking', type: 'corner', position: 20, price: 0, rent: [0], mortgageValue: 0, color: '#32CD32' },
  { id: 22, name: 'Chance', type: 'card', position: 22, price: 0, rent: [0], mortgageValue: 0, color: '#FF6347' },
  { id: 30, name: 'Go To Jail', type: 'corner', position: 30, price: 0, rent: [0], mortgageValue: 0, color: '#FF0000' },
  { id: 33, name: 'Community Chest', type: 'card', position: 33, price: 0, rent: [0], mortgageValue: 0, color: '#87CEEB' },
  { id: 36, name: 'Chance', type: 'card', position: 36, price: 0, rent: [0], mortgageValue: 0, color: '#FF6347' },
  { id: 38, name: 'Luxury Tax', type: 'tax', position: 38, price: 0, rent: [100], mortgageValue: 0, color: '#FF6347' }
];

export class MonopolyGameEngine {
  private gameState: MonopolyGameState;
  private onGameUpdate: (gameState: GameState, logEntry: GameEntry) => void;
  private gameLog: GameEntry[];
  private gameInterval: NodeJS.Timeout | null = null;
  private isRunning: boolean = false;

  constructor(onGameUpdate?: (gameState: GameState, logEntry: GameEntry) => void) {
    this.onGameUpdate = onGameUpdate || (() => {});
    this.gameLog = [];
    this.gameState = this.initializeGameState();
  }

  private initializeGameState(): MonopolyGameState {
    // Create themed player names for Monopoly
    const monopolyPlayers: Player[] = [
      { id: 'corpo-baron', name: 'Corpo Baron', money: 1500, position: 0, properties: [], inJail: false, jailTurns: 0, tokenId: 'baron-token', color: '#FF6B6B' },
      { id: 'crypto-whale', name: 'Crypto Whale', money: 1500, position: 0, properties: [], inJail: false, jailTurns: 0, tokenId: 'whale-token', color: '#4ECDC4' },
      { id: 'matrix-hacker', name: 'Matrix Hacker', money: 1500, position: 0, properties: [], inJail: false, jailTurns: 0, tokenId: 'hacker-token', color: '#45B7D1' },
      { id: 'neo-runner', name: 'Neo Runner', money: 1500, position: 0, properties: [], inJail: false, jailTurns: 0, tokenId: 'neo-token', color: '#F9CA24' }
    ];

    // Initialize properties with no owners
    const properties: Property[] = MONOPOLY_PROPERTIES.map(prop => ({
      ...prop,
      owner: null,
      mortgaged: false,
      houses: 0
    }));

    return {
      gameMode: GameMode.MONOPOLY,
      players: monopolyPlayers,
      currentPlayerIndex: 0,
      gameStatus: 'waiting',
      roundNumber: 1,
      properties: properties,
      diceRolls: [],
      bankMoney: 12500, // Starting bank money
      freeParkingPot: 0,
      chanceCards: [],
      communityChestCards: [],
      currentCard: null
    };
  }

  public startGameLoop(speed: number): void {
    this.logEntry('MONOPOLY_START', '🎲 Starting Monopoly simulation with AI players');
    this.isRunning = true;
    this.gameState.gameStatus = 'playing';

    // Start first turn immediately
    setTimeout(() => this.processNextTurn(), 100);

    // Set up game loop
    this.gameInterval = setInterval(() => {
      if (this.isRunning && this.gameState.gameStatus === 'playing') {
        this.processNextTurn();
      }
    }, speed);

    this.onGameUpdate(this.gameState, new GameEntry(0, 'SYSTEM', 'GAME_START', '🎮 Monopoly game has begun! May the best AI win!'));
  }

  public stopGameLoop(): void {
    this.isRunning = false;
    if (this.gameInterval) {
      clearInterval(this.gameInterval);
      this.gameInterval = null;
    }
    this.logEntry('MONOPOLY_STOP', 'Monopoly simulation paused');
  }

  private processNextTurn(): void {
    const currentPlayer = this.gameState.players[this.gameState.currentPlayerIndex];
    if (!currentPlayer) return;

    // Handle jail
    if (currentPlayer.inJail) {
      this.handleJailTurn(currentPlayer);
      return;
    }

    // Roll dice
    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;
    const totalMove = dice1 + dice2;
    const isDoubles = dice1 === dice2;

    this.gameState.diceRolls = [dice1, dice2];

    // Move player
    const oldPosition = currentPlayer.position;
    currentPlayer.position = (currentPlayer.position + totalMove) % 40;

    this.logEntry('DICE_ROLL', `🎲 ${currentPlayer.name} rolled ${dice1}+${dice2}=${totalMove} and moved to position ${currentPlayer.position}`);

    // Check if passed GO
    if (currentPlayer.position < oldPosition) {
      currentPlayer.money += 200;
      this.logEntry('PASS_GO', `💰 ${currentPlayer.name} passed GO! Collected $200`);
    }

    // Handle landing on square
    this.handleLandingOnSquare(currentPlayer);

    // Handle doubles
    if (isDoubles) {
      this.logEntry('DOUBLES', `🎲 DOUBLES! ${currentPlayer.name} gets another turn`);
      // Don't change player for doubles
    } else {
      // Move to next player
      this.gameState.currentPlayerIndex = (this.gameState.currentPlayerIndex + 1) % this.gameState.players.length;
    }

    this.gameState.roundNumber++;

    // Check for game end conditions
    this.checkGameEndConditions();

    // Update UI
    this.onGameUpdate(this.gameState, new GameEntry(this.gameState.roundNumber, currentPlayer.name, 'TURN_COMPLETE', `Turn completed`));
  }

  private handleLandingOnSquare(player: Player): void {
    const property = this.gameState.properties.find(p => p.position === player.position);
    if (!property) return;

    switch (property.type) {
      case 'property':
      case 'railroad':
      case 'utility':
        this.handlePropertyLanding(player, property);
        break;
      case 'tax':
        this.handleTaxSquare(player, property);
        break;
      case 'card':
        this.handleCardSquare(player, property);
        break;
      case 'corner':
        this.handleCornerSquare(player, property);
        break;
    }
  }

  private handlePropertyLanding(player: Player, property: Property): void {
    if (!property.owner) {
      // Property is unowned - AI decides whether to buy
      if (this.shouldAIBuyProperty(player, property)) {
        this.buyProperty(player, property);
      } else {
        this.logEntry('PROPERTY_PASS', `🏠 ${player.name} chose not to buy ${property.name}`);
      }
    } else if (property.owner.id !== player.id && !property.mortgaged) {
      // Pay rent to owner
      const rent = this.calculateRent(property);
      if (player.money >= rent) {
        player.money -= rent;
        property.owner.money += rent;
        this.logEntry('RENT_PAID', `💸 ${player.name} paid $${rent} rent to ${property.owner.name} for ${property.name}`);
      } else {
        this.logEntry('BANKRUPT', `💀 ${player.name} cannot afford $${rent} rent! Bankruptcy proceedings...`);
        this.handleBankruptcy(player, property.owner);
      }
    } else if (property.owner.id === player.id) {
      this.logEntry('OWN_PROPERTY', `🏠 ${player.name} landed on their own property: ${property.name}`);
    }
  }

  private shouldAIBuyProperty(player: Player, property: Property): boolean {
    // Simple AI logic: buy if player has enough money and property is reasonably priced
    const minCashReserve = 500; // Keep some cash for rent
    const maxSpendRatio = 0.4; // Don't spend more than 40% of money on one property
    
    return player.money >= property.price + minCashReserve && 
           property.price <= player.money * maxSpendRatio;
  }

  private buyProperty(player: Player, property: Property): void {
    if (player.money >= property.price) {
      player.money -= property.price;
      property.owner = player;
      player.properties.push(property);
      this.gameState.bankMoney += property.price;
      
      this.logEntry('PROPERTY_BOUGHT', `🏠 ${player.name} bought ${property.name} for $${property.price}`);
    }
  }

  private calculateRent(property: Property): number {
    if (property.type === 'railroad') {
      const railroadsOwned = property.owner?.properties.filter(p => p.type === 'railroad').length || 0;
      return property.rent[Math.min(railroadsOwned - 1, 3)] || 0;
    } else if (property.type === 'utility') {
      const utilitiesOwned = property.owner?.properties.filter(p => p.type === 'utility').length || 0;
      const multiplier = utilitiesOwned === 1 ? 4 : 10;
      const diceRoll = this.gameState.diceRolls.reduce((sum, die) => sum + die, 0);
      return diceRoll * multiplier;
    } else {
      // Regular property
      return property.rent[property.houses] || property.rent[0];
    }
  }

  private handleTaxSquare(player: Player, property: Property): void {
    const taxAmount = property.rent[0];
    player.money -= taxAmount;
    this.gameState.freeParkingPot += taxAmount;
    this.logEntry('TAX_PAID', `💸 ${player.name} paid $${taxAmount} in taxes`);
  }

  private handleCardSquare(player: Player, property: Property): void {
    const cardType = property.name.includes('Chance') ? 'Chance' : 'Community Chest';
    const actions = [
      'Advance to GO (Collect $200)',
      'Pay poor tax of $15',
      'Your building loan matures. Collect $150',
      'Get out of jail free',
      'Go to jail directly',
      'Collect $50 from every player',
      'Pay school fees of $150'
    ];
    
    const randomAction = actions[Math.floor(Math.random() * actions.length)];
    
    if (randomAction.includes('Collect $200')) {
      player.position = 0;
      player.money += 200;
    } else if (randomAction.includes('Pay poor tax')) {
      player.money -= 15;
      this.gameState.freeParkingPot += 15;
    } else if (randomAction.includes('Collect $150')) {
      player.money += 150;
    } else if (randomAction.includes('Go to jail')) {
      player.position = 10;
      player.inJail = true;
      player.jailTurns = 0;
    }
    
    this.logEntry('CARD_DRAWN', `🎴 ${player.name} drew ${cardType}: ${randomAction}`);
  }

  private handleCornerSquare(player: Player, property: Property): void {
    switch (property.name) {
      case 'GO':
        player.money += 200;
        this.logEntry('LANDED_GO', `🎯 ${player.name} landed exactly on GO! Collect $400 total`);
        break;
      case 'Free Parking':
        if (this.gameState.freeParkingPot > 0) {
          player.money += this.gameState.freeParkingPot;
          this.logEntry('FREE_PARKING', `🅿️ ${player.name} collected $${this.gameState.freeParkingPot} from Free Parking!`);
          this.gameState.freeParkingPot = 0;
        } else {
          this.logEntry('FREE_PARKING', `🅿️ ${player.name} rested at Free Parking`);
        }
        break;
      case 'Go To Jail':
        player.position = 10;
        player.inJail = true;
        player.jailTurns = 0;
        this.logEntry('GO_TO_JAIL', `👮 ${player.name} was sent directly to jail!`);
        break;
      case 'Jail':
        this.logEntry('VISITING_JAIL', `👀 ${player.name} is just visiting jail`);
        break;
    }
  }

  private handleJailTurn(player: Player): void {
    player.jailTurns++;
    
    if (player.jailTurns >= 3) {
      // Must pay to get out after 3 turns
      player.money -= 50;
      player.inJail = false;
      player.jailTurns = 0;
      this.logEntry('JAIL_PAYMENT', `💰 ${player.name} paid $50 to get out of jail after 3 turns`);
    } else {
      // Try to roll doubles
      const dice1 = Math.floor(Math.random() * 6) + 1;
      const dice2 = Math.floor(Math.random() * 6) + 1;
      
      if (dice1 === dice2) {
        player.inJail = false;
        player.jailTurns = 0;
        this.logEntry('JAIL_DOUBLES', `🎲 ${player.name} rolled doubles and escaped jail!`);
        // Continue with normal turn
        this.processNextTurn();
        return;
      } else {
        this.logEntry('JAIL_STAY', `🔒 ${player.name} failed to roll doubles (${dice1}, ${dice2}). Stays in jail.`);
      }
    }
    
    // Move to next player
    this.gameState.currentPlayerIndex = (this.gameState.currentPlayerIndex + 1) % this.gameState.players.length;
  }

  private handleBankruptcy(bankruptPlayer: Player, creditor: Player): void {
    // Transfer all properties to creditor
    bankruptPlayer.properties.forEach(property => {
      property.owner = creditor;
      creditor.properties.push(property);
    });
    
    // Transfer remaining money
    creditor.money += bankruptPlayer.money;
    bankruptPlayer.money = 0;
    bankruptPlayer.properties = [];
    
    this.logEntry('BANKRUPTCY', `💀 ${bankruptPlayer.name} went bankrupt! All assets transferred to ${creditor.name}`);
    
    // Remove bankrupt player
    this.gameState.players = this.gameState.players.filter(p => p.id !== bankruptPlayer.id);
    
    // Adjust current player index
    if (this.gameState.currentPlayerIndex >= this.gameState.players.length) {
      this.gameState.currentPlayerIndex = 0;
    }
  }

  private checkGameEndConditions(): void {
    const activePlayers = this.gameState.players.filter(p => p.money > 0);
    
    if (activePlayers.length === 1) {
      this.gameState.gameStatus = 'ended';
      this.stopGameLoop();
      this.logEntry('GAME_END', `🏆 ${activePlayers[0].name} wins the game!`);
    } else if (this.gameState.roundNumber > 500) {
      // End game after 500 rounds to prevent infinite games
      const richestPlayer = this.gameState.players.reduce((richest, player) => 
        this.calculateNetWorth(player) > this.calculateNetWorth(richest) ? player : richest
      );
      this.gameState.gameStatus = 'ended';
      this.stopGameLoop();
      this.logEntry('GAME_END', `⏰ Game ended after 500 rounds! ${richestPlayer.name} wins with highest net worth!`);
    }
  }

  private calculateNetWorth(player: Player): number {
    const propertyValue = player.properties.reduce((total, property) => 
      total + property.price + (property.houses * (property.housesPrice || 0)), 0
    );
    return player.money + propertyValue;
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
    this.logEntry('MONOPOLY_RESET', 'Monopoly game has been reset');
  }

  public adjustSpeed(speed: number): void {
    if (this.gameInterval) {
      this.stopGameLoop();
      this.startGameLoop(speed);
    }
  }

  // Additional utility methods for UI integration
  public getProperty(position: number): Property | undefined {
    return this.gameState.properties.find(p => p.position === position);
  }

  public getPlayerProperties(playerId: string): Property[] {
    return this.gameState.properties.filter(p => p.owner?.id === playerId);
  }

  public getPlayerNetWorth(playerId: string): number {
    const player = this.gameState.players.find(p => p.id === playerId);
    return player ? this.calculateNetWorth(player) : 0;
  }
}

export default MonopolyGameEngine;