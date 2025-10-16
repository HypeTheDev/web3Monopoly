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
                  <div className="feature-icon">🚀</div>
                  <div className="feature-title">Web3 Ready - Easy Connections</div>
                  <div className="feature-description">
                    Once you have a peer ID from MetaMask signatures, NFT transfers, or current wallet address lookup, connecting to friends is instant. No QR codes, no complex setup!
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
                <span className="highlight">WEB3 SIMPLICITY:</span> Just share your unique peer ID
                with friends (like sharing a wallet address). Click connect, instant encrypted chat!
                <span className="highlight"> No servers, no registration, no middlemen!</span>
              </div>

              {/* Quick Start */}
              <div className="quick-start">
                <h3 style={{ color: '#00ff00', textAlign: 'center', marginBottom: '15px' }}>
                  🚀 How Web3 Messaging Works
                </h3>
                <div className="quick-steps">
                  <div className="step">
                    <div className="step-number">1</div>
                    <div>Launch Terminal (get your unique Peer ID)</div>
                  </div>
                  <div className="step">
                    <div className="step-number">2</div>
                    <div>Share your Peer ID with a friend</div>
                  </div>
                  <div className="step">
                    <div className="step-number">3</div>
                    <div>Paste their ID & connect - instant!</div>
                  </div>
                  <div className="step">
                    <div className="step-number">4</div>
                    <div>Auto-encrypted messages flow directly</div>
                  </div>
                </div>
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
