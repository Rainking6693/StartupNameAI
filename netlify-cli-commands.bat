@echo off
REM Netlify CLI Commands with Token
REM Run this batch file to execute Netlify commands with the provided token

echo 🚨 NETLIFY DEPLOYMENT DIAGNOSTICS
echo ===================================

REM Set the Netlify token
set NETLIFY_AUTH_TOKEN=nfp_HAbpW9gHdsm43hq4yKt1qB8uoJB9uYKaef27

echo 📦 Checking Netlify CLI installation...
where netlify >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Installing Netlify CLI...
    npm install -g netlify-cli
)

echo.
echo 🔍 Checking authentication status...
netlify status

echo.
echo 📋 Listing sites...
netlify sites:list

echo.
echo 📊 Getting recent deployments...
netlify deploy:list --limit=10

echo.
echo 🔍 Getting deployment logs...
netlify logs:deploy

echo.
echo 🔧 Checking environment variables...
netlify env:list

echo.
echo 🏗️ Testing local build...
cd client
npm install
npm run build
cd ..

echo.
echo 🚀 Attempting manual deployment...
netlify deploy --dir=client/build --prod

echo.
echo ✅ Diagnostics complete!
echo Check the output above for any error messages.

pause