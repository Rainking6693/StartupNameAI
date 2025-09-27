import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Star, 
  Crown, 
  ArrowRight,
  Zap,
  Mail,
  Download
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import paymentService from '../services/paymentService';

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    if (sessionId) {
      // Handle successful payment
      paymentService.handlePaymentSuccess(sessionId);
      
      // Store session for display
      setSessionData({
        sessionId,
        plan: 'Professional',
        amount: '$39',
        activatedAt: new Date().toISOString()
      });
    }
    
    setLoading(false);
  }, [searchParams]);

  const handleGetStarted = () => {
    navigate('/naming-tool');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-xl">Processing your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Payment Successful - Welcome to StartupNamer Pro</title>
        <meta name="description" content="Your payment was successful! Welcome to StartupNamer Pro. Start generating professional startup names now." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
        <div className="container mx-auto px-6 py-16">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Success Icon */}
            <motion.div
              className="inline-flex items-center justify-center w-24 h-24 bg-green-500 rounded-full mb-8"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <CheckCircle className="w-12 h-12 text-white" />
            </motion.div>

            {/* Success Message */}
            <motion.h1
              className="text-5xl md:text-6xl font-black text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Payment Successful! 🎉
            </motion.h1>

            <motion.p
              className="text-2xl text-white/90 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              Welcome to StartupNamer Professional! Your account has been upgraded.
            </motion.p>

            {/* Payment Details */}
            {sessionData && (
              <motion.div
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-12 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <div className="flex items-center justify-center mb-6">
                  <Crown className="w-8 h-8 text-yellow-400 mr-3" />
                  <h2 className="text-2xl font-bold text-white">Professional Plan Activated</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 text-left">
                  <div>
                    <h3 className="text-white/80 font-semibold mb-2">Plan Details</h3>
                    <p className="text-white">Professional Plan</p>
                    <p className="text-white">Amount: {sessionData.amount}/month</p>
                    <p className="text-white/80 text-sm">Activated: {new Date(sessionData.activatedAt).toLocaleString()}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-white/80 font-semibold mb-2">What You Get</h3>
                    <ul className="text-white space-y-1 text-sm">
                      <li>✅ 200 AI-generated names</li>
                      <li>✅ Premium brandability scoring</li>
                      <li>✅ Advanced industry analysis</li>
                      <li>✅ Priority support</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Next Steps */}
            <motion.div
              className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-2xl p-8 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
            >
              <h2 className="text-3xl font-bold text-white mb-6">What's Next?</h2>
              
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="space-y-3">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Start Creating</h3>
                  <p className="text-white/80">Use the AI naming tool to generate professional startup names immediately</p>
                </div>
                
                <div className="space-y-3">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                    <Mail className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Check Email</h3>
                  <p className="text-white/80">You'll receive a confirmation email with your receipt and account details</p>
                </div>
                
                <div className="space-y-3">
                  <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto">
                    <Download className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Export Results</h3>
                  <p className="text-white/80">Download your naming results as PDF for presentations and team sharing</p>
                </div>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className="space-y-4 md:space-y-0 md:space-x-6 md:flex md:justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              <motion.button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center space-x-2 mx-auto md:mx-0"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Zap className="w-5 h-5" />
                <span>Start Naming Now</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                onClick={() => navigate('/account')}
                className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all duration-300 border border-white/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Manage Account
              </motion.button>
            </motion.div>

            {/* Support */}
            <motion.div
              className="mt-16 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
            >
              <p className="text-white/60 mb-4">Need help getting started?</p>
              <a 
                href="mailto:support@startupnamer.org"
                className="text-blue-400 hover:text-blue-300 transition-colors underline"
              >
                Contact our support team
              </a>
              <p className="text-white/40 text-sm mt-2">
                We typically respond within 2 hours during business hours
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default PaymentSuccessPage;