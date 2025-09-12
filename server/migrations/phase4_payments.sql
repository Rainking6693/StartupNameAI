-- Phase 4 Payment System Database Schema
-- Creates tables for package-based payments and premium features

-- Create payments table for Phase 4
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    session_id INTEGER NOT NULL,
    package_id VARCHAR(50) NOT NULL,
    stripe_checkout_id VARCHAR(255) UNIQUE,
    stripe_payment_intent_id VARCHAR(255),
    customer_email VARCHAR(255) NOT NULL,
    customer_name VARCHAR(255),
    amount INTEGER NOT NULL, -- Amount in cents
    original_amount INTEGER NOT NULL, -- Original price before discount
    currency VARCHAR(3) DEFAULT 'usd',
    status VARCHAR(50) DEFAULT 'pending', -- pending, completed, failed, cancelled
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_payments_session_id ON payments(session_id);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_checkout_id ON payments(stripe_checkout_id);
CREATE INDEX IF NOT EXISTS idx_payments_customer_email ON payments(customer_email);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at);

-- Add premium package column to naming_sessions table
ALTER TABLE naming_sessions 
ADD COLUMN IF NOT EXISTS premium_package VARCHAR(50),
ADD COLUMN IF NOT EXISTS upgraded_at TIMESTAMP;

-- Create package_features table for dynamic package configuration
CREATE TABLE IF NOT EXISTS package_features (
    id SERIAL PRIMARY KEY,
    package_id VARCHAR(50) NOT NULL,
    feature_name VARCHAR(100) NOT NULL,
    feature_description TEXT,
    is_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default package features
INSERT INTO package_features (package_id, feature_name, feature_description) VALUES
-- Basic Package Features
('basic', 'all_names', 'Access to all generated names'),
('basic', 'basic_analysis', 'Basic brandability analysis'),
('basic', 'copy_export', 'Copy and export functionality'),
('basic', 'domain_suggestions', 'Domain name suggestions'),
('basic', 'email_support', 'Email customer support'),

-- Premium Package Features
('premium', 'all_names', 'Access to all generated names'),
('premium', 'advanced_analysis', 'Advanced brandability analysis'),
('premium', 'domain_checking', 'Real-time domain availability checking'),
('premium', 'pdf_export', 'PDF export with branding guide'),
('premium', 'priority_support', 'Priority customer support'),
('premium', 'trademark_screening', 'Basic trademark screening guidance'),
('premium', 'bonus_variations', 'Additional name variations'),

-- Enterprise Package Features
('enterprise', 'all_names', 'Access to all generated names'),
('enterprise', 'advanced_analysis', 'Advanced brandability analysis'),
('enterprise', 'domain_checking', 'Real-time domain availability checking'),
('enterprise', 'pdf_export', 'PDF export with branding guide'),
('enterprise', 'priority_support', '24/7 priority customer support'),
('enterprise', 'trademark_screening', 'Comprehensive trademark screening'),
('enterprise', 'custom_logos', 'Custom logo concept generation'),
('enterprise', 'white_label', 'White-label usage rights'),
('enterprise', 'account_manager', 'Dedicated account manager'),
('enterprise', 'custom_consultation', 'Custom branding consultation')
ON CONFLICT DO NOTHING;

-- Create user_sessions table for tracking premium access
CREATE TABLE IF NOT EXISTS user_sessions (
    id SERIAL PRIMARY KEY,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    user_email VARCHAR(255),
    premium_tier VARCHAR(50) DEFAULT 'free',
    package_id VARCHAR(50),
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for user_sessions
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_email ON user_sessions(user_email);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);

-- Create analytics table for tracking conversions
CREATE TABLE IF NOT EXISTS conversion_analytics (
    id SERIAL PRIMARY KEY,
    session_id INTEGER,
    event_type VARCHAR(100) NOT NULL, -- view_freemium_modal, click_upgrade, complete_payment, etc.
    package_id VARCHAR(50),
    user_email VARCHAR(255),
    metadata JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for analytics
CREATE INDEX IF NOT EXISTS idx_analytics_session_id ON conversion_analytics(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON conversion_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON conversion_analytics(created_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for payments table
DROP TRIGGER IF EXISTS update_payments_updated_at ON payments;
CREATE TRIGGER update_payments_updated_at
    BEFORE UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create view for payment statistics
CREATE OR REPLACE VIEW payment_stats AS
SELECT 
    package_id,
    COUNT(*) as total_payments,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_payments,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_payments,
    COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_payments,
    SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END) as total_revenue,
    AVG(CASE WHEN status = 'completed' THEN amount ELSE NULL END) as avg_payment_amount,
    MIN(created_at) as first_payment,
    MAX(created_at) as last_payment
FROM payments
GROUP BY package_id;

-- Create view for conversion funnel analysis
CREATE OR REPLACE VIEW conversion_funnel AS
SELECT 
    DATE(created_at) as date,
    COUNT(CASE WHEN event_type = 'view_freemium_modal' THEN 1 END) as freemium_views,
    COUNT(CASE WHEN event_type = 'click_upgrade' THEN 1 END) as upgrade_clicks,
    COUNT(CASE WHEN event_type = 'complete_payment' THEN 1 END) as completed_payments,
    ROUND(
        COUNT(CASE WHEN event_type = 'click_upgrade' THEN 1 END)::numeric / 
        NULLIF(COUNT(CASE WHEN event_type = 'view_freemium_modal' THEN 1 END), 0) * 100, 
        2
    ) as modal_to_click_rate,
    ROUND(
        COUNT(CASE WHEN event_type = 'complete_payment' THEN 1 END)::numeric / 
        NULLIF(COUNT(CASE WHEN event_type = 'click_upgrade' THEN 1 END), 0) * 100, 
        2
    ) as click_to_payment_rate
FROM conversion_analytics
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Grant permissions (adjust as needed for your setup)
-- GRANT SELECT, INSERT, UPDATE ON payments TO app_user;
-- GRANT SELECT, INSERT, UPDATE ON user_sessions TO app_user;
-- GRANT SELECT, INSERT ON conversion_analytics TO app_user;
-- GRANT SELECT ON package_features TO app_user;
-- GRANT SELECT ON payment_stats TO app_user;
-- GRANT SELECT ON conversion_funnel TO app_user;

-- Insert sample data for testing (remove in production)
-- INSERT INTO payments (session_id, package_id, stripe_checkout_id, customer_email, customer_name, amount, original_amount, status)
-- VALUES 
-- (1, 'premium', 'cs_test_123', 'test@example.com', 'Test User', 999, 1999, 'completed'),
-- (2, 'basic', 'cs_test_456', 'test2@example.com', 'Test User 2', 299, 599, 'completed');

COMMIT;
"