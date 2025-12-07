@echo off
echo ========================================
echo    مِداد | Midad - Markdown Reader
echo ========================================
echo.

:: Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)

echo Starting servers...
echo.
echo [1] Backend Server: http://localhost:3001
echo [2] Frontend Dev:   http://localhost:5173
echo.
echo Press Ctrl+C to stop both servers
echo ========================================
echo.

:: Start both servers concurrently
start /B node server.cjs
timeout /t 2 /nobreak >nul
npm run dev
