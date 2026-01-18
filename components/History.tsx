import React, { useState } from 'react';
import type { ReadingRecord, UserProfile } from '../types';

interface HistoryProps {
  history: ReadingRecord[];
  userProfile: UserProfile | null;
  onOpenProfile: () => void;
}

const History: React.FC<HistoryProps> = ({ history, userProfile, onOpenProfile }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpansion = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleHistoryCopy = (record: ReadingRecord) => {
    const { reading, journalEntry, drawnCards } = record;
    const { interpretation, keyTakeaways, retool } = reading;

    const drawnCardsString = drawnCards.map(c => `- ${c.position}: ${c.cardName} (${c.orientation})`).join('\n');
    const takeawaysString = (keyTakeaways || []).map(t => `- ${t}`).join('\n');

    const textToCopy = `
🔮 My Arcana Echo Reading 🔮
(From ${new Date(record.date).toLocaleDateString()})

Journal Entry:
"${journalEntry || 'No entry provided.'}"

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
        alert('Reading copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy reading: ', err);
    });
  };

  if (history.length === 0) {
    return (
      <div className="text-center p-12 animate-fade-in">
        <h2 className="font-serif-display text-3xl text-gray-900 dark:text-gray-100 mb-4">Reading History</h2>
        <p className="text-gray-500 dark:text-gray-400">You have no saved readings yet. Start a new reading to begin your journey.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-serif-display text-3xl text-gray-900 dark:text-gray-100">
          Reading History
        </h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {history.length} reading{history.length !== 1 ? 's' : ''}
        </span>
      </div>
      
      <div className="space-y-4">
        {history.map((record) => (
          <div key={record.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md">
            <button
              onClick={() => toggleExpansion(record.id)}
              className="w-full text-left p-4 md:p-6 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
              aria-expanded={expandedId === record.id}
              aria-controls={`reading-${record.id}`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {record.spread.spreadName}
                  </span>
                  {record.isTurningPoint && (
                    <span className="text-xs px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full">
                      Turning Point
                    </span>
                  )}
                </div>
                <p className="text-gray-900 dark:text-gray-100 font-medium truncate">
                  {record.journalEntry || 'General guidance reading'}
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-400 dark:text-gray-500">
                  <span>{new Date(record.date).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{record.drawnCards.length} card{record.drawnCards.length !== 1 ? 's' : ''}</span>
                </div>
              </div>
              <span className={`transform transition-transform duration-300 ml-4 ${expandedId === record.id ? 'rotate-180' : 'rotate-0'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </button>
            
            <div
              id={`reading-${record.id}`} 
              className={`transition-all duration-500 ease-in-out overflow-hidden ${expandedId === record.id ? 'max-h-[2000px]' : 'max-h-0'}`}
            >
              <div className="max-h-[75vh] overflow-y-auto p-4 md:p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    {record.journalEntry && (
                      <>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Your Question</h4>
                        <blockquote className="text-gray-700 dark:text-gray-300 italic border-l-2 border-gray-300 dark:border-gray-600 pl-4 mb-6">
                          "{record.journalEntry}"
                        </blockquote>
                      </>
                    )}
                    
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Cards Drawn</h4>
                    <div className="space-y-2 mb-6">
                      {record.drawnCards.map(c => (
                        <div key={c.position} className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                          <div className="w-8 h-12 rounded bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-xs">
                            ✦
                          </div>
                          <div>
                            <p className="text-gray-900 dark:text-gray-100 font-medium">{c.cardName}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {c.position} {c.orientation === 'reversed' && '• Reversed'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Interpretation</h4>
                    <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 prose-p:leading-relaxed prose-p:mb-4">
                      {record.reading.interpretation.split('\n').filter(p => p).map((p, i) => <p key={i}>{p}</p>)}
                    </div>
                    
                    <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Daily Focus</h4>
                      <p className="text-gray-700 dark:text-gray-300">{record.reading.retool}</p>
                    </div>
                    
                    {record.reading.keyTakeaways && record.reading.keyTakeaways.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Key Takeaways</h4>
                        <ul className="space-y-2">
                          {record.reading.keyTakeaways.map((takeaway, i) => (
                            <li key={i} className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                              <span className="text-gray-400 mt-1">•</span>
                              <span>{takeaway}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <button
                      onClick={() => handleHistoryCopy(record)}
                      className="mt-6 px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
                    >
                      Copy Reading
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-8">
        Your reading history is saved locally in your browser
      </p>
    </div>
  );
};

export default History;
