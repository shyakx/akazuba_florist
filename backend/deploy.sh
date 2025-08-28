#!/bin/bash

echo "🚀 Starting Akazuba Backend Deployment..."

# Check if we're in production
if [ "$NODE_ENV" = "production" ]; then
    echo "📦 Production deployment detected"
    
    # Install dependencies
    echo "📥 Installing dependencies..."
    npm install --production
    
    # Build the project
    echo "🔨 Building project..."
    npm run build
    
    # Run database migrations
    echo "🗄️ Running database migrations..."
    npx prisma migrate deploy
    
    # Generate Prisma client
    echo "⚙️ Generating Prisma client..."
    npx prisma generate
    
    # Start the server
    echo "🚀 Starting server..."
    npm start
else
    echo "🛠️ Development mode detected"
    npm run dev
fi
