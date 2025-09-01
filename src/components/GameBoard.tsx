import React from 'react';
import { Property, Player } from '../types/GameTypes';
import './GameBoard.css';

interface GameBoardProps {
  properties: Property[];
  onPropertyClick: (property: Property) => void;
  currentPlayerPosition?: number;
  playerNames?: string[];
  playerColors?: string[];
}

const GameBoard: React.FC<GameBoardProps> = ({
  properties,
  onPropertyClick,
  currentPlayerPosition = 0,
  playerNames = ['P1', 'P2', 'P3', 'P4'],
  playerColors = ['#ff00ff', '#00ffff', '#ffff00', '#ff8800']
}) => {
  // Standard Monopoly board layout (simplified for rendering)
  const boardLayout = [
    { position: 0, name: 'GO', type: 'corner', color: 'transparent' },
    { position: 1, name: 'Mediterranean Ave', type: 'property', color: '#8B4513' },
    { position: 2, name: 'Community Chest', type: 'card', color: '#87CEEB' },
    { position: 3, name: 'Baltic Ave', type: 'property', color: '#8B4513' },
    { position: 4, name: 'Income Tax', type: 'tax', color: '#708090' },
    { position: 5, name: 'Reading Railroad', type: 'railroad', color: '#000000' },
    { position: 6, name: 'Oriental Ave', type: 'property', color: '#FF6B6B' },
    { position: 7, name: 'Chance', type: 'card', color: '#FFD93D' },
    { position: 8, name: 'Vermont Ave', type: 'property', color: '#FF6B6B' },
    { position: 9, name: 'Connecticut Ave', type: 'property', color: '#FF6B6B' },
    { position: 10, name: 'Just Visiting', type: 'corner', color: 'transparent' },
    { position: 11, name: 'St. Charles Place', type: 'property', color: '#87CEEB' },
    { position: 12, name: 'Electric Company', type: 'utility', color: '#98FB98' },
    { position: 13, name: 'States Ave', type: 'property', color: '#87CEEB' },
    { position: 14, name: 'Virginia Ave', type: 'property', color: '#87CEEB' },
    { position: 15, name: 'Pennsylvania Railroad', type: 'railroad', color: '#000000' },
    { position: 16, name: 'St. James Place', type: 'property', color: '#FFB347' },
    { position: 17, name: 'Community Chest', type: 'card', color: '#87CEEB' },
    { position: 18, name: 'Tennessee Ave', type: 'property', color: '#FFB347' },
    { position: 19, name: 'New York Ave', type: 'property', color: '#FFB347' },
    { position: 20, name: 'Free Parking', type: 'corner', color: 'transparent' },
    { position: 21, name: 'Kentucky Ave', type: 'property', color: '#FF69B4' },
    { position: 22, name: 'Chance', type: 'card', color: '#FFD93D' },
    { position: 23, name: 'Indiana Ave', type: 'property', color: '#FF69B4' },
    { position: 24, name: 'Illinois Ave', type: 'property', color: '#FF69B4' },
    { position: 25, name: 'B&O Railroad', type: 'railroad', color: '#000000' },
    { position: 26, name: 'Atlantic Ave', type: 'property', color: '#FFFF99' },
    { position: 27, name: 'Ventnor Ave', type: 'property', color: '#FFFF99' },
    { position: 28, name: 'Water Works', type: 'utility', color: '#98FB98' },
    { position: 29, name: 'Marvin Gardens', type: 'property', color: '#FFFF99' },
    { position: 30, name: 'Go To Jail', type: 'corner', color: 'transparent' },
    { position: 31, name: 'Pacific Ave', type: 'property', color: '#32CD32' },
    { position: 32, name: 'North Carolina Ave', type: 'property', color: '#32CD32' },
    { position: 33, name: 'Community Chest', type: 'card', color: '#87CEEB' },
    { position: 34, name: 'Pennsylvania Ave', type: 'property', color: '#32CD32' },
    { position: 35, name: 'Short Line', type: 'railroad', color: '#000000' },
    { position: 36, name: 'Chance', type: 'card', color: '#FFD93D' },
    { position: 37, name: 'Park Place', type: 'property', color: '#8A2BE2' },
    { position: 38, name: 'Luxury Tax', type: 'tax', color: '#708090' },
    { position: 39, name: 'Boardwalk', type: 'property', color: '#8A2BE2' }
  ];

  const renderPropertyTile = (tile: any, index: number) => {
    const property = properties.find(p => p.position === tile.position);
    const style: React.CSSProperties = {
      backgroundColor: tile.type === 'property' ? tile.color : 'transparent',
      border: '1px solid var(--primary-color)',
      color: 'var(--primary-color)',
      cursor: property ? 'pointer' : 'default',
    };

    return (
      <div
        key={tile.position}
        className={`board-tile ${tile.type}`}
        style={style}
        onClick={() => property && onPropertyClick(property)}
        tabIndex={0}
      >
        <div className="tile-content">
          {tile.type === 'property' && property?.houses && property.houses > 0 && (
            <div className="houses">
              {'🏠'.repeat(Math.min(property.houses, 4))}
              {property.houses === 5 && '🏨'}
            </div>
          )}

          <div className="property-name">
            {tile.name.slice(0, 15)}
          </div>

          {property?.owner && (
            <div
              className="owner-indicator"
              style={{ backgroundColor: (property.owner as Player).color || '#ffff00' }}
            >
              {property.owner.name.charAt(0)}
            </div>
          )}

          {tile.type === 'railroad' && (
            <div className="railroad-icon">
              🚂
            </div>
          )}

          {tile.type === 'utility' && (
            <div className="utility-icon">
              {tile.position === 12 ? '⚡' : '💧'}
            </div>
          )}

          {(tile.type === 'tax' || tile.type === 'corner') && (
            <div className="special-icon">
              {tile.position === 0 && 'GO'}
              {tile.position === 10 && 'JAIL'}
              {tile.position === 20 && '🎁'}
              {tile.position === 30 && '🚔'}
              {tile.position === 4 && '💸'}
              {tile.position === 38 && '💎'}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="game-board">
      <div className="board-grid">
        {/* Top row: positions 20-10 */}
        <div className="board-row top-row">
          {boardLayout.slice(20, 31).reverse().map((tile, index) =>
            renderPropertyTile(tile, 20 + index)
          )}
        </div>

        {/* Middle section - left column: positions 19-11 */}
        <div className="board-column left-column">
          {boardLayout.slice(19, 10).map((tile) =>
            renderPropertyTile(tile, tile.position)
          )}
        </div>

        {/* Center area - could show game info or cards */}
        <div className="board-center">
          <div className="center-display">
            <div className="web3-indicator">[WEB3 MODE]</div>
            <div className=" decentral-indicator">[DECENTRALIZED]</div>
          </div>
        </div>

        {/* Middle section - right column: positions 31-39 */}
        <div className="board-column right-column">
          {boardLayout.slice(31, 40).map((tile) =>
            renderPropertyTile(tile, tile.position)
          )}
        </div>

        {/* Bottom row: positions 0-10 */}
        <div className="board-row bottom-row">
          {boardLayout.slice(0, 10).map((tile) =>
            renderPropertyTile(tile, tile.position)
          )}
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
