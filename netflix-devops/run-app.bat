@echo off
setlocal

cd /d "%~dp0"

echo Starting Netflix DevOps application...
echo.
echo This will build and start:
echo   - MongoDB
echo   - Backend API
echo   - Auth Service
echo   - Video Service
echo   - Frontend
echo   - Prometheus
echo   - Grafana
echo.

docker-compose up --build -d

if errorlevel 1 (
  echo.
  echo Failed to start the application with docker-compose.
  exit /b 1
)

echo.
echo Netflix DevOps is starting in the background.
echo Frontend:   http://localhost:3000
echo Backend:    http://localhost:5000
echo Prometheus: http://localhost:9090
echo Grafana:    http://localhost:3001
echo.
echo Demo login:
echo   Email:    demo@netflix.local
echo   Password: demo123
echo.
echo To stop everything later, run:
echo   docker-compose down

endlocal
