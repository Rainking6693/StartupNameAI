const { Pool } = require('pg');
const { telemetryHelpers } = require('../config/telemetry');
const cacheService = require('./cacheService');

class DatabaseOptimizationService {
  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      // Performance optimizations
      max: parseInt(process.env.DB_POOL_MAX) || 20,
      min: parseInt(process.env.DB_POOL_MIN) || 5,
      idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT) || 30000,
      connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT) || 5000,
      // Advanced connection settings
      statement_timeout: parseInt(process.env.DB_STATEMENT_TIMEOUT) || 30000,
      query_timeout: parseInt(process.env.DB_QUERY_TIMEOUT) || 10000,
      application_name: 'startup-namer-optimized'
    });
    
    this.queryCache = new Map();
    this.performanceMetrics = {
      query_count: 0,
      cache_hits: 0,
      avg_query_time: 0,
      slow_queries: 0,
      connection_pool_usage: 0
    };
    
    this.initializeOptimizations();
  }

  // Initialize database optimizations
  async initializeOptimizations() {
    try {
      await this.createOptimizedIndexes();
      await this.configurePerformanceSettings();
      await this.setupQueryOptimizations();
      await this.initializeConnectionPoolMonitoring();
      
      console.log('✅ Database optimization service initialized');
    } catch (error) {
      console.error('❌ Failed to initialize database optimizations:', error);
    }
  }

  // Create optimized indexes for better performance
  async createOptimizedIndexes() {
    return telemetryHelpers.createSpan('db_index_optimization', async (span) => {
      const client = await this.pool.connect();
      
      try {
        // Vector similarity search optimization
        await client.query(`
          CREATE INDEX CONCURRENTLY IF NOT EXISTS name_embeddings_vector_cosine_idx 
          ON name_embeddings USING ivfflat (embedding vector_cosine_ops)
          WITH (lists = 100);
        `);

        // Composite indexes for common query patterns
        await client.query(`
          CREATE INDEX CONCURRENTLY IF NOT EXISTS name_embeddings_industry_brandability_idx 
          ON name_embeddings (industry, brandability_score DESC)
          WHERE brandability_score >= 7.0;
        `);

        await client.query(`
          CREATE INDEX CONCURRENTLY IF NOT EXISTS name_embeddings_domain_available_idx 
          ON name_embeddings (domain_available, industry, brandability_score DESC)
          WHERE domain_available = true;
        `);

        // Partial indexes for performance
        await client.query(`
          CREATE INDEX CONCURRENTLY IF NOT EXISTS naming_sessions_recent_idx 
          ON naming_sessions (created_at DESC, industry)
          WHERE created_at > NOW() - INTERVAL '30 days';
        `);

        // Generated names optimization
        await client.query(`
          CREATE INDEX CONCURRENTLY IF NOT EXISTS generated_names_session_score_idx 
          ON generated_names (session_id, brandability_score DESC, selected_by_user);
        `);

        // Analytics optimization
        await client.query(`
          CREATE INDEX CONCURRENTLY IF NOT EXISTS usage_analytics_event_time_idx 
          ON usage_analytics (event_type, created_at DESC)
          WHERE created_at > NOW() - INTERVAL '7 days';
        `);

        span.setAttributes({
          'db_optimization.indexes_created': 6,
          'db_optimization.type': 'performance_indexes'
        });

        console.log('✅ Optimized database indexes created');
        
      } finally {
        client.release();
      }
    });
  }

  // Configure database performance settings
  async configurePerformanceSettings() {
    return telemetryHelpers.createSpan('db_performance_config', async (span) => {
      const client = await this.pool.connect();
      
      try {
        // Optimize for vector operations
        await client.query(`
          SET ivfflat.probes = 10;
        `);

        // Optimize work memory for complex queries
        await client.query(`
          SET work_mem = '256MB';
        `);

        // Optimize shared buffers for better caching
        await client.query(`
          SET shared_buffers = '512MB';
        `);

        // Enable parallel query execution
        await client.query(`
          SET max_parallel_workers_per_gather = 4;
        `);

        span.setAttributes({
          'db_optimization.settings_configured': 4,
          'db_optimization.type': 'performance_settings'
        });

        console.log('✅ Database performance settings configured');
        
      } finally {
        client.release();
      }
    });
  }

  // Setup query optimizations and prepared statements
  async setupQueryOptimizations() {
    // Prepare frequently used queries
    this.preparedQueries = {
      findSimilarNames: `
        SELECT 
          name,
          industry,
          style,
          brandability_score,
          domain_available,
          1 - (embedding <=> $1) as similarity
        FROM name_embeddings
        WHERE 
          ($2::text IS NULL OR industry = $2)
          AND 1 - (embedding <=> $1) > $3
        ORDER BY embedding <=> $1
        LIMIT $4;
      `,
      
      getTopNamesByIndustry: `
        SELECT 
          name,
          brandability_score,
          domain_available,
          usage_count
        FROM name_embeddings
        WHERE 
          industry = $1
          AND brandability_score >= $2
          AND domain_available = true
        ORDER BY brandability_score DESC, usage_count DESC
        LIMIT $3;
      `,
      
      getRecentSessions: `
        SELECT 
          id,
          keywords,
          industry,
          style,
          created_at,
          status
        FROM naming_sessions
        WHERE 
          created_at > NOW() - INTERVAL '24 hours'
          AND status = 'completed'
        ORDER BY created_at DESC
        LIMIT $1;
      `,
      
      getAnalytics: `
        SELECT 
          event_type,
          industry,
          COUNT(*) as count,
          DATE_TRUNC('hour', created_at) as hour
        FROM usage_analytics
        WHERE 
          created_at > NOW() - INTERVAL '24 hours'
          AND ($1::text IS NULL OR industry = $1)
        GROUP BY event_type, industry, DATE_TRUNC('hour', created_at)
        ORDER BY hour DESC;
      `
    };

    console.log('✅ Query optimizations configured');
  }

  // Initialize connection pool monitoring
  async initializeConnectionPoolMonitoring() {
    setInterval(() => {
      this.performanceMetrics.connection_pool_usage = {
        total: this.pool.totalCount,
        idle: this.pool.idleCount,
        waiting: this.pool.waitingCount
      };
    }, 5000); // Update every 5 seconds

    console.log('✅ Connection pool monitoring initialized');
  }

  // Optimized vector similarity search
  async findSimilarNamesOptimized(queryEmbedding, industry = null, threshold = 0.7, limit = 10) {
    return telemetryHelpers.createSpan('db_vector_search_optimized', async (span) => {
      const startTime = Date.now();
      
      // Check query cache first
      const cacheKey = this.generateCacheKey('similar_names', {
        embedding: queryEmbedding.slice(0, 10), // Use first 10 dimensions for cache key
        industry,
        threshold,
        limit
      });
      
      const cached = await this.getQueryCache(cacheKey);
      if (cached) {
        span.setAttributes({
          'db_optimization.cache_hit': true,
          'db_optimization.query_time': Date.now() - startTime
        });
        return cached;
      }

      const client = await this.pool.connect();
      
      try {
        const result = await client.query(
          this.preparedQueries.findSimilarNames,
          [queryEmbedding, industry, threshold, limit]
        );
        
        const queryTime = Date.now() - startTime;
        
        // Cache results for future use
        await this.setQueryCache(cacheKey, result.rows, 300); // 5 minutes
        
        // Update performance metrics
        this.updatePerformanceMetrics('vector_search', queryTime);
        
        span.setAttributes({
          'db_optimization.cache_hit': false,
          'db_optimization.query_time': queryTime,
          'db_optimization.results_count': result.rows.length
        });
        
        return result.rows;
        
      } finally {
        client.release();
      }
    });
  }

  // Optimized industry-based name retrieval
  async getTopNamesByIndustryOptimized(industry, minScore = 7.0, limit = 20) {
    return telemetryHelpers.createSpan('db_industry_search_optimized', async (span) => {
      const startTime = Date.now();
      
      const cacheKey = this.generateCacheKey('top_names', { industry, minScore, limit });
      const cached = await this.getQueryCache(cacheKey);
      
      if (cached) {
        span.setAttributes({ 'db_optimization.cache_hit': true });
        return cached;
      }

      const client = await this.pool.connect();
      
      try {
        const result = await client.query(
          this.preparedQueries.getTopNamesByIndustry,
          [industry, minScore, limit]
        );
        
        const queryTime = Date.now() - startTime;
        
        // Cache for longer since this data changes less frequently
        await this.setQueryCache(cacheKey, result.rows, 1800); // 30 minutes
        
        this.updatePerformanceMetrics('industry_search', queryTime);
        
        span.setAttributes({
          'db_optimization.cache_hit': false,
          'db_optimization.query_time': queryTime,
          'db_optimization.results_count': result.rows.length
        });
        
        return result.rows;
        
      } finally {
        client.release();
      }
    });
  }

  // Batch insert optimization for better performance
  async batchInsertNamesOptimized(names) {
    return telemetryHelpers.createSpan('db_batch_insert_optimized', async (span) => {
      const client = await this.pool.connect();
      
      try {
        await client.query('BEGIN');
        
        // Use COPY for bulk inserts when possible
        const copyQuery = `
          COPY name_embeddings (name, industry, style, keywords, embedding, brandability_score, domain_available)
          FROM STDIN WITH (FORMAT csv)
        `;
        
        // Prepare CSV data
        const csvData = names.map(name => [
          name.name,
          name.industry,
          name.style,
          `{${name.keywords.join(',')}}`,
          `[${name.embedding.join(',')}}]`,
          name.brandability_score,
          name.domain_available
        ].map(field => `"${field}"`).join(',')).join('\n');
        
        // Use COPY for better performance
        await client.query(copyQuery);
        client.copy_from(csvData);
        
        await client.query('COMMIT');
        
        span.setAttributes({
          'db_optimization.batch_size': names.length,
          'db_optimization.method': 'copy'
        });
        
        console.log(`✅ Batch inserted ${names.length} names using optimized COPY`);
        
      } catch (error) {
        await client.query('ROLLBACK');
        
        // Fallback to individual inserts
        await this.fallbackBatchInsert(client, names);
        
        span.setAttributes({
          'db_optimization.fallback_used': true,
          'db_optimization.error': error.message
        });
        
      } finally {
        client.release();
      }
    });
  }

  // Fallback batch insert method
  async fallbackBatchInsert(client, names) {
    await client.query('BEGIN');
    
    for (const name of names) {
      await client.query(`
        INSERT INTO name_embeddings (name, industry, style, keywords, embedding, brandability_score, domain_available)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (name) DO NOTHING
      `, [
        name.name,
        name.industry,
        name.style,
        name.keywords,
        name.embedding,
        name.brandability_score,
        name.domain_available
      ]);
    }
    
    await client.query('COMMIT');
    console.log(`✅ Batch inserted ${names.length} names using fallback method`);
  }

  // Analytics query optimization
  async getAnalyticsOptimized(industry = null, timeRange = '24 hours') {
    return telemetryHelpers.createSpan('db_analytics_optimized', async (span) => {
      const cacheKey = this.generateCacheKey('analytics', { industry, timeRange });
      const cached = await this.getQueryCache(cacheKey);
      
      if (cached) {
        span.setAttributes({ 'db_optimization.cache_hit': true });
        return cached;
      }

      const client = await this.pool.connect();
      
      try {
        const result = await client.query(
          this.preparedQueries.getAnalytics,
          [industry]
        );
        
        // Cache analytics for 5 minutes
        await this.setQueryCache(cacheKey, result.rows, 300);
        
        span.setAttributes({
          'db_optimization.cache_hit': false,
          'db_optimization.results_count': result.rows.length
        });
        
        return result.rows;
        
      } finally {
        client.release();
      }
    });
  }

  // Query cache management
  async getQueryCache(key) {
    try {
      const cached = await cacheService.get(`db_query_${key}`);
      if (cached) {
        this.performanceMetrics.cache_hits++;
        return cached;
      }
    } catch (error) {
      console.warn('Query cache get failed:', error.message);
    }
    return null;
  }

  async setQueryCache(key, data, ttl = 300) {
    try {
      await cacheService.set(`db_query_${key}`, data, ttl);
    } catch (error) {
      console.warn('Query cache set failed:', error.message);
    }
  }

  // Generate cache key for queries
  generateCacheKey(type, params) {
    return `${type}_${JSON.stringify(params)}`.replace(/[^a-zA-Z0-9_]/g, '_');
  }

  // Update performance metrics
  updatePerformanceMetrics(queryType, queryTime) {
    this.performanceMetrics.query_count++;
    
    // Update average query time
    const currentAvg = this.performanceMetrics.avg_query_time;
    const count = this.performanceMetrics.query_count;
    this.performanceMetrics.avg_query_time = 
      ((currentAvg * (count - 1)) + queryTime) / count;
    
    // Track slow queries (>1000ms)
    if (queryTime > 1000) {
      this.performanceMetrics.slow_queries++;
      console.warn(`Slow query detected: ${queryType} took ${queryTime}ms`);
    }
    
    // Record telemetry
    telemetryHelpers.metrics.nameGenerationDuration.record(queryTime / 1000, {
      query_type: queryType
    });
  }

  // Database health check with performance metrics
  async healthCheck() {
    try {
      const client = await this.pool.connect();
      const startTime = Date.now();
      
      await client.query('SELECT 1');
      const responseTime = Date.now() - startTime;
      
      client.release();
      
      return {
        status: 'healthy',
        response_time: `${responseTime}ms`,
        connection_pool: this.performanceMetrics.connection_pool_usage,
        performance_metrics: {
          ...this.performanceMetrics,
          cache_hit_ratio: this.performanceMetrics.cache_hits / this.performanceMetrics.query_count || 0
        }
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message
      };
    }
  }

  // Performance analysis and recommendations
  async getPerformanceAnalysis() {
    const analysis = {
      query_performance: {
        total_queries: this.performanceMetrics.query_count,
        average_query_time: Math.round(this.performanceMetrics.avg_query_time),
        slow_queries: this.performanceMetrics.slow_queries,
        cache_hit_ratio: this.performanceMetrics.cache_hits / this.performanceMetrics.query_count || 0
      },
      connection_pool: this.performanceMetrics.connection_pool_usage,
      recommendations: []
    };
    
    // Generate recommendations
    if (analysis.query_performance.cache_hit_ratio < 0.5) {
      analysis.recommendations.push('Consider increasing query cache TTL or improving cache strategies');
    }
    
    if (analysis.query_performance.slow_queries > analysis.query_performance.total_queries * 0.1) {
      analysis.recommendations.push('High number of slow queries detected - review query optimization');
    }
    
    if (analysis.connection_pool.waiting > 0) {
      analysis.recommendations.push('Connection pool exhaustion detected - consider increasing pool size');
    }
    
    return analysis;
  }

  // Cleanup and maintenance
  async performMaintenance() {
    return telemetryHelpers.createSpan('db_maintenance', async (span) => {
      const client = await this.pool.connect();
      
      try {
        // Vacuum and analyze for better performance
        await client.query('VACUUM ANALYZE name_embeddings;');
        await client.query('VACUUM ANALYZE naming_sessions;');
        await client.query('VACUUM ANALYZE generated_names;');
        
        // Update statistics for query planner
        await client.query('ANALYZE;');
        
        // Clean up old data
        await client.query(`
          DELETE FROM usage_analytics 
          WHERE created_at < NOW() - INTERVAL '30 days';
        `);
        
        span.setAttributes({
          'db_maintenance.operations': 4,
          'db_maintenance.type': 'routine_maintenance'
        });
        
        console.log('✅ Database maintenance completed');
        
      } finally {
        client.release();
      }
    });
  }

  // Close database connections
  async close() {
    await this.pool.end();
    console.log('🔌 Database optimization service closed');
  }
}

module.exports = new DatabaseOptimizationService();