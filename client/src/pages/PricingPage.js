import {
  ArrowRight,
  Brain,
  Check,
  Crown,
  Globe,
  Rocket,
  Shield,
  Sparkles,
  Star,
  TrendingUp,
  X,
  Zap
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import paymentService from '../services/paymentService';

const PricingPage = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [searchParams] = useSearchParams();
  const [showAnalysisPromo, setShowAnalysisPromo] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user came from analysis page
    const source = searchParams.get('source');
    const feature = searchParams.get('feature');

    if (source === 'analysis' && feature === 'premium-analysis') {
      setShowAnalysisPromo(true);
    }

    // Check for payment success or cancellation
    const sessionId = searchParams.get('session_id');
    const cancelled = searchParams.get('cancelled');

    if (sessionId) {
      handlePaymentSuccess(sessionId);
    } else if (cancelled) {
      handlePaymentCancellation();
    }
  }, [searchParams]);

  // Payment Processing Functions
  const handlePlanSelection = async (planName, planData) => {
    if (planName === 'Free') {
      // Redirect to naming tool for free plan
      navigate('/naming-tool');
      return;
    }

    try {
      setIsProcessing(true);
      console.log('💳 Processing plan selection:', planName, planData);

      // Map plan names to payment service plan types
      const planTypeMap = {
        'Pro': 'pro',
        'Enterprise': 'enterprise'
      };

      const planType = planTypeMap[planName];
      const billingInterval = isAnnual ? 'year' : 'month';

      // Redirect to Stripe checkout
      await paymentService.redirectToCheckout(planType, billingInterval);

    } catch (error) {
      console.error('❌ Payment processing failed:', error);
      alert(`Payment processing failed: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = (sessionId) => {
    console.log('✅ Payment successful:', sessionId);
    paymentService.handlePaymentSuccess(sessionId);

    // Show success message
    alert('Payment successful! Your premium features are now active.');

    // Redirect to naming tool
    navigate('/naming-tool');
  };

  const handlePaymentCancellation = () => {
    console.log('❌ Payment cancelled');
    paymentService.handlePaymentCancellation();

    // Show cancellation message
    alert('Payment was cancelled. You can try again anytime.');
  };

  const plans = [
    {
      name: "Free",
      description: "Perfect for exploring ideas",
      price: 0,
      annualPrice: 0,
      icon: Zap,
      color: "from-gray-500 to-gray-600",
      popular: false,
      features: [
        { text: "10 name generations per month", included: true },
        { text: "Basic brandability scoring", included: true },
        { text: "Domain availability check", included: true },
        { text: "5 industries supported", included: true },
        { text: "Email support", included: true },
        { text: "Advanced AI analysis", included: false },
        { text: "Trademark screening", included: false },
        { text: "Priority support", included: false },
        { text: "Custom naming styles", included: false },
        { text: "Export to PDF", included: false }
      ],
      cta: "Get Started Free",
      ctaLink: "/naming-tool"
    },
    {
      name: "Pro",
      description: "For serious entrepreneurs",
      price: 19,
      annualPrice: 15,
      icon: Crown,
      color: "from-blue-500 to-purple-600",
      popular: true,
      features: [
        { text: "100 name generations per month", included: true },
        { text: "Advanced brandability scoring", included: true },
        { text: "Domain availability check", included: true },
        { text: "All industries supported", included: true },
        { text: "Priority email support", included: true },
        { text: "Advanced AI analysis", included: true },
        { text: "Basic trademark screening", included: true },
        { text: "Custom naming styles", included: true },
        { text: "Export to PDF", included: true },
        { text: "Name history & favorites", included: true }
      ],
      cta: "Start Pro Trial",
      ctaLink: "/naming-tool"
    },
    {
      name: "Enterprise",
      description: "For teams and agencies",
      price: 99,
      annualPrice: 79,
      icon: Rocket,
      color: "from-purple-600 to-pink-600",
      popular: false,
      features: [
        { text: "Unlimited name generations", included: true },
        { text: "Premium brandability scoring", included: true },
        { text: "Domain availability check", included: true },
        { text: "All industries + custom", included: true },
        { text: "24/7 priority support", included: true },
        { text: "Advanced AI analysis", included: true },
        { text: "Full trademark screening", included: true },
        { text: "Custom naming styles", included: true },
        { text: "Export to PDF & CSV", included: true },
        { text: "Team collaboration tools", included: true }
      ],
      cta: "Contact Sales",
      ctaLink: "/contact"
    }
  ];

  const features = [
    {
      icon: Brain,
      title: "Advanced AI Technology",
      description: "Powered by cutting-edge language models trained on millions of brand names and market data."
    },
    {
      icon: Globe,
      title: "Global Brand Analysis",
      description: "Names are evaluated for international appeal and cultural sensitivity across 50+ countries."
    },
    {
      icon: TrendingUp,
      title: "Market Intelligence",
      description: "Real-time analysis of naming trends, competitor landscape, and consumer preferences."
    },
    {
      icon: Shield,
      title: "Trademark Protection",
      description: "Advanced screening to help avoid potential trademark conflicts and legal issues."
    }
  ];

  const faqs = [
    {
      question: "How does the free plan work?",
      answer: "Our free plan gives you 10 name generations per month with basic features. Perfect for testing our AI and exploring initial ideas for your startup."
    },
    {
      question: "Can I upgrade or downgrade my plan anytime?",
      answer: "Yes, you can change your plan at any time. Upgrades take effect immediately, and downgrades apply at the end of your current billing cycle."
    },
    {
      question: "Do you offer refunds?",
      answer: "We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, we'll provide a full refund, no questions asked."
    },
    {
      question: "What's included in trademark screening?",
      answer: "Our trademark screening checks against registered trademarks in major jurisdictions. Pro includes basic screening, Enterprise includes comprehensive global screening."
    },
    {
      question: "How accurate is domain availability checking?",
      answer: "We check domain availability in real-time across popular TLDs (.com, .net, .org, etc.). However, domains can be registered quickly, so we recommend securing your domain immediately."
    },
    {
      question: "Can I use the names commercially?",
      answer: "Yes, all names generated are free to use commercially. We don't claim ownership of the names - they're yours to use for your business."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Pricing Plans - AI Startup Name Generator | StartupNamer.org</title>
        <meta
          name="description"
          content="Choose the perfect plan for your startup naming needs. Free tier available. Pro and Enterprise plans with advanced AI features and trademark screening."
        />
        <meta name="keywords" content="startup name generator pricing, AI naming tool cost, business name generator plans, trademark screening" />
        <link rel="canonical" href="https://startupnamer.org/pricing" />

        {/* Open Graph */}
        <meta property="og:title" content="Affordable AI Startup Name Generator Plans" />
        <meta property="og:description" content="Start free, upgrade when ready. Professional naming tools for entrepreneurs and enterprises." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://startupnamer.org/pricing" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AI Startup Name Generator - Pricing Plans" />
        <meta name="twitter:description" content="Free tier available. Pro features for serious entrepreneurs." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Analysis Promo Banner */}
        {showAnalysisPromo && (
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4">
            <div className="container text-center">
              <div className="flex items-center justify-center space-x-2">
                <Brain className="w-5 h-5" />
                <span className="font-semibold">Unlock Advanced AI Analysis!</span>
                <span className="text-blue-200">Get detailed brandability insights, competitor analysis, and trademark screening.</span>
              </div>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-pink-600/5"></div>

          <div className="container relative">
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <Star className="w-8 h-8 text-white" />
                </div>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-6">
                Simple, Transparent
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Pricing</span>
              </h1>

              <p className="text-xl text-slate-600 mb-10 leading-relaxed">
                Start free, scale as you grow. Choose the perfect plan for your startup naming needs.
              </p>

              {/* Annual/Monthly Toggle */}
              <div className="flex items-center justify-center mb-10">
                <span className={`text-sm font-medium mr-3 ${!isAnnual ? 'text-slate-800' : 'text-slate-500'}`}>
                  Monthly
                </span>
                <button
                  onClick={() => setIsAnnual(!isAnnual)}
                  className={`relative w-14 h-7 rounded-full transition-colors duration-200 ${isAnnual ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-slate-300'
                    }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${isAnnual ? 'transform translate-x-7' : ''
                      }`}
                  />
                </button>
                <span className={`text-sm font-medium ml-3 ${isAnnual ? 'text-slate-800' : 'text-slate-500'}`}>
                  Annual
                </span>
                {isAnnual && (
                  <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                    Save 20%
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-20">
          <div className="container">
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {plans.map((plan, index) => (
                <div
                  key={plan.name}
                  className={`relative bg-white rounded-2xl shadow-xl p-8 transform hover:scale-105 transition-all duration-300 ${plan.popular ? 'ring-2 ring-blue-500 shadow-blue-200/50' : ''
                    }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                        Most Popular
                      </div>
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <div className={`w-16 h-16 bg-gradient-to-br ${plan.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                      <plan.icon className="w-8 h-8 text-white" />
                    </div>

                    <h3 className="text-2xl font-bold text-slate-800 mb-2">{plan.name}</h3>
                    <p className="text-slate-600 mb-4">{plan.description}</p>

                    <div className="mb-6">
                      <span className="text-4xl font-bold text-slate-800">
                        ${isAnnual ? plan.annualPrice : plan.price}
                      </span>
                      {plan.price > 0 && (
                        <span className="text-slate-500 text-sm ml-1">
                          /month
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handlePlanSelection(plan.name, plan)}
                      disabled={isProcessing}
                      className={`block w-full py-3 px-6 rounded-xl font-semibold text-center transition-all duration-300 ${plan.popular
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed'
                        }`}
                    >
                      {isProcessing ? 'Processing...' : plan.cta}
                    </button>
                  </div>

                  <ul className="space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        {feature.included ? (
                          <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        ) : (
                          <X className="w-5 h-5 text-slate-300 mr-3 mt-0.5 flex-shrink-0" />
                        )}
                        <span className={`text-sm ${feature.included ? 'text-slate-700' : 'text-slate-400'
                          }`}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gradient-to-br from-slate-800 to-slate-900 text-white">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Why Choose
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"> StartupNamer.org</span>
              </h2>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                Advanced AI technology and comprehensive features to help you find the perfect startup name.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Everything you need to know about our pricing and features.
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="text-lg font-bold text-slate-800 mb-3">{faq.question}</h3>
                  <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white">
          <div className="container text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to Find Your Perfect Name?
            </h2>
            <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
              Join thousands of entrepreneurs who have discovered their ideal startup name with our AI-powered generator.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/naming-tool"
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                <Sparkles className="w-5 h-5 mr-2 inline" />
                Start Free Today
              </Link>
              <Link
                to="/how-it-works"
                className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/30 transition-all duration-300"
              >
                How It Works
                <ArrowRight className="w-5 h-5 ml-2 inline" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default PricingPage;