/**
 * FileSharing - Encrypted File Transfer over P2P Connection
 * 
 * This module handles secure file sharing between peers using the same
 * encryption mechanism as messages, with chunked transfer for large files.
 */

import { EncryptionService, EncryptedMessage } from './EncryptionService';

export interface FileMetadata {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  chunks: number;
  checksum: string;
}

export interface FileChunk {
  fileId: string;
  chunkIndex: number;
  totalChunks: number;
  data: string; // Base64 encoded encrypted chunk
  checksum: string;
}

export interface FileTransfer {
  id: string;
  metadata: FileMetadata;
  chunks: Map<number, FileChunk>;
  receivedChunks: number;
  isComplete: boolean;
  isReceiving: boolean;
  progress: number;
  timestamp: number;
}

export interface FileMessage {
  type: 'file_metadata' | 'file_chunk' | 'file_request' | 'file_complete';
  fileId: string;
  payload: any;
}

export class FileSharing {
  private static readonly CHUNK_SIZE = 64 * 1024; // 64KB chunks
  private static readonly MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB limit
  
  private encryptionService: EncryptionService;
  private activeTransfers: Map<string, FileTransfer> = new Map();
  private onFileReceived?: (file: File) => void;
  private onTransferProgress?: (fileId: string, progress: number) => void;
  private onTransferComplete?: (fileId: string, success: boolean) => void;

  constructor(encryptionService: EncryptionService) {
    this.encryptionService = encryptionService;
  }

  /**
   * Set event handlers for file transfer events
   */
  public setEventHandlers(handlers: {
    onFileReceived?: (file: File) => void;
    onTransferProgress?: (fileId: string, progress: number) => void;
    onTransferComplete?: (fileId: string, success: boolean) => void;
  }) {
    this.onFileReceived = handlers.onFileReceived;
    this.onTransferProgress = handlers.onTransferProgress;
    this.onTransferComplete = handlers.onTransferComplete;
  }

  /**
   * Prepare a file for sharing by encrypting and chunking it
   */
  public async prepareFileForSharing(file: File): Promise<{fileId: string, metadata: FileMetadata, chunks: FileChunk[]}> {
    if (file.size > FileSharing.MAX_FILE_SIZE) {
      throw new Error(`File too large. Maximum size is ${FileSharing.MAX_FILE_SIZE / (1024 * 1024)}MB`);
    }

    if (!this.encryptionService.isReady()) {
      throw new Error('Encryption service not ready');
    }

    const fileId = this.generateFileId();
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Calculate total chunks needed
    const totalChunks = Math.ceil(file.size / FileSharing.CHUNK_SIZE);
    const chunks: FileChunk[] = [];

    // Create file metadata
    const metadata: FileMetadata = {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      chunks: totalChunks,
      checksum: await this.calculateChecksum(uint8Array)
    };

    // Create and encrypt chunks
    for (let i = 0; i < totalChunks; i++) {
      const start = i * FileSharing.CHUNK_SIZE;
      const end = Math.min(start + FileSharing.CHUNK_SIZE, file.size);
      const chunkData = uint8Array.slice(start, end);
      
      // Convert chunk to base64
      const base64Chunk = this.arrayBufferToBase64(chunkData);
      
      // Encrypt the chunk
      const encryptedChunk = this.encryptionService.encryptMessage(base64Chunk);
      
      // Calculate chunk checksum
      const chunkChecksum = await this.calculateChecksum(chunkData);
      
      const chunk: FileChunk = {
        fileId,
        chunkIndex: i,
        totalChunks,
        data: encryptedChunk.ciphertext,
        checksum: chunkChecksum
      };
      
      chunks.push(chunk);
    }

    return { fileId, metadata, chunks };
  }

  /**
   * Handle incoming file message
   */
  public async handleFileMessage(message: FileMessage): Promise<void> {
    switch (message.type) {
      case 'file_metadata':
        await this.handleFileMetadata(message.fileId, message.payload);
        break;
      case 'file_chunk':
        await this.handleFileChunk(message.fileId, message.payload);
        break;
      case 'file_complete':
        await this.handleFileComplete(message.fileId);
        break;
    }
  }

  /**
   * Handle file metadata message
   */
  private async handleFileMetadata(fileId: string, metadata: FileMetadata): Promise<void> {
    if (this.activeTransfers.has(fileId)) {
      console.warn('File transfer already exists:', fileId);
      return;
    }

    const transfer: FileTransfer = {
      id: fileId,
      metadata,
      chunks: new Map(),
      receivedChunks: 0,
      isComplete: false,
      isReceiving: true,
      progress: 0,
      timestamp: Date.now()
    };

    this.activeTransfers.set(fileId, transfer);
    console.log('Started receiving file:', metadata.name);
  }

  /**
   * Handle file chunk message
   */
  private async handleFileChunk(fileId: string, chunkData: any): Promise<void> {
    const transfer = this.activeTransfers.get(fileId);
    if (!transfer || !transfer.isReceiving) {
      console.warn('No active transfer for file chunk:', fileId);
      return;
    }

    try {
      // Decrypt the chunk
      const encryptedMessage: EncryptedMessage = {
        ciphertext: chunkData.data,
        iv: chunkData.iv,
        timestamp: Date.now(),
        messageId: `chunk_${fileId}_${chunkData.chunkIndex}`
      };

      const decryptedChunk = this.encryptionService.decryptMessage(encryptedMessage);
      
      if (!decryptedChunk.isValid) {
        throw new Error('Failed to decrypt chunk');
      }

      // Convert base64 back to binary
      const chunkBinary = this.base64ToArrayBuffer(decryptedChunk.plaintext);
      
      // Verify chunk checksum
      const calculatedChecksum = await this.calculateChecksum(new Uint8Array(chunkBinary));
      if (calculatedChecksum !== chunkData.checksum) {
        throw new Error('Chunk checksum mismatch');
      }

      // Store the chunk
      const chunk: FileChunk = {
        fileId,
        chunkIndex: chunkData.chunkIndex,
        totalChunks: chunkData.totalChunks,
        data: decryptedChunk.plaintext,
        checksum: chunkData.checksum
      };

      transfer.chunks.set(chunkData.chunkIndex, chunk);
      transfer.receivedChunks = transfer.chunks.size;
      transfer.progress = (transfer.receivedChunks / transfer.metadata.chunks) * 100;

      // Notify progress
      if (this.onTransferProgress) {
        this.onTransferProgress(fileId, transfer.progress);
      }

      // Check if all chunks received
      if (transfer.receivedChunks === transfer.metadata.chunks) {
        await this.assembleFile(transfer);
      }

    } catch (error) {
      console.error('Error handling file chunk:', error);
      this.onTransferComplete?.(fileId, false);
    }
  }

  /**
   * Handle file transfer complete message
   */
  private async handleFileComplete(fileId: string): Promise<void> {
    const transfer = this.activeTransfers.get(fileId);
    if (transfer) {
      transfer.isComplete = true;
      this.onTransferComplete?.(fileId, true);
    }
  }

  /**
   * Assemble received chunks into a file
   */
  private async assembleFile(transfer: FileTransfer): Promise<void> {
    try {
      const chunks: Uint8Array[] = [];
      
      // Sort and combine chunks
      for (let i = 0; i < transfer.metadata.chunks; i++) {
        const chunk = transfer.chunks.get(i);
        if (!chunk) {
          throw new Error(`Missing chunk ${i}`);
        }
        
        const chunkData = this.base64ToArrayBuffer(chunk.data);
        chunks.push(new Uint8Array(chunkData));
      }

      // Combine all chunks
      const totalSize = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
      const combined = new Uint8Array(totalSize);
      let offset = 0;
      
      for (const chunk of chunks) {
        combined.set(chunk, offset);
        offset += chunk.length;
      }

      // Verify file checksum
      const calculatedChecksum = await this.calculateChecksum(combined);
      if (calculatedChecksum !== transfer.metadata.checksum) {
        throw new Error('File checksum mismatch');
      }

      // Create file object
      const file = new File([combined], transfer.metadata.name, {
        type: transfer.metadata.type,
        lastModified: transfer.metadata.lastModified
      });

      // Mark transfer complete
      transfer.isComplete = true;
      transfer.progress = 100;

      // Notify file received
      if (this.onFileReceived) {
        this.onFileReceived(file);
      }

      this.onTransferComplete?.(transfer.id, true);
      console.log('File received successfully:', transfer.metadata.name);

    } catch (error) {
      console.error('Error assembling file:', error);
      this.onTransferComplete?.(transfer.id, false);
    }
  }

  /**
   * Get active transfers
   */
  public getActiveTransfers(): FileTransfer[] {
    return Array.from(this.activeTransfers.values());
  }

  /**
   * Cancel a transfer
   */
  public cancelTransfer(fileId: string): void {
    this.activeTransfers.delete(fileId);
    this.onTransferComplete?.(fileId, false);
  }

  /**
   * Generate unique file ID
   */
  private generateFileId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `file_${timestamp}_${random}`;
  }

  /**
   * Calculate SHA-256 checksum
   */
  private async calculateChecksum(data: Uint8Array): Promise<string> {
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Convert ArrayBuffer to Base64
   */
  private arrayBufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
    const uint8Array = buffer instanceof ArrayBuffer ? new Uint8Array(buffer) : buffer;
    let binary = '';
    for (let i = 0; i < uint8Array.byteLength; i++) {
      binary += String.fromCharCode(uint8Array[i]);
    }
    return btoa(binary);
  }

  /**
   * Convert Base64 to ArrayBuffer
   */
  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const buffer = new ArrayBuffer(binary.length);
    const uint8Array = new Uint8Array(buffer);
    for (let i = 0; i < binary.length; i++) {
      uint8Array[i] = binary.charCodeAt(i);
    }
    return buffer;
  }

  /**
   * Clear all transfers
   */
  public clearTransfers(): void {
    this.activeTransfers.clear();
  }
}