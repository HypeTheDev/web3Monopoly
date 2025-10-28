import Peer from 'peerjs';

export interface OnlineUser {
  username: string;
  peerId: string;
  lastSeen: number;
  status: 'online' | 'away' | 'offline';
}

export class OnlineUsersService {
  private peer: Peer | null = null;
  private onlineUsers: Map<string, OnlineUser> = new Map();
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private presenceCheckInterval: NodeJS.Timeout | null = null;
  private listeners: Set<(users: OnlineUser[]) => void> = new Set();
  private username: string = '';
  private readonly HEARTBEAT_INTERVAL = 10000;
  private readonly PRESENCE_TIMEOUT = 30000;
  private readonly BROADCAST_CHANNEL = 'abc-presence';

  async initialize(peer: Peer, username: string): Promise<void> {
    this.peer = peer;
    this.username = username;

    this.setupPresenceBroadcast();
    this.setupPresenceListener();
    this.startHeartbeat();
    this.startPresenceCheck();

    this.broadcastPresence('online');
  }

  private setupPresenceBroadcast(): void {
    if (!this.peer) return;

    this.peer.on('connection', (conn) => {
      conn.on('data', (data: any) => {
        if (data.type === 'presence') {
          this.handlePresenceUpdate(data);
        }
      });
    });
  }

  private setupPresenceListener(): void {
    window.addEventListener('storage', (e) => {
      if (e.key === this.BROADCAST_CHANNEL && e.newValue) {
        try {
          const users: OnlineUser[] = JSON.parse(e.newValue);
          users.forEach(user => {
            if (user.peerId !== this.peer?.id) {
              this.onlineUsers.set(user.peerId, user);
            }
          });
          this.notifyListeners();
        } catch (error) {
          console.error('Error parsing presence broadcast:', error);
        }
      }
    });
  }

  private handlePresenceUpdate(data: any): void {
    const { username, peerId, status } = data;
    
    if (peerId === this.peer?.id) return;

    const user: OnlineUser = {
      username,
      peerId,
      lastSeen: Date.now(),
      status: status || 'online'
    };

    this.onlineUsers.set(peerId, user);
    this.notifyListeners();
    this.saveToLocalStorage();
  }

  private broadcastPresence(status: 'online' | 'away' | 'offline'): void {
    if (!this.peer) return;

    const presenceData = {
      type: 'presence',
      username: this.username,
      peerId: this.peer.id,
      status,
      timestamp: Date.now()
    };

    const allUsers = Array.from(this.onlineUsers.values());
    allUsers.push({
      username: this.username,
      peerId: this.peer.id || '',
      lastSeen: Date.now(),
      status
    });

    localStorage.setItem(this.BROADCAST_CHANNEL, JSON.stringify(allUsers));

    this.onlineUsers.forEach((user) => {
      try {
        const conn = this.peer?.connect(user.peerId);
        if (conn) {
          conn.on('open', () => {
            conn.send(presenceData);
          });
        }
      } catch (error) {
        console.error('Error broadcasting presence to', user.peerId, error);
      }
    });
  }

  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      this.broadcastPresence('online');
    }, this.HEARTBEAT_INTERVAL);
  }

  private startPresenceCheck(): void {
    this.presenceCheckInterval = setInterval(() => {
      const now = Date.now();
      let changed = false;

      this.onlineUsers.forEach((user, peerId) => {
        const timeSinceLastSeen = now - user.lastSeen;
        
        if (timeSinceLastSeen > this.PRESENCE_TIMEOUT) {
          this.onlineUsers.delete(peerId);
          changed = true;
        } else if (timeSinceLastSeen > this.HEARTBEAT_INTERVAL * 2 && user.status === 'online') {
          user.status = 'away';
          changed = true;
        }
      });

      if (changed) {
        this.notifyListeners();
        this.saveToLocalStorage();
      }
    }, 5000);
  }

  private saveToLocalStorage(): void {
    const users = Array.from(this.onlineUsers.values());
    localStorage.setItem('abc_online_users', JSON.stringify(users));
  }

  private loadFromLocalStorage(): void {
    const saved = localStorage.getItem('abc_online_users');
    if (saved) {
      try {
        const users: OnlineUser[] = JSON.parse(saved);
        users.forEach(user => {
          this.onlineUsers.set(user.peerId, user);
        });
      } catch (error) {
        console.error('Error loading online users:', error);
      }
    }
  }

  onUsersChange(callback: (users: OnlineUser[]) => void): () => void {
    this.listeners.add(callback);
    callback(this.getOnlineUsers());
    
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notifyListeners(): void {
    const users = this.getOnlineUsers();
    this.listeners.forEach(callback => callback(users));
  }

  getOnlineUsers(): OnlineUser[] {
    return Array.from(this.onlineUsers.values())
      .filter(user => user.status !== 'offline')
      .sort((a, b) => b.lastSeen - a.lastSeen);
  }

  getUserCount(): number {
    return this.onlineUsers.size;
  }

  cleanup(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    if (this.presenceCheckInterval) {
      clearInterval(this.presenceCheckInterval);
    }
    this.broadcastPresence('offline');
    this.onlineUsers.clear();
    this.listeners.clear();
  }
}
