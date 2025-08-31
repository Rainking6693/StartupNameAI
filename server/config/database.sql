-- StartupNamer.org Database Schema
-- Optimized for performance monitoring and analytics

-- Enable UUID extension for PostgreSQL
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For text search optimization

-- User management
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    is_premium BOOLEAN DEFAULT FALSE,
    subscription_status VARCHAR(50) DEFAULT 'free',
    subscription_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE,
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    reset_password_token VARCHAR(255),
    reset_password_expires TIMESTAMP WITH TIME ZONE
);

-- Naming sessions for tracking user interactions
CREATE TABLE IF NOT EXISTS naming_sessions (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    session_token VARCHAR(255) NOT NULL,
    keywords TEXT[] NOT NULL,
    industry VARCHAR(50) NOT NULL,
    style VARCHAR(50) NOT NULL,
    name_count INTEGER NOT NULL DEFAULT 50,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    ip_address INET,
    user_agent TEXT
);

-- Generated names storage
CREATE TABLE IF NOT EXISTS generated_names (
    id BIGSERIAL PRIMARY KEY,
    session_id BIGINT NOT NULL REFERENCES naming_sessions(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    explanation TEXT,
    brandability_score DECIMAL(3,1),
    domain_available BOOLEAN DEFAULT FALSE,
    domain_extensions JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5),
    user_feedback TEXT
);

-- Web Vitals collection for performance monitoring
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
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    ip_address INET,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    device_type VARCHAR(50),
    viewport_width INTEGER,
    viewport_height INTEGER,
    screen_resolution VARCHAR(50),
    page_load_time DECIMAL(8,2),
    dom_content_loaded DECIMAL(8,2),
    first_paint DECIMAL(8,2)
);

-- Performance alerts and monitoring
CREATE TABLE IF NOT EXISTS performance_alerts (
    id BIGSERIAL PRIMARY KEY,
    alert_type VARCHAR(50) NOT NULL, -- 'lcp_degradation', 'cls_spike', etc.
    url TEXT NOT NULL,
    metric_name VARCHAR(20) NOT NULL,
    threshold_value DECIMAL(8,2) NOT NULL,
    actual_value DECIMAL(8,2) NOT NULL,
    severity VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
    status VARCHAR(20) DEFAULT 'open', -- 'open', 'acknowledged', 'resolved'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    notes TEXT
);

-- API usage tracking for rate limiting and analytics
CREATE TABLE IF NOT EXISTS api_usage (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    ip_address INET NOT NULL,
    endpoint VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL,
    status_code INTEGER NOT NULL,
    response_time_ms INTEGER,
    request_size INTEGER,
    response_size INTEGER,
    user_agent TEXT,
    referer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    session_token VARCHAR(255),
    rate_limited BOOLEAN DEFAULT FALSE,
    error_message TEXT
);

-- Payment and subscription tracking
CREATE TABLE IF NOT EXISTS payments (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    stripe_payment_intent_id VARCHAR(255) UNIQUE NOT NULL,
    amount INTEGER NOT NULL, -- Amount in cents
    currency VARCHAR(3) DEFAULT 'usd',
    status VARCHAR(50) NOT NULL,
    description TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- System health and monitoring
CREATE TABLE IF NOT EXISTS system_health (
    id BIGSERIAL PRIMARY KEY,
    service_name VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL, -- 'healthy', 'degraded', 'down'
    response_time_ms INTEGER,
    error_rate DECIMAL(5,2), -- Percentage
    cpu_usage DECIMAL(5,2), -- Percentage
    memory_usage DECIMAL(5,2), -- Percentage
    disk_usage DECIMAL(5,2), -- Percentage
    active_connections INTEGER,
    queue_size INTEGER,
    last_error TEXT,
    checked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance optimization

-- Web Vitals indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_web_vitals_url ON web_vitals(url);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_web_vitals_created_at ON web_vitals(created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_web_vitals_user_id ON web_vitals(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_web_vitals_session_id ON web_vitals(session_id) WHERE session_id IS NOT NULL;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_web_vitals_lcp ON web_vitals(lcp) WHERE lcp IS NOT NULL;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_web_vitals_inp ON web_vitals(inp) WHERE inp IS NOT NULL;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_web_vitals_cls ON web_vitals(cls) WHERE cls IS NOT NULL;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_web_vitals_composite ON web_vitals(url, created_at DESC, lcp, inp, cls);

-- Naming sessions indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_naming_sessions_user_id ON naming_sessions(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_naming_sessions_created_at ON naming_sessions(created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_naming_sessions_status ON naming_sessions(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_naming_sessions_industry ON naming_sessions(industry);

-- Generated names indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_generated_names_session_id ON generated_names(session_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_generated_names_brandability ON generated_names(brandability_score DESC NULLS LAST);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_generated_names_name_trgm ON generated_names USING gin (name gin_trgm_ops);

-- API usage indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_api_usage_created_at ON api_usage(created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_api_usage_user_id ON api_usage(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_api_usage_ip_endpoint ON api_usage(ip_address, endpoint, created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_api_usage_rate_limited ON api_usage(created_at DESC) WHERE rate_limited = true;

-- Performance alerts indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_performance_alerts_status ON performance_alerts(status) WHERE status != 'resolved';
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_performance_alerts_url ON performance_alerts(url);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_performance_alerts_created_at ON performance_alerts(created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_performance_alerts_severity ON performance_alerts(severity, created_at DESC);

-- User indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_premium ON users(is_premium) WHERE is_premium = true;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_created_at ON users(created_at DESC);

-- System health indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_system_health_service ON system_health(service_name, checked_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_system_health_status ON system_health(status, checked_at DESC) WHERE status != 'healthy';

-- Views for common queries

-- Performance summary view
CREATE OR REPLACE VIEW performance_summary AS
SELECT 
    url,
    DATE_TRUNC('hour', created_at) as hour,
    COUNT(*) as measurements,
    ROUND(AVG(lcp), 2) as avg_lcp,
    ROUND(PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY lcp), 2) as p75_lcp,
    ROUND(AVG(inp), 2) as avg_inp, 
    ROUND(PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY inp), 2) as p75_inp,
    ROUND(AVG(cls), 4) as avg_cls,
    ROUND(PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY cls), 4) as p75_cls,
    ROUND(AVG(fcp), 2) as avg_fcp,
    ROUND(AVG(ttfb), 2) as avg_ttfb
FROM web_vitals 
WHERE created_at > CURRENT_TIMESTAMP - INTERVAL '7 days'
GROUP BY url, DATE_TRUNC('hour', created_at)
ORDER BY hour DESC;

-- User activity summary view
CREATE OR REPLACE VIEW user_activity_summary AS
SELECT 
    u.id,
    u.email,
    u.is_premium,
    u.created_at as user_since,
    COUNT(DISTINCT ns.id) as total_sessions,
    COUNT(DISTINCT gn.id) as total_names_generated,
    MAX(ns.created_at) as last_session,
    COUNT(DISTINCT DATE(ns.created_at)) as active_days
FROM users u
LEFT JOIN naming_sessions ns ON u.id = ns.user_id
LEFT JOIN generated_names gn ON ns.id = gn.session_id
GROUP BY u.id, u.email, u.is_premium, u.created_at;

-- API performance view
CREATE OR REPLACE VIEW api_performance AS
SELECT 
    endpoint,
    method,
    DATE_TRUNC('hour', created_at) as hour,
    COUNT(*) as requests,
    AVG(response_time_ms) as avg_response_time,
    PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY response_time_ms) as p95_response_time,
    COUNT(*) FILTER (WHERE status_code >= 400) as error_count,
    COUNT(*) FILTER (WHERE rate_limited = true) as rate_limited_count
FROM api_usage
WHERE created_at > CURRENT_TIMESTAMP - INTERVAL '7 days'
GROUP BY endpoint, method, DATE_TRUNC('hour', created_at)
ORDER BY hour DESC, requests DESC;

-- Triggers for automatic updates

-- Update user updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-cleanup function for old data
CREATE OR REPLACE FUNCTION cleanup_old_data()
RETURNS void AS $$
BEGIN
    -- Keep Web Vitals for 90 days
    DELETE FROM web_vitals WHERE created_at < CURRENT_TIMESTAMP - INTERVAL '90 days';
    
    -- Keep API usage for 30 days  
    DELETE FROM api_usage WHERE created_at < CURRENT_TIMESTAMP - INTERVAL '30 days';
    
    -- Keep resolved performance alerts for 30 days
    DELETE FROM performance_alerts 
    WHERE status = 'resolved' AND resolved_at < CURRENT_TIMESTAMP - INTERVAL '30 days';
    
    -- Keep system health for 7 days
    DELETE FROM system_health WHERE checked_at < CURRENT_TIMESTAMP - INTERVAL '7 days';
    
    -- Cleanup old naming sessions (keep for 1 year)
    DELETE FROM naming_sessions WHERE created_at < CURRENT_TIMESTAMP - INTERVAL '1 year';
END;
$$ LANGUAGE plpgsql;

-- Performance optimization settings
ALTER SYSTEM SET shared_preload_libraries = 'pg_stat_statements';
ALTER SYSTEM SET track_activities = on;
ALTER SYSTEM SET track_counts = on;
ALTER SYSTEM SET track_io_timing = on;
ALTER SYSTEM SET log_min_duration_statement = 1000; -- Log slow queries

-- Partitioning for web_vitals table (for high-volume scenarios)
-- This would be implemented based on actual usage patterns

COMMENT ON TABLE web_vitals IS 'Stores Core Web Vitals metrics for performance monitoring';
COMMENT ON TABLE performance_alerts IS 'Automated alerts for performance regressions';
COMMENT ON TABLE api_usage IS 'API usage tracking for rate limiting and analytics';
COMMENT ON TABLE naming_sessions IS 'User naming sessions with AI generation metadata';
COMMENT ON TABLE generated_names IS 'AI-generated startup names with quality scores';
COMMENT ON TABLE system_health IS 'System health monitoring and metrics';

-- Grant permissions (adjust based on your user setup)
-- GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO app_user;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app_user;