import React from 'react';
import type { Spread } from '../types';

interface SpreadSelectionProps {
  spreads: Spread[];
  onSelect: (spread: Spread) => void;
}

const SpreadSelection: React.FC<SpreadSelectionProps> = ({ spreads, onSelect }) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8 text-center animate-fade-in">
      <h2 className="font-serif-brand text-3xl text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-2">
        Choose Your Path
      </h2>
      <p className="text-gray-500 dark:text-gray-400 mb-10">The ether has responded to your energy with these potential avenues of insight.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {spreads.map((spread, index) => (
          <div
            key={index}
            className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-[#1c1c1c] p-6 rounded-lg flex flex-col text-left hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            onClick={() => onSelect(spread)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && onSelect(spread)}
          >
            <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-widest">{spread.theme}</p>
            <h3 className="text-2xl font-serif-display text-gray-900 dark:text-gray-100 mt-1">{spread.spreadName}</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-3 text-sm flex-grow">{spread.description}</p>
            <div className="text-right mt-4 text-xs font-semibold text-gray-400 dark:text-gray-500">
              {spread.numberOfCards} CARDS
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpreadSelection;
