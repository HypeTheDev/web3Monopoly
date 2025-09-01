import React, { useState, useEffect } from 'react';
import { DBAGameState, DBATeam, NBAPlayer, DBAGame, DBAGameResult } from '../types/GameTypes';
import './DBADashboard.css';

interface DBADashboardProps {
  gameState: DBAGameState;
  onViewChange: (view: DBAGameState['currentView']) => void;
  onAdvanceWeek: () => void;
}

const DBADashboard: React.FC<DBADashboardProps> = ({
  gameState,
  onViewChange,
  onAdvanceWeek
}) => {
  const currentTeam = gameState.league.standings.find(t => t.id === gameState.currentTeam)!;
  const currentWeekGames = gameState.league.schedule.filter(g =>
    g.status === 'completed' &&
    gameState.league.schedule
      .filter(sg => sg.date.getTime() === g.date.getTime()).indexOf(g) === 0
  ).slice(-8); // Last 8 completed games

  const getRarityColor = (rarity: NBAPlayer['rarity']) => {
    switch (rarity) {
      case 'Legendary': return '#FFD700';
      case 'Epic': return '#A335EE';
      case 'Rare': return '#0070FF';
      case 'Uncommon': return '#1EFF00';
      case 'Common': return '#9D9D9D';
      default: return '#FFFFFF';
    }
  };

  const formatValue = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
    return `$${value}`;
  };

  return (
    <div className="dba-dashboard">
      {/* Navigation Bar */}
      <div className="dba-nav">
        <div className="nav-buttons">
          <button
            className={`nav-btn ${gameState.currentView === 'dashboard' ? 'active' : ''}`}
            onClick={() => onViewChange('dashboard')}
          >
            DASHBOARD
          </button>
          <button
            className={`nav-btn ${gameState.currentView === 'roster' ? 'active' : ''}`}
            onClick={() => onViewChange('roster')}
          >
            ROSTER
          </button>
          <button
            className={`nav-btn ${gameState.currentView === 'trade' ? 'active' : ''}`}
            onClick={() => onViewChange('trade')}
          >
            TRADES
          </button>
          <button
            className={`nav-btn ${gameState.currentView === 'leaderboard' ? 'active' : ''}`}
            onClick={() => onViewChange('leaderboard')}
          >
            STANDINGS
          </button>
          <button
            className={`nav-btn ${gameState.currentView === 'live-game' ? 'active' : ''}`}
            onClick={() => onViewChange('live-game')}
          >
            LIVE_GAMES
          </button>
        </div>
        <div className="league-info">
          <span>SEASON {gameState.league.season}</span>
          <span>WEEK {gameState.league.currentWeek}</span>
        </div>
      </div>

      {/* Team Header */}
      <div className="team-header">
        <div className="team-name">
          <h2>{currentTeam.name}</h2>
          <div className="team-stats">
            <span>{currentTeam.record.wins}-{currentTeam.record.losses}</span>
            <span>• Rank #{currentTeam.leagueRank}</span>
            <span>• {formatValue(currentTeam.totalValue)}</span>
          </div>
        </div>

        <div className="team-budget">
          <div>Budget: {formatValue(currentTeam.budget)}</div>
          <div>Players: {currentTeam.players.length}/20</div>
        </div>

        {gameState.league.currentWeek < 17 && (
          <button className="action-btn" onClick={onAdvanceWeek}>
            ADVANCE WEEK
          </button>
        )}
      </div>

      {/* Main Dashboard Content */}
      <div className="dashboard-content">
        {/* Starting Lineup */}
        <div className="dashboard-section">
          <h3>STARTING_LINEUP</h3>
          <div className="starting-lineup">
            {Object.entries(currentTeam.startingLineup).map(([position, player]) => (
              <div key={position} className="lineup-spot">
                <div className="position-label">{position}</div>
                {player ? (
                  <div className="player-card">
                    <div
                      className="rarity-border"
                      style={{ borderColor: getRarityColor(player.rarity) }}
                    />
                    <div className="player-name">{player.name}</div>
                    <div className="player-stats">
                      {player.stats.points.toFixed(1)} PTS • {player.stats.assists.toFixed(1)} AST • {player.stats.rebounds.toFixed(1)} REB
                    </div>
                    <div className="player-value">{formatValue(player.value)}</div>
                  </div>
                ) : (
                  <div className="empty-spot">VACANT</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recent Games */}
        <div className="dashboard-section">
          <h3>RECENT_GAMES</h3>
          <div className="recent-games">
            {currentWeekGames.slice(0, 5).map(game => {
              if (!game.result) return null;
              const isHome = game.homeTeam.id === currentTeam.id;
              const ourScore = isHome ? game.result.homeScore : game.result.awayScore;
              const oppScore = isHome ? game.result.awayScore : game.result.homeScore;
              const opponent = isHome ? game.awayTeam : game.homeTeam;
              const won = (isHome && game.result.winner === game.homeTeam) ||
                         (!isHome && game.result.winner === game.awayTeam);

              return (
                <div key={game.id} className={`game-result ${won ? 'win' : 'loss'}`}>
                  <div className="game-score">
                    <span className={won ? 'winner' : ''}>
                      {ourScore}-{oppScore}
                    </span>
                    <span className="opponent">vs {opponent.name}</span>
                  </div>
                  <div className="game-details">
                    MVP: {game.result!.mvp.player.name} ({
                      game.result!.mvp.points} PTS, {game.result!.mvp.assists} AST, {game.result!.mvp.rebounds} REB)
                  </div>
                </div>
              );
            })}
            {currentWeekGames.length === 0 && (
              <div className="no-games">No games completed yet</div>
            )}
          </div>
        </div>

        {/* League Standings Preview */}
        <div className="dashboard-section">
          <h3>LEAGUE_STANDINGS</h3>
          <div className="standings-preview">
            {gameState.league.standings.slice(0, 8).map((team, index) => (
              <div
                key={team.id}
                className={`standings-row ${team.id === currentTeam.id ? 'current' : ''}`}
              >
                <span>#{index + 1}</span>
                <span>{team.name}</span>
                <span>{team.record.wins}-{team.record.losses}</span>
                <span>{formatValue(team.totalValue)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* News/Events */}
        <div className="dashboard-section">
          <h3>LEAGUE_NEWS</h3>
          <div className="news-feed">
            <div className="news-item">
              <span className="news-time">2H AGO</span>
              <span>Free Agent Market Update: 15 new players available</span>
            </div>
            <div className="news-item">
              <span className="news-time">4H AGO</span>
              <span>Trade Deadline: {Math.ceil((gameState.leagueRules.settings.tradeDeadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days remaining</span>
            </div>
            <div className="news-item">
              <span className="news-time">6H AGO</span>
              <span>Weekly Draft: Pick #1 goes to {gameState.league.draftOrder[0]}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DBADashboard;
