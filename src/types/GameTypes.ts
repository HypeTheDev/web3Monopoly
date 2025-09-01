// Multi-Game Web3 Game Types

export enum GameMode {
  MONOPOLY = 'monopoly',
  SPADES = 'spades',
  CHESS = 'chess',
  DBA = 'dba' // Digital Basketball Association
}

export const GAME_MODE_NAMES = {
  [GameMode.MONOPOLY]: 'Monopoly',
  [GameMode.SPADES]: 'Spades (2v2)',
  [GameMode.CHESS]: 'Chess (King of the Hill)',
  [GameMode.DBA]: 'Digital Basketball Association'
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

// NBA PLAYER TYPES for DBA mode
export interface NBAPlayer {
  id: string;
  name: string;
  team: string; // Real NBA team
  position: 'PG' | 'SG' | 'SF' | 'PF' | 'C';
  stats: {
    points: number;
    rebounds: number;
    assists: number;
    steals: number;
    blocks: number;
    fgPercent: number;
    threePercent: number;
    ftPercent: number;
  };
  contract: {
    team: string;
    salary: number;
    yearsLeft: number;
  };
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';
  value: number; // Current market value
}

// DBA Team management
export interface DBATeam {
  id: string;
  name: string;
  owner: string; // Player ID
  players: NBAPlayer[];
  startingLineup: {
    PG: NBAPlayer | null;
    SG: NBAPlayer | null;
    SF: NBAPlayer | null;
    PF: NBAPlayer | null;
    C: NBAPlayer | null;
  };
  bench: NBAPlayer[];
  budget: number;
  leagueRank: number;
  record: { wins: number; losses: number };
  totalValue: number;
}

// League structure
export interface DBALeague {
  season: number;
  currentWeek: number;
  standings: DBATeam[];
  schedule: DBAGame[];
  draftOrder: string[]; // Team IDs in draft order
  freeAgents: NBAPlayer[];
  activeTrades: DBATrade[];
}

// Game simulation
export interface DBAGame {
  id: string;
  homeTeam: DBATeam;
  awayTeam: DBATeam;
  date: Date;
  status: 'scheduled' | 'playing' | 'completed';
  result?: DBAGameResult;
  liveStats?: DBALiveStats;
}

export interface DBAGameResult {
  homeScore: number;
  awayScore: number;
  winner: DBATeam;
  mvp: {
    player: NBAPlayer;
    points: number;
    rebounds: number;
    assists: number;
  };
  playerStats: Record<string, NBAStatLine>;
}

export interface NBAStatLine {
  playerId: string;
  playerName: string;
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  fgm: number;
  fga: number;
  threePm: number;
  threePa: number;
  ftm: number;
  fta: number;
  minutes: number;
  plusMinus: number;
}

export interface DBALiveStats {
  quarter: number;
  timeRemaining: number; // seconds
  homeScore: number;
  awayScore: number;
  possession: 'home' | 'away';
  shotClock: number;
}

// Trading system
export interface DBATrade {
  id: string;
  fromTeam: string;
  toTeam: string;
  offeredPlayers: NBAPlayer[];
  offeredMoney: number;
  requestedPlayers: NBAPlayer[];
  requestedMoney: number;
  status: 'pending' | 'accepted' | 'rejected' | 'countered';
  createdAt: Date;
}

// Fantasy scoring and rankings
export interface LeagueRules {
  scoringSystem: {
    pointsMultiplier: number;
    reboundsMultiplier: number;
    assistsMultiplier: number;
    stealsMultiplier: number;
    blocksMultiplier: number;
    turnoversMultiplier: number;
    threesMadeBonus: number;
    doubleDoubleBonus: number;
    tripleDoubleBonus: number;
  };
  settings: {
    maxPlayersPerTeam: number;
    maxLineupSize: number;
    startingPositions: string[]; // PG, SG, SF, PF, C, etc.
    benchSize: number;
    salaryCap: number;
    tradeDeadline: Date;
  };
}

export interface PlayerRankings {
  byPoints: NBAPlayer[];
  byRebounds: NBAPlayer[];
  byAssists: NBAPlayer[];
  bySteals: NBAPlayer[];
  byBlocks: NBAPlayer[];
  byValue: NBAPlayer[];
  weekly: NBAStatLine[];
}

// Favtasy performance calculations
export interface DBAPlayerPerformance {
  playerId: string;
  week: number;
  totalPoints: number;
  averagePoints: number;
  gamesPlayed: number;
  streak: {
    wins: number;
    losses: number;
  };
  recentForm: number[]; // Last 5 games fantasy points
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

// DBA Game State
export interface DBAGameState extends BaseGameState {
  league: DBALeague;
  currentTeam: string; // Current user's team ID
  selectedPlayer?: NBAPlayer;
  currentView: 'dashboard' | 'roster' | 'trade' | 'draft' | 'leaderboard' | 'live-game';
  leagueRules: LeagueRules;
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
    team1: string[]; // Player IDs
    team2: string[]; // Player IDs
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
export type GameState = MonopolyGameState | SpadesGameState | ChessGameState | DBAGameState;

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

// Game Stats for logging and analysis
export interface GameStats {
  gameId: string;
  duration: number;
  winner: Player | DBATeam;
  finalBalances?: { name: string; money: number }[];
  totalTransactions: number;
  totalTurns: number;
  raceEndTime: number;
  teamStats?: {
    wins: number;
    losses: number;
    totalValue: number;
  }[];
}

// Game Log Entry Class
export class GameEntry {
  constructor(
    public turn: number,
    public playerName: string,
    public actionType: string,
    public details: string,
    public timestamp: number = Date.now()
  ) {}
}
