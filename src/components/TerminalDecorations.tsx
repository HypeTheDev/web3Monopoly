import React, { useEffect, useState } from 'react';
import { PageType } from '../pages/PageRouter';
import './TerminalDecorations.css';

interface TerminalDecorationsProps {
  currentPage: PageType;
}

const TerminalDecorations: React.FC<TerminalDecorationsProps> = ({ currentPage }) => {
  const [dataStream, setDataStream] = useState<string[]>([]);
  const [activeMonitors, setActiveMonitors] = useState<number[]>([]);

  // Page-specific data streams
  const getPageDataStream = (page: PageType): string[] => {
    switch (page) {
      case PageType.MESSENGER:
        return [
          'MSG_ENCRYPTED_001',
          'P2P_HANDSHAKE_OK',
          'CRYPTO_KEY_EXCHANGE',
          'QUANTUM_SECURED',
          'END_TO_END_ACTIVE'
        ];
      case PageType.MONOPOLY:
        return [
          'PROPERTY_DATA_SYNC',
          'AI_STRATEGY_CALC',
          'MARKET_ANALYSIS',
          'TRADE_OPTIMIZATION',
          'ECONOMIC_MODELING'
        ];
      case PageType.DBA:
        return [
          'NBA_STATS_FEED',
          'PLAYER_DATA_SYNC',
          'FANTASY_CALC_RUN',
          'LEAGUE_STANDINGS',
          'INJURY_REPORTS'
        ];
      case PageType.CHESS:
        return [
          'ENGINE_DEPTH_15',
          'POSITION_ANALYSIS',
          'MOVE_EVALUATION',
          'ENDGAME_TABLES',
          'OPENING_BOOK'
        ];
      case PageType.SPADES:
        return [
          'CARD_SHUFFLE_RND',
          'BID_CALCULATION',
          'TRICK_ANALYSIS',
          'PARTNER_AI_SYNC',
          'GAME_STATE_UPD'
        ];
      default: // HOME
        return [
          'NEURAL_NET_INIT',
          'SYSTEM_DIAGNOSTICS',
          'QUANTUM_PROCESSORS',
          'SECURITY_SCAN_OK',
          'ALL_SYSTEMS_GO'
        ];
    }
  };

  // Update data stream based on page
  useEffect(() => {
    const stream = getPageDataStream(currentPage);
    setDataStream(stream);
    
    // Reset active monitors when page changes
    setActiveMonitors([0, 1, 2]);
  }, [currentPage]);

  // Simulate data streaming
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveMonitors(prev => {
        const newActive = [];
        for (let i = 0; i < 4; i++) {
          if (Math.random() > 0.3) {
            newActive.push(i);
          }
        }
        return newActive.length > 0 ? newActive : [0];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="terminal-decorations">
      {/* Data Stream Monitors */}
      <div className="data-stream-container">
        {Array.from({ length: 4 }, (_, index) => (
          <div 
            key={index}
            className={`data-monitor ${activeMonitors.includes(index) ? 'active' : 'inactive'}`}
          >
            <div className="monitor-header">
              <span className="monitor-id">MON{index + 1}</span>
              <div className="monitor-status">
                <div className={`status-led ${activeMonitors.includes(index) ? 'online' : 'offline'}`}></div>
              </div>
            </div>
            <div className="monitor-content">
              {dataStream.slice(0, 3).map((item, i) => (
                <div 
                  key={i} 
                  className="data-line"
                  style={{ animationDelay: `${i * 0.2}s` }}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Circuit Traces */}
      <div className="circuit-traces">
        <svg width="100%" height="100%" className="trace-svg">
          {/* Horizontal traces */}
          <line x1="0%" y1="20%" x2="100%" y2="20%" className="trace-line" strokeDasharray="5,5">
            <animate attributeName="stroke-dashoffset" values="0;10" dur="2s" repeatCount="indefinite" />
          </line>
          <line x1="0%" y1="80%" x2="100%" y2="80%" className="trace-line" strokeDasharray="3,7">
            <animate attributeName="stroke-dashoffset" values="0;-10" dur="3s" repeatCount="indefinite" />
          </line>
          
          {/* Vertical traces */}
          <line x1="15%" y1="0%" x2="15%" y2="100%" className="trace-line" strokeDasharray="8,4">
            <animate attributeName="stroke-dashoffset" values="0;12" dur="4s" repeatCount="indefinite" />
          </line>
          <line x1="85%" y1="0%" x2="85%" y2="100%" className="trace-line" strokeDasharray="6,6">
            <animate attributeName="stroke-dashoffset" values="0;-12" dur="2.5s" repeatCount="indefinite" />
          </line>
          
          {/* Junction points */}
          <circle cx="15%" cy="20%" r="3" className="junction-point">
            <animate attributeName="r" values="3;6;3" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="85%" cy="20%" r="3" className="junction-point">
            <animate attributeName="r" values="3;5;3" dur="1.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="15%" cy="80%" r="3" className="junction-point">
            <animate attributeName="r" values="3;7;3" dur="2.8s" repeatCount="indefinite" />
          </circle>
          <circle cx="85%" cy="80%" r="3" className="junction-point">
            <animate attributeName="r" values="3;4;3" dur="1.8s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>

      {/* Edge Terminals */}
      <div className="edge-terminals">
        <div className="terminal-edge top">
          <div className="edge-connector"></div>
          <div className="edge-connector"></div>
          <div className="edge-connector"></div>
        </div>
        <div className="terminal-edge bottom">
          <div className="edge-connector"></div>
          <div className="edge-connector"></div>
          <div className="edge-connector"></div>
        </div>
        <div className="terminal-edge left">
          <div className="edge-connector"></div>
          <div className="edge-connector"></div>
        </div>
        <div className="terminal-edge right">
          <div className="edge-connector"></div>
          <div className="edge-connector"></div>
        </div>
      </div>

      {/* System Indicators */}
      <div className="system-indicators">
        <div className="indicator-group top-left">
          <div className="system-indicator">
            <span className="indicator-label">CPU</span>
            <div className="indicator-bar">
              <div className="bar-fill cpu"></div>
            </div>
          </div>
          <div className="system-indicator">
            <span className="indicator-label">MEM</span>
            <div className="indicator-bar">
              <div className="bar-fill mem"></div>
            </div>
          </div>
        </div>
        
        <div className="indicator-group top-right">
          <div className="system-indicator">
            <span className="indicator-label">NET</span>
            <div className="indicator-dots">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TerminalDecorations;