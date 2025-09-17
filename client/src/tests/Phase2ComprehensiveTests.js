// Phase 2 Comprehensive Testing Suite
// Blake's end-to-end testing and validation for StartupNamer.org

import { afterEach, beforeEach, describe, expect, it } from '@jest/testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

// Import components and services
import NameAnalysisModal from '../components/NameAnalysisModal';
import UpgradePromptModal from '../components/UpgradePromptModal';
import PricingPage from '../pages/PricingPage';
import paymentService from '../services/paymentService';
import premiumService from '../services/premiumService';

// Test wrapper component
const TestWrapper = ({ children }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
);

describe('Phase 2 Comprehensive Testing Suite', () => {
  beforeEach(() => {
    // Reset localStorage before each test
    localStorage.clear();

    // Mock console methods to avoid noise in tests
    jest.spyOn(console, 'log').mockImplementation(() => { });
    jest.spyOn(console, 'error').mockImplementation(() => { });
  });

  afterEach(() => {
    // Restore console methods
    console.log.mockRestore();
    console.error.mockRestore();
  });

  describe('Premium Service Tests', () => {
    it('should initialize with free tier by default', () => {
      expect(premiumService.getUserTier()).toBe('free');
      expect(premiumService.isFreeUser()).toBe(true);
      expect(premiumService.isProUser()).toBe(false);
      expect(premiumService.isEnterpriseUser()).toBe(false);
    });

    it('should track usage correctly', () => {
      const initialUsage = premiumService.getUsageThisMonth();
      premiumService.incrementUsage(5);
      expect(premiumService.getUsageThisMonth()).toBe(initialUsage + 5);
    });

    it('should enforce feature limits for free users', () => {
      // Free users should not have access to premium features
      expect(premiumService.canAccessFeature('exportPdf')).toBe(false);
      expect(premiumService.canAccessFeature('premiumAnalysis')).toBe(false);
      expect(premiumService.canAccessFeature('trademarkCheck')).toBe(false);

      // Free users should have access to basic features
      expect(premiumService.canAccessFeature('basicAnalysis')).toBe(true);
      expect(premiumService.canAccessFeature('domainCheck')).toBe(true);
    });

    it('should allow premium features for pro users', () => {
      premiumService.setUserTier('pro');

      expect(premiumService.canAccessFeature('exportPdf')).toBe(true);
      expect(premiumService.canAccessFeature('premiumAnalysis')).toBe(true);
      expect(premiumService.canAccessFeature('trademarkCheck')).toBe(true);
    });

    it('should enforce generation limits', () => {
      // Free users should have limited generations
      expect(premiumService.canGenerateNames(5)).toBe(true); // Within limit
      expect(premiumService.canGenerateNames(15)).toBe(false); // Exceeds limit

      // Pro users should have higher limits
      premiumService.setUserTier('pro');
      expect(premiumService.canGenerateNames(50)).toBe(true);
      expect(premiumService.canGenerateNames(150)).toBe(false); // Exceeds limit
    });

    it('should track upgrade attempts', () => {
      premiumService.trackUpgradeAttempt('analysis', 'premiumAnalysis');

      const attempts = JSON.parse(localStorage.getItem('startupnamer_upgrade_attempts') || '[]');
      expect(attempts).toHaveLength(1);
      expect(attempts[0].context).toBe('analysis');
      expect(attempts[0].feature).toBe('premiumAnalysis');
    });

    it('should generate correct upgrade URLs', () => {
      expect(premiumService.getUpgradeUrl('analysis')).toBe('/pricing?source=analysis&feature=premium-analysis');
      expect(premiumService.getUpgradeUrl('export')).toBe('/pricing?source=export&feature=pdf-export');
      expect(premiumService.getUpgradeUrl('trademark')).toBe('/pricing?source=trademark&feature=trademark-check');
    });
  });

  describe('Payment Service Tests', () => {
    it('should initialize correctly', () => {
      expect(paymentService.apiBaseUrl).toBeDefined();
      expect(paymentService.publishableKey).toBeDefined();
    });

    it('should format amounts correctly', () => {
      expect(paymentService.formatAmount(1900)).toBe('19.00');
      expect(paymentService.formatAmount(9900)).toBe('99.00');
      expect(paymentService.formatAmount(18000)).toBe('180.00');
    });

    it('should get correct plan prices', () => {
      expect(paymentService.getPlanPrice('pro', 'month')).toBe(1900);
      expect(paymentService.getPlanPrice('pro', 'year')).toBe(18000);
      expect(paymentService.getPlanPrice('enterprise', 'month')).toBe(9900);
      expect(paymentService.getPlanPrice('enterprise', 'year')).toBe(94800);
    });

    it('should return correct plan features', () => {
      const freeFeatures = paymentService.getPlanFeatures('free');
      const proFeatures = paymentService.getPlanFeatures('pro');
      const enterpriseFeatures = paymentService.getPlanFeatures('enterprise');

      expect(freeFeatures).toContain('10 name generations per month');
      expect(proFeatures).toContain('100 name generations per month');
      expect(enterpriseFeatures).toContain('Unlimited name generations');
    });

    it('should handle payment success correctly', () => {
      const sessionId = 'cs_test_123';
      paymentService.handlePaymentSuccess(sessionId);

      // Should update user tier
      expect(localStorage.getItem('startupnamer_user_tier')).toBe('pro');
    });

    it('should handle payment cancellation correctly', () => {
      paymentService.handlePaymentCancellation();

      // Should not change user tier
      expect(localStorage.getItem('startupnamer_user_tier')).toBeNull();
    });
  });

  describe('PricingPage Component Tests', () => {
    it('should render all pricing plans', () => {
      render(
        <TestWrapper>
          <PricingPage />
        </TestWrapper>
      );

      expect(screen.getByText('Free')).toBeInTheDocument();
      expect(screen.getByText('Pro')).toBeInTheDocument();
      expect(screen.getByText('Enterprise')).toBeInTheDocument();
    });

    it('should show annual/monthly toggle', () => {
      render(
        <TestWrapper>
          <PricingPage />
        </TestWrapper>
      );

      expect(screen.getByText('Monthly')).toBeInTheDocument();
      expect(screen.getByText('Annual')).toBeInTheDocument();
    });

    it('should display correct pricing for monthly plans', () => {
      render(
        <TestWrapper>
          <PricingPage />
        </TestWrapper>
      );

      expect(screen.getByText('$0')).toBeInTheDocument();
      expect(screen.getByText('$19')).toBeInTheDocument();
      expect(screen.getByText('$99')).toBeInTheDocument();
    });

    it('should display correct pricing for annual plans', () => {
      render(
        <TestWrapper>
          <PricingPage />
        </TestWrapper>
      );

      // Toggle to annual
      const annualToggle = screen.getByRole('button', { name: /annual/i });
      fireEvent.click(annualToggle);

      expect(screen.getByText('$0')).toBeInTheDocument();
      expect(screen.getByText('$15')).toBeInTheDocument();
      expect(screen.getByText('$79')).toBeInTheDocument();
    });

    it('should show analysis promo when coming from analysis page', () => {
      // Mock URL parameters
      Object.defineProperty(window, 'location', {
        value: {
          search: '?source=analysis&feature=premium-analysis'
        },
        writable: true
      });

      render(
        <TestWrapper>
          <PricingPage />
        </TestWrapper>
      );

      expect(screen.getByText(/Unlock Advanced AI Analysis/)).toBeInTheDocument();
    });

    it('should handle plan selection correctly', async () => {
      render(
        <TestWrapper>
          <PricingPage />
        </TestWrapper>
      );

      // Mock payment service
      jest.spyOn(paymentService, 'redirectToCheckout').mockResolvedValue();

      const proButton = screen.getByText('Start Pro Trial');
      fireEvent.click(proButton);

      await waitFor(() => {
        expect(paymentService.redirectToCheckout).toHaveBeenCalledWith('pro', 'month');
      });
    });
  });

  describe('NameAnalysisModal Component Tests', () => {
    const mockNameData = {
      name: 'TestName',
      brandabilityScore: 8.5,
      explanation: 'A great test name',
      psychologyTriggers: ['trust', 'innovation']
    };

    it('should render with name data', () => {
      render(
        <TestWrapper>
          <NameAnalysisModal
            isOpen={true}
            onClose={() => { }}
            nameData={mockNameData}
            onUpgrade={() => { }}
          />
        </TestWrapper>
      );

      expect(screen.getByText('TestName')).toBeInTheDocument();
      expect(screen.getByText('A great test name')).toBeInTheDocument();
    });

    it('should show premium features with lock icons for free users', () => {
      render(
        <TestWrapper>
          <NameAnalysisModal
            isOpen={true}
            onClose={() => { }}
            nameData={mockNameData}
            onUpgrade={() => { }}
          />
        </TestWrapper>
      );

      // Should show locked PDF export
      expect(screen.getByText('Export PDF')).toBeInTheDocument();
      // Should show Pro badge for locked features
      expect(screen.getByText('Pro')).toBeInTheDocument();
    });

    it('should show upgrade prompt when clicking locked features', async () => {
      render(
        <TestWrapper>
          <NameAnalysisModal
            isOpen={true}
            onClose={() => { }}
            nameData={mockNameData}
            onUpgrade={() => { }}
          />
        </TestWrapper>
      );

      const exportButton = screen.getByText('Export PDF');
      fireEvent.click(exportButton);

      // Should show upgrade prompt modal
      await waitFor(() => {
        expect(screen.getByText('Unlock PDF Export')).toBeInTheDocument();
      });
    });

    it('should show upgrade button with correct styling', () => {
      render(
        <TestWrapper>
          <NameAnalysisModal
            isOpen={true}
            onClose={() => { }}
            nameData={mockNameData}
            onUpgrade={() => { }}
          />
        </TestWrapper>
      );

      const upgradeButton = screen.getByText('Upgrade for More');
      expect(upgradeButton).toBeInTheDocument();
      expect(upgradeButton).toHaveClass('bg-gradient-to-r', 'from-yellow-400', 'to-orange-500');
    });
  });

  describe('UpgradePromptModal Component Tests', () => {
    const mockUpgradeData = {
      feature: 'premiumAnalysis',
      context: 'analysis',
      currentAction: null
    };

    it('should render with upgrade data', () => {
      render(
        <TestWrapper>
          <UpgradePromptModal
            isOpen={true}
            onClose={() => { }}
            feature={mockUpgradeData.feature}
            context={mockUpgradeData.context}
            currentAction={mockUpgradeData.currentAction}
          />
        </TestWrapper>
      );

      expect(screen.getByText('Unlock Premium AI Analysis')).toBeInTheDocument();
      expect(screen.getByText('Get detailed brandability insights, competitor analysis, and market intelligence')).toBeInTheDocument();
    });

    it('should show usage information', () => {
      render(
        <TestWrapper>
          <UpgradePromptModal
            isOpen={true}
            onClose={() => { }}
            feature={mockUpgradeData.feature}
            context={mockUpgradeData.context}
            currentAction={mockUpgradeData.currentAction}
          />
        </TestWrapper>
      );

      expect(screen.getByText(/This month's usage/)).toBeInTheDocument();
      expect(screen.getByText(/names remaining this month/)).toBeInTheDocument();
    });

    it('should show plan comparison', () => {
      render(
        <TestWrapper>
          <UpgradePromptModal
            isOpen={true}
            onClose={() => { }}
            feature={mockUpgradeData.feature}
            context={mockUpgradeData.context}
            currentAction={mockUpgradeData.currentAction}
          />
        </TestWrapper>
      );

      expect(screen.getByText('Pro Plan Features:')).toBeInTheDocument();
      expect(screen.getByText('100 names/month')).toBeInTheDocument();
      expect(screen.getByText('vs 10 free')).toBeInTheDocument();
    });

    it('should handle upgrade button click', async () => {
      const mockNavigate = jest.fn();
      jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);

      render(
        <TestWrapper>
          <UpgradePromptModal
            isOpen={true}
            onClose={() => { }}
            feature={mockUpgradeData.feature}
            context={mockUpgradeData.context}
            currentAction={mockUpgradeData.currentAction}
          />
        </TestWrapper>
      );

      const upgradeButton = screen.getByText('Upgrade to Pro');
      fireEvent.click(upgradeButton);

      expect(mockNavigate).toHaveBeenCalledWith('/pricing?source=analysis&feature=premium-analysis');
    });
  });

  describe('Integration Tests', () => {
    it('should complete full upgrade flow', async () => {
      // Start with free user
      expect(premiumService.getUserTier()).toBe('free');

      // Simulate payment success
      paymentService.handlePaymentSuccess('cs_test_123');

      // User should now be pro
      expect(localStorage.getItem('startupnamer_user_tier')).toBe('pro');

      // Premium features should now be accessible
      premiumService.setUserTier('pro');
      expect(premiumService.canAccessFeature('exportPdf')).toBe(true);
      expect(premiumService.canAccessFeature('premiumAnalysis')).toBe(true);
    });

    it('should track usage throughout user journey', () => {
      const initialUsage = premiumService.getUsageThisMonth();

      // Simulate name generation
      premiumService.incrementUsage(5);
      expect(premiumService.getUsageThisMonth()).toBe(initialUsage + 5);

      // Check remaining usage
      const remaining = premiumService.getRemainingGenerations();
      expect(remaining).toBe(5); // 10 - 5 = 5 remaining

      // Try to generate more than remaining
      expect(premiumService.canGenerateNames(10)).toBe(false);
      expect(premiumService.canGenerateNames(5)).toBe(true);
    });

    it('should handle premium feature gates correctly', () => {
      // Free user should be gated
      expect(premiumService.gateFeature('exportPdf', () => { }, 'export')).toBe(false);

      // Pro user should have access
      premiumService.setUserTier('pro');
      expect(premiumService.gateFeature('exportPdf', () => { }, 'export')).toBe(true);
    });
  });

  describe('Error Handling Tests', () => {
    it('should handle payment service errors gracefully', async () => {
      // Mock payment service error
      jest.spyOn(paymentService, 'redirectToCheckout').mockRejectedValue(new Error('Payment failed'));

      render(
        <TestWrapper>
          <PricingPage />
        </TestWrapper>
      );

      const proButton = screen.getByText('Start Pro Trial');
      fireEvent.click(proButton);

      // Should show error message
      await waitFor(() => {
        expect(screen.getByText(/Payment processing failed/)).toBeInTheDocument();
      });
    });

    it('should handle premium service errors gracefully', () => {
      // Mock localStorage error
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = jest.fn(() => {
        throw new Error('Storage failed');
      });

      // Should not crash
      expect(() => {
        premiumService.incrementUsage(1);
      }).not.toThrow();

      // Restore localStorage
      localStorage.setItem = originalSetItem;
    });
  });

  describe('Performance Tests', () => {
    it('should render pricing page quickly', () => {
      const startTime = performance.now();

      render(
        <TestWrapper>
          <PricingPage />
        </TestWrapper>
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render in less than 100ms
      expect(renderTime).toBeLessThan(100);
    });

    it('should handle large usage increments efficiently', () => {
      const startTime = performance.now();

      // Simulate large usage increment
      for (let i = 0; i < 1000; i++) {
        premiumService.incrementUsage(1);
      }

      const endTime = performance.now();
      const executionTime = endTime - startTime;

      // Should complete in less than 50ms
      expect(executionTime).toBeLessThan(50);
    });
  });

  describe('Accessibility Tests', () => {
    it('should have proper ARIA labels on pricing page', () => {
      render(
        <TestWrapper>
          <PricingPage />
        </TestWrapper>
      );

      // Check for proper heading structure
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();

      // Check for button accessibility
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveAttribute('type');
      });
    });

    it('should have proper keyboard navigation', () => {
      render(
        <TestWrapper>
          <PricingPage />
        </TestWrapper>
      );

      // Test tab navigation
      const firstButton = screen.getByText('Start Free Today');
      firstButton.focus();
      expect(document.activeElement).toBe(firstButton);

      // Test Enter key
      fireEvent.keyDown(firstButton, { key: 'Enter', code: 'Enter' });
      // Should not throw error
    });
  });
});

// Export test suite for Jest
