import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import LandingPage from './components/LandingPage';
import NamingTool from './components/NamingTool';
import NameResults from './components/NameResults';
import './App.css';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Main landing page */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Interactive naming tool */}
            <Route path="/naming-tool" element={<NamingTool />} />
            
            {/* Results display */}
            <Route path="/results/:sessionId" element={<NameResults />} />
            
            {/* Future pages */}
            <Route path="/about" element={
              <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-white mb-4">About StartupNamer.org</h1>
                  <p className="text-white/80 text-lg">Coming Soon!</p>
                </div>
              </div>
            } />
            
            <Route path="/pricing" element={
              <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-white mb-4">Pricing</h1>
                  <p className="text-white/80 text-lg">Coming Soon!</p>
                </div>
              </div>
            } />
            
            {/* 404 Page */}
            <Route path="*" element={
              <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-white mb-4">404</h1>
                  <p className="text-white/80 text-xl mb-8">Page not found</p>
                  <button 
                    onClick={() => window.location.href = '/'}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                  >
                    Go Home
                  </button>
                </div>
              </div>
            } />
          </Routes>
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;