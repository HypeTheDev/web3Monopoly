# Music Player Documentation

## Overview
The BKM Terminal features a draggable, multi-channel music player with procedural audio generation and streaming capabilities.

## Features

### 🎵 Multi-Channel System
- **BEATS** 🎵 - Lo-fi hip hop and instrumental beats
- **TERMINAL** 💻 - Ambient and digital lounge music
- **ELEVATOR** 🎷 - Classical piano and smooth jazz
- **CHILL** 🎶 - Easy listening and coffee shop vibes

### 🎛️ Playback Features
- Real-time streaming from internet radio stations
- Procedural audio generation (fallback)
- Channel-specific harmonic patterns
- Automatic track progression
- Volume control (0-100)
- Play/Pause/Skip controls

### 🖱️ Draggable Interface
- Drag and drop positioning
- Snap to screen edges
- Minimizable player
- Position persistence (localStorage)
- State persistence across sessions

## Technical Implementation

### Components

#### 1. DraggableMusicPlayer.tsx
**Purpose:** Wrapper component providing drag-and-drop functionality

**Features:**
- Mouse/touch drag support
- Edge snapping (50px threshold)
- Position save/restore
- Minimize/expand toggle
- Prevents text selection during drag

**Key Methods:**
```typescript
handleMouseDown(e)   // Start dragging
snapToEdges(x, y)    // Snap to screen edges
toggleMinimize()     // Toggle minimized state
```

#### 2. MusicPlayer.tsx
**Purpose:** Core music playback and UI

**Features:**
- 4 music channels
- 12 curated internet radio streams
- Procedural audio generation
- Fallback URL system
- Channel-specific visuals

**Key Methods:**
```typescript
togglePlay()                    // Play/pause
nextTrack() / prevTrack()       // Track navigation
switchChannel(channel)          // Change channel
streamMusicFromAPI()            // Stream internet radio
generateAdvancedAmbientMusic()  // Procedural audio
```

### Audio Sources

#### Streaming URLs
Each track has multiple fallback URLs for reliability:

**BEATS Channel:**
- Chillhop Radio (primary)
- Jazz Radio
- Instrumental Beats

**TERMINAL Channel:**
- Ambient Room
- Digital Lounge
- Code Beats Ambient

**ELEVATOR Channel:**
- Classical Piano
- Smooth Jazz
- Elevator Classics

**CHILL Channel:**
- Coffee Shop Jazz
- Lounge Music
- Piano Radio

#### Procedural Audio
When streaming fails, the player generates procedural ambient music using Web Audio API:

```typescript
// Channel-specific harmonic patterns
beats:       220Hz base, [1.5, 2, 2.5] harmonics
terminal:    440Hz base, [1.25, 1.5, 1.75] harmonics
elevator:    330Hz base, [1.33, 1.67, 2] harmonics
chill:       262Hz base, [1.2, 1.4, 1.6] harmonics
```

## User Interface

### Player Layout
```
┌─────────────────────────────────┐
│ ⋮⋮  🎵 AUDIO TERMINAL      − □ │ ← Drag Handle
├─────────────────────────────────┤
│  [BEATS] [TERMINAL] [ELEVATOR]  │ ← Channel Tabs
│  [CHILL]                        │
├─────────────────────────────────┤
│  ┌──────────────────────────┐  │
│  │ Lo-Fi Hip Hop Radio   🎵 │  │ ← Track Info
│  │ Chillhop Radio           │  │
│  └──────────────────────────┘  │
├─────────────────────────────────┤
│     ⏮   ▶/⏸   ⏭               │ ← Controls
├─────────────────────────────────┤
│  🔊 ▬▬▬▬▬▬▬▬▬▬ 50              │ ← Volume
├─────────────────────────────────┤
│  ● NOW PLAYING                  │ ← Status
└─────────────────────────────────┘
```

### Controls

**Channel Selector**
- Click any channel button to switch
- Active channel highlighted with color

**Playback Controls**
- ⏮ Previous Track
- ▶/⏸ Play/Pause
- ⏭ Next Track

**Volume Slider**
- Drag to adjust (0-100)
- Visual indicator shows current level
- Icons: 🔇 (mute), 🔉 (low), 🔊 (high)

**Window Controls**
- Drag anywhere on title bar to move
- − Minimize player
- □ Restore player

## State Persistence

### LocalStorage Keys
```typescript
'musicPlayerPosition'   // {x, y} coordinates
'musicPlayerMinimized'  // true/false
```

### Auto-Save
- Position saved on every move
- Minimized state saved on toggle
- Restored on page reload

## Responsive Design

### Desktop (>768px)
- Full-size player (280-320px wide)
- All features visible

### Mobile (≤768px)
- Compact player (250-280px wide)
- Larger touch targets
- Simplified layout

### Mobile Portrait (≤480px)
- Minimal player (230-260px wide)
- Reduced font sizes
- Optimized for one-handed use

## Error Handling

### Fallback Chain
1. **Primary URL** - Try main streaming URL
2. **Fallback URLs** - Try 2-3 backup URLs
3. **Procedural Audio** - Generate audio if all URLs fail

### Error Recovery
```typescript
// Automatic fallback on error
audio.addEventListener('error', handleAudioError)

// Try next URL in chain
tryStreamingUrls(urls, currentIndex + 1)

// Ultimate fallback
generateAdvancedAmbientMusic()
```

## Usage

### In App.tsx
```typescript
import DraggableMusicPlayer from './components/DraggableMusicPlayer';

function App() {
  return (
    <div className="App">
      <DraggableMusicPlayer />
      {/* other components */}
    </div>
  );
}
```

### Customization

#### Add New Channel
```typescript
// In MusicPlayer.tsx
const tracksByChannel = {
  myChannel: [
    {
      id: 'mc1',
      title: 'My Track',
      artist: 'My Artist',
      url: 'https://stream.url',
      fallbackUrls: ['https://backup1.url', 'https://backup2.url']
    }
  ]
};

const channelInfo = {
  myChannel: { name: 'MY CHANNEL', icon: '🎸', color: '#ff00ff' }
};
```

#### Modify Procedural Audio
```typescript
// In generateAdvancedAmbientMusic()
const channelHarmonics = {
  myChannel: {
    baseFreq: 300,
    harmonics: [1.5, 2, 3]
  }
};
```

## Performance

### Optimization
- Lazy audio element creation
- Debounced position updates
- Memoized channel configuration
- Efficient event listeners

### Resource Usage
- **Memory:** ~5-10MB (streaming)
- **Memory:** ~2-5MB (procedural)
- **CPU:** Low (<5% on modern devices)
- **Network:** ~128kbps streaming

## Browser Compatibility

### Supported Features
- ✅ Web Audio API (Chrome, Firefox, Safari, Edge)
- ✅ HTML5 Audio (all modern browsers)
- ✅ CORS streaming (with proper headers)
- ✅ Touch events (mobile browsers)

### Fallbacks
- Procedural audio for unsupported streaming
- Basic oscillators for Web Audio failures
- Silent mode if all audio fails

## Troubleshooting

### No Sound
1. Check volume level
2. Click play button
3. Check browser audio permissions
4. Try switching channels
5. Refresh page

### Streaming Issues
- Player automatically falls back to procedural audio
- Check browser console for errors
- Some streams may be geo-restricted
- Try different channel

### Drag Issues
- Ensure mouse/touch is on drag handle
- Player snaps to edges automatically
- Position resets on page refresh if saved position invalid

## Future Enhancements

### Planned Features
- [ ] Playlist creation
- [ ] Favorite tracks
- [ ] Equalizer controls
- [ ] Visualizer
- [ ] Integration with Spotify/Apple Music APIs
- [ ] User-uploaded tracks
- [ ] Crossfade between tracks
- [ ] Sleep timer
- [ ] Keyboard shortcuts

### Integration Ideas
- [ ] Game soundtracks per game
- [ ] Achievement sound effects
- [ ] Token earning sounds
- [ ] Messaging notification sounds
- [ ] Dynamic music based on game state

## Credits

### Music Sources
- **Chillhop Radio** - Lo-fi beats
- **Jazz24** - 24/7 jazz streaming
- **WFMU** - Experimental music
- **Various Internet Radio Stations**

### Technology
- Web Audio API
- HTML5 Audio
- React Hooks
- LocalStorage API

---

**Built with ❤️ for ambient coding sessions**
