import React, { useState, useEffect } from 'react';
import './App.css';

import PageRouter, { PageType } from './pages/PageRouter';
import DraggableMusicPlayer from './components/DraggableMusicPlayer';
import LightBeamAnimation from './components/LightBeamAnimation';
import TerminalEffects from './components/TerminalEffects';
import TerminalDecorations from './components/TerminalDecorations';
import BlockchainTest from './components/BlockchainTest';
import ThemeSelector from './components/ThemeSelector';
import UserHeader from './components/UserHeader';
import TokenNotification from './components/TokenNotification';
import LoginPage from './pages/LoginPage/LoginPage';
import { themeManager } from './lib/ThemeManager';
import { UserProvider, useUser } from './context/UserContext';

function AppContent() {
  const { isLoggedIn } = useUser();
  const [activePage, setActivePage] = useState<PageType>(PageType.HOME);

  const handlePageChange = (page: PageType) => {
    setActivePage(page);
  };

  useEffect(() => {
    themeManager.applyTheme();
  }, []);

  if (!isLoggedIn) {
    return <LoginPage />;
  }

  return (
    <div className="App">
      <UserHeader />
      <TokenNotification />
      <TerminalEffects currentPage={activePage} />
      <TerminalDecorations currentPage={activePage} />
      <LightBeamAnimation currentPage={activePage} />
      <DraggableMusicPlayer />
      <BlockchainTest />
      <ThemeSelector />
      <PageRouter activePage={activePage} onPageChange={handlePageChange} />
    </div>
  );
}

function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

export default App;
