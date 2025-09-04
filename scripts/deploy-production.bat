@echo off
REM 🚀 Production Deployment Script for Akazuba Florist (Windows)
REM This script helps automate the deployment process

echo 🚀 Starting Akazuba Florist Production Deployment...

REM Check if we're in the right directory
if not exist "package.json" (
    echo [ERROR] Please run this script from the backend directory
    pause
    exit /b 1
)

if not exist "prisma\schema.prisma" (
    echo [ERROR] Please run this script from the backend directory
    pause
    exit /b 1
)

echo [INFO] Checking prerequisites...

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm is not installed. Please install npm first.
    pause
    exit /b 1
)

REM Check if .env file exists
if not exist ".env" (
    echo [WARNING] .env file not found. Please create one from env.example
    echo [INFO] Copying env.example to .env...
    copy env.example .env
    echo [WARNING] Please update .env with your production values before continuing
    pause
)

echo [INFO] Installing dependencies...
call npm install

echo [INFO] Generating Prisma client...
call npx prisma generate

echo [INFO] Running database migrations...
call npx prisma migrate deploy

echo [INFO] Building application...
call npm run build

echo [SUCCESS] Build completed successfully!

echo [INFO] Starting production server...
echo [WARNING] Make sure your environment variables are properly configured
echo [WARNING] Database should be accessible from your deployment environment

echo.
echo 🎯 Next Steps:
echo 1. Deploy to your chosen platform (Render, AWS, Railway, etc.)
echo 2. Set environment variables on your deployment platform
echo 3. Configure your domain and SSL
echo 4. Test all functionality
echo 5. Go live!
echo.
echo 📚 See PRODUCTION_DEPLOYMENT_GUIDE.md for detailed instructions

set /p start_server="Do you want to start the production server now? (y/N): "
if /i "%start_server%"=="y" (
    echo [INFO] Starting production server...
    call npm start
) else (
    echo [INFO] Deployment script completed. Server not started.
    echo [INFO] Use 'npm start' to start the production server when ready.
)

pause
