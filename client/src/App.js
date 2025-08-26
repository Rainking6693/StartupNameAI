import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import LandingPage from './components/LandingPage';
import './App.css';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            {/* Future routes */}
            <Route path="/naming-tool" element={<div className="min-h-screen bg-gray-100 flex items-center justify-center"><h1 className="text-4xl font-bold text-gray-800">Naming Tool Coming Soon!</h1></div>} />
            <Route path="/results/:sessionId" element={<div className="min-h-screen bg-gray-100 flex items-center justify-center"><h1 className="text-4xl font-bold text-gray-800">Results Coming Soon!</h1></div>} />
          </Routes>
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;