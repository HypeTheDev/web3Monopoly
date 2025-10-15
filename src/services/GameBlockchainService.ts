import { GameState, GameMode, Player, Web3Connection, SmartContractData, GameStats } from '../types/GameTypes';
import { MonopolyGameEngine } from '../lib/MonopolyEngine';
import { DBAEngine } from '../lib/DBAEngine';
import { ChessGameEngine } from '../lib/ChessEngine';
import { SpadesGameEngine } from '../lib/SpadesEngine';

export interface BlockchainConfig {
  networkId: number;
  rpcUrl: string;
  chainName: string;
  currencySymbol: string;
  blockExplorerUrl: string;
}

export interface GameContract {
  address: string;
  abi: any[];
  deployedBlock: number;
}

export interface TransactionResult {
  success: boolean;
  txHash?: string;
  gasUsed?: number;
  error?: string;
  blockNumber?: number;
}

export interface GameNFT {
  tokenId: string;
  gameMode: GameMode;
  metadata: {
    name: string;
    description: string;
    image: string;
    attributes: Array<{
      trait_type: string;
      value: string | number;
    }>;
  };
  owner: string;
  createdAt: number;
}

export class GameBlockchainService {
  private web3: any = null;
  private isConnected: boolean = false;
  private currentAccount: string | null = null;
  private gameContracts: Map<GameMode, GameContract> = new Map();
  private gameEngines: Map<GameMode, any> = new Map();
  private connectionCallbacks: Array<(connection: Web3Connection) => void> = [];
  private gameStateCallbacks: Array<(gameState: GameState) => void> = [];

  // Blockchain configurations for different networks
  private readonly configs: Map<number, BlockchainConfig> = new Map([
    [1, {
      networkId: 1,
      rpcUrl: 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY',
      chainName: 'Ethereum Mainnet',
      currencySymbol: 'ETH',
      blockExplorerUrl: 'https://etherscan.io'
    }],
    [11155111, {
      networkId: 11155111,
      rpcUrl: 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY',
      chainName: 'Sepolia Testnet',
      currencySymbol: 'SepoliaETH',
      blockExplorerUrl: 'https://sepolia.etherscan.io'
    }],
    [137, {
      networkId: 137,
      rpcUrl: 'https://polygon-mainnet.infura.io/v3/YOUR_INFURA_KEY',
      chainName: 'Polygon Mainnet',
      currencySymbol: 'MATIC',
      blockExplorerUrl: 'https://polygonscan.com'
    }],
    [80001, {
      networkId: 80001,
      rpcUrl: 'https://polygon-mumbai.infura.io/v3/YOUR_INFURA_KEY',
      chainName: 'Polygon Mumbai',
      currencySymbol: 'MATIC',
      blockExplorerUrl: 'https://mumbai.polygonscan.com'
    }]
  ]);

  constructor() {
    this.initializeWeb3();
    this.initializeGameEngines();
  }

  private async initializeWeb3(): Promise<void> {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        // Request account access if needed
        await (window as any).ethereum.request({ method: 'eth_requestAccounts' });

        // Initialize Web3 instance
        const Web3 = (await import('web3')).default;
        this.web3 = new Web3((window as any).ethereum);

        // Get current account
        const accounts = await this.web3.eth.getAccounts();
        this.currentAccount = accounts[0] || null;
        this.isConnected = !!this.currentAccount;

        // Setup event listeners
        (window as any).ethereum.on('accountsChanged', (accounts: string[]) => {
          this.currentAccount = accounts[0] || null;
          this.isConnected = !!this.currentAccount;
          this.notifyConnectionChange();
        });

        (window as any).ethereum.on('chainChanged', (chainId: string) => {
          window.location.reload();
        });

        this.notifyConnectionChange();
      } catch (error) {
        console.error('Failed to initialize Web3:', error);
        this.isConnected = false;
      }
    }
  }

  private initializeGameEngines(): void {
    // Initialize game engines for each game mode
    this.gameEngines.set(GameMode.MONOPOLY, MonopolyGameEngine);
    this.gameEngines.set(GameMode.DBA, DBAEngine);
    this.gameEngines.set(GameMode.CHESS, ChessGameEngine);
    this.gameEngines.set(GameMode.SPADES, SpadesGameEngine);
  }

  private notifyConnectionChange(): void {
    const connection: Web3Connection = {
      isConnected: this.isConnected,
      walletType: this.detectWalletType(),
      accountAddress: this.currentAccount,
      chainId: this.getCurrentChainId(),
      marketContractAddress: this.getContractAddress(GameMode.MONOPOLY),
      gameContractAddress: this.getContractAddress(GameMode.MONOPOLY)
    };

    this.connectionCallbacks.forEach(callback => callback(connection));
  }

  private detectWalletType(): 'metamask' | 'walletconnect' | 'phantom' | null {
    if (typeof window !== 'undefined') {
      if ((window as any).ethereum?.isMetaMask) return 'metamask';
      if ((window as any).ethereum?.isPhantom) return 'phantom';
      // Add other wallet detections as needed
    }
    return null;
  }

  private getCurrentChainId(): number | null {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      return parseInt((window as any).ethereum.chainId, 16);
    }
    return null;
  }

  private getContractAddress(gameMode: GameMode): string {
    // Return appropriate contract address based on game mode and network
    const chainId = this.getCurrentChainId();
    if (!chainId) return '';

    // These would be your deployed contract addresses
    const contractAddresses: Record<number, Record<GameMode, string>> = {
      11155111: { // Sepolia
        [GameMode.MONOPOLY]: '0x1234567890123456789012345678901234567890',
        [GameMode.DBA]: '0x2345678901234567890123456789012345678901',
        [GameMode.CHESS]: '0x3456789012345678901234567890123456789012',
        [GameMode.SPADES]: '0x4567890123456789012345678901234567890123'
      },
      80001: { // Mumbai
        [GameMode.MONOPOLY]: '0x5678901234567890123456789012345678901234',
        [GameMode.DBA]: '0x6789012345678901234567890123456789012345',
        [GameMode.CHESS]: '0x7890123456789012345678901234567890123456',
        [GameMode.SPADES]: '0x8901234567890123456789012345678901234567'
      }
    };

    return contractAddresses[chainId]?.[gameMode] || '';
  }

  // Public API methods

  public async connectWallet(): Promise<Web3Connection> {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
        await this.initializeWeb3();
        return this.getConnectionStatus();
      } catch (error) {
        console.error('Failed to connect wallet:', error);
        throw new Error('Failed to connect wallet');
      }
    } else {
      throw new Error('No Web3 wallet detected');
    }
  }

  public getConnectionStatus(): Web3Connection {
    return {
      isConnected: this.isConnected,
      walletType: this.detectWalletType(),
      accountAddress: this.currentAccount,
      chainId: this.getCurrentChainId(),
      marketContractAddress: this.getContractAddress(GameMode.MONOPOLY),
      gameContractAddress: this.getContractAddress(GameMode.MONOPOLY)
    };
  }

  public onConnectionChange(callback: (connection: Web3Connection) => void): void {
    this.connectionCallbacks.push(callback);
  }

  public onGameStateChange(callback: (gameState: GameState) => void): void {
    this.gameStateCallbacks.push(callback);
  }

  public async switchNetwork(networkId: number): Promise<void> {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        await (window as any).ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${networkId.toString(16)}` }]
        });
      } catch (error) {
        console.error('Failed to switch network:', error);
        throw error;
      }
    }
  }

  public async createGameSession(gameMode: GameMode, players: Player[]): Promise<string> {
    if (!this.isConnected || !this.currentAccount) {
      throw new Error('Wallet not connected');
    }

    try {
      const gameEngine = this.gameEngines.get(gameMode);
      if (!gameEngine) {
        throw new Error(`Game engine not found for mode: ${gameMode}`);
      }

      // Initialize game state
      const gameState = gameEngine.initializeGameState(players);

      // Create blockchain transaction for game session
      const contractAddress = this.getContractAddress(gameMode);
      if (!contractAddress) {
        throw new Error('Contract address not configured for this network');
      }

      // This would interact with your smart contract
      const sessionId = await this.createGameSessionOnChain(gameMode, players);

      // Store game state locally (in production, this would be on IPFS/Arweave)
      this.storeGameState(gameMode, sessionId, gameState);

      return sessionId;
    } catch (error) {
      console.error('Failed to create game session:', error);
      throw error;
    }
  }

  private async createGameSessionOnChain(gameMode: GameMode, players: Player[]): Promise<string> {
    // This would interact with your smart contract to create a game session
    // For now, return a mock session ID
    const sessionId = `session_${gameMode}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // In production, this would be:
    // const result = await this.gameContracts.get(gameMode)?.methods.createGameSession(players).send({
    //   from: this.currentAccount,
    //   gas: 200000
    // });
    // return result.events.GameSessionCreated.returnValues.sessionId;

    return sessionId;
  }

  public async updateGameState(gameMode: GameMode, sessionId: string, gameState: GameState): Promise<TransactionResult> {
    if (!this.isConnected || !this.currentAccount) {
      throw new Error('Wallet not connected');
    }

    try {
      // Update local state
      this.storeGameState(gameMode, sessionId, gameState);

      // Notify subscribers
      this.gameStateCallbacks.forEach(callback => callback(gameState));

      // Update on blockchain (in production)
      const txResult = await this.updateGameStateOnChain(gameMode, sessionId, gameState);

      return txResult;
    } catch (error) {
      console.error('Failed to update game state:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async updateGameStateOnChain(gameMode: GameMode, sessionId: string, gameState: GameState): Promise<TransactionResult> {
    // This would interact with your smart contract to update game state
    // For now, return a mock successful transaction

    // In production, this would be:
    // const result = await this.gameContracts.get(gameMode)?.methods.updateGameState(sessionId, gameState).send({
    //   from: this.currentAccount,
    //   gas: 150000
    // });

    return {
      success: true,
      txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      gasUsed: 100000,
      blockNumber: await this.web3?.eth.getBlockNumber() || 0
    };
  }

  public async mintGameNFT(gameMode: GameMode, sessionId: string, metadata: any): Promise<TransactionResult> {
    if (!this.isConnected || !this.currentAccount) {
      throw new Error('Wallet not connected');
    }

    try {
      // Create NFT metadata
      const nftMetadata = {
        name: `${gameMode} Victory NFT`,
        description: `Earned by completing a ${gameMode} game session`,
        image: metadata.image || this.generateNFTImage(gameMode),
        attributes: [
          { trait_type: 'Game Mode', value: gameMode },
          { trait_type: 'Session ID', value: sessionId },
          { trait_type: 'Completion Date', value: new Date().toISOString() },
          ...metadata.attributes || []
        ]
      };

      // Mint NFT on blockchain (in production)
      const mintResult = await this.mintNFTOnChain(gameMode, nftMetadata);

      return mintResult;
    } catch (error) {
      console.error('Failed to mint game NFT:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async mintNFTOnChain(gameMode: GameMode, metadata: any): Promise<TransactionResult> {
    // This would interact with your NFT smart contract
    // For now, return a mock successful transaction

    return {
      success: true,
      txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      gasUsed: 200000,
      blockNumber: await this.web3?.eth.getBlockNumber() || 0
    };
  }

  private generateNFTImage(gameMode: GameMode): string {
    // Generate a simple SVG image based on game mode
    const colors = {
      [GameMode.MONOPOLY]: '#DC143C',
      [GameMode.DBA]: '#FF8C00',
      [GameMode.CHESS]: '#000000',
      [GameMode.SPADES]: '#006400'
    };

    const color = colors[gameMode] || '#333333';
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="400" fill="${color}"/>
        <text x="200" y="200" font-family="Arial" font-size="24" fill="white" text-anchor="middle">${gameMode} NFT</text>
      </svg>
    `)}`;
  }

  private storeGameState(gameMode: GameMode, sessionId: string, gameState: GameState): void {
    // In production, this would store to IPFS or Arweave
    const storageKey = `game_${gameMode}_${sessionId}`;
    localStorage.setItem(storageKey, JSON.stringify(gameState));
  }

  public getGameState(gameMode: GameMode, sessionId: string): GameState | null {
    const storageKey = `game_${gameMode}_${sessionId}`;
    const stored = localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) : null;
  }

  public async getGameStats(gameMode: GameMode, sessionId: string): Promise<GameStats | null> {
    // In production, this would fetch from your backend/API
    const gameState = this.getGameState(gameMode, sessionId);
    if (!gameState) return null;

    return {
      gameId: sessionId,
      duration: 0, // Would calculate from timestamps
      winner: gameState.players[0], // Would determine actual winner
      finalBalances: gameState.players.map(p => ({ name: p.name, money: p.money })),
      totalTransactions: 0,
      totalTurns: gameState.roundNumber,
      raceEndTime: Date.now()
    };
  }

  public async transferGameOwnership(gameMode: GameMode, sessionId: string, newOwner: string): Promise<TransactionResult> {
    if (!this.isConnected || !this.currentAccount) {
      throw new Error('Wallet not connected');
    }

    try {
      // Transfer ownership on blockchain (in production)
      const transferResult = await this.transferOwnershipOnChain(gameMode, sessionId, newOwner);

      return transferResult;
    } catch (error) {
      console.error('Failed to transfer game ownership:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async transferOwnershipOnChain(gameMode: GameMode, sessionId: string, newOwner: string): Promise<TransactionResult> {
    // This would interact with your smart contract to transfer ownership
    return {
      success: true,
      txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      gasUsed: 50000,
      blockNumber: await this.web3?.eth.getBlockNumber() || 0
    };
  }

  public async getGasPrice(): Promise<string> {
    if (!this.web3) return '0';

    try {
      const gasPrice = await this.web3.eth.getGasPrice();
      return this.web3.utils.fromWei(gasPrice, 'gwei');
    } catch (error) {
      console.error('Failed to get gas price:', error);
      return '0';
    }
  }

  public async estimateGas(transaction: any): Promise<number> {
    if (!this.web3) return 0;

    try {
      return await this.web3.eth.estimateGas(transaction);
    } catch (error) {
      console.error('Failed to estimate gas:', error);
      return 0;
    }
  }

  public isWalletConnected(): boolean {
    return this.isConnected && !!this.currentAccount;
  }

  public getCurrentAccount(): string | null {
    return this.currentAccount;
  }

  public getCurrentNetwork(): BlockchainConfig | null {
    const chainId = this.getCurrentChainId();
    return chainId ? this.configs.get(chainId) || null : null;
  }
}

// Export singleton instance
export const gameBlockchainService = new GameBlockchainService();
