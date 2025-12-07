@echo off
echo Starting Markdown Reader...

:: Get the directory of this script
cd /d "%~dp0"

:: Start Backend
echo Starting Backend Server on port 3001...
start "Markdown Reader Backend" cmd /k "node server.cjs"

:: Wait a moment for backend to initialize
timeout /t 2 >nul

:: Start Frontend
echo Starting Frontend Client on port 5173...
start "Markdown Reader Frontend" cmd /k "npm run dev"

echo.
echo ===================================================
echo   Application is running!
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:3001
echo ===================================================
echo.
