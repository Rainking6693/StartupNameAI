// Lazy Loading Components for Performance Optimization
// Implements code splitting and lazy loading for better performance

import { lazy } from 'react';

// Lazy load heavy components
export const NameAnalysisModal = lazy(() => import('../components/NameAnalysisModal'));
export const UpgradePromptModal = lazy(() => import('../components/UpgradePromptModal'));
export const PricingPage = lazy(() => import('../pages/PricingPage'));
export const UserInfoModal = lazy(() => import('../components/UserInfoModal'));

// Lazy load pages
export const LandingPage = lazy(() => import('../components/LandingPage'));
export const NamingTool = lazy(() => import('../pages/NamingTool'));
export const ResultsPage = lazy(() => import('../pages/ResultsPage'));

// Lazy load content pages
export const StartupNamingGuide = lazy(() => import('../pages/StartupNamingGuide'));
export const TechStartupNames = lazy(() => import('../pages/TechStartupNames'));
export const UltimateStartupNamingGuide = lazy(() => import('../pages/UltimateStartupNamingGuide'));
export const SuccessfulTechStartupNames = lazy(() => import('../pages/SuccessfulTechStartupNames'));
export const AiVsHumanNaming = lazy(() => import('../pages/AiVsHumanNaming'));

// Lazy load industry-specific pages
export const HealthTechNames = lazy(() => import('../pages/HealthTechNames'));
export const FintechNames = lazy(() => import('../pages/FintechNames'));
export const EdTechNames = lazy(() => import('../pages/EdTechNames'));
export const EcommerceNames = lazy(() => import('../pages/EcommerceNames'));
export const SaaSNames = lazy(() => import('../pages/SaaSNames'));

console.log('🚀 Lazy components loaded for performance optimization');
