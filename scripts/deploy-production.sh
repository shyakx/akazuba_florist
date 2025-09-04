#!/bin/bash

# 🚀 Production Deployment Script for Akazuba Florist
# This script helps automate the deployment process

set -e  # Exit on any error

echo "🚀 Starting Akazuba Florist Production Deployment..."

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
if [ ! -f "package.json" ] || [ ! -f "prisma/schema.prisma" ]; then
    print_error "Please run this script from the backend directory"
    exit 1
fi

print_status "Checking prerequisites..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    print_warning ".env file not found. Please create one from env.example"
    print_status "Copying env.example to .env..."
    cp env.example .env
    print_warning "Please update .env with your production values before continuing"
    read -p "Press Enter after updating .env file..."
fi

print_status "Installing dependencies..."
npm install

print_status "Generating Prisma client..."
npx prisma generate

print_status "Running database migrations..."
npx prisma migrate deploy

print_status "Building application..."
npm run build

print_success "Build completed successfully!"

print_status "Starting production server..."
print_warning "Make sure your environment variables are properly configured"
print_warning "Database should be accessible from your deployment environment"

echo ""
echo "🎯 Next Steps:"
echo "1. Deploy to your chosen platform (Render, AWS, Railway, etc.)"
echo "2. Set environment variables on your deployment platform"
echo "3. Configure your domain and SSL"
echo "4. Test all functionality"
echo "5. Go live!"
echo ""
echo "📚 See PRODUCTION_DEPLOYMENT_GUIDE.md for detailed instructions"

# Check if we should start the server
read -p "Do you want to start the production server now? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "Starting production server..."
    npm start
else
    print_status "Deployment script completed. Server not started."
    print_status "Use 'npm start' to start the production server when ready."
fi
