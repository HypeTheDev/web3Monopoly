// Import React and components
import React, { useState } from 'react';
import './App.css';

// Page Router and Pages
import PageRouter, { PageType } from './pages/PageRouter';

// Persistent Music Player Component
import MusicPlayer from './components/MusicPlayer';

function App() {
  const [activePage, setActivePage] = useState<PageType>(PageType.HOME); // Start with Home by default

  const handlePageChange = (page: PageType) => {
    setActivePage(page);
  };

  return (
    <div className="App">
      {/* Persistent Music Player - plays across all pages */}
      <div className="persistent-music-player">
        <MusicPlayer />
      </div>

      <PageRouter activePage={activePage} onPageChange={handlePageChange} />
    </div>
  );
}

export default App;
