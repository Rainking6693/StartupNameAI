import React from 'react';
import Link from 'next/link';
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
    { href: '/', label: 'Home' },
    { href: '/naming-tool', label: 'Name Generator' },
    { href: '/features', label: 'Features' },
    { href: '/examples', label: 'Examples' },
    { href: '/how-it-works', label: 'How It Works' },
    { href: '/pricing', label: 'Pricing' },
  ];

  const resourceLinks = [
    { href: '/blog', label: 'Blog' },
    { href: '/faq', label: 'FAQ' },
    { href: '/contact', label: 'Contact Support' },
  ];

  const industryLinks = [
    { href: '/tech-startup-names', label: 'Tech Startup Names' },
    { href: '/saas-startup-names', label: 'SaaS Startup Names' },
    { href: '/fintech-startup-names', label: 'Fintech Names' },
    { href: '/healthcare-startup-names', label: 'Healthcare Names' },
    { href: '/ai-startup-names', label: 'AI Startup Names' },
    { href: '/ecommerce-startup-names', label: 'E-commerce Names' },
  ];

  const legalLinks = [
    { href: '/privacy-policy', label: 'Privacy Policy' },
    { href: '/terms-of-service', label: 'Terms of Service' },
  ];

  const socialLinks = [
    {
      href: 'https://twitter.com/StartupNamerAI',
      icon: Twitter,
      label: 'Twitter',
      color: 'hover:text-blue-400'
    },
    {
      href: 'https://linkedin.com/company/startupnamer',
      icon: Linkedin,
      label: 'LinkedIn',
      color: 'hover:text-blue-600'
    },
    {
      href: 'https://github.com/startupnamer',
      icon: Github,
      label: 'GitHub',
      color: 'hover:text-gray-600'
    },
    {
      href: 'mailto:hello@startupnamer.org',
      icon: Mail,
      label: 'Email',
      color: 'hover:text-green-500'
    }
  ];

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-400 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-blue-400/20 via-purple-500/20 to-pink-400/20 rounded-xl blur opacity-75"></div>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                  StartupNamer.org
                </span>
                <div className="text-xs text-blue-300 font-medium tracking-wider">
                  AI NAMING AUTHORITY
                </div>
              </div>
            </div>
            
            <p className="text-slate-300 mb-6 leading-relaxed max-w-md">
              The most advanced AI-powered startup naming platform. Generate unique, brandable business names 
              with domain availability checking and comprehensive brand analysis.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center text-slate-300 transition-all duration-300 hover:bg-white/20 hover:scale-110 hover:shadow-lg ${social.color}`}
                    aria-label={`Follow us on ${social.label}`}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Navigation</h3>
            <ul className="space-y-3">
              {mainNavLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <a className="text-slate-300 hover:text-white transition-colors duration-200 text-sm">
                      {link.label}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Industry Pages */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Industries</h3>
            <ul className="space-y-3">
              {industryLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <a className="text-slate-300 hover:text-white transition-colors duration-200 text-sm">
                      {link.label}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources & Support */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Support</h3>
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <a className="text-slate-300 hover:text-white transition-colors duration-200 text-sm">
                      {link.label}
                    </a>
                  </Link>
                </li>
              ))}
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <a className="text-slate-300 hover:text-white transition-colors duration-200 text-sm">
                      {link.label}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 pt-8 border-t border-slate-700/50">
          <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-2xl border border-white/10 p-6 lg:p-8">
            <div className="text-center max-w-2xl mx-auto">
              <h3 className="text-xl font-bold text-white mb-3">
                Stay Updated with Naming Trends
              </h3>
              <p className="text-slate-300 mb-6">
                Get the latest insights on startup naming, branding tips, and new AI features delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
                <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-slate-400">
              <div className="flex items-center space-x-1">
                <span>&copy; {currentYear} StartupNamer.org. All rights reserved.</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>Made with</span>
                <Heart className="w-4 h-4 text-red-400 fill-current" />
                <span>for entrepreneurs worldwide</span>
              </div>
            </div>

            {/* Back to Top */}
            <button
              onClick={scrollToTop}
              onKeyDown={(e) => handleKeyDown(e, scrollToTop)}
              className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors duration-200 text-sm group"
              aria-label="Back to top"
            >
              <span>Back to top</span>
              <div className="w-8 h-8 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110">
                <ArrowUp className="w-4 h-4" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;