import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import MatrixRain from '../../components/MatrixRain';
import './LoginPage.css';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const { login } = useUser();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim().length >= 3) {
      login(username.trim());
    }
  };

  return (
    <div className="login-page">
      <MatrixRain />
      <div className="login-container">
        <div className="login-box">
          <h1 className="login-title">
            <span className="glitch" data-text="AbC Platform">AbC Platform</span>
          </h1>
          <p className="login-subtitle">Enter the decentralized gaming network</p>
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                minLength={3}
                maxLength={20}
                required
                autoFocus
              />
              <span className="input-hint">Minimum 3 characters</span>
            </div>
            
            <button type="submit" className="login-button" disabled={username.trim().length < 3}>
              <span className="button-text">Initialize Connection</span>
              <span className="button-arrow">→</span>
            </button>
          </form>

          <div className="login-features">
            <div className="feature">
              <span className="feature-icon">🎮</span>
              <span>Multi-game platform</span>
            </div>
            <div className="feature">
              <span className="feature-icon">💬</span>
              <span>P2P encrypted messaging</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🔗</span>
              <span>Web3 blockchain integration</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
