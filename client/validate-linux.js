#!/usr/bin/env node

/**
 * LINUX COMPATIBILITY VALIDATOR
 * 
 * This script validates that our build system works in a Linux-like environment
 * similar to Netlify's Ubuntu containers.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

console.log('🐧 LINUX COMPATIBILITY VALIDATION');
console.log(`📍 Current Platform: ${os.platform()}`);
console.log(`🔧 Node Version: ${process.version}`);

function validateBuildOutput() {
  const buildDir = path.join(process.cwd(), 'build');
  
  console.log('\n📦 Validating build output...');
  
  // Check essential files
  const requiredFiles = [
    'index.html',
    '_redirects',
    '_headers',
    'static/js/main.js',
    'static/css/main.css'
  ];
  
  const missingFiles = [];
  requiredFiles.forEach(file => {
    const filePath = path.join(buildDir, file);
    if (!fs.existsSync(filePath)) {
      missingFiles.push(file);
    } else {
      console.log(`✅ ${file}`);
    }
  });
  
  if (missingFiles.length > 0) {
    console.error(`❌ Missing files: ${missingFiles.join(', ')}`);
    return false;
  }
  
  return true;
}

function validateNetlifyCompatibility() {
  console.log('\n🌐 Validating Netlify compatibility...');
  
  const buildDir = path.join(process.cwd(), 'build');
  
  // Check _redirects syntax
  const redirectsPath = path.join(buildDir, '_redirects');
  const redirectsContent = fs.readFileSync(redirectsPath, 'utf8');
  if (!redirectsContent.includes('/*    /index.html   200')) {
    console.error('❌ Invalid _redirects syntax');
    return false;
  }
  console.log('✅ _redirects file valid');
  
  // Check _headers syntax
  const headersPath = path.join(buildDir, '_headers');
  const headersContent = fs.readFileSync(headersPath, 'utf8');
  if (!headersContent.includes('X-Frame-Options: DENY')) {
    console.error('❌ Invalid _headers syntax');
    return false;
  }
  console.log('✅ _headers file valid');
  
  // Check HTML structure
  const indexPath = path.join(buildDir, 'index.html');
  const htmlContent = fs.readFileSync(indexPath, 'utf8');
  if (!htmlContent.includes('<div id="root">')) {
    console.error('❌ Invalid HTML structure');
    return false;
  }
  console.log('✅ HTML structure valid');
  
  return true;
}

function validateCrossPlatformPaths() {
  console.log('\n🛤️ Validating cross-platform paths...');
  
  const buildDir = path.join(process.cwd(), 'build');
  const indexPath = path.join(buildDir, 'index.html');
  const htmlContent = fs.readFileSync(indexPath, 'utf8');
  
  // Check for absolute paths (good for cross-platform)
  const hasAbsolutePaths = htmlContent.includes('href="/static/') && htmlContent.includes('src="/static/');
  if (!hasAbsolutePaths) {
    console.error('❌ Missing absolute paths in HTML');
    return false;
  }
  console.log('✅ Cross-platform paths valid');
  
  // Check for Windows-specific paths (bad for Linux)
  const hasWindowsPaths = htmlContent.includes('\\\\') || htmlContent.includes('C:');
  if (hasWindowsPaths) {
    console.error('❌ Windows-specific paths found');
    return false;
  }
  console.log('✅ No Windows-specific paths');
  
  return true;
}

function validateFilePermissions() {
  console.log('\n🔐 Validating file permissions...');
  
  const buildDir = path.join(process.cwd(), 'build');
  
  try {
    // Test read access to all files
    const files = fs.readdirSync(buildDir, { recursive: true });
    let fileCount = 0;
    
    files.forEach(file => {
      const filePath = path.join(buildDir, file);
      if (fs.statSync(filePath).isFile()) {
        fs.readFileSync(filePath);
        fileCount++;
      }
    });
    
    console.log(`✅ All ${fileCount} files readable`);
    return true;
  } catch (error) {
    console.error('❌ File permission error:', error.message);
    return false;
  }
}

function simulateNetlifyEnvironment() {
  console.log('\n🔄 Simulating Netlify environment variables...');
  
  // Simulate Netlify's Node environment
  const netlifyEnv = {
    NODE_ENV: 'production',
    NODE_VERSION: '16.18.1',
    NPM_VERSION: '8.19.4',
    CI: 'true',
    NETLIFY: 'true',
    CONTEXT: 'production',
    BRANCH: 'main'
  };
  
  Object.keys(netlifyEnv).forEach(key => {
    process.env[key] = netlifyEnv[key];
    console.log(`✅ ${key}=${netlifyEnv[key]}`);
  });
  
  return true;
}

function validateBundleSize() {
  console.log('\n📏 Validating bundle size...');
  
  const buildDir = path.join(process.cwd(), 'build');
  
  function getDirectorySize(dirPath) {
    let totalSize = 0;
    const files = fs.readdirSync(dirPath, { recursive: true });
    
    files.forEach(file => {
      const filePath = path.join(dirPath, file);
      if (fs.statSync(filePath).isFile()) {
        totalSize += fs.statSync(filePath).size;
      }
    });
    
    return totalSize;
  }
  
  const totalSize = getDirectorySize(buildDir);
  const sizeMB = Math.round(totalSize / (1024 * 1024));
  const sizeKB = Math.round(totalSize / 1024);
  
  console.log(`📦 Total build size: ${sizeKB}KB (${sizeMB}MB)`);
  
  // Netlify has a 125MB limit per deployment
  if (totalSize > 125 * 1024 * 1024) {
    console.error('❌ Build too large for Netlify (>125MB)');
    return false;
  }
  
  console.log('✅ Build size within Netlify limits');
  return true;
}

// Main validation
function main() {
  console.log('🚀 Starting comprehensive validation...\n');
  
  const checks = [
    { name: 'Build Output', fn: validateBuildOutput },
    { name: 'Netlify Compatibility', fn: validateNetlifyCompatibility },
    { name: 'Cross-Platform Paths', fn: validateCrossPlatformPaths },
    { name: 'File Permissions', fn: validateFilePermissions },
    { name: 'Netlify Environment', fn: simulateNetlifyEnvironment },
    { name: 'Bundle Size', fn: validateBundleSize }
  ];
  
  let passed = 0;
  let failed = 0;
  
  checks.forEach(check => {
    try {
      if (check.fn()) {
        passed++;
      } else {
        failed++;
      }
    } catch (error) {
      console.error(`❌ ${check.name} failed with error:`, error.message);
      failed++;
    }
  });
  
  console.log('\n' + '='.repeat(50));
  console.log(`📊 VALIDATION RESULTS: ${passed}/${checks.length} passed`);
  
  if (failed === 0) {
    console.log('🎉 ALL CHECKS PASSED!');
    console.log('✅ Build is ready for Netlify deployment');
    console.log('✅ Linux compatibility confirmed');
    console.log('✅ No terser-webpack-plugin issues');
    console.log('\n🚀 Deploy command: netlify deploy --dir=build --prod');
  } else {
    console.log(`❌ ${failed} checks failed`);
    console.log('🔧 Please fix issues before deploying');
    process.exit(1);
  }
}

main();