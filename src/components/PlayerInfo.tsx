import React from 'react';
import { Player } from '../types/GameTypes';
import './PlayerInfo.css';

interface PlayerInfoProps {
  players: Player[];
  currentPlayerIndex: number;
}

const PlayerInfo: React.FC<PlayerInfoProps> = ({ players, currentPlayerIndex }) => {
  return (
    <div className="player-info-panel">
      <h3>PLAYERS [TERMINAL]</h3>
      <div className="player-list">
        {players.map((player, index) => (
          <div
            key={player.id}
            className={`player-card ${index === currentPlayerIndex ? 'current' : ''}`}
          >
            <div className="player-name">
              {player.name.toUpperCase()}
            </div>
            <div className="player-stats">
              <span className="stat-label">MONEY:</span>
              <span className="stat-value">${player.money.toLocaleString()}</span>
            </div>
            <div className="player-stats">
              <span className="stat-label">POSITION:</span>
              <span className="stat-value">{player.position}</span>
            </div>
            <div className="player-stats">
              <span className="stat-label">PROPERTIES:</span>
              <span className="stat-value">{player.properties.length}</span>
            </div>
            {player.inJail && (
              <div className="player-status">
                IN JAIL: {player.jailTurns} TURNS
              </div>
            )}
            {player.walletAddress && (
              <div className="web3-indicator">
                [WEB3: CONNECTED]
              </div>
            )}
          </div>
        ))}
      </div>
      {players.length === 0 && (
        <div className="no-players">
          <p>No players initialized</p>
          <p>Click START_GAME to begin</p>
        </div>
      )}
    </div>
  );
};

export default PlayerInfo;
