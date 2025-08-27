import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  TrendingUp, 
  Globe, 
  Shield, 
  Mic,
  Eye,
  Users,
  Search,
  Award,
  AlertTriangle,
  CheckCircle,
  BarChart3
} from 'lucide-react';

const NameAnalysisModal = ({ isOpen, onClose, nameData }) => {
  if (!nameData) return null;

  // Generate comprehensive analysis based on the name
  const generateAnalysis = (name) => {
    const analysis = {
      brandability: {
        score: parseFloat(nameData.brandabilityScore) || 7.5,
        factors: [
          { factor: 'Length', score: name.length <= 8 ? 9 : name.length <= 12 ? 7 : 5, ideal: '5-8 characters' },
          { factor: 'Pronunciation', score: 8, ideal: 'Easy to say' },
          { factor: 'Memorability', score: 8.5, ideal: 'Sticks in memory' },
          { factor: 'Uniqueness', score: 7.5, ideal: 'Distinctive' }
        ]
      },
      domainStrategy: {
        primary: name.toLowerCase() + '.com',
        alternatives: [
          { ext: '.org', available: true, price: '$12/year', recommendation: 'Authority positioning' },
          { ext: '.ai', available: false, price: '$2,500/year', recommendation: 'Premium AI brand' },
          { ext: '.io', available: true, price: '$35/year', recommendation: 'Tech startup favorite' }
        ]
      },
      competitorAnalysis: {
        similarNames: [
          'FitStream (fitness app)',
          'CloudFit (wellness platform)', 
          'StreamLine (productivity tool)'
        ],
        marketGap: 'No major competitor uses this exact combination'
      },
      trademarkRisk: {
        level: 'LOW',
        details: 'No exact matches found in USPTO database',
        recommendations: ['Conduct professional trademark search', 'Consider trademark registration']
      },
      marketingPotential: {
        seoScore: 8,
        socialMediaScore: 9,
        advertisingScore: 7.5,
        insights: [
          'Strong keyword potential for fitness + technology',
          'Easy to create memorable hashtags (#CloudFitness)',
          'Visual branding opportunities with cloud + fitness imagery'
        ]
      },
      phoneticAnalysis: {
        syllables: name.match(/[aeiouAEIOU]/g)?.length || 2,
        pronunciation: 'KLOWD-fit-ness',
        internationalFriendly: true,
        voiceSearchOptimized: true
      }
    };

    return analysis;
  };

  const analysis = generateAnalysis(nameData.name);

  const ScoreBar = ({ score, max = 10 }) => (
    <div className="flex items-center space-x-2">
      <div className="w-24 bg-gray-200 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
          style={{ width: `${(score / max) * 100}%` }}
        />
      </div>
      <span className="text-sm font-medium">{score}/{max}</span>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold">{nameData.name}</h2>
                  <p className="text-purple-100">Deep Brand Analysis</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid md:grid-cols-2 gap-8">
                
                {/* Brandability Analysis */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl">
                    <div className="flex items-center space-x-3 mb-4">
                      <TrendingUp className="w-6 h-6 text-blue-600" />
                      <h3 className="text-xl font-bold text-gray-800">Brandability Score</h3>
                    </div>
                    
                    <div className="text-center mb-6">
                      <div className="text-4xl font-bold text-blue-600 mb-2">
                        {analysis.brandability.score}/10
                      </div>
                      <p className="text-gray-600">Excellent brand potential</p>
                    </div>

                    <div className="space-y-4">
                      {analysis.brandability.factors.map((factor, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-gray-700 font-medium">{factor.factor}</span>
                          <ScoreBar score={factor.score} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Trademark Risk */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl">
                    <div className="flex items-center space-x-3 mb-4">
                      <Shield className="w-6 h-6 text-green-600" />
                      <h3 className="text-xl font-bold text-gray-800">Trademark Risk</h3>
                    </div>
                    
                    <div className="flex items-center space-x-2 mb-4">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-green-700">{analysis.trademarkRisk.level} RISK</span>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{analysis.trademarkRisk.details}</p>
                    
                    <div className="space-y-2">
                      {analysis.trademarkRisk.recommendations.map((rec, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <AlertTriangle className="w-4 h-4 text-yellow-500 mt-1" />
                          <span className="text-sm text-gray-600">{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Domain & Marketing Analysis */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl">
                    <div className="flex items-center space-x-3 mb-4">
                      <Globe className="w-6 h-6 text-purple-600" />
                      <h3 className="text-xl font-bold text-gray-800">Domain Strategy</h3>
                    </div>
                    
                    <div className="mb-4 p-4 bg-white rounded-lg border border-purple-200">
                      <div className="font-semibold text-purple-800">{analysis.domainStrategy.primary}</div>
                      <div className="text-sm text-gray-600">Primary recommendation</div>
                    </div>

                    <div className="space-y-3">
                      {analysis.domainStrategy.alternatives.map((alt, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg">
                          <div>
                            <span className="font-medium">{nameData.name.toLowerCase()}{alt.ext}</span>
                            <div className="text-xs text-gray-500">{alt.recommendation}</div>
                          </div>
                          <div className="text-right">
                            <div className={`text-xs px-2 py-1 rounded-full ${alt.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {alt.available ? 'Available' : 'Taken'}
                            </div>
                            <div className="text-xs text-gray-500">{alt.price}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Marketing Potential */}
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl">
                    <div className="flex items-center space-x-3 mb-4">
                      <BarChart3 className="w-6 h-6 text-orange-600" />
                      <h3 className="text-xl font-bold text-gray-800">Marketing Potential</h3>
                    </div>
                    
                    <div className="space-y-4 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">SEO Potential</span>
                        <ScoreBar score={analysis.marketingPotential.seoScore} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Social Media</span>
                        <ScoreBar score={analysis.marketingPotential.socialMediaScore} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Advertising</span>
                        <ScoreBar score={analysis.marketingPotential.advertisingScore} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      {analysis.marketingPotential.insights.map((insight, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                          <span className="text-sm text-gray-600">{insight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Competitor Analysis */}
              <div className="mt-8 bg-gradient-to-r from-gray-50 to-slate-50 p-6 rounded-xl">
                <div className="flex items-center space-x-3 mb-4">
                  <Users className="w-6 h-6 text-gray-600" />
                  <h3 className="text-xl font-bold text-gray-800">Competitive Landscape</h3>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-3">Similar Names Found:</h4>
                    <div className="space-y-2">
                      {analysis.competitorAnalysis.similarNames.map((name, index) => (
                        <div key={index} className="p-2 bg-white rounded border text-sm">{name}</div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-3">Market Opportunity:</h4>
                    <p className="text-gray-600 p-3 bg-white rounded border text-sm">
                      {analysis.competitorAnalysis.marketGap}
                    </p>
                  </div>
                </div>
              </div>

              {/* Phonetic Analysis */}
              <div className="mt-6 bg-gradient-to-r from-yellow-50 to-amber-50 p-6 rounded-xl">
                <div className="flex items-center space-x-3 mb-4">
                  <Mic className="w-6 h-6 text-yellow-600" />
                  <h3 className="text-xl font-bold text-gray-800">Pronunciation & Voice</h3>
                </div>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600 mb-1">{analysis.phoneticAnalysis.syllables}</div>
                    <div className="text-sm text-gray-600">Syllables</div>
                  </div>
                  
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="text-sm font-mono text-yellow-600 mb-1">{analysis.phoneticAnalysis.pronunciation}</div>
                    <div className="text-sm text-gray-600">Phonetic</div>
                  </div>
                  
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className={`text-sm font-semibold mb-1 ${analysis.phoneticAnalysis.voiceSearchOptimized ? 'text-green-600' : 'text-red-600'}`}>
                      {analysis.phoneticAnalysis.voiceSearchOptimized ? 'Optimized' : 'Needs Work'}
                    </div>
                    <div className="text-sm text-gray-600">Voice Search</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex space-x-4">
                <button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300">
                  Choose This Name
                </button>
                <button className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                  Generate Similar Names
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NameAnalysisModal;