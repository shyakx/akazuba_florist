#!/bin/bash

# Akazuba Florist - Vercel Deployment Script
echo "🚀 Deploying Akazuba Florist to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Login to Vercel (if not already logged in)
echo "🔐 Checking Vercel authentication..."
vercel whoami > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "Please login to Vercel:"
    vercel login
fi

# Set environment variables
echo "⚙️ Setting up environment variables..."
vercel env add NODE_ENV production
vercel env add NEXT_PUBLIC_APP_URL https://akazubaflorist.com
vercel env add NEXT_PUBLIC_APP_NAME "Akazuba Florist"
vercel env add NEXT_PUBLIC_APP_DESCRIPTION "Premium flowers and perfumes in Rwanda"
vercel env add NEXT_PUBLIC_API_URL https://akazuba-backend-api.onrender.com
vercel env add GOOGLE_ANALYTICS_ID G-XXXXXXXXXX
vercel env add FACEBOOK_PIXEL_ID your_facebook_pixel_id

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "🌐 Your app is now live at: https://akazubaflorist.vercel.app"
echo "📊 Monitor your deployment at: https://vercel.com/dashboard"
