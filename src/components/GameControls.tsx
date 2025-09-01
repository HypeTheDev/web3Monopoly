import React from 'react';
import { GameState } from '../types/GameTypes';

interface GameControlsProps {
  gameState: GameState;
  onRollDice: () => void;
  onEndTurn: () => void;
  onTrade: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({
  gameState,
  onRollDice,
  onEndTurn,
  onTrade
}) => {
  // Check if we're in monopoly mode with proper type guards
  const isMonopolyGame = gameState.gameMode === 'monopoly' && 'diceRolls' in gameState;
  const canRollDice = isMonopolyGame && gameState.gameStatus === 'playing' && gameState.diceRolls.length === 0;
  const canEndTurn = isMonopolyGame && gameState.gameStatus === 'playing' && gameState.diceRolls.length === 2;
  const canTrade = gameState.gameStatus === 'playing';

  return (
    <div className="game-controls-panel">
      <h3>TERMINAL CONTROLS</h3>

      <div className="control-buttons">
        <button
          className="control-btn"
          onClick={onRollDice}
          disabled={!canRollDice}
        >
          ROLL_DICE
        </button>
        <button
          className="control-btn"
          onClick={onEndTurn}
          disabled={!canEndTurn}
        >
          END_TURN
        </button>
      </div>

      <div className="control-buttons">
        <button
          className="control-btn"
          onClick={onTrade}
          disabled={!canTrade}
        >
          TRADE_MODE
        </button>
        <button
          className="control-btn"
        >
          BUY_PROPERTY
        </button>
      </div>

      <div className="control-buttons">
        <button className="control-btn">
          BUILD_HOUSE
        </button>
        <button className="control-btn">
          WEB3_CONNECT
        </button>
      </div>

      {/* Dice Display - Only for Monopoly */}
      <div className="dice-section">
        <div className="dice-label">
          {gameState.gameMode === 'monopoly' ? 'DICE ROLLS' :
           gameState.gameMode === 'spades' ? 'TRICKS' :
           gameState.gameMode === 'chess' ? 'PIECES' : 'GAME STATS'}
        </div>
        <div className="dice-display">
          {gameState.gameMode === 'monopoly' && isMonopolyGame && gameState.diceRolls.length === 2 ? (
            <>
              <div className="die">
                [{gameState.diceRolls[0]}]
              </div>
              <div className="operator">+</div>
              <div className="die">
                [{gameState.diceRolls[1]}]
              </div>
              <div className="result">
                = {gameState.diceRolls[0] + gameState.diceRolls[1]}
              </div>
            </>
          ) : gameState.gameMode === 'monopoly' && isMonopolyGame ? (
            <div className="no-dice">[ROLL TO BEGIN]</div>
          ) : gameState.gameMode === 'spades' ? (
            <div className="no-dice">[BIDDING PHASE]</div>
          ) : gameState.gameMode === 'chess' ? (
            <div className="no-dice">[CHESS READY]</div>
          ) : (
            <div className="no-dice">[GAME READY]</div>
          )}
        </div>
      </div>

      {/* Action Log */}
      <div className="action-log">
        <div className="log-header">SYSTEM LOG</div>
        <div className="log-entries">
          <div className="log-entry">{'>'} System initialized</div>
          <div className="log-entry">{'>'} Web3 connection active</div>
          <div className="log-entry">{'>'} Players registered</div>
        </div>
      </div>
    </div>
  );
};

export default GameControls;
