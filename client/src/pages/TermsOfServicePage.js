import React from 'react';
import { Helmet } from 'react-helmet-async';
import { FileText, Users, CreditCard, AlertTriangle } from 'lucide-react';

const TermsOfServicePage = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service - StartupNamer.org</title>
        <meta name="description" content="StartupNamer.org's terms of service outlining the rules and guidelines for using our AI-powered startup naming service." />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Hero Section */}
        <section className="pt-20 pb-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-5xl font-bold text-slate-900 mb-6">
                Terms of Service
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed">
                Please read these terms carefully before using StartupNamer.org's services.
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
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">Agreement to Terms</h2>
                  <div className="text-slate-700 space-y-4">
                    <p>
                      By accessing and using StartupNamer.org ("Service"), you accept and agree to be bound 
                      by the terms and provision of this agreement. If you do not agree to abide by the above, 
                      please do not use this service.
                    </p>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center">
                    <Users className="w-6 h-6 mr-2 text-blue-600" />
                    Use License
                  </h2>
                  <div className="text-slate-700 space-y-4">
                    <p>Permission is granted to temporarily use StartupNamer.org for personal and commercial name generation purposes. This is the grant of a license, not a transfer of title, and under this license you may:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Use generated names for your business ventures</li>
                      <li>Access our AI naming algorithms and tools</li>
                      <li>Download and save generated names for your records</li>
                      <li>Share generated names within your organization</li>
                    </ul>
                    <p>This license shall automatically terminate if you violate any of these restrictions and may be terminated by StartupNamer.org at any time.</p>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">User Responsibilities</h2>
                  <div className="text-slate-700 space-y-4">
                    <p>You agree to:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Provide accurate information when creating an account</li>
                      <li>Maintain the security of your account credentials</li>
                      <li>Use the service in compliance with applicable laws</li>
                      <li>Conduct your own trademark and legal research before using any generated name</li>
                      <li>Not attempt to reverse-engineer our AI algorithms</li>
                      <li>Not use the service to generate names for illegal or harmful purposes</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center">
                    <CreditCard className="w-6 h-6 mr-2 text-blue-600" />
                    Payment Terms
                  </h2>
                  <div className="text-slate-700 space-y-4">
                    <p>For premium services:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Payment is required before accessing premium features</li>
                      <li>All fees are non-refundable except as required by law</li>
                      <li>Prices may change with 30 days notice</li>
                      <li>You are responsible for all taxes and fees</li>
                    </ul>
                    <p>We offer a 30-day money-back guarantee for first-time premium users who are not satisfied with the service.</p>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">Intellectual Property</h2>
                  <div className="text-slate-700 space-y-4">
                    <p>
                      StartupNamer.org and its original content, features, and functionality are owned by 
                      StartupNamer.org and are protected by international copyright, trademark, patent, 
                      trade secret, and other intellectual property laws.
                    </p>
                    <p>
                      <strong>Generated Names:</strong> You own the rights to use any names generated through our service. 
                      However, we do not guarantee the availability or legal clearance of any generated name. 
                      It is your responsibility to conduct proper legal research before using any name.
                    </p>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center">
                    <AlertTriangle className="w-6 h-6 mr-2 text-amber-600" />
                    Disclaimers
                  </h2>
                  <div className="text-slate-700 space-y-4">
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <p><strong>Important:</strong> StartupNamer.org provides name suggestions only. We do not:</p>
                      <ul className="list-disc list-inside space-y-1 mt-2 ml-4">
                        <li>Guarantee trademark availability</li>
                        <li>Provide legal advice</li>
                        <li>Ensure domain name availability beyond initial check</li>
                        <li>Guarantee business success with generated names</li>
                      </ul>
                    </div>
                    <p>
                      The information on this service is provided on an "as is" basis. To the fullest extent 
                      permitted by law, StartupNamer.org excludes all representations, warranties, conditions, 
                      and other terms.
                    </p>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">Limitation of Liability</h2>
                  <div className="text-slate-700 space-y-4">
                    <p>
                      StartupNamer.org shall not be liable for any indirect, incidental, special, consequential, 
                      or punitive damages, including without limitation, loss of profits, data, use, goodwill, 
                      or other intangible losses, resulting from your use of the service.
                    </p>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">Service Availability</h2>
                  <div className="text-slate-700 space-y-4">
                    <p>We strive to maintain high service availability, but we do not guarantee:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Uninterrupted access to the service</li>
                      <li>Error-free operation</li>
                      <li>Availability of any particular feature</li>
                    </ul>
                    <p>We may modify, suspend, or discontinue the service at any time without prior notice.</p>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">Termination</h2>
                  <div className="text-slate-700 space-y-4">
                    <p>
                      We may terminate or suspend your account and access to the service immediately, 
                      without prior notice, for conduct that we believe violates these Terms of Service 
                      or is harmful to other users, us, or third parties.
                    </p>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">Governing Law</h2>
                  <div className="text-slate-700 space-y-4">
                    <p>
                      These terms shall be interpreted and governed in accordance with the laws of 
                      California, United States, without regard to its conflict of law provisions.
                    </p>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">Changes to Terms</h2>
                  <div className="text-slate-700 space-y-4">
                    <p>
                      We reserve the right to modify these terms at any time. We will notify users of 
                      any significant changes via email or through our service.
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">Contact Information</h2>
                  <div className="text-slate-700 space-y-4">
                    <p>If you have any questions about these Terms of Service, please contact us:</p>
                    <div className="bg-slate-50 rounded-lg p-4">
                      <p><strong>Email:</strong> legal@startupnamer.org</p>
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

export default TermsOfServicePage;