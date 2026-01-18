
import React, { useState } from 'react';
import type { Deck } from '../types';
import { TAROT_CARDS } from '../data/tarotData';
import { CardVisual } from './CardVisuals';

interface DeckLibraryProps {
  decks: Deck[];
  currentDeck: Deck;
  onSelectDeck: (deck: Deck) => void;
  onBack: () => void;
}

const DeckLibrary: React.FC<DeckLibraryProps> = ({ decks, currentDeck, onSelectDeck, onBack }) => {
  const [previewDeck, setPreviewDeck] = useState<Deck | null>(null);

  const handlePreview = (e: React.MouseEvent, deck: Deck) => {
    e.stopPropagation();
    setPreviewDeck(deck);
  };

  const closePreview = () => {
    setPreviewDeck(null);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8 animate-fade-in">
       <div className="flex justify-between items-center mb-8">
            <button onClick={onBack} className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">&larr; Back</button>
       </div>

       <h2 className="font-serif-brand text-3xl text-gray-900 dark:text-gray-100 uppercase tracking-wider text-center mb-2">
            Deck Library
       </h2>
       <p className="text-gray-500 dark:text-gray-400 text-center mb-10">Select a deck to shape the voice and imagery of your readings.</p>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {decks.map(deck => (
                <div 
                    key={deck.id}
                    className={`relative p-0 rounded-lg border overflow-hidden transition-all duration-300 cursor-pointer hover:shadow-lg hover:-translate-y-1 flex flex-col ${currentDeck.id === deck.id ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 border-transparent shadow-xl' : 'bg-white dark:bg-[#111111] border-gray-200 dark:border-[#1c1c1c] text-gray-900 dark:text-gray-100'}`}
                    onClick={() => onSelectDeck(deck)}
                >
                     {/* Simulating a cover visual if none exists, using specific CSS for Echo Deck */}
                     <div className={`w-full h-40 overflow-hidden relative ${deck.id === 'echo-deck' ? 'bg-black' : 'bg-gray-200'}`}>
                         {deck.id === 'echo-deck' ? (
                              <div className="absolute inset-0 opacity-60" style={{ 
                                backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`, 
                                backgroundSize: '4px 4px' 
                              }}></div>
                         ) : deck.coverImage ? (
                             <img src={deck.coverImage} alt={`${deck.name} cover`} className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
                         ) : (
                             <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-[#111111]">
                                 <span className="text-4xl">🎴</span>
                             </div>
                         )}
                         <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </div>

                    <div className="p-6 flex-grow flex flex-col">
                        {currentDeck.id === deck.id && (
                            <div className="absolute top-3 right-3 bg-green-500 text-white rounded-full p-1 shadow-md z-10">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        )}
                        <h3 className="font-serif-display text-2xl mb-1">{deck.name}</h3>
                        <p className={`text-sm mb-4 flex-grow ${currentDeck.id === deck.id ? 'text-gray-300 dark:text-gray-600' : 'text-gray-500 dark:text-gray-400'}`}>
                            {deck.description}
                        </p>
                        
                        <div className="mt-auto pt-4 border-t border-opacity-20 border-gray-500 flex justify-between items-center">
                            {deck.isCustom && (
                                <div className="text-xs">
                                    <span className="opacity-75 font-semibold">THEME: </span> {deck.theme}
                                </div>
                            )}
                            <button
                                onClick={(e) => handlePreview(e, deck)}
                                className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded border ${currentDeck.id === deck.id ? 'border-gray-800 dark:border-gray-200 hover:bg-gray-800 hover:text-white dark:hover:bg-gray-200 dark:hover:text-gray-900' : 'border-gray-300 dark:border-[#252525] hover:bg-gray-100 dark:hover:bg-[#222222]'}`}
                            >
                                Inspect Deck
                            </button>
                        </div>
                    </div>
                </div>
            ))}
       </div>

       {/* Preview Modal */}
       {previewDeck && (
           <div className="modal-overlay animate-fade-in" onClick={closePreview}>
               <div 
                 className="w-full max-w-6xl h-[90vh] bg-white dark:bg-[#0a0a0a] rounded-lg shadow-2xl flex flex-col overflow-hidden m-4"
                 onClick={(e) => e.stopPropagation()}
               >
                   <div className="p-4 border-b border-gray-200 dark:border-[#1c1c1c] flex justify-between items-center bg-white dark:bg-[#0a0a0a] z-10">
                       <h3 className="font-serif-brand text-2xl text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                           {previewDeck.name} <span className="text-gray-500 text-sm normal-case align-middle ml-2">({previewDeck.theme})</span>
                       </h3>
                       <button onClick={closePreview} className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white p-2">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                           </svg>
                       </button>
                   </div>
                   
                   <div className="flex-grow overflow-y-auto p-6 bg-gray-50 dark:bg-[#050505]">
                       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                           {TAROT_CARDS.map(card => (
                               <div key={card.name} className="flex flex-col items-center">
                                   <div className="w-full aspect-[2/3] transition-transform duration-300 hover:scale-105">
                                       <CardVisual cardName={card.name} deck={previewDeck} />
                                   </div>
                               </div>
                           ))}
                       </div>
                   </div>
               </div>
           </div>
       )}
    </div>
  );
};

export default DeckLibrary;
