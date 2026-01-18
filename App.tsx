import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import JournalInput from './components/JournalInput';
import Spinner from './components/Spinner';
import SpreadSelection from './components/SpreadSelection';
import DrawMethodSelection from './components/DrawMethodSelection';
import DigitalDraw from './components/DigitalDraw';
import CardInput from './components/CardInput';
import ReadingDisplay from './components/ReadingDisplay';
import DailyCheckin from './components/DailyCheckin';
import History from './components/History';
import Profile from './components/Profile';
import ProfileView from './components/ProfileView';
import YourCards from './components/YourCards';
import InspirationSpreads from './components/InspirationSpreads';
import LiveConversation from './components/LiveConversation';
import SpreadLibrary from './components/SpreadLibrary';
import { getSpreadSuggestions, generateTarotReading, getFollowUpAnswer, getClarifyingCard } from './services/geminiService';
import type { AppStep, Spread, DrawnCard, ReadingRecord, Reading, UserProfile, AppView, Deck } from './types';
import { SPREADS } from './data/spreadsData';
import { DEFAULT_DECK } from './data/tarotData';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>('JOURNAL');
  const [view, setView] = useState<AppView>('APP');
  const [history, setHistory] = useState<ReadingRecord[]>([]);
  const [customSpreads, setCustomSpreads] = useState<Spread[]>([]);
  
  // Single Deck App
  const currentDeck = DEFAULT_DECK;
  
  const [journalEntry, setJournalEntry] = useState<string>('');
  const [suggestedSpreads, setSuggestedSpreads] = useState<Spread[]>([]);
  const [selectedSpread, setSelectedSpread] = useState<Spread | null>(null);
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [reading, setReading] = useState<Reading | null>(null);
  const [dailyTask, setDailyTask] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFollowUpLoading, setIsFollowUpLoading] = useState<boolean>(false);
  const [clarifyingCardIndex, setClarifyingCardIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // Personal card data
  const [cardNotes, setCardNotes] = useState<Record<string, string>>({});
  const [cardResonance, setCardResonance] = useState<Record<string, 'love' | 'neutral' | 'shadow'>>({});

  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('tarotHistory');
      if (savedHistory) setHistory(JSON.parse(savedHistory));
      
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) setUserProfile(JSON.parse(savedProfile));
      
      const savedCustomSpreads = localStorage.getItem('customSpreads');
      if (savedCustomSpreads) setCustomSpreads(JSON.parse(savedCustomSpreads));
      
      const savedCardNotes = localStorage.getItem('cardNotes');
      if (savedCardNotes) setCardNotes(JSON.parse(savedCardNotes));
      
      const savedCardResonance = localStorage.getItem('cardResonance');
      if (savedCardResonance) setCardResonance(JSON.parse(savedCardResonance));

    } catch (error) {
      console.error("Failed to load data from localStorage", error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tarotHistory', JSON.stringify(history));
  }, [history]);
  
  useEffect(() => {
    localStorage.setItem('customSpreads', JSON.stringify(customSpreads));
  }, [customSpreads]);
  
  useEffect(() => {
    localStorage.setItem('cardNotes', JSON.stringify(cardNotes));
  }, [cardNotes]);
  
  useEffect(() => {
    localStorage.setItem('cardResonance', JSON.stringify(cardResonance));
  }, [cardResonance]);

  const handleProfileSave = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem('userProfile', JSON.stringify(profile));
    setIsProfileOpen(false);
  };
  
  const handleSaveCardNote = (cardName: string, note: string) => {
    setCardNotes(prev => ({ ...prev, [cardName]: note }));
  };
  
  const handleSetCardResonance = (cardName: string, resonance: 'love' | 'neutral' | 'shadow') => {
    setCardResonance(prev => ({ ...prev, [cardName]: resonance }));
  };
  
  const handleCreateSpread = (newSpread: Omit<Spread, 'theme' | 'isCustom'>) => {
    const fullSpread: Spread = { ...newSpread, theme: 'Custom', isCustom: true };
    setCustomSpreads(prev => [...prev, fullSpread]);
  };

  const handleDeleteSpread = (spreadName: string) => {
    setCustomSpreads(prev => prev.filter(s => s.spreadName !== spreadName));
  };

  const handleReset = useCallback(() => {
    setStep('JOURNAL');
    setJournalEntry('');
    setSuggestedSpreads([]);
    setSelectedSpread(null);
    setDrawnCards([]);
    setReading(null);
    setError(null);
  }, []);
  
  const handleSetView = useCallback((newView: AppView) => {
    if (newView === 'APP' && view !== 'APP') {
        handleReset();
    }
    setView(newView);
  }, [view, handleReset]);

  const handleJournalSubmit = useCallback(async (entry: string) => {
    setIsLoading(true);
    setError(null);
    setJournalEntry(entry);
    setStep('SUGGESTING_SPREAD');
    try {
      const allSpreads = [...SPREADS, ...customSpreads];
      const spreads = await getSpreadSuggestions(entry, allSpreads);
      setSuggestedSpreads(spreads);
      setStep('SPREAD_SELECTION');
    } catch (err) {
      setError('Could not get spread suggestions. Please try again.');
      setStep('JOURNAL');
    } finally {
      setIsLoading(false);
    }
  }, [customSpreads]);
  
  const handleInspirationSpreadSelect = useCallback((spread: Spread) => {
    setJournalEntry('');
    setSelectedSpread(spread);
    setStep('DRAW_METHOD_SELECTION');
    setView('APP');
  }, []);

  const handleSpreadSelect = useCallback((spread: Spread) => {
    setSelectedSpread(spread);
    setStep('DRAW_METHOD_SELECTION');
  }, []);

  const handleDrawMethodSelect = useCallback((method: 'physical' | 'digital') => {
    if (method === 'physical') {
      setStep('CARD_INPUT');
    } else {
      setStep('DIGITAL_DRAW');
    }
  }, []);

  const handleCardSubmit = useCallback(async (cards: DrawnCard[]) => {
    setIsLoading(true);
    setError(null);
    setDrawnCards(cards);
    setStep('GENERATING_READING');
    try {
      if (!selectedSpread) throw new Error("Spread not defined");
      const result = await generateTarotReading(journalEntry, selectedSpread, cards, userProfile, currentDeck, history);
      
      const fullReading: Reading = { ...result, conversation: [] };
      setReading(fullReading);

      const newRecord: ReadingRecord = {
        id: `${new Date().toISOString()}-${Math.random()}`,
        date: new Date().toISOString(),
        journalEntry,
        spread: selectedSpread,
        deck: currentDeck,
        drawnCards: cards,
        reading: fullReading,
      };
      setHistory(prevHistory => [newRecord, ...prevHistory]);

      setStep('READING_COMPLETE');
    } catch (err) {
      setError('Could not generate your reading. Please try again.');
      setStep('CARD_INPUT');
    } finally {
      setIsLoading(false);
    }
  }, [journalEntry, selectedSpread, userProfile, currentDeck, history]);

  const handleFollowUpSubmit = useCallback(async (question: string) => {
    if (!reading || !selectedSpread) return;

    setIsFollowUpLoading(true);
    setError(null);
    try {
        const { answer } = await getFollowUpAnswer(journalEntry, selectedSpread, drawnCards, reading, question, userProfile);
        const newEntry = { question, answer };

        const updatedReading: Reading = {
            ...reading,
            conversation: [...reading.conversation, newEntry],
        };
        setReading(updatedReading);

        setHistory(prevHistory => {
            const newHistory = [...prevHistory];
            if (newHistory.length > 0) {
                 newHistory[0].reading = updatedReading;
            }
            return newHistory;
        });

    } catch (err) {
        setError("Sorry, I couldn't process that follow-up. Please try again.");
    } finally {
        setIsFollowUpLoading(false);
    }
  }, [reading, journalEntry, selectedSpread, drawnCards, userProfile]);

  const handleClarifyCard = useCallback(async (cardIndex: number) => {
    if (!reading || !selectedSpread) return;

    setClarifyingCardIndex(cardIndex);
    setError(null);
    try {
        const cardToClarify = reading.cardInterpretations[cardIndex];
        const clarification = await getClarifyingCard(
            { journalEntry, spread: selectedSpread, reading, userProfile },
            cardToClarify
        );

        const updatedReading: Reading = {
            ...reading,
            cardInterpretations: reading.cardInterpretations.map((interp, index) => {
                if (index === cardIndex) {
                    return { ...interp, clarification };
                }
                return interp;
            }),
        };
        setReading(updatedReading);

        setHistory(prevHistory => {
            const newHistory = [...prevHistory];
            if (newHistory.length > 0) {
                 newHistory[0].reading = updatedReading;
            }
            return newHistory;
        });
        
    } catch (err) {
        setError("Sorry, I couldn't get a clarification. Please try again.");
    } finally {
        setClarifyingCardIndex(null);
    }
  }, [reading, journalEntry, selectedSpread, userProfile]);

  const handleSetDailyTask = useCallback((task: string) => { setDailyTask(task); }, []);
  const handleClearDailyTask = useCallback(() => { setDailyTask(''); }, []);

  const renderAppContent = () => {
    if (error) {
      return <div className="text-center p-8 text-red-500">{error} <button onClick={() => setError(null)} className="underline ml-2">Dismiss</button></div>;
    }

    switch (step) {
      case 'JOURNAL':
        const inspirationSpreads = [
            SPREADS.find(s => s.spreadName === "Card of the Day"),
            SPREADS.find(s => s.spreadName === "Three Card Spread"),
            SPREADS.find(s => s.spreadName === "Mind, Body, Spirit")
        ].filter(Boolean) as Spread[];
        return (
            <>
                <div className="w-full max-w-2xl mx-auto mb-4 text-center">
                </div>
                <JournalInput onSubmit={handleJournalSubmit} isLoading={isLoading} />
                <InspirationSpreads spreads={inspirationSpreads} onSelect={handleInspirationSpreadSelect} />
            </>
        );
      case 'SUGGESTING_SPREAD':
        return <Spinner message="Consulting the ether..." />;
      case 'SPREAD_SELECTION':
        return <SpreadSelection spreads={suggestedSpreads} onSelect={handleSpreadSelect} />;
      case 'DRAW_METHOD_SELECTION':
        return <DrawMethodSelection onSelect={handleDrawMethodSelect} currentDeck={currentDeck} />;
      case 'CARD_INPUT':
        if (selectedSpread) return <CardInput spread={selectedSpread} onSubmit={handleCardSubmit} isLoading={isLoading} currentDeck={currentDeck} />;
        return null;
       case 'DIGITAL_DRAW':
        if (selectedSpread) return <DigitalDraw spread={selectedSpread} onSubmit={handleCardSubmit} isLoading={isLoading} currentDeck={currentDeck} />;
        return null;
      case 'GENERATING_READING':
        return <Spinner message="Interpreting the cards..." />;
      case 'READING_COMPLETE':
        if (reading) return <ReadingDisplay reading={reading} onSetDailyTask={handleSetDailyTask} onReset={handleReset} onFollowUpSubmit={handleFollowUpSubmit} isFollowUpLoading={isFollowUpLoading} onClarifyCard={handleClarifyCard} clarifyingCardIndex={clarifyingCardIndex} deck={currentDeck} />;
        return null;
      default:
        return <div>Something went wrong.</div>;
    }
  };
  
  const renderView = () => {
    const allSpreads = [...SPREADS, ...customSpreads];
    switch(view) {
        case 'APP':
            return renderAppContent();
        case 'HISTORY':
            return <History history={history} userProfile={userProfile} onOpenProfile={() => setIsProfileOpen(true)} />;
        case 'PROFILE':
            return (
              <ProfileView 
                userProfile={userProfile} 
                history={history}
                onOpenProfileEditor={() => setIsProfileOpen(true)} 
                onViewCards={() => setView('YOUR_CARDS')}
              />
            );
        case 'YOUR_CARDS':
            return (
              <YourCards
                history={history}
                cardNotes={cardNotes}
                cardResonance={cardResonance}
                onSaveNote={handleSaveCardNote}
                onSetResonance={handleSetCardResonance}
                onBack={() => setView('PROFILE')}
              />
            );
        case 'SPREAD_LIBRARY':
            return <SpreadLibrary 
                        allSpreads={allSpreads} 
                        onSelectSpread={handleInspirationSpreadSelect}
                        onCreateSpread={handleCreateSpread}
                        onDeleteSpread={handleDeleteSpread}
                        onBack={() => setView('APP')}
                   />;
        case 'LIVE_CONVERSATION':
            return <LiveConversation />;
        default:
            return renderAppContent();
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-gray-800 dark:text-gray-100 transition-colors duration-300">
      <Header onSetView={handleSetView} />
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div key={view === 'APP' ? step : view} className="animate-slide-up">
            {renderView()}
        </div>
      </main>
      {view === 'APP' && <DailyCheckin task={dailyTask} onClear={handleClearDailyTask} />}
      {isProfileOpen && <Profile userProfile={userProfile} onSave={handleProfileSave} onClose={() => setIsProfileOpen(false)} />}
    </div>
  );
};

export default App;
