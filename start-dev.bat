@echo off
echo Starting LinkedIn Clone Development Servers...
echo.

REM Start backend server
echo Starting Backend Server...
start "Backend Server" cmd /k "cd /d %~dp0backend && ..\venv\Scripts\activate && python app.py"

REM Wait a moment for backend to start
timeout /t 3 /nobreak > nul

REM Start frontend server  
echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd /d %~dp0frontend && npm start"

echo.
echo Both servers are starting up...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit...
pause > nul
