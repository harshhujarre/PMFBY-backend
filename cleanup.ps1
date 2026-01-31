# Clean Restart Script for PMFBY Application
# This script kills all Node processes, cleans caches, and starts fresh

Write-Host "🧹 Cleaning up PMFBY application..." -ForegroundColor Cyan

# Step 1: Kill all Node processes
Write-Host "`n1️⃣ Stopping all Node.js processes..." -ForegroundColor Yellow
try {
    taskkill /F /IM node.exe 2>$null
    Write-Host "   ✅ All Node processes stopped" -ForegroundColor Green
} catch {
    Write-Host "   ℹ️  No Node processes were running" -ForegroundColor Gray
}

Start-Sleep -Seconds 2

# Step 2: Clean Vite cache
Write-Host "`n2️⃣ Cleaning Vite cache..." -ForegroundColor Yellow
$viteCachePath = ".\client\node_modules\.vite"
if (Test-Path $viteCachePath) {
    Remove-Item -Path $viteCachePath -Recurse -Force
    Write-Host "   ✅ Vite cache cleared" -ForegroundColor Green
} else {
    Write-Host "   ℹ️  No Vite cache found" -ForegroundColor Gray
}

# Step 3: Verify dependencies
Write-Host "`n3️⃣ Verifying dependencies..." -ForegroundColor Yellow
Set-Location .\client
npm list react-is --depth=0 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ react-is is installed" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Installing react-is..." -ForegroundColor Yellow
    npm install react-is --legacy-peer-deps
}
Set-Location ..

Write-Host "`n✅ Cleanup complete!" -ForegroundColor Green
Write-Host "`nNow run these commands in SEPARATE terminals:" -ForegroundColor Cyan
Write-Host "  Terminal 1: npm start                    (in PMFBY folder)" -ForegroundColor White
Write-Host "  Terminal 2: cd client && npm run dev     (in PMFBY/client folder)" -ForegroundColor White
Write-Host "`nOr just run: " -ForegroundColor Cyan
Write-Host "  .\start-servers.ps1" -ForegroundColor Yellow
