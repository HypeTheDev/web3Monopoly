import React, { useEffect, useState, useMemo } from 'react';
import { PageType } from '../pages/PageRouter';
import './TerminalEffects.css';

interface TerminalEffectsProps {
  currentPage: PageType;
}

interface PageConfig {
  scanlineIntensity: number;
  noiseLevel: number;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  atmosphere: 'cyberpunk' | 'retro' | 'matrix' | 'neon' | 'classic';
  particleCount: number;
  glitchChance: number;
  terminalText: string[];
  statusMessages: string[];
}

const TerminalEffects: React.FC<TerminalEffectsProps> = ({ currentPage }) => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [glitchActive, setGlitchActive] = useState(false);
  const [bootSequence, setBootSequence] = useState(false);

  // Page-specific configurations
  const pageConfigs: Record<PageType, PageConfig> = useMemo(() => ({
    [PageType.HOME]: {
      scanlineIntensity: 0.3,
      noiseLevel: 0.1,
      primaryColor: '#00ff00',
      secondaryColor: '#ffff00',
      accentColor: '#00ffff',
      atmosphere: 'cyberpunk',
      particleCount: 15,
      glitchChance: 0.05,
      terminalText: [
        'NEURAL NETWORK ONLINE',
        'QUANTUM PROCESSORS ACTIVE',
        'ENCRYPTION PROTOCOLS LOADED',
        'GAME MATRIX INITIALIZED'
      ],
      statusMessages: [
        'ALL SYSTEMS OPERATIONAL',
        'SECURITY LEVELS: MAXIMUM',
        'CONNECTION: STABLE',
        'READY FOR NEURAL LINK'
      ]
    },
    [PageType.MESSENGER]: {
      scanlineIntensity: 0.5,
      noiseLevel: 0.2,
      primaryColor: '#ff00ff',
      secondaryColor: '#00ffff',
      accentColor: '#ff0080',
      atmosphere: 'matrix',
      particleCount: 25,
      glitchChance: 0.1,
      terminalText: [
        'ENCRYPTED CHANNEL ACTIVE',
        'P2P PROTOCOLS ENGAGED',
        'QUANTUM ENCRYPTION ONLINE',
        'SECURE MESSAGING READY'
      ],
      statusMessages: [
        'ENCRYPTION: AES-256',
        'CONNECTION: PEER-TO-PEER',
        'STATUS: ANONYMOUS',
        'SECURITY: QUANTUM LEVEL'
      ]
    },
    [PageType.MONOPOLY]: {
      scanlineIntensity: 0.2,
      noiseLevel: 0.05,
      primaryColor: '#00ff00',
      secondaryColor: '#ffd700',
      accentColor: '#ff6b35',
      atmosphere: 'retro',
      particleCount: 10,
      glitchChance: 0.02,
      terminalText: [
        'PROPERTY MATRIX LOADED',
        'AI OPPONENTS INITIALIZED',
        'ECONOMIC SIMULATION READY',
        'REAL ESTATE ENGINE ONLINE'
      ],
      statusMessages: [
        'BANK RESERVES: UNLIMITED',
        'PROPERTIES: 40 AVAILABLE',
        'AI DIFFICULTY: ADAPTIVE',
        'GAME MODE: CLASSIC'
      ]
    },
    [PageType.DBA]: {
      scanlineIntensity: 0.4,
      noiseLevel: 0.15,
      primaryColor: '#ff8800',
      secondaryColor: '#00ff80',  
      accentColor: '#8080ff',
      atmosphere: 'neon',
      particleCount: 20,
      glitchChance: 0.08,
      terminalText: [
        'NBA DATA FEED ACTIVE',
        'STATISTICS ENGINE ONLINE',
        'FANTASY PROTOCOLS LOADED',
        'PLAYER DATABASE SYNCED'
      ],
      statusMessages: [
        'SEASON: 2024-25 ACTIVE',
        'PLAYERS: 450+ TRACKED',
        'STATS: REAL-TIME',
        'LEAGUES: READY'
      ]
    },
    [PageType.CHESS]: {
      scanlineIntensity: 0.35,
      noiseLevel: 0.08,
      primaryColor: '#8888ff',
      secondaryColor: '#ffff88',
      accentColor: '#ff88ff',
      atmosphere: 'classic',
      particleCount: 12,
      glitchChance: 0.03,
      terminalText: [
        'CHESS ENGINE CALCULATING',
        'DEEP BLUE PROTOCOLS ACTIVE',
        'STRATEGY MATRIX LOADED',
        'GRANDMASTER MODE READY'
      ],
      statusMessages: [
        'ENGINE DEPTH: 15+ MOVES',
        'DIFFICULTY: GRANDMASTER',
        'ANALYSIS: REAL-TIME',
        'MODE: KING OF THE HILL'
      ]
    },
    [PageType.SPADES]: {
      scanlineIntensity: 0.25,
      noiseLevel: 0.12,
      primaryColor: '#ff4444',
      secondaryColor: '#44ff44',
      accentColor: '#4444ff',
      atmosphere: 'cyberpunk',
      particleCount: 18,
      glitchChance: 0.06,
      terminalText: [
        'CARD DECK INITIALIZED',
        'TRICK ALGORITHMS LOADED',
        'BIDDING SYSTEM ONLINE',
        'PARTNER AI READY'
      ],
      statusMessages: [
        'DECK: 52 CARDS SHUFFLED',
        'PARTNERSHIPS: BALANCED',
        'SCORING: ADVANCED',
        'DIFFICULTY: EXPERT'
      ]
    },
    [PageType.SEVEN777]: {
      scanlineIntensity: 0.35,
      noiseLevel: 0.18,
      primaryColor: '#ffd700',
      secondaryColor: '#ff4444',
      accentColor: '#ffff88',
      atmosphere: 'neon',
      particleCount: 30,
      glitchChance: 0.12,
      terminalText: [
        'CASINO ENGINES LOADED',
        'VIRTUAL CREDITS CONFIRMED',
        'GAMBLING PROTOCOLS ENABLED',
        'LUCK CALCULATION ACTIVE'
      ],
      statusMessages: [
        'BALANCE: FAKE CREDITS ONLY',
        'HOUSE EDGE: STANDARD',
        'GAMES: MULTIPLE ACTIVE',
        'RISK LEVEL: ENTERTAINMENT'
      ]
    }
  }), []);

  const config = pageConfigs[currentPage];

  // Cycle through status messages
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % config.statusMessages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [config.statusMessages.length]);

  // Random glitch effects
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() < config.glitchChance) {
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 150);
      }
    }, 2000);

    return () => clearInterval(glitchInterval);
  }, [config.glitchChance]);

  // Boot sequence on page change
  useEffect(() => {
    setBootSequence(true);
    const timer = setTimeout(() => setBootSequence(false), 2000);
    return () => clearTimeout(timer);
  }, [currentPage]);

  return (
    <div 
      className={`terminal-effects ${config.atmosphere}`}
      style={{
        '--page-primary': config.primaryColor,
        '--page-secondary': config.secondaryColor,
        '--page-accent': config.accentColor,
        '--scanline-intensity': config.scanlineIntensity,
        '--noise-level': config.noiseLevel,
      } as React.CSSProperties}
    >
      {/* CRT Scanlines */}
      <div className="crt-scanlines"></div>
      
      {/* TV Noise */}
      <div className="tv-noise"></div>
      
      {/* Vignette Effect */}
      <div className="crt-vignette"></div>
      
      {/* Screen Curvature */}
      <div className="screen-curvature"></div>
      
      {/* Glitch Effect */}
      {glitchActive && <div className="glitch-overlay"></div>}
      
      {/* Terminal Status Bar */}
      <div className="terminal-status-bar">
        <div className="status-left">
          <span className="status-indicator active"></span>
          <span className="status-text">{config.terminalText[currentMessage % config.terminalText.length]}</span>
        </div>
        <div className="status-center">
          <div className="status-bars">
            {Array.from({ length: 5 }, (_, i) => (
              <div 
                key={i} 
                className={`status-bar ${i < 3 ? 'active' : ''}`}
                style={{ animationDelay: `${i * 0.2}s` }}
              ></div>
            ))}
          </div>
        </div>
        <div className="status-right">
          <span className="status-message">{config.statusMessages[currentMessage]}</span>
          <span className="status-time">{new Date().toLocaleTimeString()}</span>
        </div>
      </div>
      
      {/* Corner Details */}
      <div className="corner-details">
        <div className="corner-detail top-left">
          <div className="corner-text">SYS</div>
          <div className="corner-bars">
            <div className="corner-bar"></div>
            <div className="corner-bar"></div>
            <div className="corner-bar"></div>
          </div>
        </div>
        
        <div className="corner-detail top-right">
          <div className="corner-bars">
            <div className="corner-bar"></div>
            <div className="corner-bar"></div>
          </div>
          <div className="corner-text">NET</div>
        </div>
        
        <div className="corner-detail bottom-left">
          <div className="corner-text">PWR</div>
          <div className="power-indicator"></div>
        </div>
        
        <div className="corner-detail bottom-right">
          <div className="connection-status">
            <div className="connection-dot"></div>
            <div className="connection-dot"></div>
            <div className="connection-dot"></div>
          </div>
          <div className="corner-text">CON</div>
        </div>
      </div>
      
      {/* Atmospheric Particles */}
      <div className="atmospheric-particles">
        {Array.from({ length: config.particleCount }, (_, i) => (
          <div 
            key={i}
            className="atmospheric-particle"
            style={{
              '--particle-delay': `${Math.random() * 10}s`,
              '--particle-duration': `${15 + Math.random() * 20}s`,
              '--particle-size': `${2 + Math.random() * 4}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            } as React.CSSProperties}
          ></div>
        ))}
      </div>
      
      {/* Boot Sequence Overlay */}
      {bootSequence && (
        <div className="boot-sequence">
          <div className="boot-text">
            <div className="boot-line">INITIALIZING {currentPage.toUpperCase()} MODULE...</div>
            <div className="boot-line">LOADING NEURAL INTERFACES...</div>
            <div className="boot-line">ESTABLISHING QUANTUM LINK...</div>
            <div className="boot-line boot-ready">SYSTEM READY</div>
          </div>
          <div className="boot-progress">
            <div className="boot-progress-bar"></div>
          </div>
        </div>
      )}
      
      {/* Page-Specific Terminal Readouts */}
      <div className="terminal-readouts">
        <div className="readout-column left">
          {config.terminalText.map((text, index) => (
            <div 
              key={index}
              className="readout-line"
              style={{ animationDelay: `${index * 0.5}s` }}
            >
              <span className="readout-prompt">{'>'}</span>
              <span className="readout-text">{text}</span>
            </div>
          ))}
        </div>
        
        <div className="readout-column right">
          {config.statusMessages.map((message, index) => (
            <div 
              key={index}
              className="readout-line"
              style={{ animationDelay: `${index * 0.3}s` }}
            >
              <span className="readout-status">●</span>
              <span className="readout-text">{message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TerminalEffects;
