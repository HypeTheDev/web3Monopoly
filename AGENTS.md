# AGENTS.md - monopoly-web3

## Commands
- **Start dev server**: `npm start` (opens http://localhost:3000)
- **Build**: `npm run build`
- **Run all tests**: `npm test`
- **Run single test**: `npm test -- --testNamePattern="test name"` or `npm test -- MusicPlayer` for specific file

## Architecture
- **Frontend**: React 19 + TypeScript (strict mode), Create React App
- **Structure**: Pages-based routing (PageRouter), components, lib (game engines), services, types
- **Key Systems**: Multi-game platform (Monopoly, Spades, Chess, DBA), AI simulation engines, theme manager, blockchain integration
- **Game Engines**: src/lib/ contains MonopolyEngine, DBAEngine, ChessEngine, SpadesEngine extending BaseGameEngine
- **No backend**: Pure frontend React app, Web3 blockchain integration via GameBlockchainService

## Code Style
- **Imports**: Group by: React, internal components/pages, lib, types, services (see App.tsx)
- **Components**: PascalCase files (GameBoard.tsx), matching CSS files (GameBoard.css)
- **Types**: Centralized in src/types/GameTypes.ts with interfaces (Player, GameState) and enums (GameMode)
- **Naming**: camelCase for variables/functions, PascalCase for components/types, UPPER_CASE for constants
- **CSS**: CSS variables for theming, component-specific stylesheets, sleep-friendly design comments
- **TypeScript**: Strict mode enabled, explicit types required, use interfaces for complex objects
