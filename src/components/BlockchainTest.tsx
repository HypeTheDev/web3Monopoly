import React, { useState, useEffect } from 'react';
import { gameBlockchainService } from '../services/GameBlockchainService';
import { GameMode, Player } from '../types/GameTypes';

interface BlockchainTestProps {}

const BlockchainTest: React.FC<BlockchainTestProps> = () => {
  const [connectionStatus, setConnectionStatus] = useState(gameBlockchainService.getConnectionStatus());
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);
  const [gasPrice, setGasPrice] = useState<string>('0');
  const [isMinimized, setIsMinimized] = useState(false);

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

  if (isMinimized) {
    return (
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
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
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      width: '400px',
      backgroundColor: '#1a1a1a',
      color: '#00ff00',
      padding: '20px',
      border: '2px solid #00ff00',
      borderRadius: '8px',
      fontFamily: 'monospace',
      zIndex: 1000
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3 style={{ margin: 0, color: '#00ff00' }}>🔗 BLOCKCHAIN TEST PANEL</h3>
        <button
          onClick={() => setIsMinimized(true)}
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
