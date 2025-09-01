import React, { useState, useEffect } from 'react';
import './App.css';

// Game components
import GameBoard from './components/GameBoard';
import PlayerInfo from './components/PlayerInfo';
import MusicPlayer from './components/MusicPlayer';
import PropertyModal from './components/PropertyModal';
import ColorPicker from './components/ColorPicker';
import MatrixRain from './components/MatrixRain';

// Game Engine
import { MonopolyGameEngine, GameEntry } from './lib/GameEngine';

// Types
import { Property, GameState, TerminalTheme } from './types/GameTypes';

function App() {
  const [gameEngine, setGameEngine] = useState<MonopolyGameEngine | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [gameSpeed, setGameSpeed] = useState(1000);
  const [recentLogs, setRecentLogs] = useState<GameEntry[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showLogs, setShowLogs] = useState(true);

  const [terminalTheme, setTerminalTheme] = useState<TerminalTheme>({
    primaryColor: '#00ff00',
    secondaryColor: '#ffff00',
    backgroundColor: '#000000',
    panelColor: '#111111',
    borderColor: '#333333',
    textColor: '#00ff00'
  });

  // Initialize game engine
  useEffect(() => {
    const engine = new MonopolyGameEngine(500, (gameState, logEntry) => {
      setGameState(gameState);
      setRecentLogs(prev => [logEntry, ...prev.slice(0, 19)]); // Keep last 20 entries
    });
    setGameEngine(engine);
    setGameState(engine.getGameState());
  }, []);

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
      const engine = new MonopolyGameEngine(500, (gameState, logEntry) => {
        setGameState(gameState);
        setRecentLogs(prev => [logEntry, ...prev.slice(0, 19)]);
      });
      setGameEngine(engine);
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
          <h1>MONOPOLY WEB3 TERMINAL</h1>
          <div className="terminal-indicator">[AI DEMO MODE]</div>
        </div>
        <div className="header-controls">
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
            {showLogs ? 'HIDE_LOGS' : 'SHOW_LOGS'}
          </button>
        </div>
      </header>

      {/* AI Status Panel */}
      <div className="ai-status-panel">
        <div className="status-indicators">
          <span>GAME_ENGINE: {isGameRunning ? 'ACTIVE' : 'STANDBY'}</span>
          <span>PLAYERS: 4 AI_BOTS</span>
          <span>SPEED: {gameSpeed / 1000}s/turn</span>
          <span>ROUND: {gameState?.roundNumber || 0}</span>
        </div>
        <div className="ai-controls">
          {!isGameRunning ? (
            <button className="action-btn" onClick={startGame}>START_AI_RACE</button>
          ) : (
            <button className="action-btn danger" onClick={stopGame}>STOP_RACE</button>
          )}
          <button className="action-btn" onClick={resetGame}>RESET_GAME</button>
          <select
            value={gameSpeed}
            onChange={(e) => changeSpeed(parseInt(e.target.value))}
            className="speed-selector"
          >
            <option value="2000">ULTRA_SLOW</option>
            <option value="1000">NORMAL</option>
            <option value="500">FAST</option>
            <option value="250">ULTRA_FAST</option>
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
              <h4>GAME_STATE</h4>
              <div className="state-info">
                <div>BANK_BALANCE: ${gameState?.bankMoney || 0}</div>
                <div>FREE_PARKING: ${gameState?.freeParkingPot || 0}</div>
                <div>ACTIVE_TRANSACTIONS: {gameState ? gameState.properties.filter(p => p.owner).length : 0}</div>
                <div>TERMINALS_RUNNING: 1</div>
              </div>
            </div>
          </div>

          {/* Center Panel - Game Board */}
          <div className="game-center-panel">
            {gameState && (
              <GameBoard
                properties={gameState.properties}
                onPropertyClick={(property) => {
                  setSelectedProperty(property);
                  setShowPropertyModal(true);
                }}
              />
            )}

            {/* Game Status Display */}
            <div className="game-status-display">
              <div className="status-line">
                CURRENT_PLAYER: {currentPlayer?.name || 'NONE'}
              </div>
              <div className="status-line">
                POSITION: {currentPlayer?.position || 0}
              </div>
              <div className="status-line">
                DICE_LAST: {gameState?.diceRolls.map(d => `[${d}]`).join('') || 'NONE'}
              </div>
              <div className="status-line">
                WEB3_CONNECTION: {currentPlayer?.tokenId ? 'CONNECTED' : 'OFFLINE'}
              </div>
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

            {/* Game Summary Data */}
            <div className="data-summary">
              <h5>SESSION_STATS</h5>
              <div className="summary-data">
                <div>COMPUTED_TURNS: {recentLogs.length}</div>
                <div>AI_DECISIONS: {recentLogs.filter(l => l.actionType === 'BUY_PROPERTY' || l.actionType === 'TRADE').length}</div>
                <div>PROPERTIES_OWNED: {gameState ? gameState.properties.filter(p => p.owner).length : 0}</div>
                <div>DATA_GENERATED: {JSON.stringify(recentLogs).length} bytes</div>
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

      {/* Matrix background effect */}
      <MatrixRain />

      {/* Footer with network status */}
      <footer className="terminal-footer">
        <div className="network-status">
          [TERMINAL_STATUS: ONLINE] | [WEB3_API: CONNECTED] | [MUSIC_STREAM: ACTIVE] | [AI_ENGINES: RUNNING]
        </div>
        <div className="version-info">
          v2025.CYPHER_GAME | © Neo's Property Matrix
        </div>
      </footer>
    </div>
  );
}

export default App;
