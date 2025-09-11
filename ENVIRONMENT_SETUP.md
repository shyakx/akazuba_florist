# Environment Variables Setup Guide

This document outlines all the environment variables needed for the Akazuba Florist application to function properly.

## Required Environment Variables

### Authentication
```bash
# JWT Secret for token signing and verification
JWT_SECRET=your-super-secret-jwt-key-here

# Session configuration
SESSION_SECRET=your-session-secret-here
```

### Database
```bash
# Database connection string
DATABASE_URL=postgresql://username:password@localhost:5432/akazuba_florist

# Database connection pool settings
DB_POOL_MIN=2
DB_POOL_MAX=10
```

### Backend API
```bash
# Backend API base URL
NEXT_PUBLIC_API_URL=https://akazuba-backend-api.onrender.com/api/v1

# Backend API timeout (in milliseconds)
API_TIMEOUT=10000
```

### Email Configuration
```bash
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=info.akazubaflorist@gmail.com
SMTP_PASS=your-app-password-here
SMTP_FROM=info.akazubaflorist@gmail.com

# Admin email for notifications
ADMIN_EMAIL=info.akazubaflorist@gmail.com
```

### Application Settings
```bash
# Application environment
NODE_ENV=production

# Application port
PORT=3000

# Application URL
NEXT_PUBLIC_APP_URL=https://akazubaflorist.com

# Site name and description
NEXT_PUBLIC_SITE_NAME=Akazuba Florist
NEXT_PUBLIC_SITE_DESCRIPTION=Rwanda's leading florist delivering fresh flowers and perfumes
```

### Security
```bash
# CORS origins (comma-separated)
CORS_ORIGINS=https://akazubaflorist.com,https://www.akazubaflorist.com

# Rate limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### File Upload
```bash
# Maximum file size (in bytes)
MAX_FILE_SIZE=10485760

# Allowed file types
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp

# Upload directory
UPLOAD_DIR=./uploads
```

### Monitoring & Logging
```bash
# Log level
LOG_LEVEL=info

# Enable audit logging
ENABLE_AUDIT_LOGGING=true

# Audit log retention (in days)
AUDIT_LOG_RETENTION_DAYS=30
```

## Development Environment

For development, create a `.env.local` file in the root directory:

```bash
# Development environment variables
NODE_ENV=development
JWT_SECRET=dev-secret-key-change-in-production
DATABASE_URL=postgresql://localhost:5432/akazuba_florist_dev
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-dev-email@gmail.com
SMTP_PASS=your-dev-app-password
ADMIN_EMAIL=your-dev-email@gmail.com
```

## Production Environment

For production deployment (Vercel, Netlify, etc.), set these environment variables in your hosting platform:

### Vercel
```bash
# Set in Vercel dashboard under Settings > Environment Variables
JWT_SECRET=your-production-jwt-secret
DATABASE_URL=your-production-database-url
NEXT_PUBLIC_API_URL=https://akazuba-backend-api.onrender.com/api/v1
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=info.akazubaflorist@gmail.com
SMTP_PASS=your-production-app-password
ADMIN_EMAIL=info.akazubaflorist@gmail.com
NODE_ENV=production
```

### Netlify
```bash
# Set in Netlify dashboard under Site settings > Environment variables
JWT_SECRET=your-production-jwt-secret
DATABASE_URL=your-production-database-url
NEXT_PUBLIC_API_URL=https://akazuba-backend-api.onrender.com/api/v1
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=info.akazubaflorist@gmail.com
SMTP_PASS=your-production-app-password
ADMIN_EMAIL=info.akazubaflorist@gmail.com
NODE_ENV=production
```

## Security Best Practices

1. **Never commit `.env` files to version control**
2. **Use strong, unique secrets for production**
3. **Rotate secrets regularly**
4. **Use different secrets for different environments**
5. **Limit access to environment variables**

## Email Setup Instructions

### Gmail Setup
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security > 2-Step Verification > App passwords
   - Generate a new app password for "Mail"
   - Use this password as `SMTP_PASS`

### Other Email Providers
- **Outlook/Hotmail**: Use `smtp-mail.outlook.com:587`
- **Yahoo**: Use `smtp.mail.yahoo.com:587`
- **Custom SMTP**: Configure according to your provider's settings

## Database Setup

### PostgreSQL (Recommended)
```bash
# Install PostgreSQL
# Create database
createdb akazuba_florist

# Run migrations (if using Prisma)
npx prisma migrate deploy
```

### Alternative Databases
- **MySQL**: Change connection string format
- **SQLite**: Use `file:./dev.db` for development
- **MongoDB**: Use MongoDB connection string format

## Verification

After setting up environment variables, verify the configuration:

1. **Check health endpoint**: `GET /api/health`
2. **Test authentication**: `POST /api/auth/login`
3. **Verify email**: Send test email through admin panel
4. **Check database**: Verify database connection

## Troubleshooting

### Common Issues

1. **JWT_SECRET not set**: Authentication will fail
2. **SMTP credentials incorrect**: Email notifications won't work
3. **DATABASE_URL invalid**: Database operations will fail
4. **CORS issues**: Frontend-backend communication problems

### Debug Mode
Set `NODE_ENV=development` and `LOG_LEVEL=debug` for detailed logging.

## Support

For issues with environment setup, check:
1. Application logs
2. Health check endpoint
3. Database connectivity
4. Email service status
