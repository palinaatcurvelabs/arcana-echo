
import React from 'react';

interface SpinnerProps {
  message: string;
}

const Spinner: React.FC<SpinnerProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center text-gray-900 dark:text-gray-100">
      <div className="w-12 h-12 border-4 border-gray-200 dark:border-gray-700 border-t-gray-800 dark:border-t-gray-100 rounded-full animate-spin mb-4"></div>
      <p className="font-serif-display text-xl">{message}</p>
    </div>
  );
};

export default Spinner;
