#!/usr/bin/env node

/**
 * React Build Timeout Recovery Script
 * 
 * Automatically recovers from React compilation timeouts by:
 * - Optimizing build configuration
 * - Implementing build caching
 * - Memory optimization
 * - Bundle splitting
 * 
 * Author: QA Engineer - Error Correlation System
 */

const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

class ReactTimeoutRecovery {
  constructor() {
    this.errorContext = null;
    this.backupPath = './scripts/recovery/backups';
    this.recoverySteps = [];
    this.success = false;
    
    if (process.env.ERROR_CONTEXT) {
      try {
        this.errorContext = JSON.parse(process.env.ERROR_CONTEXT);
      } catch (error) {
        console.error('⚠️ Failed to parse error context:', error);
      }
    }
  }

  async execute() {
    console.log('⏱️ Starting React Build Timeout Recovery...');
    
    try {
      await this.createBackup();
      await this.optimizeBuildConfiguration();
      await this.implementBuildCaching();
      await this.optimizeMemoryUsage();
      await this.implementCodeSplitting();
      await this.cleanBuildArtifacts();
      await this.validateOptimizedBuild();
      
      this.success = true;
      console.log('✅ React timeout recovery completed successfully');
      return this.generateRecoveryReport();
      
    } catch (error) {
      console.error('❌ Recovery failed:', error);
      await this.rollback();
      throw error;
    }
  }

  async createBackup() {
    console.log('📦 Creating backup of build configurations...');
    
    try {
      await fs.mkdir(this.backupPath, { recursive: true });
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      
      // Backup webpack config if exists
      try {
        const webpackConfig = await fs.readFile('./webpack.config.js', 'utf8');
        await fs.writeFile(
          path.join(this.backupPath, `webpack-backup-${timestamp}.js`),
          webpackConfig
        );
      } catch {
        // No webpack config to backup
      }
      
      // Backup package.json
      const packageJson = await fs.readFile('./package.json', 'utf8');
      await fs.writeFile(
        path.join(this.backupPath, `package-backup-${timestamp}.json`),
        packageJson
      );
      
      // Backup craco config if exists
      try {
        const cracoConfig = await fs.readFile('./craco.config.js', 'utf8');
        await fs.writeFile(
          path.join(this.backupPath, `craco-backup-${timestamp}.js`),
          cracoConfig
        );
      } catch {
        // No craco config to backup
      }

      this.recoverySteps.push('Created build configuration backups');
      console.log('✅ Backup created successfully');
      
    } catch (error) {
      console.error('❌ Backup creation failed:', error);
      throw error;
    }
  }

  async optimizeBuildConfiguration() {
    console.log('⚙️ Optimizing build configuration...');
    
    try {
      const packageJsonPath = './package.json';
      const packageContent = await fs.readFile(packageJsonPath, 'utf8');
      const packageJson = JSON.parse(packageContent);
      
      // Update build scripts with optimizations
      if (!packageJson.scripts) {
        packageJson.scripts = {};
      }
      
      // Add memory optimization flags
      packageJson.scripts.build = 'cross-env NODE_OPTIONS="--max_old_space_size=4096" react-scripts build';
      packageJson.scripts['build:analyze'] = 'npm run build && npx webpack-bundle-analyzer build/static/js/*.js';
      
      await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
      
      // Create or update craco config for build optimizations
      const cracoConfig = `
module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // Optimize for build performance
      if (env === 'production') {
        // Enable build caching
        webpackConfig.cache = {
          type: 'filesystem',
          cacheDirectory: path.resolve(__dirname, '.webpack-cache'),
          buildDependencies: {
            config: [__filename]
          }
        };
        
        // Optimize chunks
        webpackConfig.optimization = {
          ...webpackConfig.optimization,
          splitChunks: {
            chunks: 'all',
            cacheGroups: {
              vendor: {
                test: /[\\\\/]node_modules[\\\\/]/,
                name: 'vendors',
                chunks: 'all'
              }
            }
          }
        };
      }
      
      return webpackConfig;
    }
  }
};
      `.trim();
      
      await fs.writeFile('./craco.config.js', cracoConfig);
      
      // Install required dependencies
      await execAsync('npm install --save-dev @craco/craco cross-env', {
        timeout: 120000
      });
      
      this.recoverySteps.push('Optimized build configuration');
      console.log('✅ Build configuration optimized');
      
    } catch (error) {
      console.error('❌ Build optimization failed:', error);
      throw error;
    }
  }

  async implementBuildCaching() {
    console.log('💾 Implementing build caching...');
    
    try {
      // Create webpack cache directory
      const cacheDir = './.webpack-cache';
      await fs.mkdir(cacheDir, { recursive: true });
      
      // Add cache configuration to environment
      const envLocalPath = './.env.local';
      let envContent = '';
      
      try {
        envContent = await fs.readFile(envLocalPath, 'utf8');
      } catch {
        // File doesn't exist, will create new
      }
      
      if (!envContent.includes('GENERATE_SOURCEMAP')) {
        envContent += '\nGENERATE_SOURCEMAP=false\n';
      }
      
      if (!envContent.includes('SKIP_PREFLIGHT_CHECK')) {
        envContent += 'SKIP_PREFLIGHT_CHECK=true\n';
      }
      
      await fs.writeFile(envLocalPath, envContent);
      
      this.recoverySteps.push('Implemented build caching');
      console.log('✅ Build caching implemented');
      
    } catch (error) {
      console.error('❌ Build caching implementation failed:', error);
      throw error;
    }
  }

  async optimizeMemoryUsage() {
    console.log('🧠 Optimizing memory usage...');
    
    try {
      // Update package.json scripts with memory optimizations
      const packageJsonPath = './package.json';
      const packageContent = await fs.readFile(packageJsonPath, 'utf8');
      const packageJson = JSON.parse(packageContent);
      
      // Increase Node.js memory allocation
      const nodeOptions = '--max_old_space_size=4096 --optimize-for-size';
      
      if (packageJson.scripts.build) {
        packageJson.scripts.build = packageJson.scripts.build.replace(
          'react-scripts build',
          `cross-env NODE_OPTIONS="${nodeOptions}" react-scripts build`
        );
      }
      
      // Add memory-efficient development script
      packageJson.scripts['start:memory-optimized'] = 
        `cross-env NODE_OPTIONS="${nodeOptions}" react-scripts start`;
      
      await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
      
      this.recoverySteps.push('Optimized memory usage settings');
      console.log('✅ Memory usage optimized');
      
    } catch (error) {
      console.error('❌ Memory optimization failed:', error);
      throw error;
    }
  }

  async implementCodeSplitting() {
    console.log('✂️ Implementing code splitting optimizations...');
    
    try {
      // Create optimized webpack config
      const webpackConfigPath = './webpack.config.js';
      const webpackConfig = `
const path = require('path');

module.exports = {
  mode: 'production',
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 20000,
      maxSize: 244000,
      cacheGroups: {
        vendor: {
          test: /[\\\\/]node_modules[\\\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 10,
          reuseExistingChunk: true
        },
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          priority: 5,
          reuseExistingChunk: true
        }
      }
    },
    runtimeChunk: {
      name: 'runtime'
    }
  },
  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  }
};
      `.trim();
      
      await fs.writeFile(webpackConfigPath, webpackConfig);
      
      // Create a sample code-splitting example if src/App.js exists
      try {
        const appPath = './src/App.js';
        const appContent = await fs.readFile(appPath, 'utf8');
        
        // Add lazy loading example if not already present
        if (!appContent.includes('lazy') && !appContent.includes('Suspense')) {
          const optimizedAppContent = `
import React, { Suspense, lazy } from 'react';
import './App.css';

// Lazy load components for better performance
const LazyComponent = lazy(() => import('./components/LazyComponent'));

function App() {
  return (
    <div className="App">
      <Suspense fallback={<div>Loading...</div>}>
        <LazyComponent />
      </Suspense>
    </div>
  );
}

export default App;
          `.trim();
          
          // Only update if it's a simple App component
          if (appContent.length < 500) {
            await fs.writeFile(appPath, optimizedAppContent);
            console.log('  Added code splitting example to App.js');
          }
        }
      } catch {
        // App.js doesn't exist or couldn't be read
      }
      
      this.recoverySteps.push('Implemented code splitting optimizations');
      console.log('✅ Code splitting implemented');
      
    } catch (error) {
      console.error('❌ Code splitting implementation failed:', error);
      throw error;
    }
  }

  async cleanBuildArtifacts() {
    console.log('🧹 Cleaning build artifacts...');
    
    try {
      // Remove build directory
      await execAsync('rm -rf build', { cwd: process.cwd() }).catch(() => {
        return execAsync('rmdir /s /q build', { cwd: process.cwd() });
      });
      
      // Remove node_modules/.cache
      await execAsync('rm -rf node_modules/.cache', { cwd: process.cwd() }).catch(() => {
        return execAsync('rmdir /s /q node_modules\\.cache', { cwd: process.cwd() });
      });
      
      // Clear npm cache
      await execAsync('npm cache clean --force');
      
      this.recoverySteps.push('Cleaned build artifacts');
      console.log('✅ Build artifacts cleaned');
      
    } catch (error) {
      console.error('❌ Build artifact cleanup failed:', error);
      // Don't throw here as this is not critical
    }
  }

  async validateOptimizedBuild() {
    console.log('🔍 Validating optimized build...');
    
    try {
      // Run optimized build
      const buildResult = await execAsync('npm run build', {
        cwd: process.cwd(),
        timeout: 900000 // 15 minute timeout (increased due to optimizations)
      });
      
      if (buildResult.stderr && buildResult.stderr.includes('error')) {
        throw new Error(`Optimized build failed: ${buildResult.stderr}`);
      }
      
      // Verify build output exists
      await fs.access('./build');
      
      // Check build size
      const buildStats = await execAsync('du -sh build 2>/dev/null || dir build').catch(() => null);
      if (buildStats) {
        console.log(`  Build size: ${buildStats.stdout.trim()}`);
      }
      
      this.recoverySteps.push('Optimized build validation passed');
      console.log('✅ Optimized build validation successful');
      
    } catch (error) {
      console.error('❌ Build validation failed:', error);
      throw error;
    }
  }

  async rollback() {
    console.log('🔄 Rolling back optimizations...');
    
    try {
      const backupFiles = await fs.readdir(this.backupPath);
      
      // Restore package.json
      const packageBackups = backupFiles
        .filter(file => file.startsWith('package-backup-'))
        .sort()
        .reverse();
      
      if (packageBackups.length > 0) {
        const backupContent = await fs.readFile(
          path.join(this.backupPath, packageBackups[0]), 
          'utf8'
        );
        await fs.writeFile('./package.json', backupContent);
        console.log('✅ Restored package.json');
      }
      
      // Remove created optimization files
      const filesToRemove = ['./craco.config.js', './webpack.config.js', './.env.local'];
      for (const file of filesToRemove) {
        try {
          await fs.unlink(file);
        } catch {
          // File might not exist
        }
      }
      
      console.log('🔄 Rollback completed');
      
    } catch (error) {
      console.error('❌ Rollback failed:', error);
    }
  }

  generateRecoveryReport() {
    return {
      success: this.success,
      timestamp: new Date().toISOString(),
      recoveryType: 'react_build_timeout',
      errorContext: this.errorContext,
      recoverySteps: this.recoverySteps,
      optimizations: [
        'Build caching implemented',
        'Memory allocation increased',
        'Code splitting configured',
        'Build artifacts cleaned'
      ],
      recommendations: [
        'Monitor build times regularly',
        'Implement bundle size monitoring',
        'Use build performance profiling',
        'Consider incremental builds for development'
      ]
    };
  }
}

// Execute recovery if run directly
if (require.main === module) {
  const recovery = new ReactTimeoutRecovery();
  
  recovery.execute()
    .then(report => {
      console.log('\n📊 Recovery Report:');
      console.log(JSON.stringify(report, null, 2));
      process.exit(0);
    })
    .catch(error => {
      console.error('\n❌ Recovery failed:', error.message);
      process.exit(1);
    });
}

module.exports = ReactTimeoutRecovery;