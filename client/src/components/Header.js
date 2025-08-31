import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Zap, Brain, Star, Grid, FileText, Phone, DollarSign, HelpCircle } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Handle keyboard navigation
  const handleKeyDown = (event, action) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const mainNavLinks = [
    { to: '/naming-tool', label: 'Name Generator', icon: Zap },
    { to: '/features', label: 'Features', icon: Star },
    { to: '/examples', label: 'Examples', icon: Grid },
    { to: '/how-it-works', label: 'How It Works', icon: Brain },
    { to: '/pricing', label: 'Pricing', icon: DollarSign },
  ];

  const secondaryNavLinks = [
    { to: '/blog', label: 'Blog', icon: FileText },
    { to: '/faq', label: 'FAQ', icon: HelpCircle },
    { to: '/contact', label: 'Contact', icon: Phone },
  ];

  const industryLinks = [
    { to: '/tech-startup-names', label: 'Tech Startups' },
    { to: '/saas-startup-names', label: 'SaaS Startups' },
    { to: '/fintech-startup-names', label: 'Fintech' },
    { to: '/healthcare-startup-names', label: 'Healthcare' },
    { to: '/ai-startup-names', label: 'AI Startups' },
    { to: '/ecommerce-startup-names', label: 'E-commerce' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200/50' 
          : 'bg-transparent'
      }`}
      role="banner"
    >
      {/* Skip Navigation Link for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium"
      >
        Skip to main content
      </a>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" role="navigation" aria-label="Main navigation">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo and Brand */}
          <div className="flex-shrink-0">
            <Link 
              to="/" 
              className="group flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg p-1 transition-all duration-200"
              aria-label="StartupNamer.org - Go to homepage"
            >
              <div className="relative">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                  <Zap className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </div>
              <div className="hidden sm:block">
                <span className={`text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-purple-700 transition-all duration-200 ${
                  !isScrolled && location.pathname === '/' ? 'text-white' : ''
                }`}>
                  StartupNamer
                </span>
                <span className={`text-sm lg:text-base font-medium ml-1 ${
                  !isScrolled && location.pathname === '/' ? 'text-white/80' : 'text-gray-600'
                }`}>
                  .org
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-8">
            {mainNavLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`group relative flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  location.pathname === to
                    ? 'bg-blue-600 text-white shadow-lg'
                    : !isScrolled && location.pathname === '/'
                    ? 'text-white hover:text-blue-200 hover:bg-white/10'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
                {location.pathname !== to && (
                  <div className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></div>
                )}
              </Link>
            ))}
            
            {/* CTA Button */}
            <Link
              to="/naming-tool"
              className="ml-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full font-semibold text-sm hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg"
            >
              Generate Names
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            onKeyDown={(e) => handleKeyDown(e, toggleMenu)}
            className={`lg:hidden p-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              !isScrolled && location.pathname === '/' 
                ? 'text-white hover:bg-white/10' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            aria-label={isMenuOpen ? 'Close mobile menu' : 'Open mobile menu'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          id="mobile-menu"
          className={`lg:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen
              ? 'max-h-screen opacity-100'
              : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 mt-4 p-6">
            {/* Main Navigation */}
            <div className="space-y-1">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Main Navigation
              </h3>
              {mainNavLinks.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    location.pathname === to
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                </Link>
              ))}
            </div>

            {/* Secondary Navigation */}
            <div className="space-y-1 mt-6">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Resources
              </h3>
              {secondaryNavLinks.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    location.pathname === to
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                </Link>
              ))}
            </div>

            {/* Industry Links */}
            <div className="space-y-1 mt-6">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                By Industry
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {industryLinks.map(({ to, label }) => (
                  <Link
                    key={to}
                    to={to}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      location.pathname === to
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50 text-center'
                    }`}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile CTA */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <Link
                to="/naming-tool"
                className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center px-6 py-4 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg"
              >
                🚀 Start Generating Names
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;