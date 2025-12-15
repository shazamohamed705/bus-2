import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Get saved language from localStorage or default to Arabic
    return localStorage.getItem('appLanguage') || 'ar';
  });

  useEffect(() => {
    // Save language preference to localStorage
    localStorage.setItem('appLanguage', language);
    // Update document direction for RTL languages
    const isRTL = language === 'ar' || language === 'ur';
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    // Add class to body for RTL styling
    document.body.classList.remove('rtl', 'ltr');
    document.body.classList.add(isRTL ? 'rtl' : 'ltr');
  }, [language]);

  const changeLanguage = (lang) => {
    setLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

