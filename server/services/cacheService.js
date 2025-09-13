const Redis = require('ioredis');
const { telemetryHelpers } = require('../config/telemetry');

class CacheService {
  constructor() {
    this.redis = null;
    this.isConnected = false;
    this.defaultTTL = 3600; // 1 hour
    this.maxRetries = 3;
    this.retryDelay = 1000;
    
    this.initializeRedis();
  }

  // Initialize Redis/Valkey connection
  initializeRedis() {
    try {
      const redisConfig = {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD,
        db: process.env.REDIS_DB || 0,
        retryDelayOnFailover: 100,
        maxRetriesPerRequest: 3,
        lazyConnect: true,
        keepAlive: 30000,
        family: 4,
        keyPrefix: 'startup-namer:',
      };

      // Use Redis URL if provided (for cloud deployments)
      if (process.env.REDIS_URL) {
        this.redis = new Redis(process.env.REDIS_URL, {
          ...redisConfig,
          keyPrefix: 'startup-namer:',
        });
      } else {
        this.redis = new Redis(redisConfig);
      }

      this.redis.on('connect', () => {
        console.log('✅ Redis/Valkey connected successfully');
        this.isConnected = true;
      });

      this.redis.on('error', (error) => {
        console.warn('⚠️ Redis/Valkey connection error:', error.message);
        this.isConnected = false;
      });

      this.redis.on('close', () => {
        console.log('🔌 Redis/Valkey connection closed');
        this.isConnected = false;
      });

      this.redis.on('reconnecting', () => {
        console.log('🔄 Redis/Valkey reconnecting...');
      });

    } catch (error) {
      console.error('❌ Failed to initialize Redis/Valkey:', error);
      this.isConnected = false;
    }
  }

  // Check if cache is available
  isAvailable() {
    return this.isConnected && this.redis;
  }

  // Generate cache key with namespace
  generateKey(namespace, identifier) {
    return `${namespace}:${identifier}`;
  }

  // Set cache with telemetry
  async set(key, value, ttl = this.defaultTTL) {
    if (!this.isAvailable()) {
      return false;
    }

    return telemetryHelpers.createSpan('cache_set', async (span) => {
      try {
        span.setAttributes({
          'cache.operation': 'set',
          'cache.key': key,
          'cache.ttl': ttl
        });

        const serializedValue = JSON.stringify({
          data: value,
          timestamp: Date.now(),
          ttl: ttl
        });

        await this.redis.setex(key, ttl, serializedValue);
        
        span.setAttributes({ 'cache.success': true });
        return true;

      } catch (error) {
        span.recordException(error);
        console.warn(`Cache set failed for key ${key}:`, error.message);
        return false;
      }
    });
  }

  // Get cache with telemetry
  async get(key) {
    if (!this.isAvailable()) {
      return null;
    }

    return telemetryHelpers.createSpan('cache_get', async (span) => {
      try {
        span.setAttributes({
          'cache.operation': 'get',
          'cache.key': key
        });

        const cached = await this.redis.get(key);
        
        if (!cached) {
          span.setAttributes({ 'cache.hit': false });
          return null;
        }

        const parsed = JSON.parse(cached);
        span.setAttributes({ 
          'cache.hit': true,
          'cache.age': Date.now() - parsed.timestamp
        });

        return parsed.data;

      } catch (error) {
        span.recordException(error);
        console.warn(`Cache get failed for key ${key}:`, error.message);
        return null;
      }
    });
  }

  // Delete cache entry
  async delete(key) {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      await this.redis.del(key);
      return true;
    } catch (error) {
      console.warn(`Cache delete failed for key ${key}:`, error.message);
      return false;
    }
  }

  // Cache name generation results
  async cacheNameGeneration(params, names) {
    const key = this.generateKey('names', this.hashParams(params));
    return await this.set(key, names, 3600); // 1 hour TTL
  }

  // Get cached name generation results
  async getCachedNameGeneration(params) {
    const key = this.generateKey('names', this.hashParams(params));
    return await this.get(key);
  }

  // Cache domain check results
  async cacheDomainCheck(domain, result) {
    const key = this.generateKey('domain', domain.toLowerCase());
    return await this.set(key, result, 1800); // 30 minutes TTL
  }

  // Get cached domain check
  async getCachedDomainCheck(domain) {
    const key = this.generateKey('domain', domain.toLowerCase());
    return await this.get(key);
  }

  // Cache AI response to reduce costs
  async cacheAIResponse(prompt, response) {
    const key = this.generateKey('ai', this.hashString(prompt));
    return await this.set(key, response, 7200); // 2 hours TTL
  }

  // Get cached AI response
  async getCachedAIResponse(prompt) {
    const key = this.generateKey('ai', this.hashString(prompt));
    return await this.get(key);
  }

  // Cache user session data
  async cacheUserSession(sessionId, userData) {
    const key = this.generateKey('session', sessionId);
    return await this.set(key, userData, 86400); // 24 hours TTL
  }

  // Get cached user session
  async getCachedUserSession(sessionId) {
    const key = this.generateKey('session', sessionId);
    return await this.get(key);
  }

  // Cache API rate limit data
  async setRateLimit(identifier, count, windowMs) {
    const key = this.generateKey('ratelimit', identifier);
    const ttl = Math.ceil(windowMs / 1000);
    
    try {
      await this.redis.setex(key, ttl, count);
      return true;
    } catch (error) {
      console.warn(`Rate limit cache failed for ${identifier}:`, error.message);
      return false;
    }
  }

  // Get rate limit data
  async getRateLimit(identifier) {
    const key = this.generateKey('ratelimit', identifier);
    
    try {
      const count = await this.redis.get(key);
      return count ? parseInt(count, 10) : 0;
    } catch (error) {
      console.warn(`Rate limit get failed for ${identifier}:`, error.message);
      return 0;
    }
  }

  // Increment rate limit counter
  async incrementRateLimit(identifier, windowMs) {
    const key = this.generateKey('ratelimit', identifier);
    const ttl = Math.ceil(windowMs / 1000);
    
    try {
      const multi = this.redis.multi();
      multi.incr(key);
      multi.expire(key, ttl);
      const results = await multi.exec();
      
      return results[0][1]; // Return the incremented count
    } catch (error) {
      console.warn(`Rate limit increment failed for ${identifier}:`, error.message);
      return 1;
    }
  }

  // Cache popular names for quick access
  async cachePopularNames(industry, names) {
    const key = this.generateKey('popular', industry);
    return await this.set(key, names, 21600); // 6 hours TTL
  }

  // Get popular names
  async getPopularNames(industry) {
    const key = this.generateKey('popular', industry);
    return await this.get(key);
  }

  // Cache industry patterns
  async cacheIndustryPatterns(industry, patterns) {
    const key = this.generateKey('patterns', industry);
    return await this.set(key, patterns, 43200); // 12 hours TTL
  }

  // Get industry patterns
  async getIndustryPatterns(industry) {
    const key = this.generateKey('patterns', industry);
    return await this.get(key);
  }

  // Batch operations for efficiency
  async mget(keys) {
    if (!this.isAvailable()) {
      return [];
    }

    try {
      const results = await this.redis.mget(keys);
      return results.map(result => {
        if (!result) return null;
        try {
          const parsed = JSON.parse(result);
          return parsed.data;
        } catch {
          return null;
        }
      });
    } catch (error) {
      console.warn('Batch get failed:', error.message);
      return new Array(keys.length).fill(null);
    }
  }

  async mset(keyValuePairs, ttl = this.defaultTTL) {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      const multi = this.redis.multi();
      
      for (const [key, value] of keyValuePairs) {
        const serializedValue = JSON.stringify({
          data: value,
          timestamp: Date.now(),
          ttl: ttl
        });
        multi.setex(key, ttl, serializedValue);
      }
      
      await multi.exec();
      return true;
    } catch (error) {
      console.warn('Batch set failed:', error.message);
      return false;
    }
  }

  // Clear cache by pattern
  async clearPattern(pattern) {
    if (!this.isAvailable()) {
      return 0;
    }

    try {
      const keys = await this.redis.keys(`startup-namer:${pattern}`);
      if (keys.length === 0) return 0;
      
      await this.redis.del(...keys);
      return keys.length;
    } catch (error) {
      console.warn(`Clear pattern failed for ${pattern}:`, error.message);
      return 0;
    }
  }

  // Get cache statistics
  async getStats() {
    if (!this.isAvailable()) {
      return null;
    }

    try {
      const info = await this.redis.info('memory');
      const keyspace = await this.redis.info('keyspace');
      
      return {
        connected: this.isConnected,
        memory_usage: this.parseMemoryInfo(info),
        keyspace_info: this.parseKeyspaceInfo(keyspace),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.warn('Failed to get cache stats:', error.message);
      return null;
    }
  }

  // Utility methods
  hashParams(params) {
    return this.hashString(JSON.stringify(params));
  }

  hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  parseMemoryInfo(info) {
    const lines = info.split('\r\n');
    const memoryInfo = {};
    
    for (const line of lines) {
      if (line.includes('used_memory_human')) {
        memoryInfo.used = line.split(':')[1];
      }
      if (line.includes('used_memory_peak_human')) {
        memoryInfo.peak = line.split(':')[1];
      }
    }
    
    return memoryInfo;
  }

  parseKeyspaceInfo(info) {
    const lines = info.split('\r\n');
    const keyspaceInfo = {};
    
    for (const line of lines) {
      if (line.startsWith('db')) {
        const [db, stats] = line.split(':');
        keyspaceInfo[db] = stats;
      }
    }
    
    return keyspaceInfo;
  }

  // Graceful shutdown
  async close() {
    if (this.redis) {
      await this.redis.quit();
      console.log('🔌 Redis/Valkey connection closed gracefully');
    }
  }

  // Health check
  async healthCheck() {
    if (!this.isAvailable()) {
      return { status: 'unhealthy', message: 'Not connected' };
    }

    try {
      const start = Date.now();
      await this.redis.ping();
      const latency = Date.now() - start;
      
      return {
        status: 'healthy',
        latency: `${latency}ms`,
        connected: this.isConnected
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        message: error.message
      };
    }
  }
}

module.exports = new CacheService();