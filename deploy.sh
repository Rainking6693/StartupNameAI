#!/bin/bash

# StartupNamer.org Backend Deployment Script
# Deploys to Railway.app with PostgreSQL database

echo "🚀 Starting StartupNamer.org Backend Deployment..."

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

# Login to Railway (if not already logged in)
echo "🔐 Checking Railway authentication..."
railway login

# Create new Railway project
echo "📦 Creating Railway project..."
railway init startupnamer-backend

# Add PostgreSQL database
echo "🗄️ Adding PostgreSQL database..."
railway add postgresql

# Set environment variables
echo "⚙️ Setting environment variables..."
railway variables set NODE_ENV=production
railway variables set API_VERSION=v1
railway variables set CORS_ORIGIN=https://startupnamer.org,https://www.startupnamer.org
railway variables set RATE_LIMIT_WINDOW=15
railway variables set RATE_LIMIT_MAX=100
railway variables set AI_RATE_LIMIT_WINDOW=15
railway variables set AI_RATE_LIMIT_MAX=10
railway variables set LOG_LEVEL=info
railway variables set ENABLE_COMMUNITY=true
railway variables set ENABLE_EXPERT_REVIEWS=true
railway variables set ENABLE_TRADEMARK_CHECK=true
railway variables set ENABLE_DOMAIN_SUGGESTIONS=true

# Deploy the application
echo "🚀 Deploying to Railway..."
cd server
railway up

echo "✅ Deployment initiated! Check Railway dashboard for status."
echo "🌐 Your backend will be available at: https://startupnamer-backend.railway.app"
echo "🏥 Health check: https://startupnamer-backend.railway.app/api/health"