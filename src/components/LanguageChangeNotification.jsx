import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageChangeNotification = () => {
  const { language } = useLanguage();
  const [showNotification, setShowNotification] = useState(false);
  const prevLanguageRef = useRef(language);
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      prevLanguageRef.current = language;
      return;
    }

    // Check if language changed
    if (language !== prevLanguageRef.current) {
      setShowNotification(true);
      prevLanguageRef.current = language;
      
      // Hide notification after 800 milliseconds (faster)
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [language]);

  if (!showNotification) return null;

  const isRTL = language === 'ar' || language === 'ur';

  const messages = {
    ar: 'جاري تحويل اللغة إلى العربية...',
    en: 'Switching language to English...',
    ur: 'زبان اردو میں تبدیل ہو رہی ہے...'
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        direction: isRTL ? 'rtl' : 'ltr',
        animation: 'fadeIn 0.3s ease-in-out'
      }}
    >
      {/* Loading Spinner */}
      <div
        style={{
          width: '60px',
          height: '60px',
          border: '6px solid #f3f3f3',
          borderTop: '6px solid #84D29A',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '30px'
        }}
      />
      
      {/* Message */}
      <p
        style={{
          fontSize: '24px',
          fontWeight: '600',
          color: '#333',
          margin: 0,
          fontFamily: 'Tajawal, sans-serif',
          textAlign: 'center',
          padding: '0 20px'
        }}
      >
        {messages[language]}
      </p>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default LanguageChangeNotification;

