import React from 'react';
import Home from './components/Home';

function App() {
  return (
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
    </div>
  );
}

export default App;
