import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Bot, 
  Target, 
  Search, 
  Users, 
  BarChart3, 
  CheckCircle, 
  Star, 
  TrendingUp,
  Award,
  Globe,
  Shield
} from 'lucide-react';

const LandingPage = () => {
  const [email, setEmail] = useState('');

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    // Handle email submission
    console.log('Email submitted:', email);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-blue-800">StartupNamer.org</div>
              <div className="ml-3 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                The Authority
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#tools" className="text-gray-600 hover:text-blue-800">Tools</a>
              <a href="#guides" className="text-gray-600 hover:text-blue-800">Guides</a>
              <a href="#community" className="text-gray-600 hover:text-blue-800">Community</a>
              <a href="#pricing" className="text-gray-600 hover:text-blue-800">Pricing</a>
            </nav>
            <button className="bg-blue-800 text-white px-6 py-2 rounded-lg hover:bg-blue-900">
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-800 to-blue-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl font-bold mb-6"
            >
              The Startup Naming Authority
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl mb-8 max-w-3xl mx-auto leading-relaxed"
            >
              Trusted by 25,000+ entrepreneurs. AI-powered tools meet expert guidance 
              to create perfect startup names.
            </motion.p>
            
            {/* Authority Signals */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap justify-center items-center gap-8 mb-8 text-blue-200"
            >
              <div className="flex items-center">
                <Award className="w-5 h-5 mr-2" />
                Featured in TechCrunch
              </div>
              <div className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Used by YC founders
              </div>
              <div className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                50,000+ names generated
              </div>
            </motion.div>

            <motion.button 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transform hover:scale-105 transition-all"
            >
              Get Your Perfect Name
            </motion.button>
          </div>
        </div>
      </section>

      {/* Authority Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Entrepreneurs Trust Us
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              More than just a name generator - we're your complete naming authority
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpen,
                title: 'Naming Knowledge Base',
                description: 'Comprehensive guides and best practices from naming experts',
                color: 'text-blue-600'
              },
              {
                icon: Bot,
                title: 'AI Naming Engine',
                description: 'Advanced algorithms trained on 10,000+ successful startups',
                color: 'text-green-600'
              },
              {
                icon: Target,
                title: 'Industry Expertise',
                description: 'Specialized naming strategies for every business sector',
                color: 'text-purple-600'
              },
              {
                icon: Search,
                title: 'Complete Analysis',
                description: 'Domain, trademark, and brandability checking included',
                color: 'text-orange-600'
              },
              {
                icon: Users,
                title: 'Founder Community',
                description: 'Connect with other entrepreneurs and share insights',
                color: 'text-red-600'
              },
              {
                icon: BarChart3,
                title: 'Success Database',
                description: 'Learn from patterns in 10,000+ successful startup names',
                color: 'text-indigo-600'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <feature.icon className={`w-12 h-12 ${feature.color} mb-4`} />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Educational Sections */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                The Science of Startup Naming
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Our naming methodology is built on extensive research into what makes 
                startup names successful. Learn the psychology, patterns, and principles 
                behind memorable brand names.
              </p>
              <div className="space-y-4">
                {[
                  'Cognitive psychology of name memorability',
                  'Industry-specific naming conventions',
                  'Cultural considerations for global brands',
                  'Legal landscape and trademark strategy'
                ].map((item, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-100 p-8 rounded-xl">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-800 mb-2">94%</div>
                <div className="text-gray-600 mb-6">of our names pass trademark screening</div>
                <div className="text-4xl font-bold text-green-600 mb-2">8.7/10</div>
                <div className="text-gray-600 mb-6">average brandability score</div>
                <div className="text-4xl font-bold text-purple-600 mb-2">72h</div>
                <div className="text-gray-600">average domain acquisition time</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Naming Resource
            </h2>
            <p className="text-xl text-gray-600">
              From essential guides to complete founder toolkits
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Essential Guide',
                price: '$19',
                description: 'Perfect for early-stage founders',
                features: [
                  '50 AI-generated names',
                  'Comprehensive naming guide',
                  'Domain availability check',
                  'Basic brandability analysis',
                  'Email support'
                ],
                cta: 'Start Naming',
                popular: false
              },
              {
                name: 'Complete Resource',
                price: '$39',
                description: 'Most popular for serious entrepreneurs',
                features: [
                  '100 AI-generated names',
                  'Full trademark analysis',
                  'Industry-specific guide',
                  'Brandability scoring',
                  'Community access',
                  'Expert review session'
                ],
                cta: 'Get Complete Access',
                popular: true
              },
              {
                name: "Founder's Toolkit",
                price: '$79',
                description: 'Complete authority for your naming project',
                features: [
                  '200 AI-generated names',
                  'Full trademark screening',
                  'Expert consultation call',
                  'Community access',
                  'Priority support',
                  'Success story feature'
                ],
                cta: 'Get Full Toolkit',
                popular: false
              }
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-8 relative ${
                  plan.popular ? 'ring-2 ring-blue-600' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="text-4xl font-bold text-blue-800">{plan.price}</div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                  plan.popular 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}>
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 bg-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Stay Updated with Naming Insights
          </h2>
          <p className="text-xl text-blue-200 mb-8">
            Weekly tips, trends, and case studies from the startup naming world
          </p>
          <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900"
              required
            />
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold mb-4">StartupNamer.org</div>
              <p className="text-gray-400">
                The definitive authority for startup naming
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Naming Guides</a></li>
                <li><a href="#" className="hover:text-white">Industry Reports</a></li>
                <li><a href="#" className="hover:text-white">Case Studies</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Tools</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Name Generator</a></li>
                <li><a href="#" className="hover:text-white">Domain Check</a></li>
                <li><a href="#" className="hover:text-white">Trademark Search</a></li>
                <li><a href="#" className="hover:text-white">Name Analyzer</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Community</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Forums</a></li>
                <li><a href="#" className="hover:text-white">Expert Reviews</a></li>
                <li><a href="#" className="hover:text-white">Success Stories</a></li>
                <li><a href="#" className="hover:text-white">Support</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 StartupNamer.org. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;