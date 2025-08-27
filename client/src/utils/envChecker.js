class EnvironmentChecker {
  static checkOpenAIKey() {
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    
    if (!apiKey) {
      console.warn('⚠️ OpenAI API key not found in environment variables');
      return false;
    }
    
    if (!apiKey.startsWith('sk-')) {
      console.warn('⚠️ Invalid OpenAI API key format');
      return false;
    }
    
    console.log('✅ OpenAI API key configured correctly');
    return true;
  }
  
  static getEnvironmentInfo() {
    return {
      hasOpenAIKey: !!process.env.REACT_APP_OPENAI_API_KEY,
      environment: process.env.REACT_APP_ENVIRONMENT || 'production',
      nodeEnv: process.env.NODE_ENV,
      debugMode: process.env.REACT_APP_DEBUG_MODE === 'true'
    };
  }
}

export default EnvironmentChecker;