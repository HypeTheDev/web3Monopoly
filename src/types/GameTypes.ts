// Multi-Game Web3 Game Types

export enum GameMode {
  MONOPOLY = 'monopoly',
  SPADES = 'spades',
  CHESS = 'chess'
}

export const GAME_MODE_NAMES = {
  [GameMode.MONOPOLY]: 'Monopoly',
  [GameMode.SPADES]: 'Spades (2v2)',
  [GameMode.CHESS]: 'Chess (King of the Hill)'
};

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

// Base Game State Interface - Polymorphic for different game modes
export interface BaseGameState {
  gameMode: GameMode;
  players: Player[];
  currentPlayerIndex: number;
  gameStatus: 'waiting' | 'playing' | 'ended';
  roundNumber: number;
}

// Monopoly Game State
export interface MonopolyGameState extends BaseGameState {
  properties: Property[];
  diceRolls: number[];
  bankMoney: number;
  freeParkingPot: number;
  chanceCards: ChanceCard[];
  communityChestCards: ChanceCard[];
  currentCard: ChanceCard | null;
}

// Spades Game State (2v2 variant with Balatro-inspired features)
export interface SpadesGameState extends BaseGameState {
  teams: {
    team1: [string, string]; // Player IDs
    team2: [string, string]; // Player IDs
  };
  currentDealer: number; // Index of dealer
  currentTrick: SpadesCard[];
  bidPhase: boolean;
  playPhase: boolean;
  bids: Record<string, number>; // Player ID to bid amount
  tricks: Record<string, number>; // Player ID to number of tricks taken
  spadesBroken: boolean;
  deck: SpadesCard[];
  hands: Record<string, SpadesCard[]>; // Player ID to their cards
  trickHistory: SpadesTrick[];
  score: {
    team1: number;
    team2: number;
  };
}

// Chess Game State (4-player King of the Hill variant)
export interface ChessGameState extends BaseGameState {
  board: ChessPiece[][];
  pieces: Map<string, ChessPiece>; // Piece ID to piece
  moveHistory: ChessMove[];
  kings: {
    'red': ChessPiece;
    'blue': ChessPiece;
    'green': ChessPiece;
    'yellow': ChessPiece;
  };
  currentKingOfHill: string | null; // Piece ID of current king on hill
  hillPosition: { row: number; col: number };
  gamePhase: 'setup' | 'main' | 'endgame';
  capturedPieces: ChessPiece[];
}

// Union type for all game states
export type GameState = MonopolyGameState | SpadesGameState | ChessGameState;

// Game-specific types and interfaces

// Spades game types
export interface SpadesCard {
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
  rank: number; // 2-14 (Ace is 14)
  id: string;
}

export interface SpadesTrick {
  cards: SpadesCard[];
  winner: string; // Player ID
  points: number;
}

// Chess game types
export type ChessPieceType = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';

export interface ChessPosition {
  row: number;
  col: number;
}

export interface ChessPiece {
  id: string;
  type: ChessPieceType;
  color: 'red' | 'blue' | 'green' | 'yellow';
  position: ChessPosition;
  hasMoved: boolean;
  captured: boolean;
}

export interface ChessMove {
  pieceId: string;
  from: ChessPosition;
  to: ChessPosition;
  capturedPiece?: string;
  timestamp: number;
}

// Backward compatibility - keep the original interface for Monopoly
export interface LegacyGameState {
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
