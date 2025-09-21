@echo off
echo Starting Disaster Management App Development Environment...
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd Backend && npm run dev:simple"

timeout /t 3 /nobreak >nul

echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd Frontend && npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:3001
echo Frontend: http://localhost:8081
echo.
echo Press any key to exit...
pause >nul
