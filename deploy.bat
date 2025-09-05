@echo off
echo 🌸 Akazuba Florist - Production Deployment
echo ==========================================

REM Check if we're in the right directory
if not exist "package.json" (
    echo [ERROR] Please run this script from the project root directory
    pause
    exit /b 1
)

echo [INFO] Starting deployment process...

REM Step 1: Build the application
echo [INFO] Building the application...
call npm run build

if %errorlevel% neq 0 (
    echo [ERROR] Build failed! Please fix the errors and try again.
    pause
    exit /b 1
)

echo [SUCCESS] Build completed successfully!

REM Step 2: Check if Vercel CLI is installed
echo [INFO] Checking Vercel CLI...
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Vercel CLI not found. Installing...
    call npm install -g vercel
)

REM Step 3: Deploy to Vercel
echo [INFO] Deploying to Vercel...
call vercel --prod

if %errorlevel% neq 0 (
    echo [ERROR] Vercel deployment failed!
    pause
    exit /b 1
)

echo [SUCCESS] Frontend deployed to Vercel successfully!
echo 🌐 Your app is live at: https://akazubaflorist.vercel.app

REM Step 4: Instructions for Render deployment
echo [INFO] Next steps for backend deployment:
echo 1. Go to https://dashboard.render.com
echo 2. Create a new PostgreSQL database
echo 3. Create a new Web Service for the backend
echo 4. Use the configuration from deployment/render.yaml
echo 5. Set the environment variables from deployment/production.env

echo [SUCCESS] Deployment process completed!
echo 🎉 Your Akazuba Florist application is now live!
echo 📖 For detailed instructions, see DEPLOYMENT_GUIDE.md

pause
