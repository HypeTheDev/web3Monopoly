import React, { useState } from 'react';
import './App.css';

// Page Router and Pages
import PageRouter, { PageType } from './pages/PageRouter';

function App() {
  const [activePage, setActivePage] = useState<PageType>(PageType.MONOPOLY); // Start with Monopoly by default

  const handlePageChange = (page: PageType) => {
    setActivePage(page);
  };

  return (
    <div className="App">
      <PageRouter activePage={activePage} onPageChange={handlePageChange} />
    </div>
  );
}

export default App;
