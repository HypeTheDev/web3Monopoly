import React, { useState, useEffect, useRef, useMemo } from 'react';
import './MusicPlayer.css';

// Music Player Component with multiple sources
const MusicPlayer: React.FC = () => {
  const [currentTrack, setCurrentTrack] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(30);
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [currentSource, setCurrentSource] = useState<'soundcloud' | 'youtube' | 'spotify' | 'radio'>('soundcloud');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Available tracks from different sources (URLs would be replaced with real ones)
  const tracksBySource = useMemo(() => ({
    soundcloud: [
      { id: 'sc-1', title: 'Ambient Terminal 1', artist: 'Code Ambient', url: 'https://w.soundcloud.com/player/?url=https://api.soundcloud.com/tracks/123456789' },
      { id: 'sc-2', title: 'Matrix Algorithms', artist: 'Cyber Beats', url: 'https://w.soundcloud.com/player/?url=https://api.soundcloud.com/tracks/987654321' },
      { id: 'sc-3', title: 'Terminal Dreams', artist: 'DOS Dreams', url: 'https://w.soundcloud.com/player/?url=https://api.soundcloud.com/tracks/456789123' }
    ],
    youtube: [
      { id: 'yt-1', title: 'Ambiance for Code', artist: 'YouTube Ambient', url: 'https://www.youtube.com/embed/---actual-video-id---' },
      { id: 'yt-2', title: 'Coding Session Music', artist: 'Focus Audio', url: 'https://www.youtube.com/embed/---actual-video-id---' }
    ],
    spotify: [
      { id: 'sp-1', title: 'Cyber Ambient', artist: 'Spotify Ambient', url: 'https://open.spotify.com/embed/track/---actual-track-id---' },
      { id: 'sp-2', title: 'Terminal Sessions', artist: 'Spotify Tech', url: 'https://open.spotify.com/embed/track/---actual-track-id---' }
    ],
    radio: [
      { id: 'rd-1', title: 'Ambient Radio 24/7', artist: 'Ambient FM', url: 'https://streaming.radionomy.com/ambient-radio' },
      { id: 'rd-2', title: 'Coding Beats FM', artist: 'Dev Radio', url: 'https://streaming.radionomy.com/coding-beats' },
      { id: 'rd-3', title: 'Synthwave Zone', artist: 'Retro FM', url: 'https://streaming.radionomy.com/synthwave-zone' }
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

  const changeSource = (source: 'soundcloud' | 'youtube' | 'spotify' | 'radio') => {
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
      case 'soundcloud':
        return (
          <div className="soundcloud-player">
            <iframe
              width="100%"
              height="166"
              scrolling="no"
              frameBorder="no"
              allow="autoplay"
              title={`${track.title} by ${track.artist} on SoundCloud`}
              src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(track.url)}&color=%23000000&auto_play=${isPlaying}&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true`}
            />
          </div>
        );

      case 'youtube':
        return (
          <div className="youtube-player">
            <iframe
              width="100%"
              height="166"
              title={`${track.title} by ${track.artist} on YouTube`}
              src={`${track.url}?autoplay=${isPlaying ? '1' : '0'}&mute=1&loop=1&playlist=---actual-video-id---`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        );

      case 'spotify':
        return (
          <div className="spotify-player">
            <iframe
              src={track.url}
              width="100%"
              height="152"
              title={`${track.title} by ${track.artist} on Spotify`}
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
          </div>
        );

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
      <div className="music-header">
        <h3>TERMINAL MUSIC</h3>
        <div className="source-selector">
          {Object.keys(tracksBySource).map(source => (
            <button
              key={source}
              className={`source-btn ${currentSource === source ? 'active' : ''}`}
              onClick={() => changeSource(source as any)}
            >
              {source.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="track-info">
        {playlist[currentTrack] && (
          <>
            <div className="track-title">{playlist[currentTrack].title}</div>
            <div className="track-artist">by {playlist[currentTrack].artist}</div>
          </>
        )}
      </div>

      <div className="player-controls">
        <div className="control-buttons">
          <button
            className="control-btn"
            onClick={togglePlay}
            disabled={playlist.length === 0}
          >
            {!isPlaying ? '[PLAY]' : '[PAUSE]'}
          </button>
          <button
            className="control-btn"
            onClick={prevTrack}
            disabled={playlist.length <= 1}
          >
            {'<<'}
          </button>
          <button
            className="control-btn"
            onClick={nextTrack}
            disabled={playlist.length <= 1}
          >
            {'>>'}
          </button>
        </div>

        <div className="volume-control">
          <span>VOL:</span>
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
            className="volume-slider"
          />
          <span>{volume}%</span>
        </div>
      </div>

      <div className="player-display">
        {renderPlayer()}
      </div>

      <div className="music-footer">
        <div className="playlist-info">
          <span>TRACK {currentTrack + 1} / {playlist.length}</span>
          <span className="source-indicator">[{currentSource.toUpperCase()} MODE]</span>
        </div>
        <div className="music-status">
          {isPlaying ? '🔊 PLAYING' : '🔇 PAUSED'}
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
