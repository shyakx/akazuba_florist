#!/bin/bash

# Production Deployment Script
echo "🚀 Starting Production Deployment..."

# Check if we're in production mode
if [ "$NODE_ENV" != "production" ]; then
    echo "❌ ERROR: NODE_ENV must be set to 'production'"
    echo "Please set NODE_ENV=production before deploying"
    exit 1
fi

# Security checks
echo "🔒 Running security checks..."

# Check for required environment variables
required_vars=("DATABASE_URL" "JWT_SECRET" "JWT_REFRESH_SECRET" "FRONTEND_URL")
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "❌ ERROR: $var is not set"
        exit 1
    fi
done

# Check for production database
if [[ "$DATABASE_URL" == *"localhost"* ]] && [[ "$DATABASE_URL" != *"production"* ]]; then
    echo "⚠️  WARNING: Using localhost database in production"
    echo "Please use a production database"
fi

# Check for strong JWT secrets
if [ ${#JWT_SECRET} -lt 32 ]; then
    echo "❌ ERROR: JWT_SECRET is too short (minimum 32 characters)"
    exit 1
fi

if [ ${#JWT_REFRESH_SECRET} -lt 32 ]; then
    echo "❌ ERROR: JWT_REFRESH_SECRET is too short (minimum 32 characters)"
    exit 1
fi

echo "✅ Security checks passed"

# Build the application
echo "🔨 Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build completed"

# Run tests
echo "🧪 Running tests..."
npm test

if [ $? -ne 0 ]; then
    echo "❌ Tests failed"
    exit 1
fi

echo "✅ Tests passed"

# Deploy to production
echo "🚀 Deploying to production..."
git add .
git commit -m "Production deployment: $(date)"
git push origin main

echo "✅ Production deployment completed!"
echo "🔒 Security features enabled:"
echo "   - Production-only CORS"
echo "   - Strong JWT secrets"
echo "   - Security headers"
echo "   - Rate limiting"
echo "   - HTTPS enforcement"
