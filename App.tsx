import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import Auth from './components/Auth';
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
import { supabase, onAuthStateChange, signOut } from './services/supabaseClient';
import type { AppStep, Spread, DrawnCard, ReadingRecord, Reading, UserProfile, AppView, Deck } from './types';
import { SPREADS } from './data/spreadsData';
import { DEFAULT_DECK } from './data/tarotData';

const App: React.FC = () => {
  // Auth state
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

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

  // Auth listener
  useEffect(() => {
    const { data: { subscription } } = onAuthStateChange((user) => {
      setUser(user);
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load data from Supabase when user logs in
  useEffect(() => {
    if (!user) return;

    const loadUserData = async () => {
      try {
        // Load profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (profileData) {
          setUserProfile({
            name: profileData.name || '',
            focusAreas: profileData.focus_areas || [],
            readingStyle: profileData.reading_style || 'gentle',
            intentions: profileData.intentions || '',
          });
        }

        // Load readings
        const { data: readingsData } = await supabase
          .from('readings')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (readingsData) {
          const formattedReadings: ReadingRecord[] = readingsData.map((r: any) => ({
            id: r.id,
            date: r.created_at,
            journalEntry: r.journal_entry,
            spread: { spreadName: r.spread_name } as Spread,
            deck: currentDeck,
            drawnCards: r.drawn_cards,
            reading: r.reading,
            isTurningPoint: r.is_turning_point,
          }));
          setHistory(formattedReadings);
        }

        // Load card notes
        const { data: notesData } = await supabase
          .from('card_notes')
          .select('*')
          .eq('user_id', user.id);
        
        if (notesData) {
          const notes: Record<string, string> = {};
          const resonance: Record<string, 'love' | 'neutral' | 'shadow'> = {};
          notesData.forEach((n: any) => {
            if (n.note) notes[n.card_name] = n.note;
            if (n.resonance) resonance[n.card_name] = n.resonance;
          });
          setCardNotes(notes);
          setCardResonance(resonance);
        }

        // Load custom spreads
        const { data: spreadsData } = await supabase
          .from('custom_spreads')
          .select('*')
          .eq('user_id', user.id);
        
        if (spreadsData) {
          const spreads: Spread[] = spreadsData.map((s: any) => ({
            theme: s.theme,
            spreadName: s.spread_name,
            description: s.description,
            numberOfCards: s.number_of_cards,
            positions: s.positions,
            isCustom: true,
          }));
          setCustomSpreads(spreads);
        }

      } catch (err) {
        console.error('Error loading user data:', err);
      }
    };

    loadUserData();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    setUser(null);
    setUserProfile(null);
    setHistory([]);
    setCardNotes({});
    setCardResonance({});
    setCustomSpreads([]);
  };

  const handleProfileSave = async (profile: UserProfile) => {
    setUserProfile(profile);
    setIsProfileOpen(false);

    if (user) {
      await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          name: profile.name,
          focus_areas: profile.focusAreas,
          reading_style: profile.readingStyle,
          intentions: profile.intentions,
          updated_at: new Date().toISOString(),
        });
    }
  };
  
  const handleSaveCardNote = async (cardName: string, note: string) => {
    setCardNotes(prev => ({ ...prev, [cardName]: note }));

    if (user) {
      await supabase
        .from('card_notes')
        .upsert({
          user_id: user.id,
          card_name: cardName,
          note: note,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id,card_name' });
    }
  };
  
  const handleSetCardResonance = async (cardName: string, resonance: 'love' | 'neutral' | 'shadow') => {
    setCardResonance(prev => ({ ...prev, [cardName]: resonance }));

    if (user) {
      await supabase
        .from('card_notes')
        .upsert({
          user_id: user.id,
          card_name: cardName,
          resonance: resonance,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id,card_name' });
    }
  };
  
  const handleCreateSpread = async (newSpread: Omit<Spread, 'theme' | 'isCustom'>) => {
    const fullSpread: Spread = { ...newSpread, theme: 'Custom', isCustom: true };
    setCustomSpreads(prev => [...prev, fullSpread]);

    if (user) {
      await supabase
        .from('custom_spreads')
        .insert({
          user_id: user.id,
          theme: 'Custom',
          spread_name: newSpread.spreadName,
          description: newSpread.description,
          number_of_cards: newSpread.numberOfCards,
          positions: newSpread.positions,
        });
    }
  };

  const handleDeleteSpread = async (spreadName: string) => {
    setCustomSpreads(prev => prev.filter(s => s.spreadName !== spreadName));

    if (user) {
      await supabase
        .from('custom_spreads')
        .delete()
        .eq('user_id', user.id)
        .eq('spread_name', spreadName);
    }
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

      // Save to Supabase
      if (user) {
        await supabase
          .from('readings')
          .insert({
            user_id: user.id,
            journal_entry: journalEntry,
            spread_name: selectedSpread.spreadName,
            drawn_cards: cards,
            reading: fullReading,
          });
      }

      setStep('READING_COMPLETE');
    } catch (err) {
      setError('Could not generate your reading. Please try again.');
      setStep('CARD_INPUT');
    } finally {
      setIsLoading(false);
    }
  }, [journalEntry, selectedSpread, userProfile, currentDeck, history, user]);

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

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-color)]">
        <div className="text-center">
          <h1 className="font-serif-brand text-2xl text-[var(--text-primary)] tracking-widest uppercase mb-4">
            Arcana Echo
          </h1>
          <div className="animate-pulse text-[var(--text-secondary)]">Loading...</div>
        </div>
      </div>
    );
  }

  // Show auth if not logged in
  if (!user) {
    return <Auth onAuthSuccess={() => {}} />;
  }

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
      <Header onSetView={handleSetView} onSignOut={handleSignOut} userEmail={user?.email} />
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
