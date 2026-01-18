import React, { useMemo } from 'react';
import type { UserProfile, ReadingRecord, CardStats, PersonalInsights } from '../types';

interface ProfileViewProps {
  userProfile: UserProfile | null;
  history: ReadingRecord[];
  onOpenProfileEditor: () => void;
  onViewCards: () => void;
}

const FOCUS_AREA_LABELS: Record<string, string> = {
  'career': 'Career & Purpose',
  'relationships': 'Love & Relationships',
  'self-growth': 'Personal Growth',
  'creativity': 'Creativity & Expression',
  'healing': 'Healing & Shadow Work',
  'decisions': 'Decisions & Clarity',
  'spirituality': 'Spiritual Path',
  'abundance': 'Money & Abundance',
};

const MAJOR_ARCANA = [
  "The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor", 
  "The Hierophant", "The Lovers", "The Chariot", "Strength", "The Hermit", 
  "Wheel of Fortune", "Justice", "The Hanged Man", "Death", "Temperance", 
  "The Devil", "The Tower", "The Star", "The Moon", "The Sun", "Judgement", "The World"
];

const ProfileView: React.FC<ProfileViewProps> = ({ userProfile, history, onOpenProfileEditor, onViewCards }) => {
  
  // Calculate personal insights from history
  const insights = useMemo<PersonalInsights>(() => {
    const cardCounts: Record<string, number> = {};
    const recentCards: Array<{ cardName: string; date: string }> = [];
    let majorCount = 0;
    let totalCards = 0;

    history.forEach(record => {
      record.drawnCards.forEach(drawn => {
        cardCounts[drawn.cardName] = (cardCounts[drawn.cardName] || 0) + 1;
        totalCards++;
        if (MAJOR_ARCANA.includes(drawn.cardName)) majorCount++;
      });
      
      // Track recent cards (last 10)
      if (recentCards.length < 10) {
        record.drawnCards.forEach(drawn => {
          if (recentCards.length < 10) {
            recentCards.push({ cardName: drawn.cardName, date: record.date });
          }
        });
      }
    });

    const mostFrequent = Object.entries(cardCounts)
      .map(([cardName, count]) => ({ cardName, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalReadings: history.length,
      mostFrequentCards: mostFrequent,
      recentCards,
      majorArcanaRatio: totalCards > 0 ? (majorCount / totalCards) * 100 : 0,
      commonPositions: {},
    };
  }, [history]);

  // Calculate days since first reading
  const daysSinceStart = useMemo(() => {
    if (history.length === 0) return 0;
    const oldest = history[history.length - 1];
    const start = new Date(oldest.date);
    const now = new Date();
    return Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  }, [history]);

  if (!userProfile) {
    return (
      <div className="w-full max-w-2xl mx-auto p-8 text-center animate-fade-in">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
            <span className="text-4xl">✦</span>
          </div>
          <h2 className="font-serif-display text-3xl text-gray-900 dark:text-gray-100 mb-3">
            Welcome, Seeker
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Create your profile to help Arcana understand you better and track your personal journey with the cards.
          </p>
        </div>
        <button
          onClick={onOpenProfileEditor}
          className="px-8 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 font-medium rounded-xl hover:bg-gray-700 dark:hover:bg-gray-300 transition-all shadow-lg transform hover:-translate-y-0.5"
        >
          Create Profile
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center text-3xl">
          {userProfile.name ? userProfile.name[0].toUpperCase() : '✦'}
        </div>
        <h2 className="font-serif-display text-3xl text-gray-900 dark:text-gray-100 mb-2">
          {userProfile.name || 'Seeker'}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          {daysSinceStart > 0 
            ? `On your journey for ${daysSinceStart} days`
            : 'Beginning your journey'
          }
        </p>
        <button
          onClick={onOpenProfileEditor}
          className="mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
        >
          Edit Profile
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 text-center">
          <div className="text-3xl font-serif-display text-gray-900 dark:text-gray-100">
            {insights.totalReadings}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Readings</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 text-center">
          <div className="text-3xl font-serif-display text-gray-900 dark:text-gray-100">
            {Object.keys(insights.mostFrequentCards.reduce((acc, c) => ({ ...acc, [c.cardName]: true }), {})).length || 0}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Unique Cards</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 text-center">
          <div className="text-3xl font-serif-display text-gray-900 dark:text-gray-100">
            {Math.round(insights.majorArcanaRatio)}%
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Major Arcana</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 text-center">
          <div className="text-3xl font-serif-display text-gray-900 dark:text-gray-100">
            {history.filter(r => r.isTurningPoint).length}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Turning Points</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Focus Areas */}
        {userProfile.focusAreas.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="font-serif-brand text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
              Your Focus Areas
            </h3>
            <div className="flex flex-wrap gap-2">
              {userProfile.focusAreas.map(area => (
                <span 
                  key={area}
                  className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300"
                >
                  {FOCUS_AREA_LABELS[area] || area}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Current Intentions */}
        {userProfile.intentions && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="font-serif-brand text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
              Current Intentions
            </h3>
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed italic">
              "{userProfile.intentions}"
            </p>
          </div>
        )}

        {/* Most Frequent Cards */}
        {insights.mostFrequentCards.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif-brand text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Cards That Find You
              </h3>
              <button
                onClick={onViewCards}
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                View All →
              </button>
            </div>
            <div className="space-y-3">
              {insights.mostFrequentCards.slice(0, 5).map((card, index) => (
                <div key={card.cardName} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">
                      {index + 1}
                    </span>
                    <span className="text-gray-900 dark:text-gray-100 text-sm">{card.cardName}</span>
                  </div>
                  <span className="text-gray-400 dark:text-gray-500 text-sm">{card.count}×</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reading Style */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="font-serif-brand text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
            Your Reading Style
          </h3>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              {userProfile.readingStyle === 'direct' && '⚡'}
              {userProfile.readingStyle === 'gentle' && '🌙'}
              {userProfile.readingStyle === 'poetic' && '✨'}
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                {userProfile.readingStyle}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {userProfile.readingStyle === 'direct' && 'Clear, straightforward insights'}
                {userProfile.readingStyle === 'gentle' && 'Compassionate, supportive guidance'}
                {userProfile.readingStyle === 'poetic' && 'Mystical, metaphor-rich language'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {insights.totalReadings === 0 && (
        <div className="text-center py-12 mt-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 mb-2">No readings yet</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Your personal patterns will appear here as you explore the cards
          </p>
        </div>
      )}
    </div>
  );
};

export default ProfileView;
