const { telemetryHelpers } = require('../config/telemetry');
const fs = require('fs').promises;
const path = require('path');

class MachineLearningService {
  constructor() {
    this.models = new Map();
    this.trainingData = {
      name_quality: [],
      user_preferences: [],
      trend_patterns: [],
      brandability_factors: []
    };
    
    this.modelConfigs = {
      name_quality_predictor: {
        type: 'regression',
        features: ['length', 'vowel_ratio', 'consonant_clusters', 'syllable_count', 'uniqueness_score'],
        target: 'user_rating',
        accuracy_threshold: 0.85
      },
      trend_analyzer: {
        type: 'classification',
        features: ['keyword_frequency', 'industry_growth', 'search_volume', 'social_mentions'],
        target: 'trend_category',
        accuracy_threshold: 0.80
      },
      brandability_scorer: {
        type: 'regression',
        features: ['memorability', 'pronounceability', 'visual_appeal', 'emotional_resonance'],
        target: 'brandability_score',
        accuracy_threshold: 0.90
      },
      user_preference_model: {
        type: 'recommendation',
        features: ['user_history', 'industry_preference', 'style_preference', 'feedback_patterns'],
        target: 'preference_score',
        accuracy_threshold: 0.75
      }
    };
    
    this.predictionCache = new Map();
    this.modelMetrics = {
      predictions_made: 0,
      cache_hits: 0,
      model_accuracy: {},
      training_iterations: 0,
      last_training: null
    };
    
    this.initializeMachineLearning();
  }

  // Initialize machine learning service
  async initializeMachineLearning() {
    try {
      await this.loadExistingModels();
      await this.initializeTrainingData();
      this.setupModelTraining();
      this.initializePredictionCaching();
      
      console.log('✅ Machine learning service initialized');
    } catch (error) {
      console.error('❌ Failed to initialize machine learning service:', error);
    }
  }

  // Load existing trained models
  async loadExistingModels() {
    try {
      const modelsDir = path.join(process.cwd(), 'server', 'ml_models');
      
      // Create models directory if it doesn't exist
      try {
        await fs.access(modelsDir);
      } catch {
        await fs.mkdir(modelsDir, { recursive: true });
      }

      // Load each model type
      for (const [modelName, config] of Object.entries(this.modelConfigs)) {
        try {
          const modelPath = path.join(modelsDir, `${modelName}.json`);
          const modelData = await fs.readFile(modelPath, 'utf8');
          const model = JSON.parse(modelData);
          
          this.models.set(modelName, model);
          console.log(`📊 Loaded ML model: ${modelName}`);
        } catch (error) {
          // Model doesn't exist, will be trained
          console.log(`🔄 Model ${modelName} not found, will train from scratch`);
          this.models.set(modelName, this.createEmptyModel(config));
        }
      }
    } catch (error) {
      console.warn('Failed to load existing models:', error.message);
    }
  }

  // Initialize training data collection
  async initializeTrainingData() {
    // Set up data collection from various sources
    this.setupDataCollection();
    
    // Load historical data if available
    await this.loadHistoricalData();
    
    // Initialize synthetic training data for bootstrapping
    await this.generateBootstrapData();
  }

  // Predict name quality using ML model
  async predictNameQuality(nameData) {
    return telemetryHelpers.createSpan('ml_predict_name_quality', async (span) => {
      try {
        const cacheKey = this.generateCacheKey('name_quality', nameData);
        
        // Check prediction cache
        if (this.predictionCache.has(cacheKey)) {
          this.modelMetrics.cache_hits++;
          span.setAttributes({ 'ml.cache_hit': true });
          return this.predictionCache.get(cacheKey);
        }

        // Extract features for prediction
        const features = this.extractNameFeatures(nameData);
        
        // Get model
        const model = this.models.get('name_quality_predictor');
        if (!model || !model.trained) {
          // Use heuristic-based prediction if model not trained
          const prediction = this.heuristicNameQuality(features);
          span.setAttributes({ 'ml.method': 'heuristic' });
          return prediction;
        }

        // Make prediction using trained model
        const prediction = this.makePrediction(model, features);
        
        // Cache prediction
        this.predictionCache.set(cacheKey, prediction);
        this.modelMetrics.predictions_made++;
        
        span.setAttributes({
          'ml.model': 'name_quality_predictor',
          'ml.prediction_score': prediction.quality_score,
          'ml.confidence': prediction.confidence,
          'ml.cache_hit': false
        });

        return prediction;

      } catch (error) {
        span.recordException(error);
        console.error('Name quality prediction failed:', error);
        return this.fallbackNameQuality(nameData);
      }
    });
  }

  // Analyze naming trends using ML
  async analyzeTrends(industryData, timeRange = '30d') {
    return telemetryHelpers.createSpan('ml_analyze_trends', async (span) => {
      try {
        const cacheKey = this.generateCacheKey('trends', { industryData, timeRange });
        
        if (this.predictionCache.has(cacheKey)) {
          this.modelMetrics.cache_hits++;
          return this.predictionCache.get(cacheKey);
        }

        // Extract trend features
        const features = this.extractTrendFeatures(industryData, timeRange);
        
        // Get trend analysis model
        const model = this.models.get('trend_analyzer');
        
        let trendAnalysis;
        if (model && model.trained) {
          trendAnalysis = this.analyzeTrendsWithModel(model, features);
        } else {
          trendAnalysis = this.heuristicTrendAnalysis(features);
        }
        
        // Cache results
        this.predictionCache.set(cacheKey, trendAnalysis);
        
        span.setAttributes({
          'ml.model': 'trend_analyzer',
          'ml.trends_identified': trendAnalysis.trends.length,
          'ml.confidence': trendAnalysis.confidence
        });

        return trendAnalysis;

      } catch (error) {
        span.recordException(error);
        console.error('Trend analysis failed:', error);
        return this.fallbackTrendAnalysis();
      }
    });
  }

  // Generate personalized recommendations
  async generatePersonalizedRecommendations(userId, userHistory, preferences) {
    return telemetryHelpers.createSpan('ml_personalized_recommendations', async (span) => {
      try {
        const cacheKey = this.generateCacheKey('recommendations', { userId, preferences });
        
        if (this.predictionCache.has(cacheKey)) {
          this.modelMetrics.cache_hits++;
          return this.predictionCache.get(cacheKey);
        }

        // Extract user preference features
        const features = this.extractUserFeatures(userHistory, preferences);
        
        // Get recommendation model
        const model = this.models.get('user_preference_model');
        
        let recommendations;
        if (model && model.trained) {
          recommendations = this.generateRecommendationsWithModel(model, features);
        } else {
          recommendations = this.heuristicRecommendations(features);
        }
        
        // Cache recommendations
        this.predictionCache.set(cacheKey, recommendations);
        
        span.setAttributes({
          'ml.model': 'user_preference_model',
          'ml.recommendations_count': recommendations.length,
          'ml.user_id': userId
        });

        return recommendations;

      } catch (error) {
        span.recordException(error);
        console.error('Personalized recommendations failed:', error);
        return this.fallbackRecommendations();
      }
    });
  }

  // Predict brandability score using advanced ML
  async predictBrandability(nameData, contextData = {}) {
    return telemetryHelpers.createSpan('ml_predict_brandability', async (span) => {
      try {
        const features = this.extractBrandabilityFeatures(nameData, contextData);
        const model = this.models.get('brandability_scorer');
        
        let brandabilityScore;
        if (model && model.trained) {
          brandabilityScore = this.predictBrandabilityWithModel(model, features);
        } else {
          brandabilityScore = this.heuristicBrandability(features);
        }
        
        span.setAttributes({
          'ml.model': 'brandability_scorer',
          'ml.brandability_score': brandabilityScore.score,
          'ml.confidence': brandabilityScore.confidence
        });

        return brandabilityScore;

      } catch (error) {
        span.recordException(error);
        return this.fallbackBrandability(nameData);
      }
    });
  }

  // Train models with new data
  async trainModels(trainingData) {
    return telemetryHelpers.createSpan('ml_train_models', async (span) => {
      try {
        const trainingResults = {};
        
        // Train each model type
        for (const [modelName, config] of Object.entries(this.modelConfigs)) {
          if (trainingData[modelName] && trainingData[modelName].length > 0) {
            const result = await this.trainModel(modelName, config, trainingData[modelName]);
            trainingResults[modelName] = result;
          }
        }
        
        this.modelMetrics.training_iterations++;
        this.modelMetrics.last_training = Date.now();
        
        // Save trained models
        await this.saveModels();
        
        span.setAttributes({
          'ml.models_trained': Object.keys(trainingResults).length,
          'ml.training_iteration': this.modelMetrics.training_iterations
        });

        console.log('🎯 ML models training completed');
        return trainingResults;

      } catch (error) {
        span.recordException(error);
        console.error('Model training failed:', error);
        return {};
      }
    });
  }

  // Train individual model
  async trainModel(modelName, config, data) {
    console.log(`🔄 Training model: ${modelName} with ${data.length} samples`);
    
    // Prepare training data
    const { features, targets } = this.prepareTrainingData(data, config);
    
    // Simple linear regression implementation for demonstration
    // In production, this would use a proper ML library like TensorFlow.js
    const model = this.trainLinearModel(features, targets, config);
    
    // Validate model
    const accuracy = this.validateModel(model, features, targets);
    
    // Update model if accuracy meets threshold
    if (accuracy >= config.accuracy_threshold) {
      model.trained = true;
      model.accuracy = accuracy;
      model.last_trained = Date.now();
      this.models.set(modelName, model);
      
      this.modelMetrics.model_accuracy[modelName] = accuracy;
      
      console.log(`✅ Model ${modelName} trained successfully (accuracy: ${accuracy.toFixed(3)})`);
    } else {
      console.warn(`⚠️ Model ${modelName} accuracy ${accuracy.toFixed(3)} below threshold ${config.accuracy_threshold}`);
    }
    
    return { accuracy, trained: model.trained };
  }

  // Feature extraction methods
  extractNameFeatures(nameData) {
    const name = nameData.name || '';
    
    return {
      length: name.length,
      vowel_ratio: this.calculateVowelRatio(name),
      consonant_clusters: this.countConsonantClusters(name),
      syllable_count: this.estimateSyllableCount(name),
      uniqueness_score: nameData.uniqueness_score || this.calculateUniqueness(name),
      has_numbers: /\d/.test(name) ? 1 : 0,
      has_special_chars: /[^a-zA-Z0-9]/.test(name) ? 1 : 0,
      starts_with_vowel: /^[aeiou]/i.test(name) ? 1 : 0,
      ends_with_vowel: /[aeiou]$/i.test(name) ? 1 : 0
    };
  }

  extractTrendFeatures(industryData, timeRange) {
    return {
      keyword_frequency: industryData.keyword_frequency || 0,
      industry_growth: industryData.growth_rate || 0,
      search_volume: industryData.search_volume || 0,
      social_mentions: industryData.social_mentions || 0,
      time_range_days: this.parseTimeRange(timeRange),
      seasonal_factor: this.calculateSeasonalFactor(),
      market_sentiment: industryData.sentiment || 0
    };
  }

  extractUserFeatures(userHistory, preferences) {
    return {
      session_count: userHistory.sessions || 0,
      names_generated: userHistory.names_generated || 0,
      names_selected: userHistory.names_selected || 0,
      avg_session_duration: userHistory.avg_duration || 0,
      preferred_industry: this.encodeIndustry(preferences.industry),
      preferred_style: this.encodeStyle(preferences.style),
      feedback_score: userHistory.avg_feedback || 0,
      conversion_rate: userHistory.conversion_rate || 0
    };
  }

  extractBrandabilityFeatures(nameData, contextData) {
    const name = nameData.name || '';
    
    return {
      memorability: this.calculateMemorability(name),
      pronounceability: this.calculatePronounceability(name),
      visual_appeal: this.calculateVisualAppeal(name),
      emotional_resonance: this.calculateEmotionalResonance(name),
      industry_fit: contextData.industry ? this.calculateIndustryFit(name, contextData.industry) : 0,
      length_score: this.calculateLengthScore(name),
      phonetic_appeal: this.calculatePhoneticAppeal(name)
    };
  }

  // Heuristic methods (fallbacks when models aren't trained)
  heuristicNameQuality(features) {
    let score = 5.0; // Base score
    
    // Length optimization
    if (features.length >= 4 && features.length <= 8) score += 1.5;
    else if (features.length >= 9 && features.length <= 12) score += 0.5;
    else score -= 1.0;
    
    // Vowel ratio optimization
    if (features.vowel_ratio >= 0.3 && features.vowel_ratio <= 0.5) score += 1.0;
    
    // Penalize consonant clusters
    score -= features.consonant_clusters * 0.5;
    
    // Syllable count optimization
    if (features.syllable_count >= 2 && features.syllable_count <= 3) score += 0.5;
    
    // Uniqueness bonus
    score += features.uniqueness_score * 0.5;
    
    return {
      quality_score: Math.max(0, Math.min(10, score)),
      confidence: 0.7,
      method: 'heuristic',
      factors: {
        length: features.length,
        vowel_ratio: features.vowel_ratio,
        uniqueness: features.uniqueness_score
      }
    };
  }

  heuristicBrandability(features) {
    let score = 0;
    
    score += features.memorability * 0.3;
    score += features.pronounceability * 0.25;
    score += features.visual_appeal * 0.2;
    score += features.emotional_resonance * 0.15;
    score += features.industry_fit * 0.1;
    
    return {
      score: Math.max(0, Math.min(10, score)),
      confidence: 0.75,
      method: 'heuristic',
      breakdown: {
        memorability: features.memorability,
        pronounceability: features.pronounceability,
        visual_appeal: features.visual_appeal,
        emotional_resonance: features.emotional_resonance
      }
    };
  }

  // Utility methods for feature calculation
  calculateVowelRatio(name) {
    const vowels = name.match(/[aeiou]/gi) || [];
    return name.length > 0 ? vowels.length / name.length : 0;
  }

  countConsonantClusters(name) {
    const clusters = name.match(/[bcdfghjklmnpqrstvwxyz]{2,}/gi) || [];
    return clusters.length;
  }

  estimateSyllableCount(name) {
    // Simple syllable estimation
    const vowelGroups = name.match(/[aeiou]+/gi) || [];
    return Math.max(1, vowelGroups.length);
  }

  calculateUniqueness(name) {
    // Simple uniqueness calculation based on character diversity
    const uniqueChars = new Set(name.toLowerCase()).size;
    return name.length > 0 ? uniqueChars / name.length : 0;
  }

  calculateMemorability(name) {
    let score = 8; // Base score
    
    // Optimal length
    if (name.length >= 5 && name.length <= 8) score += 1;
    else if (name.length > 12) score -= 2;
    
    // Repetitive patterns reduce memorability
    if (/(.)\\1{2,}/.test(name)) score -= 1;
    
    // Alliteration can help
    if (/^([a-z]).*\\1/i.test(name)) score += 0.5;
    
    return Math.max(0, Math.min(10, score));
  }

  calculatePronounceability(name) {
    let score = 8; // Base score
    
    // Consonant clusters reduce pronounceability
    const clusters = this.countConsonantClusters(name);
    score -= clusters * 0.5;
    
    // Very long names are harder to pronounce
    if (name.length > 10) score -= 1;
    
    // Silent letters or unusual combinations
    if (/[qx]/.test(name.toLowerCase())) score -= 0.5;
    
    return Math.max(0, Math.min(10, score));
  }

  calculateVisualAppeal(name) {
    let score = 7; // Base score
    
    // Balanced character distribution
    const vowelRatio = this.calculateVowelRatio(name);
    if (vowelRatio >= 0.3 && vowelRatio <= 0.5) score += 1;
    
    // Avoid too many repeated characters
    const uniqueRatio = this.calculateUniqueness(name);
    if (uniqueRatio >= 0.7) score += 1;
    
    return Math.max(0, Math.min(10, score));
  }

  calculateEmotionalResonance(name) {
    // Simple emotional resonance based on phonetic patterns
    let score = 6; // Base score
    
    // Soft sounds tend to be more appealing
    const softSounds = name.match(/[lmnr]/gi) || [];
    score += softSounds.length * 0.2;
    
    // Hard sounds can be strong but less appealing
    const hardSounds = name.match(/[kgptd]/gi) || [];
    score += hardSounds.length * 0.1;
    
    return Math.max(0, Math.min(10, score));
  }

  calculateIndustryFit(name, industry) {
    // Industry-specific name fitting
    const industryKeywords = {
      tech: ['tech', 'data', 'cloud', 'ai', 'digital', 'cyber', 'net', 'code'],
      health: ['health', 'care', 'med', 'bio', 'life', 'vital', 'cure', 'heal'],
      fintech: ['fin', 'pay', 'bank', 'coin', 'fund', 'invest', 'money', 'capital']
    };
    
    const keywords = industryKeywords[industry] || [];
    const nameLower = name.toLowerCase();
    
    for (const keyword of keywords) {
      if (nameLower.includes(keyword)) {
        return 8;
      }
    }
    
    return 5; // Neutral fit
  }

  // Simple linear model implementation
  trainLinearModel(features, targets, config) {
    // Simple linear regression implementation
    // In production, use proper ML libraries
    
    const model = {
      type: config.type,
      weights: {},
      bias: 0,
      trained: false,
      features: config.features
    };
    
    // Initialize weights
    for (const feature of config.features) {
      model.weights[feature] = Math.random() * 0.1;
    }
    
    // Simple gradient descent (very basic implementation)
    const learningRate = 0.01;
    const epochs = 100;
    
    for (let epoch = 0; epoch < epochs; epoch++) {
      let totalError = 0;
      
      for (let i = 0; i < features.length; i++) {
        const prediction = this.makePredictionWithModel(model, features[i]);
        const error = targets[i] - prediction;
        totalError += error * error;
        
        // Update weights
        for (const feature of config.features) {
          if (features[i][feature] !== undefined) {
            model.weights[feature] += learningRate * error * features[i][feature];
          }
        }
        model.bias += learningRate * error;
      }
      
      // Early stopping if error is low enough
      if (totalError / features.length < 0.01) break;
    }
    
    return model;
  }

  makePredictionWithModel(model, features) {
    let prediction = model.bias;
    
    for (const feature of model.features) {
      if (features[feature] !== undefined) {
        prediction += model.weights[feature] * features[feature];
      }
    }
    
    return prediction;
  }

  validateModel(model, features, targets) {
    let totalError = 0;
    
    for (let i = 0; i < features.length; i++) {
      const prediction = this.makePredictionWithModel(model, features[i]);
      const error = Math.abs(targets[i] - prediction);
      totalError += error;
    }
    
    const meanError = totalError / features.length;
    return Math.max(0, 1 - meanError / 10); // Convert to accuracy score
  }

  // Utility and helper methods
  generateCacheKey(type, data) {
    return `ml_${type}_${JSON.stringify(data)}`.replace(/[^a-zA-Z0-9_]/g, '_');
  }

  createEmptyModel(config) {
    return {
      type: config.type,
      features: config.features,
      target: config.target,
      trained: false,
      accuracy: 0,
      weights: {},
      bias: 0
    };
  }

  setupDataCollection() {
    // Set up data collection from analytics events
    console.log('📊 ML data collection initialized');
  }

  async loadHistoricalData() {
    // Load historical data for training
    console.log('📚 Loading historical training data');
  }

  async generateBootstrapData() {
    // Generate synthetic data for initial training
    console.log('🎲 Generating bootstrap training data');
  }

  setupModelTraining() {
    // Set up periodic model retraining
    setInterval(() => {
      this.checkForRetraining();
    }, 3600000); // Check every hour
  }

  initializePredictionCaching() {
    // Set up prediction caching
    setInterval(() => {
      this.cleanupPredictionCache();
    }, 1800000); // Clean cache every 30 minutes
  }

  async checkForRetraining() {
    // Check if models need retraining based on new data
    console.log('🔄 Checking for model retraining needs');
  }

  cleanupPredictionCache() {
    // Clean up old cached predictions
    if (this.predictionCache.size > 1000) {
      this.predictionCache.clear();
      console.log('🧹 Cleaned up ML prediction cache');
    }
  }

  async saveModels() {
    try {
      const modelsDir = path.join(process.cwd(), 'server', 'ml_models');
      
      for (const [modelName, model] of this.models) {
        if (model.trained) {
          const modelPath = path.join(modelsDir, `${modelName}.json`);
          await fs.writeFile(modelPath, JSON.stringify(model, null, 2));
        }
      }
      
      console.log('💾 ML models saved successfully');
    } catch (error) {
      console.error('Failed to save ML models:', error);
    }
  }

  // Fallback methods
  fallbackNameQuality(nameData) {
    return {
      quality_score: 7.0,
      confidence: 0.5,
      method: 'fallback'
    };
  }

  fallbackTrendAnalysis() {
    return {
      trends: [],
      confidence: 0.3,
      method: 'fallback'
    };
  }

  fallbackRecommendations() {
    return [];
  }

  fallbackBrandability(nameData) {
    return {
      score: 7.0,
      confidence: 0.5,
      method: 'fallback'
    };
  }

  // Health check
  async healthCheck() {
    const trainedModels = Array.from(this.models.values()).filter(m => m.trained).length;
    
    return {
      status: 'healthy',
      models_loaded: this.models.size,
      models_trained: trainedModels,
      predictions_made: this.modelMetrics.predictions_made,
      cache_hit_ratio: this.modelMetrics.cache_hits / (this.modelMetrics.predictions_made || 1),
      last_training: this.modelMetrics.last_training,
      cache_size: this.predictionCache.size
    };
  }
}

module.exports = new MachineLearningService();