const { Pool } = require('pg');
const { logger } = require('../middleware/errorHandler');

// PostgreSQL connection pool with enterprise-grade configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20, // Maximum number of clients in pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return error after 2 seconds if connection could not be established
  maxUses: 7500, // Close connection after 7500 uses (prevents memory leaks)
});

// Handle pool errors
pool.on('error', (err, client) => {
  logger.error('Unexpected error on idle client:', err);
  process.exit(-1);
});

// Database initialization and table creation
async function initializeDatabase() {
  const client = await pool.connect();
  
  try {
    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        is_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // Create user_tokens table for refresh tokens
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_tokens (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        token VARCHAR(512) NOT NULL,
        type VARCHAR(50) NOT NULL,
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(user_id, type)
      )
    `);

    // Create naming_sessions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS naming_sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        session_token VARCHAR(255) NOT NULL,
        keywords TEXT[] NOT NULL,
        industry VARCHAR(50) NOT NULL,
        style VARCHAR(50) NOT NULL,
        name_count INTEGER NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        completed_at TIMESTAMP WITH TIME ZONE
      )
    `);

    // Create generated_names table
    await client.query(`
      CREATE TABLE IF NOT EXISTS generated_names (
        id SERIAL PRIMARY KEY,
        session_id INTEGER REFERENCES naming_sessions(id) ON DELETE CASCADE,
        name VARCHAR(100) NOT NULL,
        explanation TEXT,
        brandability_score INTEGER,
        domain_available BOOLEAN DEFAULT FALSE,
        domain_extensions JSONB DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // Create web_vitals table for performance monitoring
    await client.query(`
      CREATE TABLE IF NOT EXISTS web_vitals (
        id BIGSERIAL PRIMARY KEY,
        url TEXT NOT NULL,
        lcp DECIMAL(8,2), -- Largest Contentful Paint (ms)
        inp DECIMAL(8,2), -- Interaction to Next Paint (ms)  
        cls DECIMAL(8,4), -- Cumulative Layout Shift
        fcp DECIMAL(8,2), -- First Contentful Paint (ms)
        ttfb DECIMAL(8,2), -- Time to First Byte (ms)
        user_agent TEXT,
        connection_type VARCHAR(50),
        connection_speed DECIMAL(8,2),
        navigation_type VARCHAR(50),
        session_id UUID,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        ip_address INET,
        timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create performance_alerts table
    await client.query(`
      CREATE TABLE IF NOT EXISTS performance_alerts (
        id BIGSERIAL PRIMARY KEY,
        alert_type VARCHAR(50) NOT NULL,
        url TEXT NOT NULL,
        metric_name VARCHAR(20) NOT NULL,
        threshold_value DECIMAL(8,2) NOT NULL,
        actual_value DECIMAL(8,2) NOT NULL,
        severity VARCHAR(20) DEFAULT 'medium',
        status VARCHAR(20) DEFAULT 'open',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        resolved_at TIMESTAMP WITH TIME ZONE,
        resolved_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
        notes TEXT
      )
    `);

    // Create indexes for better performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_user_tokens_user_id ON user_tokens(user_id);
      CREATE INDEX IF NOT EXISTS idx_user_tokens_token ON user_tokens(token);
      CREATE INDEX IF NOT EXISTS idx_naming_sessions_user_id ON naming_sessions(user_id);
      CREATE INDEX IF NOT EXISTS idx_naming_sessions_created_at ON naming_sessions(created_at);
      CREATE INDEX IF NOT EXISTS idx_generated_names_session_id ON generated_names(session_id);
      CREATE INDEX IF NOT EXISTS idx_generated_names_brandability_score ON generated_names(brandability_score);
      CREATE INDEX IF NOT EXISTS idx_web_vitals_url ON web_vitals(url);
      CREATE INDEX IF NOT EXISTS idx_web_vitals_created_at ON web_vitals(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_web_vitals_user_id ON web_vitals(user_id) WHERE user_id IS NOT NULL;
      CREATE INDEX IF NOT EXISTS idx_performance_alerts_status ON performance_alerts(status);
      CREATE INDEX IF NOT EXISTS idx_performance_alerts_created_at ON performance_alerts(created_at DESC);
    `);

    logger.info('Database initialized successfully');
    
  } catch (error) {
    logger.error('Database initialization failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Health check function
async function checkDatabaseHealth() {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT NOW() as current_time');
    return {
      status: 'healthy',
      timestamp: result.rows[0].current_time,
      pool_total_count: pool.totalCount,
      pool_idle_count: pool.idleCount,
      pool_waiting_count: pool.waitingCount
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message
    };
  } finally {
    client.release();
  }
}

// Graceful shutdown
async function closeDatabasePool() {
  try {
    await pool.end();
    logger.info('Database pool closed');
  } catch (error) {
    logger.error('Error closing database pool:', error);
  }
}

module.exports = {
  pool,
  initializeDatabase,
  checkDatabaseHealth,
  closeDatabasePool
};