# Node Project Bootstrap Script (Minimal Version)
# Run this inside a repo root to set up Node guardrails

Write-Host "==> Bootstrapping Node project guardrails..." -ForegroundColor Green

# 1. Ensure package.json exists
if (-not (Test-Path "package.json")) {
  Write-Host "No package.json found. Initializing npm project..."
  npm init -y
}

# 2. Force Node version pin to 20.17.0
"20.17.0" | Out-File -Encoding ascii .nvmrc
Write-Host "Pinned Node version to 20.17.0 in .nvmrc"

# 3. Install devDependencies
Write-Host "Installing ESLint, Prettier, Husky, lint-staged, dotenv-cli..."
npm install -D eslint@8 prettier husky lint-staged dotenv-cli

# 4. Create ESLint config if missing
if (-not (Test-Path ".eslintrc.json")) {
  @'
{
  "env": { "browser": true, "es2021": true },
  "extends": ["eslint:recommended"],
  "parserOptions": { "ecmaVersion": "latest", "sourceType": "module" },
  "rules": {}
}
'@ | Out-File -Encoding utf8 .eslintrc.json
  Write-Host "Added default .eslintrc.json"
}

# 5. Create Prettier config if missing
if (-not (Test-Path ".prettierrc")) {
  @'
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5"
}
'@ | Out-File -Encoding utf8 .prettierrc
  Write-Host "Added default .prettierrc"
}

# 6. Initialize Husky (modern way)
npx husky init
Set-Content .husky/pre-commit "npx lint-staged"
Write-Host "Husky pre-commit hook set to run lint-staged"

# 7. Add lint-staged config into package.json if missing
$pkg = Get-Content package.json | ConvertFrom-Json
if (-not $pkg.'lint-staged') {
  $pkg | Add-Member -MemberType NoteProperty -Name 'lint-staged' -Value @{
    "*.js" = @("eslint --fix", "prettier --write")
  }
  $pkg | ConvertTo-Json -Depth 10 | Out-File -Encoding utf8 package.json
  Write-Host "Added lint-staged config to package.json."
}

# 8. Finish
Write-Host "==> Node project bootstrap complete! Remember to run:" -ForegroundColor Green
Write-Host "   nvm install 20.17.0" -ForegroundColor Yellow
Write-Host "   nvm use 20.17.0" -ForegroundColor Yellow
