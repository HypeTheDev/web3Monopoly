import React from 'react';
import { Property, Player } from '../types/GameTypes';

interface PropertyModalProps {
  property: Property;
  currentPlayer: Player | null;
  onClose: () => void;
  onBuy: () => void;
  onMortgageToggle: () => void;
}

const PropertyModal: React.FC<PropertyModalProps> = ({
  property,
  currentPlayer,
  onClose,
  onBuy,
  onMortgageToggle
}) => {
  const canBuy = !property.owner && currentPlayer && currentPlayer.money >= property.price;
  const canMortgage = property.owner?.id === currentPlayer?.id && !property.mortgaged;
  const canUnmortgage = property.owner?.id === currentPlayer?.id && property.mortgaged &&
    currentPlayer && currentPlayer.money >= Math.floor(property.mortgageValue * 1.1);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{property.name.toUpperCase()}</h2>

        <div className="property-details">
          <div className="property-stats">
            <div className="stat-item">
              <span className="stat-label">TYPE:</span>
              <span className="stat-value">{property.type.toUpperCase()}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">POSITION:</span>
              <span className="stat-value">{property.position}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">PRICE:</span>
              <span className="stat-value">${property.price}</span>
            </div>
            {!property.owner && (
              <div className="stat-item">
                <span className="stat-label">RENT:</span>
                <span className="stat-value">${property.rent[0]}</span>
              </div>
            )}
          </div>

          <div className="owner-info">
            {!property.owner ? (
              <div className="unowned">
                <div className="web3-token">[WEB3_TOKEN: {property.id}]</div>
                <div className="blockchain-status">[DECENTRALIZED_OWNERSHIP]</div>
              </div>
            ) : (
              <div className="owned">
                <div className="owner-details">
                  <span>OWNER: {property.owner.name}</span>
                  {property.owner.id === currentPlayer?.id && currentPlayer && (
                    <span className="current-owner">[YOU]</span>
                  )}
                </div>
                {property.mortgaged && (
                  <div className="mortgaged-status">MORTGAGED</div>
                )}
                {property.houses > 0 && (
                  <div className="house-count">
                    {'🏠'.repeat(Math.min(property.houses, 4))}
                    {property.houses === 5 && '🏨'}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="modal-actions">
          {!property.owner && canBuy && (
            <button className="action-btn buy-btn" onClick={onBuy}>
              BUY_PROPERTY (${property.price})
            </button>
          )}

          {!property.owner && currentPlayer && currentPlayer.money < property.price && (
            <div className="insufficient-funds">
              INSUFFICIENT_FUNDS
            </div>
          )}

          {property.owner?.id === currentPlayer?.id && currentPlayer && (
            <>
              {canMortgage ? (
                <button
                  className="action-btn mortgage-btn"
                  onClick={onMortgageToggle}
                >
                  MORTGAGE (+${property.mortgageValue})
                </button>
              ) : property.mortgaged && canUnmortgage ? (
                <button
                  className="action-btn unmortgage-btn"
                  onClick={onMortgageToggle}
                >
                  UNMORTGAGE (-${Math.floor(property.mortgageValue * 1.1)})
                </button>
              ) : property.mortgaged && !canUnmortgage && (
                <div className="insufficient-funds">
                  INSUFFICIENT_FUNDS_TO_UNMORTGAGE
                </div>
              )}
            </>
          )}

          {property.owner?.id !== currentPlayer?.id && currentPlayer && property.owner && (
            <div className="rent-info">
              <span>RENT_DUE:</span>
              <span>${property.rent[property.houses]}</span>
            </div>
          )}

          <button className="action-btn close-btn" onClick={onClose}>
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyModal;
