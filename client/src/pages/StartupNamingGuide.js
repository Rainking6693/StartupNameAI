import React from 'react';
import { Link } from 'react-router-dom';
import SEOHelmet from '../components/SEOHelmet';
import { 
  Star,
  Target,
  Shield,
  Globe,
  CheckCircle,
  ArrowRight,
  Lightbulb,
  Users,
  TrendingUp,
  AlertTriangle,
  BookOpen
} from 'lucide-react';

const StartupNamingGuide = () => {
  const tableOfContents = [
    { id: 'psychology', title: 'Psychology of Startup Names', icon: Star },
    { id: 'methodologies', title: 'Naming Methodologies & Frameworks', icon: Target },
    { id: 'industry-specific', title: 'Industry-Specific Strategies', icon: Users },
    { id: 'legal', title: 'Legal Considerations & Trademarks', icon: Shield },
    { id: 'domain-strategy', title: 'Domain Strategy & Selection', icon: Globe },
    { id: 'testing', title: 'Testing & Validation', icon: CheckCircle },
    { id: 'mistakes', title: 'Common Naming Mistakes', icon: AlertTriangle },
    { id: 'examples', title: 'Successful Name Examples', icon: Star }
  ];

  const namingMethodologies = [
    {
      name: 'Descriptive Naming',
      description: 'Names that clearly describe what the company does',
      examples: ['PayPal', 'Facebook', 'LinkedIn'],
      pros: ['Clear communication', 'Easy to understand', 'SEO benefits'],
      cons: ['Limited scalability', 'Generic feel', 'Hard to trademark']
    },
    {
      name: 'Abstract Naming',
      description: 'Invented or abstract names with no direct meaning',
      examples: ['Google', 'Kodak', 'Xerox'],
      pros: ['Highly brandable', 'Easy to trademark', 'Memorable'],
      cons: ['Requires marketing investment', 'Initial confusion', 'Harder to understand']
    },
    {
      name: 'Metaphorical Naming',
      description: 'Names that use metaphors or analogies',
      examples: ['Apple', 'Amazon', 'Tesla'],
      pros: ['Emotional connection', 'Memorable', 'Storytelling potential'],
      cons: ['Cultural sensitivity', 'Interpretation varies', 'May limit perception']
    },
    {
      name: 'Compound Naming',
      description: 'Combining two or more words',
      examples: ['Microsoft', 'Facebook', 'YouTube'],
      pros: ['Clear meaning', 'Brandable', 'Descriptive'],
      cons: ['Can be long', 'Domain availability', 'Pronunciation issues']
    }
  ];

  const industryStrategies = [
    {
      industry: 'Technology',
      characteristics: ['Innovation-focused', 'Future-oriented', 'Technical credibility'],
      examples: ['Nvidia', 'Palantir', 'Anthropic'],
      tips: ['Use tech-related metaphors', 'Consider invented words', 'Emphasize innovation']
    },
    {
      industry: 'Healthcare',
      characteristics: ['Trust-building', 'Professional', 'Care-oriented'],
      examples: ['Moderna', 'Illumina', 'Veracyte'],
      tips: ['Emphasize trust and care', 'Use Latin roots', 'Avoid scary connotations']
    },
    {
      industry: 'Fintech',
      characteristics: ['Security-focused', 'Trust-building', 'Professional'],
      examples: ['Stripe', 'Plaid', 'Robinhood'],
      tips: ['Convey security and trust', 'Use financial metaphors', 'Avoid risky associations']
    },
    {
      industry: 'SaaS',
      characteristics: ['Productivity-focused', 'Efficiency', 'Professional'],
      examples: ['Slack', 'Notion', 'Figma'],
      tips: ['Emphasize productivity', 'Use action words', 'Consider workflow metaphors']
    }
  ];

  const commonMistakes = [
    {
      mistake: 'Being Too Descriptive',
      description: 'Names that are overly literal and limit future growth',
      example: 'BookStore.com (limits to just books)',
      solution: 'Choose names that allow for business evolution'
    },
    {
      mistake: 'Ignoring Domain Availability',
      description: 'Falling in love with a name without checking domains',
      example: 'Perfect name but .com costs $50,000',
      solution: 'Always check domain availability early in the process'
    },
    {
      mistake: 'Cultural Insensitivity',
      description: 'Names that have negative meanings in other languages',
      example: 'Chevy Nova ("no va" means "doesn\'t go" in Spanish)',
      solution: 'Research international meanings and cultural implications'
    },
    {
      mistake: 'Trademark Conflicts',
      description: 'Not researching existing trademarks',
      example: 'Using a name already trademarked in your industry',
      solution: 'Conduct thorough trademark searches before finalizing'
    },
    {
      mistake: 'Hard to Pronounce',
      description: 'Names that are difficult to say or spell',
      example: 'Xobni (inbox backwards - confusing)',
      solution: 'Test pronunciation with diverse groups'
    }
  ];

  return (
    <>
      <SEOHelmet page="namingGuide" />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-pink-600/5"></div>
          
          <div className="container relative">
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-6">
                The Complete
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Startup Naming Guide</span>
              </h1>
              
              <p className="text-xl text-slate-600 mb-10 leading-relaxed">
                Master the art and science of startup naming. Learn proven methodologies, avoid common pitfalls, and create names that drive business success.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/naming-tool"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-xl"
                >
                  <Lightbulb className="w-5 h-5 mr-2 inline" />
                  Try Our AI Name Generator
                </Link>
                <a
                  href="#psychology"
                  className="bg-white/20 backdrop-blur-sm border border-white/30 text-slate-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/30 transition-all duration-300"
                >
                  Start Reading Guide
                  <ArrowRight className="w-5 h-5 ml-2 inline" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Table of Contents */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">Table of Contents</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                {tableOfContents.map((item, index) => (
                  <a
                    key={index}
                    href={`#${item.id}`}
                    className="flex items-center p-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-4">
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">{item.title}</h3>
                      <p className="text-sm text-slate-600">Chapter {index + 1}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Psychology Section */}
        <section id="psychology" className="py-16 bg-white">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-4">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800">Psychology of Startup Names</h2>
              </div>
              
              <div className="prose prose-lg max-w-none">
                <p className="text-slate-600 leading-relaxed mb-6">
                  The psychology behind startup names is crucial for brand success. Research shows that memorable names increase brand recall by 67% and can impact customer perception within 50 milliseconds of exposure. Understanding the psychological principles behind effective naming can give your startup a significant competitive advantage.
                </p>
                
                <h3 className="text-2xl font-bold text-slate-800 mb-4">Cognitive Processing and Memory</h3>
                <p className="text-slate-600 leading-relaxed mb-6">
                  Human brains process names through multiple cognitive pathways. Short, phonetically simple names are easier to remember and pronounce, leading to better word-of-mouth marketing. Names with 1-3 syllables perform best in recall tests, while names with familiar phonetic patterns feel more trustworthy to consumers.
                </p>
                
                <h3 className="text-2xl font-bold text-slate-800 mb-4">Emotional Associations</h3>
                <p className="text-slate-600 leading-relaxed mb-6">
                  Names trigger emotional responses that influence purchasing decisions. Positive emotional associations can increase customer loyalty by up to 40%. Consider how names like "Apple" evoke freshness and simplicity, while "Amazon" suggests vastness and abundance.
                </p>
                
                <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-8">
                  <h4 className="font-bold text-blue-800 mb-2">ð¡ Pro Tip: The Mere Exposure Effect</h4>
                  <p className="text-blue-700">
                    People develop preferences for things they're familiar with. This is why consistent use of your startup name across all touchpoints is crucial for building brand recognition and trust.
                  </p>
                </div>
                
                <h3 className="text-2xl font-bold text-slate-800 mb-4">Cultural and Linguistic Considerations</h3>
                <p className="text-slate-600 leading-relaxed mb-6">
                  Names carry cultural baggage that can help or hurt your brand. Research shows that names with positive connotations in the target market's native language perform 23% better in brand recognition tests. Always research your name's meaning across different languages and cultures, especially if you plan to expand internationally.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Methodologies Section */}
        <section id="methodologies" className="py-16">
          <div className="container">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-4">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800">Naming Methodologies & Frameworks</h2>
              </div>
              
              <p className="text-slate-600 leading-relaxed mb-8">
                There are four primary methodologies for creating startup names, each with distinct advantages and challenges. Understanding these approaches will help you choose the right strategy for your business.
              </p>
              
              <div className="grid md:grid-cols-2 gap-8">
                {namingMethodologies.map((method, index) => (
                  <div key={index} className="bg-white rounded-2xl p-6 shadow-lg">
                    <h3 className="text-xl font-bold text-slate-800 mb-3">{method.name}</h3>
                    <p className="text-slate-600 mb-4">{method.description}</p>
                    
                    <div className="mb-4">
                      <h4 className="font-semibold text-slate-700 mb-2">Examples:</h4>
                      <div className="flex flex-wrap gap-2">
                        {method.examples.map((example, idx) => (
                          <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                            {example}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-green-700 mb-2">Pros:</h4>
                        <ul className="text-sm text-slate-600 space-y-1">
                          {method.pros.map((pro, idx) => (
                            <li key={idx} className="flex items-start">
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-red-700 mb-2">Cons:</h4>
                        <ul className="text-sm text-slate-600 space-y-1">
                          {method.cons.map((con, idx) => (
                            <li key={idx} className="flex items-start">
                              <AlertTriangle className="w-4 h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                              {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Industry-Specific Section */}
        <section id="industry-specific" className="py-16 bg-white">
          <div className="container">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800">Industry-Specific Naming Strategies</h2>
              </div>
              
              <p className="text-slate-600 leading-relaxed mb-8">
                Different industries have unique naming conventions and audience expectations. Tailoring your naming strategy to your industry can significantly improve market acceptance and brand recognition.
              </p>
              
              <div className="grid md:grid-cols-2 gap-8">
                {industryStrategies.map((strategy, index) => (
                  <div key={index} className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 border border-slate-200">
                    <h3 className="text-xl font-bold text-slate-800 mb-3">{strategy.industry}</h3>
                    
                    <div className="mb-4">
                      <h4 className="font-semibold text-slate-700 mb-2">Key Characteristics:</h4>
                      <ul className="text-sm text-slate-600 space-y-1">
                        {strategy.characteristics.map((char, idx) => (
                          <li key={idx} className="flex items-start">
                            <TrendingUp className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                            {char}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-semibold text-slate-700 mb-2">Successful Examples:</h4>
                      <div className="flex flex-wrap gap-2">
                        {strategy.examples.map((example, idx) => (
                          <span key={idx} className="bg-white text-slate-800 px-3 py-1 rounded-full text-sm font-medium border">
                            {example}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-slate-700 mb-2">Naming Tips:</h4>
                      <ul className="text-sm text-slate-600 space-y-1">
                        {strategy.tips.map((tip, idx) => (
                          <li key={idx} className="flex items-start">
                            <Lightbulb className="w-4 h-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Common Mistakes Section */}
        <section id="mistakes" className="py-16">
          <div className="container">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center mr-4">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800">Common Naming Mistakes to Avoid</h2>
              </div>
              
              <p className="text-slate-600 leading-relaxed mb-8">
                Learning from others' mistakes can save you time, money, and potential legal issues. Here are the most common naming pitfalls and how to avoid them.
              </p>
              
              <div className="space-y-6">
                {commonMistakes.map((mistake, index) => (
                  <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-red-500">
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-4 mt-1">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-800 mb-2">{mistake.mistake}</h3>
                        <p className="text-slate-600 mb-3">{mistake.description}</p>
                        
                        <div className="bg-red-50 rounded-lg p-3 mb-3">
                          <h4 className="font-semibold text-red-800 mb-1">Example:</h4>
                          <p className="text-red-700 text-sm">{mistake.example}</p>
                        </div>
                        
                        <div className="bg-green-50 rounded-lg p-3">
                          <h4 className="font-semibold text-green-800 mb-1">Solution:</h4>
                          <p className="text-green-700 text-sm">{mistake.solution}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white">
          <div className="container text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to Name Your Startup?
            </h2>
            <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
              Put these naming principles into practice with our AI-powered startup name generator. Create memorable, brandable names in seconds.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/naming-tool"
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                <Lightbulb className="w-5 h-5 mr-2 inline" />
                Generate Names with AI
              </Link>
              <Link
                to="/examples"
                className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/30 transition-all duration-300"
              >
                Browse Name Examples
                <ArrowRight className="w-5 h-5 ml-2 inline" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default StartupNamingGuide;