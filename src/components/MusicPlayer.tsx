import React, { useState, useEffect, useRef, useMemo } from 'react';
import './MusicPlayer.css';

// Music Player Component with multiple sources
const MusicPlayer: React.FC = () => {
  const [currentTrack, setCurrentTrack] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(30);
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [currentSource, setCurrentSource] = useState<'radio'>('radio');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Available tracks - Synthwave Radio Only
  const tracksBySource = useMemo(() => ({
    radio: [
      { id: 'rd-1', title: 'Synthwave Zone', artist: 'Retro FM', url: 'https://streaming.radionomy.com/synthwave-zone' }
    ]
  }), []);

  interface Track {
    id: string;
    title: string;
    artist: string;
    url: string;
  }

  useEffect(() => {
    setPlaylist(tracksBySource[currentSource]);
    setCurrentTrack(0);
  }, [currentSource, tracksBySource]);

  // Removed auto-play to comply with browser policies
  // User must interact with play button to start music

  useEffect(() => {
    if (audioRef.current) {
      // For HTML5 audio (radio streams)
      if (currentSource === 'radio') {
        const track = playlist[currentTrack];
        if (track && isPlaying) {
          audioRef.current.src = track.url;
          audioRef.current.play();
        } else if (track) {
          audioRef.current.pause();
        }
      }
    }
  }, [currentTrack, isPlaying, playlist, currentSource]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    const nextIndex = (currentTrack + 1) % playlist.length;
    setCurrentTrack(nextIndex);
  };

  const prevTrack = () => {
    const prevIndex = currentTrack === 0 ? playlist.length - 1 : currentTrack - 1;
    setCurrentTrack(prevIndex);
  };

  const changeSource = (source: 'radio') => {
    setCurrentSource(source);
    setIsPlaying(false);
    setCurrentTrack(0);
  };

  const renderPlayer = () => {
    const track = playlist[currentTrack];

    if (!track) {
      return <div className="loading">LOADING_TRACKS...</div>;
    }

    switch (currentSource) {
      case 'radio':
        return (
          <div className="radio-player">
            <audio
              ref={audioRef}
              src={track.url}
              style={{ display: 'none' }}
            />
            <div className="radio-indicator">
              <div className={`radio-wave ${isPlaying ? 'active' : ''}`}></div>
              <div className="radio-freq">FM 88.8</div>
            </div>
          </div>
        );

      default:
        return <div className="error">PLAYER_ERROR: SOURCE_NOT_SUPPORTED</div>;
    }
  };

  return (
    <div className="music-player-container">
      <div className="player-display">
        {renderPlayer()}
      </div>

      <div className="compact-player-controls">
        <div className="track-info-compact">
          {playlist[currentTrack] && (
            <div className="track-title-compact">{playlist[currentTrack].title}</div>
          )}
        </div>

        <div className="control-buttons-compact">
          <button
            className="control-btn-compact"
            onClick={togglePlay}
            disabled={playlist.length === 0}
          >
            {!isPlaying ? '▶' : '⏸'}
          </button>
          <button
            className="control-btn-compact"
            onClick={prevTrack}
            disabled={playlist.length <= 1}
          >
            {'◀'}
          </button>
          <button
            className="control-btn-compact"
            onClick={nextTrack}
            disabled={playlist.length <= 1}
          >
            {'▶'}
          </button>
        </div>

        <div className="volume-control-compact">
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => {
              const newVolume = parseInt(e.target.value);
              setVolume(newVolume);
              if (audioRef.current) {
                audioRef.current.volume = newVolume / 100;
              }
            }}
            className="volume-slider-compact"
          />
        </div>

        <div className="music-status-compact">
          {isPlaying ? '🔊' : '🔇'}
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
