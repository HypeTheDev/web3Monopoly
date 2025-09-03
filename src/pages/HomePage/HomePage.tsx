import React, { useState } from 'react';
import { PageType } from '../PageRouter';
import './HomePage.css';

// Import shared components
import AdBox from '../../components/AdBox';
import ColorPicker from '../../components/ColorPicker';

interface HomePageProps {
  onPageChange: (page: PageType) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onPageChange }) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showAdBox, setShowAdBox] = useState(true);

  const [terminalTheme, setTerminalTheme] = useState({
    primaryColor: '#00ff00',
    secondaryColor: '#ffff00',
    backgroundColor: '#000000',
    panelColor: '#111111',
    borderColor: '#333333',
    textColor: '#00ff00'
  });

  const handleColorChange = (key: string, color: string) => {
    setTerminalTheme(prev => ({
      ...prev,
      [key]: color
    }));
  };

  return (
    <div className="homepage" style={{
      '--primary-color': terminalTheme.primaryColor,
      '--secondary-color': terminalTheme.secondaryColor,
      '--background-color': terminalTheme.backgroundColor,
      '--panel-color': terminalTheme.panelColor,
      '--border-color': terminalTheme.borderColor,
    } as React.CSSProperties}>

      {/* Terminal Header */}
      <header className="terminal-header">
        <div className="terminal-brand">
          <h1 className="brand-title">BKM TERMINAL</h1>
          <div className="brand-subtitle">NEURAL GAME NETWORK v1.0</div>
        </div>
        <div className="terminal-controls">
          <button
            className="theme-btn"
            onClick={() => setShowColorPicker(true)}
            title="Customize Terminal Theme"
          >
            🎨 THEME
          </button>
        </div>
      </header>

      {/* Main Terminal Interface */}
      <main className="terminal-main">
        <div className="terminal-grid">



          {/* Center Panel - Game Selection */}
          <div className="terminal-panel center-panel">
            <div className="panel-header">
              <h3>🚀 GAME LAUNCH TERMINAL</h3>
              <div className="network-status">
                <span className="status-dot"></span>
                <span>ALL SYSTEMS OPERATIONAL</span>
              </div>
            </div>
            <div className="panel-content">
              <h2 className="hero-title">BKM</h2>
              <p className="hero-subtitle">Choose Your Game</p>

              <div className="game-grid">
                <div className="game-card" onClick={() => onPageChange(PageType.MONOPOLY)}>
                  <div className="game-icon">🏠</div>
                  <h3>MONOPOLY</h3>
                  <p>Classic property trading game with AI bots</p>
                  <button className="game-btn">LAUNCH</button>
                </div>

                <div className="game-card" onClick={() => onPageChange(PageType.DBA)}>
                  <div className="game-icon">🏀</div>
                  <h3>DBA</h3>
                  <p>Fantasy basketball league management</p>
                  <button className="game-btn">LAUNCH</button>
                </div>

                <div className="game-card featured" onClick={() => onPageChange(PageType.MESSENGER)}>
                  <div className="game-icon">🔐</div>
                  <h3>ALBERTCRYPTO</h3>
                  <p>Encrypted P2P messaging terminal</p>
                  <button className="game-btn">LAUNCH</button>
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

          {/* Right Panel - Ad Box */}
          <div className="terminal-panel ad-panel">
            <div className="panel-header">
              <h3>📡 NETWORK BROADCAST</h3>
              <button
                className="hide-ad-btn"
                onClick={() => setShowAdBox(!showAdBox)}
                title={showAdBox ? "Hide Ad Box" : "Show Ad Box"}
              >
                {showAdBox ? "HIDE ▲" : "SHOW ▼"}
              </button>
            </div>
            <div className={`panel-content ${showAdBox ? '' : 'hidden'}`}>
              <AdBox />
            </div>
          </div>

        </div>
      </main>

      {/* Terminal Footer */}
      <footer className="terminal-footer">
        <div className="footer-content">
          <span>ESTABLISHING NEURAL LINK...</span>
          <span>CONNECTION SECURE</span>
          <span>© 2025 NEO NETWORK SYSTEMS</span>
        </div>
      </footer>

      {/* Modals */}
      {showColorPicker && (
        <ColorPicker
          theme={terminalTheme}
          onColorChange={handleColorChange}
          onClose={() => setShowColorPicker(false)}
        />
      )}

    </div>
  );
};

export default HomePage;
