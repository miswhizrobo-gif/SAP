@echo off
REM Windows batch script to setup the application

echo ================================
echo Employee Task Tracking System
echo Setup Script for Windows
echo ================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

echo Node.js version:
node --version
echo npm version:
npm --version
echo.

REM Create .env file for backend if it doesn't exist
if not exist "backend\.env" (
    echo Creating backend\.env file...
    copy backend\.env.example backend\.env
    echo Created backend\.env - Please update with your email credentials
) else (
    echo backend\.env already exists
)

echo.
echo ================================
echo Installing Backend Dependencies
echo ================================
cd backend
call npm install
cd ..

echo.
echo ================================
echo Installing Frontend Dependencies
echo ================================
cd frontend
call npm install
cd ..

echo.
echo ================================
echo Setup Complete!
echo ================================
echo.
echo To run the application:
echo.
echo 1. Make sure MongoDB is running (mongod)
echo.
echo 2. In one terminal, start the backend:
echo    cd backend
echo    npm start
echo.
echo 3. In another terminal, start the frontend:
echo    cd frontend
echo    npm start
echo.
echo 4. Open http://localhost:3000 in your browser
echo.
echo For more details, see QUICKSTART.md
echo.
pause
