#!/bin/bash

echo "🚀 Deploying Akazuba Florist Fixes..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in the project root
if [ ! -f "package.json" ] || [ ! -d "backend" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

print_status "Starting deployment of authentication and product fixes..."

# 1. Deploy backend fixes
print_status "Deploying backend fixes..."
cd backend

# Install dependencies
print_status "Installing backend dependencies..."
npm install

# Build the project
print_status "Building backend project..."
npm run build

# Run database migrations
print_status "Running database migrations..."
npx prisma migrate deploy

# Seed the database
print_status "Seeding database with new categories and products..."
npx prisma db seed

# Go back to root
cd ..

# 2. Deploy frontend fixes
print_status "Deploying frontend fixes..."

# Install dependencies
print_status "Installing frontend dependencies..."
npm install

# Build the project
print_status "Building frontend project..."
npm run build

print_status "Deployment completed successfully!"
print_status "Fixes applied:"
echo "  - ✅ Removed mock authentication logic"
echo "  - ✅ Added perfume categories to database"
echo "  - ✅ Added perfume products to database"
echo "  - ✅ Enhanced category filtering"
echo "  - ✅ Fixed API connection issues"

print_warning "Next steps:"
echo "  1. Deploy to your hosting platform (Vercel/Render)"
echo "  2. Test authentication functionality"
echo "  3. Verify products appear in categories"
echo "  4. Check admin panel functionality"

print_status "Deployment script completed!"
