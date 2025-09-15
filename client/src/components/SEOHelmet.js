import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const SEOHelmet = ({ page, customTitle, customDescription, customKeywords }) => {
  const location = useLocation();
  const currentUrl = `https://startupnamer.org${location.pathname}`;
  
  const seoData = {
    homepage: {
      title: "AI Startup Name Generator | Free Business Name Ideas | StartupNamer.org",
      description: "Generate creative startup names with AI. Free business name generator with instant domain checking. Find your perfect brand name in seconds. Try StartupNamer.org - the #1 AI naming tool.",
      keywords: "startup name generator, business name generator, AI name generator, company names, domain checker, business name ideas, startup names, brand names"
    },
    namingTool: {
      title: "AI Name Generator Tool | Create Startup Names Instantly | StartupNamer.org",
      description: "Generate unlimited startup names with our advanced AI. Get creative business name ideas, check domain availability, and find your perfect brand name. Free AI-powered naming tool with instant results.",
      keywords: "AI name generator, startup names, business name ideas, domain availability, brand names, company name generator, naming tool"
    },
    pricing: {
      title: "StartupNamer.org Pricing | AI Name Generator Plans | Free & Pro Options",
      description: "StartupNamer.org pricing plans for AI name generation. Free tier available. Pro features include advanced analysis, trademark screening, and unlimited generations. Choose your plan today.",
      keywords: "startup name generator pricing, AI naming tool cost, business name generator plans, naming service pricing"
    },
    features: {
      title: "AI Name Generator Features | Advanced Startup Naming Tools | StartupNamer.org",
      description: "Discover powerful AI naming features: advanced algorithms, domain checking, trademark screening, brandability analysis. The most comprehensive startup naming platform available.",
      keywords: "AI naming features, startup name generator tools, domain checking, trademark screening, brandability analysis"
    }
  };
  
  const currentSEO = seoData[page] || seoData.homepage;
  const title = customTitle || currentSEO.title;
  const description = customDescription || currentSEO.description;
  const keywords = customKeywords || currentSEO.keywords;
  
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={currentUrl} />
      
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={currentUrl} />
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
};

export default SEOHelmet;