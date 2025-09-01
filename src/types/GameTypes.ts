// Monopoly Web3 Game Types

export interface Player {
  id: string;
  name: string;
  money: number;
  position: number;
  properties: Property[];
  inJail: boolean;
  jailTurns: number;
  tokenId: string; // Web3 token ID
  walletAddress?: string; // Optional for offline play
  avatar?: string;
  color: string; // Player color for UI(display)
}

export interface Property {
  id: number;
  name: string;
  type: 'property' | 'utility' | 'railroad' | 'card' | 'tax' | 'corner';
  position: number;
  price: number;
  rent: number[];
  mortgageValue: number;
  mortgaged: boolean;
  owner: Player | null;
  color: string;
  houses: number; // 0-4 houses, or 5 for hotel
  housesPrice?: number;
  hotelPrice?: number;
}

export interface ChanceCard {
  id: string;
  title: string;
  description: string;
  action: (player: Player, gameState: GameState) => void;
  type: 'chance' | 'community-chest';
}

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  properties: Property[];
  gameStatus: 'waiting' | 'playing' | 'ended';
  diceRolls: number[];
  bankMoney: number;
  freeParkingPot: number;
  roundNumber: number;
  chanceCards: ChanceCard[];
  communityChestCards: ChanceCard[];
  currentCard: ChanceCard | null;
}

export interface TradeOffer {
  fromPlayer: Player;
  toPlayer: Player;
  fromOffer: {
    money: number;
    properties: Property[];
  };
  toOffer: {
    money: number;
    properties: Property[];
  };
  status: 'pending' | 'accepted' | 'rejected';
}

export interface Web3Connection {
  isConnected: boolean;
  walletType: 'metamask' | 'walletconnect' | 'phantom' | null;
  accountAddress: string | null;
  chainId: number | null;
  marketContractAddress: string;
  gameContractAddress: string;
}

// Theme interface for terminal customization
export interface TerminalTheme {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  panelColor: string;
  borderColor: string;
  textColor: string;
}

// Business mechanics for complex economy
export interface BusinessMechanic {
  id: string;
  name: string;
  description: string;
  activationCost: number;
  upkeepCost: number;
  revenueMultiplier: number;
  active: boolean;
}

export interface PlayerBusiness {
  playerId: string;
  businesses: BusinessMechanic[];
  totalRevenue: number;
  marketShare: number;
}

// For decentralized features
export interface SmartContractData {
  gameId: string;
  currentOwner: string;
  salePrice: number;
  rentalHistory: Array<{
    timestamp: number;
    player: string;
    amount: number;
  }>;
}
