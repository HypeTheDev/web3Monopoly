import React from 'react';
import HomePage from './HomePage/HomePage';
import MonopolyPage from './MonopolyPage/MonopolyPage';
import DBAPage from './DBAPage/DBAPage';
import SpadesPage from './SpadesPage/SpadesPage';
import ChessPage from './ChessPage/ChessPage';

export enum PageType {
  HOME = 'home',
  MONOPOLY = 'monopoly',
  DBA = 'dba',
  SPADES = 'spades',
  CHESS = 'chess'
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

    default:
      return <HomePage onPageChange={onPageChange} />;
  }
};

export default PageRouter;
