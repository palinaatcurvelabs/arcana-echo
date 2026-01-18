import React, { useState, useEffect, useRef } from 'react';
import type { Reading, Deck } from '../types';
import { TAROT_CARDS } from '../data/tarotData';
import { generateSpokenReading } from '../services/geminiService';
import { decode, decodeAudioData } from '../utils/audioUtils';


interface ReadingDisplayProps {
  reading: Reading;
  onSetDailyTask: (task: string) => void;
  onReset: () => void;
  onFollowUpSubmit: (question: string) => Promise<void>;
  isFollowUpLoading: boolean;
  onClarifyCard: (cardIndex: number) => void;
  clarifyingCardIndex: number | null;
  deck: Deck;
}

const Separator = () => (
    <div className="flex items-center justify-center my-12" aria-hidden="true">
      <svg width="150" height="20" viewBox="0 0 150 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 10H60" className="stroke-gray-200 dark:stroke-gray-700" strokeWidth="1"/>
        <path d="M90 10H150" className="stroke-gray-200 dark:stroke-gray-700" strokeWidth="1"/>
        <g transform="translate(65 5)">
            <path d="M10 0 L7.5 7.5 L0 7.5 L6 12 L4 19 L10 15 L16 19 L14 12 L20 7.5 L12.5 7.5 Z" className="fill-gray-200 dark:fill-gray-700"/>
        </g>
      </svg>
    </div>
  );

const ReadingDisplay: React.FC<ReadingDisplayProps> = ({ reading, onSetDailyTask, onReset, onFollowUpSubmit, isFollowUpLoading, onClarifyCard, clarifyingCardIndex, deck }) => {
  const [followUpQuestion, setFollowUpQuestion] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [audioState, setAudioState] = useState<'idle' | 'loading' | 'playing' | 'error'>('idle');
  const [audioError, setAudioError] = useState('');
  
  // Refs for smooth scrolling and audio management
  const audioRef = useRef<{ context: AudioContext | null; source: AudioBufferSourceNode | null }>({ context: null, source: null });
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const followUpRef = useRef<HTMLElement | null>(null);
  const prevReadingRef = useRef<Reading | undefined>();

  // Effect to scroll to newly added content
  useEffect(() => {
    // Scroll to new clarification
    if (prevReadingRef.current && reading) {
      const newlyClarifiedIndex = reading.cardInterpretations.findIndex((card, index) => 
        card.clarification && !prevReadingRef.current?.cardInterpretations[index].clarification
      );

      if (newlyClarifiedIndex !== -1) {
        setTimeout(() => {
          cardRefs.current[newlyClarifiedIndex]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100); // Small delay to ensure render is complete
      }
    }

    // Scroll to new follow-up answer
    const prevConvoLength = prevReadingRef.current?.conversation?.length || 0;
    const currentConvoLength = reading?.conversation?.length || 0;
    if (currentConvoLength > prevConvoLength) {
      setTimeout(() => {
        followUpRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 100);
    }

    prevReadingRef.current = reading;
  }, [reading]);

  // Effect to clean up audio resources on component unmount
  useEffect(() => {
    // Scroll to top on initial mount
    window.scrollTo({ top: 0, behavior: 'smooth' });

    return () => {
      if (audioRef.current.source) {
        audioRef.current.source.stop();
      }
      if (audioRef.current.context) {
        audioRef.current.context.close().catch(console.error);
      }
    };
  }, []);

  const handlePlayReading = async () => {
    // Stop playback if already playing
    if (audioState === 'playing' && audioRef.current.source) {
      audioRef.current.source.stop();
      // onended will handle state reset and cleanup
      return;
    }

    setAudioState('loading');
    setAudioError('');

    try {
      const base64Audio = await generateSpokenReading(reading.interpretation);
      
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const audioBuffer = await decodeAudioData(decode(base64Audio), audioContext, 24000, 1);
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);

      source.onended = () => {
        setAudioState('idle');
        audioRef.current.context?.close().catch(console.error);
        audioRef.current = { context: null, source: null };
      };

      audioRef.current = { context: audioContext, source };
      source.start();
      setAudioState('playing');

    } catch (err) {
      console.error("Failed to play reading:", err);
      setAudioError("Sorry, the audio could not be played at this time.");
      setAudioState('error');
    }
  };

  const handleFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (followUpQuestion.trim() && !isFollowUpLoading) {
      await onFollowUpSubmit(followUpQuestion);
      setFollowUpQuestion('');
    }
  };
  
  const handleCopyToClipboard = () => {
    const { cardInterpretations, interpretation, keyTakeaways, retool } = reading;

    const drawnCardsString = cardInterpretations.map(c => `- ${c.cardName} (${c.orientation})`).join('\n');
    const takeawaysString = keyTakeaways.map(t => `- ${t}`).join('\n');

    const textToCopy = `
🔮 My Arcana Echo Reading 🔮

Cards Drawn:
${drawnCardsString}

✨ Key Takeaways:
${takeawaysString}

📜 Interpretation:
${interpretation}

🌿 Daily Focus:
${retool}
`;
    navigator.clipboard.writeText(textToCopy.trim()).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy reading: ', err);
    });
  };

  const renderPlayButtonIcon = () => {
    switch (audioState) {
        case 'loading':
            return <div className="w-5 h-5 border-2 border-gray-400 border-t-gray-700 dark:border-gray-500 dark:border-t-gray-200 rounded-full animate-spin"></div>;
        case 'playing':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                </svg>
            );
        default: // idle or error
            return (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
            );
    }
};

  return (
    <div className="w-full max-w-2xl mx-auto p-4 md:p-0 space-y-2">
      {/* Card by Card Breakdown */}
      <section>
        <h2 className="font-serif-display text-3xl text-gray-900 dark:text-gray-100 text-center mb-6">
          The Cards Revealed
        </h2>
        <div className="space-y-8">
          {reading.cardInterpretations.map((card, index) => {
            // Find standard name to look up image if using custom deck with aliased names
            // Actually Reading cardName is the custom name. 
            // The Deck object has standard keys in `cardImages`.
            // We need to reverse lookup or check if we stored standard name.
            // In ReadingRecord, drawnCards has standard name.
            // But reading.cardInterpretations only has the "display" name.
            // We can iterate TAROT_CARDS to find which standard card maps to this custom name in the deck.
            
            let standardName = card.cardName;
            let displaySubtext = '';

            if (deck.isCustom) {
                 // Try to find the key in majorArcana
                 const majorEntry = Object.entries(deck.majorArcana).find(([k, v]) => v === card.cardName);
                 if (majorEntry) {
                     standardName = majorEntry[0];
                     displaySubtext = standardName;
                 } else {
                     // Try to match suits
                     for (const [suitKey, suitValue] of Object.entries(deck.suits)) {
                         if (card.cardName.includes(suitValue)) {
                             standardName = card.cardName.replace(suitValue, suitKey);
                             displaySubtext = standardName;
                             break;
                         }
                     }
                 }
            }
            
            const cardImage = deck.cardImages?.[standardName];

            return (
                <div 
                key={index} 
                ref={el => cardRefs.current[index] = el}
                className="bg-white dark:bg-gray-800 border-l-2 border-gray-800 dark:border-gray-300 pl-4 py-4 pr-2 rounded-r-lg shadow-sm flex flex-col md:flex-row gap-4"
                >
                {cardImage && (
                    <div className="w-full md:w-1/3 flex-shrink-0">
                        <div className="aspect-[2/3] rounded-lg overflow-hidden shadow-md relative">
                            <img src={cardImage} alt={card.cardName} className={`w-full h-full object-cover ${card.orientation === 'reversed' ? 'transform rotate-180' : ''}`} />
                            <div className="absolute inset-0 bg-black/10"></div>
                        </div>
                    </div>
                )}
                <div className="flex-grow">
                    <h3 className="font-serif-display text-xl text-gray-900 dark:text-gray-100 flex items-center flex-wrap gap-2">
                        {card.cardName}
                        {displaySubtext && <span className="text-sm font-normal text-gray-400 dark:text-gray-500">({displaySubtext})</span>}
                        {card.orientation === 'reversed' && <span className="text-sm font-normal text-gray-500 dark:text-gray-400">(Reversed)</span>}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">{card.contextualMeaning}</p>
                    
                    {card.clarification ? (
                        <div className="mt-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-gray-700 dark:text-gray-200 font-semibold">Clarification: {card.clarification.cardName}</p>
                            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">{card.clarification.meaning}</p>
                        </div>
                    ) : (
                        <div className="mt-4 text-right">
                            <button 
                                onClick={() => onClarifyCard(index)}
                                disabled={clarifyingCardIndex !== null}
                                className="text-xs font-semibold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 disabled:text-gray-400 dark:disabled:text-gray-600 disabled:cursor-wait transition-colors"
                            >
                                {clarifyingCardIndex === index ? 'Clarifying...' : 'Clarify this Card'}
                            </button>
                        </div>
                    )}
                </div>
                </div>
            );
          })}
        </div>
      </section>

      <Separator />

      {/* Card Symbolism Reference */}
      <section>
        <h2 className="font-serif-display text-3xl text-gray-900 dark:text-gray-100 text-center mb-6">
          Card Symbolism
        </h2>
        <div className="space-y-6">
          {reading.cardInterpretations.map((card, index) => {
             // Logic to find standard name again for meaning lookup
             let standardName = card.cardName;
             if (deck.isCustom) {
                  const majorEntry = Object.entries(deck.majorArcana).find(([k, v]) => v === card.cardName);
                  if (majorEntry) standardName = majorEntry[0];
                  else {
                      for (const [suitKey, suitValue] of Object.entries(deck.suits)) {
                          if (card.cardName.includes(suitValue)) {
                              standardName = card.cardName.replace(suitValue, suitKey);
                              break;
                          }
                      }
                  }
             }

             const tarotCardData = TAROT_CARDS.find(c => c.name === standardName);
             if (!tarotCardData) return null;

             return (
                <div key={`${index}-symbolism`} className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="font-serif-display text-xl text-gray-900 dark:text-gray-100">
                        {tarotCardData.name}
                        {card.orientation === 'reversed' && <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">(Reversed)</span>}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{tarotCardData.meaning}</p>
                </div>
             )
          })}
        </div>
      </section>

      <Separator />

      {/* Overall Interpretation */}
      <section>
        <div className="flex justify-center items-center gap-3 mb-6">
            <h2 className="font-serif-display text-3xl text-gray-900 dark:text-gray-100 text-center">
            Your Story
            </h2>
            <button
                onClick={handlePlayReading}
                disabled={audioState === 'loading'}
                className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 disabled:cursor-wait transition-colors"
                title={audioState === 'playing' ? 'Stop Reading' : 'Play Reading'}
            >
                {renderPlayButtonIcon()}
            </button>
        </div>
        {audioState === 'error' && <p className="text-center text-red-500 text-sm mb-4">{audioError}</p>}
        <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 prose-p:leading-relaxed prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-headings:font-serif-display">
          {reading.interpretation.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </section>

      <Separator />
      
      {/* Key Takeaways */}
      {reading.keyTakeaways && reading.keyTakeaways.length > 0 && (
        <section>
            <h2 className="font-serif-display text-3xl text-gray-900 dark:text-gray-100 text-center mb-6">
                Key Takeaways
            </h2>
            <div className="space-y-4">
                {reading.keyTakeaways.map((takeaway, index) => (
                <blockquote key={index} className="text-center text-gray-600 dark:text-gray-300 text-lg font-serif-display italic border-l-2 border-gray-400 dark:border-gray-500 px-4 py-2 max-w-xl mx-auto">
                    {takeaway}
                </blockquote>
                ))}
            </div>
        </section>
      )}

      <Separator />

      {/* Daily Focus & Sharing */}
      <section className="text-center">
        <h3 className="font-serif-display text-2xl text-gray-800 dark:text-gray-200 mb-4">
          Daily Focus
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">{reading.retool}</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => onSetDailyTask(reading.retool)}
            className="px-6 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 font-medium rounded-lg hover:bg-gray-700 dark:hover:bg-gray-300 transition-all duration-300 w-full sm:w-auto transform hover:-translate-y-0.5"
          >
            Add to Daily Check-in
          </button>
          <button
            onClick={handleCopyToClipboard}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300 w-full sm:w-auto"
          >
            {isCopied ? 'Copied!' : 'Copy Reading'}
          </button>
        </div>
      </section>

      <Separator />

      {/* Follow-up Section */}
      <section ref={followUpRef}>
        <h2 className="font-serif-display text-3xl text-gray-900 dark:text-gray-100 text-center mb-6">
          Continue the Conversation
        </h2>
        {/* Conversation History */}
        {reading.conversation && reading.conversation.length > 0 && (
          <div className="space-y-4 mb-6">
            {reading.conversation.map((entry, index) => (
              <React.Fragment key={index}>
                <div className="flex justify-end">
                  <p className="inline-block bg-gray-800 dark:bg-gray-700 text-white rounded-lg px-3 py-2">{entry.question}</p>
                </div>
                 <div className="flex justify-start">
                  <p className="inline-block bg-gray-200 dark:bg-gray-800 rounded-lg px-3 py-2 text-gray-800 dark:text-gray-200">{entry.answer}</p>
                </div>
              </React.Fragment>
            ))}
          </div>
        )}
        
        {/* Follow-up Form */}
        <form onSubmit={handleFollowUp}>
           <textarea
              value={followUpQuestion}
              onChange={(e) => setFollowUpQuestion(e.target.value)}
              placeholder="Ask a question about your reading..."
              className="w-full h-24 p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:border-transparent focus:outline-none transition-shadow duration-300 resize-none placeholder-gray-400 dark:placeholder-gray-500"
              disabled={isFollowUpLoading}
          />
          <div className="text-center mt-4">
             <button
                type="submit"
                disabled={!followUpQuestion.trim() || isFollowUpLoading}
                className="px-8 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed disabled:text-gray-400 dark:disabled:text-gray-600 transition-colors duration-300"
              >
                {isFollowUpLoading ? 'Thinking...' : 'Ask'}
              </button>
          </div>
        </form>
      </section>

      <div className="text-center pt-8">
        <button
          onClick={onReset}
          className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-300"
        >
          Start a New Reading
        </button>
      </div>
    </div>
  );
};

export default ReadingDisplay;