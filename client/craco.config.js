const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // NUCLEAR OPTION: Completely disable terser and all minification
      if (env === 'production') {
        // Remove all optimization including terser
        webpackConfig.optimization.minimize = false;
        webpackConfig.optimization.minimizer = [];
        
        // Remove terser-webpack-plugin completely
        webpackConfig.optimization.minimizer = webpackConfig.optimization.minimizer.filter(
          plugin => plugin.constructor.name !== 'TerserPlugin'
        );
        
        // Disable source maps to avoid any terser-related issues
        webpackConfig.devtool = false;
        
        // Set mode to development to avoid any production optimizations
        webpackConfig.mode = 'development';
        
        // Remove any splitChunks optimization that might trigger terser
        webpackConfig.optimization.splitChunks = {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false
          }
        };
        
        console.log('🚨 NUCLEAR OPTION ACTIVATED: Terser completely disabled!');
        console.log('📦 Build will be larger but WILL WORK!');
      }
      
      return webpackConfig;
    }
  },
  
  // Additional overrides to ensure no minification
  babel: {
    plugins: [
      // Ensure babel doesn't try to optimize either
    ]
  }
};