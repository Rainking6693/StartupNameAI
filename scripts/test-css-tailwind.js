#!/usr/bin/env node

/**
 * StartupNamer.org - CSS/Tailwind Compilation Validation
 * Comprehensive CSS and Tailwind testing for deployment validation
 */

const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');

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

class CssTailwindTester {
    constructor() {
        this.testResults = {
            timestamp: new Date().toISOString(),
            testId: this.generateTestId(),
            css: {
                compilation: {},
                analysis: {},
                tailwind: {},
                performance: {}
            },
            summary: {
                total: 0,
                passed: 0,
                failed: 0,
                warnings: []
            }
        };
        
        this.clientPath = path.join(process.cwd(), 'client');
        this.buildPath = path.join(this.clientPath, 'build');
        this.srcPath = path.join(this.clientPath, 'src');
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
            this.testResults.summary.passed++;
            return { success: true, result };
        } catch (error) {
            this.log(`${colors.red}❌ ${testName} - FAILED: ${error.message}${colors.reset}`);
            this.testResults.summary.failed++;
            return { success: false, error: error.message };
        } finally {
            this.testResults.summary.total++;
        }
    }

    async testTailwindConfig() {
        const configPath = path.join(this.clientPath, 'tailwind.config.js');
        
        if (!fs.existsSync(configPath)) {
            throw new Error('tailwind.config.js not found');
        }
        
        // Load and validate Tailwind config
        delete require.cache[require.resolve(configPath)];
        const config = require(configPath);
        
        const validation = {
            hasContent: !!config.content && config.content.length > 0,
            hasTheme: !!config.theme,
            hasPlugins: !!config.plugins,
            contentPaths: config.content || [],
            purgeEnabled: !!config.content && config.content.length > 0
        };
        
        if (!validation.hasContent) {
            throw new Error('Tailwind config missing content/purge configuration');
        }
        
        // Check if content paths are valid
        const validPaths = validation.contentPaths.filter(contentPath => {
            if (typeof contentPath === 'string') {
                // Check if it's a glob pattern or file path
                return contentPath.includes('*') || fs.existsSync(path.join(this.clientPath, contentPath));
            }
            return false;
        });
        
        validation.validContentPaths = validPaths.length;
        validation.totalContentPaths = validation.contentPaths.length;
        
        return validation;
    }

    async testPostCSSConfig() {
        const configPath = path.join(this.clientPath, 'postcss.config.js');
        
        if (!fs.existsSync(configPath)) {
            throw new Error('postcss.config.js not found');
        }
        
        delete require.cache[require.resolve(configPath)];
        const config = require(configPath);
        
        const validation = {
            hasPlugins: !!config.plugins,
            hasTailwind: false,
            hasAutoprefixer: false,
            pluginsCount: 0
        };
        
        if (config.plugins) {
            validation.pluginsCount = Object.keys(config.plugins).length;
            validation.hasTailwind = !!config.plugins.tailwindcss || Object.keys(config.plugins).some(key => key.includes('tailwind'));
            validation.hasAutoprefixer = !!config.plugins.autoprefixer || Object.keys(config.plugins).some(key => key.includes('autoprefixer'));
        }
        
        if (!validation.hasTailwind) {
            throw new Error('PostCSS config missing Tailwind CSS plugin');
        }
        
        return validation;
    }

    async testCSSCompilation() {
        const buildCssDir = path.join(this.buildPath, 'static', 'css');
        
        if (!fs.existsSync(buildCssDir)) {
            throw new Error('CSS build directory not found. Run build first.');
        }
        
        const cssFiles = fs.readdirSync(buildCssDir).filter(file => file.endsWith('.css'));
        
        if (cssFiles.length === 0) {
            throw new Error('No CSS files found in build');
        }
        
        const mainCssFile = cssFiles.find(file => file.includes('main')) || cssFiles[0];
        const cssPath = path.join(buildCssDir, mainCssFile);
        const cssContent = fs.readFileSync(cssPath, 'utf8');
        
        const analysis = {
            fileName: mainCssFile,
            fileSize: cssContent.length,
            fileSizeKB: Math.round(cssContent.length / 1024),
            minified: !cssContent.includes('\n  ') && !cssContent.includes('\n    '),
            hasTailwindClasses: this.analyzeTailwindClasses(cssContent),
            hasCustomCSS: cssContent.includes('/* custom') || cssContent.includes('/* Custom'),
            hasMediaQueries: cssContent.includes('@media'),
            hasKeyframes: cssContent.includes('@keyframes'),
            totalRules: (cssContent.match(/\{[^}]*\}/g) || []).length
        };
        
        // Check file size
        if (analysis.fileSizeKB > 500) {
            this.testResults.summary.warnings.push(`Large CSS file: ${analysis.fileSizeKB}KB`);
        }
        
        if (!analysis.hasTailwindClasses.hasUtilities) {
            throw new Error('Built CSS missing Tailwind utility classes');
        }
        
        return analysis;
    }

    analyzeTailwindClasses(cssContent) {
        const tailwindPatterns = {
            utilities: /\.(bg-|text-|p-|m-|w-|h-|flex|grid|hidden|block|inline)/g,
            responsive: /@media[^{]*{[^{}]*\.(sm:|md:|lg:|xl:|2xl:)/g,
            components: /\.(btn|card|nav|hero|container)/g,
            preflight: /\*,::before,::after/g
        };
        
        const analysis = {
            hasUtilities: tailwindPatterns.utilities.test(cssContent),
            hasResponsive: tailwindPatterns.responsive.test(cssContent),
            hasComponents: tailwindPatterns.components.test(cssContent),
            hasPreflight: tailwindPatterns.preflight.test(cssContent),
            utilitiesCount: (cssContent.match(tailwindPatterns.utilities) || []).length,
            responsiveCount: (cssContent.match(tailwindPatterns.responsive) || []).length
        };
        
        return analysis;
    }

    async testSourceCSS() {
        const indexCssPath = path.join(this.srcPath, 'index.css');
        const appCssPath = path.join(this.srcPath, 'App.css');
        
        const sourceAnalysis = {
            hasIndexCSS: fs.existsSync(indexCssPath),
            hasAppCSS: fs.existsSync(appCssPath),
            tailwindDirectives: {
                base: false,
                components: false,
                utilities: false
            }
        };
        
        if (sourceAnalysis.hasIndexCSS) {
            const indexContent = fs.readFileSync(indexCssPath, 'utf8');
            sourceAnalysis.tailwindDirectives.base = indexContent.includes('@tailwind base');
            sourceAnalysis.tailwindDirectives.components = indexContent.includes('@tailwind components');
            sourceAnalysis.tailwindDirectives.utilities = indexContent.includes('@tailwind utilities');
            sourceAnalysis.indexCSSSize = indexContent.length;
        }
        
        if (sourceAnalysis.hasAppCSS) {
            const appContent = fs.readFileSync(appCssPath, 'utf8');
            sourceAnalysis.appCSSSize = appContent.length;
            sourceAnalysis.hasCustomStyles = appContent.length > 100; // Arbitrary threshold
        }
        
        // Check if at least one CSS file has Tailwind directives
        const hasTailwindDirectives = Object.values(sourceAnalysis.tailwindDirectives).some(Boolean);
        
        if (!hasTailwindDirectives) {
            throw new Error('No Tailwind CSS directives found in source CSS');
        }
        
        return sourceAnalysis;
    }

    async testCSSInComponents() {
        const componentsPath = path.join(this.srcPath, 'components');
        
        if (!fs.existsSync(componentsPath)) {
            return { hasComponents: false, message: 'Components directory not found' };
        }
        
        const componentFiles = fs.readdirSync(componentsPath).filter(file => file.endsWith('.js') || file.endsWith('.jsx'));
        
        const cssUsageAnalysis = {
            totalComponents: componentFiles.length,
            componentsWithCSS: 0,
            tailwindUsage: {
                components: 0,
                classNames: []
            },
            styledComponents: 0,
            inlineStyles: 0
        };
        
        for (const file of componentFiles) {
            const filePath = path.join(componentsPath, file);
            const content = fs.readFileSync(filePath, 'utf8');
            
            let hasCSS = false;
            
            // Check for className usage
            if (content.includes('className=')) {
                hasCSS = true;
                cssUsageAnalysis.componentsWithCSS++;
                
                // Extract Tailwind classes
                const classNameMatches = content.match(/className=["']([^"']*)["']/g);
                if (classNameMatches) {
                    cssUsageAnalysis.tailwindUsage.components++;
                    classNameMatches.forEach(match => {
                        const classes = match.match(/["']([^"']*)["']/)[1].split(' ');
                        cssUsageAnalysis.tailwindUsage.classNames.push(...classes);
                    });
                }
            }
            
            // Check for styled components
            if (content.includes('styled.') || content.includes('styled(`')) {
                cssUsageAnalysis.styledComponents++;
                hasCSS = true;
            }
            
            // Check for inline styles
            if (content.includes('style=')) {
                cssUsageAnalysis.inlineStyles++;
                hasCSS = true;
            }
            
            if (hasCSS) {
                cssUsageAnalysis.componentsWithCSS++;
            }
        }
        
        // Remove duplicates and filter out empty classes
        cssUsageAnalysis.tailwindUsage.classNames = [...new Set(cssUsageAnalysis.tailwindUsage.classNames)]
            .filter(className => className && className.length > 0);
        
        cssUsageAnalysis.cssUsagePercentage = (cssUsageAnalysis.componentsWithCSS / cssUsageAnalysis.totalComponents) * 100;
        
        return cssUsageAnalysis;
    }

    async testResponsiveDesign() {
        const buildCssDir = path.join(this.buildPath, 'static', 'css');
        
        if (!fs.existsSync(buildCssDir)) {
            throw new Error('CSS build directory not found');
        }
        
        const cssFiles = fs.readdirSync(buildCssDir).filter(file => file.endsWith('.css'));
        const mainCssFile = cssFiles.find(file => file.includes('main')) || cssFiles[0];
        const cssPath = path.join(buildCssDir, mainCssFile);
        const cssContent = fs.readFileSync(cssPath, 'utf8');
        
        const responsiveAnalysis = {
            mediaQueries: {
                mobile: cssContent.includes('@media') && (cssContent.includes('max-width') || cssContent.includes('min-width')),
                tablet: cssContent.match(/@media[^{]*(?:768px|md:)/g) !== null,
                desktop: cssContent.match(/@media[^{]*(?:1024px|lg:|xl:)/g) !== null,
                total: (cssContent.match(/@media/g) || []).length
            },
            flexbox: cssContent.includes('display:flex') || cssContent.includes('flex'),
            grid: cssContent.includes('display:grid') || cssContent.includes('grid-'),
            responsiveClasses: {
                sm: cssContent.includes('sm:'),
                md: cssContent.includes('md:'),
                lg: cssContent.includes('lg:'),
                xl: cssContent.includes('xl:'),
                xxl: cssContent.includes('2xl:')
            }
        };
        
        responsiveAnalysis.responsiveClassCount = Object.values(responsiveAnalysis.responsiveClasses)
            .filter(Boolean).length;
        
        if (responsiveAnalysis.mediaQueries.total === 0) {
            throw new Error('No responsive media queries found in compiled CSS');
        }
        
        return responsiveAnalysis;
    }

    async testCSSPerformance() {
        const buildCssDir = path.join(this.buildPath, 'static', 'css');
        
        if (!fs.existsSync(buildCssDir)) {
            throw new Error('CSS build directory not found');
        }
        
        const cssFiles = fs.readdirSync(buildCssDir).filter(file => file.endsWith('.css'));
        let totalSize = 0;
        let totalRules = 0;
        const filesAnalysis = [];
        
        for (const file of cssFiles) {
            const filePath = path.join(buildCssDir, file);
            const content = fs.readFileSync(filePath, 'utf8');
            const size = content.length;
            const rules = (content.match(/\{[^}]*\}/g) || []).length;
            
            totalSize += size;
            totalRules += rules;
            
            filesAnalysis.push({
                name: file,
                size,
                sizeKB: Math.round(size / 1024),
                rules,
                minified: !content.includes('\n  ')
            });
        }
        
        const performanceAnalysis = {
            totalFiles: cssFiles.length,
            totalSize,
            totalSizeKB: Math.round(totalSize / 1024),
            totalRules,
            averageRulesPerFile: Math.round(totalRules / cssFiles.length),
            files: filesAnalysis,
            isOptimized: filesAnalysis.every(file => file.minified),
            sizeWarnings: []
        };
        
        // Performance warnings
        if (performanceAnalysis.totalSizeKB > 200) {
            performanceAnalysis.sizeWarnings.push(`Large total CSS size: ${performanceAnalysis.totalSizeKB}KB`);
        }
        
        filesAnalysis.forEach(file => {
            if (file.sizeKB > 100) {
                performanceAnalysis.sizeWarnings.push(`Large CSS file: ${file.name} (${file.sizeKB}KB)`);
            }
        });
        
        return performanceAnalysis;
    }

    async generateReport() {
        const reportPath = path.join(this.testResultsPath, `css-tailwind-report-${this.testResults.testId}.json`);
        
        // Add summary statistics
        this.testResults.summary.successRate = this.testResults.summary.total > 0 ?
            (this.testResults.summary.passed / this.testResults.summary.total) * 100 : 0;
        this.testResults.summary.completedAt = new Date().toISOString();
        
        // Write detailed report
        fs.writeFileSync(reportPath, JSON.stringify(this.testResults, null, 2));
        
        // Generate human-readable summary
        const summaryPath = path.join(this.testResultsPath, `css-tailwind-summary-${this.testResults.testId}.md`);
        const summary = this.generateSummaryMarkdown();
        fs.writeFileSync(summaryPath, summary);
        
        return {
            reportPath,
            summaryPath
        };
    }

    generateSummaryMarkdown() {
        const { summary, css } = this.testResults;
        
        let markdown = `# CSS/Tailwind Compilation Report\n\n`;
        markdown += `**Test ID:** ${this.testResults.testId}\n`;
        markdown += `**Timestamp:** ${this.testResults.timestamp}\n`;
        markdown += `**Success Rate:** ${summary.successRate.toFixed(1)}%\n\n`;
        
        markdown += `## Summary\n\n`;
        markdown += `- **Total Tests:** ${summary.total}\n`;
        markdown += `- **Passed:** ${summary.passed}\n`;
        markdown += `- **Failed:** ${summary.failed}\n\n`;
        
        if (summary.warnings.length > 0) {
            markdown += `### ⚠️ Warnings\n\n`;
            summary.warnings.forEach(warning => {
                markdown += `- ${warning}\n`;
            });
            markdown += `\n`;
        }
        
        if (css.compilation && css.compilation.result) {
            const comp = css.compilation.result;
            markdown += `## CSS Compilation\n\n`;
            markdown += `- **File:** ${comp.fileName}\n`;
            markdown += `- **Size:** ${comp.fileSizeKB}KB\n`;
            markdown += `- **Minified:** ${comp.minified ? '✅' : '❌'}\n`;
            markdown += `- **CSS Rules:** ${comp.totalRules}\n`;
            markdown += `- **Tailwind Utilities:** ${comp.hasTailwindClasses?.hasUtilities ? '✅' : '❌'}\n\n`;
        }
        
        if (css.performance && css.performance.result) {
            const perf = css.performance.result;
            markdown += `## Performance\n\n`;
            markdown += `- **Total CSS Size:** ${perf.totalSizeKB}KB\n`;
            markdown += `- **CSS Files:** ${perf.totalFiles}\n`;
            markdown += `- **Total Rules:** ${perf.totalRules}\n`;
            markdown += `- **Optimized:** ${perf.isOptimized ? '✅' : '❌'}\n\n`;
        }
        
        return markdown;
    }

    async run() {
        try {
            this.log(`${colors.blue}🎨 CSS/Tailwind Compilation Testing Framework${colors.reset}`);
            this.log(`${colors.blue}==============================================${colors.reset}\n`);
            this.log(`Test ID: ${this.testResults.testId}`);
            this.log(`Client Path: ${this.clientPath}`);
            this.log(`Build Path: ${this.buildPath}\n`);
            
            // Verify directories exist
            if (!fs.existsSync(this.clientPath)) {
                throw new Error(`Client directory not found: ${this.clientPath}`);
            }
            
            this.logSection('🔧 Testing Configuration Files');
            
            // Test Tailwind config
            const tailwindTest = await this.runTest(
                'Tailwind Configuration Validation',
                () => this.testTailwindConfig()
            );
            this.testResults.css.tailwind = tailwindTest;
            
            // Test PostCSS config
            const postcssTest = await this.runTest(
                'PostCSS Configuration Validation',
                () => this.testPostCSSConfig()
            );
            this.testResults.css.postcss = postcssTest;
            
            this.logSection('📄 Testing Source CSS');
            
            // Test source CSS files
            const sourceCssTest = await this.runTest(
                'Source CSS Analysis',
                () => this.testSourceCSS()
            );
            this.testResults.css.source = sourceCssTest;
            
            // Test CSS in components
            const componentCssTest = await this.runTest(
                'Component CSS Usage Analysis',
                () => this.testCSSInComponents()
            );
            this.testResults.css.components = componentCssTest;
            
            this.logSection('🏗️ Testing Compiled CSS');
            
            // Test CSS compilation
            const compilationTest = await this.runTest(
                'CSS Compilation Analysis',
                () => this.testCSSCompilation()
            );
            this.testResults.css.compilation = compilationTest;
            
            // Test responsive design
            const responsiveTest = await this.runTest(
                'Responsive Design Validation',
                () => this.testResponsiveDesign()
            );
            this.testResults.css.responsive = responsiveTest;
            
            // Test performance
            const performanceTest = await this.runTest(
                'CSS Performance Analysis',
                () => this.testCSSPerformance()
            );
            this.testResults.css.performance = performanceTest;
            
            // Generate reports
            const { reportPath, summaryPath } = await this.generateReport();
            
            this.logSection('📊 CSS/Tailwind Testing Summary');
            this.log(`Total Tests: ${this.testResults.summary.total}`);
            this.log(`Passed: ${colors.green}${this.testResults.summary.passed}${colors.reset}`);
            this.log(`Failed: ${colors.red}${this.testResults.summary.failed}${colors.reset}`);
            this.log(`Success Rate: ${colors.cyan}${this.testResults.summary.successRate.toFixed(1)}%${colors.reset}`);
            
            if (this.testResults.summary.warnings.length > 0) {
                this.log(`\n${colors.yellow}⚠️  Warnings:${colors.reset}`);
                this.testResults.summary.warnings.forEach(warning => {
                    this.log(`  - ${warning}`, 'yellow');
                });
            }
            
            this.log(`\n${colors.blue}📄 Reports Generated:${colors.reset}`);
            this.log(`Detailed Report: ${reportPath}`);
            this.log(`Summary Report: ${summaryPath}`);
            
            if (this.testResults.summary.failed === 0) {
                this.log(`\n${colors.green}🎉 All CSS/Tailwind tests passed!${colors.reset}`);
                process.exit(0);
            } else {
                this.log(`\n${colors.yellow}⚠️  Some tests need attention.${colors.reset}`);
                process.exit(1);
            }
            
        } catch (error) {
            this.log(`${colors.red}❌ CSS/Tailwind testing failed: ${error.message}${colors.reset}`);
            process.exit(1);
        }
    }
}

// Run the tests if called directly
if (require.main === module) {
    const tester = new CssTailwindTester();
    tester.run().catch(console.error);
}

module.exports = CssTailwindTester;