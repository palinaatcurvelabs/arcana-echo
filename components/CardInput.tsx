import React, { useState, useEffect, useMemo } from 'react';
import type { Spread, DrawnCard, Deck } from '../types';
import { TAROT_CARDS } from '../data/tarotData';

interface CardInputProps {
  spread: Spread;
  onSubmit: (cards: DrawnCard[]) => void;
  isLoading: boolean;
  currentDeck?: Deck;
}

// Validation Icon Components
const CheckIcon = () => (
  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
    <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  </div>
);

const ErrorIcon = () => (
  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
    <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
    </svg>
  </div>
);


const CardInput: React.FC<CardInputProps> = ({ spread, onSubmit, isLoading, currentDeck }) => {
  const initialDrawnCards = useMemo(() => spread.positions.map(pos => ({ position: pos, cardName: '', orientation: 'upright' as const })), [spread.positions]);
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>(initialDrawnCards);
  
  const [activeInput, setActiveInput] = useState<number | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [allValid, setAllValid] = useState(false);

  const validCardNames = useMemo(() => new Set(TAROT_CARDS.map(c => c.name)), []);
  const [validationStatus, setValidationStatus] = useState<Array<'valid' | 'invalid' | 'idle'>>(() => spread.positions.map(() => 'idle'));
  
  // Reset state if spread changes
  useEffect(() => {
    setDrawnCards(initialDrawnCards);
  }, [initialDrawnCards]);

  useEffect(() => {
    const newValidationStatus = drawnCards.map(card => {
        if (card.cardName.trim() === '') return 'idle';
        return validCardNames.has(card.cardName) ? 'valid' : 'invalid';
    });
    setValidationStatus(newValidationStatus);
    setAllValid(newValidationStatus.every(status => status === 'valid'));
  }, [drawnCards, validCardNames]);

  const handleInputChange = (index: number, value: string) => {
    const updatedCards = [...drawnCards];
    updatedCards[index] = { ...updatedCards[index], cardName: value };
    setDrawnCards(updatedCards);

    if (value) {
      const filteredSuggestions = TAROT_CARDS
        .map(c => c.name)
        .filter(name => name.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 5);
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleOrientationChange = (index: number, isReversed: boolean) => {
    const updatedCards = [...drawnCards];
    updatedCards[index] = { ...updatedCards[index], orientation: isReversed ? 'reversed' : 'upright' };
    setDrawnCards(updatedCards);
  };

  const handleSuggestionClick = (index: number, cardName: string) => {
    const updatedCards = [...drawnCards];
    updatedCards[index] = { ...updatedCards[index], cardName };
    setDrawnCards(updatedCards);
    setSuggestions([]);
    setActiveInput(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (allValid && !isLoading) {
      onSubmit(drawnCards);
    }
  };

  const getInputClass = (status: 'valid' | 'invalid' | 'idle') => {
    let baseClass = "w-full p-3 pr-10 bg-white dark:bg-[#111111] border rounded-lg text-gray-800 dark:text-gray-100 focus:outline-none transition-all duration-300";
    switch (status) {
        case 'valid':
            return `${baseClass} border-green-500 focus:ring-2 focus:ring-green-300`;
        case 'invalid':
            return `${baseClass} border-red-500 focus:ring-2 focus:ring-red-300`;
        default:
            return `${baseClass} border-gray-300 dark:border-[#1c1c1c] focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500`;
    }
  };

  const renderSuggestion = (suggestion: string, value: string) => {
    const lowerSuggestion = suggestion.toLowerCase();
    const lowerValue = value.toLowerCase();
    const index = lowerSuggestion.indexOf(lowerValue);

    if (index === -1 || !value) {
        return <span>{suggestion}</span>;
    }

    const before = suggestion.substring(0, index);
    const match = suggestion.substring(index, index + value.length);
    const after = suggestion.substring(index + value.length);

    return (
        <span>
            {before}
            <strong className="font-bold text-gray-900 dark:text-white">{match}</strong>
            {after}
        </span>
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 md:p-8 animate-fade-in">
      <h2 className="font-serif-display text-3xl text-gray-900 dark:text-gray-100 text-center mb-2">
        Record Your Draw
      </h2>
      {currentDeck?.isCustom && (
          <p className="text-center text-gray-500 dark:text-gray-400 mb-6 text-sm">
              Enter standard card names. They will be interpreted as cards from the <strong>{currentDeck.name}</strong> deck.
          </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        {spread.positions.map((position, index) => (
          <div key={`${spread.spreadName}-${index}`}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1">
              {position}
            </label>
            <div className="relative">
                <input
                    type="text"
                    value={drawnCards[index]?.cardName || ''}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onFocus={() => setActiveInput(index)}
                    onBlur={() => setTimeout(() => { if (activeInput === index) setActiveInput(null); }, 200)}
                    placeholder="Type card name..."
                    className={getInputClass(validationStatus[index])}
                    autoComplete="off"
                />
                {validationStatus[index] === 'valid' && <CheckIcon />}
                {validationStatus[index] === 'invalid' && (drawnCards[index]?.cardName.length ?? 0) > 0 && <ErrorIcon />}
            </div>
            {activeInput === index && suggestions.length > 0 && (
              <ul className="absolute z-10 w-full mt-1 bg-white dark:bg-[#111111] border border-gray-200 dark:border-[#1c1c1c] rounded-md shadow-lg max-h-60 overflow-auto animate-fade-in" style={{animationDuration: '0.2s'}}>
                {suggestions.map((suggestion) => (
                  <li
                    key={suggestion}
                    // Use onMouseDown to prevent the input's onBlur from firing before the click is registered
                    onMouseDown={() => handleSuggestionClick(index, suggestion)}
                    className="p-3 text-gray-700 dark:text-gray-200 cursor-pointer hover:bg-gray-100 dark:hover:bg-[#222222] transition-colors duration-150"
                  >
                    {renderSuggestion(suggestion, drawnCards[index]?.cardName)}
                  </li>
                ))}
              </ul>
            )}
             <div className="mt-2 flex items-center justify-end">
                <label htmlFor={`reversed-${index}`} className="text-sm text-gray-700 dark:text-gray-300 mr-2 cursor-pointer">
                  Reversed
                </label>
                <input
                  type="checkbox"
                  id={`reversed-${index}`}
                  checked={drawnCards[index]?.orientation === 'reversed'}
                  onChange={(e) => handleOrientationChange(index, e.target.checked)}
                  className="h-4 w-4 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-[#252525] rounded focus:ring-gray-500 cursor-pointer"
                />
              </div>
          </div>
        ))}
        <div className="text-center mt-8">
          <button
            type="submit"
            disabled={!allValid || isLoading}
            className="px-8 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 font-medium rounded-lg hover:bg-gray-700 dark:hover:bg-gray-300 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed disabled:text-gray-500 dark:disabled:text-gray-500 transition-all duration-300 shadow-lg shadow-gray-500/10 hover:shadow-gray-500/20 transform hover:-translate-y-0.5"
          >
            {isLoading ? 'Interpreting...' : 'Read My Cards'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CardInput;