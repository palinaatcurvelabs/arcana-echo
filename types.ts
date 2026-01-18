export interface TarotCard {
  name: string;
  keywords: string[];
  meaning: string;
}

export interface Spread {
  theme: string;
  spreadName: string;
  description: string;
  numberOfCards: number;
  positions: string[];
  isCustom?: boolean;
}

export interface Deck {
  id: string;
  name: string;
  theme: string;
  description: string;
  isCustom: boolean;
  majorArcana: Record<string, string>;
  suits: {
    Wands: string;
    Cups: string;
    Swords: string;
    Pentacles: string;
  };
  coverImage?: string;
  cardImages: Record<string, string>;
}

export interface DrawnCard {
  position: string;
  cardName: string;
  orientation: 'upright' | 'reversed';
}

export type AppStep =
  | 'JOURNAL'
  | 'SUGGESTING_SPREAD'
  | 'SPREAD_SELECTION'
  | 'DRAW_METHOD_SELECTION'
  | 'CARD_INPUT'
  | 'DIGITAL_DRAW'
  | 'GENERATING_READING'
  | 'READING_COMPLETE';
  
export type AppView = 'APP' | 'HISTORY' | 'PROFILE' | 'LIVE_CONVERSATION' | 'SPREAD_LIBRARY' | 'DECK_LIBRARY' | 'YOUR_CARDS';

export interface CardInterpretation {
  cardName: string;
  orientation: 'upright' | 'reversed';
  generalMeaning: string;
  contextualMeaning: string;
  clarification?: {
    cardName: string;
    meaning: string;
  };
}

export interface ConversationEntry {
  question: string;
  answer: string;
}

export interface Reading {
  cardInterpretations: CardInterpretation[];
  interpretation: string;
  retool: string;
  keyTakeaways: string[];
  conversation: ConversationEntry[];
}

export interface ReadingRecord {
  id: string;
  date: string;
  journalEntry: string;
  spread: Spread;
  deck?: Deck;
  drawnCards: DrawnCard[];
  reading: Reading;
  reflection?: string; // Personal reflection added later
  isTurningPoint?: boolean; // Mark significant readings
}

// ===== HYPER-PERSONAL PROFILE =====

export interface UserProfile {
  name: string;
  createdAt: string;
  focusAreas: string[]; // What they want to explore: "career", "relationships", "self-growth", etc.
  readingStyle: 'direct' | 'gentle' | 'poetic';
  intentions: string; // Free-form: what they're working on in life right now
}

export interface CardStats {
  cardName: string;
  timesDrawn: number;
  timesUpright: number;
  timesReversed: number;
  lastDrawn: string;
  positions: string[]; // What positions it appeared in
  personalNote?: string; // User's personal meaning for this card
  resonance?: 'love' | 'neutral' | 'shadow'; // How they feel about this card
}

export interface PersonalInsights {
  totalReadings: number;
  mostFrequentCards: Array<{ cardName: string; count: number }>;
  recentCards: Array<{ cardName: string; date: string }>;
  majorArcanaRatio: number; // % of major arcana in readings
  commonPositions: Record<string, string[]>; // position -> cards that appeared there
}

export interface TranscriptEntry {
  speaker: 'user' | 'model';
  text: string;
}
