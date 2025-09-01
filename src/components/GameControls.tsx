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
  const canRollDice = gameState.gameStatus === 'playing' && gameState.diceRolls.length === 0;
  const canEndTurn = gameState.gameStatus === 'playing' && gameState.diceRolls.length === 2;
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

      {/* Dice Display */}
      <div className="dice-section">
        <div className="dice-label">DICE ROLLS</div>
        <div className="dice-display">
          {gameState.diceRolls.length === 2 ? (
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
          ) : (
            <div className="no-dice">[ROLL TO BEGIN]</div>
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
