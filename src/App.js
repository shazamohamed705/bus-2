import React from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import Home from './components/Home';
import LanguageChangeNotification from './components/LanguageChangeNotification';

function App() {
  return (
    <LanguageProvider>
      <div 
        className="w-full" 
        style={{ 
          margin: 0, 
          padding: 0, 
          minHeight: '100vh', 
          overflowY: 'auto', 
          overflowX: 'hidden',
          willChange: 'scroll-position',
          WebkitOverflowScrolling: 'touch' // Smooth scrolling on iOS
        }}
      >
        <Home />
        <LanguageChangeNotification />
      </div>
    </LanguageProvider>
  );
}

export default App;
