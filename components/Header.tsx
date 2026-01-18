import React, { useState } from 'react';
import type { AppView } from '../types';
import { useTheme } from '../ThemeContext';

interface HeaderProps {
  onSetView: (view: AppView) => void;
  onSignOut?: () => void;
  userEmail?: string;
}

const Header: React.FC<HeaderProps> = ({ onSetView, onSignOut, userEmail }) => {
  const { theme, toggleTheme } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="flex justify-between items-center p-4 md:p-6 border-b border-gray-200 dark:border-[#1c1c1c] bg-white dark:bg-[#0a0a0a] transition-colors duration-300">
      <button onClick={() => onSetView('APP')}>
        <h1 className="font-serif-brand text-2xl text-gray-900 dark:text-white tracking-widest uppercase">
          Arcana Echo
        </h1>
      </button>
      <nav className="flex items-center space-x-2 md:space-x-4">
        <button
          onClick={toggleTheme}
          className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#1a1a1a] rounded-full transition-colors duration-300"
          aria-label="Toggle Dark Mode"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? (
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
        <button
          onClick={() => onSetView('SPREAD_LIBRARY')}
          className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-300 font-medium text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-gray-400 rounded px-2 py-1"
          aria-label="View Spread Library"
        >
          Spreads
        </button>
        <button
          onClick={() => onSetView('HISTORY')}
          className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-300 font-medium text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-gray-400 rounded px-2 py-1"
          aria-label="View history"
        >
          History
        </button>
         {/* Live conversation disabled - API limits */}
         <button
          disabled
          className="p-2 text-gray-300 dark:text-gray-600 cursor-not-allowed opacity-50 rounded-full hidden md:block"
          aria-label="Live reading coming soon"
          title="Coming soon ✨"
        >
           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </button>
        
        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#1a1a1a] rounded-full transition-colors duration-300"
            aria-label="Open profile"
            title="Profile"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#111111] border border-gray-200 dark:border-[#1c1c1c] rounded-xl shadow-xl z-50 overflow-hidden">
              {userEmail && (
                <div className="px-4 py-3 border-b border-gray-100 dark:border-[#1c1c1c]">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Signed in as</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{userEmail}</p>
                </div>
              )}
              <div className="py-1">
                <button
                  onClick={() => {
                    onSetView('PROFILE');
                    setShowUserMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1a1a1a] transition-colors"
                >
                  Your Profile
                </button>
                <button
                  onClick={() => {
                    onSetView('YOUR_CARDS');
                    setShowUserMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1a1a1a] transition-colors"
                >
                  Your Cards
                </button>
                {onSignOut && (
                  <button
                    onClick={() => {
                      onSignOut();
                      setShowUserMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-[#1a1a1a] transition-colors"
                  >
                    Sign Out
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
      
      {/* Click outside to close */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </header>
  );
};

export default Header;
