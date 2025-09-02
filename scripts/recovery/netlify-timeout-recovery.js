#!/usr/bin/env node

/**
 * Netlify Build Timeout Recovery Strategy
 * 
 * Automatically handles Netlify build timeouts through:
 * - Build optimization analysis
 * - Cache management
 * - Resource optimization
 * - Retry with optimized settings
 */

const fs = require('fs').promises;
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

class NetlifyTimeoutRecovery {
  constructor() {
    this.errorContext = JSON.parse(process.env.ERROR_CONTEXT || '{}');
    this.recoverySteps = [];
    this.optimizations = [];
  }

  async execute() {
    console.log('🔄 Executing Netlify timeout recovery...');
    
    try {
      // Step 1: Analyze build performance
      await this.analyzeBuildPerformance();
      
      // Step 2: Clear build cache
      await this.clearBuildCache();
      
      // Step 3: Optimize build process
      await this.optimizeBuildProcess();
      
      // Step 4: Retry build with optimizations
      const retryResult = await this.retryOptimizedBuild();
      
      // Generate recovery report
      const report = await this.generateRecoveryReport(retryResult);
      
      console.log('✅ Netlify timeout recovery completed');
      return { success: retryResult.success, report };
      
    } catch (error) {
      console.error('❌ Recovery failed:', error);
      return { success: false, error: error.message };
    }
  }

  async analyzeBuildPerformance() {
    console.log('📊 Analyzing build performance...');
    this.recoverySteps.push('Analyzing build performance');

    try {
      // Check bundle size
      const clientPath = './client';
      const { stdout: buildSize } = await execAsync(`du -sh ${clientPath}/build 2>/dev/null || echo "0M"`, { shell: true });
      
      // Check node_modules size
      const { stdout: nodeModulesSize } = await execAsync(`du -sh ${clientPath}/node_modules 2>/dev/null || echo "0M"`, { shell: true });
      
      // Check for potential performance issues
      const packageJson = JSON.parse(await fs.readFile('./client/package.json', 'utf8'));
      const dependencies = Object.keys(packageJson.dependencies || {});
      const devDependencies = Object.keys(packageJson.devDependencies || {});
      
      this.optimizations.push({
        type: 'performance_analysis',
        buildSize: buildSize.trim(),
        nodeModulesSize: nodeModulesSize.trim(),
        totalDependencies: dependencies.length + devDependencies.length,
        recommendations: this.generatePerformanceRecommendations(dependencies.length + devDependencies.length)
      });

      console.log(`   Build size: ${buildSize.trim()}`);
      console.log(`   Dependencies: ${dependencies.length + devDependencies.length}`);
      
    } catch (error) {
      console.error('⚠️ Performance analysis failed:', error.message);
      this.optimizations.push({
        type: 'performance_analysis',
        error: error.message,
        recommendations: ['Manual performance review needed']
      });
    }
  }

  async clearBuildCache() {
    console.log('🧹 Clearing build cache...');
    this.recoverySteps.push('Clearing build cache');

    const cacheCommands = [
      'rm -rf ./client/build',
      'rm -rf ./client/.cache',
      'rm -rf ./client/node_modules/.cache',
      'rm -rf ./.netlify/cache'
    ];

    for (const command of cacheCommands) {
      try {
        await execAsync(command, { shell: true });
        console.log(`   ✓ ${command}`);
      } catch (error) {
        console.log(`   ⚠️ ${command} - ${error.message}`);
      }
    }

    this.optimizations.push({
      type: 'cache_clearing',
      clearedCaches: ['build', 'webpack', 'node_modules', 'netlify'],
      success: true
    });
  }

  async optimizeBuildProcess() {
    console.log('⚡ Optimizing build process...');
    this.recoverySteps.push('Optimizing build process');

    const optimizations = [];

    try {
      // Check for webpack-bundle-analyzer
      const clientPackage = JSON.parse(await fs.readFile('./client/package.json', 'utf8'));
      
      if (!clientPackage.devDependencies?.['webpack-bundle-analyzer']) {
        console.log('   📦 Adding webpack-bundle-analyzer for optimization insights');
        await execAsync('cd client && npm install --save-dev webpack-bundle-analyzer', { shell: true });
        optimizations.push('Added webpack-bundle-analyzer');
      }

      // Create optimized build script
      const optimizedScript = `
// Optimized build configuration for timeout recovery
const originalBuild = require('react-scripts/scripts/build');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

// Set production optimizations
process.env.NODE_ENV = 'production';
process.env.GENERATE_SOURCEMAP = 'false'; // Disable source maps for faster build
process.env.BUILD_PATH = './build';

// Memory optimization
process.env.NODE_OPTIONS = '--max-old-space-size=4096';

console.log('🚀 Starting optimized build for timeout recovery...');
console.log('⚙️ Optimizations enabled:');
console.log('   - Source maps disabled');
console.log('   - Memory limit increased');
console.log('   - Bundle analysis enabled');

// Execute build
require('react-scripts/scripts/build');
`;

      await fs.writeFile('./client/scripts/optimized-build.js', optimizedScript);
      optimizations.push('Created optimized build script');

      // Update package.json with optimized build command
      clientPackage.scripts = clientPackage.scripts || {};
      clientPackage.scripts['build:recovery'] = 'node scripts/optimized-build.js';
      
      await fs.writeFile('./client/package.json', JSON.stringify(clientPackage, null, 2));
      optimizations.push('Added recovery build script to package.json');

      this.optimizations.push({
        type: 'build_optimization',
        optimizations,
        success: true
      });

    } catch (error) {
      console.error('⚠️ Build optimization failed:', error.message);
      this.optimizations.push({
        type: 'build_optimization',
        error: error.message,
        optimizations
      });
    }
  }

  async retryOptimizedBuild() {
    console.log('🔄 Retrying build with optimizations...');
    this.recoverySteps.push('Retrying optimized build');

    try {
      const startTime = Date.now();
      
      // Try the optimized build first
      try {
        const { stdout, stderr } = await execAsync('cd client && npm run build:recovery', { 
          shell: true,
          timeout: 600000 // 10 minutes
        });
        
        const buildTime = Date.now() - startTime;
        console.log(`✅ Optimized build successful in ${buildTime}ms`);
        
        return {
          success: true,
          method: 'optimized',
          buildTime,
          output: stdout
        };
        
      } catch (optimizedError) {
        console.log('⚠️ Optimized build failed, trying standard build...');
        
        // Fallback to standard build with timeout increase
        const { stdout, stderr } = await execAsync('cd client && npm run build', { 
          shell: true,
          timeout: 900000 // 15 minutes
        });
        
        const buildTime = Date.now() - startTime;
        console.log(`✅ Standard build successful in ${buildTime}ms`);
        
        return {
          success: true,
          method: 'standard_extended_timeout',
          buildTime,
          output: stdout,
          fallbackFrom: 'optimized'
        };
      }
      
    } catch (error) {
      console.error('❌ Both build attempts failed:', error.message);
      
      return {
        success: false,
        error: error.message,
        attempts: ['optimized', 'standard_extended_timeout']
      };
    }
  }

  generatePerformanceRecommendations(dependencyCount) {
    const recommendations = [];
    
    if (dependencyCount > 100) {
      recommendations.push('Consider dependency audit - high dependency count detected');
      recommendations.push('Review and remove unused dependencies');
    }
    
    recommendations.push('Enable webpack bundle analyzer for optimization insights');
    recommendations.push('Consider code splitting for large applications');
    recommendations.push('Implement build caching strategies');
    
    return recommendations;
  }

  async generateRecoveryReport(retryResult) {
    const report = {
      timestamp: new Date().toISOString(),
      recoveryType: 'netlify_timeout',
      originalError: this.errorContext,
      recoverySteps: this.recoverySteps,
      optimizations: this.optimizations,
      buildResult: retryResult,
      recommendations: [
        'Monitor build times to prevent future timeouts',
        'Implement proactive build optimization',
        'Consider upgrading Netlify build tier if timeouts persist',
        'Review dependency management practices'
      ]
    };

    const reportPath = `./scripts/reports/netlify-timeout-recovery-${Date.now()}.json`;
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`📊 Recovery report saved: ${reportPath}`);
    return report;
  }
}

// Execute recovery if called directly
if (require.main === module) {
  const recovery = new NetlifyTimeoutRecovery();
  recovery.execute()
    .then(result => {
      console.log('Recovery result:', result.success ? '✅ Success' : '❌ Failed');
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('Recovery execution failed:', error);
      process.exit(1);
    });
}

module.exports = NetlifyTimeoutRecovery;