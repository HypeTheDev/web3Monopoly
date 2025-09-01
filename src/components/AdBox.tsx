import React, { useState, useEffect } from 'react';
import './AdBox.css';

const ADS_CONTENT = [
  {
    id: 1,
    type: 'upgrade',
    title: '🎯 UPGRADE TO BKM PRO',
    subtitle: 'Get exclusive DBA Superhero Packs!',
    content: 'Unlock legendary players like Colossus Prime and Void Sentinel. Premium trading features and advanced analytics.',
    cta: 'UPGRADE NOW',
    color: '#FFD700'
  },
  {
    id: 2,
    type: 'nft',
    title: '⚡ LIMITED EDITION NFTs',
    subtitle: 'Nexus Prime Genesis Collection',
    content: 'Own the first-ever Reality Warping player NFT. Only 1,000 available. Each comes with exclusive game powers.',
    cta: 'MINT NOW',
    color: '#FF6B6B'
  },
  {
    id: 3,
    type: 'merch',
    title: '🛍️ OFFICIAL DBA MERCH',
    subtitle: 'Show Your Superhero Pride',
    content: 'Neo Tokio inspired jackets, hoodies, and accessories. Limited edition drops from each team.',
    cta: 'SHOP NOW',
    color: '#8A2BE2'
  },
  {
    id: 4,
    type: 'staking',
    title: '💎 STAKE YOUR SUPERHEROES',
    subtitle: 'Earn Exclusive Rewards',
    content: 'Stake your player NFTs to earn game tokens and compete in special tournaments.',
    cta: 'START STAKING',
    color: '#32CD32'
  },
  {
    id: 5,
    type: 'partner',
    title: '🤝 PARTNER PROGRAM',
    subtitle: 'Join Neo Tokio League',
    content: 'Create your own DBA team. Earn revenue from trades, tournaments, and sponsorships.',
    cta: 'APPLY NOW',
    color: '#0070FF'
  }
];

const AdBox: React.FC = () => {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ADS_CONTENT.length);
    }, 8000); // Change ad every 8 seconds

    return () => clearInterval(interval);
  }, []);

  const currentAd = ADS_CONTENT[currentAdIndex];

  const handleAdClick = () => {
    console.log(`Clicked ad: ${currentAd.title}`);
    // Handle ad interaction (redirect to upgrade page, etc.)
  };

  return (
    <div className="ad-box" onClick={handleAdClick}>
      {/* Ad Navigation Dots */}
      <div className="ad-dots">
        {ADS_CONTENT.map((_, index) => (
          <div
            key={index}
            className={`ad-dot ${index === currentAdIndex ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentAdIndex(index);
            }}
          />
        ))}
      </div>

      {/* Ad Content */}
      <div
        className="ad-content"
        style={{
          background: `linear-gradient(135deg, ${currentAd.color}15, ${currentAd.color}30)`,
          border: `1px solid ${currentAd.color}`
        }}
      >
        <div className="ad-header">
          <h4 style={{ color: currentAd.color }}>{currentAd.title}</h4>
        </div>

        <div className="ad-body">
          <h5>{currentAd.subtitle}</h5>
          <p>{currentAd.content}</p>
        </div>

        <div className="ad-cta">
          <button
            className="cta-button"
            style={{
              backgroundColor: currentAd.color,
              border: `2px solid ${currentAd.color}`
            }}
          >
            {currentAd.cta}
          </button>
        </div>
      </div>

      {/* Ad Footer */}
      <div className="ad-footer">
        <span className="ad-counter">
          {currentAdIndex + 1} / {ADS_CONTENT.length}
        </span>
        <span className="ad-label">SPONSORED</span>
      </div>
    </div>
  );
};

export default AdBox;

export {}; // Make this a module
