import React, { useState, useEffect, useCallback } from 'react';
import NewsService, { NewsArticle } from '../lib/NewsService';
import './LiveNewsFeed.css';

interface NewsItem {
  id: string;
  title: string;
  description: string;
  category: NewsCategory;
  timestamp: number;
  location: string;
  priority: 'breaking' | 'high' | 'medium' | 'low';
  source: string;
  tags: string[];
}

export enum NewsCategory {
  BREAKING = 'breaking',
  TECH = 'tech',
  FINANCE = 'finance',
  SCIENCE = 'science',
  POLITICS = 'politics',
  CLIMATE = 'climate',
  SPACE = 'space',
  CRYPTO = 'crypto'
}

interface LiveNewsFeedProps {
  activeCategory: NewsCategory;
  onCategoryChange: (category: NewsCategory) => void;
}

// Comprehensive news data with rotating updates
const NEWS_DATABASE: NewsItem[] = [
  {
    id: 'breaking-001',
    title: 'BREAKING: Global Economic Summit Announces Major Policy Changes',
    description: 'World leaders unveil unprecedented cooperation framework for digital currency regulation and international trade.',
    category: NewsCategory.BREAKING,
    timestamp: Date.now(),
    location: 'Geneva, Switzerland',
    priority: 'breaking',
    source: 'Global News Network',
    tags: ['economics', 'policy', 'international']
  },
  {
    id: 'tech-001',
    title: 'AI Breakthrough: Quantum Computing Reaches Commercial Viability',
    description: 'Major tech consortium announces first practical quantum processors for enterprise deployment, revolutionizing computational capabilities.',
    category: NewsCategory.TECH,
    timestamp: Date.now() - 1800000,
    location: 'Silicon Valley, USA',
    priority: 'high',
    source: 'TechCrunch Global',
    tags: ['ai', 'quantum', 'computing', 'enterprise']
  },
  {
    id: 'finance-001',
    title: 'DeFi Protocol Surpasses $500B in Total Value Locked',
    description: 'Decentralized finance ecosystem reaches historic milestone as institutional adoption accelerates globally.',
    category: NewsCategory.FINANCE,
    timestamp: Date.now() - 3600000,
    location: 'Multiple Exchanges',
    priority: 'high',
    source: 'CoinDesk Pro',
    tags: ['defi', 'tvl', 'institutional', 'crypto']
  },
  {
    id: 'science-001',
    title: 'Gene Therapy Success: Blindness Reversed in Clinical Trial',
    description: 'Revolutionary CRISPR treatment shows 95% success rate in restoring vision to patients with inherited blindness.',
    category: NewsCategory.SCIENCE,
    timestamp: Date.now() - 5400000,
    location: 'Johns Hopkins, USA',
    priority: 'high',
    source: 'Nature Medicine',
    tags: ['genetics', 'medicine', 'crispr', 'clinical trial']
  },
  {
    id: 'space-001',
    title: 'Mars Colony Simulation Enters Phase 3: 1000-Day Mission',
    description: 'International crew begins longest-ever Mars habitat simulation to test psychological and technical systems.',
    category: NewsCategory.SPACE,
    timestamp: Date.now() - 7200000,
    location: 'Antarctica Base',
    priority: 'medium',
    source: 'Space News International',
    tags: ['mars', 'simulation', 'colonization', 'psychology']
  },
  {
    id: 'climate-001',
    title: 'Ocean Current Restoration Project Shows Promising Results',
    description: 'Innovative technology successfully redirects warming currents, potentially reversing regional climate effects.',
    category: NewsCategory.CLIMATE,
    timestamp: Date.now() - 9000000,
    location: 'Atlantic Ocean',
    priority: 'high',
    source: 'Environmental Science Today',
    tags: ['ocean', 'climate', 'technology', 'restoration']
  },
  {
    id: 'politics-001',
    title: 'Digital Rights Charter Signed by 50+ Nations',
    description: 'Historic international agreement establishes global standards for privacy, data protection, and digital sovereignty.',
    category: NewsCategory.POLITICS,
    timestamp: Date.now() - 10800000,
    location: 'United Nations HQ',
    priority: 'high',
    source: 'Reuters International',
    tags: ['digital rights', 'privacy', 'international law', 'sovereignty']
  },
  {
    id: 'crypto-001',
    title: 'Central Bank Digital Currencies Reach 2B Users Globally',
    description: 'CBDCs achieve mass adoption milestone as 15 major economies complete rollout of national digital currencies.',
    category: NewsCategory.CRYPTO,
    timestamp: Date.now() - 12600000,
    location: 'Global',
    priority: 'medium',
    source: 'Digital Currency Report',
    tags: ['cbdc', 'adoption', 'national currency', 'digital payments']
  }
];

// Additional rotating news items for each category
const ROTATING_NEWS: { [key in NewsCategory]: NewsItem[] } = {
  [NewsCategory.BREAKING]: [
    {
      id: 'breaking-002',
      title: 'URGENT: Cybersecurity Threat Level Elevated Worldwide',
      description: 'International cybersecurity agencies report coordinated attempts to infiltrate critical infrastructure systems.',
      category: NewsCategory.BREAKING,
      timestamp: Date.now() - 900000,
      location: 'Global',
      priority: 'breaking',
      source: 'CyberSec Alert',
      tags: ['cybersecurity', 'infrastructure', 'global threat']
    }
  ],
  [NewsCategory.TECH]: [
    {
      id: 'tech-002',
      title: 'Neural Interface Technology Enables Direct Brain-Computer Connection',
      description: 'First human patient successfully controls computer systems through thought alone in groundbreaking trial.',
      category: NewsCategory.TECH,
      timestamp: Date.now() - 2700000,
      location: 'Stanford University',
      priority: 'high',
      source: 'Neural Tech Review',
      tags: ['bci', 'neural interface', 'paralysis', 'technology']
    }
  ],
  [NewsCategory.FINANCE]: [
    {
      id: 'finance-002',
      title: 'Traditional Banks Launch Integrated Crypto Trading Platforms',
      description: 'Major financial institutions begin offering direct cryptocurrency services to millions of customers.',
      category: NewsCategory.FINANCE,
      timestamp: Date.now() - 4500000,
      location: 'New York, London',
      priority: 'high',
      source: 'Financial Times',
      tags: ['banking', 'crypto', 'integration', 'mainstream']
    }
  ],
  [NewsCategory.SCIENCE]: [
    {
      id: 'science-002',
      title: 'Fusion Reactor Achieves Net Energy Gain for 100 Consecutive Days',
      description: 'Breakthrough in sustainable fusion technology brings clean, unlimited energy closer to reality.',
      category: NewsCategory.SCIENCE,
      timestamp: Date.now() - 6300000,
      location: 'ITER, France',
      priority: 'high',
      source: 'Physics World',
      tags: ['fusion', 'energy', 'breakthrough', 'sustainable']
    }
  ],
  [NewsCategory.POLITICS]: [
    {
      id: 'politics-002',
      title: 'Global Democracy Index: Digital Voting Systems Show 99.9% Accuracy',
      description: 'Blockchain-based voting technology successfully deployed in 12 national elections with unprecedented security.',
      category: NewsCategory.POLITICS,
      timestamp: Date.now() - 8100000,
      location: 'Multiple Countries',
      priority: 'medium',
      source: 'Democracy Watch',
      tags: ['voting', 'blockchain', 'democracy', 'security']
    }
  ],
  [NewsCategory.CLIMATE]: [
    {
      id: 'climate-002',
      title: 'Atmospheric Carbon Capture Stations Remove 1 Billion Tons CO2',
      description: 'Global network of direct air capture facilities reaches milestone in atmospheric carbon reduction.',
      category: NewsCategory.CLIMATE,
      timestamp: Date.now() - 9900000,
      location: 'Global Network',
      priority: 'high',
      source: 'Climate Action News',
      tags: ['carbon capture', 'co2', 'climate action', 'technology']
    }
  ],
  [NewsCategory.SPACE]: [
    {
      id: 'space-002',
      title: 'Asteroid Mining Operation Extracts First Platinum Payload',
      description: 'Commercial space mining venture successfully harvests rare metals from near-Earth asteroid.',
      category: NewsCategory.SPACE,
      timestamp: Date.now() - 11700000,
      location: 'Asteroid Belt',
      priority: 'medium',
      source: 'Space Commerce Today',
      tags: ['asteroid mining', 'platinum', 'space economy', 'resources']
    }
  ],
  [NewsCategory.CRYPTO]: [
    {
      id: 'crypto-002',
      title: 'Web3 Social Networks Reach 500M Active Users',
      description: 'Decentralized social platforms achieve mainstream adoption with enhanced privacy and user control.',
      category: NewsCategory.CRYPTO,
      timestamp: Date.now() - 13500000,
      location: 'Global',
      priority: 'medium',
      source: 'Web3 Analytics',
      tags: ['web3', 'social media', 'decentralized', 'adoption']
    }
  ]
};

const LiveNewsFeed: React.FC<LiveNewsFeedProps> = ({ activeCategory, onCategoryChange }) => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [liveNews, setLiveNews] = useState<NewsArticle[]>([]);
  const [isLive, setIsLive] = useState<boolean>(true);
  const [isLoadingLive, setIsLoadingLive] = useState<boolean>(false);
  const newsService = NewsService.getInstance();

  // Filter news by category
  const getFilteredNews = useCallback(() => {
    const baseNews = NEWS_DATABASE.filter(item => 
      activeCategory === NewsCategory.BREAKING ? 
        item.priority === 'breaking' || item.category === NewsCategory.BREAKING :
        item.category === activeCategory
    );
    
    const rotatingNews = ROTATING_NEWS[activeCategory] || [];
    return [...baseNews, ...rotatingNews].sort((a, b) => b.timestamp - a.timestamp);
  }, [activeCategory]);

  // Fetch real news on mount and category change
  useEffect(() => {
    const loadLiveNews = async () => {
      setIsLoadingLive(true);
      try {
        const articles = await newsService.fetchNews(activeCategory);
        setLiveNews(articles);
      } catch (error) {
        console.warn('Failed to load live news:', error);
      } finally {
        setIsLoadingLive(false);
      }
    };

    loadLiveNews();

    const refreshInterval = setInterval(() => {
      loadLiveNews();
    }, 5 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, [activeCategory, newsService]);

  // Merge live news with curated content
  useEffect(() => {
    const updateNews = () => {
      const filteredNews = getFilteredNews();
      
      const convertedLiveNews: NewsItem[] = liveNews.map(article => ({
        id: article.id,
        title: article.title,
        description: article.description,
        category: article.category,
        timestamp: article.timestamp,
        location: article.location,
        priority: article.priority,
        source: article.source,
        tags: article.tags
      }));
      
      const allNews = [...convertedLiveNews, ...filteredNews];
      const uniqueNews = Array.from(
        new Map(allNews.map(item => [item.id, item])).values()
      ).sort((a, b) => b.timestamp - a.timestamp);
      
      setNewsItems(uniqueNews.slice(0, 15));
    };

    updateNews();

    const interval = setInterval(updateNews, 
      activeCategory === NewsCategory.BREAKING ? 15000 : 60000
    );

    return () => clearInterval(interval);
  }, [activeCategory, getFilteredNews, liveNews]);

  // Ping status indicator
  useEffect(() => {
    const pingInterval = setInterval(() => {
      setIsLive(true);
      setTimeout(() => setIsLive(false), 500);
    }, 2000);

    return () => clearInterval(pingInterval);
  }, []);

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'NOW';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'breaking': return '🚨';
      case 'high': return '⚡';
      case 'medium': return '📡';
      default: return '📰';
    }
  };

  const getCategoryIcon = (category: NewsCategory) => {
    const icons = {
      [NewsCategory.BREAKING]: '🚨',
      [NewsCategory.TECH]: '⚡',
      [NewsCategory.FINANCE]: '💰',
      [NewsCategory.SCIENCE]: '🔬',
      [NewsCategory.POLITICS]: '🏛️',
      [NewsCategory.CLIMATE]: '🌍',
      [NewsCategory.SPACE]: '🚀',
      [NewsCategory.CRYPTO]: '₿'
    };
    return icons[category] || '📡';
  };

  return (
    <div className="live-news-feed">
      {/* Live Status Indicator */}
      <div className="news-status-bar">
        <div className="ping-indicator">
          <span className={`ping-dot ${isLive ? 'active' : ''}`}></span>
          <span className="ping-text">{isLoadingLive ? 'UPDATING...' : 'LIVE 24/7'}</span>
        </div>
        <div className="news-count">
          {newsItems.length} STORIES
        </div>
      </div>

      {/* Category Tabs */}
      <div className="news-categories">
        {Object.values(NewsCategory).map((category) => (
          <button
            key={category}
            className={`category-tab ${activeCategory === category ? 'active' : ''}`}
            onClick={() => onCategoryChange(category)}
          >
            {getCategoryIcon(category)} {category.toUpperCase()}
          </button>
        ))}
      </div>

      {/* News Feed */}
      <div className="news-feed-container">
        {newsItems.map((item) => (
          <div key={item.id} className={`news-item priority-${item.priority}`}>
            <div className="news-meta">
              <span className="news-priority">{getPriorityIcon(item.priority)}</span>
              <span className="news-time">{formatTimeAgo(item.timestamp)}</span>
            </div>
            <h4 className="news-title">{item.title}</h4>
            <p className="news-description">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveNewsFeed;