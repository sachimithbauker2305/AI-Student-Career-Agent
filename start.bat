@echo off
title AI Student & Career Agent Runner
echo ========================================================
echo   Starting AI Student & Career Agent (Full Stack)
echo ========================================================
echo.

echo [1/2] Launching Backend Server on http://127.0.0.1:8000 ...
start "Backend - FastAPI" cmd /k "py -3 -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload"

timeout /t 3 /nobreak >nul

echo [2/2] Launching Frontend Server on http://localhost:5173 ...
cd frontend
start "Frontend - Vite" cmd /k "npm run dev"

echo.
echo Application launched!
echo - Frontend: http://localhost:5173
echo - Backend health: http://127.0.0.1:8000/api/health
echo.
pause
