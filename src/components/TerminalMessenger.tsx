/**
 * TerminalMessenger - Terminal-style P2P Encrypted Messaging Interface
 * 
 * A cyberpunk-themed terminal interface for secure peer-to-peer messaging
 * with real-time encryption status and connection management.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { P2PMessagingService, P2PMessage, ConnectionStatus, PeerInfo } from '../lib/P2PMessagingService';
import './TerminalMessenger.css';

interface TerminalMessengerProps {
  onClose?: () => void;
}

const TerminalMessenger: React.FC<TerminalMessengerProps> = ({ onClose }) => {
  const [messagingService] = useState(() => new P2PMessagingService());
  const [messages, setMessages] = useState<P2PMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    isOnline: false,
    peerId: null,
    connectedPeers: [],
    encryptionStatus: 'none'
  });
  const [peers, setPeers] = useState<PeerInfo[]>([]);
  const [connectPeerId, setConnectPeerId] = useState('');
  const [isInitializing, setIsInitializing] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Matrix rain effect
  const [matrixChars, setMatrixChars] = useState<Array<{id: number, char: string, x: number, delay: number}>>([]);

  // Handle new messages
  const handleNewMessage = useCallback((message: P2PMessage) => {
    setMessages(prev => [...prev, message]);
  }, []);

  // Handle connection status changes
  const handleConnectionChange = useCallback((status: ConnectionStatus) => {
    setConnectionStatus(status);
  }, []);

  // Handle peer updates
  const handlePeerUpdate = useCallback((peer: PeerInfo) => {
    setPeers(prev => {
      const existing = prev.find(p => p.id === peer.id);
      if (existing) {
        return prev.map(p => p.id === peer.id ? peer : p);
      } else {
        return [...prev, peer];
      }
    });
  }, []);

  // Initialize messaging service
  useEffect(() => {
    const initializeService = async () => {
      try {
        const peerId = await messagingService.initialize();
        console.log('Messaging service initialized with peer ID:', peerId);
        
        // Load existing message history
        const history = messagingService.getMessageHistory();
        setMessages(history);
        
        setIsInitializing(false);
      } catch (error) {
        console.error('Failed to initialize messaging service:', error);
        setIsInitializing(false);
      }
    };

    initializeService();

    // Setup event handlers
    messagingService.onMessage(handleNewMessage);
    messagingService.onConnection(handleConnectionChange);
    messagingService.onPeer(handlePeerUpdate);

    return () => {
      messagingService.cleanup();
    };
  }, [messagingService, handleNewMessage, handleConnectionChange, handlePeerUpdate]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Matrix rain effect
  useEffect(() => {
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    let id = 0;

    const createMatrixChar = () => {
      const char = chars[Math.floor(Math.random() * chars.length)];
      const x = Math.random() * 100;
      const delay = Math.random() * 2000;
      
      return { id: id++, char, x, delay };
    };

    const interval = setInterval(() => {
      setMatrixChars(prev => {
        const newChars = [...prev];
        
        // Add new character occasionally
        if (Math.random() < 0.1) {
          newChars.push(createMatrixChar());
        }
        
        // Remove old characters
        return newChars.filter(char => Date.now() - char.delay < 5000);
      });
    }, 200);

    // Initialize some characters
    const initialChars = Array.from({ length: 10 }, createMatrixChar);
    setMatrixChars(initialChars);

    return () => clearInterval(interval);
  }, []);

  // Send message
  const sendMessage = () => {
    if (!inputMessage.trim() || connectionStatus.connectedPeers.length === 0) {
      return;
    }

    // Send to all connected peers
    connectionStatus.connectedPeers.forEach(peerId => {
      const success = messagingService.sendMessage(peerId, inputMessage.trim());
      if (!success) {
        console.error(`Failed to send message to peer: ${peerId}`);
      }
    });

    setInputMessage('');
    inputRef.current?.focus();
  };

  // Connect to peer
  const connectToPeer = async () => {
    if (!connectPeerId.trim()) return;

    try {
      const success = await messagingService.connectToPeer(connectPeerId.trim());
      if (success) {
        setConnectPeerId('');
        addSystemMessage(`Connecting to peer: ${connectPeerId.trim()}`);
      } else {
        addSystemMessage(`Failed to connect to peer: ${connectPeerId.trim()}`);
      }
    } catch (error) {
      console.error('Error connecting to peer:', error);
      addSystemMessage(`Error connecting to peer: ${connectPeerId.trim()}`);
    }
  };

  // Disconnect from peer
  const disconnectFromPeer = (peerId: string) => {
    messagingService.disconnectFromPeer(peerId);
    addSystemMessage(`Disconnected from peer: ${peerId}`);
  };

  // Add system message
  const addSystemMessage = (content: string) => {
    const systemMessage: P2PMessage = {
      id: `system-${Date.now()}`,
      content,
      timestamp: Date.now(),
      sender: 'system',
      isEncrypted: false,
      isOwn: false
    };
    setMessages(prev => [...prev, systemMessage]);
  };

  // Handle key press in input
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  // Get status indicator class
  const getStatusClass = () => {
    if (!connectionStatus.isOnline) return 'status-offline';
    if (connectionStatus.connectedPeers.length === 0) return 'status-connecting';
    return 'status-online';
  };

  // Get encryption status text
  const getEncryptionStatusText = () => {
    switch (connectionStatus.encryptionStatus) {
      case 'ready': return '🔐 Encrypted';
      case 'handshake': return '🤝 Handshake';
      case 'none': return '🔓 No Encryption';
      default: return '❓ Unknown';
    }
  };

  if (isInitializing) {
    return (
      <div className="terminal-messenger">
        <div className="terminal-header">
          <div className="terminal-title">
            <span className="status-indicator status-connecting"></span>
            AbC Terminal - Initializing...
          </div>
        </div>
        <div className="terminal-body">
          <div className="empty-state">
            <div className="empty-state-icon">⚡</div>
            <div className="empty-state-text">Initializing P2P Network...</div>
            <div className="empty-state-subtext">Setting up secure connections</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="terminal-messenger">
      {/* Matrix Rain Background */}
      <div className="matrix-rain">
        {matrixChars.map(char => (
          <div
            key={char.id}
            className="matrix-char"
            style={{
              left: `${char.x}%`,
              animationDelay: `${char.delay}ms`
            }}
          >
            {char.char}
          </div>
        ))}
      </div>

      {/* Terminal Header */}
      <div className="terminal-header">
        <div className="terminal-title">
          <span className={`status-indicator ${getStatusClass()}`}></span>
          AbC Terminal v1.0
        </div>
        <div className="connection-info">
          {connectionStatus.peerId && (
            <>
              ID: {connectionStatus.peerId.substring(0, 12)}... | 
              Peers: {connectionStatus.connectedPeers.length} | 
              {getEncryptionStatusText()}
            </>
          )}
        </div>
      </div>

      {/* Terminal Body */}
      <div className="terminal-body">
        {/* Message Area */}
        <div className="message-area">
          <div className="messages-container">
            {messages.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">💬</div>
                <div className="empty-state-text">No messages yet</div>
                <div className="empty-state-subtext">Connect to a peer to start secure messaging</div>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`message ${
                    message.sender === 'system' 
                      ? 'message-system' 
                      : message.isOwn 
                        ? 'message-own' 
                        : 'message-peer'
                  }`}
                >
                  <div className="message-header">
                    {message.sender === 'system' ? 'System' : 
                     message.isOwn ? 'You' : message.sender} 
                    • {formatTimestamp(message.timestamp)}
                  </div>
                  <div className={`message-content ${message.isEncrypted ? 'message-encrypted' : ''}`}>
                    {message.content}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="input-area">
            <span className="input-prefix">{'>'}</span>
            <input
              ref={inputRef}
              type="text"
              className="message-input"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                connectionStatus.connectedPeers.length === 0
                  ? "Connect to a peer first..."
                  : "Type your encrypted message..."
              }
              disabled={connectionStatus.connectedPeers.length === 0}
            />
            <button
              className="send-button"
              onClick={sendMessage}
              disabled={!inputMessage.trim() || connectionStatus.connectedPeers.length === 0}
            >
              Send
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          {/* Your Peer ID */}
          <div className="sidebar-section">
            <div className="sidebar-title">Your Peer ID</div>
            <div className="peer-id-display">
              {connectionStatus.peerId || 'Not connected'}
            </div>
            <button
              className="connect-button"
              onClick={() => {
                if (connectionStatus.peerId) {
                  navigator.clipboard.writeText(connectionStatus.peerId);
                  addSystemMessage('Peer ID copied to clipboard');
                }
              }}
              disabled={!connectionStatus.peerId}
            >
              Copy ID
            </button>
          </div>

          {/* Connect to Peer */}
          <div className="sidebar-section">
            <div className="sidebar-title">Connect to Peer</div>
            <div className="connect-form">
              <input
                type="text"
                className="peer-input"
                value={connectPeerId}
                onChange={(e) => setConnectPeerId(e.target.value)}
                placeholder="Enter peer ID..."
                onKeyPress={(e) => e.key === 'Enter' && connectToPeer()}
              />
              <button
                className="connect-button"
                onClick={connectToPeer}
                disabled={!connectPeerId.trim() || !connectionStatus.isOnline}
              >
                Connect
              </button>
            </div>
          </div>

          {/* Connected Peers */}
          <div className="sidebar-section">
            <div className="sidebar-title">Connected Peers ({peers.filter(p => p.isConnected).length})</div>
            <div className="peers-list">
              {peers.filter(p => p.isConnected).length === 0 ? (
                <div style={{ color: '#555', fontSize: '11px', textAlign: 'center', padding: '20px 0' }}>
                  No peers connected
                </div>
              ) : (
                peers.filter(p => p.isConnected).map((peer) => (
                  <div key={peer.id} className="peer-item">
                    <div className="peer-name" title={peer.id}>
                      {peer.id.substring(0, 16)}...
                    </div>
                    <div className="peer-status">
                      <span className="encryption-indicator">
                        {peer.isEncryptionReady ? '🔐' : '🔓'}
                      </span>
                      <button
                        className="disconnect-button"
                        onClick={() => disconnectFromPeer(peer.id)}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="sidebar-section">
            <div className="sidebar-title">Controls</div>
            <button
              className="connect-button"
              style={{ marginBottom: '8px', width: '100%' }}
              onClick={() => {
                messagingService.clearMessageHistory();
                setMessages([]);
                addSystemMessage('Message history cleared');
              }}
            >
              Clear History
            </button>
            {onClose && (
              <button
                className="disconnect-button"
                style={{ width: '100%' }}
                onClick={onClose}
              >
                Close Terminal
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile sidebar toggle */}
      <button
        className="sidebar-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'transparent',
          border: '1px solid #00ff00',
          color: '#00ff00',
          padding: '5px 10px',
          fontSize: '12px',
          cursor: 'pointer',
          borderRadius: '4px',
          display: window.innerWidth <= 768 ? 'block' : 'none'
        }}
      >
        {sidebarOpen ? '×' : '☰'}
      </button>
    </div>
  );
};

export default TerminalMessenger;