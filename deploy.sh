#!/bin/bash

echo "🚀 Starting Akazuba Florist Backend Deployment..."

# Check if we're in the backend directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the backend directory"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building the project..."
npm run build

# Run database migrations
echo "🗄️ Running database migrations..."
npx prisma migrate deploy

# Seed the database with categories and products
echo "🌱 Seeding database with categories and products..."
npx prisma db seed

# Start the server
echo "🚀 Starting the server..."
npm start
