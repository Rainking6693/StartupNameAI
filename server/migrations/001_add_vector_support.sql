-- Migration: Add Vector Database Support for StartupNameAI
-- Description: Adds pgvector extension and creates tables for semantic name search
-- Version: 1.0.0
-- Date: 2024-01-XX

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create name embeddings table for semantic similarity search
CREATE TABLE IF NOT EXISTS name_embeddings (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  industry TEXT NOT NULL,
  style TEXT,
  keywords TEXT[],
  embedding vector(1536), -- OpenAI text-embedding-3-small dimensions
  brandability_score DECIMAL(3,1),
  domain_available BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  success_score DECIMAL(3,1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for efficient vector similarity search
CREATE INDEX IF NOT EXISTS name_embeddings_vector_idx 
ON name_embeddings USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Create indexes for filtering
CREATE INDEX IF NOT EXISTS name_embeddings_industry_idx ON name_embeddings (industry);
CREATE INDEX IF NOT EXISTS name_embeddings_style_idx ON name_embeddings (style);
CREATE INDEX IF NOT EXISTS name_embeddings_brandability_idx ON name_embeddings (brandability_score);
CREATE INDEX IF NOT EXISTS name_embeddings_domain_idx ON name_embeddings (domain_available);

-- Create successful names table for learning from user feedback
CREATE TABLE IF NOT EXISTS successful_names (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  industry TEXT NOT NULL,
  user_feedback JSONB,
  success_metrics JSONB,
  embedding vector(1536),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create index for successful names vector search
CREATE INDEX IF NOT EXISTS successful_names_vector_idx 
ON successful_names USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 50);

-- Create industry patterns table for analytics
CREATE TABLE IF NOT EXISTS industry_patterns (
  id SERIAL PRIMARY KEY,
  industry TEXT NOT NULL,
  pattern_type TEXT NOT NULL, -- 'length', 'suffix', 'prefix', 'style'
  pattern_value TEXT NOT NULL,
  frequency INTEGER DEFAULT 1,
  success_rate DECIMAL(5,2) DEFAULT 0,
  last_updated TIMESTAMP DEFAULT NOW(),
  UNIQUE(industry, pattern_type, pattern_value)
);

-- Create naming sessions table (enhanced)
CREATE TABLE IF NOT EXISTS naming_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  session_token TEXT UNIQUE,
  keywords TEXT[] NOT NULL,
  industry TEXT NOT NULL,
  style TEXT NOT NULL,
  name_count INTEGER DEFAULT 50,
  status TEXT DEFAULT 'pending',
  ai_model_used TEXT,
  generation_time_ms INTEGER,
  cache_hit BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

-- Create generated names table (enhanced)
CREATE TABLE IF NOT EXISTS generated_names (
  id SERIAL PRIMARY KEY,
  session_id INTEGER REFERENCES naming_sessions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  explanation TEXT,
  brandability_score DECIMAL(3,1),
  vector_similarity_score DECIMAL(3,1),
  domain_available BOOLEAN DEFAULT false,
  domain_extensions JSONB,
  seo_potential INTEGER,
  trademark_risk TEXT,
  user_rating INTEGER, -- 1-5 stars from user feedback
  selected_by_user BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for generated names
CREATE INDEX IF NOT EXISTS generated_names_session_idx ON generated_names (session_id);
CREATE INDEX IF NOT EXISTS generated_names_brandability_idx ON generated_names (brandability_score);
CREATE INDEX IF NOT EXISTS generated_names_selected_idx ON generated_names (selected_by_user);

-- Create user feedback table
CREATE TABLE IF NOT EXISTS user_feedback (
  id SERIAL PRIMARY KEY,
  session_id INTEGER REFERENCES naming_sessions(id),
  name_id INTEGER REFERENCES generated_names(id),
  feedback_type TEXT NOT NULL, -- 'rating', 'selection', 'download', 'share'
  feedback_value JSONB,
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create analytics table for tracking usage patterns
CREATE TABLE IF NOT EXISTS usage_analytics (
  id SERIAL PRIMARY KEY,
  event_type TEXT NOT NULL, -- 'generation', 'analysis', 'export', 'feedback'
  industry TEXT,
  style TEXT,
  user_type TEXT, -- 'anonymous', 'registered', 'premium'
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create index for analytics queries
CREATE INDEX IF NOT EXISTS usage_analytics_event_type_idx ON usage_analytics (event_type);
CREATE INDEX IF NOT EXISTS usage_analytics_created_at_idx ON usage_analytics (created_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for name_embeddings
CREATE TRIGGER update_name_embeddings_updated_at 
    BEFORE UPDATE ON name_embeddings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function for vector similarity search
CREATE OR REPLACE FUNCTION find_similar_names(
    query_embedding vector(1536),
    target_industry TEXT DEFAULT NULL,
    similarity_threshold FLOAT DEFAULT 0.7,
    result_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
    name TEXT,
    industry TEXT,
    style TEXT,
    brandability_score DECIMAL(3,1),
    similarity FLOAT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ne.name,
        ne.industry,
        ne.style,
        ne.brandability_score,
        1 - (ne.embedding <=> query_embedding) as similarity
    FROM name_embeddings ne
    WHERE 
        (target_industry IS NULL OR ne.industry = target_industry)
        AND 1 - (ne.embedding <=> query_embedding) > similarity_threshold
    ORDER BY ne.embedding <=> query_embedding
    LIMIT result_limit;
END;
$$ LANGUAGE plpgsql;

-- Create function to get industry insights
CREATE OR REPLACE FUNCTION get_industry_insights(target_industry TEXT)
RETURNS TABLE (
    avg_length FLOAT,
    avg_brandability FLOAT,
    common_patterns JSONB,
    domain_availability_rate FLOAT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        AVG(LENGTH(ne.name))::FLOAT as avg_length,
        AVG(ne.brandability_score)::FLOAT as avg_brandability,
        jsonb_agg(DISTINCT ne.style) as common_patterns,
        (COUNT(*) FILTER (WHERE ne.domain_available = true)::FLOAT / COUNT(*)::FLOAT) as domain_availability_rate
    FROM name_embeddings ne
    WHERE ne.industry = target_industry
    GROUP BY ne.industry;
END;
$$ LANGUAGE plpgsql;

-- Insert sample data for testing (optional)
-- INSERT INTO name_embeddings (name, industry, style, keywords, brandability_score, domain_available)
-- VALUES 
--   ('TechFlow', 'tech', 'modern', ARRAY['tech', 'flow'], 8.5, true),
--   ('DataSync', 'tech', 'professional', ARRAY['data', 'sync'], 7.8, false),
--   ('HealthPlus', 'health', 'classic', ARRAY['health', 'plus'], 8.2, true);

-- Create view for popular names by industry
CREATE OR REPLACE VIEW popular_names_by_industry AS
SELECT 
    industry,
    name,
    brandability_score,
    usage_count,
    success_score,
    domain_available
FROM name_embeddings
WHERE brandability_score >= 7.0
ORDER BY industry, success_score DESC, brandability_score DESC;

-- Create view for naming trends
CREATE OR REPLACE VIEW naming_trends AS
SELECT 
    DATE_TRUNC('week', created_at) as week,
    industry,
    style,
    COUNT(*) as session_count,
    AVG(name_count) as avg_names_requested
FROM naming_sessions
WHERE created_at >= NOW() - INTERVAL '3 months'
GROUP BY DATE_TRUNC('week', created_at), industry, style
ORDER BY week DESC, session_count DESC;

-- Grant permissions (adjust as needed for your setup)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO your_app_user;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO your_app_user;
-- GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO your_app_user;

-- Migration complete
SELECT 'Vector database migration completed successfully' as status;