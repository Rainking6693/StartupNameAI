import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ChevronDown, HelpCircle, MessageCircle, Mail } from 'lucide-react';

const FAQPage = () => {
  const faqs = [
    {
      question: "How does the AI startup name generator work?",
      answer: "Our AI uses advanced natural language processing and machine learning algorithms trained on thousands of successful startup names. It analyzes your business description, industry, and style preferences to generate creative, brandable names that resonate with your target audience."
    },
    {
      question: "Are the generated names available as domains?",
      answer: "We provide instant domain availability checking for .com domains. While we check availability at the time of generation, domain status can change quickly. We recommend securing your chosen domain immediately after selection."
    },
    {
      question: "Can I trademark the names generated?",
      answer: "The names generated are original combinations and suggestions. However, you should always conduct a thorough trademark search before using any business name. We recommend consulting with a trademark attorney for comprehensive legal advice."
    },
    {
      question: "What makes StartupNamer different from other naming tools?",
      answer: "StartupNamer uses advanced AI trained specifically on successful startup names, provides brandability scoring, industry-specific suggestions, and includes domain checking. Our names are designed to be memorable, professional, and market-ready."
    },
    {
      question: "How many names can I generate?",
      answer: "Free users can generate up to 6 names per session with unlimited sessions. Premium users get expanded name lists, advanced filtering options, and additional creative techniques for more diverse suggestions."
    },
    {
      question: "Do you store my business ideas?",
      answer: "We take privacy seriously. Your business descriptions are only used to generate names and are not stored permanently. We maintain strict data protection policies and never share your ideas with third parties."
    },
    {
      question: "Can I get a refund if I'm not satisfied?",
      answer: "We offer a 30-day money-back guarantee on all premium plans. If you're not completely satisfied with the generated names, contact our support team for a full refund."
    },
    {
      question: "How quickly will I receive my generated names?",
      answer: "Name generation typically takes 30-60 seconds. Our AI processes your requirements in real-time to provide instant results. Premium users get priority processing for even faster results."
    }
  ];

  const [openIndex, setOpenIndex] = React.useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <Helmet>
        <title>Frequently Asked Questions - StartupNamer.org</title>
        <meta name="description" content="Get answers to common questions about StartupNamer.org's AI-powered startup name generator, pricing, domain availability, and more." />
        <meta name="keywords" content="startup naming FAQ, business name generator questions, AI naming tool help" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Hero Section */}
        <section className="pt-20 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <HelpCircle className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-5xl font-bold text-slate-900 mb-6">
                Frequently Asked Questions
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed">
                Everything you need to know about StartupNamer.org and our AI-powered naming service.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-slate-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                    >
                      <h3 className="text-lg font-semibold text-slate-900 pr-4">
                        {faq.question}
                      </h3>
                      <ChevronDown 
                        className={`w-5 h-5 text-slate-500 transform transition-transform duration-200 ${
                          openIndex === index ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    <div className={`transition-all duration-200 ${
                      openIndex === index 
                        ? 'max-h-96 opacity-100' 
                        : 'max-h-0 opacity-0 overflow-hidden'
                    }`}>
                      <div className="px-6 pb-4">
                        <p className="text-slate-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-80" />
                <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
                <p className="text-blue-100 mb-6">
                  Our support team is here to help you find the perfect name for your startup.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="/contact"
                    className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200"
                  >
                    <Mail className="w-4 h-4 inline mr-2" />
                    Contact Support
                  </a>
                  <a
                    href="/naming-tool"
                    className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors duration-200"
                  >
                    Try Name Generator
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default FAQPage;