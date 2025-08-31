#!/bin/bash

# Deployment script for StartupnameAI
# Handles both staging and production deployments with validation

set -e

ENVIRONMENT=${1:-staging}
BUILD_DIR="client/build"
NETLIFY_SITE_ID=${NETLIFY_SITE_ID}
NETLIFY_AUTH_TOKEN=${NETLIFY_AUTH_TOKEN}

echo "🚀 Starting deployment to $ENVIRONMENT environment..."

# Validate environment variables
if [[ -z "$NETLIFY_SITE_ID" ]]; then
    echo "❌ Error: NETLIFY_SITE_ID environment variable not set"
    exit 1
fi

if [[ -z "$NETLIFY_AUTH_TOKEN" ]]; then
    echo "❌ Error: NETLIFY_AUTH_TOKEN environment variable not set"
    exit 1
fi

# Validate build directory exists
if [[ ! -d "$BUILD_DIR" ]]; then
    echo "❌ Error: Build directory '$BUILD_DIR' not found. Run 'npm run build' first."
    exit 1
fi

# Pre-deployment validation
echo "🔍 Running pre-deployment validation..."

# Validate HTML
echo "📄 Validating HTML structure..."
node scripts/validate-html.js "$BUILD_DIR"

# Validate SEO
echo "🔍 Validating SEO elements..."
node scripts/validate-seo.js "$BUILD_DIR"

# Check critical files exist
CRITICAL_FILES=("index.html" "sitemap.xml" "robots.txt")
for file in "${CRITICAL_FILES[@]}"; do
    if [[ ! -f "$BUILD_DIR/$file" ]]; then
        echo "❌ Error: Critical file '$file' not found in build directory"
        exit 1
    fi
done

echo "✅ Pre-deployment validation passed"

# Deploy based on environment
if [[ "$ENVIRONMENT" == "production" ]]; then
    echo "🎯 Deploying to production..."
    
    # Production deployment with additional checks
    npx netlify-cli deploy --dir="$BUILD_DIR" --prod --json > deploy-output.json
    
    DEPLOY_URL=$(cat deploy-output.json | jq -r '.url')
    echo "🌟 Production deployment complete: $DEPLOY_URL"
    
    # Post-deployment health checks
    echo "🔍 Running production health checks..."
    
    # Wait for deployment to propagate
    sleep 60
    
    # Basic health checks
    curl -f "$DEPLOY_URL" -o /dev/null -s
    curl -f "$DEPLOY_URL/sitemap.xml" -o /dev/null -s
    curl -f "$DEPLOY_URL/robots.txt" -o /dev/null -s
    
    echo "✅ Production health checks passed"
    
    # Run production Lighthouse audit
    echo "⚡ Running production performance audit..."
    lhci autorun --config=lighthouserc-production.json || echo "⚠️ Performance audit completed with warnings"
    
else
    echo "🚀 Deploying to staging..."
    
    # Staging deployment
    npx netlify-cli deploy --dir="$BUILD_DIR" --json > deploy-output.json
    
    DEPLOY_URL=$(cat deploy-output.json | jq -r '.deploy_url')
    echo "🌟 Staging deployment complete: $DEPLOY_URL"
    
    # Basic staging validation
    echo "🔍 Validating staging deployment..."
    sleep 30
    
    curl -f "$DEPLOY_URL" -o /dev/null -s
    echo "✅ Staging deployment validation passed"
fi

# Save deployment info
echo "{
  \"environment\": \"$ENVIRONMENT\",
  \"deployUrl\": \"$DEPLOY_URL\",
  \"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)\",
  \"buildDir\": \"$BUILD_DIR\"
}" > deployment-info.json

echo "📋 Deployment info saved to deployment-info.json"

# Cleanup
rm -f deploy-output.json

echo "🎉 Deployment to $ENVIRONMENT completed successfully!"
echo "🌐 URL: $DEPLOY_URL"
