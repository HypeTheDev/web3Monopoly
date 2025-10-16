import React, { useState, useEffect } from 'react';
import { DBALoreEntry } from '../types/GameTypes';

interface DBALoreProps {
  isVisible: boolean;
  onClose: () => void;
  loreEntries: DBALoreEntry[];
  onDiscoverLore?: (loreId: string) => void;
}

const DBALore: React.FC<DBALoreProps> = ({
  isVisible,
  onClose,
  loreEntries,
  onDiscoverLore
}) => {
  const [selectedEntry, setSelectedEntry] = useState<DBALoreEntry | null>(null);
  const [filterType, setFilterType] = useState<DBALoreEntry['type'] | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isVisible && loreEntries.length > 0 && !selectedEntry) {
      setSelectedEntry(loreEntries[0]);
    }
  }, [isVisible, loreEntries, selectedEntry]);

  if (!isVisible) return null;

  const filteredEntries = loreEntries.filter(entry => {
    const matchesType = filterType === 'all' || entry.type === filterType;
    const matchesSearch = entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getRarityColor = (rarity: DBALoreEntry['rarity']) => {
    switch (rarity) {
      case 'legendary': return '#FFD700';
      case 'rare': return '#0070FF';
      case 'uncommon': return '#1EFF00';
      case 'common': return '#9D9D9D';
      default: return '#FFFFFF';
    }
  };

  const getTypeIcon = (type: DBALoreEntry['type']) => {
    switch (type) {
      case 'player': return '🏀';
      case 'environment': return '🏟️';
      case 'enemy': return '👹';
      case 'creature': return '🐾';
      case 'artifact': return '💎';
      case 'event': return '📜';
      default: return '📚';
    }
  };

  const getTypeColor = (type: DBALoreEntry['type']) => {
    switch (type) {
      case 'player': return 'var(--primary-color)';
      case 'environment': return 'var(--secondary-color)';
      case 'enemy': return 'var(--danger-color)';
      case 'creature': return 'var(--info-color)';
      case 'artifact': return 'var(--accent-color)';
      case 'event': return 'var(--warning-color)';
      default: return 'var(--text-color)';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'var(--panel-color)',
        border: '2px solid var(--primary-color)',
        borderRadius: '8px',
        width: '90%',
        maxWidth: '1000px',
        maxHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 0 30px var(--primary-color)40'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-color)',
          backgroundColor: 'var(--background-color)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '1.5rem' }}>📚</span>
            <h2 style={{ margin: 0, color: 'var(--primary-color)' }}>DBA LORE DATABASE</h2>
          </div>
          <button
            onClick={onClose}
            style={{
              backgroundColor: 'transparent',
              color: 'var(--primary-color)',
              border: '1px solid var(--primary-color)',
              borderRadius: '4px',
              padding: '6px 12px',
              cursor: 'pointer',
              fontFamily: 'var(--font-family)',
              fontSize: '0.8rem'
            }}
          >
            ✕ CLOSE
          </button>
        </div>

        {/* Controls */}
        <div style={{
          display: 'flex',
          gap: '12px',
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-color)',
          backgroundColor: 'var(--background-color)',
          flexWrap: 'wrap'
        }}>
          {/* Search */}
          <input
            type="text"
            placeholder="Search lore entries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              backgroundColor: 'var(--panel-color)',
              color: 'var(--primary-color)',
              border: '1px solid var(--border-color)',
              borderRadius: '4px',
              padding: '8px 12px',
              fontFamily: 'var(--font-family)',
              fontSize: '0.8rem',
              flex: '1',
              minWidth: '200px'
            }}
          />

          {/* Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            style={{
              backgroundColor: 'var(--panel-color)',
              color: 'var(--primary-color)',
              border: '1px solid var(--border-color)',
              borderRadius: '4px',
              padding: '8px 12px',
              fontFamily: 'var(--font-family)',
              fontSize: '0.8rem'
            }}
          >
            <option value="all">All Types</option>
            <option value="player">Players</option>
            <option value="environment">Environments</option>
            <option value="enemy">Enemies</option>
            <option value="creature">Creatures</option>
            <option value="artifact">Artifacts</option>
            <option value="event">Events</option>
          </select>

          {/* Stats */}
          <div style={{
            color: 'var(--text-color)',
            fontSize: '0.8rem',
            display: 'flex',
            gap: '16px'
          }}>
            <span>Total: {loreEntries.length}</span>
            <span>Discovered: {loreEntries.filter(e => e.discovered).length}</span>
            <span>Filtered: {filteredEntries.length}</span>
          </div>
        </div>

        {/* Content */}
        <div style={{
          display: 'flex',
          flex: 1,
          overflow: 'hidden'
        }}>
          {/* Lore List */}
          <div style={{
            width: '300px',
            backgroundColor: 'var(--background-color)',
            borderRight: '1px solid var(--border-color)',
            overflowY: 'auto',
            padding: '12px'
          }}>
            {filteredEntries.length === 0 ? (
              <div style={{
                color: 'var(--text-color)',
                textAlign: 'center',
                padding: '20px',
                fontStyle: 'italic'
              }}>
                No lore entries found
              </div>
            ) : (
              filteredEntries.map(entry => (
                <div
                  key={entry.id}
                  onClick={() => setSelectedEntry(entry)}
                  style={{
                    padding: '12px',
                    marginBottom: '8px',
                    backgroundColor: selectedEntry?.id === entry.id ? 'var(--panel-color)' : 'transparent',
                    border: `1px solid ${selectedEntry?.id === entry.id ? getTypeColor(entry.type) : 'var(--border-color)'}`,
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    opacity: entry.discovered ? 1 : 0.6
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '4px'
                  }}>
                    <span style={{ fontSize: '1.2rem' }}>{getTypeIcon(entry.type)}</span>
                    <span style={{
                      fontWeight: 'bold',
                      color: getRarityColor(entry.rarity),
                      fontSize: '0.9rem'
                    }}>
                      {entry.name}
                    </span>
                    {!entry.discovered && (
                      <span style={{ color: 'var(--warning-color)', fontSize: '0.7rem' }}>🔒</span>
                    )}
                  </div>
                  <div style={{
                    color: 'var(--text-color)',
                    fontSize: '0.8rem',
                    lineHeight: '1.3'
                  }}>
                    {entry.description}
                  </div>
                  <div style={{
                    marginTop: '6px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{
                      color: getTypeColor(entry.type),
                      fontSize: '0.7rem',
                      textTransform: 'uppercase'
                    }}>
                      {entry.category}
                    </span>
                    <span style={{
                      color: getRarityColor(entry.rarity),
                      fontSize: '0.7rem',
                      textTransform: 'uppercase'
                    }}>
                      {entry.rarity}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Lore Details */}
          <div style={{
            flex: 1,
            padding: '20px',
            overflowY: 'auto',
            backgroundColor: 'var(--panel-color)'
          }}>
            {selectedEntry ? (
              <>
                {/* Entry Header */}
                <div style={{
                  marginBottom: '20px',
                  paddingBottom: '16px',
                  borderBottom: '1px solid var(--border-color)'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '8px'
                  }}>
                    <span style={{ fontSize: '2rem' }}>{getTypeIcon(selectedEntry.type)}</span>
                    <div>
                      <h3 style={{
                        margin: 0,
                        color: getRarityColor(selectedEntry.rarity),
                        fontSize: '1.5rem'
                      }}>
                        {selectedEntry.name}
                      </h3>
                      <div style={{
                        display: 'flex',
                        gap: '12px',
                        marginTop: '4px'
                      }}>
                        <span style={{
                          color: getTypeColor(selectedEntry.type),
                          fontSize: '0.8rem',
                          textTransform: 'uppercase'
                        }}>
                          {selectedEntry.category}
                        </span>
                        <span style={{
                          color: getRarityColor(selectedEntry.rarity),
                          fontSize: '0.8rem',
                          textTransform: 'uppercase'
                        }}>
                          {selectedEntry.rarity}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p style={{
                    color: 'var(--text-color)',
                    fontSize: '1rem',
                    lineHeight: '1.5',
                    margin: 0
                  }}>
                    {selectedEntry.description}
                  </p>
                </div>

                {/* Entry Details */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '20px',
                  marginBottom: '20px'
                }}>
                  {/* Left Column */}
                  <div>
                    {selectedEntry.details.backstory && (
                      <div style={{ marginBottom: '16px' }}>
                        <h4 style={{ color: 'var(--primary-color)', marginBottom: '8px' }}>📜 Backstory</h4>
                        <p style={{
                          color: 'var(--text-color)',
                          fontSize: '0.9rem',
                          lineHeight: '1.4'
                        }}>
                          {selectedEntry.details.backstory}
                        </p>
                      </div>
                    )}

                    {selectedEntry.details.location && (
                      <div style={{ marginBottom: '16px' }}>
                        <h4 style={{ color: 'var(--primary-color)', marginBottom: '8px' }}>📍 Location</h4>
                        <p style={{
                          color: 'var(--text-color)',
                          fontSize: '0.9rem'
                        }}>
                          {selectedEntry.details.location}
                        </p>
                      </div>
                    )}

                    {selectedEntry.details.significance && (
                      <div style={{ marginBottom: '16px' }}>
                        <h4 style={{ color: 'var(--primary-color)', marginBottom: '8px' }}>⭐ Significance</h4>
                        <p style={{
                          color: 'var(--text-color)',
                          fontSize: '0.9rem'
                        }}>
                          {selectedEntry.details.significance}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right Column */}
                  <div>
                    {selectedEntry.details.abilities && selectedEntry.details.abilities.length > 0 && (
                      <div style={{ marginBottom: '16px' }}>
                        <h4 style={{ color: 'var(--primary-color)', marginBottom: '8px' }}>⚡ Abilities</h4>
                        <ul style={{
                          color: 'var(--text-color)',
                          fontSize: '0.9rem',
                          paddingLeft: '20px'
                        }}>
                          {selectedEntry.details.abilities.map((ability, index) => (
                            <li key={index}>{ability}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedEntry.details.weaknesses && selectedEntry.details.weaknesses.length > 0 && (
                      <div style={{ marginBottom: '16px' }}>
                        <h4 style={{ color: 'var(--danger-color)', marginBottom: '8px' }}>⚠️ Weaknesses</h4>
                        <ul style={{
                          color: 'var(--text-color)',
                          fontSize: '0.9rem',
                          paddingLeft: '20px'
                        }}>
                          {selectedEntry.details.weaknesses.map((weakness, index) => (
                            <li key={index}>{weakness}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedEntry.details.relatedEntries && selectedEntry.details.relatedEntries.length > 0 && (
                      <div style={{ marginBottom: '16px' }}>
                        <h4 style={{ color: 'var(--primary-color)', marginBottom: '8px' }}>🔗 Related Entries</h4>
                        <div style={{
                          display: 'flex',
                          gap: '8px',
                          flexWrap: 'wrap'
                        }}>
                          {selectedEntry.details.relatedEntries.map((relatedId, index) => {
                            const relatedEntry = loreEntries.find(e => e.id === relatedId);
                            return relatedEntry ? (
                              <span
                                key={index}
                                onClick={() => setSelectedEntry(relatedEntry)}
                                style={{
                                  backgroundColor: 'var(--background-color)',
                                  color: getTypeColor(relatedEntry.type),
                                  padding: '4px 8px',
                                  borderRadius: '4px',
                                  fontSize: '0.8rem',
                                  cursor: 'pointer',
                                  border: `1px solid ${getTypeColor(relatedEntry.type)}`
                                }}
                              >
                                {relatedEntry.name}
                              </span>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Discovery Status */}
                <div style={{
                  backgroundColor: 'var(--background-color)',
                  border: `1px solid ${selectedEntry.discovered ? 'var(--success-color)' : 'var(--warning-color)'}`,
                  borderRadius: '6px',
                  padding: '12px',
                  textAlign: 'center'
                }}>
                  <div style={{
                    color: selectedEntry.discovered ? 'var(--success-color)' : 'var(--warning-color)',
                    fontSize: '0.9rem',
                    marginBottom: '8px'
                  }}>
                    {selectedEntry.discovered ? '✅ DISCOVERED' : '🔒 LOCKED'}
                  </div>
                  {!selectedEntry.discovered && onDiscoverLore && (
                    <button
                      onClick={() => onDiscoverLore(selectedEntry.id)}
                      style={{
                        backgroundColor: 'var(--warning-color)',
                        color: 'var(--background-color)',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '6px 12px',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-family)',
                        fontSize: '0.8rem'
                      }}
                    >
                      🔓 DISCOVER
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div style={{
                color: 'var(--text-color)',
                textAlign: 'center',
                padding: '40px',
                fontStyle: 'italic'
              }}>
                Select a lore entry to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DBALore;
