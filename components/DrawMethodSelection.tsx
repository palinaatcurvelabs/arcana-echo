

import React from 'react';
import type { Deck } from '../types';

interface DrawMethodSelectionProps {
  onSelect: (method: 'physical' | 'digital') => void;
  currentDeck: Deck;
}

const DrawMethodSelection: React.FC<DrawMethodSelectionProps> = ({ onSelect, currentDeck }) => {
  return (
    <div className="w-full max-w-2xl mx-auto p-4 md:p-8 text-center animate-fade-in">
      <h2 className="font-serif-display text-3xl text-gray-900 dark:text-gray-100 mb-4">
        How would you like to draw your cards?
      </h2>
      <p className="text-gray-500 dark:text-gray-400 mb-10">
        Choose to use your physical deck or let Arcana draw for you.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Physical Deck Option */}
        <button
          onClick={() => onSelect('physical')}
          className="p-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-left hover:shadow-xl hover:-translate-y-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-gray-400"
        >
          <div className="flex justify-between items-start">
            <h3 className="font-serif-display text-2xl text-gray-900 dark:text-gray-100">Use My Own Deck</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-3">Shuffle your physical tarot deck and draw the cards yourself for a tactile, personal connection to your reading.</p>
        </button>

        {/* Digital Draw Option */}
        <button
          onClick={() => onSelect('digital')}
          className="p-8 bg-gray-900 dark:bg-gray-700 text-white border border-gray-700 dark:border-gray-600 rounded-lg text-left hover:shadow-xl hover:-translate-y-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white dark:focus:ring-gray-500"
        >
          <h3 className="font-serif-display text-2xl">Draw Cards Digitally</h3>
          <p className="text-gray-300 mt-3">Let the digital ether shuffle and present your cards. Perfect for quick readings or when you don't have your deck handy.</p>
        </button>
      </div>
    </div>
  );
};

export default DrawMethodSelection;
