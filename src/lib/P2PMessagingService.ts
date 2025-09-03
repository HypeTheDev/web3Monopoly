/**
 * P2PMessagingService - Decentralized Peer-to-Peer Messaging with End-to-End Encryption
 * 
 * This service manages WebRTC connections using PeerJS, handles the Diffie-Hellman
 * key exchange, and provides encrypted messaging capabilities between peers.
 */

import Peer, { DataConnection } from 'peerjs';
import { AlbertCrypto } from './AlbertCrypto';
import { EncryptionService, EncryptedMessage } from './EncryptionService';

export interface P2PMessage {
  id: string;
  content: string;
  timestamp: number;
  sender: string;
  isEncrypted: boolean;
  isOwn: boolean;
}

export interface PeerInfo {
  id: string;
  isConnected: boolean;
  publicKey?: string;
  isEncryptionReady: boolean;
  lastSeen: number;
}

export interface ConnectionStatus {
  isOnline: boolean;
  peerId: string | null;
  connectedPeers: string[];
  encryptionStatus: 'none' | 'handshake' | 'ready';
}

export type MessageHandler = (message: P2PMessage) => void;
export type ConnectionHandler = (status: ConnectionStatus) => void;
export type PeerHandler = (peer: PeerInfo) => void;

export class P2PMessagingService {
  private peer: Peer | null = null;
  private connections: Map<string, DataConnection> = new Map();
  private crypto: AlbertCrypto;
  private encryptionServices: Map<string, EncryptionService> = new Map();
  private messageHistory: P2PMessage[] = [];
  private peerInfo: Map<string, PeerInfo> = new Map();

  // Event handlers
  private messageHandlers: MessageHandler[] = [];
  private connectionHandlers: ConnectionHandler[] = [];
  private peerHandlers: PeerHandler[] = [];

  constructor() {
    this.crypto = new AlbertCrypto();
    this.loadMessageHistory();
  }

  /**
   * Initialize the P2P service with a custom peer ID or generate one
   */
  public async initialize(customPeerId?: string): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        // Generate a unique peer ID if not provided
        const peerId = customPeerId || this.generatePeerId();

        // Initialize PeerJS with custom configuration to avoid free tier limits
        this.peer = new Peer(peerId, {
          debug: 2, // Set debug level
          config: {
            iceServers: [
              { urls: 'stun:stun.l.google.com:19302' },
              { urls: 'stun:global.stun.twilio.com:3478' }
            ]
          }
        });

        this.peer.on('open', (id) => {
          console.log('P2P Service initialized with peer ID:', id);
          this.setupPeerEventHandlers();
          this.notifyConnectionHandlers();
          resolve(id);
        });

        this.peer.on('error', (error) => {
          console.error('PeerJS error:', error);
          reject(error);
        });

      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Setup event handlers for peer connections
   */
  private setupPeerEventHandlers(): void {
    if (!this.peer) return;

    // Handle incoming connections
    this.peer.on('connection', (conn) => {
      this.handleIncomingConnection(conn);
    });

    // Handle peer disconnection
    this.peer.on('disconnected', () => {
      console.log('Peer disconnected from signaling server');
      this.notifyConnectionHandlers();
    });

    // Handle peer close
    this.peer.on('close', () => {
      console.log('Peer connection closed');
      this.cleanup();
    });
  }

  /**
   * Connect to another peer by their ID
   */
  public async connectToPeer(peerId: string): Promise<boolean> {
    if (!this.peer) {
      throw new Error('P2P service not initialized');
    }

    if (this.connections.has(peerId)) {
      console.log('Already connected to peer:', peerId);
      return true;
    }

    return new Promise((resolve) => {
      const conn = this.peer!.connect(peerId, {
        reliable: true,
        label: 'encrypted-messenger'
      });

      conn.on('open', () => {
        console.log('Connected to peer:', peerId);
        this.handleNewConnection(conn);
        resolve(true);
      });

      conn.on('error', (error) => {
        console.error('Connection error:', error);
        resolve(false);
      });
    });
  }

  /**
   * Handle incoming connection from another peer
   */
  private handleIncomingConnection(conn: DataConnection): void {
    console.log('Incoming connection from:', conn.peer);
    this.handleNewConnection(conn);
  }

  /**
   * Handle new connection setup and key exchange
   */
  private handleNewConnection(conn: DataConnection): void {
    this.connections.set(conn.peer, conn);
    
    // Create encryption service for this peer
    const encryptionService = new EncryptionService();
    this.encryptionServices.set(conn.peer, encryptionService);

    // Update peer info
    this.peerInfo.set(conn.peer, {
      id: conn.peer,
      isConnected: true,
      isEncryptionReady: false,
      lastSeen: Date.now()
    });

    // Setup connection event handlers
    conn.on('data', (data) => {
      this.handleIncomingData(conn.peer, data);
    });

    conn.on('close', () => {
      console.log('Connection closed with peer:', conn.peer);
      this.handlePeerDisconnection(conn.peer);
    });

    conn.on('error', (error) => {
      console.error('Connection error with peer:', conn.peer, error);
      this.handlePeerDisconnection(conn.peer);
    });

    // Start key exchange
    this.initiateKeyExchange(conn.peer);
    
    this.notifyConnectionHandlers();
    this.notifyPeerHandlers(this.peerInfo.get(conn.peer)!);
  }

  /**
   * Initiate Diffie-Hellman key exchange with a peer
   */
  private initiateKeyExchange(peerId: string): void {
    const publicKey = this.crypto.getPublicKey();
    
    this.sendSystemMessage(peerId, {
      type: 'key_exchange',
      publicKey: publicKey,
      step: 1
    });

    console.log('Initiated key exchange with peer:', peerId);
  }

  /**
   * Handle incoming data from peers
   */
  private handleIncomingData(peerId: string, data: any): void {
    try {
      // Update last seen
      const peerInfo = this.peerInfo.get(peerId);
      if (peerInfo) {
        peerInfo.lastSeen = Date.now();
      }

      if (data.type === 'system') {
        this.handleSystemMessage(peerId, data.payload);
      } else if (data.type === 'message') {
        this.handleEncryptedMessage(peerId, data.payload);
      }
    } catch (error) {
      console.error('Error handling incoming data:', error);
    }
  }

  /**
   * Handle system messages (key exchange, etc.)
   */
  private handleSystemMessage(peerId: string, payload: any): void {
    if (payload.type === 'key_exchange') {
      this.handleKeyExchange(peerId, payload);
    }
  }

  /**
   * Handle Diffie-Hellman key exchange messages
   */
  private handleKeyExchange(peerId: string, payload: any): void {
    const peerInfo = this.peerInfo.get(peerId);
    if (!peerInfo) return;

    if (payload.step === 1) {
      // Peer sent their public key, respond with ours
      peerInfo.publicKey = payload.publicKey;
      
      const ourPublicKey = this.crypto.getPublicKey();
      this.sendSystemMessage(peerId, {
        type: 'key_exchange',
        publicKey: ourPublicKey,
        step: 2
      });

      // Generate shared secret
      this.completeKeyExchange(peerId, payload.publicKey);
      
    } else if (payload.step === 2) {
      // Peer responded with their public key
      peerInfo.publicKey = payload.publicKey;
      
      // Generate shared secret
      this.completeKeyExchange(peerId, payload.publicKey);
    }
  }

  /**
   * Complete the key exchange and setup encryption
   */
  private completeKeyExchange(peerId: string, peerPublicKey: string): void {
    try {
      // Validate peer's public key
      if (!AlbertCrypto.isValidPublicKey(peerPublicKey)) {
        console.error('Invalid public key from peer:', peerId);
        return;
      }

      // Generate shared secret
      const sharedSecret = this.crypto.generateSharedSecret(peerPublicKey);
      
      // Setup encryption service
      const encryptionService = this.encryptionServices.get(peerId);
      if (encryptionService) {
        encryptionService.setSharedSecret(sharedSecret);
        
        // Test encryption
        if (encryptionService.testEncryption()) {
          // Update peer info
          const peerInfo = this.peerInfo.get(peerId);
          if (peerInfo) {
            peerInfo.isEncryptionReady = true;
            this.notifyPeerHandlers(peerInfo);
          }
          
          console.log('Encryption established with peer:', peerId);
          
          // Send a test encrypted message
          this.sendMessage(peerId, '🔐 Encryption established! Messages are now secure.');
        } else {
          console.error('Encryption test failed for peer:', peerId);
        }
      }
    } catch (error) {
      console.error('Error completing key exchange:', error);
    }
  }

  /**
   * Send an encrypted message to a peer
   */
  public sendMessage(peerId: string, content: string): boolean {
    const connection = this.connections.get(peerId);
    const encryptionService = this.encryptionServices.get(peerId);
    
    if (!connection || !encryptionService || !encryptionService.isReady()) {
      console.error('Cannot send message: connection or encryption not ready');
      return false;
    }

    try {
      const encryptedMessage = encryptionService.encryptMessage(content);
      
      connection.send({
        type: 'message',
        payload: encryptedMessage
      });

      // Add to local message history
      const message: P2PMessage = {
        id: encryptedMessage.messageId,
        content: content,
        timestamp: encryptedMessage.timestamp,
        sender: this.peer?.id || 'unknown',
        isEncrypted: true,
        isOwn: true
      };

      this.addMessage(message);
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  }

  /**
   * Handle incoming encrypted messages
   */
  private handleEncryptedMessage(peerId: string, encryptedMessage: EncryptedMessage): void {
    const encryptionService = this.encryptionServices.get(peerId);
    
    if (!encryptionService || !encryptionService.isReady()) {
      console.error('Cannot decrypt message: encryption not ready');
      return;
    }

    try {
      const decryptedMessage = encryptionService.decryptMessage(encryptedMessage);
      
      if (decryptedMessage.isValid) {
        const message: P2PMessage = {
          id: decryptedMessage.messageId,
          content: decryptedMessage.plaintext,
          timestamp: decryptedMessage.timestamp,
          sender: peerId,
          isEncrypted: true,
          isOwn: false
        };

        this.addMessage(message);
      } else {
        console.error('Failed to decrypt message from peer:', peerId);
      }
    } catch (error) {
      console.error('Error decrypting message:', error);
    }
  }

  /**
   * Send system message to peer
   */
  private sendSystemMessage(peerId: string, payload: any): void {
    const connection = this.connections.get(peerId);
    if (connection) {
      connection.send({
        type: 'system',
        payload: payload
      });
    }
  }

  /**
   * Add message to history and notify handlers
   */
  private addMessage(message: P2PMessage): void {
    this.messageHistory.push(message);
    this.saveMessageHistory();
    
    // Notify message handlers
    this.messageHandlers.forEach(handler => {
      try {
        handler(message);
      } catch (error) {
        console.error('Error in message handler:', error);
      }
    });
  }

  /**
   * Handle peer disconnection
   */
  private handlePeerDisconnection(peerId: string): void {
    this.connections.delete(peerId);
    this.encryptionServices.delete(peerId);
    
    const peerInfo = this.peerInfo.get(peerId);
    if (peerInfo) {
      peerInfo.isConnected = false;
      peerInfo.isEncryptionReady = false;
      this.notifyPeerHandlers(peerInfo);
    }
    
    this.notifyConnectionHandlers();
  }

  /**
   * Generate a unique peer ID
   */
  private generatePeerId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `albert-${timestamp}-${random}`;
  }

  /**
   * Get connection status
   */
  public getConnectionStatus(): ConnectionStatus {
    return {
      isOnline: this.peer?.open || false,
      peerId: this.peer?.id || null,
      connectedPeers: Array.from(this.connections.keys()),
      encryptionStatus: this.getEncryptionStatus()
    };
  }

  /**
   * Get encryption status
   */
  private getEncryptionStatus(): 'none' | 'handshake' | 'ready' {
    const readyConnections = Array.from(this.peerInfo.values())
      .filter(peer => peer.isConnected && peer.isEncryptionReady);
    
    if (readyConnections.length > 0) return 'ready';
    if (this.connections.size > 0) return 'handshake';
    return 'none';
  }

  /**
   * Event handler registration
   */
  public onMessage(handler: MessageHandler): void {
    this.messageHandlers.push(handler);
  }

  public onConnection(handler: ConnectionHandler): void {
    this.connectionHandlers.push(handler);
  }

  public onPeer(handler: PeerHandler): void {
    this.peerHandlers.push(handler);
  }

  /**
   * Notify handlers
   */
  private notifyConnectionHandlers(): void {
    const status = this.getConnectionStatus();
    this.connectionHandlers.forEach(handler => {
      try {
        handler(status);
      } catch (error) {
        console.error('Error in connection handler:', error);
      }
    });
  }

  private notifyPeerHandlers(peer: PeerInfo): void {
    this.peerHandlers.forEach(handler => {
      try {
        handler(peer);
      } catch (error) {
        console.error('Error in peer handler:', error);
      }
    });
  }

  /**
   * Get message history
   */
  public getMessageHistory(): P2PMessage[] {
    return [...this.messageHistory];
  }

  /**
   * Get connected peers
   */
  public getConnectedPeers(): PeerInfo[] {
    return Array.from(this.peerInfo.values()).filter(peer => peer.isConnected);
  }

  /**
   * Disconnect from a specific peer
   */
  public disconnectFromPeer(peerId: string): void {
    const connection = this.connections.get(peerId);
    if (connection) {
      connection.close();
    }
  }

  /**
   * Cleanup and shutdown
   */
  public cleanup(): void {
    // Close all connections
    this.connections.forEach(conn => conn.close());
    this.connections.clear();

    // Clear encryption services
    this.encryptionServices.forEach(service => service.clearKeys());
    this.encryptionServices.clear();

    // Clear peer info
    this.peerInfo.clear();

    // Close peer
    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }

    this.notifyConnectionHandlers();
  }

  /**
   * Message persistence
   */
  private saveMessageHistory(): void {
    try {
      localStorage.setItem('albert-crypto-messages', JSON.stringify(this.messageHistory));
    } catch (error) {
      console.error('Error saving message history:', error);
    }
  }

  private loadMessageHistory(): void {
    try {
      const saved = localStorage.getItem('albert-crypto-messages');
      if (saved) {
        this.messageHistory = JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error loading message history:', error);
      this.messageHistory = [];
    }
  }

  /**
   * Clear message history
   */
  public clearMessageHistory(): void {
    this.messageHistory = [];
    localStorage.removeItem('albert-crypto-messages');
  }
}