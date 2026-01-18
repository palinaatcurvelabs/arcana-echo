
import React from 'react';
import type { Spread } from '../types';

interface SpreadSuggestionProps {
  spread: Spread;
  onProceed: () => void;
}

const SpreadSuggestion: React.FC<SpreadSuggestionProps> = ({ spread, onProceed }) => {
  return (
    <div className="w-full max-w-2xl mx-auto p-4 md:p-8 text-center animate-fade-in">
      <h2 className="font-serif-display text-3xl text-[#F3EFEA] mb-2">
        A Path is Suggested
      </h2>
      <p className="text-gray-400 mb-6">Based on your energy, the cards recommend the following spread.</p>

      <div className="bg-[#0f0f0f]/80 border border-[#1c1c1c] rounded-lg p-6 mb-8 text-left">
        <p className="text-sm text-yellow-400 uppercase tracking-widest">{spread.theme}</p>
        <h3 className="text-2xl font-serif-display text-white mt-1">{spread.spreadName}</h3>
        <p className="text-gray-300 mt-4">
          Please draw <span className="font-bold text-white">{spread.numberOfCards} cards</span> from your physical deck and place them in order for the following positions:
        </p>
        <ul className="list-disc list-inside mt-3 text-gray-300 space-y-1">
          {spread.positions.map((pos, index) => (
            <li key={index}><span className="font-semibold text-white">{pos}</span></li>
          ))}
        </ul>
      </div>

      <button
        onClick={onProceed}
        className="px-8 py-3 bg-[#D4AF37] text-gray-900 font-bold rounded-full hover:bg-yellow-500 transition-all duration-300 shadow-lg shadow-yellow-500/10 hover:shadow-yellow-500/20"
      >
        I Have Drawn My Cards
      </button>
    </div>
  );
};

export default SpreadSuggestion;
