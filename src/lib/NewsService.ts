/**
 * NewsService - Real-time News Aggregation
 * 
 * Fetches live news from multiple sources with fallback to curated content
 */

import { NewsCategory } from '../components/LiveNewsFeed';

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  category: NewsCategory;
  timestamp: number;
  location: string;
  priority: 'breaking' | 'high' | 'medium' | 'low';
  source: string;
  url?: string;
  imageUrl?: string;
  tags: string[];
}

export class NewsService {
  private static instance: NewsService;
  private newsCache: Map<NewsCategory, NewsArticle[]> = new Map();
  private lastFetch: Map<NewsCategory, number> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000;

  private constructor() {}

  public static getInstance(): NewsService {
    if (!NewsService.instance) {
      NewsService.instance = new NewsService();
    }
    return NewsService.instance;
  }

  private readonly RSS_FEEDS = {
    [NewsCategory.BREAKING]: [
      'https://www.reddit.com/r/worldnews.json',
      'https://www.reddit.com/r/news.json'
    ],
    [NewsCategory.TECH]: [
      'https://www.reddit.com/r/technology.json',
      'https://www.reddit.com/r/programming.json'
    ],
    [NewsCategory.FINANCE]: [
      'https://www.reddit.com/r/finance.json',
      'https://www.reddit.com/r/stocks.json'
    ],
    [NewsCategory.SCIENCE]: [
      'https://www.reddit.com/r/science.json',
      'https://www.reddit.com/r/Futurology.json'
    ],
    [NewsCategory.POLITICS]: [
      'https://www.reddit.com/r/politics.json'
    ],
    [NewsCategory.CLIMATE]: [
      'https://www.reddit.com/r/climate.json',
      'https://www.reddit.com/r/environment.json'
    ],
    [NewsCategory.SPACE]: [
      'https://www.reddit.com/r/space.json'
    ],
    [NewsCategory.CRYPTO]: [
      'https://www.reddit.com/r/cryptocurrency.json',
      'https://www.reddit.com/r/bitcoin.json'
    ]
  };

  public async fetchNews(category: NewsCategory, forceRefresh: boolean = false): Promise<NewsArticle[]> {
    const cached = this.newsCache.get(category);
    const lastFetch = this.lastFetch.get(category) || 0;
    const now = Date.now();

    if (!forceRefresh && cached && (now - lastFetch) < this.CACHE_DURATION) {
      return cached;
    }

    try {
      const news = await this.fetchFromReddit(category);
      this.newsCache.set(category, news);
      this.lastFetch.set(category, now);
      return news;
    } catch (error) {
      console.warn('Failed to fetch live news, using fallback:', error);
      return this.getFallbackNews(category);
    }
  }

  private async fetchFromReddit(category: NewsCategory): Promise<NewsArticle[]> {
    const feeds = this.RSS_FEEDS[category];
    
    for (const feedUrl of feeds) {
      try {
        const response = await fetch(feedUrl);
        if (!response.ok) continue;
        
        const data = await response.json();
        const posts = data.data?.children || [];
        
        const articles: NewsArticle[] = posts
          .slice(0, 10)
          .map((post: any) => ({
            id: post.data.id,
            title: post.data.title,
            description: post.data.selftext?.substring(0, 200) || 'Click to read more...',
            category,
            timestamp: post.data.created_utc * 1000,
            location: post.data.subreddit_name_prefixed || 'Global',
            priority: post.data.ups > 10000 ? 'breaking' : post.data.ups > 1000 ? 'high' : 'medium',
            source: post.data.subreddit || 'Reddit',
            url: `https://reddit.com${post.data.permalink}`,
            tags: [post.data.link_flair_text || 'news'].filter(Boolean)
          }));
        
        if (articles.length > 0) {
          return articles;
        }
      } catch (error) {
        console.warn(`Failed to fetch from ${feedUrl}:`, error);
        continue;
      }
    }
    
    throw new Error('All feeds failed');
  }

  private getFallbackNews(category: NewsCategory): NewsArticle[] {
    const fallbackData: Record<NewsCategory, NewsArticle[]> = {
      [NewsCategory.BREAKING]: [
        {
          id: 'fallback-b1',
          title: 'Global Economic Summit Concludes with Major Agreements',
          description: 'World leaders reach consensus on digital currency regulation and international trade policies.',
          category: NewsCategory.BREAKING,
          timestamp: Date.now(),
          location: 'Geneva',
          priority: 'breaking',
          source: 'Global News Network',
          tags: ['economics', 'policy']
        }
      ],
      [NewsCategory.TECH]: [
        {
          id: 'fallback-t1',
          title: 'AI Development Reaches New Milestone in Natural Language',
          description: 'Latest models demonstrate human-level understanding in complex reasoning tasks.',
          category: NewsCategory.TECH,
          timestamp: Date.now() - 1800000,
          location: 'Silicon Valley',
          priority: 'high',
          source: 'Tech News Daily',
          tags: ['ai', 'nlp', 'development']
        }
      ],
      [NewsCategory.FINANCE]: [
        {
          id: 'fallback-f1',
          title: 'Cryptocurrency Markets Experience Significant Growth',
          description: 'Digital assets see increased institutional investment as traditional finance embraces blockchain.',
          category: NewsCategory.FINANCE,
          timestamp: Date.now() - 3600000,
          location: 'Multiple Exchanges',
          priority: 'high',
          source: 'Financial Chronicle',
          tags: ['crypto', 'markets', 'institutional']
        }
      ],
      [NewsCategory.SCIENCE]: [
        {
          id: 'fallback-s1',
          title: 'Medical Research Makes Progress in Gene Therapy',
          description: 'Clinical trials show promising results for CRISPR-based treatments of genetic disorders.',
          category: NewsCategory.SCIENCE,
          timestamp: Date.now() - 5400000,
          location: 'Johns Hopkins',
          priority: 'high',
          source: 'Science Journal',
          tags: ['genetics', 'medicine', 'crispr']
        }
      ],
      [NewsCategory.POLITICS]: [
        {
          id: 'fallback-p1',
          title: 'International Digital Rights Framework Announced',
          description: 'Coalition of nations establishes new standards for online privacy and data protection.',
          category: NewsCategory.POLITICS,
          timestamp: Date.now() - 7200000,
          location: 'United Nations',
          priority: 'high',
          source: 'Political Wire',
          tags: ['digital rights', 'privacy', 'policy']
        }
      ],
      [NewsCategory.CLIMATE]: [
        {
          id: 'fallback-c1',
          title: 'Renewable Energy Adoption Surpasses Fossil Fuels in Key Markets',
          description: 'Solar and wind power generation reaches historic levels across multiple continents.',
          category: NewsCategory.CLIMATE,
          timestamp: Date.now() - 9000000,
          location: 'Global',
          priority: 'high',
          source: 'Green Energy Report',
          tags: ['renewable', 'solar', 'wind']
        }
      ],
      [NewsCategory.SPACE]: [
        {
          id: 'fallback-sp1',
          title: 'Mars Mission Preparation Enters Final Phase',
          description: 'International space agency confirms crew selection and equipment testing completed.',
          category: NewsCategory.SPACE,
          timestamp: Date.now() - 10800000,
          location: 'Cape Canaveral',
          priority: 'medium',
          source: 'Space News Today',
          tags: ['mars', 'mission', 'exploration']
        }
      ],
      [NewsCategory.CRYPTO]: [
        {
          id: 'fallback-cr1',
          title: 'Decentralized Finance Protocols See Record Adoption',
          description: 'DeFi platforms report exponential growth in user participation and total value locked.',
          category: NewsCategory.CRYPTO,
          timestamp: Date.now() - 12600000,
          location: 'Global',
          priority: 'high',
          source: 'Crypto Insider',
          tags: ['defi', 'adoption', 'tvl']
        }
      ]
    };

    return fallbackData[category] || [];
  }

  public clearCache(): void {
    this.newsCache.clear();
    this.lastFetch.clear();
  }

  public getCachedNews(category: NewsCategory): NewsArticle[] | null {
    return this.newsCache.get(category) || null;
  }
}

export default NewsService;
