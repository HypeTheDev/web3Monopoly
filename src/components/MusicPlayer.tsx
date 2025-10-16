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
    fallbackUrls?: string[];
  }

  // Available channels with 24/7 streaming radio stations and fallback URLs
  const tracksByChannel = useMemo(() => ({
    beats: [
      {
        id: 'b1',
        title: 'Lo-Fi Hip Hop Radio',
        artist: 'Chillhop Radio',
        url: 'https://streams.fluxfm.de/Chillhop/mp3-320/streams.fluxfm.de/',
        fallbackUrls: [
          'https://streams.ilovemusic.de/chillhop.mp3',
          'https://uk7.internet-radio.com:8226/stream'
        ]
      },
      {
        id: 'b2',
        title: 'Jazz Cafe 24/7',
        artist: 'Jazz Radio',
        url: 'https://live.wostreaming.net/direct/ppm-jazz24mp3-ibc4',
        fallbackUrls: [
          'https://uk7.internet-radio.com:8226/stream',
          'https://streams.fluxfm.de/Chillhop/mp3-320/streams.fluxfm.de/'
        ]
      },
      {
        id: 'b3',
        title: 'Instrumental Beats',
        artist: 'Focus Music',
        url: 'https://uk7.internet-radio.com:8226/stream',
        fallbackUrls: [
          'https://streams.fluxfm.de/Chillhop/mp3-320/streams.fluxfm.de/',
          'https://live.wostreaming.net/direct/ppm-jazz24mp3-ibc4'
        ]
      }
    ],
    terminal: [
      {
        id: 't1',
        title: 'Ambient Room',
        artist: 'Sleep Radio',
        url: 'https://streams.ilovemusic.de/ambient.mp3',
        fallbackUrls: [
          'https://uk7.internet-radio.com:8226/stream',
          'https://streams.fluxfm.de/Chillhop/mp3-320/streams.fluxfm.de/'
        ]
      },
      {
        id: 't2',
        title: 'Digital Lounge',
        artist: 'Nightlight FM',
        url: 'https://streams.ilovemusic.de/electronic.mp3',
        fallbackUrls: [
          'https://uk7.internet-radio.com:8226/stream',
          'https://streams.fluxfm.de/Chillhop/mp3-320/streams.fluxfm.de/'
        ]
      },
      {
        id: 't3',
        title: 'Code Beats Ambient',
        artist: 'WFMU Experimental',
        url: 'https://stream0.wfmu.org/experimental-128k',
        fallbackUrls: [
          'https://uk7.internet-radio.com:8226/stream',
          'https://streams.fluxfm.de/Chillhop/mp3-320/streams.fluxfm.de/'
        ]
      }
    ],
    elevator: [
      {
        id: 'e1',
        title: 'Classical Piano',
        artist: 'Piano Radio',
        url: 'https://streaming.radionomy.com/Abacusfm-PianoRadio',
        fallbackUrls: [
          'https://uk7.internet-radio.com:8226/stream',
          'https://streams.fluxfm.de/Chillhop/mp3-320/streams.fluxfm.de/'
        ]
      },
      {
        id: 'e2',
        title: 'Smooth Jazz',
        artist: 'KJazz 88.1 FM',
        url: 'https://kjzz.streamguys1.com/kjzzmp3',
        fallbackUrls: [
          'https://live.wostreaming.net/direct/ppm-jazz24mp3-ibc4',
          'https://streams.fluxfm.de/Chillhop/mp3-320/streams.fluxfm.de/'
        ]
      },
      {
        id: 'e3',
        title: 'Elevator Classics',
        artist: 'Classical KDFC',
        url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/KDFCFM.mp3',
        fallbackUrls: [
          'https://streaming.radionomy.com/Abacusfm-PianoRadio',
          'https://streams.fluxfm.de/Chillhop/mp3-320/streams.fluxfm.de/'
        ]
      }
    ],
    easylistening: [
      {
        id: 'el1',
        title: 'Coffee Shop Jazz',
        artist: 'Jazz Radio',
        url: 'https://live.wostreaming.net/direct/ppm-coffeeshopmp3-ibc4',
        fallbackUrls: [
          'https://live.wostreaming.net/direct/ppm-jazz24mp3-ibc4',
          'https://streams.fluxfm.de/Chillhop/mp3-320/streams.fluxfm.de/'
        ]
      },
      {
        id: 'el2',
        title: 'Lounge Music',
        artist: 'Simply Lounge',
        url: 'https://streaming.radionomy.com/Simply-Lounge',
        fallbackUrls: [
          'https://streaming.radionomy.com/Abacusfm-PianoRadio',
          'https://streams.fluxfm.de/Chillhop/mp3-320/streams.fluxfm.de/'
        ]
      },
      {
        id: 'el3',
        title: 'Piano Radio',
        artist: 'Abacus FM Piano',
        url: 'https://streaming.radionomy.com/Abacusfm-PianoRadio',
        fallbackUrls: [
          'https://streaming.radionomy.com/Simply-Lounge',
          'https://streams.fluxfm.de/Chillhop/mp3-320/streams.fluxfm.de/'
        ]
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

    // Update audio source when channel changes
    if (audioRef.current) {
      const currentTrackData = tracksByChannel[currentChannel][0];
      if (currentTrackData) {
        audioRef.current.src = currentTrackData.url;
        audioRef.current.load();
      }
    }
  }, [currentChannel, tracksByChannel]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // Fallback basic ambient music
  const generateBasicAmbientMusic = useCallback(() => {
    if (typeof window !== 'undefined' && 'AudioContext' in window) {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // Simple frequency for fallback
        oscillator.frequency.setValueAtTime(330, audioContext.currentTime);
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime((volume / 1000) * 0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 2);

        // Schedule next fallback pattern
        setTimeout(() => {
          if (isPlaying) {
            generateBasicAmbientMusic();
          }
        }, 2000);

      } catch (error) {
        console.warn('Basic audio generation also failed');
      }
    }
  }, [volume, isPlaying]);

  // Advanced ambient music generation with more sophisticated patterns
  const generateAdvancedAmbientMusic = useCallback(() => {
    if (typeof window !== 'undefined' && 'AudioContext' in window) {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

        // Create a more sophisticated oscillator setup
        const createAdvancedChannel = (baseFreq: number, harmonics: number[] = []) => {
          const oscillators = [];
          const gainNodes = [];

          // Main oscillator
          const mainOsc = audioContext.createOscillator();
          const mainGain = audioContext.createGain();

          mainOsc.connect(mainGain);
          mainGain.connect(audioContext.destination);

          mainOsc.frequency.setValueAtTime(baseFreq, audioContext.currentTime);
          mainOsc.type = 'sine';

          mainGain.gain.setValueAtTime((volume / 2000) * 0.8, audioContext.currentTime);
          mainGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 2);

          oscillators.push(mainOsc);
          gainNodes.push(mainGain);

          // Add harmonic overtones for richness
          harmonics.forEach((harmonic, index) => {
            const harmOsc = audioContext.createOscillator();
            const harmGain = audioContext.createGain();

            harmOsc.connect(harmGain);
            harmGain.connect(audioContext.destination);

            harmOsc.frequency.setValueAtTime(baseFreq * harmonic, audioContext.currentTime);
            harmOsc.type = 'triangle';

            harmGain.gain.setValueAtTime((volume / 3000) * (0.3 / (index + 1)), audioContext.currentTime);
            harmGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 2);

            oscillators.push(harmOsc);
            gainNodes.push(harmGain);
          });

          return { oscillators, gainNodes };
        };

        // Channel-specific harmonic patterns
        const channelHarmonics = {
          beats: {
            baseFreq: 220,
            harmonics: [1.5, 2, 2.5] // Rich, warm lo-fi sound
          },
          terminal: {
            baseFreq: 440,
            harmonics: [1.25, 1.5, 1.75] // Bright, digital sound
          },
          elevator: {
            baseFreq: 330,
            harmonics: [1.33, 1.67, 2] // Smooth jazz character
          },
          easylistening: {
            baseFreq: 262,
            harmonics: [1.2, 1.4, 1.6] // Gentle, relaxing tones
          }
        };

        const config = channelHarmonics[currentChannel];

        // Create the oscillator setup
        const { oscillators } = createAdvancedChannel(config.baseFreq, config.harmonics);

        // Start all oscillators with slight stagger
        oscillators.forEach((oscillator, index) => {
          oscillator.start(audioContext.currentTime + (index * 0.05));
          setTimeout(() => {
            oscillator.stop(audioContext.currentTime + 3);
          }, 50);
        });

        // Schedule next pattern for continuous play
        setTimeout(() => {
          if (isPlaying) {
            generateAdvancedAmbientMusic();
          }
        }, 2800);

      } catch (error) {
        console.warn('Advanced audio generation failed, using fallback');
        generateBasicAmbientMusic();
      }
    }
  }, [currentChannel, volume, isPlaying, generateBasicAmbientMusic]);

  // Try multiple streaming URLs with fallback support
  const tryStreamingUrls = useCallback(async (urls: string[], currentIndex: number = 0): Promise<void> => {
    if (currentIndex >= urls.length) {
      // All URLs failed, fall back to procedural generation
      console.warn('All streaming URLs failed, falling back to procedural generation');
      generateAdvancedAmbientMusic();
      return;
    }

    const currentUrl = urls[currentIndex];

    try {
      // Test if URL is accessible by creating a temporary audio element
      await new Promise<void>((resolve, reject) => {
        const testAudio = new Audio();
        testAudio.volume = volume / 100;
        testAudio.crossOrigin = 'anonymous';

        const timeout = setTimeout(() => {
          testAudio.removeEventListener('canplaythrough', onSuccess);
          testAudio.removeEventListener('error', onError);
          reject(new Error('Timeout'));
        }, 5000);

        const onSuccess = () => {
          clearTimeout(timeout);
          testAudio.removeEventListener('canplaythrough', onSuccess);
          testAudio.removeEventListener('error', onError);
          resolve();
        };

        const onError = () => {
          clearTimeout(timeout);
          testAudio.removeEventListener('canplaythrough', onSuccess);
          testAudio.removeEventListener('error', onError);
          reject(new Error('Audio load failed'));
        };

        testAudio.addEventListener('canplaythrough', onSuccess);
        testAudio.addEventListener('error', onError);
        testAudio.src = currentUrl;
        testAudio.load();
      });

      // If we get here, the URL works - update the main audio element
      if (audioRef.current) {
        audioRef.current.src = currentUrl;
        audioRef.current.load();
        if (isPlaying) {
          audioRef.current.play().catch(error => {
            console.warn(`Failed to play from ${currentUrl}, trying next URL`);
            tryStreamingUrls(urls, currentIndex + 1);
          });
        }
      }

    } catch (error) {
      console.warn(`URL ${currentUrl} failed, trying next URL`);
      // Try the next URL
      tryStreamingUrls(urls, currentIndex + 1);
    }
  }, [volume, isPlaying, generateAdvancedAmbientMusic]);

  // Stream music from external API - fallback function
  const streamMusicFromAPI = useCallback(async () => {
    const currentTrackData = playlist[currentTrack];
    if (currentTrackData) {
      const urlsToTry = [currentTrackData.url, ...(currentTrackData.fallbackUrls || [])];
      await tryStreamingUrls(urlsToTry);
    } else {
      // No track data, fall back to procedural generation
      generateAdvancedAmbientMusic();
    }
  }, [playlist, currentTrack, tryStreamingUrls, generateAdvancedAmbientMusic]);

  // Update audio source when current track changes
  useEffect(() => {
    if (audioRef.current && playlist.length > 0) {
      const currentTrackData = playlist[currentTrack];
      if (currentTrackData) {
        audioRef.current.src = currentTrackData.url;
        audioRef.current.load();
        // Auto-play if we were already playing
        if (isPlaying) {
          audioRef.current.play().catch(error => {
            console.warn('Audio play failed, falling back to procedural generation');
            streamMusicFromAPI();
          });
        }
      }
    }
  }, [currentTrack, playlist, isPlaying, streamMusicFromAPI]);

  // Handle audio play/pause state changes
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);

      audio.addEventListener('play', handlePlay);
      audio.addEventListener('pause', handlePause);

      return () => {
        audio.removeEventListener('play', handlePlay);
        audio.removeEventListener('pause', handlePause);
      };
    }
  }, []);

  const nextTrack = useCallback(() => {
    const nextIndex = (currentTrack + 1) % playlist.length;
    setCurrentTrack(nextIndex);
  }, [currentTrack, playlist.length]);

  const prevTrack = useCallback(() => {
    const prevIndex = currentTrack === 0 ? playlist.length - 1 : currentTrack - 1;
    setCurrentTrack(prevIndex);
  }, [currentTrack, playlist.length]);

  useEffect(() => {
    const handleAudioError = async (event: Event) => {
      const audio = event.target as HTMLAudioElement;
      const currentSrc = audio.src;

      console.warn(`Audio failed to load: ${currentSrc}`);

      // Try to get fallback URLs for the current track
      const currentTrackData = playlist[currentTrack];
      if (currentTrackData && currentTrackData.fallbackUrls && currentTrackData.fallbackUrls.length > 0) {
        console.warn('Trying fallback URLs...');
        const urlsToTry = [currentTrackData.url, ...currentTrackData.fallbackUrls];
        const currentIndex = urlsToTry.findIndex(url => url === currentSrc);
        const nextIndex = currentIndex + 1;

        if (nextIndex < urlsToTry.length) {
          // Try the next URL in the fallback chain
          const nextUrl = urlsToTry[nextIndex];
          console.warn(`Trying fallback URL: ${nextUrl}`);
          audio.src = nextUrl;
          audio.load();

          if (isPlaying) {
            try {
              await audio.play();
              console.warn(`Successfully loaded fallback URL: ${nextUrl}`);
            } catch (error) {
              console.warn(`Fallback URL also failed: ${nextUrl}`);
              // If this was the last URL, fall back to procedural generation
              if (nextIndex + 1 >= urlsToTry.length) {
                console.warn('All URLs failed, falling back to procedural generation');
                streamMusicFromAPI();
              }
            }
          }
        } else {
          // No more fallback URLs, use procedural generation
          console.warn('No more fallback URLs, falling back to procedural generation');
          streamMusicFromAPI();
        }
      } else {
        // No fallback URLs available, use procedural generation
        console.warn('No fallback URLs available, falling back to procedural generation');
        streamMusicFromAPI();
      }
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
  }, [nextTrack, playlist, currentTrack, isPlaying, streamMusicFromAPI]);

  const togglePlay = async () => {
    if (playlist.length > 0) {
      if (isPlaying) {
        // Stop playing
        if (audioRef.current) {
          audioRef.current.pause();
        }
        setIsPlaying(false);
      } else {
        // Start playing from streaming URL
        if (audioRef.current) {
          try {
            await audioRef.current.play();
            setIsPlaying(true);
          } catch (error) {
            console.warn('Audio play failed, falling back to procedural generation');
            await streamMusicFromAPI();
            setIsPlaying(true);
          }
        } else {
          // No audio element, use procedural generation directly
          await streamMusicFromAPI();
          setIsPlaying(true);
        }
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
        crossOrigin="anonymous"
      />
    </div>
  );
};

export default MusicPlayer;
