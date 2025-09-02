#!/usr/bin/env node

/**
 * WEBPACK COMPATIBILITY CHECKER
 * 
 * This script checks for webpack/terser compatibility issues before building
 * and provides fallback strategies for production builds.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 WEBPACK COMPATIBILITY CHECK - Starting...');

function checkNodeVersion() {
  const nodeVersion = process.version;
  console.log(`📋 Node.js version: ${nodeVersion}`);
  
  const major = parseInt(nodeVersion.replace('v', '').split('.')[0]);
  if (major < 16) {
    console.warn('⚠️  Node.js version is less than 16. Consider upgrading for better webpack compatibility.');
    return false;
  }
  
  console.log('✅ Node.js version is compatible');
  return true;
}

function checkSchemaUtils() {
  const clientDir = process.cwd();
  const nodeModulesPath = path.join(clientDir, 'node_modules');
  
  // Check for schema-utils in various locations
  const schemaUtilsPaths = [
    path.join(nodeModulesPath, 'schema-utils'),
    path.join(nodeModulesPath, 'webpack', 'node_modules', 'schema-utils'),
    path.join(nodeModulesPath, 'react-scripts', 'node_modules', 'schema-utils')
  ];
  
  console.log('🔍 Checking schema-utils installations...');
  
  schemaUtilsPaths.forEach(schemaPath => {
    if (fs.existsSync(schemaPath)) {
      try {
        const packageJson = JSON.parse(fs.readFileSync(path.join(schemaPath, 'package.json'), 'utf8'));
        console.log(`📦 Found schema-utils@${packageJson.version} at: ${path.relative(clientDir, schemaPath)}`);
      } catch (err) {
        console.log(`📦 Found schema-utils (version unknown) at: ${path.relative(clientDir, schemaPath)}`);
      }
    }
  });
}

function checkTerserPlugin() {
  const clientDir = process.cwd();
  const nodeModulesPath = path.join(clientDir, 'node_modules');
  
  // Check for terser-webpack-plugin in various locations
  const terserPaths = [
    path.join(nodeModulesPath, 'terser-webpack-plugin'),
    path.join(nodeModulesPath, 'webpack', 'node_modules', 'terser-webpack-plugin'),
    path.join(nodeModulesPath, 'react-scripts', 'node_modules', 'terser-webpack-plugin')
  ];
  
  console.log('🔍 Checking terser-webpack-plugin installations...');
  
  terserPaths.forEach(terserPath => {
    if (fs.existsSync(terserPath)) {
      try {
        const packageJson = JSON.parse(fs.readFileSync(path.join(terserPath, 'package.json'), 'utf8'));
        console.log(`📦 Found terser-webpack-plugin@${packageJson.version} at: ${path.relative(clientDir, terserPath)}`);
        
        // Check if it's been patched
        const indexPath = path.join(terserPath, 'dist', 'index.js');
        if (fs.existsSync(indexPath)) {
          const content = fs.readFileSync(indexPath, 'utf8');
          if (content.includes('WEBPACK_TERSER_COMPATIBILITY_PATCH')) {
            console.log('  ✅ This installation has been patched');
          } else {
            console.log('  ⚠️  This installation needs patching');
          }
        }
      } catch (err) {
        console.log(`📦 Found terser-webpack-plugin (version unknown) at: ${path.relative(clientDir, terserPath)}`);
      }
    }
  });
}

function checkBuildEnvironment() {
  console.log('🔍 Checking build environment...');
  
  const env = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    CI: process.env.CI || 'false',
    NETLIFY: process.env.NETLIFY || 'false',
    NODE_OPTIONS: process.env.NODE_OPTIONS || 'none'
  };
  
  Object.entries(env).forEach(([key, value]) => {
    console.log(`📋 ${key}: ${value}`);
  });
  
  if (env.NETLIFY === 'true') {
    console.log('🌐 Detected Netlify environment');
    if (!process.env.NODE_OPTIONS?.includes('--openssl-legacy-provider')) {
      console.warn('⚠️  Consider adding --openssl-legacy-provider to NODE_OPTIONS for better compatibility');
    }
  }
}

function runCompatibilityTest() {
  console.log('🧪 Running webpack compatibility test...');
  
  try {
    // Try to require webpack and check for basic functionality
    const webpackPath = path.join(process.cwd(), 'node_modules', 'webpack');
    if (fs.existsSync(webpackPath)) {
      console.log('✅ Webpack installation found');
      
      // Test schema-utils import
      try {
        const schemaUtils = require('schema-utils');
        if (typeof schemaUtils.validate === 'function') {
          console.log('✅ schema-utils.validate is available');
        } else if (typeof schemaUtils === 'function') {
          console.log('✅ schema-utils (legacy) is available');
        } else {
          console.warn('⚠️  schema-utils validation method not found');
        }
      } catch (err) {
        console.warn('⚠️  Could not test schema-utils:', err.message);
      }
    } else {
      console.warn('⚠️  Webpack installation not found');
    }
  } catch (err) {
    console.error('❌ Compatibility test failed:', err.message);
  }
}

function main() {
  console.log('🚀 Starting Webpack Compatibility Check...\n');
  
  checkNodeVersion();
  console.log('');
  
  checkBuildEnvironment();
  console.log('');
  
  checkSchemaUtils();
  console.log('');
  
  checkTerserPlugin();
  console.log('');
  
  runCompatibilityTest();
  
  console.log('\n✅ WEBPACK COMPATIBILITY CHECK COMPLETED');
  console.log('🔧 If issues were found, run: npm run webpack:patch-terser');
}

// Execute if called directly
if (require.main === module) {
  main();
}

module.exports = { main };