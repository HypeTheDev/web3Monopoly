import React, { useState, useEffect } from 'react';
import { PageType } from '../PageRouter';
import { SpadesGameEngine } from '../../lib/SpadesEngine';
import { GameState, GameEntry, SpadesGameState, SpadesCard } from '../../types/GameTypes';
import './SpadesPage.css';

interface SpadesPageProps {
  onPageChange: (page: PageType) => void;
}

const SpadesPage: React.FC<SpadesPageProps> = ({ onPageChange }) => {
  const [gameEngine, setGameEngine] = useState<SpadesGameEngine | null>(null);
  const [gameState, setGameState] = useState<SpadesGameState | null>(null);
  const [gameLog, setGameLog] = useState<GameEntry[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [gameSpeed, setGameSpeed] = useState(2000); // milliseconds
  const [currentView, setCurrentView] = useState<'overview' | 'hands' | 'tricks' | 'scores'>('overview');

  useEffect(() => {
    const engine = new SpadesGameEngine(handleGameUpdate);
    setGameEngine(engine);
    setGameState(engine.getGameState() as SpadesGameState);
    setGameLog(engine.getGameLog());
  }, []);

  const handleGameUpdate = (newGameState: GameState, logEntry: GameEntry) => {
    setGameState(newGameState as SpadesGameState);
    setGameLog(prev => [...prev, logEntry]);
  };

  const startGame = () => {
    if (gameEngine && !isRunning) {
      gameEngine.startGameLoop(gameSpeed);
      setIsRunning(true);
    }
  };

  const stopGame = () => {
    if (gameEngine && isRunning) {
      gameEngine.stopGameLoop();
      setIsRunning(false);
    }
  };

  const resetGame = () => {
    if (gameEngine) {
      gameEngine.resetGame();
      setGameState(gameEngine.getGameState() as SpadesGameState);
      setGameLog(gameEngine.getGameLog());
      setIsRunning(false);
    }
  };

  const adjustSpeed = (newSpeed: number) => {
    setGameSpeed(newSpeed);
    if (gameEngine && isRunning) {
      gameEngine.adjustSpeed(newSpeed);
    }
  };

  const getCardSymbol = (card: SpadesCard): string => {
    const rankSymbols: { [key: number]: string } = {
      1: 'A', 11: 'J', 12: 'Q', 13: 'K', 14: 'A'
    };
    const suitSymbols = {
      hearts: '♥️',
      diamonds: '♦️',
      clubs: '♣️',
      spades: '♠️'
    };

    const rank = card.rank <= 10 ? card.rank.toString() : (rankSymbols[card.rank] || card.rank.toString());
    return `${rank}${suitSymbols[card.suit]}`;
  };

  const getTeamScore = (team: 'team1' | 'team2'): number => {
    if (!gameState) return 0;
    const teamPlayers = gameState.teams[team];
    let totalBid = 0;
    let totalTricks = 0;

    teamPlayers.forEach(playerId => {
      totalBid += gameState.bids[playerId] || 0;
      totalTricks += gameState.tricks[playerId] || 0;
    });

    return totalBid * 10 + (totalTricks - totalBid);
  };

  if (!gameState) {
    return (
      <div className="spades-page">
        <div className="loading">Loading Spades Game...</div>
      </div>
    );
  }

  return (
    <div className="spades-page">
      <div className="page-header">
        <div className="header-content">
          <button
            className="back-btn"
            onClick={() => onPageChange(PageType.HOME)}
          >
            ← BACK TO HOME
          </button>
          <h1 className="game-title">♠️ SPADES TCG ♠️</h1>
          <div className="game-status">
            Status: {gameState.gameStatus === 'playing' ? '🟢 Playing' : '⏸️ Waiting'}
          </div>
        </div>
      </div>

      {/* Game Controls */}
      <div className="game-controls">
        <div className="control-buttons">
          <button
            className={`control-btn ${isRunning ? 'danger' : 'success'}`}
            onClick={isRunning ? stopGame : startGame}
          >
            {isRunning ? '⏸️ PAUSE' : '▶️ START'}
          </button>
          <button className="control-btn" onClick={resetGame}>
            🔄 RESET
          </button>
        </div>

        <div className="speed-control">
          <label>Speed:</label>
          <select
            value={gameSpeed}
            onChange={(e) => adjustSpeed(Number(e.target.value))}
            className="speed-selector"
          >
            <option value={3000}>🐌 Slow</option>
            <option value={2000}>⚡ Normal</option>
            <option value={1000}>🚀 Fast</option>
            <option value={500}>⚡⚡ Turbo</option>
          </select>
        </div>

        <div className="view-selector">
          <button
            className={`view-btn ${currentView === 'overview' ? 'active' : ''}`}
            onClick={() => setCurrentView('overview')}
          >
            📊 Overview
          </button>
          <button
            className={`view-btn ${currentView === 'hands' ? 'active' : ''}`}
            onClick={() => setCurrentView('hands')}
          >
            🃏 Hands
          </button>
          <button
            className={`view-btn ${currentView === 'tricks' ? 'active' : ''}`}
            onClick={() => setCurrentView('tricks')}
          >
            🏆 Tricks
          </button>
          <button
            className={`view-btn ${currentView === 'scores' ? 'active' : ''}`}
            onClick={() => setCurrentView('scores')}
          >
            📈 Scores
          </button>
        </div>
      </div>

      <div className="spades-content">
        {/* Overview Panel */}
        {currentView === 'overview' && (
          <div className="overview-panel">
            <div className="game-info">
              <div className="info-card">
                <h3>🎯 Current Phase</h3>
                <div className="phase-info">
                  {gameState.bidPhase && <div className="phase-active">🎯 BIDDING PHASE</div>}
                  {gameState.playPhase && <div className="phase-active">🃏 CARD PLAY PHASE</div>}
                  {!gameState.bidPhase && !gameState.playPhase && <div className="phase-waiting">⏸️ WAITING</div>}
                </div>
              </div>

              <div className="info-card">
                <h3>👥 Teams</h3>
                <div className="team-display">
                  <div className="team">
                    <div className="team-name">🔴 Team 1</div>
                    <div className="team-players">
                      {gameState.teams.team1.map(playerId => {
                        const player = gameState.players.find(p => p.id === playerId);
                        return player ? <div key={playerId}>{player.name}</div> : null;
                      })}
                    </div>
                    <div className="team-score">Score: {getTeamScore('team1')}</div>
                  </div>
                  <div className="team">
                    <div className="team-name">🔵 Team 2</div>
                    <div className="team-players">
                      {gameState.teams.team2.map(playerId => {
                        const player = gameState.players.find(p => p.id === playerId);
                        return player ? <div key={playerId}>{player.name}</div> : null;
                      })}
                    </div>
                    <div className="team-score">Score: {getTeamScore('team2')}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="current-trick">
              <h3>🃏 Current Trick</h3>
              <div className="trick-cards">
                {gameState.currentTrick.length === 0 ? (
                  <div className="no-trick">No cards played yet</div>
                ) : (
                  gameState.currentTrick.map((card, index) => (
                    <div key={index} className="trick-card">
                      {getCardSymbol(card)}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Hands View */}
        {currentView === 'hands' && (
          <div className="hands-panel">
            <h3>🃏 Player Hands</h3>
            <div className="hands-display">
              {gameState.players.map(player => (
                <div key={player.id} className="player-hand">
                  <div className="player-name">{player.name}</div>
                  <div className="hand-cards">
                    {gameState.hands[player.id]?.map((card, index) => (
                      <div key={index} className="hand-card">
                        {getCardSymbol(card)}
                      </div>
                    )) || <div className="no-cards">No cards</div>}
                  </div>
                  <div className="player-stats">
                    Bid: {gameState.bids[player.id] || 0} |
                    Tricks: {gameState.tricks[player.id] || 0}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tricks View */}
        {currentView === 'tricks' && (
          <div className="tricks-panel">
            <h3>🏆 Trick History</h3>
            <div className="trick-history">
              {gameState.trickHistory.length === 0 ? (
                <div className="no-tricks">No tricks completed yet</div>
              ) : (
                gameState.trickHistory.slice(-10).map((trick, index) => (
                  <div key={index} className="trick-entry">
                    <div className="trick-number">Trick {index + 1}</div>
                    <div className="trick-cards">
                      {trick.cards.map((card, cardIndex) => (
                        <span key={cardIndex} className="trick-card">
                          {getCardSymbol(card)}
                        </span>
                      ))}
                    </div>
                    <div className="trick-winner">
                      Winner: {gameState.players.find(p => p.id === trick.winner)?.name}
                    </div>
                    <div className="trick-points">
                      Points: {trick.points}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Scores View */}
        {currentView === 'scores' && (
          <div className="scores-panel">
            <h3>📈 Game Scores</h3>
            <div className="score-display">
              <div className="team-score-card">
                <h4>🔴 Team 1</h4>
                <div className="team-details">
                  {gameState.teams.team1.map(playerId => {
                    const player = gameState.players.find(p => p.id === playerId);
                    return player ? (
                      <div key={playerId} className="player-score">
                        <span>{player.name}</span>
                        <span>Bid: {gameState.bids[playerId] || 0}</span>
                        <span>Tricks: {gameState.tricks[playerId] || 0}</span>
                      </div>
                    ) : null;
                  })}
                </div>
                <div className="team-total">Total: {getTeamScore('team1')}</div>
              </div>

              <div className="team-score-card">
                <h4>🔵 Team 2</h4>
                <div className="team-details">
                  {gameState.teams.team2.map(playerId => {
                    const player = gameState.players.find(p => p.id === playerId);
                    return player ? (
                      <div key={playerId} className="player-score">
                        <span>{player.name}</span>
                        <span>Bid: {gameState.bids[playerId] || 0}</span>
                        <span>Tricks: {gameState.tricks[playerId] || 0}</span>
                      </div>
                    ) : null;
                  })}
                </div>
                <div className="team-total">Total: {getTeamScore('team2')}</div>
              </div>
            </div>
          </div>
        )}

        {/* Game Log */}
        <div className="game-log-panel">
          <h3>📜 Game Log</h3>
          <div className="game-log">
            {gameLog.length === 0 ? (
              <div className="no-log">No game events yet</div>
            ) : (
              gameLog.slice(-20).map((entry, index) => (
                <div key={index} className="log-entry">
                  <span className="log-turn">#{entry.turn}</span>
                  <span className="log-player">{entry.playerName}</span>
                  <span className="log-action">{entry.actionType}</span>
                  <span className="log-details">{entry.details}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <footer className="page-footer">
        <p>BkM Spades Terminal v1.0 - Now Playable! | Round {gameState.roundNumber} | Speed: {gameSpeed}ms</p>
      </footer>
    </div>
  );
};

export default SpadesPage;
