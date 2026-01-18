import React, { useState } from 'react';

interface JournalInputProps {
  onSubmit: (entry: string) => void;
  isLoading: boolean;
}

const JournalInput: React.FC<JournalInputProps> = ({ onSubmit, isLoading }) => {
  const [entry, setEntry] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (entry.trim() && !isLoading) {
      onSubmit(entry);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 md:p-8">
      <h2 className="font-serif-display text-3xl text-gray-900 dark:text-gray-100 text-center mb-2">
        How do you feel today?
      </h2>
       <p className="text-gray-500 dark:text-gray-400 text-center mb-6">Write a journal entry for a personalized reading.</p>
      <form onSubmit={handleSubmit}>
        <textarea
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          placeholder="Let your thoughts flow freely. What's on your mind? What energies are surrounding you today?"
          className="w-full h-48 p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:border-transparent focus:outline-none transition-all duration-300 resize-none placeholder-gray-400 dark:placeholder-gray-500"
          disabled={isLoading}
        />
        <div className="text-center mt-6">
          <button
            type="submit"
            disabled={!entry.trim() || isLoading}
            className="px-8 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 font-medium rounded-lg hover:bg-gray-700 dark:hover:bg-gray-300 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed disabled:text-gray-500 dark:disabled:text-gray-500 transition-all duration-300 shadow-lg shadow-gray-500/10 dark:shadow-black/20 hover:shadow-gray-500/20 dark:hover:shadow-black/40 transform hover:-translate-y-0.5"
          >
            {isLoading ? 'Analyzing...' : 'Reveal My Path'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default JournalInput;
