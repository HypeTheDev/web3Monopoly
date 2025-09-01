import React from 'react';
import { PageType } from '../PageRouter';
import './HomePage.css';

interface HomePageProps {
  onPageChange: (page: PageType) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onPageChange }) => {
  return (
    <div className="homepage">
      <div className="hero-section">
        <h1 className="hero-title">WELCOME TO BKM</h1>
        <p className="hero-subtitle">Choose Your Game</p>

        <div className="game-grid">
          <div className="game-card" onClick={() => onPageChange(PageType.MONOPOLY)}>
            <div className="game-icon">🏠</div>
            <h3>MONOPOLY</h3>
            <p>Classic property trading game with AI bots</p>
            <button className="game-btn">PLAY NOW</button>
          </div>

          <div className="game-card" onClick={() => onPageChange(PageType.DBA)}>
            <div className="game-icon">🏀</div>
            <h3>DBA</h3>
            <p>Fantasy basketball league management</p>
            <button className="game-btn">PLAY NOW</button>
          </div>

          <div className="game-card soon">
            <div className="game-icon">♠️</div>
            <h3>SPADES</h3>
            <p>Trick-taking card game - Coming Soon</p>
            <button className="game-btn disabled">COMING SOON</button>
          </div>

          <div className="game-card soon">
            <div className="game-icon">♟️</div>
            <h3>CHESS</h3>
            <p>King of the Hill variant - Coming Soon</p>
            <button className="game-btn disabled">COMING SOON</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
