import React, { useState, useMemo } from 'react';
import type { ReadingRecord, CardStats } from '../types';
import { TAROT_CARDS, MAJOR_ARCANA_NAMES } from '../data/tarotData';

interface YourCardsProps {
  history: ReadingRecord[];
  cardNotes: Record<string, string>;
  cardResonance: Record<string, 'love' | 'neutral' | 'shadow'>;
  onSaveNote: (cardName: string, note: string) => void;
  onSetResonance: (cardName: string, resonance: 'love' | 'neutral' | 'shadow') => void;
  onBack: () => void;
}

type FilterType = 'all' | 'major' | 'wands' | 'cups' | 'swords' | 'pentacles' | 'drawn';
type SortType = 'name' | 'frequency' | 'recent';

const YourCards: React.FC<YourCardsProps> = ({ 
  history, 
  cardNotes, 
  cardResonance,
  onSaveNote, 
  onSetResonance,
  onBack 
}) => {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  const [filter, setFilter] = useState<FilterType>('drawn');
  const [sort, setSort] = useState<SortType>('frequency');
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate stats for all cards
  const cardStats = useMemo(() => {
    const stats: Record<string, CardStats> = {};
    
    history.forEach(record => {
      record.drawnCards.forEach(drawn => {
        if (!stats[drawn.cardName]) {
          stats[drawn.cardName] = {
            cardName: drawn.cardName,
            timesDrawn: 0,
            timesUpright: 0,
            timesReversed: 0,
            lastDrawn: record.date,
            positions: [],
          };
        }
        stats[drawn.cardName].timesDrawn++;
        if (drawn.orientation === 'upright') {
          stats[drawn.cardName].timesUpright++;
        } else {
          stats[drawn.cardName].timesReversed++;
        }
        if (!stats[drawn.cardName].positions.includes(drawn.position)) {
          stats[drawn.cardName].positions.push(drawn.position);
        }
        // Update last drawn if more recent
        if (new Date(record.date) > new Date(stats[drawn.cardName].lastDrawn)) {
          stats[drawn.cardName].lastDrawn = record.date;
        }
      });
    });
    
    return stats;
  }, [history]);

  // Filter and sort cards
  const displayCards = useMemo(() => {
    let cards = TAROT_CARDS.map(c => c.name);
    
    // Apply filter
    switch (filter) {
      case 'major':
        cards = cards.filter(name => MAJOR_ARCANA_NAMES.includes(name));
        break;
      case 'wands':
        cards = cards.filter(name => name.includes('Wands'));
        break;
      case 'cups':
        cards = cards.filter(name => name.includes('Cups'));
        break;
      case 'swords':
        cards = cards.filter(name => name.includes('Swords'));
        break;
      case 'pentacles':
        cards = cards.filter(name => name.includes('Pentacles'));
        break;
      case 'drawn':
        cards = cards.filter(name => cardStats[name]?.timesDrawn > 0);
        break;
    }
    
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      cards = cards.filter(name => name.toLowerCase().includes(query));
    }
    
    // Apply sort
    switch (sort) {
      case 'frequency':
        cards.sort((a, b) => (cardStats[b]?.timesDrawn || 0) - (cardStats[a]?.timesDrawn || 0));
        break;
      case 'recent':
        cards.sort((a, b) => {
          const dateA = cardStats[a]?.lastDrawn ? new Date(cardStats[a].lastDrawn).getTime() : 0;
          const dateB = cardStats[b]?.lastDrawn ? new Date(cardStats[b].lastDrawn).getTime() : 0;
          return dateB - dateA;
        });
        break;
      case 'name':
        cards.sort((a, b) => a.localeCompare(b));
        break;
    }
    
    return cards;
  }, [filter, sort, searchQuery, cardStats]);

  const handleOpenCard = (cardName: string) => {
    setSelectedCard(cardName);
    setNoteText(cardNotes[cardName] || '');
  };

  const handleSaveNote = () => {
    if (selectedCard) {
      onSaveNote(selectedCard, noteText);
    }
  };

  const selectedCardData = selectedCard ? TAROT_CARDS.find(c => c.name === selectedCard) : null;
  const selectedCardStats = selectedCard ? cardStats[selectedCard] : null;

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <button 
            onClick={onBack}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors mb-2 text-sm"
          >
            ← Back to Profile
          </button>
          <h2 className="font-serif-display text-3xl text-gray-900 dark:text-gray-100">
            Your Cards
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {Object.keys(cardStats).length} of 78 cards discovered
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search cards..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          {(['drawn', 'all', 'major', 'wands', 'cups', 'swords', 'pentacles'] as FilterType[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors ${
                filter === f
                  ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {f === 'drawn' ? 'Your Cards' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div className="flex gap-4 mb-6 text-sm">
        <span className="text-gray-500 dark:text-gray-400">Sort by:</span>
        {(['frequency', 'recent', 'name'] as SortType[]).map(s => (
          <button
            key={s}
            onClick={() => setSort(s)}
            className={`transition-colors ${
              sort === s
                ? 'text-gray-900 dark:text-gray-100 font-medium'
                : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
            }`}
          >
            {s === 'frequency' ? 'Most Drawn' : s === 'recent' ? 'Recently Seen' : 'Name'}
          </button>
        ))}
      </div>

      {/* Card Grid */}
      {displayCards.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 mb-2">
            {filter === 'drawn' ? 'No cards drawn yet' : 'No cards match your search'}
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            {filter === 'drawn' && 'Start a reading to discover which cards find you'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {displayCards.map(cardName => {
            const stats = cardStats[cardName];
            const hasNote = !!cardNotes[cardName];
            const resonance = cardResonance[cardName];
            
            return (
              <button
                key={cardName}
                onClick={() => handleOpenCard(cardName)}
                className={`group relative p-4 rounded-xl border transition-all hover:shadow-lg hover:-translate-y-1 text-left ${
                  stats?.timesDrawn
                    ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                    : 'bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-800 opacity-60'
                }`}
              >
                {/* Resonance indicator */}
                {resonance && (
                  <div className="absolute top-2 right-2">
                    {resonance === 'love' && <span className="text-red-400">♥</span>}
                    {resonance === 'shadow' && <span className="text-purple-400">☽</span>}
                  </div>
                )}
                
                {/* Card visual placeholder */}
                <div className="aspect-[2/3] mb-3 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                  <span className="text-2xl opacity-50">
                    {MAJOR_ARCANA_NAMES.includes(cardName) ? '✦' : '◇'}
                  </span>
                </div>
                
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {cardName}
                </h3>
                
                {stats?.timesDrawn ? (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {stats.timesDrawn}× drawn
                  </p>
                ) : (
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Not yet drawn
                  </p>
                )}
                
                {hasNote && (
                  <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Card Detail Modal */}
      {selectedCard && selectedCardData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedCard(null)}>
          <div 
            className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="font-serif-display text-2xl text-gray-900 dark:text-gray-100">
                    {selectedCard}
                  </h3>
                  {selectedCardStats && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Drawn {selectedCardStats.timesDrawn} time{selectedCardStats.timesDrawn !== 1 ? 's' : ''} 
                      ({selectedCardStats.timesUpright} upright, {selectedCardStats.timesReversed} reversed)
                    </p>
                  )}
                </div>
                <button 
                  onClick={() => setSelectedCard(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              </div>

              {/* Resonance */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  How does this card feel to you?
                </label>
                <div className="flex gap-2">
                  {(['love', 'neutral', 'shadow'] as const).map(r => (
                    <button
                      key={r}
                      onClick={() => onSetResonance(selectedCard, r)}
                      className={`flex-1 py-2 px-3 rounded-lg border text-sm transition-colors ${
                        cardResonance[selectedCard] === r
                          ? r === 'love' 
                            ? 'border-red-300 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                            : r === 'shadow'
                            ? 'border-purple-300 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                            : 'border-gray-300 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                          : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      {r === 'love' && '♥ Love'}
                      {r === 'neutral' && '○ Neutral'}
                      {r === 'shadow' && '☽ Shadow'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Keywords */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Traditional Keywords
                </label>
                <div className="flex flex-wrap gap-2">
                  {selectedCardData.keywords.map(kw => (
                    <span key={kw} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm text-gray-600 dark:text-gray-300">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Traditional Meaning */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Traditional Meaning
                </label>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {selectedCardData.meaning}
                </p>
              </div>

              {/* Personal Note */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Personal Meaning
                </label>
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="What does this card mean to YOU? What memories, feelings, or insights does it evoke?"
                  rows={4}
                  className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-gray-400 focus:outline-none resize-none placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>

              {/* Stats */}
              {selectedCardStats && (
                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Your History with this Card
                  </label>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Last drawn:</span>
                      <span className="ml-2 text-gray-900 dark:text-gray-100">
                        {new Date(selectedCardStats.lastDrawn).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Positions:</span>
                      <span className="ml-2 text-gray-900 dark:text-gray-100">
                        {selectedCardStats.positions.slice(0, 3).join(', ')}
                        {selectedCardStats.positions.length > 3 && '...'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedCard(null)}
                  className="flex-1 py-3 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleSaveNote();
                    setSelectedCard(null);
                  }}
                  className="flex-1 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-xl hover:bg-gray-700 dark:hover:bg-gray-300 transition-colors"
                >
                  Save Note
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default YourCards;
