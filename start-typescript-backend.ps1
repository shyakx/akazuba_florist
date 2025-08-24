# Set environment variables for TypeScript backend
$env:DATABASE_URL = "postgresql://postgres:0123@localhost:5434/akazuba_florist"
$env:PORT = "5000"
$env:NODE_ENV = "development"
$env:FRONTEND_URL = "http://localhost:3000"
$env:JWT_SECRET = "akazuba-super-secret-jwt-key-2024"
$env:JWT_EXPIRES_IN = "7d"
$env:JWT_REFRESH_SECRET = "akazuba-super-secret-refresh-key-2024"
$env:JWT_REFRESH_EXPIRES_IN = "30d"

# 🔑 PAYMENT API KEYS - Focus on MTN MoMo (Flutterwave not available for small businesses)
# MTN MoMo API Keys (Primary Payment Method)
$env:MTN_MOMO_API_KEY = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"     # Replace with your real API key
$env:MTN_MOMO_API_SECRET = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"  # Replace with your real API secret
$env:MTN_MOMO_SUBSCRIPTION_KEY = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"  # Replace with your subscription key
$env:MTN_MOMO_ENVIRONMENT = "production"  # Change from "sandbox" to "production"

# Flutterwave API Keys (Disabled - Not available for small businesses in Rwanda)
$env:FLUTTERWAVE_PUBLIC_KEY = "DISABLED"  # Flutterwave not accepting small businesses
$env:FLUTTERWAVE_SECRET_KEY = "DISABLED"  # Flutterwave not accepting small businesses

Write-Host "🚀 Starting Akazuba TypeScript Backend..." -ForegroundColor Green
Write-Host "📍 Database URL: $env:DATABASE_URL" -ForegroundColor Yellow
Write-Host "🌐 Port: $env:PORT" -ForegroundColor Yellow
Write-Host "🔐 JWT Secret: $env:JWT_SECRET" -ForegroundColor Yellow
Write-Host "💳 Flutterwave Public Key: $env:FLUTTERWAVE_PUBLIC_KEY" -ForegroundColor Cyan
Write-Host "📱 MTN MoMo Environment: $env:MTN_MOMO_ENVIRONMENT" -ForegroundColor Cyan

# Start the TypeScript backend
node dist/index.js
