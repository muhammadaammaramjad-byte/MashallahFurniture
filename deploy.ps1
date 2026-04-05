# ============================================
# MASHAALLAHFURNITURE - DEPLOYMENT SCRIPT
# Run this in PowerShell as Administrator
# ============================================

param(
    [switch]$SkipTests,
    [switch]$SkipBuild,
    [switch]$DeployNetlify,
    [switch]$DeployGitHub
)

# Color functions for better output
function Write-Success { Write-Host "✅ $args" -ForegroundColor Green }
function Write-Error { Write-Host "❌ $args" -ForegroundColor Red }
function Write-Info { Write-Host "📌 $args" -ForegroundColor Cyan }
function Write-Warning { Write-Host "⚠️ $args" -ForegroundColor Yellow }
function Write-Step { Write-Host "`n🚀 $args" -ForegroundColor Magenta }

Clear-Host
Write-Step "MASHAALLAHFURNITURE DEPLOYMENT SCRIPT"
Write-Info "Starting deployment process at $(Get-Date)"

# Navigate to project directory
$projectPath = "c:\Users\nyvra\Downloads\New folder\MashallahFurniture"
Set-Location $projectPath
Write-Success "Project directory: $projectPath"

# ============================================
# STEP 1: Check Node.js and npm
# ============================================
Write-Step "STEP 1: Checking Node.js and npm"

try {
    $nodeVersion = node --version 2>$null
    $npmVersion = npm --version 2>$null
    
    if ($nodeVersion -and $npmVersion) {
        Write-Success "Node.js version: $nodeVersion"
        Write-Success "npm version: $npmVersion"
    } else {
        Write-Error "Node.js or npm not found. Please install Node.js from https://nodejs.org/"
        exit 1
    }
} catch {
    Write-Error "Node.js or npm not found. Please install Node.js from https://nodejs.org/"
    exit 1
}

# ============================================
# STEP 2: Install dependencies
# ============================================
Write-Step "STEP 2: Installing dependencies"

if (Test-Path "node_modules") {
    Write-Info "node_modules already exists. Skipping installation..."
} else {
    Write-Info "Installing dependencies..."
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Dependencies installed successfully"
    } else {
        Write-Error "Failed to install dependencies"
        exit 1
    }
}

# ============================================
# STEP 3: Run health check
# ============================================
if (-not $SkipTests) {
    Write-Step "STEP 3: Running health check"
    
    npm run health
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Health check passed"
    } else {
        Write-Error "Health check failed"
        Write-Warning "Continuing anyway..."
    }
}

# ============================================
# STEP 4: Run build
# ============================================
if (-not $SkipBuild) {
    Write-Step "STEP 4: Building project"
    
    Write-Info "Running npm run build..."
    npm run build
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Build completed successfully"
        
        # Check dist folder
        if (Test-Path "dist") {
            $distSize = (Get-ChildItem -Path "dist" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
            Write-Success "dist folder size: $([math]::Round($distSize, 2)) MB"
            
            # List built files
            $htmlFiles = Get-ChildItem -Path "dist" -Filter "*.html" -Recurse
            Write-Info "Generated HTML files: $($htmlFiles.Count)"
        } else {
            Write-Error "dist folder not created"
            exit 1
        }
    } else {
        Write-Error "Build failed"
        exit 1
    }
}

# ============================================
# STEP 5: Git operations
# ============================================
Write-Step "STEP 5: Git operations"

# Check git status
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Info "Changes detected:"
    Write-Host $gitStatus -ForegroundColor Yellow
    
    $commitMessage = Read-Host "Enter commit message (or press Enter for default)"
    if (-not $commitMessage) {
        $commitMessage = "chore: update deployment $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
    }
    
    git add .
    git commit -m $commitMessage
    Write-Success "Changes committed"
} else {
    Write-Info "No changes to commit"
}

# Push to GitHub
Write-Info "Pushing to GitHub..."
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Success "Pushed to GitHub successfully"
} else {
    Write-Error "Failed to push to GitHub"
}

# ============================================
# STEP 6: Deploy to Netlify
# ============================================
if ($DeployNetlify) {
    Write-Step "STEP 6: Deploying to Netlify"
    
    # Check if Netlify CLI is installed
    $netlifyCli = Get-Command netlify -ErrorAction SilentlyContinue
    
    if (-not $netlifyCli) {
        Write-Warning "Netlify CLI not found. Installing..."
        npm install -g netlify-cli
    }
    
    # Login to Netlify if not already
    Write-Info "Checking Netlify authentication..."
    netlify status
    
    if ($LASTEXITCODE -ne 0) {
        Write-Info "Please login to Netlify..."
        netlify login
    }
    
    # Deploy to production
    Write-Info "Deploying to Netlify production..."
    netlify deploy --prod
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Deployed to Netlify successfully!"
    } else {
        Write-Error "Netlify deployment failed"
    }
}

# ============================================
# STEP 7: Deploy to GitHub Pages (optional)
# ============================================
if ($DeployGitHub) {
    Write-Step "STEP 7: Deploying to GitHub Pages"
    
    # Install gh-pages if not present
    if (-not (Test-Path "node_modules/gh-pages")) {
        npm install --save-dev gh-pages
    }
    
    # Add deploy script to package.json if not present
    $packageJson = Get-Content "package.json" | ConvertFrom-Json
    if (-not $packageJson.scripts."deploy:github") {
        Write-Info "Adding GitHub Pages deploy script..."
        $packageJson.scripts | Add-Member -MemberType NoteProperty -Name "deploy:github" -Value "gh-pages -d dist"
        $packageJson | ConvertTo-Json -Depth 10 | Set-Content "package.json"
    }
    
    npm run deploy:github
    Write-Success "Deployed to GitHub Pages!"
}

# ============================================
# STEP 8: Local preview
# ============================================
Write-Step "STEP 8: Local preview"

Write-Info "Starting local preview server..."
Write-Info "Press Ctrl+C to stop the server"

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectPath'; npm run preview"

Write-Success "Preview server started at http://localhost:4173"

# ============================================
# SUMMARY
# ============================================
Write-Step "DEPLOYMENT SUMMARY"
Write-Success "✅ Project: MashallahFurniture"
Write-Success "✅ Status: Deployment completed"
Write-Success "✅ Live URL: https://mashallah-furniture.netlify.app"
Write-Success "✅ GitHub: https://github.com/muhammadaammaramjad-byte/MashallahFurniture"

Write-Info "`nNext steps:"
Write-Info "1. Test your site at https://mashallah-furniture.netlify.app"
Write-Info "2. Check Netlify dashboard for build logs"
Write-Info "3. Verify all pages load correctly"

Write-Success "`n🎉 Deployment complete! 🎉"
