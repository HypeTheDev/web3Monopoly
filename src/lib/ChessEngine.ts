import { GameState, GameMode, ChessGameState, ChessPiece, ChessMove, GameEntry } from '../types/GameTypes';

export class ChessGameEngine {
  private gameState: ChessGameState;
  private onGameUpdate: (gameState: GameState, logEntry: GameEntry) => void;
  private gameLog: GameEntry[];
  private gameInterval: NodeJS.Timeout | null = null;
  private isRunning: boolean = false;

  constructor(onGameUpdate?: (gameState: GameState, logEntry: GameEntry) => void) {
    this.onGameUpdate = onGameUpdate || (() => {});
    this.gameLog = [];
    this.gameState = this.initializeGameState();
  }

  private initializeGameState(): ChessGameState {
    // Initialize 4-player chess board (8x8 with center hill)
    const board: ChessPiece[][] = Array(8).fill(null).map(() => Array(8).fill(null));
    
    // Create 4 kings for 4-player variant
    const kings = {
      'red': { id: 'red-king', type: 'king' as const, color: 'red' as const, position: { row: 0, col: 3 }, captured: false, hasMoved: false },
      'blue': { id: 'blue-king', type: 'king' as const, color: 'blue' as const, position: { row: 7, col: 4 }, captured: false, hasMoved: false },
      'green': { id: 'green-king', type: 'king' as const, color: 'green' as const, position: { row: 0, col: 4 }, captured: false, hasMoved: false },
      'yellow': { id: 'yellow-king', type: 'king' as const, color: 'yellow' as const, position: { row: 7, col: 3 }, captured: false, hasMoved: false }
    };

    // Place kings on board
    board[0][3] = kings.red;
    board[7][4] = kings.blue;
    board[0][4] = kings.green;
    board[7][3] = kings.yellow;

    return {
      gameMode: GameMode.CHESS,
      players: [
        { id: 'red-player', name: 'Red Commander', money: 0, position: 0, properties: [], inJail: false, jailTurns: 0, tokenId: 'red-token', color: '#FF0000' },
        { id: 'blue-player', name: 'Blue Admiral', money: 0, position: 0, properties: [], inJail: false, jailTurns: 0, tokenId: 'blue-token', color: '#0000FF' },
        { id: 'green-player', name: 'Green General', money: 0, position: 0, properties: [], inJail: false, jailTurns: 0, tokenId: 'green-token', color: '#00FF00' },
        { id: 'yellow-player', name: 'Yellow Captain', money: 0, position: 0, properties: [], inJail: false, jailTurns: 0, tokenId: 'yellow-token', color: '#FFFF00' }
      ],
      currentPlayerIndex: 0,
      gameStatus: 'waiting',
      roundNumber: 1,
      board: board,
      pieces: new Map(),
      moveHistory: [],
      kings: kings,
      currentKingOfHill: null,
      hillPosition: { row: 3, col: 3 }, // Center of 8x8 board
      gamePhase: 'setup',
      capturedPieces: []
    };
  }

  public startGameLoop(speed: number): void {
    this.logEntry('CHESS_START', '♔ Starting 4-player King of the Hill Chess...');
    this.isRunning = true;
    this.gameState.gameStatus = 'playing';
    this.gameState.gamePhase = 'main';

    // Demo AI moves
    this.gameInterval = setInterval(() => {
      if (this.isRunning && this.gameState.gameStatus === 'playing') {
        this.processAITurn();
      }
    }, speed);

    this.onGameUpdate(this.gameState, new GameEntry(0, 'SYSTEM', 'CHESS_START', '♔ King of the Hill Chess begins! First to reach the center wins!'));
  }

  public stopGameLoop(): void {
    this.isRunning = false;
    if (this.gameInterval) {
      clearInterval(this.gameInterval);
      this.gameInterval = null;
    }
    this.logEntry('CHESS_STOP', 'Chess game paused');
  }

  private processAITurn(): void {
    const currentPlayer = this.gameState.players[this.gameState.currentPlayerIndex];
    const playerColor = ['red', 'blue', 'green', 'yellow'][this.gameState.currentPlayerIndex];
    
    // Demo: Random move simulation
    const moves = ['advances toward center', 'captures enemy piece', 'defends king', 'strategic positioning'];
    const randomMove = moves[Math.floor(Math.random() * moves.length)];
    
    this.logEntry('CHESS_MOVE', `♔ ${currentPlayer.name} ${randomMove}`);

    // Check if someone reached the hill (demo logic)
    if (Math.random() < 0.05) { // 5% chance per turn
      this.gameState.currentKingOfHill = playerColor;
      this.gameState.gameStatus = 'ended';
      this.stopGameLoop();
      this.logEntry('KING_OF_HILL', `👑 ${currentPlayer.name} has conquered the hill and wins the game!`);
      return;
    }

    // Move to next player
    this.gameState.currentPlayerIndex = (this.gameState.currentPlayerIndex + 1) % this.gameState.players.length;
    this.gameState.roundNumber++;

    this.onGameUpdate(this.gameState, new GameEntry(this.gameState.roundNumber, currentPlayer.name, 'TURN_COMPLETE', 'Chess turn completed'));
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
    this.logEntry('CHESS_RESET', 'Chess game has been reset');
  }

  public adjustSpeed(speed: number): void {
    if (this.gameInterval) {
      this.stopGameLoop();
      this.startGameLoop(speed);
    }
  }
}

export default ChessGameEngine;