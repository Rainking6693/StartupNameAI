const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // Fix for terser-webpack-plugin issues
      if (env === 'production') {
        // Remove problematic terser plugin
        webpackConfig.optimization.minimizer = webpackConfig.optimization.minimizer.filter(
          plugin => plugin.constructor.name !== 'TerserPlugin'
        );
        
        // Add alternative minification
        const TerserPlugin = require('terser-webpack-plugin');
        webpackConfig.optimization.minimizer.push(
          new TerserPlugin({
            terserOptions: {
              parse: {
                ecma: 8,
              },
              compress: {
                ecma: 5,
                warnings: false,
                comparisons: false,
                inline: 2,
              },
              mangle: {
                safari10: true,
              },
              output: {
                ecma: 5,
                comments: false,
                ascii_only: true,
              },
            },
            parallel: true,
            cache: true,
            sourceMap: false,
          })
        );
      }
      
      return webpackConfig;
    },
  },
};
