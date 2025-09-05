#!/bin/bash

# Akazuba Florist - Quick Deployment Script
echo "🌸 Akazuba Florist - Production Deployment"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

print_status "Starting deployment process..."

# Step 1: Build the application
print_status "Building the application..."
npm run build

if [ $? -eq 0 ]; then
    print_success "Build completed successfully!"
else
    print_error "Build failed! Please fix the errors and try again."
    exit 1
fi

# Step 2: Check if Vercel CLI is installed
print_status "Checking Vercel CLI..."
if ! command -v vercel &> /dev/null; then
    print_warning "Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Step 3: Deploy to Vercel
print_status "Deploying to Vercel..."
vercel --prod

if [ $? -eq 0 ]; then
    print_success "Frontend deployed to Vercel successfully!"
    echo -e "${GREEN}🌐 Your app is live at: https://akazubaflorist.vercel.app${NC}"
else
    print_error "Vercel deployment failed!"
    exit 1
fi

# Step 4: Instructions for Render deployment
print_status "Next steps for backend deployment:"
echo -e "${YELLOW}1. Go to https://dashboard.render.com${NC}"
echo -e "${YELLOW}2. Create a new PostgreSQL database${NC}"
echo -e "${YELLOW}3. Create a new Web Service for the backend${NC}"
echo -e "${YELLOW}4. Use the configuration from deployment/render.yaml${NC}"
echo -e "${YELLOW}5. Set the environment variables from deployment/production.env${NC}"

print_success "Deployment process completed!"
echo -e "${GREEN}🎉 Your Akazuba Florist application is now live!${NC}"
echo -e "${BLUE}📖 For detailed instructions, see DEPLOYMENT_GUIDE.md${NC}"
