import React from 'react';
import { useLanguage } from '../hooks/useLanguage';

export const LanguageToggle: React.FC = () => {
  const { language, t, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="fixed top-4 right-4 z-50 bg-white/10 backdrop-blur-md border border-white/20 
                 rounded-full px-4 py-2 text-white font-semibold text-sm
                 hover:bg-white/20 hover:scale-105 transition-all duration-300
                 active:scale-95 shadow-lg hover:shadow-xl"
      aria-label={`Switch to ${language === 'ar' ? 'French' : 'Arabic'}`}
    >
      {t.languageToggle}
    </button>
  );
};