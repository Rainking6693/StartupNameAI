import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Calendar, User, ArrowRight, BookOpen, TrendingUp, Lightbulb, Target } from 'lucide-react';

const BlogPage = () => {
  const blogPosts = [
    {
      id: 1,
      title: "The Psychology Behind Memorable Startup Names",
      excerpt: "Discover the cognitive principles that make some startup names stick while others are forgotten, and how to apply these insights to your naming strategy.",
      author: "Sarah Chen",
      date: "Dec 12, 2024",
      readTime: "8 min read",
      category: "Psychology",
      image: "/images/blog/psychology-naming.jpg",
      featured: true
    },
    {
      id: 2,
      title: "AI vs Human Creativity in Brand Naming",
      excerpt: "An in-depth comparison of AI-generated names versus human-created names, analyzing success rates, creativity metrics, and market performance.",
      author: "Michael Rodriguez",
      date: "Dec 8, 2024",
      readTime: "6 min read",
      category: "AI Technology"
    },
    {
      id: 3,
      title: "Domain Name Strategy for Modern Startups",
      excerpt: "Beyond .com: exploring new domain extensions, internationalization, and building a complete digital brand identity for your startup.",
      author: "Emily Johnson",
      date: "Dec 5, 2024",
      readTime: "7 min read",
      category: "Digital Strategy"
    },
    {
      id: 4,
      title: "Trademark Considerations for Startup Names",
      excerpt: "Essential legal guidelines for choosing a startup name that won't land you in legal trouble, including international trademark considerations.",
      author: "David Kim",
      date: "Dec 1, 2024",
      readTime: "10 min read",
      category: "Legal"
    },
    {
      id: 5,
      title: "Cultural Sensitivity in Global Brand Naming",
      excerpt: "How to ensure your startup name works across different cultures and languages, avoiding common pitfalls in international markets.",
      author: "Priya Patel",
      date: "Nov 28, 2024",
      readTime: "9 min read",
      category: "International"
    },
    {
      id: 6,
      title: "The Rise of Abstract Names in Tech Startups",
      excerpt: "Why companies like Google, Spotify, and Uber chose abstract names, and when this strategy works best for modern startups.",
      author: "Alex Thompson",
      date: "Nov 25, 2024",
      readTime: "5 min read",
      category: "Trends"
    }
  ];

  const categories = ["All", "Psychology", "AI Technology", "Digital Strategy", "Legal", "International", "Trends"];

  return (
    <>
      <Helmet>
        <title>Blog - StartupNamer.org | Naming Insights & Strategies</title>
        <meta name="description" content="Expert insights on startup naming, branding strategies, AI naming technology, and entrepreneurship. Learn from the latest trends and research." />
        <meta name="keywords" content="startup naming blog, branding insights, AI naming technology, business naming strategy" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Hero Section */}
        <section className="pt-20 pb-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-5xl font-bold text-slate-900 mb-6">
                Naming Insights & Strategy
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed">
                Expert insights on startup naming, branding strategies, and the latest trends in AI-powered business naming.
              </p>
            </div>
          </div>
        </section>

        {/* Featured Article */}
        <section className="pb-12">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl overflow-hidden shadow-lg">
                <div className="p-8 lg:p-12 text-white">
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">Featured</span>
                    <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">Psychology</span>
                  </div>
                  <h2 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight">
                    The Psychology Behind Memorable Startup Names
                  </h2>
                  <p className="text-blue-100 mb-6 text-lg max-w-3xl">
                    Discover the cognitive principles that make some startup names stick while others are forgotten, and how to apply these insights to your naming strategy.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6 text-blue-100">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span>Sarah Chen</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>Dec 12, 2024</span>
                      </div>
                      <span>8 min read</span>
                    </div>
                    <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200 flex items-center space-x-2">
                      <span>Read Article</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="pb-8">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-wrap gap-2 justify-center">
                {categories.map((category) => (
                  <button
                    key={category}
                    className="px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 bg-white text-slate-600 hover:bg-blue-600 hover:text-white border border-slate-200 hover:border-blue-600"
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-8">
                {blogPosts.slice(1).map((post) => (
                  <article key={post.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200">
                    <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600"></div>
                    <div className="p-6">
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          {post.category}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-slate-600 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-sm text-slate-500">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>{post.author}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{post.date}</span>
                          </div>
                        </div>
                        <span>{post.readTime}</span>
                      </div>
                      <button className="mt-4 text-blue-600 hover:text-blue-700 font-semibold flex items-center space-x-1 transition-colors duration-200">
                        <span>Read More</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 text-center text-white">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 text-blue-400" />
                <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
                <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
                  Get the latest insights on startup naming, branding trends, and AI technology delivered to your inbox.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 rounded-lg border border-slate-600 bg-slate-800 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200">
                    Subscribe
                  </button>
                </div>
                <p className="text-xs text-slate-400 mt-4">
                  No spam, unsubscribe at any time. We respect your privacy.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default BlogPage;