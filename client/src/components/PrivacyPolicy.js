import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Shield, Lock, Eye, FileText, Users, Database, Cookie, Mail } from 'lucide-react';

const PrivacyPolicy = () => {
  const lastUpdated = '2025-01-15';
  
  return (
    <>
      <Helmet>
        <title>Privacy Policy - StartupNamer.org | How We Protect Your Data</title>
        <meta name="description" content="Learn how StartupNamer.org protects your privacy and handles your data. Transparent privacy policy covering data collection, usage, and your rights." />
        <meta name="keywords" content="privacy policy, data protection, GDPR compliance, user privacy, data security, StartupNamer privacy" />
        <meta name="robots" content="index, follow" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Privacy Policy - StartupNamer.org" />
        <meta property="og:description" content="Learn how StartupNamer.org protects your privacy and handles your data responsibly." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://startupnamer.org/privacy-policy" />
        
        {/* Twitter Card */}
        <meta name="twitter:title" content="Privacy Policy - StartupNamer.org" />
        <meta name="twitter:description" content="Learn how StartupNamer.org protects your privacy and handles your data responsibly." />
        <meta name="twitter:card" content="summary" />
        
        <link rel="canonical" href="https://startupnamer.org/privacy-policy" />
        
        {/* Structured Data for Legal Document */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Privacy Policy",
            "description": "Privacy policy for StartupNamer.org explaining data collection, usage, and user rights",
            "url": "https://startupnamer.org/privacy-policy",
            "dateModified": lastUpdated,
            "author": {
              "@type": "Organization",
              "name": "StartupNamer.org"
            },
            "publisher": {
              "@type": "Organization", 
              "name": "StartupNamer.org",
              "url": "https://startupnamer.org"
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-6 py-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Privacy Policy</h1>
                <p className="text-slate-600 mt-1">How we protect and handle your data</p>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-blue-900 font-medium">Last Updated: {new Date(lastUpdated).toLocaleDateString()}</p>
                  <p className="text-blue-700 text-sm">Effective immediately for all users</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="max-w-4xl mx-auto px-6 py-12">
          <div className="bg-white rounded-2xl shadow-sm border p-8 space-y-12">
            
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center space-x-3">
                <Eye className="w-6 h-6 text-blue-500" />
                <span>Introduction</span>
              </h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-700 leading-relaxed mb-4">
                  At StartupNamer.org ("we," "our," or "us"), we are committed to protecting your privacy and handling your personal information responsibly. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our AI-powered startup naming services.
                </p>
                <p className="text-slate-700 leading-relaxed">
                  By using our services, you agree to the collection and use of information in accordance with this policy. We will not use or share your information with anyone except as described in this Privacy Policy.
                </p>
              </div>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center space-x-3">
                <Database className="w-6 h-6 text-green-500" />
                <span>Information We Collect</span>
              </h2>
              
              <div className="space-y-6">
                <div className="bg-slate-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Personal Information</h3>
                  <ul className="space-y-2 text-slate-700">
                    <li>• Email addresses (when you create an account or subscribe)</li>
                    <li>• Name and contact information (for premium services)</li>
                    <li>• Payment information (processed securely by third-party providers)</li>
                    <li>• Communication preferences and settings</li>
                  </ul>
                </div>
                
                <div className="bg-slate-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Usage Information</h3>
                  <ul className="space-y-2 text-slate-700">
                    <li>• Search queries and naming requests</li>
                    <li>• Generated names and user preferences</li>
                    <li>• Feature usage and interaction patterns</li>
                    <li>• Time spent on pages and click behavior</li>
                  </ul>
                </div>
                
                <div className="bg-slate-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Technical Information</h3>
                  <ul className="space-y-2 text-slate-700">
                    <li>• IP addresses and geographic location</li>
                    <li>• Device type, browser, and operating system</li>
                    <li>• Cookies and similar tracking technologies</li>
                    <li>• Performance metrics and error logs</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Your Information */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center space-x-3">
                <Users className="w-6 h-6 text-purple-500" />
                <span>How We Use Your Information</span>
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">Service Delivery</h3>
                  <ul className="space-y-2 text-blue-800 text-sm">
                    <li>• Generate personalized startup names</li>
                    <li>• Provide domain availability checking</li>
                    <li>• Deliver brandability analysis</li>
                    <li>• Process payments and subscriptions</li>
                  </ul>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                  <h3 className="text-lg font-semibold text-green-900 mb-3">Service Improvement</h3>
                  <ul className="space-y-2 text-green-800 text-sm">
                    <li>• Analyze usage patterns and preferences</li>
                    <li>• Improve AI algorithm accuracy</li>
                    <li>• Optimize website performance</li>
                    <li>• Develop new features and services</li>
                  </ul>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                  <h3 className="text-lg font-semibold text-purple-900 mb-3">Communication</h3>
                  <ul className="space-y-2 text-purple-800 text-sm">
                    <li>• Send service updates and notifications</li>
                    <li>• Provide customer support</li>
                    <li>• Share relevant content and tips</li>
                    <li>• Respond to inquiries and feedback</li>
                  </ul>
                </div>
                
                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
                  <h3 className="text-lg font-semibold text-orange-900 mb-3">Legal Compliance</h3>
                  <ul className="space-y-2 text-orange-800 text-sm">
                    <li>• Comply with applicable laws</li>
                    <li>• Prevent fraud and abuse</li>
                    <li>• Protect user safety and security</li>
                    <li>• Enforce our Terms of Service</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Cookies and Tracking */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center space-x-3">
                <Cookie className="w-6 h-6 text-amber-500" />
                <span>Cookies and Tracking Technologies</span>
              </h2>
              
              <div className="space-y-4">
                <p className="text-slate-700 leading-relaxed">
                  We use cookies and similar tracking technologies to enhance your experience, analyze usage, and deliver personalized content.
                </p>
                
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                  <div className="grid md:grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Cookie className="w-6 h-6 text-amber-600" />
                      </div>
                      <h3 className="font-semibold text-amber-900 mb-2">Essential Cookies</h3>
                      <p className="text-amber-800 text-sm">Required for basic site functionality</p>
                    </div>
                    <div>
                      <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Eye className="w-6 h-6 text-amber-600" />
                      </div>
                      <h3 className="font-semibold text-amber-900 mb-2">Analytics Cookies</h3>
                      <p className="text-amber-800 text-sm">Help us understand user behavior</p>
                    </div>
                    <div>
                      <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Users className="w-6 h-6 text-amber-600" />
                      </div>
                      <h3 className="font-semibold text-amber-900 mb-2">Marketing Cookies</h3>
                      <p className="text-amber-800 text-sm">Deliver relevant advertisements</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center space-x-3">
                <Lock className="w-6 h-6 text-red-500" />
                <span>Data Security</span>
              </h2>
              
              <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-6">
                <p className="text-slate-700 leading-relaxed mb-4">
                  We implement industry-standard security measures to protect your personal information:
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-red-900 mb-3">Technical Safeguards</h3>
                    <ul className="space-y-2 text-red-800 text-sm">
                      <li>• SSL/TLS encryption for data transmission</li>
                      <li>• Secure database storage with encryption</li>
                      <li>• Regular security audits and updates</li>
                      <li>• Access controls and authentication</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-red-900 mb-3">Operational Safeguards</h3>
                    <ul className="space-y-2 text-red-800 text-sm">
                      <li>• Limited access to personal data</li>
                      <li>• Employee privacy training programs</li>
                      <li>• Incident response procedures</li>
                      <li>• Regular backup and recovery testing</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center space-x-3">
                <Shield className="w-6 h-6 text-indigo-500" />
                <span>Your Privacy Rights</span>
              </h2>
              
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6">
                <p className="text-indigo-900 mb-4">
                  You have the following rights regarding your personal information:
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                      <span className="text-indigo-800 font-medium">Access your data</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                      <span className="text-indigo-800 font-medium">Correct inaccurate information</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                      <span className="text-indigo-800 font-medium">Delete your account and data</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                      <span className="text-indigo-800 font-medium">Opt out of communications</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                      <span className="text-indigo-800 font-medium">Export your data</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                      <span className="text-indigo-800 font-medium">Restrict data processing</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact Us */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center space-x-3">
                <Mail className="w-6 h-6 text-blue-500" />
                <span>Contact Us</span>
              </h2>
              
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <p className="text-blue-900 mb-4">
                  If you have questions about this Privacy Policy or want to exercise your privacy rights, please contact us:
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <a href="mailto:privacy@startupnamer.org" className="text-blue-700 hover:text-blue-800 font-medium">
                      privacy@startupnamer.org
                    </a>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span className="text-blue-700">
                      Response time: Within 30 days
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Updates */}
            <section>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-3">Policy Updates</h2>
                <p className="text-slate-700 mb-3">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date.
                </p>
                <p className="text-slate-600 text-sm">
                  Continued use of our services after any modifications constitutes acceptance of the updated policy.
                </p>
              </div>
            </section>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t mt-12">
          <div className="max-w-4xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div className="text-slate-600">
                <p>© 2025 StartupNamer.org - Your privacy is our priority</p>
              </div>
              <div className="flex items-center space-x-4">
                <a href="/" className="text-blue-600 hover:text-blue-700 font-medium">
                  Back to Home
                </a>
                <a href="/terms-of-service" className="text-slate-600 hover:text-slate-700">
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default PrivacyPolicy;