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
        <div className="coming-soon-card">
          <div className="card-icon">♠️</div>
          <h2>COMING SOON</h2>
          <p>Trick-taking card game with AI opponents is under development.</p>
          <div className="status-info">
            <div className="status-item">
              <strong>Phase:</strong> Bidding & Playing System Ready
            </div>
            <div className="status-item">
              <strong>Expected Release:</strong> Q4 2025
            </div>
            <div className="status-item">
              <strong>Features:</strong> 2v2 Teams, Auction Bidding, Advanced Strategy
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
