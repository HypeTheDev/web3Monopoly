import React, { useState, useEffect } from 'react';
import './App.css';

// Game components
import GameBoard from './components/GameBoard';
import PlayerInfo from './components/PlayerInfo';
import MusicPlayer from './components/MusicPlayer';
import PropertyModal from './components/PropertyModal';
import ColorPicker from './components/ColorPicker';
import MatrixRain from './components/MatrixRain';
import WorldNews from './components/WorldNews';
import DBADashboard from './components/DBADashboard';
import AdBox from './components/AdBox';

// Game Engine
import { MonopolyGameEngine, DBAEngine } from './lib/GameEngine';
import { GameEntry, GameMode } from './types/GameTypes';

// Types
import { Property, GameState, TerminalTheme, MonopolyGameState, DBAGameState } from './types/GameTypes';

function App() {
  const [gameEngine, setGameEngine] = useState<MonopolyGameEngine | DBAEngine | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [currentGameMode, setCurrentGameMode] = useState<GameMode>(GameMode.MONOPOLY);
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [gameSpeed, setGameSpeed] = useState(1000);
  const [recentLogs, setRecentLogs] = useState<GameEntry[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showLogs, setShowLogs] = useState(true);
  const [showWorldNews, setShowWorldNews] = useState(false);

  const [terminalTheme, setTerminalTheme] = useState<TerminalTheme>({
    primaryColor: '#00ff00',
    secondaryColor: '#ffff00',
    backgroundColor: '#000000',
    panelColor: '#111111',
    borderColor: '#333333',
    textColor: '#00ff00'
  });

  const switchGameMode = (newMode: GameMode) => {
    if (gameEngine && isGameRunning) {
      gameEngine.stopGameLoop();
      setIsGameRunning(false);
    }

    setCurrentGameMode(newMode);
    let engine: MonopolyGameEngine | DBAEngine;

    if (newMode === GameMode.DBA) {
      engine = new DBAEngine((gameState: GameState, logEntry: GameEntry) => {
        setGameState(gameState);
        setRecentLogs(prev => [logEntry, ...prev.slice(0, 19)]);
      });
      setGameEngine(engine);
    } else {
      engine = new MonopolyGameEngine((gameState: GameState, logEntry: GameEntry) => {
        setGameState(gameState);
        setRecentLogs(prev => [logEntry, ...prev.slice(0, 19)]);
      });
      setGameEngine(engine);
    }
    setGameState(engine.getGameState());
    setRecentLogs([]);
  };

  // Initialize game engine
  useEffect(() => {
    if (!gameEngine) {
      switchGameMode(GameMode.MONOPOLY); // Start with Monopoly by default
    }
  }, [gameEngine]); // Removed switchGameMode from deps to avoid infinite loop

  // Update CSS custom properties when theme changes
  useEffect(() => {
    const root = document.documentElement;
    Object.entries(terminalTheme).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
  }, [terminalTheme]);

  const handleColorChange = (key: keyof TerminalTheme, color: string) => {
    setTerminalTheme(prev => ({
      ...prev,
      [key]: color
    }));
  };

  const startGame = () => {
    if (gameEngine && !isGameRunning) {
      gameEngine.startGameLoop(gameSpeed);
      setIsGameRunning(true);
    }
  };

  const stopGame = () => {
    if (gameEngine && isGameRunning) {
      gameEngine.stopGameLoop();
      setIsGameRunning(false);
    }
  };

  const changeSpeed = (newSpeed: number) => {
    setGameSpeed(newSpeed);
    if (gameEngine && isGameRunning) {
      gameEngine.adjustSpeed(newSpeed);
    }
  };

  const resetGame = () => {
    if (gameEngine) {
      gameEngine.stopGameLoop();

      let engine: MonopolyGameEngine | DBAEngine;

      if (currentGameMode === GameMode.DBA) {
        engine = new DBAEngine((gameState: GameState, logEntry: GameEntry) => {
          setGameState(gameState);
          setRecentLogs(prev => [logEntry, ...prev.slice(0, 19)]);
        });
        setGameEngine(engine);
      } else {
        engine = new MonopolyGameEngine((gameState: GameState, logEntry: GameEntry) => {
          setGameState(gameState);
          setRecentLogs(prev => [logEntry, ...prev.slice(0, 19)]);
        });
        setGameEngine(engine);
      }

      setGameState(engine.getGameState());
      setIsGameRunning(false);
      setRecentLogs([]);
    }
  };

  const currentPlayer = gameState?.players[gameState?.currentPlayerIndex] || null;

  return (
    <div className="App" style={{
      '--primary-color': terminalTheme.primaryColor,
      '--secondary-color': terminalTheme.secondaryColor,
      '--background-color': terminalTheme.backgroundColor,
      '--panel-color': terminalTheme.panelColor,
      '--border-color': terminalTheme.borderColor,
    } as React.CSSProperties}>

      {/* Game Header */}
      <header className="game-header">
        <div className="game-title">
          <h1>BkM</h1>
        </div>
        <div className="header-controls">
          <select
            value={currentGameMode}
            onChange={(e) => switchGameMode(e.target.value as GameMode)}
            className="game-mode-selector"
            style={{
              backgroundColor: 'var(--panel-color)',
              border: '1px solid var(--primary-color)',
              color: 'var(--primary-color)',
              padding: '0.5rem',
              marginRight: '1rem',
              fontFamily: 'monospace'
            }}
          >
            <option value={GameMode.MONOPOLY}>MONOPOLY</option>
            <option value={GameMode.SPADES}>SPADES (Coming Soon)</option>
            <option value={GameMode.CHESS}>CHESS (Coming Soon)</option>
            <option value={GameMode.DBA}>⚡ DBA ⚡</option>
          </select>

          <button
            className="action-btn info"
            onClick={() => setShowWorldNews(true)}
          >
            NEWS
          </button>
          <button
            className="theme-button"
            onClick={() => setShowColorPicker(true)}
          >
            THEME
          </button>
          <button
            className="settings-button"
            onClick={() => setShowLogs(!showLogs)}
          >
            {showLogs ? 'LOGS' : 'NO_LOG'}
          </button>
        </div>
      </header>

      {/* AI Status Panel */}
      <div className="ai-status-panel">
        <div className="status-indicators">
          <span>ENGINE: {isGameRunning ? 'ON' : 'OFF'}</span>
          <span>BOTS: 4</span>
          <span>SPEED: {gameSpeed / 1000}s</span>
          <span>ROUND: {gameState?.roundNumber || 0}</span>
        </div>
        <div className="ai-controls">
          {!isGameRunning ? (
            <button className="action-btn" onClick={startGame}>START</button>
          ) : (
            <button className="action-btn danger" onClick={stopGame}>STOP</button>
          )}
          <button className="action-btn" onClick={resetGame}>RESET</button>
          <select
            value={gameSpeed}
            onChange={(e) => changeSpeed(parseInt(e.target.value))}
            className="speed-selector"
          >
            <option value="2000">SLOW</option>
            <option value="1000">NORM</option>
            <option value="500">FAST</option>
            <option value="250">MAX</option>
          </select>
        </div>
      </div>

      {/* Main Game Area */}
      <main className="game-main">
        <div className="demo-container">
          {/* Left Panel - Player Info */}
          <div className="game-left-panel">
            {gameState && (
              <PlayerInfo
                players={gameState.players}
                currentPlayerIndex={gameState.currentPlayerIndex}
              />
            )}

            {/* Music Player */}
            <div className="music-panel">
              <MusicPlayer />
            </div>

            {/* Current Game State */}
            <div className="game-state-panel">
              <h4>{gameState?.gameMode?.toUpperCase() || 'GAME_STATE'}</h4>
              <div className="state-info">
                {gameState?.gameMode === 'monopoly' && 'properties' in gameState ? (
                  <>
                    <div>BANK: ${(gameState as MonopolyGameState).bankMoney || 0}</div>
                    <div>FREE: ${(gameState as MonopolyGameState).freeParkingPot || 0}</div>
                    <div>OWNED: {gameState.properties.filter(p => p.owner).length}</div>
                  </>
                ) : gameState?.gameMode === 'spades' && 'score' in gameState ? (
                  <>
                    <div>TEAM 1: {gameState.score.team1}</div>
                    <div>TEAM 2: {gameState.score.team2}</div>
                    <div>TRICKS: {Object.values(gameState.tricks).reduce((a, b) => a + b, 0)}</div>
                  </>
                ) : gameState?.gameMode === 'chess' ? (
                  <div>CHESS - KING OF THE HILL</div>
                ) : null}
              </div>
            </div>
          </div>

          {/* Center Panel - Game Board */}
          <div className="game-center-panel">
            {gameState?.gameMode === 'monopoly' && 'properties' in gameState && (
              <GameBoard
                properties={(gameState as MonopolyGameState).properties}
                onPropertyClick={(property) => {
                  setSelectedProperty(property);
                  setShowPropertyModal(true);
                }}
                gameState={gameState}
              />
            )}

            {gameState?.gameMode === GameMode.DBA && 'league' in gameState && gameState.league && (
              <DBADashboard
                gameState={gameState as DBAGameState}
                onViewChange={(view) => {
                  // Handle view changes in DBA by directly updating the game state
                  if (gameState && gameState instanceof Object && 'currentView' in gameState) {
                    gameState.currentView = view;
                    // Force a state update by creating new object reference
                    setGameState({...gameState} as DBAGameState);
                  }
                }}
                onAdvanceWeek={() => {
                  if (gameEngine && gameEngine instanceof DBAEngine) {
                    gameEngine.advanceWeek();
                  }
                }}
              />
            )}

            {gameState?.gameMode === 'spades' && 'teams' in gameState && (
              <div className="spades-board">
                <h3>Spades Game Board - Coming Soon!</h3>
                <div className="game-status">
                  Phase: Bidding & Playing System Ready
                </div>
              </div>
            )}

            {gameState?.gameMode === 'chess' && (
              <div className="chess-board">
                <h3>Chess (King of the Hill) - Coming Soon!</h3>
                <div className="game-status">
                  Phase: Multi-player Board System Ready
                </div>
              </div>
            )}

            {(!gameState || (!('properties' in gameState) && !('teams' in gameState) && !('league' in gameState))) && (
              <div className="loading-board">
                <h3>Game Board Loading...</h3>
              </div>
            )}
          </div>

            {/* Game Status Display */}
            <div className="game-status-display">
              <div className="status-line">
                CURRENT_PLAYER: {currentPlayer?.name || 'NONE'}
              </div>
              <div className="status-line">
                POSITION: {currentPlayer?.position || 0}
              </div>
              <div className="status-line">
                {gameState?.gameMode === 'monopoly' && 'diceRolls' in gameState
                  ? `DICE_LAST: ${(gameState as MonopolyGameState).diceRolls.map((d: number) => `[${d}]`).join('') || 'NONE'}`
                  : gameState?.gameMode === 'spades' && 'tricks' in gameState
                  ? `TRICK_COUNT: ${Object.values(gameState.tricks).reduce((a: number, b: number) => a + b, 0) || 0}`
                  : 'STATUS: ACTIVE'}
              </div>
              <div className="status-line">
                WEB3_CONNECTION: {currentPlayer?.tokenId ? 'CONNECTED' : 'OFFLINE'}
              </div>
            </div>

          {/* Right Panel - Live Logs */}
          <div className={`game-right-panel ${showLogs ? '' : 'hidden'}`}>
            <div className="logs-header">
              <h4>LIVE_GAME_LOGS</h4>
              <button
                className="clear-logs-btn"
                onClick={() => setRecentLogs([])}
              >
                CLEAR
              </button>
            </div>

            <div className="logs-container">
              {recentLogs.length === 0 ? (
                <div className="no-logs">NO_GAME_DATA_YET</div>
              ) : (
                recentLogs.map((log, index) => (
                  <div key={`${log.timestamp}-${index}`} className="log-entry">
                    <span className="log-turn">[{log.turn}]</span>
                    <span className="log-player">{log.playerName}</span>
                    <span className="log-action">: {log.details}</span>
                  </div>
                ))
              )}
            </div>

            {/* Only show simplified stats */}
            <div className="data-summary">
              <h5>STATS</h5>
              <div className="summary-data">
                <div>TURNS: {recentLogs.length}</div>
                <div>AI: {recentLogs.filter(l => l.actionType === 'BUY_PROPERTY' || l.actionType === 'TRADE').length}</div>
                <div>OWNED: {gameState && gameState.gameMode === 'monopoly' && 'properties' in gameState ? gameState.properties.filter((p: Property) => p.owner).length : 0}</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      {showPropertyModal && selectedProperty && (
        <PropertyModal
          property={selectedProperty}
          currentPlayer={currentPlayer || (gameState ? gameState.players[0] : null)}
          onClose={() => setShowPropertyModal(false)}
          onBuy={() => setShowPropertyModal(false)}
          onMortgageToggle={() => setShowPropertyModal(false)}
        />
      )}

      {showColorPicker && (
        <ColorPicker
          theme={terminalTheme}
          onColorChange={handleColorChange}
          onClose={() => setShowColorPicker(false)}
        />
      )}

      {showWorldNews && (
        <WorldNews
          isVisible={showWorldNews}
          onClose={() => setShowWorldNews(false)}
        />
      )}

      {/* Matrix background effect */}
      <MatrixRain />

      {/* Ad Box - slideshow in bottom right */}
      <AdBox />

      {/* Footer - simplified */}
      <footer className="terminal-footer">
        <div className="network-status">BkM Terminal v1.0 | © Neo's Property Matrix</div>
      </footer>
    </div>
  );
}

export default App;
