import React, { useState, useEffect } from 'react';
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
  Star,
  Zap,
  Crown,
  Copy,
  Download,
  Heart,
  Clock,
  Target,
  Lightbulb,
  Briefcase,
  MessageSquare,
  Volume2,
  ChevronRight,
  Info,
  Hash
} from 'lucide-react';

const NameAnalysisModal = ({ isOpen, onClose, nameData, onUpgrade }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [copiedText, setCopiedText] = useState('');

  useEffect(() => {
    if (isOpen && nameData) {
      setIsLoading(true);
      generateAdvancedAnalysis(nameData).then(data => {
        setAnalysisData(data);
        setIsLoading(false);
      });
    }
  }, [isOpen, nameData]);

  // Advanced analysis generation with realistic business intelligence
  const generateAdvancedAnalysis = async (name) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      overview: {
        overallScore: 8.7,
        strengths: ['Memorable', 'Brandable', 'SEO-friendly'],
        weaknesses: ['May need explanation', 'Competitive space'],
        recommendation: 'Strong candidate for tech startup'
      },
      brandability: {
        components: [
          { name: 'Length Score', score: 9, max: 10, description: 'Optimal length for memorability' },
          { name: 'Pronunciation', score: 8, max: 10, description: 'Easy to say and remember' },
          { name: 'Visual Appeal', score: 9, max: 10, description: 'Works well in logos and branding' },
          { name: 'Uniqueness', score: 7, max: 10, description: 'Distinctive but not too unusual' },
          { name: 'Industry Fit', score: 9, max: 10, description: 'Perfect for your industry' }
        ],
        insights: [
          'Name follows successful tech startup patterns',
          'Strong potential for viral marketing',
          'Easy to trademark and protect'
        ]
      },
      domainAnalysis: {
        primary: {
          domain: `${name.name.toLowerCase()}.com`,
          available: Math.random() > 0.3,
          price: Math.floor(Math.random() * 50) + 12,
          recommendation: 'Essential for credibility'
        },
        alternatives: [
          { ext: '.ai', available: Math.random() > 0.7, price: 2500, appeal: 'Premium AI positioning' },
          { ext: '.io', available: Math.random() > 0.4, price: 35, appeal: 'Developer-friendly' },
          { ext: '.co', available: Math.random() > 0.5, price: 25, appeal: 'Modern, sleek' },
          { ext: '.app', available: Math.random() > 0.6, price: 18, appeal: 'Mobile-first brand' }
        ],
        strategy: 'Secure .com immediately, consider .ai for premium positioning'
      },
      competitorIntelligence: {
        directCompetitors: [
          { name: 'StreamTech', similarity: 75, status: 'Active startup', funding: '$2.1M' },
          { name: 'CloudFlow', similarity: 65, status: 'Established', funding: '$15M Series B' },
          { name: 'FitnessStream', similarity: 45, status: 'Acquired 2023', funding: 'Acquired for $50M' }
        ],
        marketGap: 'No direct competitor uses this exact positioning',
        opportunity: 'Strong differentiation potential in crowded market'
      },
      trademarkRisk: {
        overallRisk: 'LOW',
        conflicts: [],
        similarMarks: [
          { mark: 'CloudFit Inc.', class: 'Class 42 - Technology', risk: 'Monitor' },
          { mark: 'StreamFit', class: 'Class 9 - Software', risk: 'Low conflict' }
        ],
        recommendations: [
          'File trademark application within 90 days',
          'Conduct comprehensive clearance search',
          'Consider international trademark protection'
        ]
      },
      marketingAnalysis: {
        seoMetrics: {
          searchVolume: 8900,
          competition: 'Medium',
          opportunities: ['fitness technology', 'cloud wellness', 'stream fitness']
        },
        socialMedia: {
          handleAvailability: {
            twitter: Math.random() > 0.3,
            instagram: Math.random() > 0.4,
            linkedin: Math.random() > 0.6,
            tiktok: Math.random() > 0.5
          },
          hashtagPotential: 'High - #CloudFitness trending potential',
          influencerMatch: 'Perfect for fitness tech influencers'
        },
        brandingOpportunities: [
          'Cloud imagery + fitness iconography',
          'Streaming/flow visual metaphors',
          'Tech-forward color palette (blues, greens)',
          'Strong logo potential with CF monogram'
        ]
      },
      phoneticAnalysis: {
        syllables: name.name.match(/[aeiouAEIOU]/g)?.length || 3,
        phoneticSpelling: 'KLOWD-fit-ness',
        pronunciationDifficulty: 'Easy',
        internationalAppeal: 'High',
        voiceSearchScore: 9,
        phoneticInsights: [
          'Clear consonant clusters for recognition',
          'Familiar word patterns reduce cognitive load',
          'Works well in voice commands and dictation'
        ]
      },
      financialProjections: {
        domainCosts: {
          year1: 47,
          year5: 235,
          premium: 2500
        },
        brandingBudget: {
          logoDesign: '1,500 - 5,000',
          websiteDevelopment: '5,000 - 15,000',
          trademarkFiling: '1,200 - 3,000'
        },
        roi: 'High-quality names typically increase valuation by 15-20%'
      }
    };
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'brandability', label: 'Brandability', icon: Star },
    { id: 'domains', label: 'Domains', icon: Globe },
    { id: 'competitors', label: 'Competitors', icon: Users },
    { id: 'trademark', label: 'Trademark', icon: Shield },
    { id: 'marketing', label: 'Marketing', icon: TrendingUp },
    { id: 'phonetics', label: 'Phonetics', icon: Volume2 }
  ];

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(''), 2000);
  };

  const ScoreBar = ({ score, max, label, color = 'blue' }) => (
    <div className="flex items-center space-x-3">
      <div className="w-24 text-sm text-gray-600">{label}</div>
      <div className="flex-1 bg-gray-200 rounded-full h-2 relative">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(score / max) * 100}%` }}
          transition={{ duration: 1, delay: 0.2 }}
          className={`h-full rounded-full bg-gradient-to-r from-${color}-400 to-${color}-600`}
        />
      </div>
      <div className="w-12 text-sm font-medium text-gray-900">{score}/{max}</div>
    </div>
  );

  const MetricCard = ({ icon: Icon, title, value, subtitle, color = 'blue' }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-3">
        <div className={`p-2 bg-${color}-100 rounded-lg`}>
          <Icon className={`w-5 h-5 text-${color}-600`} />
        </div>
        <div className="flex-1">
          <div className="text-sm text-gray-600">{title}</div>
          <div className="text-lg font-semibold text-gray-900">{value}</div>
          {subtitle && <div className="text-xs text-gray-500">{subtitle}</div>}
        </div>
      </div>
    </div>
  );

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Overall Score */}
      <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
        <div className="text-4xl font-bold text-gray-900 mb-2">
          {analysisData.overview.overallScore}/10
        </div>
        <div className="text-lg text-gray-600 mb-4">Overall Name Score</div>
        <div className="flex justify-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-6 h-6 ${
                i < Math.floor(analysisData.overview.overallScore / 2)
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <MetricCard
          icon={CheckCircle}
          title="Strengths"
          value={analysisData.overview.strengths.length}
          subtitle="Key advantages"
          color="green"
        />
        <MetricCard
          icon={AlertTriangle}
          title="Considerations"
          value={analysisData.overview.weaknesses.length}
          subtitle="Areas to address"
          color="yellow"
        />
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
            Strengths
          </h3>
          {analysisData.overview.strengths.map((strength, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <span className="text-gray-700">{strength}</span>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2" />
            Considerations
          </h3>
          {analysisData.overview.weaknesses.map((weakness, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full" />
              <span className="text-gray-700">{weakness}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendation */}
      <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-400">
        <div className="flex items-start space-x-3">
          <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">Expert Recommendation</h4>
            <p className="text-blue-800 mt-1">{analysisData.overview.recommendation}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBrandabilityTab = () => (
    <div className="space-y-6">
      {/* Brandability Score Breakdown */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Brandability Components</h3>
        {analysisData.brandability.components.map((component, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">{component.name}</span>
              <span className="text-sm text-gray-500">{component.score}/{component.max}</span>
            </div>
            <ScoreBar score={component.score} max={component.max} label="" />
            <p className="text-xs text-gray-600 ml-2">{component.description}</p>
          </div>
        ))}
      </div>

      {/* Brand Insights */}
      <div className="bg-purple-50 rounded-lg p-4">
        <h4 className="font-medium text-purple-900 mb-3 flex items-center">
          <Zap className="w-4 h-4 mr-2" />
          Brand Insights
        </h4>
        <div className="space-y-2">
          {analysisData.brandability.insights.map((insight, index) => (
            <div key={index} className="flex items-start space-x-2">
              <ChevronRight className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
              <span className="text-purple-800 text-sm">{insight}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Visual Branding Suggestions */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
          <Eye className="w-4 h-4 mr-2" />
          Visual Branding Potential
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg">
            <div className="text-2xl font-bold text-blue-800 mb-1">CF</div>
            <div className="text-xs text-blue-600">Monogram Logo</div>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-lg">
            <Crown className="w-8 h-8 text-green-700 mx-auto mb-1" />
            <div className="text-xs text-green-600">Premium Badge</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDomainsTab = () => (
    <div className="space-y-6">
      {/* Primary Domain */}
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">Primary Domain</h3>
          {analysisData.domainAnalysis.primary.available ? (
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
              Available
            </span>
          ) : (
            <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
              Taken
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <Globe className="w-5 h-5 text-blue-600" />
            <span className="font-medium">{analysisData.domainAnalysis.primary.domain}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-lg font-semibold">${analysisData.domainAnalysis.primary.price}/year</span>
            <button
              onClick={() => copyToClipboard(analysisData.domainAnalysis.primary.domain, 'domain')}
              className="p-1 hover:bg-gray-200 rounded"
            >
              <Copy className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mt-2">{analysisData.domainAnalysis.primary.recommendation}</p>
      </div>

      {/* Alternative Domains */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Alternative Extensions</h3>
        <div className="space-y-3">
          {analysisData.domainAnalysis.alternatives.map((alt, index) => (
            <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${alt.available ? 'bg-green-400' : 'bg-red-400'}`} />
                <span className="font-medium">{nameData.name.toLowerCase()}{alt.ext}</span>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{alt.appeal}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`font-semibold ${alt.price > 100 ? 'text-orange-600' : 'text-gray-900'}`}>
                  ${alt.price}
                </span>
                {alt.available && (
                  <button className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700">
                    Reserve
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Domain Strategy */}
      <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-400">
        <h4 className="font-medium text-blue-900 mb-2 flex items-center">
          <Target className="w-4 h-4 mr-2" />
          Domain Strategy
        </h4>
        <p className="text-blue-800">{analysisData.domainAnalysis.strategy}</p>
      </div>
    </div>
  );

  const renderCompetitorsTab = () => (
    <div className="space-y-6">
      {/* Market Opportunity */}
      <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-400">
        <h3 className="font-medium text-green-900 mb-2 flex items-center">
          <Target className="w-4 h-4 mr-2" />
          Market Opportunity
        </h3>
        <p className="text-green-800 mb-2">{analysisData.competitorIntelligence.marketGap}</p>
        <p className="text-green-700 text-sm">{analysisData.competitorIntelligence.opportunity}</p>
      </div>

      {/* Direct Competitors */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Competitive Landscape</h3>
        <div className="space-y-4">
          {analysisData.competitorIntelligence.directCompetitors.map((competitor, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{competitor.name}</h4>
                    <p className="text-sm text-gray-600">{competitor.status}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{competitor.similarity}% Similar</div>
                  <div className="text-xs text-gray-500">{competitor.funding}</div>
                </div>
              </div>
              
              {/* Similarity Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-full rounded-full ${
                    competitor.similarity > 70 ? 'bg-red-400' : 
                    competitor.similarity > 50 ? 'bg-yellow-400' : 'bg-green-400'
                  }`}
                  style={{ width: `${competitor.similarity}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Competitive Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          icon={Users}
          title="Direct Competitors"
          value={analysisData.competitorIntelligence.directCompetitors.length}
          subtitle="In your space"
          color="blue"
        />
        <MetricCard
          icon={TrendingUp}
          title="Funding Range"
          value="$2M-$50M"
          subtitle="Competitor range"
          color="green"
        />
        <MetricCard
          icon={Target}
          title="Market Position"
          value="Strong"
          subtitle="Differentiation potential"
          color="purple"
        />
      </div>
    </div>
  );

  const renderTrademarkTab = () => (
    <div className="space-y-6">
      {/* Risk Assessment */}
      <div className="text-center">
        <div className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-semibold ${
          analysisData.trademarkRisk.overallRisk === 'LOW' ? 'bg-green-100 text-green-800' :
          analysisData.trademarkRisk.overallRisk === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          <Shield className="w-5 h-5 mr-2" />
          {analysisData.trademarkRisk.overallRisk} RISK
        </div>
      </div>

      {/* Risk Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          icon={Shield}
          title="Direct Conflicts"
          value={analysisData.trademarkRisk.conflicts.length}
          subtitle="Exact matches"
          color="green"
        />
        <MetricCard
          icon={Eye}
          title="Similar Marks"
          value={analysisData.trademarkRisk.similarMarks.length}
          subtitle="To monitor"
          color="yellow"
        />
        <MetricCard
          icon={CheckCircle}
          title="Clearance"
          value="Good"
          subtitle="Initial assessment"
          color="green"
        />
      </div>

      {/* Similar Marks */}
      {analysisData.trademarkRisk.similarMarks.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Similar Trademarks</h3>
          <div className="space-y-3">
            {analysisData.trademarkRisk.similarMarks.map((mark, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{mark.mark}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    mark.risk === 'Low conflict' ? 'bg-green-100 text-green-800' :
                    mark.risk === 'Monitor' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {mark.risk}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{mark.class}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-3 flex items-center">
          <Lightbulb className="w-4 h-4 mr-2" />
          Trademark Recommendations
        </h4>
        <div className="space-y-2">
          {analysisData.trademarkRisk.recommendations.map((rec, index) => (
            <div key={index} className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2" />
              <span className="text-blue-800 text-sm">{rec}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Items */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
          <Clock className="w-4 h-4 mr-2" />
          Next Steps
        </h4>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
            <span className="text-gray-700">Conduct comprehensive trademark search</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
            <span className="text-gray-700">File trademark application in relevant classes</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
            <span className="text-gray-700">Consider international protection strategy</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMarketingTab = () => (
    <div className="space-y-6">
      {/* SEO Metrics */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Search className="w-5 h-5 mr-2" />
          SEO Analysis
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <MetricCard
            icon={TrendingUp}
            title="Search Volume"
            value={analysisData.marketingAnalysis.seoMetrics.searchVolume.toLocaleString()}
            subtitle="Monthly searches"
            color="blue"
          />
          <MetricCard
            icon={Target}
            title="Competition"
            value={analysisData.marketingAnalysis.seoMetrics.competition}
            subtitle="SEO difficulty"
            color="yellow"
          />
          <MetricCard
            icon={Award}
            title="Opportunities"
            value={analysisData.marketingAnalysis.seoMetrics.opportunities.length}
            subtitle="Keyword targets"
            color="green"
          />
        </div>

        <div>
          <h4 className="font-medium text-gray-900 mb-2">SEO Opportunities</h4>
          <div className="flex flex-wrap gap-2">
            {analysisData.marketingAnalysis.seoMetrics.opportunities.map((keyword, index) => (
              <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Social Media Analysis */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <MessageSquare className="w-5 h-5 mr-2" />
          Social Media Availability
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {Object.entries(analysisData.marketingAnalysis.socialMedia.handleAvailability).map(([platform, available]) => (
            <div key={platform} className="flex items-center space-x-2 p-2 border rounded">
              <div className={`w-3 h-3 rounded-full ${available ? 'bg-green-400' : 'bg-red-400'}`} />
              <span className="text-sm capitalize">{platform}</span>
              {available && <CheckCircle className="w-4 h-4 text-green-600" />}
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <div className="flex items-start space-x-2">
            <Hash className="w-4 h-4 text-gray-600 mt-1" />
            <div>
              <span className="font-medium text-gray-900">Hashtag Potential: </span>
              <span className="text-gray-700">{analysisData.marketingAnalysis.socialMedia.hashtagPotential}</span>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <Users className="w-4 h-4 text-gray-600 mt-1" />
            <div>
              <span className="font-medium text-gray-900">Influencer Match: </span>
              <span className="text-gray-700">{analysisData.marketingAnalysis.socialMedia.influencerMatch}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Branding Opportunities */}
      <div className="bg-purple-50 rounded-lg p-4">
        <h4 className="font-medium text-purple-900 mb-3 flex items-center">
          <Eye className="w-4 h-4 mr-2" />
          Visual Branding Opportunities
        </h4>
        <div className="space-y-2">
          {analysisData.marketingAnalysis.brandingOpportunities.map((opportunity, index) => (
            <div key={index} className="flex items-start space-x-2">
              <ChevronRight className="w-4 h-4 text-purple-600 mt-0.5" />
              <span className="text-purple-800 text-sm">{opportunity}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Marketing Score */}
      <div className="text-center bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
        <div className="text-3xl font-bold text-gray-900 mb-2">8.5/10</div>
        <div className="text-lg text-gray-600">Marketing Potential Score</div>
        <div className="text-sm text-gray-500 mt-2">Strong SEO and social media potential</div>
      </div>
    </div>
  );

  const renderPhoneticsTab = () => (
    <div className="space-y-6">
      {/* Pronunciation Overview */}
      <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Volume2 className="w-8 h-8 text-blue-600" />
          <div className="text-2xl font-bold text-gray-900">{analysisData.phoneticAnalysis.phoneticSpelling}</div>
        </div>
        <div className="text-lg text-gray-600 mb-2">Phonetic Spelling</div>
        <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
          analysisData.phoneticAnalysis.pronunciationDifficulty === 'Easy' ? 'bg-green-100 text-green-800' :
          analysisData.phoneticAnalysis.pronunciationDifficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {analysisData.phoneticAnalysis.pronunciationDifficulty} to pronounce
        </div>
      </div>

      {/* Phonetic Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          icon={Volume2}
          title="Syllables"
          value={analysisData.phoneticAnalysis.syllables}
          subtitle="Optimal: 2-3"
          color="blue"
        />
        <MetricCard
          icon={Globe}
          title="International Appeal"
          value={analysisData.phoneticAnalysis.internationalAppeal}
          subtitle="Global pronunciation"
          color="green"
        />
        <MetricCard
          icon={Mic}
          title="Voice Search Score"
          value={`${analysisData.phoneticAnalysis.voiceSearchScore}/10`}
          subtitle="Voice recognition"
          color="purple"
        />
      </div>

      {/* Phonetic Analysis */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Mic className="w-5 h-5 mr-2" />
          Voice & Recognition Analysis
        </h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Voice Search Compatibility</span>
            <ScoreBar score={analysisData.phoneticAnalysis.voiceSearchScore} max={10} label="" color="purple" />
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-700">International Pronunciation</span>
            <span className="font-medium text-gray-900">{analysisData.phoneticAnalysis.internationalAppeal}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Syllable Count</span>
            <span className="font-medium text-gray-900">{analysisData.phoneticAnalysis.syllables} syllables</span>
          </div>
        </div>
      </div>

      {/* Phonetic Insights */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-3 flex items-center">
          <Lightbulb className="w-4 h-4 mr-2" />
          Phonetic Insights
        </h4>
        <div className="space-y-2">
          {analysisData.phoneticAnalysis.phoneticInsights.map((insight, index) => (
            <div key={index} className="flex items-start space-x-2">
              <ChevronRight className="w-4 h-4 text-blue-600 mt-0.5" />
              <span className="text-blue-800 text-sm">{insight}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Voice Technology Compatibility */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
          <Mic className="w-4 h-4 mr-2" />
          Voice Technology Compatibility
        </h4>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-1" />
            <div className="text-sm font-medium text-green-800">Alexa Ready</div>
            <div className="text-xs text-green-600">Clear pronunciation</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-1" />
            <div className="text-sm font-medium text-green-800">Siri Compatible</div>
            <div className="text-xs text-green-600">Easy recognition</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-1" />
            <div className="text-sm font-medium text-green-800">Google Assistant</div>
            <div className="text-xs text-green-600">High accuracy</div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <Info className="w-6 h-6 text-blue-600 mx-auto mb-1" />
            <div className="text-sm font-medium text-blue-800">Dictation Friendly</div>
            <div className="text-xs text-blue-600">Spelling assistance</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewTab();
      case 'brandability':
        return renderBrandabilityTab();
      case 'domains':
        return renderDomainsTab();
      case 'competitors':
        return renderCompetitorsTab();
      case 'trademark':
        return renderTrademarkTab();
      case 'marketing':
        return renderMarketingTab();
      case 'phonetics':
        return renderPhoneticsTab();
      default:
        return renderOverviewTab();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Analysis: {nameData?.name}
              </h2>
              <p className="text-gray-600 mt-1">Comprehensive name evaluation</p>
            </div>
            <div className="flex items-center space-x-2">
              {copiedText && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded"
                >
                  Copied {copiedText}!
                </motion.div>
              )}
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200 px-6">
            <div className="flex space-x-1 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
                  <p className="text-gray-600">Analyzing your name...</p>
                </div>
              </div>
            ) : (
              analysisData && renderTabContent()
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Generated by StartupName AI
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {}}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Export PDF</span>
                </button>
                <button
                  onClick={() => {}}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <Heart className="w-4 h-4" />
                  <span>Save Analysis</span>
                </button>
                <button
                  onClick={onUpgrade}
                  className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  <Crown className="w-4 h-4" />
                  <span>Upgrade for More</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default NameAnalysisModal;