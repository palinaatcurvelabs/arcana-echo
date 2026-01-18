import React, { useState } from 'react';
import type { Spread } from '../types';

interface SpreadLibraryProps {
  allSpreads: Spread[];
  onSelectSpread: (spread: Spread) => void;
  onCreateSpread: (spread: Omit<Spread, 'theme' | 'isCustom'>) => void;
  onDeleteSpread: (spreadName: string) => void;
  onBack: () => void;
}

const groupSpreadsByTheme = (spreads: Spread[]): Record<string, Spread[]> => {
  return spreads.reduce((acc, spread) => {
    const theme = spread.isCustom ? "Custom" : spread.theme;
    if (!acc[theme]) {
      acc[theme] = [];
    }
    acc[theme].push(spread);
    return acc;
  }, {} as Record<string, Spread[]>);
};

const SpreadLab: React.FC<{ onSave: SpreadLibraryProps['onCreateSpread'], onCancel: () => void }> = ({ onSave, onCancel }) => {
    const [spreadName, setSpreadName] = useState('');
    const [description, setDescription] = useState('');
    const [positions, setPositions] = useState<string[]>(['', '', '']);

    const handlePositionChange = (index: number, value: string) => {
        const newPositions = [...positions];
        newPositions[index] = value;
        setPositions(newPositions);
    };

    const addPosition = () => setPositions([...positions, '']);
    const removePosition = (index: number) => {
        if (positions.length > 1) {
            setPositions(positions.filter((_, i) => i !== index));
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (spreadName.trim() && description.trim() && positions.every(p => p.trim())) {
            onSave({
                spreadName,
                description,
                positions,
                numberOfCards: positions.length,
            });
            onCancel(); // Close form after saving
        }
    };

    return (
        <div className="mt-8 p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md animate-fade-in">
            <h3 className="font-serif-brand text-2xl text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-4 text-center">Create a Custom Spread</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" value={spreadName} onChange={e => setSpreadName(e.target.value)} placeholder="Spread Name" className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md" required />
                <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md" required />
                <div>
                    <label className="font-semibold text-gray-700 dark:text-gray-300">Card Positions</label>
                    {positions.map((pos, index) => (
                        <div key={index} className="flex items-center gap-2 mt-2">
                            <input type="text" value={pos} onChange={e => handlePositionChange(index, e.target.value)} placeholder={`Position ${index + 1}`} className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md" required />
                            <button type="button" onClick={() => removePosition(index)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full" disabled={positions.length <= 1}>&times;</button>
                        </div>
                    ))}
                    <button type="button" onClick={addPosition} className="mt-2 text-sm text-gray-600 dark:text-gray-400 hover:underline">+ Add Position</button>
                </div>
                 <div className="flex justify-center gap-4 pt-4">
                    <button type="button" onClick={onCancel} className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button>
                    <button type="submit" className="px-6 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 font-medium rounded-lg hover:bg-gray-700 dark:hover:bg-gray-300">Save Spread</button>
                </div>
            </form>
        </div>
    );
};


const SpreadLibrary: React.FC<SpreadLibraryProps> = ({ allSpreads, onSelectSpread, onCreateSpread, onDeleteSpread, onBack }) => {
    const [showLab, setShowLab] = useState(false);
    const groupedSpreads = groupSpreadsByTheme(allSpreads);
    const themeOrder = ["Custom", "General Guidance", "Self-Reflection", "Personal Growth", "Love & Relationships", "Career & Work", "Decision Making", "Problem Solving"].filter(theme => groupedSpreads[theme]);

    return (
        <div className="w-full max-w-5xl mx-auto p-4 md:p-8 animate-fade-in">
            <div className="flex justify-between items-center mb-8">
                 <button onClick={onBack} className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">&larr; Back to Journal</button>
                 <button onClick={() => setShowLab(!showLab)} className="px-4 py-2 border border-gray-800 dark:border-gray-200 text-gray-800 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 hover:text-white dark:hover:text-gray-900 transition-colors duration-300">
                    {showLab ? 'Close Laboratory' : 'Spread Laboratory'}
                 </button>
            </div>
             <h2 className="font-serif-brand text-3xl text-gray-900 dark:text-gray-100 uppercase tracking-wider text-center mb-10">
                The Spread Library
             </h2>

             {showLab && <SpreadLab onSave={onCreateSpread} onCancel={() => setShowLab(false)} />}
             
             <div className="space-y-12 mt-8">
                {themeOrder.map(theme => (
                    <section key={theme}>
                        <h3 className="font-serif-display text-2xl text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2 mb-6">{theme}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {groupedSpreads[theme].map((spread) => (
                                <div key={spread.spreadName} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-lg flex flex-col text-left hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                                    <div className="flex-grow cursor-pointer" onClick={() => onSelectSpread(spread)}>
                                        <h4 className="text-xl font-serif-display text-gray-900 dark:text-gray-100">{spread.spreadName}</h4>
                                        <p className="text-gray-500 dark:text-gray-400 mt-3 text-sm flex-grow">{spread.description}</p>
                                    </div>
                                    <div className="flex justify-between items-center mt-4">
                                        <span className="text-xs font-semibold text-gray-400 dark:text-gray-500">{spread.numberOfCards} CARDS</span>
                                        {spread.isCustom && (
                                            <button 
                                                onClick={() => onDeleteSpread(spread.spreadName)} 
                                                className="text-xs text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                ))}
             </div>
        </div>
    );
};

export default SpreadLibrary;
