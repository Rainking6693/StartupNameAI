#!/bin/bash

# Emergency rollback script for StartupnameAI
# Restores the previous deployment on Netlify

set -e

NETLIFY_SITE_ID=${NETLIFY_SITE_ID}
NETLIFY_AUTH_TOKEN=${NETLIFY_AUTH_TOKEN}
DEPLOY_ID=${1}

echo "🚨 Initiating emergency rollback..."

# Validate environment variables
if [[ -z "$NETLIFY_SITE_ID" ]]; then
    echo "❌ Error: NETLIFY_SITE_ID environment variable not set"
    exit 1
fi

if [[ -z "$NETLIFY_AUTH_TOKEN" ]]; then
    echo "❌ Error: NETLIFY_AUTH_TOKEN environment variable not set"
    exit 1
fi

# Get current deployment info
echo "🔍 Getting current deployment info..."
npx netlify-cli api sites/$NETLIFY_SITE_ID --json > current-site.json

CURRENT_DEPLOY_ID=$(cat current-site.json | jq -r '.published_deploy.id')
echo "📄 Current deployment ID: $CURRENT_DEPLOY_ID"

# If specific deploy ID not provided, get the previous one
if [[ -z "$DEPLOY_ID" ]]; then
    echo "🔍 Finding previous deployment..."
    npx netlify-cli api sites/$NETLIFY_SITE_ID/deploys --json > deploys.json
    
    # Get the second deployment (previous one)
    DEPLOY_ID=$(cat deploys.json | jq -r '.[1].id')
    
    if [[ "$DEPLOY_ID" == "null" || -z "$DEPLOY_ID" ]]; then
        echo "❌ Error: Could not find previous deployment to rollback to"
        exit 1
    fi
fi

echo "⏮️ Rolling back to deployment: $DEPLOY_ID"

# Perform rollback
echo "🔄 Restoring deployment..."
npx netlify-cli api sites/$NETLIFY_SITE_ID/deploys/$DEPLOY_ID/restore --data '{}' --json

# Wait for rollback to complete
echo "⏳ Waiting for rollback to complete..."
sleep 30

# Verify rollback
echo "✅ Verifying rollback..."
npx netlify-cli api sites/$NETLIFY_SITE_ID --json > rollback-site.json

NEW_DEPLOY_ID=$(cat rollback-site.json | jq -r '.published_deploy.id')

if [[ "$NEW_DEPLOY_ID" == "$DEPLOY_ID" ]]; then
    echo "✅ Rollback successful!"
    echo "🌐 Site restored to deployment: $NEW_DEPLOY_ID"
    
    # Basic health check
    SITE_URL=$(cat rollback-site.json | jq -r '.url')
    echo "🔍 Running health check on $SITE_URL"
    
    if curl -f "$SITE_URL" -o /dev/null -s; then
        echo "✅ Site is accessible after rollback"
    else
        echo "⚠️ Warning: Site may not be immediately accessible"
    fi
    
else
    echo "❌ Rollback may have failed"
    echo "Expected deploy ID: $DEPLOY_ID"
    echo "Current deploy ID: $NEW_DEPLOY_ID"
    exit 1
fi

# Log rollback event
echo "{
  \"event\": \"rollback\",
  \"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)\",
  \"fromDeployId\": \"$CURRENT_DEPLOY_ID\",
  \"toDeployId\": \"$DEPLOY_ID\",
  \"siteUrl\": \"$SITE_URL\"
}" > rollback-log.json

echo "📋 Rollback event logged to rollback-log.json"

# Cleanup
rm -f current-site.json deploys.json rollback-site.json

echo "🎉 Emergency rollback completed successfully!"
