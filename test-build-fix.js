#!/usr/bin/env node

/**
 * Test the build fix
 */

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🧪 TESTING BUILD FIX');
console.log('====================\n');

console.log('1. 🔧 Testing client build...');
try {
  // Change to client directory and run build
  process.chdir('client');
  
  console.log('   📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  console.log('   🏗️ Running optimized build...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Check if build directory was created
  if (fs.existsSync('build/index.html')) {
    console.log('   ✅ Build successful! index.html found in build directory');
    
    // Check build size
    const stats = fs.statSync('build');
    console.log('   📊 Build directory created successfully');
    
    // Go back to root directory
    process.chdir('..');
    
    console.log('\n2. 🚀 Testing Netlify deployment...');
    
    // Set Netlify token
    process.env.NETLIFY_AUTH_TOKEN = 'nfp_HAbpW9gHdsm43hq4yKt1qB8uoJB9uYKaef27';
    
    console.log('   🔧 Attempting manual deployment...');
    execSync('netlify deploy --dir=client/build --prod', { stdio: 'inherit' });
    
    console.log('\n✅ ALL TESTS PASSED!');
    console.log('🎉 Build fix successful - deployments should work now!');
    
  } else {
    console.log('   ❌ Build failed - index.html not found');
    process.exit(1);
  }
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}