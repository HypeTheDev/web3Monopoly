import React from 'react';
import { PageType } from '../PageRouter';
import './SpadesPage.css';

interface SpadesPageProps {
  onPageChange: (page: PageType) => void;
}

const SpadesPage: React.FC<SpadesPageProps> = ({ onPageChange }) => {
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
          <h1 className="game-title">♠️ SPADES ♠️</h1>
        </div>
      </div>

      <div className="spades-content">
        <div className="tcg-preview-card">
          <div className="card-icon">🎴</div>
          <h2>SPADES TCG</h2>
          <p>Yu-Gi-Oh meets Spades! Collect fantasy NBA characters as cards and battle in epic trick-taking duels!</p>
          <div className="status-info">
            <div className="status-item">
              <strong>Phase:</strong> TCG System Design Complete
            </div>
            <div className="status-item">
              <strong>Style:</strong> Yu-Gi-Oh + Spades Fusion
            </div>
            <div className="status-item">
              <strong>Features:</strong> DBA Characters, Card Battles, Trick-Taking, Endless Fun!
            </div>
          </div>
        </div>

        <div className="sample-characters">
          <h3>Fantasy NBA Card Characters</h3>
          <div className="character-showcase">
            <div className="character-card">
              <div className="character-name">Nexus Prime</div>
              <div className="character-power">Reality Warping</div>
              <div className="character-stats">ATK: 3200 DEF: 2800</div>
            </div>
            <div className="character-card">
              <div className="character-name">Plasma Storm</div>
              <div className="character-power">Electric Control</div>
              <div className="character-stats">ATK: 2900 DEF: 3100</div>
            </div>
            <div className="character-card">
              <div className="character-name">Void Reaper</div>
              <div className="character-power">Shadow Travel</div>
              <div className="character-stats">ATK: 3500 DEF: 2600</div>
            </div>
          </div>
        </div>

        <div className="game-preview">
          <h3>Game Preview</h3>
          <div className="preview-content">
            <div className="sample-hand">
              <h4>Example Hand</h4>
              <div className="cards">
                <span className="card">🃏</span>
                <span className="card">♠️A</span>
                <span className="card">♠️K</span>
                <span className="card">♠️Q</span>
                <span className="card">♠️7</span>
              </div>
            </div>

            <div className="game-details">
              <h4>Game Features</h4>
              <ul>
                <li>• Partnership card game</li>
                <li>• Complex bidding system</li>
                <li>• Spades suit bonus</li>
                <li>• Nil and double-nil bids</li>
                <li>• Advanced AI opponents</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <footer className="page-footer">
        <p>BkM Spades Terminal v0.1 - Beta Coming Soon</p>
      </footer>
    </div>
  );
};

export default SpadesPage;
