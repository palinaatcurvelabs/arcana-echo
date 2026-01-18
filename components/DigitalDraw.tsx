
import React, { useState, useMemo } from 'react';
import type { Spread, DrawnCard, Deck } from '../types';
import { TAROT_CARDS } from '../data/tarotData';
import { CardVisual, CardBack } from './CardVisuals';

interface DigitalDrawProps {
  spread: Spread;
  onSubmit: (cards: DrawnCard[]) => void;
  isLoading: boolean;
  currentDeck: Deck;
}

const DigitalDraw: React.FC<DigitalDrawProps> = ({ spread, onSubmit, isLoading, currentDeck }) => {
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);

  const availableCards = useMemo(() => {
    const drawnNames = new Set(drawnCards.map(c => c.cardName));
    return TAROT_CARDS.filter(card => !drawnNames.has(card.name));
  }, [drawnCards]);

  const cardsLeftToDraw = spread.numberOfCards - drawnCards.length;
  const isDrawComplete = cardsLeftToDraw === 0;

  const handleDrawCard = () => {
    if (cardsLeftToDraw <= 0 || availableCards.length === 0) return;
    
    setIsDrawing(true);

    setTimeout(async () => {
        const randomIndex = Math.floor(Math.random() * availableCards.length);
        const card = availableCards[randomIndex];
        const orientation = Math.random() < 0.3 ? 'reversed' : 'upright'; // 30% chance of reversed
        const newCard: DrawnCard = {
            position: spread.positions[drawnCards.length],
            cardName: card.name,
            orientation: orientation,
        };
        
        setDrawnCards(prev => [...prev, newCard]);
        setIsDrawing(false);
    }, 500); // simulate drawing
  };

  const handleSubmit = () => {
    if (isDrawComplete && !isLoading) {
      onSubmit(drawnCards);
    }
  };

  // Dynamic Grid Configuration based on card count to maximize size
  // Updated to be ~80% of previous size by restricting max-widths
  const getGridConfig = (count: number) => {
      if (count === 1) return "grid-cols-1 max-w-xs"; // Was max-w-sm
      if (count === 2) return "grid-cols-2 max-w-lg"; // Was max-w-2xl
      if (count === 3) return "grid-cols-1 sm:grid-cols-3 max-w-4xl"; // Was max-w-5xl
      if (count === 4) return "grid-cols-2 lg:grid-cols-4 max-w-5xl"; // Was max-w-6xl
      // 5+ cards
      return "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-6xl"; // Was max-w-7xl
  };

  return (
    <div className="w-full mx-auto p-4 md:p-8 animate-fade-in">
      <div className="text-center mb-10 max-w-4xl mx-auto">
        <h2 className="font-serif-display text-3xl text-gray-900 dark:text-gray-100 mb-2">{spread.spreadName}</h2>
        <p className="text-gray-500 dark:text-gray-400">{spread.description}</p>
        {currentDeck.isCustom && <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Using Deck: {currentDeck.name}</p>}
      </div>

      <div className={`grid gap-6 md:gap-8 mx-auto justify-items-center ${getGridConfig(spread.numberOfCards)}`}>
        {spread.positions.map((position, index) => {
          const card = drawnCards[index];

          return (
            <div key={index} className="w-full aspect-[2/3] flex flex-col items-center relative group">
              {card ? (
                <div className="w-full h-full animate-fade-in shadow-xl rounded-lg">
                    <CardVisual cardName={card.cardName} deck={currentDeck} isReversed={card.orientation === 'reversed'} />
                </div>
              ) : (
                <div className="w-full h-full animate-fade-in shadow-lg rounded-lg">
                   <CardBack deck={currentDeck} position={position} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="text-center mt-12 mb-8">
        {isDrawComplete ? (
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-10 py-4 text-lg bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 font-medium rounded-lg hover:bg-gray-700 dark:hover:bg-gray-300 disabled:bg-gray-300 dark:disabled:bg-gray-700 transition-all duration-300 shadow-xl transform hover:-translate-y-1"
          >
            {isLoading ? 'Interpreting...' : 'Read My Cards'}
          </button>
        ) : (
          <button
            onClick={handleDrawCard}
            disabled={isDrawing}
            className="px-10 py-4 text-lg bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 font-medium rounded-lg hover:bg-gray-700 dark:hover:bg-gray-300 disabled:bg-gray-400 dark:disabled:bg-gray-600 transition-all duration-300 shadow-xl transform hover:-translate-y-1"
          >
            {isDrawing ? 'Drawing...' : `Draw Card (${cardsLeftToDraw} left)`}
          </button>
        )}
      </div>
    </div>
  );
};

export default DigitalDraw;
