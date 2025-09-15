import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Shield, Eye, Lock, Database } from 'lucide-react';

const PrivacyPolicyPage = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - StartupNamer.org</title>
        <meta name="description" content="StartupNamer.org's privacy policy detailing how we collect, use, and protect your personal information." />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Hero Section */}
        <section className="pt-20 pb-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-5xl font-bold text-slate-900 mb-6">
                Privacy Policy
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed">
                Your privacy is important to us. This policy explains how we collect, use, and protect your information.
              </p>
              <p className="text-sm text-slate-500 mt-4">
                Last updated: December 15, 2024
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 lg:p-12">
              
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center">
                    <Eye className="w-6 h-6 mr-2 text-blue-600" />
                    Information We Collect
                  </h2>
                  <div className="text-slate-700 space-y-4">
                    <p>We collect information you provide directly to us, such as:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Email address when you create an account</li>
                      <li>Business descriptions you input for name generation</li>
                      <li>Payment information when you purchase premium services</li>
                      <li>Communication preferences and feedback</li>
                    </ul>
                    <p>We also automatically collect certain information when you use our service:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Device information (browser, operating system, IP address)</li>
                      <li>Usage data (pages visited, features used, time spent)</li>
                      <li>Generated names and your interactions with them</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center">
                    <Database className="w-6 h-6 mr-2 text-blue-600" />
                    How We Use Your Information
                  </h2>
                  <div className="text-slate-700 space-y-4">
                    <p>We use the information we collect to:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Provide and improve our AI naming service</li>
                      <li>Process payments and manage your account</li>
                      <li>Send you updates about our service and new features</li>
                      <li>Analyze usage patterns to enhance user experience</li>
                      <li>Respond to your questions and provide customer support</li>
                      <li>Comply with legal obligations and prevent fraud</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center">
                    <Lock className="w-6 h-6 mr-2 text-blue-600" />
                    Data Protection & Security
                  </h2>
                  <div className="text-slate-700 space-y-4">
                    <p>We implement appropriate security measures to protect your information:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>SSL encryption for all data transmission</li>
                      <li>Secure servers with regular security updates</li>
                      <li>Limited access to personal data by authorized personnel only</li>
                      <li>Regular security audits and monitoring</li>
                    </ul>
                    <p>
                      We do not store your business ideas permanently. Name generation inputs are processed 
                      in real-time and are not retained in our systems beyond the session.
                    </p>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">Information Sharing</h2>
                  <div className="text-slate-700 space-y-4">
                    <p>We do not sell, trade, or rent your personal information to third parties. We may share information only:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>With service providers who help us operate our platform (payment processors, hosting services)</li>
                      <li>When required by law or to protect our legal rights</li>
                      <li>With your explicit consent</li>
                      <li>In connection with a business transfer or acquisition</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">Your Rights</h2>
                  <div className="text-slate-700 space-y-4">
                    <p>You have the right to:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Access and review your personal information</li>
                      <li>Correct inaccurate or incomplete data</li>
                      <li>Delete your account and associated data</li>
                      <li>Opt-out of marketing communications</li>
                      <li>Request data portability</li>
                    </ul>
                    <p>
                      To exercise these rights, please contact us at privacy@startupnamer.org.
                    </p>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">Cookies</h2>
                  <div className="text-slate-700 space-y-4">
                    <p>
                      We use cookies and similar technologies to enhance your experience, analyze usage, 
                      and provide personalized content. You can control cookie settings through your browser preferences.
                    </p>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">International Data Transfers</h2>
                  <div className="text-slate-700 space-y-4">
                    <p>
                      Your information may be processed in countries other than your own. We ensure appropriate 
                      safeguards are in place to protect your data in accordance with this privacy policy.
                    </p>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">Changes to This Policy</h2>
                  <div className="text-slate-700 space-y-4">
                    <p>
                      We may update this privacy policy from time to time. We will notify you of any 
                      significant changes by email or through our service.
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">Contact Us</h2>
                  <div className="text-slate-700 space-y-4">
                    <p>If you have any questions about this privacy policy, please contact us:</p>
                    <div className="bg-slate-50 rounded-lg p-4">
                      <p><strong>Email:</strong> privacy@startupnamer.org</p>
                      <p><strong>Address:</strong> StartupNamer.org, San Francisco, CA</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default PrivacyPolicyPage;