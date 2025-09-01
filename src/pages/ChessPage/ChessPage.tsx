import React from 'react';
import { PageType } from '../PageRouter';
import './ChessPage.css';

interface ChessPageProps {
  onPageChange: (page: PageType) => void;
}

const ChessPage: React.FC<ChessPageProps> = ({ onPageChange }) => {
  return (
    <div className="chess-page">
      <div className="page-header">
        <div className="header-content">
          <button
            className="back-btn"
            onClick={() => onPageChange(PageType.HOME)}
          >
            ← BACK TO HOME
          </button>
          <h1 className="game-title">♟️ CHESS ♟️</h1>
        </div>
      </div>

      <div className="chess-content">
        <div className="coming-soon-card">
          <div className="card-icon">♚</div>
          <h2>COMING SOON</h2>
          <p>King of the Hill chess variant with AI opponents is under development.</p>
          <div className="status-info">
            <div className="status-item">
              <strong>Phase:</strong> Multi-player Board System Ready
            </div>
            <div className="status-item">
              <strong>Expected Release:</strong> Q1 2026
            </div>
            <div className="status-item">
              <strong>Features:</strong> King of the Hill, Time Controls, Advanced AI
            </div>
          </div>
        </div>

        <div className="game-preview">
          <h3>Game Preview</h3>
          <div className="preview-content">
            <div className="board-preview">
              <h4>King of the Hill Board</h4>
              <div className="chess-board-preview">
                <div className="board-square" id="hill-square">♔</div>
                <div className="board-square"></div>
                <div className="board-square">♛</div>
                <div className="board-square"></div>
              </div>
              <p className="board-note">
                King of the Hill: Control the center square to win!
              </p>
            </div>

            <div className="game-details">
              <h4>Game Features</h4>
              <ul>
                <li>• 4-player chess variant</li>
                <li>• King of the Hill rules</li>
                <li>• Capture center to score</li>
                <li>• Team-based gameplay</li>
                <li>• Strategic depth</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <footer className="page-footer">
        <p>BkM Chess Terminal v0.1 - Beta Coming Soon</p>
      </footer>
    </div>
  );
};

export default ChessPage;
