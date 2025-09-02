#!/usr/bin/env node

/**
 * Comprehensive Accessibility Validation System with axe-core
 * 
 * Provides enterprise-level accessibility testing with:
 * - WCAG 2.1 AA/AAA compliance validation
 * - axe-core integration with custom rules
 * - Color contrast analysis
 * - Keyboard navigation testing
 * - Screen reader compatibility checks
 * - Automated accessibility reporting
 * - Integration with error correlation system
 * 
 * Author: QA Engineer - Accessibility Specialist
 * Integrates with: Error Correlation System, E2E Testing Suite
 */

const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const puppeteer = require('puppeteer');

const execAsync = promisify(exec);

class AccessibilityValidator {
  constructor() {
    this.config = {
      urls: [
        { url: 'http://localhost:3000', name: 'homepage' },
        { url: 'http://localhost:3000/naming-tool', name: 'naming-tool' },
        { url: 'http://localhost:3000/pricing', name: 'pricing' },
        { url: 'http://localhost:3000/about', name: 'about' }
      ],
      wcagLevel: 'AA', // AA or AAA
      browser: {
        headless: true,
        viewport: { width: 1280, height: 720 }
      },
      axeOptions: {
        resultTypes: ['violations', 'incomplete', 'passes'],
        tags: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'],
        rules: {
          'color-contrast': { enabled: true },
          'focus-order-semantics': { enabled: true },
          'keyboard-navigation': { enabled: true },
          'aria-valid-attr': { enabled: true },
          'aria-required-children': { enabled: true }
        }
      },
      thresholds: {
        violations: 0, // Zero tolerance for violations
        incomplete: 5, // Allow some incomplete checks
        colorContrast: 4.5, // WCAG AA standard
        colorContrastLarge: 3.0 // WCAG AA for large text
      },
      reportPath: './tests/accessibility/reports',
      screenshotPath: './tests/accessibility/screenshots'
    };

    this.results = {
      summary: {
        totalPages: 0,
        passedPages: 0,
        failedPages: 0,
        totalViolations: 0,
        totalIncomplete: 0,
        totalPasses: 0
      },
      pages: [],
      violations: [],
      recommendations: []
    };

    this.errorCorrelator = null;
  }

  async initialize() {
    console.log('♿ Initializing Comprehensive Accessibility Validation System...');
    
    try {
      await this.setupDirectories();
      await this.installDependencies();
      await this.initializeAxeCore();
      await this.setupCustomRules();
      
      console.log('✅ Accessibility Validation System initialized successfully');
      
    } catch (error) {
      console.error('❌ Failed to initialize accessibility validator:', error);
      throw error;
    }
  }

  async setupDirectories() {
    const dirs = [
      './tests/accessibility',
      './tests/accessibility/reports',
      './tests/accessibility/screenshots',
      './tests/accessibility/configs'
    ];

    for (const dir of dirs) {
      try {
        await fs.access(dir);
      } catch {
        await fs.mkdir(dir, { recursive: true });
      }
    }
  }

  async installDependencies() {
    console.log('📦 Installing accessibility testing dependencies...');
    
    try {
      // Check if dependencies are installed
      await execAsync('npm list puppeteer axe-core').catch(async () => {
        console.log('Installing required packages...');
        await execAsync('npm install --save-dev puppeteer axe-core @axe-core/puppeteer pa11y pa11y-reporter-html', {
          timeout: 300000 // 5 minutes
        });
      });

      console.log('✅ Dependencies installed successfully');
      
    } catch (error) {
      console.error('❌ Dependency installation failed:', error);
      throw error;
    }
  }

  async initializeAxeCore() {
    console.log('🛠️ Initializing axe-core configuration...');
    
    const axeConfig = {
      branding: {
        brand: 'StartupnameAI Accessibility Audit',
        application: 'StartupnameAI'
      },
      reporter: 'v2',
      checks: [
        {
          id: 'startup-color-contrast',
          evaluate: function(node, options) {
            // Custom color contrast check specific to startup branding
            const style = window.getComputedStyle(node);
            const bgColor = style.backgroundColor;
            const textColor = style.color;
            
            if (bgColor === 'rgba(0, 0, 0, 0)' && textColor === 'rgba(0, 0, 0, 0)') {
              return undefined; // Skip transparent elements
            }
            
            return this.data.contrastRatio > options.threshold;
          },
          metadata: {
            impact: 'critical',
            messages: {
              pass: 'Element has sufficient color contrast',
              fail: 'Element does not have sufficient color contrast'
            }
          }
        }
      ],
      rules: [
        {
          id: 'startup-focus-management',
          selector: 'button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])',
          any: ['has-visible-text', 'aria-label', 'aria-labelledby', 'role-presentation'],
          metadata: {
            description: 'Ensures interactive elements are properly labeled for screen readers',
            help: 'Interactive elements must have accessible names'
          }
        }
      ]
    };

    await fs.writeFile(
      './tests/accessibility/configs/axe-config.json', 
      JSON.stringify(axeConfig, null, 2)
    );
  }

  async setupCustomRules() {
    console.log('📋 Setting up custom accessibility rules...');
    
    const customRules = `
// Custom axe-core rules for StartupnameAI
axe.configure({
  rules: [{
    id: 'startup-branding-contrast',
    selector: '.brand-primary, .brand-secondary, .cta-button',
    any: [{
      id: 'color-contrast',
      options: {
        contrastRatio: {
          normal: 4.5,
          large: 3.0
        }
      }
    }],
    metadata: {
      description: 'Brand colors must meet WCAG contrast requirements',
      help: 'Ensure brand elements have sufficient contrast'
    }
  }, {
    id: 'startup-form-labels',
    selector: 'input, select, textarea',
    any: ['has-visible-text', 'aria-label', 'aria-labelledby', 'implicit-label'],
    metadata: {
      description: 'Form inputs must have accessible labels',
      help: 'All form elements need labels for screen readers'
    }
  }, {
    id: 'startup-heading-structure',
    selector: 'h1, h2, h3, h4, h5, h6',
    any: [{
      id: 'heading-order',
      options: {
        allowSkipped: false
      }
    }],
    metadata: {
      description: 'Headings must follow logical structure',
      help: 'Use headings in sequential order'
    }
  }]
});

// Custom checks for startup-specific elements
axe.configure({
  checks: [{
    id: 'startup-cta-accessibility',
    evaluate: function(node, options) {
      if (!node.classList.contains('cta-button')) return true;
      
      const hasAriaLabel = node.hasAttribute('aria-label');
      const hasAccessibleText = node.textContent.trim().length > 0;
      const hasAriaDescribedBy = node.hasAttribute('aria-describedby');
      
      return hasAriaLabel || hasAccessibleText || hasAriaDescribedBy;
    },
    metadata: {
      impact: 'critical',
      messages: {
        pass: 'CTA button has accessible text or label',
        fail: 'CTA button lacks accessible text or label'
      }
    }
  }]
});
    `.trim();

    await fs.writeFile('./tests/accessibility/configs/custom-rules.js', customRules);
  }

  async runComprehensiveAudit() {
    console.log('🔍 Running comprehensive accessibility audit...');
    
    const browser = await puppeteer.launch({
      headless: this.config.browser.headless,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
      for (const pageConfig of this.config.urls) {
        await this.auditPage(browser, pageConfig);
      }

      await this.generateComprehensiveReport();
      await this.integrateWithErrorCorrelation();
      
      console.log('✅ Accessibility audit completed successfully');
      return this.results;
      
    } catch (error) {
      console.error('❌ Accessibility audit failed:', error);
      throw error;
    } finally {
      await browser.close();
    }
  }

  async auditPage(browser, pageConfig) {
    console.log(`🔍 Auditing: ${pageConfig.name} (${pageConfig.url})`);
    
    const page = await browser.newPage();
    
    try {
      await page.setViewport(this.config.browser.viewport);
      
      // Navigate to page
      const response = await page.goto(pageConfig.url, {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      if (!response.ok()) {
        throw new Error(`Page ${pageConfig.url} returned status ${response.status()}`);
      }

      // Inject axe-core
      await page.addScriptTag({
        path: require.resolve('axe-core/axe.min.js')
      });

      // Load custom rules
      const customRules = await fs.readFile('./tests/accessibility/configs/custom-rules.js', 'utf8');
      await page.evaluate(customRules);

      // Run axe audit
      const axeResults = await page.evaluate(async (options) => {
        return await axe.run(document, options);
      }, this.config.axeOptions);

      // Additional custom checks
      const keyboardNavigation = await this.testKeyboardNavigation(page);
      const focusManagement = await this.testFocusManagement(page);
      const screenReaderCompatibility = await this.testScreenReaderCompatibility(page);
      const colorContrast = await this.analyzeColorContrast(page);

      // Take screenshot for documentation
      await page.screenshot({
        path: path.join(this.config.screenshotPath, `${pageConfig.name}-audit.png`),
        fullPage: true
      });

      const pageResult = {
        name: pageConfig.name,
        url: pageConfig.url,
        timestamp: new Date().toISOString(),
        axeResults,
        keyboardNavigation,
        focusManagement,
        screenReaderCompatibility,
        colorContrast,
        score: this.calculateAccessibilityScore(axeResults, keyboardNavigation, focusManagement)
      };

      this.results.pages.push(pageResult);
      this.updateSummary(pageResult);

      console.log(`  ✅ ${pageConfig.name}: ${pageResult.score.toFixed(1)}% accessible`);
      console.log(`     Violations: ${axeResults.violations.length}`);
      console.log(`     Incomplete: ${axeResults.incomplete.length}`);
      
    } catch (error) {
      console.error(`❌ Failed to audit ${pageConfig.name}:`, error);
      this.results.pages.push({
        name: pageConfig.name,
        url: pageConfig.url,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    } finally {
      await page.close();
    }
  }

  async testKeyboardNavigation(page) {
    console.log('    🎹 Testing keyboard navigation...');
    
    try {
      const keyboardTest = await page.evaluate(() => {
        const focusableElements = Array.from(document.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ));

        const results = {
          totalFocusableElements: focusableElements.length,
          tabOrder: [],
          trapsFocus: false,
          hasSkipLinks: false
        };

        // Check for skip links
        const skipLinks = document.querySelectorAll('a[href^="#"]:first-child, .skip-link, .sr-only a');
        results.hasSkipLinks = skipLinks.length > 0;

        // Test tab order
        focusableElements.forEach((element, index) => {
          const tabIndex = element.getAttribute('tabindex') || '0';
          results.tabOrder.push({
            element: element.tagName.toLowerCase(),
            tabIndex: parseInt(tabIndex),
            hasVisibleFocus: window.getComputedStyle(element, ':focus').outline !== 'none'
          });
        });

        return results;
      });

      // Simulate keyboard navigation
      await page.keyboard.press('Tab');
      await page.waitForTimeout(100);
      
      const firstFocused = await page.evaluate(() => {
        return document.activeElement ? {
          tagName: document.activeElement.tagName,
          className: document.activeElement.className,
          id: document.activeElement.id
        } : null;
      });

      return {
        ...keyboardTest,
        firstFocusedElement: firstFocused,
        canNavigateWithKeyboard: firstFocused !== null
      };
      
    } catch (error) {
      console.error('    ❌ Keyboard navigation test failed:', error);
      return { error: error.message };
    }
  }

  async testFocusManagement(page) {
    console.log('    🎯 Testing focus management...');
    
    try {
      const focusTest = await page.evaluate(() => {
        const results = {
          hasFocusIndicators: true,
          focusTrapping: false,
          logicalTabOrder: true,
          focusVisibility: []
        };

        // Check focus indicators
        const focusableElements = document.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        focusableElements.forEach((element, index) => {
          element.focus();
          const focusStyle = window.getComputedStyle(element, ':focus');
          const hasOutline = focusStyle.outline !== 'none' && focusStyle.outline !== '';
          const hasBoxShadow = focusStyle.boxShadow !== 'none';
          const hasBorder = focusStyle.borderColor !== 'initial';
          
          const hasFocusIndicator = hasOutline || hasBoxShadow || hasBorder;
          
          results.focusVisibility.push({
            element: element.tagName.toLowerCase() + (element.className ? '.' + element.className.split(' ')[0] : ''),
            hasFocusIndicator
          });

          if (!hasFocusIndicator) {
            results.hasFocusIndicators = false;
          }
        });

        return results;
      });

      return focusTest;
      
    } catch (error) {
      console.error('    ❌ Focus management test failed:', error);
      return { error: error.message };
    }
  }

  async testScreenReaderCompatibility(page) {
    console.log('    🔊 Testing screen reader compatibility...');
    
    try {
      const screenReaderTest = await page.evaluate(() => {
        const results = {
          ariaLabels: 0,
          ariaDescriptions: 0,
          semanticElements: 0,
          landmarkRoles: 0,
          altTexts: 0,
          headingStructure: [],
          missingLabels: []
        };

        // Count ARIA labels and descriptions
        results.ariaLabels = document.querySelectorAll('[aria-label]').length;
        results.ariaDescriptions = document.querySelectorAll('[aria-describedby]').length;

        // Count semantic elements
        const semanticElements = document.querySelectorAll(
          'main, nav, header, footer, section, article, aside, h1, h2, h3, h4, h5, h6'
        );
        results.semanticElements = semanticElements.length;

        // Count landmark roles
        results.landmarkRoles = document.querySelectorAll(
          '[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"], [role="complementary"]'
        ).length;

        // Check alt texts
        const images = document.querySelectorAll('img');
        images.forEach(img => {
          if (img.alt !== '') {
            results.altTexts++;
          }
        });

        // Analyze heading structure
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach(heading => {
          results.headingStructure.push({
            level: parseInt(heading.tagName.charAt(1)),
            text: heading.textContent.trim()
          });
        });

        // Find missing labels
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach((input, index) => {
          const hasLabel = input.labels?.length > 0 || 
                          input.getAttribute('aria-label') ||
                          input.getAttribute('aria-labelledby') ||
                          input.getAttribute('title');
          
          if (!hasLabel) {
            results.missingLabels.push({
              element: input.tagName.toLowerCase(),
              type: input.type || 'text',
              id: input.id || `input-${index}`
            });
          }
        });

        return results;
      });

      return screenReaderTest;
      
    } catch (error) {
      console.error('    ❌ Screen reader compatibility test failed:', error);
      return { error: error.message };
    }
  }

  async analyzeColorContrast(page) {
    console.log('    🎨 Analyzing color contrast...');
    
    try {
      const contrastAnalysis = await page.evaluate(() => {
        const results = {
          totalElements: 0,
          passedElements: 0,
          failedElements: [],
          averageContrast: 0
        };

        // Helper function to get contrast ratio
        function getContrastRatio(color1, color2) {
          function getLuminance(color) {
            const rgb = color.match(/\\d+/g);
            if (!rgb) return 0;
            
            const [r, g, b] = rgb.map(c => {
              c = parseInt(c) / 255;
              return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
            });
            
            return 0.2126 * r + 0.7152 * g + 0.0722 * b;
          }

          const l1 = getLuminance(color1);
          const l2 = getLuminance(color2);
          const lighter = Math.max(l1, l2);
          const darker = Math.min(l1, l2);
          
          return (lighter + 0.05) / (darker + 0.05);
        }

        // Analyze text elements
        const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div, a, button, label');
        let totalContrast = 0;

        textElements.forEach((element, index) => {
          if (!element.textContent.trim()) return;

          const style = window.getComputedStyle(element);
          const textColor = style.color;
          const bgColor = style.backgroundColor;
          
          if (textColor === 'rgba(0, 0, 0, 0)' || bgColor === 'rgba(0, 0, 0, 0)') return;

          const contrast = getContrastRatio(textColor, bgColor);
          const fontSize = parseFloat(style.fontSize);
          const fontWeight = style.fontWeight;
          
          const isLargeText = fontSize >= 18 || (fontSize >= 14 && (fontWeight === 'bold' || parseInt(fontWeight) >= 700));
          const requiredContrast = isLargeText ? 3.0 : 4.5;
          
          results.totalElements++;
          totalContrast += contrast;

          if (contrast < requiredContrast) {
            results.failedElements.push({
              element: element.tagName.toLowerCase(),
              textContent: element.textContent.slice(0, 50) + (element.textContent.length > 50 ? '...' : ''),
              contrast: contrast.toFixed(2),
              required: requiredContrast,
              textColor,
              backgroundColor: bgColor,
              fontSize: style.fontSize,
              fontWeight: style.fontWeight
            });
          } else {
            results.passedElements++;
          }
        });

        results.averageContrast = results.totalElements > 0 ? 
          (totalContrast / results.totalElements).toFixed(2) : 0;

        return results;
      });

      return contrastAnalysis;
      
    } catch (error) {
      console.error('    ❌ Color contrast analysis failed:', error);
      return { error: error.message };
    }
  }

  calculateAccessibilityScore(axeResults, keyboardNav, focusManagement) {
    let score = 100;

    // Deduct points for violations
    score -= axeResults.violations.length * 10;
    
    // Deduct points for incomplete checks
    score -= axeResults.incomplete.length * 2;

    // Keyboard navigation penalties
    if (keyboardNav && !keyboardNav.canNavigateWithKeyboard) score -= 15;
    if (keyboardNav && !keyboardNav.hasSkipLinks) score -= 5;

    // Focus management penalties
    if (focusManagement && !focusManagement.hasFocusIndicators) score -= 20;

    return Math.max(0, score);
  }

  updateSummary(pageResult) {
    this.results.summary.totalPages++;
    
    if (pageResult.error) {
      this.results.summary.failedPages++;
      return;
    }

    if (pageResult.axeResults.violations.length === 0) {
      this.results.summary.passedPages++;
    } else {
      this.results.summary.failedPages++;
    }

    this.results.summary.totalViolations += pageResult.axeResults.violations.length;
    this.results.summary.totalIncomplete += pageResult.axeResults.incomplete.length;
    this.results.summary.totalPasses += pageResult.axeResults.passes.length;

    // Collect violations for reporting
    pageResult.axeResults.violations.forEach(violation => {
      this.results.violations.push({
        page: pageResult.name,
        rule: violation.id,
        impact: violation.impact,
        description: violation.description,
        help: violation.help,
        helpUrl: violation.helpUrl,
        nodes: violation.nodes.length
      });
    });
  }

  async generateComprehensiveReport() {
    console.log('📊 Generating comprehensive accessibility report...');
    
    const report = {
      meta: {
        title: 'StartupnameAI Accessibility Audit Report',
        timestamp: new Date().toISOString(),
        wcagLevel: this.config.wcagLevel,
        totalPages: this.results.summary.totalPages,
        auditDuration: 'N/A' // Could be calculated
      },
      summary: this.results.summary,
      pages: this.results.pages,
      violations: this.results.violations,
      recommendations: this.generateRecommendations(),
      compliance: this.assessCompliance()
    };

    // Generate JSON report
    const jsonReportPath = path.join(this.config.reportPath, `accessibility-report-${Date.now()}.json`);
    await fs.writeFile(jsonReportPath, JSON.stringify(report, null, 2));

    // Generate HTML report
    const htmlReport = await this.generateHTMLReport(report);
    const htmlReportPath = path.join(this.config.reportPath, `accessibility-report-${Date.now()}.html`);
    await fs.writeFile(htmlReportPath, htmlReport);

    console.log(`📊 Reports generated:`);
    console.log(`   JSON: ${jsonReportPath}`);
    console.log(`   HTML: ${htmlReportPath}`);

    return report;
  }

  generateRecommendations() {
    const recommendations = [];

    // Analyze common violations
    const violationsByType = {};
    this.results.violations.forEach(violation => {
      if (!violationsByType[violation.rule]) {
        violationsByType[violation.rule] = [];
      }
      violationsByType[violation.rule].push(violation);
    });

    // Generate targeted recommendations
    Object.entries(violationsByType).forEach(([rule, violations]) => {
      const recommendation = this.getRecommendationForRule(rule, violations.length);
      if (recommendation) {
        recommendations.push(recommendation);
      }
    });

    // Add general recommendations
    recommendations.push({
      priority: 'high',
      category: 'general',
      title: 'Implement Accessibility Testing in CI/CD',
      description: 'Integrate automated accessibility testing in your deployment pipeline to catch issues early.',
      effort: 'medium'
    });

    return recommendations.sort((a, b) => {
      const priority = { high: 3, medium: 2, low: 1 };
      return priority[b.priority] - priority[a.priority];
    });
  }

  getRecommendationForRule(rule, count) {
    const ruleRecommendations = {
      'color-contrast': {
        priority: 'high',
        category: 'visual',
        title: 'Improve Color Contrast',
        description: `${count} elements fail WCAG color contrast requirements. Use darker colors or lighter backgrounds to improve readability.`,
        effort: 'low'
      },
      'keyboard-navigation': {
        priority: 'high',
        category: 'interaction',
        title: 'Fix Keyboard Navigation',
        description: `${count} elements are not keyboard accessible. Add proper tabindex and focus management.`,
        effort: 'medium'
      },
      'aria-labels': {
        priority: 'medium',
        category: 'semantic',
        title: 'Add ARIA Labels',
        description: `${count} interactive elements lack proper ARIA labels. Add aria-label or aria-labelledby attributes.`,
        effort: 'low'
      }
    };

    return ruleRecommendations[rule] || {
      priority: 'medium',
      category: 'general',
      title: `Fix ${rule} Issues`,
      description: `${count} ${rule} violations found. Review and fix according to WCAG guidelines.`,
      effort: 'medium'
    };
  }

  assessCompliance() {
    const totalIssues = this.results.summary.totalViolations;
    const totalPages = this.results.summary.totalPages;
    
    let complianceLevel = 'Non-compliant';
    let complianceScore = 0;

    if (totalIssues === 0) {
      complianceLevel = 'WCAG 2.1 AA Compliant';
      complianceScore = 100;
    } else if (totalIssues <= totalPages * 2) {
      complianceLevel = 'Partially Compliant';
      complianceScore = Math.max(0, 100 - (totalIssues * 10));
    } else {
      complianceLevel = 'Non-compliant';
      complianceScore = Math.max(0, 100 - (totalIssues * 15));
    }

    return {
      level: complianceLevel,
      score: complianceScore,
      criticalIssues: this.results.violations.filter(v => v.impact === 'critical').length,
      seriousIssues: this.results.violations.filter(v => v.impact === 'serious').length,
      moderateIssues: this.results.violations.filter(v => v.impact === 'moderate').length,
      minorIssues: this.results.violations.filter(v => v.impact === 'minor').length
    };
  }

  async generateHTMLReport(report) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Accessibility Audit Report - StartupnameAI</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; }
        .header { background: #2563eb; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px; }
        .metric { background: #f8fafc; padding: 15px; border-radius: 8px; text-align: center; }
        .metric-value { font-size: 2em; font-weight: bold; color: #2563eb; }
        .metric-label { color: #64748b; }
        .violation { background: #fef2f2; border: 1px solid #fecaca; padding: 15px; margin: 10px 0; border-radius: 8px; }
        .violation.critical { border-color: #ef4444; }
        .violation.serious { border-color: #f97316; }
        .violation.moderate { border-color: #eab308; }
        .violation.minor { border-color: #06b6d4; }
        .recommendation { background: #f0f9ff; border-left: 4px solid #2563eb; padding: 15px; margin: 10px 0; }
        .compliance { padding: 20px; background: #f8fafc; border-radius: 8px; margin: 20px 0; }
        .passed { color: #16a34a; }
        .failed { color: #dc2626; }
    </style>
</head>
<body>
    <div class="header">
        <h1>♿ Accessibility Audit Report</h1>
        <p><strong>Site:</strong> StartupnameAI | <strong>Generated:</strong> ${report.meta.timestamp}</p>
    </div>

    <div class="summary">
        <div class="metric">
            <div class="metric-value">${report.summary.totalPages}</div>
            <div class="metric-label">Pages Audited</div>
        </div>
        <div class="metric">
            <div class="metric-value ${report.summary.totalViolations === 0 ? 'passed' : 'failed'}">${report.summary.totalViolations}</div>
            <div class="metric-label">Violations</div>
        </div>
        <div class="metric">
            <div class="metric-value">${report.compliance.score}%</div>
            <div class="metric-label">Compliance Score</div>
        </div>
        <div class="metric">
            <div class="metric-value">${report.summary.passedPages}</div>
            <div class="metric-label">Pages Passed</div>
        </div>
    </div>

    <div class="compliance">
        <h2>Compliance Assessment</h2>
        <p><strong>Level:</strong> ${report.compliance.level}</p>
        <p><strong>Critical Issues:</strong> ${report.compliance.criticalIssues}</p>
        <p><strong>Serious Issues:</strong> ${report.compliance.seriousIssues}</p>
        <p><strong>Moderate Issues:</strong> ${report.compliance.moderateIssues}</p>
        <p><strong>Minor Issues:</strong> ${report.compliance.minorIssues}</p>
    </div>

    <h2>Violations by Page</h2>
    ${report.violations.map(violation => `
        <div class="violation ${violation.impact}">
            <h3>${violation.rule} - ${violation.page}</h3>
            <p><strong>Impact:</strong> ${violation.impact}</p>
            <p><strong>Description:</strong> ${violation.description}</p>
            <p><strong>Help:</strong> <a href="${violation.helpUrl}" target="_blank">${violation.help}</a></p>
            <p><strong>Affected Elements:</strong> ${violation.nodes}</p>
        </div>
    `).join('')}

    <h2>Recommendations</h2>
    ${report.recommendations.map(rec => `
        <div class="recommendation">
            <h3>${rec.title} (${rec.priority} priority)</h3>
            <p>${rec.description}</p>
            <p><strong>Effort:</strong> ${rec.effort} | <strong>Category:</strong> ${rec.category}</p>
        </div>
    `).join('')}

    <h2>Page Details</h2>
    ${report.pages.map(page => `
        <div style="border: 1px solid #e2e8f0; padding: 15px; margin: 10px 0; border-radius: 8px;">
            <h3>${page.name} (${page.score?.toFixed(1) || 'N/A'}%)</h3>
            <p><strong>URL:</strong> ${page.url}</p>
            ${page.keyboardNavigation ? `
                <p><strong>Keyboard Navigation:</strong> ${page.keyboardNavigation.canNavigateWithKeyboard ? '✅ Supported' : '❌ Issues found'}</p>
                <p><strong>Skip Links:</strong> ${page.keyboardNavigation.hasSkipLinks ? '✅ Present' : '⚠️ Missing'}</p>
            ` : ''}
            ${page.colorContrast ? `
                <p><strong>Color Contrast:</strong> ${page.colorContrast.passedElements}/${page.colorContrast.totalElements} elements passed</p>
            ` : ''}
        </div>
    `).join('')}
</body>
</html>
    `.trim();
  }

  async integrateWithErrorCorrelation() {
    if (this.results.summary.totalViolations === 0) return;

    try {
      const AdvancedErrorCorrelator = require('./error-correlator.js');
      this.errorCorrelator = new AdvancedErrorCorrelator();

      const errorData = {
        message: `Accessibility validation failed with ${this.results.summary.totalViolations} violations`,
        type: 'accessibility',
        severity: this.results.compliance.criticalIssues > 0 ? 'high' : 'medium',
        context: {
          totalViolations: this.results.summary.totalViolations,
          criticalIssues: this.results.compliance.criticalIssues,
          complianceScore: this.results.compliance.score,
          affectedPages: this.results.summary.failedPages
        }
      };

      await this.errorCorrelator.analyzeError('accessibility_validation', errorData);
      
    } catch (error) {
      console.error('⚠️ Error correlation integration failed:', error);
    }
  }

  async runQuickAudit(url) {
    console.log(`🔍 Running quick accessibility audit for: ${url}`);
    
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    try {
      await page.goto(url, { waitUntil: 'networkidle2' });
      await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });
      
      const results = await page.evaluate(async () => {
        return await axe.run(document, {
          resultTypes: ['violations'],
          tags: ['wcag2a', 'wcag2aa']
        });
      });
      
      console.log(`   Violations: ${results.violations.length}`);
      return results;
      
    } catch (error) {
      console.error(`❌ Quick audit failed for ${url}:`, error);
      throw error;
    } finally {
      await browser.close();
    }
  }
}

// CLI interface
if (require.main === module) {
  const validator = new AccessibilityValidator();
  const command = process.argv[2];
  const url = process.argv[3];

  switch (command) {
    case 'audit':
      console.log('🔄 Starting comprehensive accessibility audit...');
      validator.initialize()
        .then(() => validator.runComprehensiveAudit())
        .then(results => {
          console.log('\n📊 Audit Summary:');
          console.log(`   Total Pages: ${results.summary.totalPages}`);
          console.log(`   Violations: ${results.summary.totalViolations}`);
          console.log(`   Compliance: ${results.compliance?.level || 'Unknown'}`);
        });
      break;
      
    case 'quick':
      if (!url) {
        console.error('Usage: node accessibility-validator.js quick <url>');
        process.exit(1);
      }
      validator.runQuickAudit(url)
        .then(results => {
          console.log(`Quick audit completed: ${results.violations.length} violations found`);
        });
      break;
      
    default:
      console.log(`
♿ Comprehensive Accessibility Validation System

Usage:
  node accessibility-validator.js audit     - Run full accessibility audit
  node accessibility-validator.js quick <url> - Run quick audit on specific URL

Features:
- WCAG 2.1 AA/AAA compliance validation
- Color contrast analysis
- Keyboard navigation testing
- Screen reader compatibility
- Custom rule validation
- Integration with error correlation system
      `);
  }
}

module.exports = AccessibilityValidator;