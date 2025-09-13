const { Pool } = require('pg');
const { openai } = require('./openai');

class VectorDatabase {
  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    });
    this.embeddingModel = 'text-embedding-3-small'; // More cost-effective
    this.embeddingDimensions = 1536;
  }

  // Initialize pgvector extension and tables
  async initialize() {
    try {
      const client = await this.pool.connect();
      
      // Enable pgvector extension
      await client.query('CREATE EXTENSION IF NOT EXISTS vector;');
      
      // Create name embeddings table
      await client.query(`
        CREATE TABLE IF NOT EXISTS name_embeddings (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL UNIQUE,
          industry TEXT NOT NULL,
          style TEXT,
          keywords TEXT[],
          embedding vector(${this.embeddingDimensions}),
          brandability_score DECIMAL(3,1),
          domain_available BOOLEAN,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `);

      // Create index for vector similarity search
      await client.query(`
        CREATE INDEX IF NOT EXISTS name_embeddings_vector_idx 
        ON name_embeddings USING ivfflat (embedding vector_cosine_ops)
        WITH (lists = 100);
      `);

      // Create index for filtering
      await client.query(`
        CREATE INDEX IF NOT EXISTS name_embeddings_industry_idx 
        ON name_embeddings (industry);
      `);

      await client.query(`
        CREATE INDEX IF NOT EXISTS name_embeddings_style_idx 
        ON name_embeddings (style);
      `);

      // Create successful names table for learning
      await client.query(`
        CREATE TABLE IF NOT EXISTS successful_names (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          industry TEXT NOT NULL,
          success_metrics JSONB,
          embedding vector(${this.embeddingDimensions}),
          created_at TIMESTAMP DEFAULT NOW()
        );
      `);

      client.release();
      console.log('✅ Vector database initialized successfully');
      
    } catch (error) {
      console.error('❌ Failed to initialize vector database:', error);
      throw error;
    }
  }

  // Generate embedding for text
  async generateEmbedding(text) {
    try {
      const response = await openai.embeddings.create({
        model: this.embeddingModel,
        input: text,
      });
      
      return response.data[0].embedding;
    } catch (error) {
      console.error('Failed to generate embedding:', error);
      throw error;
    }
  }

  // Store name with embedding
  async storeName(nameData) {
    const { name, industry, style, keywords, brandability_score, domain_available } = nameData;
    
    try {
      // Generate embedding for the name + context
      const embeddingText = `${name} ${industry} ${style} ${keywords.join(' ')}`;
      const embedding = await this.generateEmbedding(embeddingText);
      
      const client = await this.pool.connect();
      
      const result = await client.query(`
        INSERT INTO name_embeddings 
        (name, industry, style, keywords, embedding, brandability_score, domain_available)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (name) DO UPDATE SET
          industry = EXCLUDED.industry,
          style = EXCLUDED.style,
          keywords = EXCLUDED.keywords,
          embedding = EXCLUDED.embedding,
          brandability_score = EXCLUDED.brandability_score,
          domain_available = EXCLUDED.domain_available,
          updated_at = NOW()
        RETURNING id;
      `, [name, industry, style, keywords, embedding, brandability_score, domain_available]);
      
      client.release();
      return result.rows[0].id;
      
    } catch (error) {
      console.error('Failed to store name embedding:', error);
      throw error;
    }
  }

  // Find similar names using vector similarity
  async findSimilarNames(query, industry = null, limit = 10, threshold = 0.7) {
    try {
      // Generate embedding for query
      const queryEmbedding = await this.generateEmbedding(query);
      
      const client = await this.pool.connect();
      
      let sql = `
        SELECT 
          name,
          industry,
          style,
          keywords,
          brandability_score,
          domain_available,
          1 - (embedding <=> $1) as similarity
        FROM name_embeddings
        WHERE 1 - (embedding <=> $1) > $2
      `;
      
      const params = [queryEmbedding, threshold];
      
      if (industry) {
        sql += ` AND industry = $3`;
        params.push(industry);
      }
      
      sql += ` ORDER BY embedding <=> $1 LIMIT $${params.length + 1}`;
      params.push(limit);
      
      const result = await client.query(sql, params);
      client.release();
      
      return result.rows;
      
    } catch (error) {
      console.error('Failed to find similar names:', error);
      throw error;
    }
  }

  // Get name suggestions based on successful patterns
  async getNameSuggestions(industry, style, keywords, limit = 5) {
    try {
      // Create query from input parameters
      const queryText = `${industry} ${style} ${keywords.join(' ')}`;
      const queryEmbedding = await this.generateEmbedding(queryText);
      
      const client = await this.pool.connect();
      
      // Find similar successful names
      const result = await client.query(`
        SELECT 
          n.name,
          n.brandability_score,
          n.domain_available,
          1 - (n.embedding <=> $1) as similarity
        FROM name_embeddings n
        WHERE n.industry = $2 
          AND n.brandability_score >= 7.0
          AND 1 - (n.embedding <=> $1) > 0.6
        ORDER BY 
          n.brandability_score DESC,
          1 - (n.embedding <=> $1) DESC
        LIMIT $3;
      `, [queryEmbedding, industry, limit]);
      
      client.release();
      return result.rows;
      
    } catch (error) {
      console.error('Failed to get name suggestions:', error);
      return [];
    }
  }

  // Store successful name for learning
  async storeSuccessfulName(name, industry, successMetrics) {
    try {
      const embedding = await this.generateEmbedding(`${name} ${industry}`);
      
      const client = await this.pool.connect();
      
      await client.query(`
        INSERT INTO successful_names (name, industry, success_metrics, embedding)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT DO NOTHING;
      `, [name, industry, successMetrics, embedding]);
      
      client.release();
      
    } catch (error) {
      console.error('Failed to store successful name:', error);
    }
  }

  // Analyze naming patterns for an industry
  async analyzeIndustryPatterns(industry, limit = 100) {
    try {
      const client = await this.pool.connect();
      
      const result = await client.query(`
        SELECT 
          name,
          keywords,
          brandability_score,
          domain_available,
          LENGTH(name) as name_length,
          CASE 
            WHEN name ~ '^[A-Z][a-z]+[A-Z][a-z]+$' THEN 'CamelCase'
            WHEN name ~ '^[a-z]+$' THEN 'lowercase'
            WHEN name ~ '^[A-Z]+$' THEN 'UPPERCASE'
            ELSE 'mixed'
          END as name_pattern
        FROM name_embeddings
        WHERE industry = $1
          AND brandability_score >= 7.0
        ORDER BY brandability_score DESC
        LIMIT $2;
      `, [industry, limit]);
      
      client.release();
      
      // Analyze patterns
      const names = result.rows;
      const patterns = {
        avgLength: names.reduce((sum, n) => sum + n.name_length, 0) / names.length,
        commonPatterns: {},
        topKeywords: {},
        avgBrandability: names.reduce((sum, n) => sum + parseFloat(n.brandability_score), 0) / names.length,
        domainAvailabilityRate: names.filter(n => n.domain_available).length / names.length
      };
      
      // Count pattern frequencies
      names.forEach(name => {
        patterns.commonPatterns[name.name_pattern] = 
          (patterns.commonPatterns[name.name_pattern] || 0) + 1;
        
        if (name.keywords) {
          name.keywords.forEach(keyword => {
            patterns.topKeywords[keyword] = 
              (patterns.topKeywords[keyword] || 0) + 1;
          });
        }
      });
      
      return patterns;
      
    } catch (error) {
      console.error('Failed to analyze industry patterns:', error);
      return null;
    }
  }

  // Clean up old embeddings
  async cleanup(daysOld = 30) {
    try {
      const client = await this.pool.connect();
      
      const result = await client.query(`
        DELETE FROM name_embeddings 
        WHERE created_at < NOW() - INTERVAL '${daysOld} days'
          AND brandability_score < 6.0;
      `);
      
      client.release();
      console.log(`🧹 Cleaned up ${result.rowCount} old name embeddings`);
      
    } catch (error) {
      console.error('Failed to cleanup embeddings:', error);
    }
  }

  // Close database connection
  async close() {
    await this.pool.end();
  }
}

module.exports = new VectorDatabase();