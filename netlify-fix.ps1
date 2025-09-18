# Netlify Deployment Fix Script (PowerShell)
# Run with: powershell -ExecutionPolicy Bypass -File netlify-fix.ps1

Write-Host "🚨 NETLIFY DEPLOYMENT FIX SCRIPT" -ForegroundColor Red
Write-Host "=================================" -ForegroundColor Red

# Set Netlify token
$env:NETLIFY_AUTH_TOKEN = "nfp_HAbpW9gHdsm43hq4yKt1qB8uoJB9uYKaef27"

Write-Host "`n📦 Checking Netlify CLI..." -ForegroundColor Yellow

# Check if Netlify CLI is installed
try {
    netlify --version | Out-Null
    Write-Host "✅ Netlify CLI is installed" -ForegroundColor Green
} catch {
    Write-Host "📦 Installing Netlify CLI..." -ForegroundColor Yellow
    npm install -g netlify-cli
}

Write-Host "`n🔍 Checking authentication..." -ForegroundColor Yellow
netlify status

Write-Host "`n📋 Listing sites..." -ForegroundColor Yellow
netlify sites:list

Write-Host "`n📊 Getting recent deployments..." -ForegroundColor Yellow
netlify deploy:list --limit=10

Write-Host "`n🔍 Getting deployment logs..." -ForegroundColor Yellow
netlify logs:deploy

Write-Host "`n🔧 Checking environment variables..." -ForegroundColor Yellow
netlify env:list

Write-Host "`n🏗️ Testing local build..." -ForegroundColor Yellow
Set-Location client
npm install
npm run build
Set-Location ..

Write-Host "`n🚀 Attempting manual deployment..." -ForegroundColor Yellow
netlify deploy --dir=client/build --prod

Write-Host "`n✅ Fix script completed!" -ForegroundColor Green
Write-Host "Check the output above for any error messages." -ForegroundColor Cyan

# Common fixes to try
Write-Host "`n💡 COMMON FIXES TO TRY:" -ForegroundColor Cyan
Write-Host "1. Clear cache: Go to Netlify Dashboard → Build & Deploy → Clear cache" -ForegroundColor White
Write-Host "2. Check build command: Should be 'npm install && npm run build'" -ForegroundColor White
Write-Host "3. Check publish directory: Should be 'client/build'" -ForegroundColor White
Write-Host "4. Check base directory: Should be 'client'" -ForegroundColor White
Write-Host "5. Verify environment variables are set correctly" -ForegroundColor White

Read-Host "`nPress Enter to continue..."