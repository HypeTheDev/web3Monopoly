/**
 * MessengerPage - Decentralized Encrypted Messaging Platform
 * 
 * This page provides the main interface for the AlbertCrypto messaging system,
 * featuring a welcome screen and the terminal messaging interface.
 */

import React, { useState } from 'react';
import { PageType } from '../PageRouter';
import TerminalMessenger from '../../components/TerminalMessenger';
import './MessengerPage.css';

interface MessengerPageProps {
  onPageChange: (page: PageType) => void;
}

const MessengerPage: React.FC<MessengerPageProps> = ({ onPageChange }) => {
  const [showTerminal, setShowTerminal] = useState(false);

  const handleStartMessaging = () => {
    setShowTerminal(true);
  };

  const handleCloseTerminal = () => {
    setShowTerminal(false);
  };

  return (
    <div className="messenger-page">
      {/* Navigation Bar */}
      <nav className="messenger-navbar">
        <div className="messenger-brand">
          <span className="messenger-brand-icon">🔐</span>
          AbC Messenger
        </div>
        <div className="messenger-nav-links">
          <button
            className="nav-link"
            onClick={() => onPageChange(PageType.HOME)}
          >
            Home
          </button>
          <button
            className="nav-link active"
            onClick={() => {}}
          >
            Messenger
          </button>
          <button
            className="nav-link"
            onClick={() => onPageChange(PageType.DBA)}
          >
            Games
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="messenger-main">
        <div className="messenger-container">
          {!showTerminal ? (
            // Welcome Screen
            <div className="welcome-screen">
              <div className="welcome-icon">🚀</div>
              <h1 className="welcome-title">Welcome to AbC</h1>
              <p className="welcome-subtitle">
                Experience the future of secure communication with our decentralized,<br />
                end-to-end encrypted peer-to-peer messaging platform.
              </p>

              {/* Feature Cards */}
              <div className="welcome-features">
                <div className="feature-card">
                  <div className="feature-icon">🔐</div>
                  <div className="feature-title">End-to-End Encryption</div>
                  <div className="feature-description">
                    Military-grade AES-256 encryption with custom Diffie-Hellman key exchange.
                    Your messages are mathematically impossible to intercept.
                  </div>
                </div>

                <div className="feature-card">
                  <div className="feature-icon">🌐</div>
                  <div className="feature-title">Decentralized Network</div>
                  <div className="feature-description">
                    No central servers, no data collection. Direct peer-to-peer connections
                    using WebRTC technology for maximum privacy.
                  </div>
                </div>

                <div className="feature-card">
                  <div className="feature-icon">🔬</div>
                  <div className="feature-title">Advanced Cryptography</div>
                  <div className="feature-description">
                    Built on mathematical foundations with topological convergence theory
                    and matrix transformations for unbreakable security.
                  </div>
                </div>

                <div className="feature-card">
                  <div className="feature-icon">⚡</div>
                  <div className="feature-title">Real-Time Communication</div>
                  <div className="feature-description">
                    Instant message delivery with live encryption status and connection
                    monitoring in a beautiful terminal interface.
                  </div>
                </div>

                <div className="feature-card">
                  <div className="feature-icon">🛡️</div>
                  <div className="feature-title">Zero Knowledge</div>
                  <div className="feature-description">
                    No user data is stored or transmitted to any servers. Your identity
                    and conversations remain completely private.
                  </div>
                </div>

                <div className="feature-card">
                  <div className="feature-icon">🎯</div>
                  <div className="feature-title">Free & Open</div>
                  <div className="feature-description">
                    No registration, no fees, no limits. Use your own PeerJS server
                    to avoid any third-party dependencies.
                  </div>
                </div>
              </div>

              <button className="start-button" onClick={handleStartMessaging}>
                Launch Terminal
              </button>

              {/* Security Notice */}
              <div className="security-notice">
                <span className="highlight">SECURITY NOTICE:</span> This messaging platform uses 
                advanced cryptographic techniques for maximum security. All messages are encrypted 
                with <span className="highlight">AES-256</span> using keys generated through 
                <span className="highlight">Diffie-Hellman</span> key exchange. No data is ever 
                stored on external servers.
              </div>
            </div>
          ) : (
            // Terminal Messenger
            <TerminalMessenger onClose={handleCloseTerminal} />
          )}
        </div>
      </main>
    </div>
  );
};

export default MessengerPage;