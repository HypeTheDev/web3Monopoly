import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import './MusicPlayer.css';

// Music Player Component with multiple instrumental channels
const MusicPlayer: React.FC = () => {
  const [currentTrack, setCurrentTrack] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(50);
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [currentChannel, setCurrentChannel] = useState<ChannelType>('beats');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  type ChannelType = 'beats' | 'terminal' | 'elevator' | 'easylistening';

  interface Track {
    id: string;
    title: string;
    artist: string;
    url: string;
  }

  // Available channels with instrumental music
  const tracksByChannel = useMemo(() => ({
    beats: [
      { 
        id: 'b1', 
        title: 'Lo-Fi Hip Hop Beats', 
        artist: 'Chill Station', 
        url: 'https://www.soundjay.com/misc/sounds-relax.mp3' // placeholder
      },
      { 
        id: 'b2', 
        title: 'Study Beats', 
        artist: 'Focus Flow', 
        url: 'https://www.soundjay.com/misc/sounds-relax.mp3' // placeholder
      },
      { 
        id: 'b3', 
        title: 'Ambient Groove', 
        artist: 'Beat Lab', 
        url: 'https://www.soundjay.com/misc/sounds-relax.mp3' // placeholder
      }
    ],
    terminal: [
      { 
        id: 't1', 
        title: 'Cyberpunk Terminal', 
        artist: 'Neon Codes', 
        url: 'https://www.soundjay.com/misc/sounds-relax.mp3' // placeholder
      },
      { 
        id: 't2', 
        title: 'Matrix Vibes', 
        artist: 'Digital Rain', 
        url: 'https://www.soundjay.com/misc/sounds-relax.mp3' // placeholder
      },
      { 
        id: 't3', 
        title: 'Synthwave Code', 
        artist: 'Retro Terminal', 
        url: 'https://www.soundjay.com/misc/sounds-relax.mp3' // placeholder
      }
    ],
    elevator: [
      { 
        id: 'e1', 
        title: 'Smooth Jazz Elevator', 
        artist: 'Lobby Lounge', 
        url: 'https://www.soundjay.com/misc/sounds-relax.mp3' // placeholder
      },
      { 
        id: 'e2', 
        title: 'Gentle Piano', 
        artist: 'Elevator Express', 
        url: 'https://www.soundjay.com/misc/sounds-relax.mp3' // placeholder
      },
      { 
        id: 'e3', 
        title: 'Bossa Nova Lite', 
        artist: 'Lift Music Co.', 
        url: 'https://www.soundjay.com/misc/sounds-relax.mp3' // placeholder
      }
    ],
    easylistening: [
      { 
        id: 'el1', 
        title: 'Acoustic Chill', 
        artist: 'Peaceful Sounds', 
        url: 'https://www.soundjay.com/misc/sounds-relax.mp3' // placeholder
      },
      { 
        id: 'el2', 
        title: 'Soft Instrumental', 
        artist: 'Relax Station', 
        url: 'https://www.soundjay.com/misc/sounds-relax.mp3' // placeholder
      },
      { 
        id: 'el3', 
        title: 'Ambient Waves', 
        artist: 'Calm Collective', 
        url: 'https://www.soundjay.com/misc/sounds-relax.mp3' // placeholder
      }
    ]
  }), []);

  // Channel display names and icons
  const channelInfo = {
    beats: { name: 'BEATS', icon: '🎵', color: '#ff6b6b' },
    terminal: { name: 'TERMINAL', icon: '💻', color: '#00ff00' },
    elevator: { name: 'ELEVATOR', icon: '🎷', color: '#4ecdc4' },
    easylistening: { name: 'CHILL', icon: '🎶', color: '#45b7d1' }
  };

  useEffect(() => {
    setPlaylist(tracksByChannel[currentChannel]);
    setCurrentTrack(0);
    setIsPlaying(false); // Stop playing when switching channels
  }, [currentChannel, tracksByChannel]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const nextTrack = useCallback(() => {
    const nextIndex = (currentTrack + 1) % playlist.length;
    setCurrentTrack(nextIndex);
  }, [currentTrack, playlist.length]);

  const prevTrack = useCallback(() => {
    const prevIndex = currentTrack === 0 ? playlist.length - 1 : currentTrack - 1;
    setCurrentTrack(prevIndex);
  }, [currentTrack, playlist.length]);

  useEffect(() => {
    const handleAudioError = () => {
      console.warn('Audio failed to load, using placeholder audio');
      // In production, you would have a fallback audio file
    };

    if (audioRef.current) {
      const audio = audioRef.current;
      audio.addEventListener('error', handleAudioError);
      audio.addEventListener('ended', nextTrack);
      
      return () => {
        audio.removeEventListener('error', handleAudioError);
        audio.removeEventListener('ended', nextTrack);
      };
    }
  }, [nextTrack]);

  const togglePlay = () => {
    if (playlist.length > 0) {
      if (isPlaying) {
        // Stop playing
        setIsPlaying(false);
      } else {
        // Start playing - generate ambient music
        generateAmbientMusic();
        setIsPlaying(true);
      }
    }
  };

  // Generate continuous ambient music for each channel
  const generateAmbientMusic = () => {
    if (typeof window !== 'undefined' && 'AudioContext' in window) {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

        // Create multiple oscillators for richer sound
        const createChannel = (frequency: number, detune: number = 0) => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();

          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);

          oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
          oscillator.detune.setValueAtTime(detune, audioContext.currentTime);
          oscillator.type = 'triangle'; // More musical than sine

          gainNode.gain.setValueAtTime((volume / 1000) * 0.5, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1);

          return { oscillator, gainNode };
        };

        // Different ambient patterns for each channel
        const channelPatterns = {
          beats: [
            { freq: 220, detune: 0 },   // A3
            { freq: 277, detune: 2 },   // C#4
            { freq: 330, detune: -1 }   // E4
          ],
          terminal: [
            { freq: 440, detune: 0 },   // A4
            { freq: 523, detune: 3 },   // C5
            { freq: 659, detune: -2 }   // E5
          ],
          elevator: [
            { freq: 330, detune: 0 },   // E4
            { freq: 392, detune: 1 },   // G4
            { freq: 494, detune: -1 }   // B4
          ],
          easylistening: [
            { freq: 262, detune: 0 },   // C4
            { freq: 330, detune: 2 },   // E4
            { freq: 392, detune: -1 }   // G4
          ]
        };

        const pattern = channelPatterns[currentChannel];

        // Create and start oscillators
        pattern.forEach((note, index) => {
          const { oscillator } = createChannel(note.freq, note.detune);

          // Stagger the start times slightly for richer texture
          oscillator.start(audioContext.currentTime + (index * 0.1));

          // Create a gentle fade pattern
          setTimeout(() => {
            oscillator.stop(audioContext.currentTime + 4);
          }, 100);
        });

        // Schedule next iteration for continuous play
        setTimeout(() => {
          if (isPlaying) {
            generateAmbientMusic();
          }
        }, 3500);

      } catch (error) {
        console.warn('Web Audio API not supported');
      }
    }
  };

  const switchChannel = (channel: ChannelType) => {
    setCurrentChannel(channel);
  };

  const getCurrentTrack = () => {
    return playlist[currentTrack] || { title: 'No Track', artist: 'Loading...' };
  };

  return (
    <div className="music-player-container">
      {/* Channel Selector */}
      <div className="channel-selector">
        {(Object.keys(channelInfo) as ChannelType[]).map((channel) => (
          <button
            key={channel}
            className={`channel-btn ${currentChannel === channel ? 'active' : ''}`}
            onClick={() => switchChannel(channel)}
            style={{
              borderColor: currentChannel === channel ? channelInfo[channel].color : 'var(--border-color, #333)'
            }}
          >
            <span className="channel-icon">{channelInfo[channel].icon}</span>
            <span className="channel-name">{channelInfo[channel].name}</span>
          </button>
        ))}
      </div>

      {/* Current Track Display */}
      <div className="track-display" 
           style={{ borderColor: channelInfo[currentChannel].color }}>
        <div className="track-info">
          <div className="track-title">{getCurrentTrack().title}</div>
          <div className="track-artist">{getCurrentTrack().artist}</div>
        </div>
        <div className="channel-indicator" 
             style={{ color: channelInfo[currentChannel].color }}>
          {channelInfo[currentChannel].icon}
        </div>
      </div>

      {/* Controls */}
      <div className="player-controls-compact">
        <button 
          className="control-btn-compact"
          onClick={prevTrack}
          disabled={playlist.length <= 1}
        >
          ⏮
        </button>
        
        <button 
          className="control-btn-compact play-btn"
          onClick={togglePlay}
          disabled={playlist.length === 0}
          style={{ 
            backgroundColor: isPlaying ? channelInfo[currentChannel].color : 'transparent',
            color: isPlaying ? '#000' : channelInfo[currentChannel].color
          }}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        
        <button 
          className="control-btn-compact"
          onClick={nextTrack}
          disabled={playlist.length <= 1}
        >
          ⏭
        </button>
      </div>

      {/* Volume Control */}
      <div className="volume-section">
        <span className="volume-icon">{volume === 0 ? '🔇' : volume < 50 ? '🔉' : '🔊'}</span>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => setVolume(parseInt(e.target.value))}
          className="volume-slider-compact"
          style={{
            background: `linear-gradient(to right, ${channelInfo[currentChannel].color} 0%, ${channelInfo[currentChannel].color} ${volume}%, var(--border-color, #333) ${volume}%, var(--border-color, #333) 100%)`
          }}
        />
        <span className="volume-value">{volume}</span>
      </div>

      {/* Status Indicator */}
      <div className="status-bar">
        <div className={`status-dot ${isPlaying ? 'playing' : ''}`} 
             style={{ backgroundColor: isPlaying ? channelInfo[currentChannel].color : 'var(--border-color, #333)' }}></div>
        <span className="status-text">
          {isPlaying ? 'NOW PLAYING' : 'STOPPED'}
        </span>
      </div>

      {/* Hidden Audio Element for future use with real audio files */}
      <audio
        ref={audioRef}
        style={{ display: 'none' }}
        preload="none"
      />
    </div>
  );
};

export default MusicPlayer;
