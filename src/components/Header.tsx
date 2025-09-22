import React from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  const { t } = useLanguage();

  return (
    <header className="relative z-10 text-center py-8 px-4">
      <div className="flex items-center justify-center gap-3 mb-2">
        <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse" />
        <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-2xl">
          {t.mainTitle}
        </h1>
        <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse" />
      </div>
      <p className="text-xl md:text-2xl text-white/90 drop-shadow-lg max-w-3xl mx-auto">
        {t.subtitle}
      </p>
    </header>
  );
};