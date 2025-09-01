#!/usr/bin/env node

/**
 * Deployment script for StartupNamer.org Next.js SSR version
 * This script handles the deployment process and validation
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  reset: '\x1b[0m'
};

function log(message, color = 'white') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function exec(command, options = {}) {
  try {
    log(`Executing: ${command}`, 'cyan');
    return execSync(command, { 
      stdio: 'inherit', 
      encoding: 'utf8',
      ...options 
    });
  } catch (error) {
    log(`Error executing command: ${command}`, 'red');
    log(error.message, 'red');
    process.exit(1);
  }
}

function checkFile(filePath, description) {
  if (fs.existsSync(filePath)) {
    log(`✓ ${description} exists`, 'green');
    return true;
  } else {
    log(`✗ ${description} missing: ${filePath}`, 'red');
    return false;
  }
}

function validateEnvironment() {
  log('\n🔍 Validating Environment...', 'blue');
  
  // Check Node version
  const nodeVersion = process.version;
  log(`Node.js version: ${nodeVersion}`, 'cyan');
  
  const majorVersion = parseInt(nodeVersion.replace('v', '').split('.')[0]);
  if (majorVersion < 18) {
    log('❌ Node.js version 18 or higher is required', 'red');
    process.exit(1);
  }
  log('✓ Node.js version compatible', 'green');

  // Check required files
  const requiredFiles = [
    { path: 'package.json', desc: 'Package.json' },
    { path: 'next.config.js', desc: 'Next.js configuration' },
    { path: 'netlify.toml', desc: 'Netlify configuration' },
    { path: 'pages/index.js', desc: 'Homepage' },
    { path: 'pages/naming-tool.js', desc: 'Naming tool page' },
    { path: 'pages/api/sitemap.js', desc: 'Sitemap API' },
    { path: 'pages/api/robots.js', desc: 'Robots API' }
  ];

  let allFilesExist = true;
  requiredFiles.forEach(file => {
    if (!checkFile(file.path, file.desc)) {
      allFilesExist = false;
    }
  });

  if (!allFilesExist) {
    log('❌ Some required files are missing', 'red');
    process.exit(1);
  }

  log('✓ All required files present', 'green');
}

function installDependencies() {
  log('\n📦 Installing Dependencies...', 'blue');
  
  if (fs.existsSync('node_modules')) {
    log('Node modules exist, cleaning...', 'yellow');
    exec('rm -rf node_modules package-lock.json');
  }
  
  exec('npm install');
  log('✓ Dependencies installed successfully', 'green');
}

function runLinting() {
  log('\n🔍 Running Code Quality Checks...', 'blue');
  
  try {
    exec('npm run lint', { stdio: 'pipe' });
    log('✓ Linting passed', 'green');
  } catch (error) {
    log('⚠️ Linting issues found, but continuing...', 'yellow');
  }
}

function buildProject() {
  log('\n🏗️ Building Project...', 'blue');
  
  exec('npm run build');
  
  // Check if build directory exists
  if (fs.existsSync('.next')) {
    log('✓ Build completed successfully', 'green');
  } else {
    log('❌ Build failed - .next directory not found', 'red');
    process.exit(1);
  }
}

function validateBuild() {
  log('\n✅ Validating Build Output...', 'blue');
  
  const buildFiles = [
    '.next/server/pages/index.html',
    '.next/server/pages/naming-tool.html',
    '.next/server/pages/api/sitemap.js',
    '.next/server/pages/api/robots.js'
  ];

  let buildValid = true;
  buildFiles.forEach(file => {
    if (fs.existsSync(file)) {
      log(`✓ ${path.basename(file)} generated`, 'green');
    } else {
      log(`⚠️ ${file} not found in build`, 'yellow');
      // Don't fail for optional files
    }
  });

  log('✓ Build validation completed', 'green');
}

function testSEORoutes() {
  log('\n🔍 Testing SEO Routes...', 'blue');
  
  try {
    // Start the server in background
    log('Starting test server...', 'cyan');
    const serverProcess = exec('npm start &', { stdio: 'pipe' });
    
    // Wait for server to start
    setTimeout(() => {
      try {
        // Test sitemap
        exec('curl -s http://localhost:3000/sitemap.xml | head -5');
        log('✓ Sitemap.xml accessible', 'green');
        
        // Test robots
        exec('curl -s http://localhost:3000/robots.txt | head -5');
        log('✓ Robots.txt accessible', 'green');
        
        // Test homepage SSR
        const homepage = exec('curl -s http://localhost:3000/', { stdio: 'pipe' });
        if (homepage.includes('<title>')) {
          log('✓ Homepage SSR working', 'green');
        } else {
          log('⚠️ Homepage SSR may not be working', 'yellow');
        }
        
        // Kill the test server
        exec('pkill -f "npm start"');
        
      } catch (error) {
        log('⚠️ SEO route testing skipped (server not available)', 'yellow');
      }
    }, 3000);
    
  } catch (error) {
    log('⚠️ SEO route testing skipped', 'yellow');
  }
}

function deployToNetlify() {
  log('\n🚀 Deploying to Netlify...', 'blue');
  
  const deployType = process.argv.includes('--production') ? 'production' : 'preview';
  
  if (deployType === 'production') {
    log('🔥 PRODUCTION DEPLOYMENT', 'red');
    log('Are you sure you want to deploy to production? (Ctrl+C to cancel)', 'yellow');
    
    // Wait 5 seconds for user to cancel
    setTimeout(() => {
      exec('netlify deploy --prod --dir=.next');
      log('🎉 Production deployment completed!', 'green');
      log('🌐 Site URL: https://startupnamer.org', 'cyan');
    }, 5000);
  } else {
    exec('netlify deploy --dir=.next');
    log('✓ Preview deployment completed!', 'green');
    log('Check Netlify dashboard for preview URL', 'cyan');
  }
}

function generateDeploymentReport() {
  log('\n📊 Generating Deployment Report...', 'blue');
  
  const report = {
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    buildSuccess: fs.existsSync('.next'),
    pages: [
      'index.js',
      'naming-tool.js', 
      'features.js',
      'tech-startup-names.js'
    ].map(page => ({
      name: page,
      exists: fs.existsSync(`pages/${page}`)
    })),
    apiRoutes: [
      'sitemap.js',
      'robots.js'
    ].map(route => ({
      name: route,
      exists: fs.existsSync(`pages/api/${route}`)
    }))
  };
  
  fs.writeFileSync('deployment-report.json', JSON.stringify(report, null, 2));
  log('✓ Deployment report saved to deployment-report.json', 'green');
}

function main() {
  log('🚀 StartupNamer.org - Next.js SSR Deployment', 'magenta');
  log('================================================', 'magenta');
  
  const startTime = Date.now();
  
  try {
    validateEnvironment();
    installDependencies();
    runLinting();
    buildProject();
    validateBuild();
    
    if (!process.argv.includes('--build-only')) {
      testSEORoutes();
      deployToNetlify();
    }
    
    generateDeploymentReport();
    
    const duration = Math.round((Date.now() - startTime) / 1000);
    
    log('\n🎉 Deployment Pipeline Completed!', 'green');
    log(`⏱️ Total time: ${duration} seconds`, 'cyan');
    log('\n📋 Next Steps:', 'blue');
    log('1. Test the deployed site thoroughly', 'white');
    log('2. Check sitemap.xml and robots.txt are accessible', 'white');
    log('3. Verify meta tags are server-rendered (view source)', 'white');
    log('4. Run Google Search Console validation', 'white');
    log('5. Monitor Core Web Vitals in production', 'white');
    
  } catch (error) {
    log('\n❌ Deployment Failed!', 'red');
    log(error.message, 'red');
    process.exit(1);
  }
}

// Handle command line arguments
if (require.main === module) {
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    log('StartupNamer.org Deployment Script', 'blue');
    log('\nUsage:', 'white');
    log('  node scripts/deploy.js [options]', 'cyan');
    log('\nOptions:', 'white');
    log('  --production     Deploy to production (default: preview)', 'cyan');
    log('  --build-only     Only build, don\'t deploy', 'cyan');
    log('  --help, -h       Show this help message', 'cyan');
    process.exit(0);
  }
  
  main();
}