# Start PMFBY servers
Write-Host "🚀 Starting PMFBY Application Servers..." -ForegroundColor Cyan

# Start backend in background
Write-Host "`n📡 Starting Backend Server (Port 3000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; npm start"

Start-Sleep -Seconds 3

# Start frontend in background
Write-Host "🎨 Starting Frontend Server (Port 5173)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\client'; npm run dev"

Start-Sleep -Seconds 2

Write-Host "`n✅ Servers starting in separate windows!" -ForegroundColor Green
Write-Host "   Backend:  http://localhost:3000" -ForegroundColor White
Write-Host "   Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "`nWait for both servers to be ready, then open:" -ForegroundColor Cyan
Write-Host "   http://localhost:5173" -ForegroundColor Yellow
