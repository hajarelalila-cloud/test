import { useState, useEffect } from 'react';
import { translations, Translation } from '../i18n/translations';

export type Language = 'ar' | 'fr';

export const useLanguage = () => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'ar';
  });

  const t: Translation = translations[language];

  const toggleLanguage = () => {
    const newLanguage: Language = language === 'ar' ? 'fr' : 'ar';
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  useEffect(() => {
    document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  return { language, t, toggleLanguage };
};