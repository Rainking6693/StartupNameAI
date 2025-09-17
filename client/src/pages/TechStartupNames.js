import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SEOHelmet from '../components/SEOHelmet';
import { 
  Cpu,
  Zap,
  Rocket,
  Star,
  Code,
  Globe,
  TrendingUp,
  Lightbulb,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const TechStartupNames = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const techCategories = [
    { id: 'all', name: 'All Tech', icon: Cpu },
    { id: 'ai', name: 'AI/ML', icon: Star },
    { id: 'saas', name: 'SaaS', icon: Globe },
    { id: 'mobile', name: 'Mobile', icon: Zap },
    { id: 'blockchain', name: 'Blockchain', icon: Code },
    { id: 'iot', name: 'IoT', icon: Rocket }
  ];
  
  const techNameExamples = {
    all: [
      { name: 'QuantumFlow', category: 'AI/ML', description: 'Combines quantum computing concepts with data flow', score: 9.2 },
      { name: 'NeuralForge', category: 'AI/ML', description: 'Metaphor for creating and shaping AI models', score: 8.9 },
      { name: 'CloudVault', category: 'SaaS', description: 'Secure cloud storage and management', score: 8.7 },
      { name: 'CodeCraft', category: 'Development', description: 'Artisanal approach to software development', score: 8.5 },
      { name: 'DataNexus', category: 'Analytics', description: 'Central hub for data connections', score: 8.8 },
      { name: 'TechSphere', category: 'Platform', description: 'Comprehensive technology ecosystem', score: 8.3 },
      { name: 'InnoVortex', category: 'Innovation', description: 'Swirling center of technological innovation', score: 9.0 },
      { name: 'PixelForge', category: 'Design', description: 'Creating and crafting digital experiences', score: 8.6 },
      { name: 'ByteStream', category: 'Data', description: 'Continuous flow of digital information', score: 8.4 },
      { name: 'CyberNest', category: 'Security', description: 'Safe haven in the digital world', score: 8.7 }
    ],
    ai: [
      { name: 'QuantumFlow', category: 'AI/ML', description: 'Combines quantum computing concepts with data flow', score: 9.2 },
      { name: 'NeuralForge', category: 'AI/ML', description: 'Metaphor for creating and shaping AI models', score: 8.9 },
      { name: 'CognitiveVault', category: 'AI/ML', description: 'Secure storage for AI knowledge and models', score: 8.8 },
      { name: 'MindMesh', category: 'AI/ML', description: 'Interconnected artificial intelligence network', score: 8.6 },
      { name: 'IntelliCore', category: 'AI/ML', description: 'Central intelligence processing unit', score: 8.5 }
    ],
    saas: [
      { name: 'CloudVault', category: 'SaaS', description: 'Secure cloud storage and management', score: 8.7 },
      { name: 'WorkFlow', category: 'SaaS', description: 'Streamlined business process management', score: 8.5 },
      { name: 'TeamSync', category: 'SaaS', description: 'Collaborative team coordination platform', score: 8.4 },
      { name: 'DataHub', category: 'SaaS', description: 'Central platform for data management', score: 8.6 },
      { name: 'TaskForge', category: 'SaaS', description: 'Powerful task and project management', score: 8.3 }
    ],
    mobile: [
      { name: 'AppSphere', category: 'Mobile', description: 'Comprehensive mobile application ecosystem', score: 8.5 },
      { name: 'TouchFlow', category: 'Mobile', description: 'Intuitive mobile user experience', score: 8.4 },
      { name: 'MobileForge', category: 'Mobile', description: 'Crafting exceptional mobile experiences', score: 8.6 },
      { name: 'SwipeCore', category: 'Mobile', description: 'Core mobile interaction platform', score: 8.2 },
      { name: 'AppNexus', category: 'Mobile', description: 'Central hub for mobile applications', score: 8.3 }
    ],
    blockchain: [
      { name: 'ChainVault', category: 'Blockchain', description: 'Secure blockchain storage solution', score: 8.7 },
      { name: 'CryptoForge', category: 'Blockchain', description: 'Creating and managing crypto assets', score: 8.5 },
      { name: 'BlockNexus', category: 'Blockchain', description: 'Central blockchain connectivity hub', score: 8.4 },
      { name: 'TokenFlow', category: 'Blockchain', description: 'Streamlined token management system', score: 8.6 },
      { name: 'DecentralCore', category: 'Blockchain', description: 'Core decentralized technology platform', score: 8.3 }
    ],
    iot: [
      { name: 'SensorNet', category: 'IoT', description: 'Connected sensor network platform', score: 8.5 },
      { name: 'IoTForge', category: 'IoT', description: 'Building connected device solutions', score: 8.4 },
      { name: 'SmartMesh', category: 'IoT', description: 'Intelligent device connectivity network', score: 8.6 },
      { name: 'DeviceHub', category: 'IoT', description: 'Central IoT device management', score: 8.3 },
      { name: 'ConnectCore', category: 'IoT', description: 'Core connectivity for smart devices', score: 8.2 }
    ]
  };
  
  const namingPatterns = [
    {
      pattern: 'Tech + Action',
      description: 'Combine technology terms with action words',
      examples: ['DataFlow', 'CodeCraft', 'CloudSync'],
      tip: 'Creates dynamic, action-oriented brand perception'
    },
    {
      pattern: 'Metaphorical Tech',
      description: 'Use metaphors that relate to technology concepts',
      examples: ['NeuralForge', 'QuantumLeap', 'CyberNest'],
      tip: 'Makes complex tech concepts more relatable and memorable'
    },
    {
      pattern: 'Invented Tech Words',
      description: 'Create new words that sound technological',
      examples: ['Zyntex', 'Quvira', 'Nexaflow'],
      tip: 'Highly brandable and unique, perfect for trademarks'
    },
    {
      pattern: 'Core/Hub/Nexus',
      description: 'Use words that suggest centrality and connection',
      examples: ['TechCore', 'DataHub', 'CloudNexus'],
      tip: 'Conveys reliability and central importance'
    }
  ];
  
  const techTrends = [
    {
      trend: 'AI-First Naming',
      description: 'Names that immediately convey artificial intelligence capabilities',
      growth: '+340%',
      examples: ['Neural', 'Cognitive', 'Intelligent', 'Smart']
    },
    {
      trend: 'Quantum References',
      description: 'Leveraging quantum computing concepts for advanced tech feel',
      growth: '+280%',
      examples: ['Quantum', 'Qubit', 'Entangled', 'Superposition']
    },
    {
      trend: 'Edge Computing',
      description: 'Names reflecting distributed and edge computing trends',
      growth: '+220%',
      examples: ['Edge', 'Distributed', 'Mesh', 'Node']
    },
    {
      trend: 'Sustainability Tech',
      description: 'Green technology and sustainability-focused naming',
      growth: '+190%',
      examples: ['Green', 'Eco', 'Sustainable', 'Carbon']
    }
  ];
  
  const filteredNames = selectedCategory === 'all' ? techNameExamples.all : techNameExamples[selectedCategory] || [];
  
  return (
    <>
      <SEOHelmet page="techNames" />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-pink-600/5"></div>
          
          <div className="container relative">
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <Cpu className="w-8 h-8 text-white" />
                </div>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-6">
                Tech Startup
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Name Generator</span>
              </h1>
              
              <p className="text-xl text-slate-600 mb-10 leading-relaxed">
                Generate innovative tech startup names with specialized AI. Perfect for software companies, SaaS startups, and technology ventures. Get creative, brandable names that resonate with tech audiences.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/naming-tool"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-xl"
                >
                  <Star className="w-5 h-5 mr-2 inline" />
                  Generate Tech Names
                </Link>
                <a
                  href="#examples"
                  className="bg-white/20 backdrop-blur-sm border border-white/30 text-slate-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/30 transition-all duration-300"
                >
                  Browse Examples
                  <ArrowRight className="w-5 h-5 ml-2 inline" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Tech Categories */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">Tech Startup Categories</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {techCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`p-4 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                      selectedCategory === category.id
                        ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-xl'
                        : 'bg-white text-slate-700 hover:bg-blue-50 shadow-lg'
                    }`}
                  >
                    <category.icon className="w-8 h-8 mx-auto mb-2" />
                    <div className="font-semibold text-sm">{category.name}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Name Examples */}
        <section id="examples" className="py-16 bg-white">
          <div className="container">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">
                {selectedCategory === 'all' ? 'Best Tech Startup Names' : `${techCategories.find(c => c.id === selectedCategory)?.name} Startup Names`}
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNames.map((nameExample, index) => (
                  <div key={index} className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 border border-slate-200 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold text-slate-800">{nameExample.name}</h3>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-semibold text-slate-600">{nameExample.score}</span>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                        {nameExample.category}
                      </span>
                    </div>
                    
                    <p className="text-slate-600 text-sm leading-relaxed">{nameExample.description}</p>
                    
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">Brandability Score</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                              style={{width: `${nameExample.score * 10}%`}}
                            ></div>
                          </div>
                          <span className="text-xs font-semibold text-slate-600">{nameExample.score}/10</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Naming Patterns */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">Tech Startup Naming Patterns</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                {namingPatterns.map((pattern, index) => (
                  <div key={index} className="bg-white rounded-2xl p-6 shadow-lg">
                    <h3 className="text-xl font-bold text-slate-800 mb-3">{pattern.pattern}</h3>
                    <p className="text-slate-600 mb-4">{pattern.description}</p>
                    
                    <div className="mb-4">
                      <h4 className="font-semibold text-slate-700 mb-2">Examples:</h4>
                      <div className="flex flex-wrap gap-2">
                        {pattern.examples.map((example, idx) => (
                          <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                            {example}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                      <p className="text-blue-700 text-sm">
                        <Lightbulb className="w-4 h-4 inline mr-1" />
                        <strong>Tip:</strong> {pattern.tip}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Tech Naming Trends */}
        <section className="py-16 bg-white">
          <div className="container">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">2025 Tech Naming Trends</h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {techTrends.map((trend, index) => (
                  <div key={index} className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 border border-slate-200">
                    <div className="flex items-center justify-between mb-3">
                      <TrendingUp className="w-8 h-8 text-green-500" />
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold">
                        {trend.growth}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-slate-800 mb-2">{trend.trend}</h3>
                    <p className="text-slate-600 text-sm mb-4">{trend.description}</p>
                    
                    <div>
                      <h4 className="font-semibold text-slate-700 mb-2 text-sm">Popular Terms:</h4>
                      <div className="flex flex-wrap gap-1">
                        {trend.examples.map((example, idx) => (
                          <span key={idx} className="bg-white text-slate-700 px-2 py-1 rounded text-xs border">
                            {example}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Tech Naming Tips */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">Tech Startup Naming Best Practices</h2>
              
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-4 mt-1">
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 mb-2">Emphasize Innovation and Future</h3>
                      <p className="text-slate-600">Tech audiences expect names that convey cutting-edge innovation. Use words that suggest advancement, intelligence, and forward-thinking.</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-4 mt-1">
                      <CheckCircle className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 mb-2">Consider Technical Credibility</h3>
                      <p className="text-slate-600">Your name should sound credible to technical audiences. Avoid overly cute or playful names unless they fit your specific niche.</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-4 mt-1">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 mb-2">Plan for Global Expansion</h3>
                      <p className="text-slate-600">Tech startups often scale globally quickly. Ensure your name works across different languages and cultures.</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-4 mt-1">
                      <CheckCircle className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 mb-2">Secure the .com Domain</h3>
                      <p className="text-slate-600">Tech companies need credible domains. The .com extension is still the gold standard for technology businesses.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white">
          <div className="container text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to Name Your Tech Startup?
            </h2>
            <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
              Use our AI-powered name generator to create the perfect tech startup name. Get instant domain checking and brandability analysis.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/naming-tool"
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                <Star className="w-5 h-5 mr-2 inline" />
                Generate Tech Names
              </Link>
              <Link
                to="/startup-naming-guide"
                className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/30 transition-all duration-300"
              >
                Read Naming Guide
                <ArrowRight className="w-5 h-5 ml-2 inline" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default TechStartupNames;