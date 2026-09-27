# PowerShell Runner for AI Student & Career Agent
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "   Starting AI Student & Career Agent (Full Stack)" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

$root = $PSScriptRoot

Write-Host "`n[1/2] Starting Backend Server (http://127.0.0.1:8000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root'; py -3 -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload"

Start-Sleep -Seconds 3

Write-Host "[2/2] Starting Frontend Dev Server (http://localhost:5173)..." -ForegroundColor Green
$frontendPath = Join-Path $root "frontend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; npm run dev"

Write-Host "`nServers started in separate windows!" -ForegroundColor Yellow
Write-Host "Frontend:  http://localhost:5173" -ForegroundColor White
Write-Host "Backend health: http://127.0.0.1:8000/api/health" -ForegroundColor White
