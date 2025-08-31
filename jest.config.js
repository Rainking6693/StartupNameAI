module.exports = {
  // Test environment
  testEnvironment: 'jsdom',
  
  // Test file patterns
  testMatch: [
    '<rootDir>/client/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/client/src/**/*.(test|spec).{js,jsx,ts,tsx}',
    '<rootDir>/tests/unit/**/*.(test|spec).{js,jsx,ts,tsx}',
    '<rootDir>/tests/integration/**/*.(test|spec).{js,jsx,ts,tsx}'
  ],
  
  // Setup files
  setupFilesAfterEnv: [
    '<rootDir>/client/src/setupTests.js'
  ],
  
  // Module name mapping for assets and CSS
  moduleNameMapping: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(gif|ttf|eot|svg|png|jpg|jpeg)$': '<rootDir>/tests/__mocks__/fileMock.js'
  },
  
  // Transform configuration
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        ['@babel/preset-react', { runtime: 'automatic' }]
      ]
    }]
  },
  
  // Coverage configuration
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json-summary'],
  
  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85
    }
  },
  
  // Files to collect coverage from
  collectCoverageFrom: [
    'client/src/**/*.{js,jsx,ts,tsx}',
    '!client/src/**/*.d.ts',
    '!client/src/index.js',
    '!client/src/serviceWorker.js',
    '!client/src/**/*.stories.{js,jsx,ts,tsx}',
    '!client/src/**/__tests__/**',
    '!client/src/**/node_modules/**'
  ],
  
  // Module directories
  moduleDirectories: ['node_modules', '<rootDir>/client/src'],
  
  // File extensions to consider
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
  
  // Test results processor
  testResultsProcessor: 'jest-sonar-reporter',
  
  // Clear mocks between tests
  clearMocks: true,
  
  // Restore mocks after each test
  restoreMocks: true,
  
  // Verbose output
  verbose: true,
  
  // Max concurrent workers
  maxWorkers: '50%',
  
  // Test timeout
  testTimeout: 10000,
  
  // Global setup and teardown
  globalSetup: '<rootDir>/tests/jest-global-setup.js',
  globalTeardown: '<rootDir>/tests/jest-global-teardown.js',
  
  // Watch plugins
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname'
  ],
  
  // Transform ignore patterns
  transformIgnorePatterns: [
    'node_modules/(?!(axios|framer-motion|lucide-react|@stripe)/)'
  ]
};