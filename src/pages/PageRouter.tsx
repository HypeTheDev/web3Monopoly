import React from 'react';
import HomePage from './HomePage/HomePage';
import MonopolyPage from './MonopolyPage/MonopolyPage';
import DBAPage from './DBAPage/DBAPage';
import SpadesPage from './SpadesPage/SpadesPage';
import ChessPage from './ChessPage/ChessPage';
import MessengerPage from './MessengerPage/MessengerPage';
import Slot777Page from './Slot777Page/Slot777Page';

export enum PageType {
  HOME = 'home',
  MONOPOLY = 'monopoly',
  DBA = 'dba',
  SPADES = 'spades',
  CHESS = 'chess',
  SEVEN777 = 'seven777',
  MESSENGER = 'messenger'
}

interface PageRouterProps {
  activePage: PageType;
  onPageChange: (page: PageType) => void;
}

const PageRouter: React.FC<PageRouterProps> = ({ activePage, onPageChange }) => {
  switch (activePage) {
    case PageType.HOME:
      return <HomePage onPageChange={onPageChange} />;

    case PageType.MONOPOLY:
      return <MonopolyPage onPageChange={onPageChange} />;

    case PageType.DBA:
      return <DBAPage onPageChange={onPageChange} />;

    case PageType.SPADES:
      return <SpadesPage onPageChange={onPageChange} />;

    case PageType.CHESS:
      return <ChessPage onPageChange={onPageChange} />;

    case PageType.SEVEN777:
      return <Slot777Page onPageChange={onPageChange} />;

    case PageType.MESSENGER:
      return <MessengerPage onPageChange={onPageChange} />;

    default:
      return <HomePage onPageChange={onPageChange} />;
  }
};

export default PageRouter;
