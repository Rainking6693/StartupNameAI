import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
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
  Shield,
  ArrowRight,
  Play,
  Quote
} from 'lucide-react';

const LandingPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, 25]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Handle newsletter signup
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock API call
      setEmail('');
      // Show success toast
    } catch (error) {
      // Show error toast
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>StartupNamer.org - The Definitive Startup Naming Authority</title>
        <meta name="description" content="Trusted by 25,000+ entrepreneurs. AI-powered tools meet expert guidance to create perfect startup names. Domain checking, trademark analysis, and naming education." />
        <meta name="keywords" content="startup naming, business names, AI naming, brand naming, domain check, trademark search, startup tools" />
        <meta property="og:title" content="StartupNamer.org - The Startup Naming Authority" />
        <meta property="og:description" content="AI-powered tools and expert guidance for perfect startup names" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://startupnamer.org" />
      </Helmet>

      <div className="min-h-screen bg-white overflow-hidden">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-blue-800 via-blue-900 to-indigo-900 text-white py-24 lg:py-32">
          <motion.div 
            style={{ y: y1 }}
            className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"
          />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="flex justify-center items-center mb-6">
                  <span className="px-4 py-2 bg-blue-600 bg-opacity-50 rounded-full text-sm font-medium backdrop-blur-sm border border-blue-400 border-opacity-30">
                    🏆 Trusted by 25,000+ Entrepreneurs
                  </span>
                </div>
                
                <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                  The Startup Naming
                  <span className="block bg-gradient-to-r from-green-400 to-blue-300 bg-clip-text text-transparent">
                    Authority
                  </span>
                </h1>
                
                <p className="text-xl lg:text-2xl mb-8 text-blue-100 leading-relaxed max-w-3xl mx-auto">
                  AI-powered tools meet expert guidance to create perfect startup names. 
                  From idea to trademark, we're your complete naming solution.
                </p>
                
                {/* Authority Signals */}
                <div className="flex flex-wrap justify-center items-center gap-6 mb-10 text-blue-200">
                  <div className="flex items-center">
                    <Award className="w-5 h-5 mr-2 text-green-400" />
                    Featured in TechCrunch
                  </div>
                  <div className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                    Used by YC founders
                  </div>
                  <div className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-green-400" />
                    50,000+ names generated
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    to="/naming-tool"
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
                  >
                    Start Naming Now
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                  
                  <button className="border-2 border-white hover:bg-white hover:text-blue-800 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all flex items-center justify-center">
                    <Play className="w-5 h-5 mr-2" />
                    Watch Demo
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Trusted by Successful Founders
              </h2>
              <p className="text-lg text-gray-600">
                Join thousands of entrepreneurs who found their perfect name
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  quote: "StartupNamer.org helped me find the perfect name for my fintech startup. The AI analysis was spot-on, and the trademark guidance saved me months of legal work.",
                  author: "Sarah Chen",
                  company: "PayFlow (YC S23)",
                  avatar: "SC"
                },
                {
                  quote: "As a serial entrepreneur, I've used many naming tools. This is the only one that combines AI with real educational value. The industry insights are gold.",
                  author: "Marcus Rodriguez",
                  company: "TechVision AI",
                  avatar: "MR"
                },
                {
                  quote: "The brandability scoring helped me choose between 5 great options. Three months later, customers still comment on how memorable our name is.",
                  author: "Emily Watson",
                  company: "CloudSync Pro",
                  avatar: "EW"
                }
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <Quote className="w-8 h-8 text-blue-600 mb-4" />
                  <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.author}</div>
                      <div className="text-gray-600 text-sm">{testimonial.company}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Authority Features */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                  Why Entrepreneurs Choose Us
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  More than just a name generator - we're your complete naming authority 
                  with educational insights and expert guidance
                </p>
              </motion.div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {[
                {
                  icon: BookOpen,
                  title: 'Educational Naming Insights',
                  description: 'Learn why each name works with detailed explanations, industry patterns, and psychology insights',
                  color: 'text-blue-600',
                  bgColor: 'bg-blue-50'
                },
                {
                  icon: Bot,
                  title: 'AI-Powered Analysis',
                  description: 'Advanced algorithms trained on 10,000+ successful startups generate contextually perfect names',
                  color: 'text-green-600',
                  bgColor: 'bg-green-50'
                },
                {
                  icon: Target,
                  title: 'Industry Specialization',
                  description: 'Sector-specific expertise with naming strategies tailored for tech, fintech, healthcare, and more',
                  color: 'text-purple-600',
                  bgColor: 'bg-purple-50'
                },
                {
                  icon: Search,
                  title: 'Complete Legal Analysis',
                  description: 'Comprehensive domain availability, trademark screening, and international considerations',
                  color: 'text-orange-600',
                  bgColor: 'bg-orange-50'
                },
                {
                  icon: Users,
                  title: 'Expert Community',
                  description: 'Connect with naming professionals and get feedback from experienced entrepreneurs',
                  color: 'text-red-600',
                  bgColor: 'bg-red-50'
                },
                {
                  icon: BarChart3,
                  title: 'Success Metrics',
                  description: 'Brandability scoring based on psychological factors, memorability, and market research',
                  color: 'text-indigo-600',
                  bgColor: 'bg-indigo-50'
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-gray-200"
                >
                  <div className={`w-16 h-16 ${feature.bgColor} rounded-xl flex items-center justify-center mb-6`}>
                    <feature.icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-blue-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              {[
                { number: '25,000+', label: 'Entrepreneurs Served' },
                { number: '50,000+', label: 'Names Generated' },
                { number: '94%', label: 'Trademark Success Rate' },
                { number: '8.7/10', label: 'Average Brandability Score' }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="text-4xl lg:text-5xl font-bold mb-2 text-green-400">
                    {stat.number}
                  </div>
                  <div className="text-blue-200 text-lg">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Choose Your Naming Journey
              </h2>
              <p className="text-xl text-gray-600">
                From essential guidance to complete authority access
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {[
                {
                  name: 'Starter Guide',
                  price: '$19',
                  description: 'Perfect for early-stage founders',
                  features: [
                    '25 AI-generated names',
                    'Basic brandability analysis',
                    'Domain availability check',
                    'Essential naming guide',
                    'Email support'
                  ],
                  cta: 'Start Naming',
                  popular: false,
                  color: 'border-gray-200'
                },
                {
                  name: 'Professional Authority',
                  price: '$49',
                  description: 'Most popular for serious entrepreneurs',
                  features: [
                    '100 AI-generated names',
                    'Advanced brandability scoring',
                    'Comprehensive trademark analysis',
                    'Industry-specific insights',
                    'Expert community access',
                    '1-on-1 naming consultation',
                    'Priority support'
                  ],
                  cta: 'Get Professional Access',
                  popular: true,
                  color: 'border-blue-600 ring-2 ring-blue-600'
                },
                {
                  name: 'Enterprise Authority',
                  price: '$99',
                  description: 'Complete naming authority solution',
                  features: [
                    '200 AI-generated names',
                    'Full trademark screening',
                    'International naming analysis',
                    'Expert naming consultation',
                    'White-glove support',
                    'Success story feature',
                    'Custom industry research'
                  ],
                  cta: 'Get Enterprise Access',
                  popular: false,
                  color: 'border-gray-200'
                }
              ].map((plan, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all p-8 relative ${plan.color}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-4">{plan.description}</p>
                    <div className="text-5xl font-bold text-blue-800 mb-2">{plan.price}</div>
                    <div className="text-gray-500">One-time payment</div>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    to={`/pricing?plan=${plan.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className={`w-full py-4 px-6 rounded-lg font-semibold transition-colors text-center block ${
                      plan.popular 
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="bg-blue-900 text-white py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Master the Art of Startup Naming
              </h2>
              <p className="text-xl text-blue-200 mb-8 max-w-2xl mx-auto">
                Weekly insights, case studies, and naming strategies from successful entrepreneurs. 
                Join 10,000+ founders learning the science of memorable names.
              </p>
              
              <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 px-6 py-4 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                  disabled={isSubmitting}
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700 px-8 py-4 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Joining...' : 'Join Authority'}
                </button>
              </form>
              
              <p className="text-sm text-blue-300 mt-4">
                No spam. Unsubscribe anytime. Read by 10,000+ entrepreneurs.
              </p>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default LandingPage;