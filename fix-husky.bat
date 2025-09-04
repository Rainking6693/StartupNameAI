@echo off
echo 🔧 Fixing Husky pre-commit hook...

cd /d "%~dp0"

echo 📦 Reinstalling Husky...
call npm run prepare

if %errorlevel% neq 0 (
    echo ❌ npm run prepare failed, trying alternative...
    call npx husky install
)

echo ✅ Husky fix completed!
echo 🎉 You should now be able to commit.

pause