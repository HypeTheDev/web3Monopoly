# 🎮 Monopoly Web3 Terminal

A modern, Web3-ready Monopoly game with a sleek terminal interface featuring 4 AI players competing in real-time.

## ✨ Features

- 🤖 **4 AI Players** compete continuously with different strategies
- 🔥 **Terminal Interface** with customizable color themes
- 🎲 **Real-time Gameplay** with automatic dice rolling and property management
- 🎵 **Music Integration** supporting SoundCloud, YouTube, Spotify, and web radio
- 📱 **Responsive Design** optimized for all devices
- 🎨 **Multiple Themes** including Cyber Space, Matrix Mode, and Retro Fun
- 📊 **Live Statistics** tracking player performance and game trends
- 🏠 **Complete Property Trading** with houses, hotels, and mortgaging

## 🚀 Quick Start

### Install Dependencies
```bash
npm install
```

### Development Mode
```bash
npm start
```
Opens http://localhost:3000 in your browser.

### Production Build
```bash
npm run build
npm run serve  # or serve -s build
```

### Start Watching AI Players
1. Click **"START_AI_RACE"** button
2. Adjust speed controls (Normal/Realtime/Ultra-Fast)
3. Watch AI players compete automatically
4. Customize themes and add background music

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, CSS3
- **Build**: Create React App, React Scripts
- **Styling**: CSS Variables, Responsive Design
- **Game Engine**: Custom AI simulation with real-time state management
- **Music Integration**: Embedded players for popular streaming platforms

## 📁 Project Structure

```
monopoly-web3/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── GameBoard.tsx    # Main monopoly board
│   │   ├── PlayerInfo.tsx   # Player statistics
│   │   ├── GameControls.tsx # Start/stop controls
│   │   ├── PropertyModal.tsx # Property trading
│   │   ├── MusicPlayer.tsx   # Background music
│   │   ├── MatrixRain.tsx    # Visual effects
│   │   └── ColorPicker.tsx   # Theme selector
│   ├── lib/
│   │   └── GameEngine.ts     # AI game logic
│   ├── types/
│   │   └── GameTypes.ts      # TypeScript interfaces
│   ├── App.tsx           # Main application
│   ├── index.tsx         # Application entry point
│   └── *.css             # Styling files
├── build/                # Production build output
├── package.json          # Dependencies & scripts
└── README.md            # This file
```

## 🎮 How to Play

1. **Start a Game**: Click "START_AI_RACE" to begin AI competition
2. **Watch Gameplay**: 4 AI players make strategic decisions automatically
3. **Customize Experience**:
   - Change speed (Realtime/Ultra-Fast)
   - Select color themes
   - Add background music
4. **Monitor Stats**: Track who's winning, property ownership, and game metrics

## 🎨 Customization

### Themes
- **Terminal Classic** - Green & black hacker aesthetic
- **Cyber Space** - Cyan & magenta neon colors
- **Matrix Mode** - Red pill style visual effects
- **Retro Fun** - 80s inspired palette
- **Neon Nights** - Electric color explosion

### Music Sources
- SoundCloud widget integration
- YouTube direct streaming
- Spotify web player
- Internet radio stations

## 🔧 Recent Updates

- Fixed game board tile sizing for consistent square boxes
- Improved CSS grid layout for proper board alignment
- Enhanced responsive design for mobile devices
- Optimized development build process
- Updated documentation for clarity

## 👥 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature-name`)
3. Commit changes (`git commit -am 'Add feature'`)
4. Push to branch (`git push origin feature-name`)
5. Create a Pull Request

### Future Enhancements
- Human vs AI multiplayer mode
- Web3 blockchain property ownership
- AI difficulty levels and strategies
- Advanced property trading mechanics
- Tournament mode with multiple games

## 📄 License

Built with ❤️ for game enthusiasts and developers. See package.json for dependencies.

---

**Enjoy the game!** 🎲🚀
