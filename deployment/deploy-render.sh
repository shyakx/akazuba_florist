#!/bin/bash

# Akazuba Florist - Render Deployment Script
echo "🚀 Deploying Akazuba Florist Backend to Render..."

# Check if Render CLI is installed
if ! command -v render &> /dev/null; then
    echo "❌ Render CLI not found. Installing..."
    npm install -g @render/cli
fi

# Login to Render (if not already logged in)
echo "🔐 Checking Render authentication..."
render auth whoami > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "Please login to Render:"
    render auth login
fi

# Create database first
echo "🗄️ Creating PostgreSQL database..."
render databases create \
    --name akazuba-database \
    --database-name akazuba_production \
    --user akazuba_user \
    --plan starter

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 30

# Deploy backend service
echo "🚀 Deploying backend service..."
render services create \
    --name akazuba-backend-api \
    --type web \
    --env node \
    --plan starter \
    --build-command "cd backend && npm install && npm run build" \
    --start-command "cd backend && npm start" \
    --health-check-path "/api/health" \
    --env-vars NODE_ENV=production,PORT=10000,CORS_ORIGIN=https://akazubaflorist.com

echo "✅ Backend deployment complete!"
echo "🌐 Your API is now live at: https://akazuba-backend-api.onrender.com"
echo "📊 Monitor your deployment at: https://dashboard.render.com"
