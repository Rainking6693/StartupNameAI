import React from 'react';
import { Helmet } from 'react-helmet-async';
import { FileText, Scale, Shield, AlertCircle, CheckCircle, CreditCard, Users, Gavel } from 'lucide-react';

const TermsOfService = () => {
  const lastUpdated = '2025-01-15';
  
  return (
    <>
      <Helmet>
        <title>Terms of Service - StartupNamer.org | User Agreement & Legal Terms</title>
        <meta name="description" content="Read StartupNamer.org's Terms of Service covering user rights, responsibilities, and legal agreements for our AI naming platform." />
        <meta name="keywords" content="terms of service, user agreement, legal terms, StartupNamer terms, service conditions, user responsibilities" />
        <meta name="robots" content="index, follow" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Terms of Service - StartupNamer.org" />
        <meta property="og:description" content="Read StartupNamer.org's Terms of Service covering user rights and responsibilities." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://startupnamer.org/terms-of-service" />
        
        {/* Twitter Card */}
        <meta name="twitter:title" content="Terms of Service - StartupNamer.org" />
        <meta name="twitter:description" content="Read StartupNamer.org's Terms of Service covering user rights and responsibilities." />
        <meta name="twitter:card" content="summary" />
        
        <link rel="canonical" href="https://startupnamer.org/terms-of-service" />
        
        {/* Structured Data for Legal Document */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Terms of Service",
            "description": "Terms of Service for StartupNamer.org covering user rights, responsibilities, and service conditions",
            "url": "https://startupnamer.org/terms-of-service",
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
              <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center">
                <Scale className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Terms of Service</h1>
                <p className="text-slate-600 mt-1">User agreement and service conditions</p>
              </div>
            </div>
            
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-indigo-600" />
                <div>
                  <p className="text-indigo-900 font-medium">Last Updated: {new Date(lastUpdated).toLocaleDateString()}</p>
                  <p className="text-indigo-700 text-sm">Please read these terms carefully before using our services</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="max-w-4xl mx-auto px-6 py-12">
          <div className="bg-white rounded-2xl shadow-sm border p-8 space-y-12">
            
            {/* Agreement to Terms */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <span>Agreement to Terms</span>
              </h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-700 leading-relaxed mb-4">
                  By accessing and using StartupNamer.org (the "Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <p className="text-green-800">
                      <strong>By using our service, you confirm that:</strong> You are at least 18 years old, have the legal capacity to enter into this agreement, and will use the service in compliance with all applicable laws.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Description of Service */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center space-x-3">
                <FileText className="w-6 h-6 text-blue-500" />
                <span>Description of Service</span>
              </h2>
              
              <div className="space-y-4">
                <p className="text-slate-700 leading-relaxed">
                  StartupNamer.org provides AI-powered startup name generation services, including but not limited to:
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-900 mb-3">Core Services</h3>
                    <ul className="space-y-2 text-blue-800 text-sm">
                      <li>• AI-powered name generation</li>
                      <li>• Domain availability checking</li>
                      <li>• Brandability analysis and scoring</li>
                      <li>• Industry-specific recommendations</li>
                    </ul>
                  </div>
                  
                  <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                    <h3 className="text-lg font-semibold text-purple-900 mb-3">Premium Features</h3>
                    <ul className="space-y-2 text-purple-800 text-sm">
                      <li>• Advanced trademark screening</li>
                      <li>• Logo design suggestions</li>
                      <li>• Priority customer support</li>
                      <li>• Extended name history</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* User Responsibilities */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center space-x-3">
                <Users className="w-6 h-6 text-purple-500" />
                <span>User Responsibilities</span>
              </h2>
              
              <div className="space-y-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                  <div className="flex items-start space-x-3 mb-4">
                    <AlertCircle className="w-6 h-6 text-yellow-600 mt-0.5" />
                    <h3 className="text-lg font-semibold text-yellow-900">Prohibited Uses</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-medium text-yellow-900 mb-2">Content Restrictions</h4>
                      <ul className="space-y-1 text-yellow-800">
                        <li>• No offensive or inappropriate language</li>
                        <li>• No trademark or copyright violations</li>
                        <li>• No misleading or fraudulent content</li>
                        <li>• No automated or bulk requests</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-yellow-900 mb-2">Technical Restrictions</h4>
                      <ul className="space-y-1 text-yellow-800">
                        <li>• No reverse engineering attempts</li>
                        <li>• No system interference or disruption</li>
                        <li>• No unauthorized access attempts</li>
                        <li>• No malicious code or content</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-green-900 mb-3 flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>Acceptable Use</span>
                  </h3>
                  <ul className="space-y-2 text-green-800 text-sm">
                    <li>• Use services for legitimate business purposes</li>
                    <li>• Maintain the security of your account credentials</li>
                    <li>• Provide accurate information when requested</li>
                    <li>• Respect intellectual property rights</li>
                    <li>• Comply with all applicable laws and regulations</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Payment Terms */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center space-x-3">
                <CreditCard className="w-6 h-6 text-emerald-500" />
                <span>Payment Terms</span>
              </h2>
              
              <div className="space-y-6">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-emerald-900 mb-4">Billing and Payments</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-emerald-900 mb-2">Payment Processing</h4>
                      <ul className="space-y-2 text-emerald-800 text-sm">
                        <li>• Secure payment processing via Stripe</li>
                        <li>• All prices displayed in USD</li>
                        <li>• Payment due immediately upon purchase</li>
                        <li>• Automatic renewal for subscriptions</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-emerald-900 mb-2">Refund Policy</h4>
                      <ul className="space-y-2 text-emerald-800 text-sm">
                        <li>• 30-day money-back guarantee</li>
                        <li>• Refunds processed within 5-7 business days</li>
                        <li>• Must request refund via support channel</li>
                        <li>• Fair use policy applies</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-orange-900 mb-1">Price Changes</h4>
                      <p className="text-orange-800 text-sm">
                        We reserve the right to modify pricing with 30 days advance notice. Existing subscriptions will be honored at the original price until the next renewal cycle.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center space-x-3">
                <Shield className="w-6 h-6 text-red-500" />
                <span>Intellectual Property</span>
              </h2>
              
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-red-900 mb-3">Our Rights</h3>
                  <p className="text-red-800 text-sm leading-relaxed mb-3">
                    StartupNamer.org and its original content, features, and functionality are and will remain the exclusive property of StartupNamer.org and its licensors. The service is protected by copyright, trademark, and other laws.
                  </p>
                  <ul className="space-y-2 text-red-800 text-sm">
                    <li>• All AI algorithms and methodologies</li>
                    <li>• Website design and user interface</li>
                    <li>• Brand names, logos, and trademarks</li>
                    <li>• Database compilation and structure</li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">Your Rights</h3>
                  <p className="text-blue-800 text-sm leading-relaxed">
                    You retain ownership of generated names for your legitimate business use. However, we cannot guarantee exclusive rights to any generated name, as similar names may be generated for other users or may already exist in the marketplace.
                  </p>
                </div>
              </div>
            </section>

            {/* Disclaimers */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center space-x-3">
                <AlertCircle className="w-6 h-6 text-amber-500" />
                <span>Disclaimers and Limitations</span>
              </h2>
              
              <div className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-amber-900 mb-3">Service Disclaimers</h3>
                  <div className="space-y-3 text-amber-800 text-sm">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      <p>
                        <strong>No Trademark Guarantee:</strong> While we provide trademark screening, we cannot guarantee that generated names are free from all trademark conflicts. Users should conduct their own legal research.
                      </p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      <p>
                        <strong>Domain Availability:</strong> Domain availability is checked in real-time but can change rapidly. We are not responsible for domain registration or availability after check.
                      </p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      <p>
                        <strong>Service Availability:</strong> We strive for 99.9% uptime but cannot guarantee uninterrupted service. Maintenance windows may be scheduled with advance notice.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-100 border border-slate-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Limitation of Liability</h3>
                  <p className="text-slate-700 text-sm leading-relaxed">
                    In no event shall StartupNamer.org be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, use, or goodwill, arising from your use of the service.
                  </p>
                </div>
              </div>
            </section>

            {/* Termination */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center space-x-3">
                <Gavel className="w-6 h-6 text-gray-500" />
                <span>Termination</span>
              </h2>
              
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">User-Initiated Termination</h3>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• Cancel subscription anytime from account settings</li>
                      <li>• Request account deletion via support</li>
                      <li>• Access retained for 30 days after cancellation</li>
                      <li>• Data permanently deleted upon request</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Service-Initiated Termination</h3>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• Violation of terms of service</li>
                      <li>• Fraudulent or abusive behavior</li>
                      <li>• Non-payment of subscription fees</li>
                      <li>• Legal or regulatory requirements</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Governing Law */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center space-x-3">
                <Scale className="w-6 h-6 text-indigo-500" />
                <span>Governing Law</span>
              </h2>
              
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6">
                <div className="space-y-4">
                  <p className="text-indigo-800 text-sm leading-relaxed">
                    These Terms of Service and any dispute arising out of or related to them shall be governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to conflict of law principles.
                  </p>
                  
                  <div className="bg-indigo-100 rounded-lg p-4">
                    <h3 className="font-semibold text-indigo-900 mb-2">Dispute Resolution</h3>
                    <p className="text-indigo-800 text-sm">
                      Any disputes shall first be addressed through good faith negotiations. If unresolved, disputes will be settled through binding arbitration in accordance with the rules of the American Arbitration Association.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h2 className="text-xl font-bold text-blue-900 mb-3">Questions About These Terms?</h2>
                <p className="text-blue-800 mb-4">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <a href="mailto:legal@startupnamer.org" className="text-blue-700 hover:text-blue-800 font-medium">
                      legal@startupnamer.org
                    </a>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Scale className="w-5 h-5 text-blue-600" />
                    <span className="text-blue-700 text-sm">
                      Response time: Within 5 business days
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Changes to Terms */}
            <section>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-3">Changes to Terms</h2>
                <p className="text-slate-700 mb-3">
                  We reserve the right to modify or replace these Terms of Service at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
                </p>
                <p className="text-slate-600 text-sm">
                  Your continued use of the service after any changes constitutes acceptance of the new Terms of Service.
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
                <p>© 2025 StartupNamer.org - Professional startup naming services</p>
              </div>
              <div className="flex items-center space-x-4">
                <a href="/" className="text-blue-600 hover:text-blue-700 font-medium">
                  Back to Home
                </a>
                <a href="/privacy-policy" className="text-slate-600 hover:text-slate-700">
                  Privacy Policy
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default TermsOfService;