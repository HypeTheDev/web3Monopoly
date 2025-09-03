/**
 * AlbertCrypto - Custom Diffie-Hellman Key Exchange Implementation
 * 
 * This module implements the Diffie-Hellman key exchange algorithm to generate
 * shared secrets between peers for end-to-end encryption. The process can be
 * understood through topological and matrix perspectives as described in the
 * application overview.
 */

export class AlbertCrypto {
  // Large prime modulus (2048-bit safe prime for security)
  private static readonly P = BigInt(
    '0xFFFFFFFFFFFFFFFFC90FDAA22168C234C4C6628B80DC1CD129024E088A67CC74' +
    '020BBEA63B139B22514A08798E3404DDEF9519B3CD3A431B302B0A6DF25F1437' +
    '4FE1356D6D51C245E485B576625E7EC6F44C42E9A637ED6B0BFF5CB6F406B7ED' +
    'EE386BFB5A899FA5AE9F24117C4B1FE649286651ECE45B3DC2007CB8A163BF05' +
    '98DA48361C55D39A69163FA8FD24CF5F83655D23DCA3AD961C62F356208552BB' +
    '9ED529077096966D670C354E4ABC9804F1746C08CA18217C32905E462E36CE3B' +
    'E39E772C180E86039B2783A2EC07A28FB5C55DF06F4C52C9DE2BCBF695581718' +
    '3995497CEA956AE515D2261898FA051015728E5A8AACAA68FFFFFFFFFFFFFFFF'
  );

  // Generator (base point for the cyclic group)
  private static readonly G = BigInt(2);

  private privateKey: bigint;
  private publicKey: bigint;

  /**
   * Initialize the crypto instance with a randomly generated private key
   */
  constructor() {
    this.privateKey = this.generatePrivateKey();
    this.publicKey = this.generatePublicKey();
  }

  /**
   * Generate a cryptographically secure random private key
   * The key is a large random integer less than P-1
   */
  private generatePrivateKey(): bigint {
    // Generate random bytes and convert to BigInt
    const array = new Uint8Array(256); // 2048 bits
    crypto.getRandomValues(array);
    
    let result = BigInt(0);
    for (let i = 0; i < array.length; i++) {
      result = (result << BigInt(8)) | BigInt(array[i]);
    }
    
    // Ensure the key is in the valid range [2, P-2]
    result = result % (AlbertCrypto.P - BigInt(2)) + BigInt(2);
    return result;
  }

  /**
   * Generate public key using the formula: g^privateKey mod p
   * This represents the topological transformation from the base point
   */
  private generatePublicKey(): bigint {
    return this.modPow(AlbertCrypto.G, this.privateKey, AlbertCrypto.P);
  }

  /**
   * Get the public key for sharing with peers
   * This key is safe to transmit over insecure channels
   */
  public getPublicKey(): string {
    return this.publicKey.toString(16);
  }

  /**
   * Generate shared secret using peer's public key
   * Formula: peerPublicKey^privateKey mod p
   * 
   * This is where the topological convergence occurs - both peers
   * will arrive at the same secret point despite starting from different
   * public keys and using different private transformations.
   */
  public generateSharedSecret(peerPublicKeyHex: string): string {
    const peerPublicKey = BigInt('0x' + peerPublicKeyHex);
    const sharedSecret = this.modPow(peerPublicKey, this.privateKey, AlbertCrypto.P);
    
    // Convert to hex string and pad to consistent length
    return this.padHex(sharedSecret.toString(16), 64);
  }

  /**
   * Efficient modular exponentiation using binary exponentiation
   * Computes (base^exponent) mod modulus efficiently
   */
  private modPow(base: bigint, exponent: bigint, modulus: bigint): bigint {
    if (modulus === BigInt(1)) return BigInt(0);
    
    let result = BigInt(1);
    base = base % modulus;
    
    while (exponent > BigInt(0)) {
      if (exponent % BigInt(2) === BigInt(1)) {
        result = (result * base) % modulus;
      }
      exponent = exponent >> BigInt(1);
      base = (base * base) % modulus;
    }
    
    return result;
  }

  /**
   * Pad hex string to specified length with leading zeros
   */
  private padHex(hex: string, length: number): string {
    return hex.padStart(length, '0');
  }

  /**
   * Validate that a peer's public key is in the correct range
   * Security check to prevent invalid key attacks
   */
  public static isValidPublicKey(publicKeyHex: string): boolean {
    try {
      const key = BigInt('0x' + publicKeyHex);
      return key > BigInt(1) && key < AlbertCrypto.P - BigInt(1);
    } catch {
      return false;
    }
  }

  /**
   * Get key exchange information for debugging/visualization
   */
  public getKeyExchangeInfo() {
    return {
      prime: AlbertCrypto.P.toString(16),
      generator: AlbertCrypto.G.toString(),
      privateKey: '***HIDDEN***', // Never expose private key
      publicKey: this.getPublicKey()
    };
  }
}

/**
 * Matrix State Representation Helper
 * Provides a conceptual view of the key exchange as state vectors
 */
export class KeyExchangeMatrix {
  /**
   * Represent the key exchange state as vectors
   * This is a conceptual representation for educational purposes
   */
  public static getStateVector(privateKey: string, peerPublicKey: string) {
    return {
      vector: [privateKey, peerPublicKey],
      description: 'State Vector: [private_key, peer_public_key]'
    };
  }

  /**
   * Apply the transformation operator T(base, exponent) = base^exponent mod p
   */
  public static applyTransformation(base: string, exponent: string): string {
    const crypto = new AlbertCrypto();
    return crypto.generateSharedSecret(base);
  }
}