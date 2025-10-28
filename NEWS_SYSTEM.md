# Live News System Documentation

## Overview
The BKM Terminal platform features a comprehensive live news aggregation system providing real-time global updates across 8 categories.

## Features

### 📡 Live News Feed
- ✅ Real-time news from Reddit (free, no API key needed)
- ✅ Auto-refresh every 5 minutes
- ✅ 8 news categories
- ✅ Fallback curated content
- ✅ Priority-based sorting
- ✅ Time-ago formatting
- ✅ Live status indicator
- ✅ Story count display

### 📰 News Categories

#### 1. 🚨 BREAKING
- Breaking news and urgent updates
- Refresh every 15 seconds
- Real-time from r/worldnews, r/news
- Priority: Breaking alerts shown first

#### 2. ⚡ TECH
- Technology and innovation news
- AI, quantum computing, software
- From r/technology, r/programming

#### 3. 💰 FINANCE
- Financial markets and economy
- Traditional + crypto finance
- From r/finance, r/stocks

#### 4. 🔬 SCIENCE
- Scientific breakthroughs
- Medical research, discoveries
- From r/science, r/Futurology

#### 5. 🏛️ POLITICS
- Political developments
- Policy changes, elections
- From r/politics

#### 6. 🌍 CLIMATE
- Environmental news
- Climate action, sustainability
- From r/climate, r/environment

#### 7. 🚀 SPACE
- Space exploration
- Astronomy, missions
- From r/space

#### 8. ₿ CRYPTO
- Cryptocurrency and Web3
- DeFi, blockchain adoption
- From r/cryptocurrency, r/bitcoin

## Technical Implementation

### NewsService.ts

#### Singleton Pattern
```typescript
import NewsService from './lib/NewsService';

const newsService = NewsService.getInstance();

// Fetch news for category
const articles = await newsService.fetchNews(NewsCategory.TECH);

// Force refresh
const fresh = await newsService.fetchNews(NewsCategory.CRYPTO, true);

// Clear cache
newsService.clearCache();
```

#### Data Structure
```typescript
interface NewsArticle {
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
```

### News Sources

#### Primary: Reddit JSON API
```typescript
// Example: Fetch tech news
fetch('https://www.reddit.com/r/technology.json')

Benefits:
- ✅ Free, no API key required
- ✅ Real-time content
- ✅ High-quality curation (upvotes)
- ✅ Multiple subreddits per category
- ✅ CORS-friendly
```

#### Fallback: Curated Content
- Pre-loaded news database
- 8+ articles per category
- Always available offline
- Quality content guaranteed

### Auto-Refresh System

#### Refresh Intervals
```typescript
Breaking News:  15 seconds (UI update)
Other Categories: 60 seconds (UI update)
API Fetch: 5 minutes (all categories)
```

#### Cache Strategy
```typescript
- Cache duration: 5 minutes
- Per-category caching
- Automatic expiry
- Force refresh option
```

### Priority System

#### Article Priorities
```typescript
Breaking: 🚨 (>10,000 upvotes on Reddit)
High:     ⚡ (>1,000 upvotes)
Medium:   📡 (<1,000 upvotes)
Low:      📰 (older content)
```

## User Interface

### News Feed Layout
```
┌────────────────────────────────┐
│ ● LIVE 24/7      15 STORIES    │ ← Status Bar
├────────────────────────────────┤
│ [🚨 BREAKING] [⚡ TECH] [💰]   │ ← Categories
│ [🔬] [🏛️] [🌍] [🚀] [₿]       │
├────────────────────────────────┤
│ 🚨 5m ago                       │
│ BREAKING: Global Economic...   │
│ World leaders unveil...        │
├────────────────────────────────┤
│ ⚡ 30m ago                      │
│ AI Breakthrough: Quantum...    │
│ Major tech consortium...       │
└────────────────────────────────┘
```

### Visual Indicators

**Live Status:**
- Green dot (●) - Currently live
- Pulses every 2 seconds
- Shows "UPDATING..." during fetch

**Time Stamps:**
- "NOW" - Just posted
- "5m ago" - Minutes
- "2h ago" - Hours
- "3d ago" - Days

**Priority Icons:**
- 🚨 Breaking
- ⚡ High
- 📡 Medium
- 📰 Low

## Integration

### In HomePage.tsx
```typescript
import LiveNewsFeed from '../components/LiveNewsFeed';

const [activeCategory, setActiveCategory] = useState(NewsCategory.BREAKING);

<LiveNewsFeed 
  activeCategory={activeCategory}
  onCategoryChange={setActiveCategory}
/>
```

### Styling Integration
```css
/* Uses theme system colors */
--terminal-text: var(--primary-color)
--terminal-bg: var(--background-color)
--terminal-border: var(--border-color)
```

## API Options (Future Enhancement)

### NewsAPI.org
```typescript
// Free tier: 100 requests/day
const API_URL = 'https://newsapi.org/v2/top-headlines';
const API_KEY = 'your_key_here';

const response = await fetch(
  `${API_URL}?country=us&category=technology&apiKey=${API_KEY}`
);
```

### GNews API
```typescript
// Free tier: 100 requests/day
const API_URL = 'https://gnews.io/api/v4/top-headlines';
const API_KEY = 'your_key_here';

const response = await fetch(
  `${API_URL}?category=technology&lang=en&token=${API_KEY}`
);
```

### RSS Feeds
```typescript
// Parse RSS/Atom feeds
import Parser from 'rss-parser';

const parser = new Parser();
const feed = await parser.parseURL('https://news.example.com/rss');
```

## Performance

### Optimization
- **5-minute cache** - Reduces API calls
- **Background fetch** - Non-blocking UI
- **Incremental updates** - Smooth UI changes
- **Error recovery** - Always shows content

### Resource Usage
- **Memory:** ~2-5MB (cached news)
- **Network:** ~50KB per category fetch
- **CPU:** Minimal (async operations)

## Data Flow

```
User Opens HomePage
      ↓
LiveNewsFeed Mounts
      ↓
NewsService.fetchNews(category)
      ↓
Check Cache (5min TTL)
      ↓
Cache Valid? → Return Cached
      ↓
Cache Expired? → Fetch from Reddit
      ↓
Reddit Success? → Parse & Cache
      ↓
Reddit Fail? → Use Fallback Content
      ↓
Display in UI
      ↓
Auto-refresh every 5min
```

## Error Handling

### Graceful Degradation
1. **Reddit API fails** → Fallback to curated content
2. **Network offline** → Show cached content
3. **Parse error** → Use previous data
4. **No cache** → Show curated news

### User Feedback
```typescript
isLoadingLive: Shows "UPDATING..."
Error: Silently falls back
Cache: Shows "(cached)" indicator
```

## Testing

### Manual Testing
```typescript
// In browser console
const newsService = require('./lib/NewsService').default.getInstance();

// Test fetch
newsService.fetchNews('tech').then(console.log);

// Test all categories
Object.values(NewsCategory).forEach(async (cat) => {
  const news = await newsService.fetchNews(cat);
  console.log(cat, news.length);
});

// Clear cache
newsService.clearCache();
```

### Automated Testing
```bash
npm test -- LiveNewsFeed
```

## Configuration

### Adjust Refresh Rates

#### In LiveNewsFeed.tsx
```typescript
// API fetch interval (default: 5 minutes)
const refreshInterval = setInterval(() => {
  loadLiveNews();
}, 5 * 60 * 1000); // Change this value

// UI update interval (default: 15s/60s)
const interval = setInterval(updateNews, 
  activeCategory === NewsCategory.BREAKING ? 15000 : 60000
);
```

### Adjust Story Count
```typescript
// Maximum stories displayed (default: 15)
setNewsItems(uniqueNews.slice(0, 15)); // Change this value
```

### Customize News Sources

#### Add New Reddit Subreddit
```typescript
// In NewsService.ts
private readonly RSS_FEEDS = {
  [NewsCategory.TECH]: [
    'https://www.reddit.com/r/technology.json',
    'https://www.reddit.com/r/webdev.json', // Add new source
  ]
};
```

## Best Practices

### Content Curation
1. **Verify sources** - Use reputable subreddits
2. **Filter spam** - Check upvote counts
3. **Deduplicate** - Remove duplicate stories
4. **Sort by time** - Most recent first

### Performance
1. **Cache aggressively** - 5-minute TTL
2. **Batch updates** - Don't fetch too often
3. **Lazy load** - Only fetch visible categories
4. **Error boundaries** - Prevent crashes

### User Experience
1. **Always show content** - Never show empty state
2. **Smooth updates** - No jarring changes
3. **Visual feedback** - Loading indicators
4. **Fast interaction** - Instant category switching

## Future Enhancements

### Planned Features
- [ ] NewsAPI.org integration (API key)
- [ ] Multiple news sources per category
- [ ] Article bookmarking
- [ ] Share to messenger
- [ ] News search functionality
- [ ] Custom RSS feed support
- [ ] News alerts/notifications
- [ ] Read/unread tracking

### Advanced Features
- [ ] AI-powered news summarization
- [ ] Sentiment analysis
- [ ] Trend detection
- [ ] Personalized recommendations
- [ ] Multi-language support
- [ ] Voice news reading
- [ ] News videos
- [ ] Interactive charts/data

## Privacy & Security

### Data Handling
- ✅ No user tracking
- ✅ No data collection
- ✅ Client-side only
- ✅ No cookies for news
- ✅ CORS-safe requests

### Content Safety
- ✅ Curated sources (Reddit)
- ✅ Community-moderated
- ✅ Fallback to safe content
- ✅ No external scripts

## Troubleshooting

### News Not Loading
1. Check browser console
2. Verify internet connection
3. Check CORS errors
4. Clear news cache
5. Refresh page

### Slow Updates
1. Check network speed
2. Verify refresh intervals
3. Clear browser cache
4. Reduce story count

### Reddit API Issues
- Reddit may rate-limit requests
- Some subreddits may be private
- CORS may block some requests
- Fallback content always available

## Analytics (Future)

### Track Metrics
- [ ] Articles viewed per session
- [ ] Most popular categories
- [ ] Average read time
- [ ] Click-through rates
- [ ] Engagement by time of day

## Resources

- [Reddit JSON API](https://github.com/reddit-archive/reddit/wiki/JSON)
- [NewsAPI.org](https://newsapi.org/)
- [GNews API](https://gnews.io/)
- [RSS Parser](https://www.npmjs.com/package/rss-parser)

---

**Built with ❤️ for staying informed**
