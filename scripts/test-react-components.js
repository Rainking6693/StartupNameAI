#!/usr/bin/env node

/**
 * StartupNamer.org - React Component Isolation Testing Framework
 * Comprehensive component testing for deployment validation
 */

const fs = require('fs');
const path = require('path');
const { spawn, execSync } = require('child_process');

// Colors for output
const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    purple: '\x1b[35m',
    cyan: '\x1b[36m',
    reset: '\x1b[0m'
};

class ReactComponentTester {
    constructor() {
        this.testResults = {
            timestamp: new Date().toISOString(),
            testId: this.generateTestId(),
            components: {},
            summary: {
                total: 0,
                passed: 0,
                failed: 0,
                warnings: []
            }
        };
        
        this.clientPath = path.join(process.cwd(), 'client');
        this.srcPath = path.join(this.clientPath, 'src');
        this.componentsPath = path.join(this.srcPath, 'components');
        this.testResultsPath = path.join(process.cwd(), 'test-results');
        
        // Ensure test results directory exists
        if (!fs.existsSync(this.testResultsPath)) {
            fs.mkdirSync(this.testResultsPath, { recursive: true });
        }
    }

    generateTestId() {
        const now = new Date();
        return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
    }

    log(message, color = 'reset') {
        console.log(`${colors[color]}${message}${colors.reset}`);
    }

    logSection(title) {
        this.log(`\n${colors.blue}${'='.repeat(60)}${colors.reset}`);
        this.log(`${colors.blue}${title}${colors.reset}`);
        this.log(`${colors.blue}${'='.repeat(60)}${colors.reset}`);
    }

    async runTest(testName, testFunction) {
        this.log(`\n${colors.yellow}🧪 Running: ${testName}${colors.reset}`);
        try {
            const result = await testFunction();
            this.log(`${colors.green}✅ ${testName} - PASSED${colors.reset}`);
            return { success: true, result };
        } catch (error) {
            this.log(`${colors.red}❌ ${testName} - FAILED: ${error.message}${colors.reset}`);
            return { success: false, error: error.message };
        }
    }

    async testComponentExists(componentName) {
        const componentPath = path.join(this.componentsPath, `${componentName}.js`);
        const componentExists = fs.existsSync(componentPath);
        
        if (!componentExists) {
            throw new Error(`Component file not found: ${componentPath}`);
        }
        
        const content = fs.readFileSync(componentPath, 'utf8');
        
        // Check for basic React component structure
        const hasReactImport = content.includes('import React') || content.includes('from \'react\'');
        const hasExport = content.includes('export') && (content.includes('default') || content.includes(componentName));
        const hasJSX = content.includes('return (') || content.includes('return<') || content.includes('=>');
        
        if (!hasReactImport) {
            throw new Error('Component missing React import');
        }
        
        if (!hasExport) {
            throw new Error('Component missing proper export');
        }
        
        if (!hasJSX) {
            throw new Error('Component missing JSX return statement');
        }
        
        return {
            path: componentPath,
            size: content.length,
            hasReactImport,
            hasExport,
            hasJSX
        };
    }

    async testComponentImports(componentName) {
        const componentPath = path.join(this.componentsPath, `${componentName}.js`);
        const content = fs.readFileSync(componentPath, 'utf8');
        
        // Extract import statements
        const importLines = content.split('\n').filter(line => line.trim().startsWith('import'));
        const imports = {
            react: false,
            reactDom: false,
            external: [],
            internal: []
        };
        
        importLines.forEach(line => {
            if (line.includes('react') && !line.includes('react-dom')) {
                imports.react = true;
            }
            if (line.includes('react-dom')) {
                imports.reactDom = true;
            }
            if (line.includes('./') || line.includes('../')) {
                imports.internal.push(line.trim());
            }
            if (!line.includes('./') && !line.includes('../') && !line.includes('react')) {
                imports.external.push(line.trim());
            }
        });
        
        return imports;
    }

    async testComponentProps(componentName) {
        const componentPath = path.join(this.componentsPath, `${componentName}.js`);
        const content = fs.readFileSync(componentPath, 'utf8');
        
        // Analyze props usage
        const propsAnalysis = {
            hasProps: content.includes('props.') || content.includes('props)') || content.includes('{ ') && content.includes(' }'),
            hasPropTypes: content.includes('PropTypes'),
            hasDefaultProps: content.includes('defaultProps'),
            destructured: content.includes('const {') || content.includes('function') && content.includes('{ ')
        };
        
        return propsAnalysis;
    }

    async testComponentHooks(componentName) {
        const componentPath = path.join(this.componentsPath, `${componentName}.js`);
        const content = fs.readFileSync(componentPath, 'utf8');
        
        // Analyze React hooks usage
        const hooksUsage = {
            useState: content.includes('useState'),
            useEffect: content.includes('useEffect'),
            useContext: content.includes('useContext'),
            useCallback: content.includes('useCallback'),
            useMemo: content.includes('useMemo'),
            useRef: content.includes('useRef'),
            customHooks: []
        };
        
        // Find custom hooks (functions starting with 'use')
        const customHookMatches = content.match(/use[A-Z]\w*/g);
        if (customHookMatches) {
            hooksUsage.customHooks = [...new Set(customHookMatches)].filter(hook => 
                !['useState', 'useEffect', 'useContext', 'useCallback', 'useMemo', 'useRef'].includes(hook)
            );
        }
        
        return hooksUsage;
    }

    async testComponentStyling(componentName) {
        const componentPath = path.join(this.componentsPath, `${componentName}.js`);
        const content = fs.readFileSync(componentPath, 'utf8');
        
        // Analyze styling approach
        const stylingAnalysis = {
            hasCSSClasses: content.includes('className='),
            hasTailwind: content.match(/className=["'][^"']*(?:bg-|text-|p-|m-|flex|grid|hidden|block|inline)/),
            hasInlineStyles: content.includes('style='),
            hasStyledComponents: content.includes('styled.') || content.includes('styled(`'),
            hasCSSModules: content.includes('.module.css') || content.includes('styles.')
        };
        
        return stylingAnalysis;
    }

    async testComponentAccessibility(componentName) {
        const componentPath = path.join(this.componentsPath, `${componentName}.js`);
        const content = fs.readFileSync(componentPath, 'utf8');
        
        // Check for accessibility features
        const a11yFeatures = {
            hasAriaLabels: content.includes('aria-label') || content.includes('ariaLabel'),
            hasAriaDescribedBy: content.includes('aria-describedby'),
            hasRole: content.includes('role='),
            hasAltText: content.includes('alt='),
            hasTabIndex: content.includes('tabIndex'),
            hasKeyboardHandlers: content.includes('onKeyDown') || content.includes('onKeyPress') || content.includes('onKeyUp'),
            hasFocusManagement: content.includes('focus()') || content.includes('useRef')
        };
        
        return a11yFeatures;
    }

    async testCriticalComponents() {
        this.logSection('🧪 Testing Critical React Components');
        
        // Define critical components to test
        const criticalComponents = [
            'App',
            'Header',
            'Footer',
            'LandingPage',
            'NamingTool',
            'NameResults',
            'LoadingStates'
        ];
        
        for (const componentName of criticalComponents) {
            this.log(`\n${colors.cyan}📦 Testing Component: ${componentName}${colors.reset}`);
            
            const componentResults = {
                name: componentName,
                tests: {}
            };
            
            // Test component existence and basic structure
            const existsTest = await this.runTest(
                `${componentName} - Component exists and has valid structure`,
                () => this.testComponentExists(componentName)
            );
            componentResults.tests.exists = existsTest;
            
            if (existsTest.success) {
                // Test imports
                const importsTest = await this.runTest(
                    `${componentName} - Import analysis`,
                    () => this.testComponentImports(componentName)
                );
                componentResults.tests.imports = importsTest;
                
                // Test props
                const propsTest = await this.runTest(
                    `${componentName} - Props analysis`,
                    () => this.testComponentProps(componentName)
                );
                componentResults.tests.props = propsTest;
                
                // Test hooks
                const hooksTest = await this.runTest(
                    `${componentName} - Hooks analysis`,
                    () => this.testComponentHooks(componentName)
                );
                componentResults.tests.hooks = hooksTest;
                
                // Test styling
                const stylingTest = await this.runTest(
                    `${componentName} - Styling analysis`,
                    () => this.testComponentStyling(componentName)
                );
                componentResults.tests.styling = stylingTest;
                
                // Test accessibility
                const a11yTest = await this.runTest(
                    `${componentName} - Accessibility analysis`,
                    () => this.testComponentAccessibility(componentName)
                );
                componentResults.tests.accessibility = a11yTest;
            }
            
            this.testResults.components[componentName] = componentResults;
            this.testResults.summary.total++;
            
            const passedTests = Object.values(componentResults.tests).filter(test => test.success).length;
            const totalTests = Object.values(componentResults.tests).length;
            
            if (passedTests === totalTests) {
                this.testResults.summary.passed++;
                this.log(`${colors.green}✅ ${componentName} - All tests passed (${passedTests}/${totalTests})${colors.reset}`);
            } else {
                this.testResults.summary.failed++;
                this.log(`${colors.yellow}⚠️  ${componentName} - Some tests failed (${passedTests}/${totalTests})${colors.reset}`);
            }
        }
    }

    async testRouteComponents() {
        this.logSection('🛣️  Testing Route-Specific Components');
        
        // Test that route components can be imported
        const routeComponents = [
            'LandingPage',
            'NamingTool',
            'PrivacyPolicy',
            'TermsOfService'
        ];
        
        for (const component of routeComponents) {
            await this.runTest(
                `Route Component - ${component}`,
                () => this.testComponentExists(component)
            );
        }
    }

    async testFormComponents() {
        this.logSection('📝 Testing Form Components');
        
        const formComponents = ['NamingTool', 'MobileForm'];
        
        for (const component of formComponents) {
            const result = await this.runTest(
                `Form Component - ${component}`,
                async () => {
                    const componentPath = path.join(this.componentsPath, `${component}.js`);
                    if (!fs.existsSync(componentPath)) {
                        throw new Error(`Component not found: ${component}`);
                    }
                    
                    const content = fs.readFileSync(componentPath, 'utf8');
                    
                    // Check for form-specific patterns
                    const hasFormElements = content.includes('<form') || content.includes('<input') || content.includes('<button');
                    const hasFormHandlers = content.includes('onSubmit') || content.includes('onChange') || content.includes('onClick');
                    const hasValidation = content.includes('validate') || content.includes('error') || content.includes('required');
                    
                    return {
                        hasFormElements,
                        hasFormHandlers,
                        hasValidation
                    };
                }
            );
            
            if (result.success && result.result) {
                const { hasFormElements, hasFormHandlers, hasValidation } = result.result;
                this.log(`  Form Elements: ${hasFormElements ? '✅' : '❌'}`);
                this.log(`  Event Handlers: ${hasFormHandlers ? '✅' : '❌'}`);
                this.log(`  Validation Logic: ${hasValidation ? '✅' : '❌'}`);
            }
        }
    }

    async generateReport() {
        const reportPath = path.join(this.testResultsPath, `react-components-report-${this.testResults.testId}.json`);
        
        // Add summary statistics
        this.testResults.summary.successRate = (this.testResults.summary.passed / this.testResults.summary.total) * 100;
        this.testResults.summary.completedAt = new Date().toISOString();
        
        // Write detailed report
        fs.writeFileSync(reportPath, JSON.stringify(this.testResults, null, 2));
        
        // Generate human-readable summary
        const summaryPath = path.join(this.testResultsPath, `react-components-summary-${this.testResults.testId}.md`);
        const summary = this.generateSummaryMarkdown();
        fs.writeFileSync(summaryPath, summary);
        
        return {
            reportPath,
            summaryPath
        };
    }

    generateSummaryMarkdown() {
        const { summary, components } = this.testResults;
        
        let markdown = `# React Component Testing Report\n\n`;
        markdown += `**Test ID:** ${this.testResults.testId}\n`;
        markdown += `**Timestamp:** ${this.testResults.timestamp}\n`;
        markdown += `**Success Rate:** ${summary.successRate.toFixed(1)}%\n\n`;
        
        markdown += `## Summary\n\n`;
        markdown += `- **Total Components:** ${summary.total}\n`;
        markdown += `- **Passed:** ${summary.passed}\n`;
        markdown += `- **Failed:** ${summary.failed}\n\n`;
        
        markdown += `## Component Details\n\n`;
        
        Object.entries(components).forEach(([name, data]) => {
            const passedTests = Object.values(data.tests).filter(test => test.success).length;
            const totalTests = Object.values(data.tests).length;
            const status = passedTests === totalTests ? '✅' : '⚠️';
            
            markdown += `### ${status} ${name} (${passedTests}/${totalTests})\n\n`;
            
            Object.entries(data.tests).forEach(([testName, result]) => {
                const icon = result.success ? '✅' : '❌';
                markdown += `- ${icon} ${testName}\n`;
                
                if (!result.success && result.error) {
                    markdown += `  - Error: ${result.error}\n`;
                }
                
                if (result.success && result.result && typeof result.result === 'object') {
                    Object.entries(result.result).forEach(([key, value]) => {
                        if (typeof value === 'boolean' || typeof value === 'string' || typeof value === 'number') {
                            markdown += `  - ${key}: ${value}\n`;
                        }
                    });
                }
            });
            
            markdown += `\n`;
        });
        
        return markdown;
    }

    async run() {
        try {
            this.log(`${colors.blue}⚛️  React Component Testing Framework${colors.reset}`);
            this.log(`${colors.blue}======================================${colors.reset}\n`);
            this.log(`Test ID: ${this.testResults.testId}`);
            this.log(`Client Path: ${this.clientPath}`);
            this.log(`Components Path: ${this.componentsPath}\n`);
            
            // Verify client directory exists
            if (!fs.existsSync(this.clientPath)) {
                throw new Error(`Client directory not found: ${this.clientPath}`);
            }
            
            if (!fs.existsSync(this.componentsPath)) {
                throw new Error(`Components directory not found: ${this.componentsPath}`);
            }
            
            // Run all tests
            await this.testCriticalComponents();
            await this.testRouteComponents();
            await this.testFormComponents();
            
            // Generate reports
            const { reportPath, summaryPath } = await this.generateReport();
            
            this.logSection('📊 Test Results Summary');
            this.log(`Total Components Tested: ${this.testResults.summary.total}`);
            this.log(`Passed: ${colors.green}${this.testResults.summary.passed}${colors.reset}`);
            this.log(`Failed: ${colors.red}${this.testResults.summary.failed}${colors.reset}`);
            this.log(`Success Rate: ${colors.cyan}${this.testResults.summary.successRate.toFixed(1)}%${colors.reset}`);
            
            this.log(`\n${colors.blue}📄 Reports Generated:${colors.reset}`);
            this.log(`Detailed Report: ${reportPath}`);
            this.log(`Summary Report: ${summaryPath}`);
            
            if (this.testResults.summary.failed === 0) {
                this.log(`\n${colors.green}🎉 All React components passed testing!${colors.reset}`);
                process.exit(0);
            } else {
                this.log(`\n${colors.yellow}⚠️  Some components need attention.${colors.reset}`);
                process.exit(1);
            }
            
        } catch (error) {
            this.log(`${colors.red}❌ Testing failed: ${error.message}${colors.reset}`);
            process.exit(1);
        }
    }
}

// Run the tests if called directly
if (require.main === module) {
    const tester = new ReactComponentTester();
    tester.run().catch(console.error);
}

module.exports = ReactComponentTester;