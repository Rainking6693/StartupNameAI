import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';

// Context Providers
import { AuthProvider } from './contexts/AuthContext';
import { NamingProvider } from './contexts/NamingContext';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';

// Pages
import LandingPage from './components/LandingPage';
import NamingTool from './pages/NamingTool';
import Results from './pages/Results';
import Pricing from './pages/Pricing';
import About from './pages/About';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';

// Styles
import './styles/globals.css';
import './styles/tailwind.css';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <Router>
          <AuthProvider>
            <NamingProvider>
              <div className="min-h-screen bg-white flex flex-col">
                <Header />
                
                <main className="flex-grow">
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/naming-tool" element={<NamingTool />} />
                    <Route path="/results" element={<Results />} />
                    <Route path="/pricing" element={<Pricing />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/contact" element={<Contact />} />
                    
                    {/* Auth Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    
                    {/* Protected Routes */}
                    <Route path="/dashboard" element={<Dashboard />} />
                    
                    {/* 404 Route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                
                <Footer />
                
                {/* Toast Notifications */}
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: '#1e40af',
                      color: '#ffffff',
                      borderRadius: '8px',
                      padding: '16px',
                    },
                    success: {
                      style: {
                        background: '#059669',
                      },
                    },
                    error: {
                      style: {
                        background: '#dc2626',
                      },
                    },
                  }}
                />
              </div>
            </NamingProvider>
          </AuthProvider>
        </Router>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

// 404 Component
const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center px-4">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-blue-800 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="space-y-4">
          <a
            href="/"
            className="inline-block bg-blue-800 text-white px-6 py-3 rounded-lg hover:bg-blue-900 transition-colors"
          >
            Back to Home
          </a>
          <div className="text-sm text-gray-500">
            <a href="/naming-tool" className="hover:text-blue-800">Try the Naming Tool</a>
            {' • '}
            <a href="/contact" className="hover:text-blue-800">Contact Support</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;