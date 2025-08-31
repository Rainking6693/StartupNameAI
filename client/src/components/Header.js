import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Zap, Brain, Star, Grid, FileText, Phone, DollarSign, HelpCircle, ChevronDown } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [industryMenuOpen, setIndustryMenuOpen] = useState(false);
  const location = useLocation();
  const mobileMenuRef = useRef(null);
  const industryMenuRef = useRef(null);

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
    setIndustryMenuOpen(false);
  }, [location]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
      if (industryMenuRef.current && !industryMenuRef.current.contains(event.target)) {
        setIndustryMenuOpen(false);
      }
    };

    if (isMenuOpen || industryMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isMenuOpen, industryMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isMenuOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (event, action) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIndustryMenuOpen(false); // Close industry menu when main menu toggles
  };

  const toggleIndustryMenu = () => {
    setIndustryMenuOpen(!industryMenuOpen);
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
    <>
      <header 
        className={`mobile-header ${
          isScrolled 
            ? 'bg-white/98 backdrop-blur-xl shadow-lg border-b border-slate-200/60' 
            : 'bg-transparent'
        }`}
        role="banner"
      >
        {/* Skip Navigation Link for Accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 btn btn-primary text-sm font-medium"
          style={{ zIndex: 9999 }}
        >
          Skip to main content
        </a>

        <nav className="container flex items-center justify-between" role="navigation" aria-label="Main navigation">
          {/* Logo and Brand - Mobile Optimized */}
          <div className="flex-shrink-0">
            <Link 
              to="/" 
              className="group flex items-center gap-sm touch-target focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg transition-all duration-200 p-1"
              aria-label="StartupNamer.org - Go to homepage"
            >
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200 shadow-md">
                  <Zap className="w-6 h-6 text-white" aria-hidden="true" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" aria-hidden="true"></div>
              </div>
              <div className="hidden sm:block">
                <span className={`text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-purple-700 transition-all duration-200 ${
                  !isScrolled && location.pathname === '/' ? 'text-white' : ''
                }`}>
                  StartupNamer
                </span>
                <span className={`text-sm font-medium ml-1 ${
                  !isScrolled && location.pathname === '/' ? 'text-white/80' : 'text-slate-600'
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

          {/* Mobile Menu Button - Enhanced */}
          <button
            onClick={toggleMenu}
            onKeyDown={(e) => handleKeyDown(e, toggleMenu)}
            className={`mobile-menu-btn lg:hidden ${
              !isScrolled && location.pathname === '/' 
                ? 'text-white hover:bg-white/10' 
                : 'text-slate-700 hover:bg-slate-100'
            }`}
            aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-haspopup="menu"
          >
            <span className="sr-only">
              {isMenuOpen ? 'Close' : 'Open'} navigation menu
            </span>
            {isMenuOpen ? (
              <X className="w-6 h-6" aria-hidden="true" />
            ) : (
              <Menu className="w-6 h-6" aria-hidden="true" />
            )}
          </button>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <div 
        className={`mobile-menu-overlay ${isMenuOpen ? 'active' : ''}`}
        onClick={() => setIsMenuOpen(false)}
        aria-hidden={!isMenuOpen}
      />

      {/* Enhanced Mobile Menu */}
      <div
        ref={mobileMenuRef}
        id="mobile-menu"
        className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}
        role="navigation"
        aria-label="Mobile navigation menu"
        aria-hidden={!isMenuOpen}
      >
        {/* Mobile Menu Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-md">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" aria-hidden="true" />
            </div>
            <span className="font-bold text-lg text-slate-800">Menu</span>
          </div>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="mobile-menu-btn"
            aria-label="Close navigation menu"
          >
            <X className="w-6 h-6" aria-hidden="true" />
          </button>
        </div>

        {/* Main Navigation */}
        <div className="space-y-sm mb-6">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Main Navigation
          </h3>
          {mainNavLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`mobile-menu-link ${
                location.pathname === to ? 'active' : ''
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Icon className="w-5 h-5" aria-hidden="true" />
              <span>{label}</span>
            </Link>
          ))}
        </div>

        {/* Secondary Navigation */}
        <div className="space-y-sm mb-6">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Resources
          </h3>
          {secondaryNavLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`mobile-menu-link ${
                location.pathname === to ? 'active' : ''
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Icon className="w-5 h-5" aria-hidden="true" />
              <span>{label}</span>
            </Link>
          ))}
        </div>

        {/* Industry Links with Expandable Menu */}
        <div className="space-y-sm mb-6">
          <button
            onClick={toggleIndustryMenu}
            className="flex items-center justify-between w-full text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 touch-target"
            aria-expanded={industryMenuOpen}
            aria-controls="industry-submenu"
          >
            <span>By Industry</span>
            <ChevronDown 
              className={`w-4 h-4 transition-transform duration-200 ${
                industryMenuOpen ? 'transform rotate-180' : ''
              }`} 
              aria-hidden="true" 
            />
          </button>
          <div
            ref={industryMenuRef}
            id="industry-submenu"
            className={`grid grid-cols-2 gap-2 transition-all duration-300 ${
              industryMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
            }`}
          >
            {industryLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-center touch-target ${
                  location.pathname === to
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50 border border-slate-200'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile CTA */}
        <div className="border-t border-slate-200 pt-6 mt-auto">
          <Link
            to="/naming-tool"
            className="btn btn-primary btn-lg btn-mobile-full mb-4"
            onClick={() => setIsMenuOpen(false)}
          >
            <Zap className="w-5 h-5" aria-hidden="true" />
            <span>Start Generating Names</span>
          </Link>
          <p className="text-xs text-slate-500 text-center">
            Trusted by 10,000+ entrepreneurs worldwide
          </p>
        </div>
      </div>
    </>
  );
};

export default Header;