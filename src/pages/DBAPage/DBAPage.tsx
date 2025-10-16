import React, { useState, useEffect } from 'react';
import { PageType } from '../PageRouter';
import './DBAPage.css';

// Game components
import DBADashboard from '../../components/DBADashboard';
import WorldNews from '../../components/WorldNews';

// Game Engine
import DBAEngine from '../../lib/DBAEngine';
import { GameEntry } from '../../types/GameTypes';
import DBALore from '../../components/DBALore';

// Types
import { GameState, TerminalTheme, DBAGameState, DBALoreEntry } from '../../types/GameTypes';

interface DBAPageProps {
  onPageChange: (page: PageType) => void;
}

const DBAPage: React.FC<DBAPageProps> = ({ onPageChange }) => {
  const [gameEngine, setGameEngine] = useState<DBAEngine | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [gameSpeed, setGameSpeed] = useState(1000);
  const [recentLogs, setRecentLogs] = useState<GameEntry[]>([]);
  const [showLogs, setShowLogs] = useState(true);
  const [showWorldNews, setShowWorldNews] = useState(false);

  const [terminalTheme] = useState<TerminalTheme>({
    primaryColor: '#00ff00',
    secondaryColor: '#ffff00',
    backgroundColor: '#000000',
    panelColor: '#111111',
    borderColor: '#333333',
    textColor: '#00ff00'
  });

  // Initialize DBA game engine
  useEffect(() => {
    if (!gameEngine) {
      console.log('DBA: Initializing engine...');
      try {
        const engine = new DBAEngine((gameState: GameState, logEntry: GameEntry) => {
          setGameState(gameState);
          setRecentLogs(prev => [logEntry, ...prev.slice(0, 19)]);
        });
        setGameEngine(engine);
        const initialState = engine.getGameState();
        console.log('DBA: Got initial state:', initialState);
        setGameState(initialState);
        console.log('DBA: Engine initialized successfully');
      } catch (error) {
        console.error('DBA: Failed to initialize engine:', error);
      }
    }
  }, [gameEngine]);

  // Update CSS custom properties when theme changes
  useEffect(() => {
    const root = document.documentElement;
    Object.entries(terminalTheme).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
  }, [terminalTheme]);

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

      const engine = new DBAEngine((gameState: GameState, logEntry: GameEntry) => {
        setGameState(gameState);
        setRecentLogs(prev => [logEntry, ...prev.slice(0, 19)]);
      });

      setGameEngine(engine);
      setGameState(engine.getGameState());
      setIsGameRunning(false);
      setRecentLogs([]);
    }
  };

  const handleWeekAdvance = () => {
    if (gameEngine) {
      gameEngine.advanceWeek();
    }
  };

  const handleViewChange = (view: DBAGameState['currentView']) => {
    if (gameState) {
      const updatedState = {
        ...gameState,
        currentView: view
      } as DBAGameState;
      setGameState(updatedState);
    }
  };

  return (
    <div className="dba-page" style={{
      '--primary-color': terminalTheme.primaryColor,
      '--secondary-color': terminalTheme.secondaryColor,
      '--background-color': terminalTheme.backgroundColor,
      '--panel-color': terminalTheme.panelColor,
      '--border-color': terminalTheme.borderColor,
    } as React.CSSProperties}>

      {/* Game Header */}
      <header className="game-header">
        <div className="game-title">
          <h1>⚡ DBA ⚡</h1>
        </div>
        <div className="header-controls">
          <button
            className="back-btn"
            onClick={() => onPageChange(PageType.HOME)}
          >
            ← BACK TO HOME
          </button>
          <div className="game-mode-indicator">
            <span className="current-mode">FANTASY BASKETBALL MODE</span>
          </div>
          <button
            className={`action-btn info ${showLogs ? '' : 'standardize'}`}
            onClick={() => setShowWorldNews(true)}
          >
            NEWS
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
          <span>WEEK: {(gameState && 'league' in gameState && gameState.league) ? gameState.league.currentWeek || 0 : 0}</span>
        </div>
        <div className="ai-controls">
          {!isGameRunning ? (
            <button className="action-btn" onClick={startGame}>START</button>
          ) : (
            <button className="action-btn danger" onClick={stopGame}>STOP</button>
          )}
          <button className="action-btn" onClick={resetGame}>RESET</button>
          <button className="action-btn" onClick={handleWeekAdvance}>ADVANCE WEEK</button>
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
        <div className="dba-container">
          {/* Left Panel - Player Stats */}
          <div className="dba-stats-panel">
            <div className="stats-section">
              <h4>CURRENT_TEAM</h4>
              {gameState && 'league' in gameState && gameState.league ? (
                <>
                  <div className="stat-item">
                    <span>TEAM:</span>
                    <span className="stat-value">{gameState.league.standings.find(t => t.id === gameState.currentTeam)?.name || 'NONE'}</span>
                  </div>
                  <div className="stat-item">
                    <span>RANK:</span>
                    <span className="stat-value">#{gameState.league.standings.findIndex(t => t.id === gameState.currentTeam) + 1}</span>
                  </div>
                  <div className="stat-item">
                    <span>RECORD:</span>
                    <span className="stat-value">{gameState.league.standings.find(t => t.id === gameState.currentTeam)?.record.wins}-{gameState.league.standings.find(t => t.id === gameState.currentTeam)?.record.losses}</span>
                  </div>
                </>
              ) : (
                <div className="stat-item">INITIALIZING...</div>
              )}
            </div>

            <div className="stats-section">
              <h4>GAME_STATUS</h4>
              <div className="stat-item">
                <span>ENGINE:</span>
                <span className="stat-value">{isGameRunning ? 'RUNNING' : 'STOPPED'}</span>
              </div>
              <div className="stat-item">
                <span>WEEK:</span>
                <span className="stat-value">{gameState && 'league' in gameState && gameState.league ? gameState.league.currentWeek || 0 : 0}</span>
              </div>
              <div className="stat-item">
                <span>TEAMS:</span>
                <span className="stat-value">{gameState && 'league' in gameState && gameState.league ? gameState.league.standings.length : 0}</span>
              </div>
            </div>

            <div className="stats-section">
              <h4>GAME_SETTINGS</h4>
              <div className="stat-item">
                <span>SPEED:</span>
                <span className="stat-value">{gameSpeed/1000}s</span>
              </div>
              <div className="stat-item">
                <span>LOGS:</span>
                <span className="stat-value">{showLogs ? 'ON' : 'OFF'}</span>
              </div>
              <div className="stat-item">
                <span>EVENTS:</span>
                <span className="stat-value">{recentLogs.length}</span>
              </div>
            </div>
          </div>

          {/* Center Panel - DBA Dashboard */}
          <div className="dba-dashboard-center">
            {gameState?.gameMode === 'dba' && 'league' in gameState && gameState.league ? (
              <DBADashboard
                gameState={gameState as DBAGameState}
                onViewChange={handleViewChange}
                onAdvanceWeek={handleWeekAdvance}
              />
            ) : (
              <div className="loading-dba">
                <h3>DBA League Loading...</h3>
                <div className="loading-status">
                  {gameState?.gameMode === 'dba' ? 'Initializing League...' : 'Game Mode Switch Required'}
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Live Logs */}
          <div className={`dba-logs-panel ${showLogs ? '' : 'hidden'}`}>
            <div className="logs-header">
              <h4>DBA_GAME_LOGS</h4>
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

            {/* DBA Stats */}
            <div className="data-summary">
              <h5>LIVE_STATS</h5>
              <div className="summary-data">
                <div>EVENTS: {recentLogs.length}</div>
                <div>GAMES: {recentLogs.filter(l => l.actionType === 'SCORE_UPDATE').length}</div>
                <div>TRADES: {recentLogs.filter(l => l.actionType === 'TRADE').length}</div>
                {gameState && 'league' in gameState && gameState.league ? (
                  <>
                    <div>TEAMS: {gameState.league.standings.length}</div>
                    <div>WEEK: {gameState.league.currentWeek || 0}</div>
                  </>
                ) : null}
              </div>
            </div>
          </div>

          {/* DBA Game Status Display - Repositioned */}
          <div className="dba-status-display">
            <div className="status-line">
              CURRENT_SEASON: {gameState && 'league' in gameState && gameState.league ? gameState.league.season || 'UNKNOWN' : 'NONE'}
            </div>
            <div className="status-line">
              WEEK: {gameState && 'league' in gameState && gameState.league ? gameState.league.currentWeek || 0 : 0}
            </div>
            <div className="status-line">
              ACTIVE_GAMES: {gameState && 'currentView' in gameState ? gameState.currentView : 'DASHBOARD'}
            </div>
            <div className="status-line">
              SIMULATION: {isGameRunning ? 'RUNNING' : 'PAUSED'}
            </div>
          </div>
        </div>
      </main>

      {showWorldNews && (
        <WorldNews
          isVisible={showWorldNews}
          onClose={() => setShowWorldNews(false)}
        />
      )}

      {/* DBA Lore Database */}
      {gameState && 'league' in gameState && gameEngine && (
        <DBALore
          isVisible={false} // This would be controlled by a state variable
          onClose={() => {}} // Handle lore modal close
          loreEntries={gameEngine.getLoreEntries()}
          onDiscoverLore={(loreId) => {
            if (gameEngine) {
              gameEngine.discoverLore(loreId);
            }
          }}
        />
      )}

      {/* Matrix background effect */}
      <MatrixRain />

      {/* Footer - simplified */}
      <footer className="terminal-footer">
        <div className="network-status">BkM DBA Terminal v2.0 | Enhanced Fantasy Basketball | Betting & Lore System Active</div>
      </footer>
    </div>
  );
};

// MatrixRain component for background effect
const MatrixRain: React.FC = () => {
  return (
    <div className="matrix-rain">
      {/* Matrix rain animation */}
    </div>
  );
};

export default DBAPage;
