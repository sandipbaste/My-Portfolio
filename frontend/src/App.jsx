import React from 'react';
import Portfolio from './components/Portfolio';
import Chatbot from './components/Chatbot';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Portfolio />
      <Chatbot />
    </div>
  );
}

export default App;