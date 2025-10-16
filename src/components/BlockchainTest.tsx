import React, { useState, useEffect, useRef } from 'react';
import { gameBlockchainService } from '../services/GameBlockchainService';
import { GameMode, Player } from '../types/GameTypes';

interface BlockchainTestProps {}

interface Position {
  x: number;
  y: number;
}

const BlockchainTest: React.FC<BlockchainTestProps> = () => {
  const [connectionStatus, setConnectionStatus] = useState(gameBlockchainService.getConnectionStatus());
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);
  const [gasPrice, setGasPrice] = useState<string>('0');
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState<Position>({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const dragRef = useRef<HTMLDivElement>(null);

  // Load saved position and minimized state from localStorage
  useEffect(() => {
    const savedPosition = localStorage.getItem('web3PanelPosition');
    const savedMinimized = localStorage.getItem('web3PanelMinimized');

    if (savedPosition) {
      try {
        const parsed = JSON.parse(savedPosition);
        setPosition(parsed);
      } catch (e) {
        console.warn('Failed to parse saved web3 panel position');
      }
    }

    if (savedMinimized) {
      setIsMinimized(savedMinimized === 'true');
    }
  }, []);

  // Save position to localStorage
  useEffect(() => {
    localStorage.setItem('web3PanelPosition', JSON.stringify(position));
  }, [position]);

  // Save minimized state to localStorage
  useEffect(() => {
    localStorage.setItem('web3PanelMinimized', isMinimized.toString());
  }, [isMinimized]);

  useEffect(() => {
    // Listen for connection changes
    gameBlockchainService.onConnectionChange((connection) => {
      setConnectionStatus(connection);
      addTestResult(`Connection status changed: ${connection.isConnected ? 'Connected' : 'Disconnected'}`);
    });

    // Get initial gas price
    updateGasPrice();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const updateGasPrice = async () => {
    setIsLoading(true);
    try {
      const price = await gameBlockchainService.getGasPrice();
      setGasPrice(price);
      addTestResult(`Gas price updated: ${price} gwei`);
    } catch (error) {
      console.error('Failed to get gas price:', error);
      addTestResult(`Failed to get gas price: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    setIsLoading(false);
  };

  const connectWallet = async () => {
    setIsLoading(true);
    try {
      const connection = await gameBlockchainService.connectWallet();
      setConnectionStatus(connection);
      addTestResult(`Wallet connected: ${connection.accountAddress}`);
    } catch (error) {
      addTestResult(`Failed to connect wallet: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    setIsLoading(false);
  };

  const switchToPolygon = async () => {
    setIsLoading(true);
    try {
      await gameBlockchainService.switchNetwork(80001); // Polygon Mumbai testnet
      addTestResult('Switched to Polygon Mumbai testnet');
      await updateGasPrice();
    } catch (error) {
      addTestResult(`Failed to switch network: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    setIsLoading(false);
  };

  const createTestGameSession = async () => {
    if (!connectionStatus.isConnected) {
      addTestResult('Cannot create game session: Wallet not connected');
      return;
    }

    setIsLoading(true);
    try {
      // Create test players
      const testPlayers: Player[] = [
        {
          id: 'player1',
          name: 'Alice',
          money: 1500,
          position: 0,
          properties: [],
          inJail: false,
          jailTurns: 0,
          tokenId: 'token1',
          color: '#FF0000'
        },
        {
          id: 'player2',
          name: 'Bob',
          money: 1500,
          position: 0,
          properties: [],
          inJail: false,
          jailTurns: 0,
          tokenId: 'token2',
          color: '#0000FF'
        }
      ];

      const sessionId = await gameBlockchainService.createGameSession(GameMode.MONOPOLY, testPlayers);
      addTestResult(`Game session created: ${sessionId}`);
    } catch (error) {
      addTestResult(`Failed to create game session: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    setIsLoading(false);
  };

  const mintTestNFT = async () => {
    if (!connectionStatus.isConnected) {
      addTestResult('Cannot mint NFT: Wallet not connected');
      return;
    }

    setIsLoading(true);
    try {
      const result = await gameBlockchainService.mintGameNFT(GameMode.MONOPOLY, 'test-session', {
        attributes: [
          { trait_type: 'Test NFT', value: 'true' },
          { trait_type: 'Rarity', value: 'Common' }
        ]
      });

      if (result.success) {
        addTestResult(`NFT minted successfully: ${result.txHash}`);
      } else {
        addTestResult(`Failed to mint NFT: ${result.error}`);
      }
    } catch (error) {
      addTestResult(`Failed to mint NFT: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    setIsLoading(false);
  };

  const getCurrentNetwork = () => {
    const network = gameBlockchainService.getCurrentNetwork();
    return network ? `${network.chainName} (${network.networkId})` : 'Unknown';
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!dragRef.current) return;

    e.preventDefault();
    e.stopPropagation();

    const rect = dragRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setIsDragging(true);
  };

  // Snap to edges function
  const snapToEdges = (x: number, y: number) => {
    const snapThreshold = 50; // pixels from edge to trigger snap
    const elementWidth = dragRef.current?.offsetWidth || 400;
    const elementHeight = dragRef.current?.offsetHeight || 300;

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    let newX = x;
    let newY = y;

    // Snap to left edge
    if (x < snapThreshold) {
      newX = 10;
    }
    // Snap to right edge
    else if (x + elementWidth > screenWidth - snapThreshold) {
      newX = screenWidth - elementWidth - 10;
    }

    // Snap to top edge
    if (y < snapThreshold) {
      newY = 10;
    }
    // Snap to bottom edge
    else if (y + elementHeight > screenHeight - snapThreshold) {
      newY = screenHeight - elementHeight - 10;
    }

    return { x: newX, y: newY };
  };

  // Add global mouse event listeners
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      // Prevent default to avoid conflicts
      e.preventDefault();
      e.stopPropagation();

      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;

      // Keep within screen bounds
      const maxX = window.innerWidth - (dragRef.current?.offsetWidth || 400);
      const maxY = window.innerHeight - (dragRef.current?.offsetHeight || 300);

      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!isDragging) return;

      e.preventDefault();
      e.stopPropagation();

      setIsDragging(false);

      // Apply snap-to-edges after dragging ends
      const currentElement = dragRef.current;
      if (currentElement) {
        const rect = currentElement.getBoundingClientRect();
        const snapped = snapToEdges(rect.left, rect.top);
        setPosition(snapped);
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove, { passive: false });
      document.addEventListener('mouseup', handleMouseUp, { passive: false });
      document.body.style.userSelect = 'none'; // Prevent text selection while dragging
      document.body.style.pointerEvents = 'none'; // Prevent interaction with other elements

      // Re-enable pointer events for the drag handle
      if (dragRef.current) {
        dragRef.current.style.pointerEvents = 'auto';
      }
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
      document.body.style.pointerEvents = '';
    };
  }, [isDragging, dragOffset]);

  if (isMinimized) {
    return (
      <div
        ref={dragRef}
        style={{
          position: 'fixed',
          left: `${position.x}px`,
          top: `${position.y}px`,
          backgroundColor: '#1a1a1a',
          color: '#00ff00',
          padding: '8px 12px',
          border: '2px solid #00ff00',
          borderRadius: '8px',
          fontFamily: 'monospace',
          zIndex: 1000,
          cursor: 'pointer'
        }}
        onClick={() => setIsMinimized(false)}
        onMouseDown={handleMouseDown}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>🔗</span>
          <span>Web3 Panel</span>
          <span style={{ marginLeft: 'auto' }}>⚡</span>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={dragRef}
      className={`draggable-web3-panel ${isDragging ? 'dragging' : ''}`}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: '400px',
        backgroundColor: '#1a1a1a',
        color: '#00ff00',
        padding: '20px',
        border: '2px solid #00ff00',
        borderRadius: '8px',
        fontFamily: 'monospace',
        zIndex: 1000
      }}
    >
      {/* Drag Handle */}
      <div
        className="drag-handle"
        onMouseDown={handleMouseDown}
        title="Drag to move web3 panel"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '15px',
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="drag-dots">
            <span>⋮⋮</span>
          </div>
          <div className="drag-title">
            🔗 WEB3 PANEL
          </div>
        </div>
        <div className="drag-controls">
          <button
            className="minimize-btn"
            onClick={(e) => {
              e.stopPropagation();
              setIsMinimized(true);
            }}
            title="Minimize"
            style={{
              backgroundColor: 'transparent',
              color: '#00ff00',
              border: '1px solid #00ff00',
              borderRadius: '4px',
              padding: '4px 8px',
              fontSize: '12px',
              cursor: 'pointer',
              fontFamily: 'monospace'
            }}
          >
            −
          </button>
        </div>
      </div>

      {/* Connection Status */}
      <div style={{ marginBottom: '15px' }}>
        <div>Status: {connectionStatus.isConnected ? '🟢 Connected' : '🔴 Disconnected'}</div>
        {connectionStatus.accountAddress && (
          <div>Account: {connectionStatus.accountAddress.slice(0, 6)}...{connectionStatus.accountAddress.slice(-4)}</div>
        )}
        <div>Network: {getCurrentNetwork()}</div>
        <div>Gas Price: {gasPrice} gwei</div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '15px' }}>
        <button
          onClick={connectWallet}
          disabled={isLoading || connectionStatus.isConnected}
          style={{
            padding: '8px 12px',
            backgroundColor: connectionStatus.isConnected ? '#333' : '#006600',
            color: '#00ff00',
            border: '1px solid #00ff00',
            borderRadius: '4px',
            cursor: connectionStatus.isConnected ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? 'Connecting...' : 'Connect Wallet'}
        </button>

        <button
          onClick={switchToPolygon}
          disabled={isLoading || !connectionStatus.isConnected}
          style={{
            padding: '8px 12px',
            backgroundColor: '#003366',
            color: '#00ff00',
            border: '1px solid #00ff00',
            borderRadius: '4px',
            cursor: isLoading || !connectionStatus.isConnected ? 'not-allowed' : 'pointer'
          }}
        >
          Switch to Polygon
        </button>

        <button
          onClick={createTestGameSession}
          disabled={isLoading || !connectionStatus.isConnected}
          style={{
            padding: '8px 12px',
            backgroundColor: '#660066',
            color: '#00ff00',
            border: '1px solid #00ff00',
            borderRadius: '4px',
            cursor: isLoading || !connectionStatus.isConnected ? 'not-allowed' : 'pointer'
          }}
        >
          Create Game Session
        </button>

        <button
          onClick={mintTestNFT}
          disabled={isLoading || !connectionStatus.isConnected}
          style={{
            padding: '8px 12px',
            backgroundColor: '#666600',
            color: '#00ff00',
            border: '1px solid #00ff00',
            borderRadius: '4px',
            cursor: isLoading || !connectionStatus.isConnected ? 'not-allowed' : 'pointer'
          }}
        >
          Mint Test NFT
        </button>

        <button
          onClick={() => updateGasPrice()}
          disabled={isLoading}
          style={{
            padding: '8px 12px',
            backgroundColor: '#666666',
            color: '#00ff00',
            border: '1px solid #00ff00',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          Refresh Gas Price
        </button>
      </div>

      {/* Test Results */}
      <div>
        <h4 style={{ margin: '0 0 10px 0', color: '#00ff00' }}>Test Results:</h4>
        <div style={{
          maxHeight: '200px',
          overflowY: 'auto',
          backgroundColor: '#0a0a0a',
          padding: '10px',
          border: '1px solid #333',
          borderRadius: '4px'
        }}>
          {testResults.length === 0 ? (
            <div style={{ color: '#666' }}>No tests run yet...</div>
          ) : (
            testResults.map((result, index) => (
              <div key={index} style={{ marginBottom: '5px', fontSize: '12px' }}>
                {result}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BlockchainTest;
