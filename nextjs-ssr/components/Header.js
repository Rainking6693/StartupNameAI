import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Menu, X, Zap, Brain, Star, Grid, FileText, Phone, DollarSign, HelpCircle, ChevronDown } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [industryMenuOpen, setIndustryMenuOpen] = useState(false);
  const router = useRouter();
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
  }, [router.pathname]);

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

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
        setIndustryMenuOpen(false);
      }
    };

    if (isMenuOpen || industryMenuOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isMenuOpen, industryMenuOpen]);

  // Navigation items
  const navItems = [
    { href: '/features', label: 'Features', icon: Star },
    { href: '/pricing', label: 'Pricing', icon: DollarSign },
    { href: '/how-it-works', label: 'How It Works', icon: Brain },
    { href: '/examples', label: 'Examples', icon: Grid },
    { href: '/faq', label: 'FAQ', icon: HelpCircle },
    { href: '/contact', label: 'Contact', icon: Phone }
  ];

  // Industry-specific pages for dropdown
  const industryPages = [
    { href: '/tech-startup-names', label: 'Tech Startups', description: 'Names for technology companies' },
    { href: '/saas-startup-names', label: 'SaaS Startups', description: 'Software-as-a-Service businesses' },
    { href: '/fintech-startup-names', label: 'Fintech Startups', description: 'Financial technology companies' },
    { href: '/healthcare-startup-names', label: 'Healthcare Startups', description: 'Medical & health companies' },
    { href: '/ai-startup-names', label: 'AI Startups', description: 'Artificial intelligence ventures' },
    { href: '/ecommerce-startup-names', label: 'Ecommerce Startups', description: 'Online retail businesses' }
  ];

  const isActivePage = (href) => router.pathname === href;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-slate-200/60'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center transform transition-transform group-hover:rotate-3 group-hover:scale-105">
                <Zap className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <div className="hidden sm:block">
              <span className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                StartupNamer
              </span>
              <div className="text-xs text-slate-500 font-medium tracking-wider">
                AI NAMING AUTHORITY
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <a
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActivePage(item.href)
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </a>
                </Link>
              );
            })}

            {/* Industry Dropdown */}
            <div className="relative" ref={industryMenuRef}>
              <button
                onClick={() => setIndustryMenuOpen(!industryMenuOpen)}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition-all duration-200"
                aria-expanded={industryMenuOpen}
                aria-haspopup="true"
              >
                <FileText className="w-4 h-4" />
                <span>Industries</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${industryMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {industryMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-200/60 py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <h3 className="text-sm font-semibold text-slate-900">Industry-Specific Names</h3>
                    <p className="text-xs text-slate-500 mt-1">Specialized naming for different sectors</p>
                  </div>
                  <div className="py-2">
                    {industryPages.map((page) => (
                      <Link key={page.href} href={page.href}>
                        <a className="block px-4 py-3 hover:bg-slate-50 transition-colors">
                          <div className="text-sm font-medium text-slate-900">{page.label}</div>
                          <div className="text-xs text-slate-500 mt-1">{page.description}</div>
                        </a>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* CTA Button */}
            <Link href="/naming-tool">
              <a className="ml-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                Generate Names
              </a>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition-all duration-200"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div
            id="mobile-menu"
            ref={mobileMenuRef}
            className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg shadow-xl border-b border-slate-200/60"
          >
            <div className="px-4 py-6 space-y-4">
              {/* Mobile CTA */}
              <Link href="/naming-tool">
                <a className="block w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold text-center shadow-lg">
                  🚀 Generate Names
                </a>
              </Link>

              {/* Mobile Navigation Items */}
              <div className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.href} href={item.href}>
                      <a
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                          isActivePage(item.href)
                            ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-600'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </a>
                    </Link>
                  );
                })}
              </div>

              {/* Mobile Industry Section */}
              <div className="border-t border-slate-200 pt-4">
                <h3 className="text-sm font-semibold text-slate-900 px-4 mb-3">Industry-Specific Names</h3>
                <div className="space-y-1">
                  {industryPages.map((page) => (
                    <Link key={page.href} href={page.href}>
                      <a className="block px-4 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
                        {page.label}
                      </a>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Mobile Blog Link */}
              <div className="border-t border-slate-200 pt-4">
                <Link href="/blog">
                  <a className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors">
                    <FileText className="w-5 h-5" />
                    <span>Blog</span>
                  </a>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;