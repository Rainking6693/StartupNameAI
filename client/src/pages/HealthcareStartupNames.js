import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  Heart,
  Zap,
  Star,
  CheckCircle,
  ArrowRight,
  Stethoscope,
  Activity,
  Shield,
  Pill
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HealthcareStartupNames = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/naming-tool');
  };

  const healthcareNameExamples = [
    { name: 'VitalFlow', score: 9.2, description: 'Perfect for patient management platforms' },
    { name: 'HealthSync', score: 9.0, description: 'Ideal for healthcare data integration' },
    { name: 'CareHub', score: 8.9, description: 'Great for telemedicine and care coordination' },
    { name: 'MedStream', score: 9.1, description: 'Medical workflow and documentation' },
    { name: 'WellnessFlow', score: 8.8, description: 'Wellness and preventive care platforms' },
    { name: 'DiagnosePro', score: 8.7, description: 'Diagnostic tools and AI assistance' },
    { name: 'TherapySync', score: 8.9, description: 'Mental health and therapy platforms' },
    { name: 'PharmaFlow', score: 8.6, description: 'Pharmaceutical and drug delivery' }
  ];

  const healthcareCategories = [
    { 
      category: 'Telemedicine & Digital Health', 
      keywords: ['Tele', 'Digital', 'Virtual', 'Remote', 'Connect'],
      examples: ['TeleFlow', 'DigitalCare', 'VirtualHealth'],
      icon: Activity,
      growth: '+245%'
    },
    { 
      category: 'Mental Health & Therapy', 
      keywords: ['Mind', 'Therapy', 'Mental', 'Wellness', 'Care'],
      examples: ['MindFlow', 'TherapyCare', 'WellnessHub'],
      icon: Star,
      growth: '+189%'
    },
    { 
      category: 'Medical Devices & Diagnostics', 
      keywords: ['Med', 'Diagnose', 'Device', 'Scan', 'Test'],
      examples: ['MedFlow', 'DiagnoseHub', 'ScanPro'],
      icon: Stethoscope,
      growth: '+156%'
    },
    { 
      category: 'Pharmaceutical & Drug Delivery', 
      keywords: ['Pharma', 'Drug', 'Medicine', 'Dose', 'Rx'],
      examples: ['PharmaHub', 'DrugFlow', 'MediSync'],
      icon: Pill,
      growth: '+134%'
    }
  ];

  const healthcareTrends = [
    { trend: 'AI-Powered Diagnostics', percentage: 42, description: 'Machine learning for medical diagnosis' },
    { trend: 'Remote Patient Monitoring', percentage: 38, description: 'IoT devices for continuous care' },
    { trend: 'Mental Health Tech', percentage: 35, description: 'Digital therapy and wellness' },
    { trend: 'Personalized Medicine', percentage: 29, description: 'Genomics and precision healthcare' }
  ];

  const successStories = [
    {
      name: 'Dr. Sarah Johnson',
      company: 'CareFlow',
      funding: '$15M Series A',
      quote: 'CareFlow immediately conveyed our mission to streamline patient care. Healthcare professionals trusted the name before seeing our platform.',
      avatar: 'ð©ââï¸',
      industry: 'Patient Management'
    },
    {
      name: 'Michael Chen',
      company: 'HealthSync',
      funding: '$22M Series B',
      quote: 'HealthSync perfectly captured our data integration vision. Hospital systems understood our value proposition instantly.',
      avatar: 'ð¨ââï¸',
      industry: 'Healthcare Data'
    },
    {
      name: 'Dr. Lisa Rodriguez',
      company: 'MindBridge',
      funding: '$8M Seed',
      quote: 'MindBridge resonated with both patients and therapists. The name helped us establish trust in the sensitive mental health space.',
      avatar: 'ð©âð¬',
      industry: 'Mental Health'
    }
  ];

  const complianceFeatures = [
    { feature: 'HIPAA Compliance Ready', description: 'Names that convey security and privacy' },
    { feature: 'Medical Professional Appeal', description: 'Trusted by healthcare practitioners' },
    { feature: 'Patient-Friendly Branding', description: 'Accessible and comforting to patients' },
    { feature: 'Regulatory Approval Support', description: 'Names that support FDA processes' }
  ];

  return (
    <>
      <Helmet>
        <title>Healthcare Startup Name Generator - 200+ AI-Generated Medical Technology Names | StartupNamer.org</title>
        <meta name="description" content="Generate perfect healthcare startup names with AI. 200+ brandable medical technology company names for telemedicine, digital health, and medical devices. Free name generator." />
        <meta name="keywords" content="healthcare startup names, medical technology names, healthcare name generator, telemedicine names, digital health names, medical device names, healthcare branding" />
        <link rel="canonical" href="https://startupnamer.org/healthcare-startup-names" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Healthcare Startup Name Generator - 200+ AI-Generated Names" />
        <meta property="og:description" content="Generate perfect healthcare startup names with AI. Brandable medical technology names for telemedicine and digital health platforms." />
        <meta property="og:url" content="https://startupnamer.org/healthcare-startup-names" />
        
        {/* Schema Markup for Healthcare Names */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Healthcare Startup Name Generator",
            "description": "AI-powered healthcare startup name generator with 200+ brandable medical technology company names",
            "url": "https://startupnamer.org/healthcare-startup-names",
            "mainEntity": {
              "@type": "SoftwareApplication",
              "name": "Healthcare Startup Name Generator",
              "applicationCategory": "BusinessApplication",
              "description": "Generate brandable names for healthcare startups including telemedicine, digital health, and medical device companies"
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-teal-900 to-cyan-900">
        {/* Header */}
        <header className="px-6 py-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Heart className="w-8 h-8 text-red-400" />
              <span className="text-2xl font-bold text-white">StartupNamer.org</span>
              <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                HEALTHCARE NAMES
              </span>
            </div>
            <button 
              onClick={() => navigate('/')}
              className="text-white/80 hover:text-white transition-colors"
            >
              â Back to Home
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="px-6 py-16 text-center">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
                <span className="bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
                  Healthcare Startup
                </span>
                <br />
                <span className="text-white">Name Generator</span>
              </h1>
              
              <p className="text-2xl text-white/90 mb-8 max-w-4xl mx-auto">
                Generate 200+ AI-powered healthcare company names for telemedicine, digital health, medical devices, and pharmaceutical startups. HIPAA-compliant naming.
              </p>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 max-w-3xl mx-auto border border-white/20">
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-black text-red-400 mb-2">200+</div>
                    <div className="text-white/80">Healthcare Names</div>
                  </div>
                  <div>
                    <div className="text-3xl font-black text-blue-400 mb-2">HIPAA</div>
                    <div className="text-white/80">Compliant Ready</div>
                  </div>
                  <div>
                    <div className="text-3xl font-black text-teal-400 mb-2">98%</div>
                    <div className="text-white/80">Trust Score</div>
                  </div>
                </div>
              </div>
              
              <motion.button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-12 py-6 rounded-2xl font-black text-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center justify-center space-x-3">
                  <Heart className="w-6 h-6" />
                  <span>Generate Healthcare Names Now</span>
                  <ArrowRight className="w-6 h-6" />
                </span>
              </motion.button>
            </motion.div>
          </div>
        </section>

        {/* Healthcare Trends */}
        <section className="px-6 py-20 bg-black/20 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                Healthcare Innovation Trends 2025
              </h2>
              <p className="text-xl text-white/80">
                Our AI identifies the fastest-growing healthcare technology sectors
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {healthcareTrends.map((trend, index) => (
                <motion.div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="text-4xl font-black text-red-400 mb-2">{trend.percentage}%</div>
                  <h3 className="text-lg font-bold text-white mb-2">{trend.trend}</h3>
                  <p className="text-white/70 text-sm">{trend.description}</p>
                  <div className="mt-4">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-red-500 to-pink-500 h-2 rounded-full" 
                        style={{width: `${trend.percentage}%`}}
                      ></div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Healthcare Name Examples */}
        <section className="px-6 py-20">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                AI-Generated Healthcare Names That Heal
              </h2>
              <p className="text-xl text-white/80">
                Real examples from our AI trained on 2,500+ successful healthcare companies
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {healthcareNameExamples.map((example, index) => (
                <motion.div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xl font-bold text-white">{example.name}</h3>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-yellow-400 font-semibold">{example.score}</span>
                    </div>
                  </div>
                  <p className="text-white/70 text-sm mb-4">{example.description}</p>
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded-full">â HIPAA Ready</span>
                    <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">Medical-Grade</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Healthcare Categories */}
        <section className="px-6 py-20 bg-white/5 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                Healthcare Naming by Specialty
              </h2>
              <p className="text-xl text-white/80">
                Specialized naming patterns for different healthcare technology verticals
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {healthcareCategories.map((category, index) => (
                <motion.div
                  key={index}
                  className="bg-gradient-to-br from-red-500/10 to-pink-500/10 backdrop-blur-sm rounded-2xl p-8 border border-red-400/30"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                        <category.icon className="w-6 h-6 text-red-400" />
                      </div>
                      <h3 className="text-xl font-bold text-white">{category.category}</h3>
                    </div>
                    <div className="text-red-400 font-bold text-sm">{category.growth} Growth</div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-white/70 text-sm mb-3">Popular keywords:</p>
                      <div className="flex flex-wrap gap-2">
                        {category.keywords.map((keyword, kidx) => (
                          <span 
                            key={kidx}
                            className="bg-red-500/20 text-red-300 px-3 py-1 rounded-full text-sm font-medium"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-white/70 text-sm mb-3">Example names:</p>
                      <div className="flex flex-wrap gap-2">
                        {category.examples.map((example, eidx) => (
                          <span 
                            key={eidx}
                            className="bg-pink-500/20 text-pink-300 px-3 py-1 rounded-full text-sm font-medium"
                          >
                            {example}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Compliance Features */}
        <section className="px-6 py-20 bg-black/20 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                Healthcare Compliance & Trust
              </h2>
              <p className="text-xl text-white/80">
                Names designed for the regulated healthcare environment
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {complianceFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-6 h-6 text-red-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">{feature.feature}</h3>
                  <p className="text-white/70 text-sm">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="px-6 py-20">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                Healthcare Founders Who Chose AI Naming
              </h2>
              <p className="text-xl text-white/80">
                Real success stories from funded healthcare startups
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {successStories.map((story, index) => (
                <motion.div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center mb-6">
                    <div className="text-4xl mr-4">{story.avatar}</div>
                    <div>
                      <div className="text-xl font-bold text-white">{story.name}</div>
                      <div className="text-red-400 font-semibold">{story.company}</div>
                      <div className="text-pink-400 text-sm">{story.funding}</div>
                      <div className="text-blue-400 text-xs">{story.industry}</div>
                    </div>
                  </div>
                  <p className="text-white/90 text-lg leading-relaxed italic mb-4">
                    "{story.quote}"
                  </p>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-6 py-20 bg-gradient-to-r from-red-600/10 to-pink-600/10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
                Ready to Name Your
                <span className="bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent block">
                  Healthcare Startup?
                </span>
              </h2>
              
              <p className="text-xl text-white/90 mb-8">
                Join 1,200+ healthcare founders who used our AI to build trusted medical brands
              </p>
              
              <motion.button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-16 py-8 rounded-3xl font-black text-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center justify-center space-x-4">
                  <Heart className="w-8 h-8" />
                  <span>Generate Healthcare Names Free</span>
                  <ArrowRight className="w-8 h-8" />
                </span>
              </motion.button>
              
              <div className="text-white/60 mt-6">
                <div className="text-lg">â Free to try â¢ â 200+ trusted options â¢ â HIPAA-compliant ready</div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Related Industries */}
        <section className="px-6 py-12 bg-black/30">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-xl font-semibold text-white mb-6 text-center">Explore Other Industries</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { name: 'Tech Names', url: '/tech-startup-names' },
                { name: 'SaaS Names', url: '/saas-startup-names' },
                { name: 'Fintech Names', url: '/fintech-startup-names' },
                { name: 'AI Startup Names', url: '/ai-startup-names' },
                { name: 'E-commerce Names', url: '/ecommerce-startup-names' }
              ].map((industry, index) => (
                <button
                  key={index}
                  onClick={() => navigate(industry.url)}
                  className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  {industry.name}
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HealthcareStartupNames;