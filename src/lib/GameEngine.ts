import { GameState, GameEntry } from '../types/GameTypes';

// Import new functional game engines
import MonopolyGameEngine from './MonopolyEngine';
import DBAEngine from './DBAEngine';
import ChessGameEngine from './ChessEngine';
import SpadesGameEngine from './SpadesEngine';

// Export the new engines
export { MonopolyGameEngine, DBAEngine, ChessGameEngine, SpadesGameEngine };

// Base Game Engine Interface (keep this for future engines)
export abstract class BaseGameEngine {
  protected gameState: GameState;
  protected onGameUpdate: (gameState: GameState, logEntry: GameEntry) => void;
  protected gameLog: GameEntry[];
  protected gameInterval: NodeJS.Timeout | null = null;
  protected isRunning: boolean = false;

  constructor(onGameUpdate?: (gameState: GameState, logEntry: GameEntry) => void) {
    this.onGameUpdate = onGameUpdate || (() => {});
    this.gameLog = [];
    this.gameState = this.initializeGameState();
  }

  // Abstract methods that must be implemented by subclasses
  abstract initializeGameState(): GameState;
  abstract startGameLoop(speed: number): void;
  abstract stopGameLoop(): void;
  abstract getGameState(): GameState;
  abstract resetGame(): void;
  abstract adjustSpeed(speed: number): void;

  // Common methods
  protected logEntry(actionType: string, details: string): void {
    const entry = new GameEntry(this.gameLog.length + 1, 'SYSTEM', actionType, details);
    this.gameLog.push(entry);
    this.onGameUpdate(this.gameState, entry);
  }

  public getGameLog(): GameEntry[] {
    return this.gameLog.slice();
  }
}