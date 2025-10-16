// Import React and components
import React, { useState, useEffect } from 'react';
import './App.css';

// Page Router and Pages
import PageRouter, { PageType } from './pages/PageRouter';

// Draggable Music Player Component
import DraggableMusicPlayer from './components/DraggableMusicPlayer';

// Light Beam Animation Component
import LightBeamAnimation from './components/LightBeamAnimation';

// Terminal Effects Component
import TerminalEffects from './components/TerminalEffects';

// Terminal Decorations Component
import TerminalDecorations from './components/TerminalDecorations';

// Blockchain Test Component
import BlockchainTest from './components/BlockchainTest';

// Theme Selector Component
import ThemeSelector from './components/ThemeSelector';

// Theme Manager
import { themeManager } from './lib/ThemeManager';

// Matrix Rain Component (commented out for now)
// import MatrixRain from './components/MatrixRain';

function App() {
  const [activePage, setActivePage] = useState<PageType>(PageType.HOME); // Start with Home by default

  const handlePageChange = (page: PageType) => {
    setActivePage(page);
  };

  // Initialize theme system on app load
  useEffect(() => {
    themeManager.applyTheme();
  }, []);

  return (
    <div className="App">
      {/* Terminal Effects Layer */}
      <TerminalEffects currentPage={activePage} />

      {/* Terminal Decorations Layer */}
      <TerminalDecorations currentPage={activePage} />

      {/* Light Beam Animation Layer */}
      <LightBeamAnimation currentPage={activePage} />

      {/* Draggable Music Player */}
      <DraggableMusicPlayer />

      {/* Blockchain Test Panel */}
      <BlockchainTest />

      {/* Theme Selector */}
      <ThemeSelector />

      <PageRouter activePage={activePage} onPageChange={handlePageChange} />
    </div>
  );
}

export default App;
