import React, { useState, useEffect } from 'react';
import './WorldNews.css';

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: {
    name: string;
  };
  urlToImage?: string;
}

interface WorldNewsProps {
  isVisible: boolean;
  onClose: () => void;
}

const WorldNews: React.FC<WorldNewsProps> = ({ isVisible, onClose }) => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Free NewsAPI (you may need to register for an API key)
  const NEWS_API_URL = 'https://newsapi.org/v2/top-headlines';
  const API_KEY = 'YOUR_NEWSAPI_KEY_HERE'; // Replace with actual API key

  useEffect(() => {
    if (isVisible && news.length === 0) {
      fetchNews();
    }
  }, [isVisible, news.length]);

  const fetchNews = async () => {
    if (!API_KEY || API_KEY === 'YOUR_NEWSAPI_KEY_HERE') {
      // Fallback demo news if no API key
      loadDemoNews();
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${NEWS_API_URL}?country=us&apiKey=${API_KEY}`);
      if (!response.ok) throw new Error('Failed to fetch news');
      const data = await response.json();
      setNews(data.articles.slice(0, 10)); // Get first 10 articles
    } catch (err) {
      setError('Unable to load live news. Using demo content.');
      loadDemoNews();
    } finally {
      setLoading(false);
    }
  };

  const loadDemoNews = () => {
    const demoNews: NewsArticle[] = [
      {
        title: "Breaking: Major Economic Changes Shape Global Markets",
        description: "World leaders announce unprecedented measures to stabilize international trade and cryptocurrency regulations.",
        url: "#",
        publishedAt: new Date().toISOString(),
        source: { name: "Global News Network" }
      },
      {
        title: "Technology Breakthrough: New Web3 Infrastructure Online",
        description: "Decentralized networks reach milestone with 1M+ active users across global blockchain ecosystem.",
        url: "#",
        publishedAt: new Date(Date.now() - 3600000).toISOString(),
        source: { name: "TechChronicle" }
      },
      {
        title: "Climate Initiative Gains Momentum Worldwide",
        description: "International agreement reached on sustainable energy transition with technology partnership.",
        url: "#",
        publishedAt: new Date(Date.now() - 7200000).toISOString(),
        source: { name: "Environmental Watch" }
      },
      {
        title: "Financial Innovation: Banks Adopt New Digital Standards",
        description: "Major banking institutions announce integration of AI-powered risk assessment systems.",
        url: "#",
        publishedAt: new Date(Date.now() - 10800000).toISOString(),
        source: { name: "Finance Today" }
      },
      {
        title: "Space Exploration Milestone Reached",
        description: "Private company achieves historic orbital mission with reusable rocket technology.",
        url: "#",
        publishedAt: new Date(Date.now() - 14400000).toISOString(),
        source: { name: "Astro News" }
      }
    ];
    setNews(demoNews);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours === 1) return '1 hour ago';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return '1 day ago';
    return `${diffInDays} days ago`;
  };

  if (!isVisible) return null;

  return (
    <div className="world-news-overlay" onClick={onClose}>
      <div className="world-news-modal" onClick={(e) => e.stopPropagation()}>
        <div className="news-header">
          <div className="news-title">
            <h3>WORLD_NEWS</h3>
            <div className="news-status">
              {loading ? 'LOADING...' : error ? 'DEMO_MODE' : 'LIVE_UPDATE'}
            </div>
          </div>
          <button className="close-news-btn" onClick={onClose}>[X]</button>
        </div>

        {error && (
          <div className="news-error">
            API_ERROR: {error}
          </div>
        )}

        <div className="news-feed">
          {news.map((article, index) => (
            <div key={index} className="news-article">
              <div className="article-header">
                <span className="article-time">{formatTime(article.publishedAt)}</span>
                <span className="article-source">{article.source.name}</span>
              </div>
              <h4 className="article-title">{article.title}</h4>
              <p className="article-description">{article.description}</p>
            </div>
          ))}
        </div>

        <div className="news-footer">
          <button className="refresh-btn" onClick={fetchNews} disabled={loading}>
            {loading ? 'REFRESHING...' : 'REFRESH_NEWS'}
          </button>
          <div className="news-info">
            STORIES: {news.length} | AUTO_UPDATE: 5_MIN
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorldNews;
