import React, { useState } from 'react';

interface DailyCheckinProps {
  task: string;
  onClear: () => void;
}

const DailyCheckin: React.FC<DailyCheckinProps> = ({ task, onClear }) => {
  const [completed, setCompleted] = useState(false);

  const handleToggle = () => {
    if (!completed) {
      setCompleted(true);
      setTimeout(() => {
        onClear();
      }, 1000); 
    }
  };

  return (
    <div className={`fixed bottom-4 right-4 w-full max-w-sm p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl transition-all duration-500 ${task ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'} ${completed ? 'opacity-0' : ''}`}>
      <h3 className="font-serif-display text-lg text-gray-800 dark:text-gray-200">Daily Check-in</h3>
      <p className="text-gray-600 dark:text-gray-400 mt-2">{task}</p>
      <div className="mt-4 flex justify-end">
        <button
          onClick={handleToggle}
          className="text-sm font-semibold text-white bg-gray-900 dark:bg-gray-700 px-4 py-1 rounded-full hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default DailyCheckin;
