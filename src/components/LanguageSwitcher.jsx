import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { FaGlobe } from 'react-icons/fa';

const LanguageSwitcher = () => {
  const { language, changeLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  const dropdownRef = useRef(null);
  const isRTL = language === 'ar' || language === 'ur';

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const languages = [
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ur', name: 'اردو', flag: '🇵🇰' }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLanguageChange = (langCode) => {
    changeLanguage(langCode);
    setIsOpen(false);
  };

  const currentLanguage = languages.find(lang => lang.code === language) || languages[0];

  return (
    <div 
      ref={dropdownRef}
      className="fixed top-5 z-50"
      style={{
        position: 'fixed',
        top: isMobile ? '16px' : '20px',
        [isRTL ? 'right' : 'left']: isMobile ? '16px' : '20px',
        zIndex: 50
      }}
    >
      {/* Language Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white rounded-full p-3 shadow-lg flex items-center justify-center hover:scale-110 hover:shadow-xl transition-all duration-300"
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '50%',
          padding: isMobile ? '10px' : '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          width: isMobile ? '40px' : '48px',
          height: isMobile ? '40px' : '48px'
        }}
        aria-label="Change language"
        onMouseEnter={(e) => {
          if (!isMobile) {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        }}
      >
        <FaGlobe 
          size={isMobile ? 18 : 22} 
          style={{ 
            color: '#333'
          }} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl overflow-hidden min-w-[160px]"
          style={{
            position: 'absolute',
            top: '100%',
            [isRTL ? 'right' : 'left']: 0,
            marginTop: '8px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
            overflow: 'hidden',
            minWidth: isMobile ? '160px' : '180px',
            animation: 'fadeIn 0.2s ease-in-out'
          }}
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-100 transition-colors duration-200 ${
                language === lang.code ? 'bg-green-50' : ''
              }`}
              style={{
                width: '100%',
                padding: isMobile ? '10px 14px' : '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                backgroundColor: language === lang.code ? '#f0fdf4' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
                textAlign: isRTL ? 'right' : 'left',
                direction: isRTL ? 'rtl' : 'ltr'
              }}
              onMouseEnter={(e) => {
                if (language !== lang.code) {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                }
              }}
              onMouseLeave={(e) => {
                if (language !== lang.code) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <span style={{ fontSize: isMobile ? '20px' : '24px' }}>{lang.flag}</span>
              <span 
                style={{ 
                  fontSize: isMobile ? '12px' : '14px',
                  fontWeight: language === lang.code ? '600' : '400',
                  color: language === lang.code ? '#16a34a' : '#333'
                }}
              >
                {lang.name}
              </span>
              {language === lang.code && (
                <span style={{ [isRTL ? 'marginRight' : 'marginLeft']: 'auto', color: '#16a34a', fontSize: isMobile ? '10px' : '12px' }}>✓</span>
              )}
            </button>
          ))}
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default LanguageSwitcher;

