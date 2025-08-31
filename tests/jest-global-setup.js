// Jest global setup
module.exports = async () => {
  console.log('🧪 Setting up Jest test environment...');
  
  // Set up global test environment variables
  process.env.NODE_ENV = 'test';
  process.env.PUBLIC_URL = '';
  process.env.REACT_APP_API_URL = 'http://localhost:3001';
  
  // Suppress console warnings in tests unless explicitly testing them
  const originalConsoleWarn = console.warn;
  console.warn = (...args) => {
    const message = args[0];
    if (
      typeof message === 'string' &&
      (message.includes('React Router') ||
       message.includes('deprecated') ||
       message.includes('componentWillReceiveProps'))
    ) {
      return;
    }
    originalConsoleWarn(...args);
  };
  
  console.log('✅ Jest test environment setup complete');
};