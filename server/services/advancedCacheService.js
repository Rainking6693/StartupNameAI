const Redis = require('ioredis');
const { telemetryHelpers } = require('../config/telemetry');

class AdvancedCacheService {
  constructor() {
    this.redis = null;
    this.localCache = new Map();
    this.isConnected = false;
    
    // Multi-level cache configuration
    this.cacheConfig = {
      l1: { // Local memory cache
        maxSize: parseInt(process.env.L1_CACHE_SIZE) || 1000,
        ttl: parseInt(process.env.L1_CACHE_TTL) || 300, // 5 minutes
      },
      l2: { // Redis distributed cache
        ttl: parseInt(process.env.L2_CACHE_TTL) || 3600, // 1 hour
        cluster: process.env.REDIS_CLUSTER === 'true'
      },
      l3: { // Database cache (handled by database service)
        ttl: parseInt(process.env.L3_CACHE_TTL) || 86400 // 24 hours
      }
    };
    
    this.cacheMetrics = {
      l1_hits: 0,
      l1_misses: 0,
      l2_hits: 0,
      l2_misses: 0,
      total_requests: 0,
      cache_warming_operations: 0,
      evictions: 0
    };
    
    this.cacheWarmingQueue = [];
    this.isWarmingCache = false;
    
    this.initializeAdvancedCache();
  }

  // Initialize advanced multi-level caching
  async initializeAdvancedCache() {
    try {
      await this.initializeRedisCluster();
      this.setupLocalCacheManagement();
      this.startCacheWarmingProcess();
      this.initializeCacheMetrics();
      
      console.log('✅ Advanced cache service initialized');
    } catch (error) {
      console.error('❌ Failed to initialize advanced cache:', error);
    }
  }

  // Initialize Redis cluster or single instance
  async initializeRedisCluster() {
    const redisConfig = {
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3,
      lazyConnect: true,
      keepAlive: 30000,
      family: 4,
      keyPrefix: 'startup-namer-v2:',
      // Performance optimizations
      enableReadyCheck: true,
      maxLoadingTimeout: 5000,
      // Compression for large values
      compression: 'gzip'
    };

    if (this.cacheConfig.l2.cluster && process.env.REDIS_CLUSTER_NODES) {
      // Redis Cluster setup
      const clusterNodes = process.env.REDIS_CLUSTER_NODES.split(',');
      this.redis = new Redis.Cluster(clusterNodes, {
        redisOptions: redisConfig,
        enableOfflineQueue: false,
        retryDelayOnFailover: 100,
        slotsRefreshTimeout: 10000
      });
    } else {
      // Single Redis instance
      const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
      this.redis = new Redis(redisUrl, redisConfig);
    }

    this.redis.on('connect', () => {
      console.log('✅ Advanced Redis cache connected');
      this.isConnected = true;
    });

    this.redis.on('error', (error) => {
      console.warn('⚠️ Redis cache error:', error.message);
      this.isConnected = false;
    });

    this.redis.on('close', () => {
      console.log('🔌 Redis cache connection closed');
      this.isConnected = false;
    });
  }

  // Setup local cache management with LRU eviction
  setupLocalCacheManagement() {
    // Implement LRU eviction for local cache
    setInterval(() => {
      this.evictExpiredLocalCache();
    }, 60000); // Check every minute

    // Monitor local cache size
    setInterval(() => {
      if (this.localCache.size > this.cacheConfig.l1.maxSize) {
        this.evictLRULocalCache();
      }
    }, 30000); // Check every 30 seconds
  }

  // Start cache warming process
  startCacheWarmingProcess() {
    setInterval(() => {
      if (!this.isWarmingCache && this.cacheWarmingQueue.length > 0) {
        this.processCacheWarmingQueue();
      }
    }, 10000); // Process queue every 10 seconds
  }

  // Initialize cache metrics collection
  initializeCacheMetrics() {
    setInterval(() => {
      this.reportCacheMetrics();
    }, 60000); // Report metrics every minute
  }

  // Multi-level cache get with fallback
  async get(key) {
    return telemetryHelpers.createSpan('advanced_cache_get', async (span) => {
      this.cacheMetrics.total_requests++;
      
      try {
        // L1 Cache (Local Memory) - Fastest
        const l1Result = this.getFromLocalCache(key);
        if (l1Result !== null) {
          this.cacheMetrics.l1_hits++;
          span.setAttributes({
            'cache.level': 'l1',
            'cache.hit': true,
            'cache.key': key
          });
          return l1Result;
        }
        this.cacheMetrics.l1_misses++;

        // L2 Cache (Redis) - Fast
        if (this.isConnected) {
          const l2Result = await this.getFromRedisCache(key);
          if (l2Result !== null) {
            this.cacheMetrics.l2_hits++;
            
            // Promote to L1 cache
            this.setLocalCache(key, l2Result, this.cacheConfig.l1.ttl);
            
            span.setAttributes({
              'cache.level': 'l2',
              'cache.hit': true,
              'cache.promoted_to_l1': true
            });
            return l2Result;
          }
        }
        this.cacheMetrics.l2_misses++;

        span.setAttributes({
          'cache.hit': false,
          'cache.levels_checked': 2
        });
        
        return null;

      } catch (error) {
        span.recordException(error);
        console.warn(`Advanced cache get failed for key ${key}:`, error.message);
        return null;
      }
    });
  }

  // Multi-level cache set with write-through strategy
  async set(key, value, ttl = null) {
    return telemetryHelpers.createSpan('advanced_cache_set', async (span) => {
      try {
        const l1Ttl = ttl || this.cacheConfig.l1.ttl;
        const l2Ttl = ttl || this.cacheConfig.l2.ttl;

        // Set in L1 cache (Local Memory)
        this.setLocalCache(key, value, l1Ttl);

        // Set in L2 cache (Redis) - Write-through
        if (this.isConnected) {
          await this.setRedisCache(key, value, l2Ttl);
        }

        span.setAttributes({
          'cache.operation': 'set',
          'cache.key': key,
          'cache.ttl': l2Ttl,
          'cache.levels_written': this.isConnected ? 2 : 1
        });

        return true;

      } catch (error) {
        span.recordException(error);
        console.warn(`Advanced cache set failed for key ${key}:`, error.message);
        return false;
      }
    });
  }

  // Intelligent cache warming based on usage patterns
  async warmCache(keys, priority = 'normal') {
    return telemetryHelpers.createSpan('cache_warming', async (span) => {
      try {
        const warmingTasks = keys.map(key => ({
          key,
          priority,
          timestamp: Date.now()
        }));

        // Add to warming queue
        this.cacheWarmingQueue.push(...warmingTasks);
        
        // Sort by priority
        this.cacheWarmingQueue.sort((a, b) => {
          const priorityOrder = { high: 3, normal: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        });

        span.setAttributes({
          'cache_warming.keys_queued': keys.length,
          'cache_warming.priority': priority,
          'cache_warming.queue_size': this.cacheWarmingQueue.length
        });

        console.log(`🔥 Queued ${keys.length} keys for cache warming`);

      } catch (error) {
        span.recordException(error);
        console.error('Cache warming failed:', error);
      }
    });
  }

  // Process cache warming queue
  async processCacheWarmingQueue() {
    if (this.isWarmingCache || this.cacheWarmingQueue.length === 0) {
      return;
    }

    this.isWarmingCache = true;
    this.cacheMetrics.cache_warming_operations++;

    try {
      const batchSize = 10;
      const batch = this.cacheWarmingQueue.splice(0, batchSize);

      for (const task of batch) {
        try {
          // Check if key is already cached
          const cached = await this.get(task.key);
          if (cached === null) {
            // Key not in cache, trigger warming logic
            await this.warmSpecificKey(task.key);
          }
        } catch (error) {
          console.warn(`Failed to warm cache for key ${task.key}:`, error.message);
        }
      }

      console.log(`🔥 Processed ${batch.length} cache warming tasks`);

    } finally {
      this.isWarmingCache = false;
    }
  }

  // Warm specific key based on key pattern
  async warmSpecificKey(key) {
    // Implement key-specific warming logic based on key patterns
    if (key.startsWith('names_')) {
      await this.warmNameGenerationCache(key);
    } else if (key.startsWith('industry_')) {
      await this.warmIndustryCache(key);
    } else if (key.startsWith('analytics_')) {
      await this.warmAnalyticsCache(key);
    }
  }

  // Warm name generation cache
  async warmNameGenerationCache(key) {
    // Extract parameters from cache key and pre-generate common variations
    try {
      const params = this.extractParamsFromKey(key);
      if (params) {
        // Generate variations for cache warming
        const variations = this.generateCacheVariations(params);
        for (const variation of variations) {
          // This would trigger the actual name generation to populate cache
          // Implementation depends on integration with name generation service
        }
      }
    } catch (error) {
      console.warn('Name generation cache warming failed:', error.message);
    }
  }

  // Semantic cache for AI responses
  async getSemanticCache(query, threshold = 0.8) {
    return telemetryHelpers.createSpan('semantic_cache_get', async (span) => {
      try {
        // Generate semantic key
        const semanticKey = await this.generateSemanticKey(query);
        
        // Check for exact match first
        const exactMatch = await this.get(semanticKey);
        if (exactMatch) {
          span.setAttributes({
            'semantic_cache.type': 'exact_match',
            'semantic_cache.hit': true
          });
          return { hit: true, type: 'exact', data: exactMatch };
        }

        // Check for semantic similarity
        const similarKeys = await this.findSimilarCacheKeys(semanticKey, threshold);
        if (similarKeys.length > 0) {
          const bestMatch = similarKeys[0];
          const cachedData = await this.get(bestMatch.key);
          
          if (cachedData) {
            span.setAttributes({
              'semantic_cache.type': 'semantic_match',
              'semantic_cache.hit': true,
              'semantic_cache.similarity': bestMatch.similarity
            });
            
            return { 
              hit: true, 
              type: 'semantic', 
              data: cachedData, 
              similarity: bestMatch.similarity 
            };
          }
        }

        span.setAttributes({
          'semantic_cache.hit': false
        });
        
        return { hit: false };

      } catch (error) {
        span.recordException(error);
        return { hit: false, error: error.message };
      }
    });
  }

  // Cache invalidation with pattern matching
  async invalidatePattern(pattern) {
    return telemetryHelpers.createSpan('cache_invalidation', async (span) => {
      try {
        let invalidatedCount = 0;

        // Invalidate from local cache
        for (const [key] of this.localCache) {
          if (this.matchesPattern(key, pattern)) {
            this.localCache.delete(key);
            invalidatedCount++;
          }
        }

        // Invalidate from Redis cache
        if (this.isConnected) {
          const keys = await this.redis.keys(`startup-namer-v2:${pattern}`);
          if (keys.length > 0) {
            await this.redis.del(...keys);
            invalidatedCount += keys.length;
          }
        }

        span.setAttributes({
          'cache_invalidation.pattern': pattern,
          'cache_invalidation.invalidated_count': invalidatedCount
        });

        console.log(`🗑️ Invalidated ${invalidatedCount} cache entries matching pattern: ${pattern}`);
        return invalidatedCount;

      } catch (error) {
        span.recordException(error);
        console.error('Cache invalidation failed:', error);
        return 0;
      }
    });
  }

  // Local cache operations
  getFromLocalCache(key) {
    const cached = this.localCache.get(key);
    if (cached && Date.now() < cached.expiry) {
      cached.lastAccessed = Date.now();
      return cached.data;
    }
    
    if (cached) {
      this.localCache.delete(key);
    }
    
    return null;
  }

  setLocalCache(key, data, ttl) {
    const expiry = Date.now() + (ttl * 1000);
    this.localCache.set(key, {
      data,
      expiry,
      lastAccessed: Date.now()
    });
  }

  // Redis cache operations
  async getFromRedisCache(key) {
    try {
      const cached = await this.redis.get(key);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (error) {
      console.warn('Redis cache get failed:', error.message);
    }
    return null;
  }

  async setRedisCache(key, data, ttl) {
    try {
      const serialized = JSON.stringify(data);
      await this.redis.setex(key, ttl, serialized);
      return true;
    } catch (error) {
      console.warn('Redis cache set failed:', error.message);
      return false;
    }
  }

  // Cache eviction strategies
  evictExpiredLocalCache() {
    const now = Date.now();
    let evictedCount = 0;
    
    for (const [key, cached] of this.localCache) {
      if (now >= cached.expiry) {
        this.localCache.delete(key);
        evictedCount++;
      }
    }
    
    if (evictedCount > 0) {
      this.cacheMetrics.evictions += evictedCount;
      console.log(`🗑️ Evicted ${evictedCount} expired entries from local cache`);
    }
  }

  evictLRULocalCache() {
    const entries = Array.from(this.localCache.entries());
    entries.sort((a, b) => a[1].lastAccessed - b[1].lastAccessed);
    
    const toEvict = entries.slice(0, Math.floor(this.cacheConfig.l1.maxSize * 0.1));
    
    for (const [key] of toEvict) {
      this.localCache.delete(key);
    }
    
    this.cacheMetrics.evictions += toEvict.length;
    console.log(`🗑️ LRU evicted ${toEvict.length} entries from local cache`);
  }

  // Utility methods
  generateSemanticKey(query) {
    // Simple hash-based semantic key generation
    // In production, this would use more sophisticated semantic hashing
    const normalized = JSON.stringify(query).toLowerCase().replace(/\s+/g, '');
    return `semantic_${this.hashString(normalized)}`;
  }

  hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }

  matchesPattern(key, pattern) {
    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    return regex.test(key);
  }

  extractParamsFromKey(key) {
    try {
      const parts = key.split('_');
      if (parts.length >= 2) {
        return JSON.parse(decodeURIComponent(parts[1]));
      }
    } catch (error) {
      console.warn('Failed to extract params from cache key:', error.message);
    }
    return null;
  }

  generateCacheVariations(params) {
    // Generate common variations of parameters for cache warming
    const variations = [];
    
    // Count variations
    if (params.count) {
      variations.push({ ...params, count: params.count + 10 });
      variations.push({ ...params, count: params.count - 10 });
    }
    
    // Style variations
    if (params.style) {
      const styles = ['modern', 'classic', 'creative', 'professional'];
      styles.forEach(style => {
        if (style !== params.style) {
          variations.push({ ...params, style });
        }
      });
    }
    
    return variations.slice(0, 5); // Limit variations
  }

  async findSimilarCacheKeys(semanticKey, threshold) {
    // Simplified similarity search - in production would use more sophisticated methods
    const allKeys = Array.from(this.localCache.keys());
    const similar = [];
    
    for (const key of allKeys) {
      if (key.startsWith('semantic_')) {
        const similarity = this.calculateKeySimilarity(semanticKey, key);
        if (similarity >= threshold) {
          similar.push({ key, similarity });
        }
      }
    }
    
    return similar.sort((a, b) => b.similarity - a.similarity);
  }

  calculateKeySimilarity(key1, key2) {
    // Simple Jaccard similarity for cache keys
    const set1 = new Set(key1.split(''));
    const set2 = new Set(key2.split(''));
    
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    
    return intersection.size / union.size;
  }

  // Cache metrics and monitoring
  reportCacheMetrics() {
    const metrics = {
      ...this.cacheMetrics,
      l1_hit_ratio: this.cacheMetrics.l1_hits / (this.cacheMetrics.l1_hits + this.cacheMetrics.l1_misses) || 0,
      l2_hit_ratio: this.cacheMetrics.l2_hits / (this.cacheMetrics.l2_hits + this.cacheMetrics.l2_misses) || 0,
      overall_hit_ratio: (this.cacheMetrics.l1_hits + this.cacheMetrics.l2_hits) / this.cacheMetrics.total_requests || 0,
      local_cache_size: this.localCache.size,
      warming_queue_size: this.cacheWarmingQueue.length
    };

    // Report to telemetry
    telemetryHelpers.metrics.nameGenerationCounter.add(1, {
      cache_l1_hit_ratio: metrics.l1_hit_ratio.toFixed(2),
      cache_l2_hit_ratio: metrics.l2_hit_ratio.toFixed(2),
      cache_overall_hit_ratio: metrics.overall_hit_ratio.toFixed(2)
    });

    console.log('📊 Cache Metrics:', metrics);
  }

  // Health check
  async healthCheck() {
    try {
      const localCacheHealth = {
        size: this.localCache.size,
        max_size: this.cacheConfig.l1.maxSize,
        utilization: (this.localCache.size / this.cacheConfig.l1.maxSize) * 100
      };

      let redisCacheHealth = { status: 'disconnected' };
      if (this.isConnected) {
        const start = Date.now();
        await this.redis.ping();
        const latency = Date.now() - start;
        
        redisCacheHealth = {
          status: 'connected',
          latency: `${latency}ms`,
          cluster: this.cacheConfig.l2.cluster
        };
      }

      return {
        status: 'healthy',
        l1_cache: localCacheHealth,
        l2_cache: redisCacheHealth,
        metrics: this.cacheMetrics,
        warming_queue: this.cacheWarmingQueue.length
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message
      };
    }
  }

  // Graceful shutdown
  async close() {
    if (this.redis) {
      await this.redis.quit();
      console.log('🔌 Advanced cache service closed');
    }
  }
}

module.exports = new AdvancedCacheService();