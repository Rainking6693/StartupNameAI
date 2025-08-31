import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Twitter, Linkedin, Github, Mail, Heart, ArrowUp } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleKeyDown = (event, action) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };

  const mainNavLinks = [
    { to: '/', label: 'Home' },
    { to: '/naming-tool', label: 'Name Generator' },
    { to: '/features', label: 'Features' },
    { to: '/examples', label: 'Examples' },
    { to: '/how-it-works', label: 'How It Works' },
    { to: '/pricing', label: 'Pricing' },
  ];

  const resourceLinks = [
    { to: '/blog', label: 'Blog' },
    { to: '/faq', label: 'FAQ' },
    { to: '/contact', label: 'Contact Support' },
  ];

  const industryLinks = [
    { to: '/tech-startup-names', label: 'Tech Startup Names' },
    { to: '/saas-startup-names', label: 'SaaS Startup Names' },
    { to: '/fintech-startup-names', label: 'Fintech Names' },
    { to: '/healthcare-startup-names', label: 'Healthcare Names' },
    { to: '/ai-startup-names', label: 'AI Startup Names' },
    { to: '/ecommerce-startup-names', label: 'E-commerce Names' },
  ];

  const legalLinks = [
    { to: '/privacy-policy', label: 'Privacy Policy' },
    { to: '/terms-of-service', label: 'Terms of Service' },
  ];

  const socialLinks = [
    {
      href: 'https://twitter.com/startupnamer',
      label: 'Follow us on Twitter',
      icon: Twitter,
      external: true
    },
    {
      href: 'https://linkedin.com/company/startupnamer',
      label: 'Connect on LinkedIn',
      icon: Linkedin,
      external: true
    },
    {
      href: 'https://github.com/startupnamer',
      label: 'View our GitHub',
      icon: Github,
      external: true
    },
    {
      href: 'mailto:hello@startupnamer.org',
      label: 'Send us an email',
      icon: Mail,
      external: false
    },
  ];

  return (
    <footer className="bg-slate-900 text-white relative overflow-hidden" role="contentinfo">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900/20 to-purple-900/20"></div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            
            {/* Brand and Description */}
            <div className="lg:col-span-1">
              <Link 
                to="/" 
                className="group flex items-center space-x-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 rounded-lg p-1"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  StartupNamer.org
                </span>
              </Link>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                The ultimate AI-powered startup name generator. Create memorable, brandable names that capture your vision and resonate with your audience.
              </p>
              
              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map(({ href, label, icon: Icon, external }) => (
                  external ? (
                    <a
                      key={href}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                      aria-label={label}
                    >
                      <Icon className="w-4 h-4 text-slate-400 hover:text-white transition-colors duration-200" />
                    </a>
                  ) : (
                    <a
                      key={href}
                      href={href}
                      className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                      aria-label={label}
                    >
                      <Icon className="w-4 h-4 text-slate-400 hover:text-white transition-colors duration-200" />
                    </a>
                  )
                ))}
              </div>
            </div>

            {/* Main Navigation */}
            <div>
              <h3 className="text-white font-semibold mb-4">Navigation</h3>
              <ul className="space-y-2">
                {mainNavLinks.map(({ to, label }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className="text-slate-300 hover:text-white transition-colors duration-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 rounded px-1 py-1"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-white font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                {resourceLinks.map(({ to, label }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className="text-slate-300 hover:text-white transition-colors duration-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 rounded px-1 py-1"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
                <li>
                  <a
                    href="mailto:support@startupnamer.org"
                    className="text-slate-300 hover:text-white transition-colors duration-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 rounded px-1 py-1"
                  >
                    Email Support
                  </a>
                </li>
              </ul>
            </div>

            {/* Industry Categories */}
            <div>
              <h3 className="text-white font-semibold mb-4">By Industry</h3>
              <ul className="space-y-2">
                {industryLinks.map(({ to, label }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className="text-slate-300 hover:text-white transition-colors duration-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 rounded px-1 py-1"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="py-6 border-t border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            
            {/* Copyright and Legal */}
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-slate-400">
              <p className="flex items-center">
                © {currentYear} StartupNamer.org. Made with{' '}
                <Heart className="w-4 h-4 text-red-400 mx-1" fill="currentColor" />
                for entrepreneurs.
              </p>
              <div className="flex space-x-4">
                {legalLinks.map(({ to, label }) => (
                  <Link
                    key={to}
                    to={to}
                    className="hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 rounded px-1"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Back to Top Button */}
            <button
              onClick={scrollToTop}
              onKeyDown={(e) => handleKeyDown(e, scrollToTop)}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-all duration-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 group"
              aria-label="Scroll to top of page"
            >
              <ArrowUp className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors duration-200" />
              <span className="text-slate-400 group-hover:text-white transition-colors duration-200">
                Back to Top
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Trust indicators */}
      <div className="border-t border-slate-800 bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-center justify-center space-y-2 md:space-y-0 md:space-x-8 text-xs text-slate-500">
            <span>🔒 SSL Secured</span>
            <span>⚡ Lightning Fast</span>
            <span>🧠 AI Powered</span>
            <span>🎯 Brand Focused</span>
            <span>📱 Mobile Optimized</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;