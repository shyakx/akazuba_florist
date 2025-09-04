#!/bin/bash

echo "🚀 Starting Akazuba Florist Production Deployment..."

# Check if we're in the backend directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the backend directory"
    exit 1
fi

# Set production environment
export NODE_ENV=production
echo "🌍 Environment set to: $NODE_ENV"

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Build the project
echo "🔨 Building the project for production..."
npm run build

# Run database migrations
echo "🗄️ Running database migrations..."
npx prisma migrate deploy

# Database setup complete
echo "✅ Database setup complete"

# Verify production configuration
echo "🔍 Verifying production configuration..."
if [ -z "$DATABASE_URL" ]; then
    echo "❌ Error: DATABASE_URL environment variable not set"
    exit 1
fi

if [ -z "$JWT_SECRET" ]; then
    echo "❌ Error: JWT_SECRET environment variable not set"
    exit 1
fi

echo "✅ Production configuration verified"

# Start the production server
echo "🚀 Starting production server..."
npm start
