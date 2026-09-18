@echo off
echo Starting JobPortal Application...
echo.

echo Starting Backend Server...
start "JobPortal Backend" cmd /k "npm run dev"

echo Waiting for backend to start...
timeout /t 3 /nobreak >nul

echo Starting Frontend Server...
start "JobPortal Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are starting in separate windows.
echo Backend should run on port (check backend window)
echo Frontend should run on http://localhost:5173
echo.
echo Press any key to close this window...
pause >nul
