import React, { useState } from 'react';
import type { UserProfile } from '../types';

interface ProfileProps {
  userProfile: UserProfile | null;
  onSave: (profile: UserProfile) => void;
  onClose: () => void;
}

const FOCUS_AREAS = [
  { id: 'career', label: 'Career & Purpose', icon: '✦' },
  { id: 'relationships', label: 'Love & Relationships', icon: '♡' },
  { id: 'self-growth', label: 'Personal Growth', icon: '↑' },
  { id: 'creativity', label: 'Creativity & Expression', icon: '◈' },
  { id: 'healing', label: 'Healing & Shadow Work', icon: '☽' },
  { id: 'decisions', label: 'Decisions & Clarity', icon: '⊕' },
  { id: 'spirituality', label: 'Spiritual Path', icon: '✧' },
  { id: 'abundance', label: 'Money & Abundance', icon: '◇' },
];

const READING_STYLES = [
  { id: 'direct', label: 'Direct', description: 'Clear, straightforward insights. No fluff.' },
  { id: 'gentle', label: 'Gentle', description: 'Compassionate, supportive guidance.' },
  { id: 'poetic', label: 'Poetic', description: 'Mystical, metaphor-rich language.' },
];

const Profile: React.FC<ProfileProps> = ({ userProfile, onSave, onClose }) => {
  const [profileData, setProfileData] = useState<UserProfile>(
    userProfile || { 
      name: '',
      createdAt: new Date().toISOString(),
      focusAreas: [],
      readingStyle: 'gentle',
      intentions: '',
    }
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...profileData,
      createdAt: profileData.createdAt || new Date().toISOString(),
    });
  };

  const toggleFocusArea = (areaId: string) => {
    setProfileData(prev => ({
      ...prev,
      focusAreas: prev.focusAreas.includes(areaId)
        ? prev.focusAreas.filter(a => a !== areaId)
        : [...prev.focusAreas, areaId]
    }));
  };

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div 
        className="w-full max-w-lg mx-4 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-8">
          <h2 className="font-serif-brand text-2xl text-gray-900 dark:text-gray-100 uppercase tracking-wider">
            Your Profile
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
            Help Arcana understand you better
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              What should I call you?
            </label>
            <input 
              type="text" 
              value={profileData.name}
              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              placeholder="Your name or nickname"
              className="w-full p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-gray-400 focus:outline-none transition-all"
            />
          </div>

          {/* Focus Areas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              What areas are you exploring right now?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {FOCUS_AREAS.map(area => (
                <button
                  key={area.id}
                  type="button"
                  onClick={() => toggleFocusArea(area.id)}
                  className={`p-3 rounded-xl border text-left transition-all duration-200 ${
                    profileData.focusAreas.includes(area.id)
                      ? 'border-gray-900 dark:border-gray-100 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-400 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span className="mr-2">{area.icon}</span>
                  <span className="text-sm">{area.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Reading Style */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              How would you like Arcana to speak to you?
            </label>
            <div className="space-y-2">
              {READING_STYLES.map(style => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setProfileData({ ...profileData, readingStyle: style.id as UserProfile['readingStyle'] })}
                  className={`w-full p-4 rounded-xl border text-left transition-all duration-200 ${
                    profileData.readingStyle === style.id
                      ? 'border-gray-900 dark:border-gray-100 bg-gray-50 dark:bg-gray-700'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 dark:text-gray-100">{style.label}</span>
                    {profileData.readingStyle === style.id && (
                      <span className="text-gray-900 dark:text-gray-100">✓</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{style.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Current Intentions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              What are you working through in life right now?
            </label>
            <textarea
              value={profileData.intentions}
              onChange={(e) => setProfileData({ ...profileData, intentions: e.target.value })}
              placeholder="Share what's on your mind, what you're navigating, or what you're hoping to understand better..."
              rows={4}
              className="w-full p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-gray-400 focus:outline-none transition-all resize-none placeholder-gray-400 dark:placeholder-gray-500"
            />
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              This helps Arcana give you more relevant guidance
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 font-medium rounded-xl hover:bg-gray-700 dark:hover:bg-gray-300 transition-all shadow-lg"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
