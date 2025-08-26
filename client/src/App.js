import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import LandingPage from './components/LandingPage';
import NamingTool from './components/NamingTool';
import NameResults from './components/NameResults';
import './App.css';

// Payment placeholder component
const PaymentPage = () => (
  <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-amber-50 flex items-center justify-center">
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
      <h1 className="text-3xl font-bold text-slate-800 mb-4">Payment Processing</h1>
      <p className="text-slate-600 mb-6">Secure payment integration coming soon!</p>
      <button
        onClick={() => window.history.back()}
        className="w-full bg-sky-500 hover:bg-sky-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
      >
        Go Back
      </button>
    </div>
  </div>
);

// 404 Error component
const NotFoundPage = () => (
  <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-amber-50 flex items-center justify-center">
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8 max-w-md w-full mx-4 text-center">
      <h1 className="text-6xl font-bold text-sky-500 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-slate-800 mb-4">Page Not Found</h2>
      <p className="text-slate-600 mb-6">The page you're looking for doesn't exist.</p>
      <a
        href="/"
        className="inline-block bg-sky-500 hover:bg-sky-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
      >
        Return Home
      </a>
    </div>
  </div>
);

function App() {
  return (
    <HelmetProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/naming-tool" element={<NamingTool />} />
            <Route path="/results/:sessionId" element={<NameResults />} />
            <Route path="/payment/:packageId" element={<PaymentPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;