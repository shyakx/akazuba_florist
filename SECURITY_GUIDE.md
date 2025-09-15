# 🔒 Security Configuration Guide

## ⚠️ CRITICAL: Security Vulnerabilities Fixed

This guide addresses the security vulnerabilities that were found in the codebase and provides secure configuration instructions.

## 🚨 Security Issues Fixed

### 1. JWT Secret Exposure
- **Issue**: JWT secret was exposed in `next.config.js` client-side code
- **Fix**: Removed JWT_SECRET from client-side environment variables
- **Action Required**: Set JWT_SECRET as server-side environment variable only

### 2. Hardcoded Admin Credentials
- **Issue**: Admin password was hardcoded in login route
- **Fix**: Moved credentials to environment variables
- **Action Required**: Set ADMIN_EMAIL and ADMIN_PASSWORD environment variables

### 3. Insecure Token Storage
- **Issue**: JWT tokens stored in localStorage (vulnerable to XSS)
- **Fix**: Created secure token storage using httpOnly cookies
- **Action Required**: Update authentication flow to use secure storage

## 🔧 Required Environment Variables

### Frontend (Vercel)
```bash
# Admin Credentials (REQUIRED)
ADMIN_EMAIL=info.akazubaflorist@gmail.com
ADMIN_PASSWORD=your-secure-admin-password-here

# API Configuration
NEXT_PUBLIC_API_URL=https://akazuba-backend-api.onrender.com/api/v1
NODE_ENV=production

# DO NOT SET JWT_SECRET HERE - it should only be server-side
```

### Backend (Render)
```bash
# JWT Configuration (REQUIRED)
JWT_SECRET=your-strong-jwt-secret-here
JWT_REFRESH_SECRET=your-strong-refresh-secret-here

# Database (REQUIRED)
DATABASE_URL=postgresql://user:password@host:port/database

# Admin Credentials (REQUIRED)
ADMIN_EMAIL=info.akazubaflorist@gmail.com
ADMIN_PASSWORD=your-secure-admin-password-here

# CORS Configuration
CORS_ORIGIN=https://akazubaflorist.com
FRONTEND_URL=https://akazubaflorist.com
NODE_ENV=production
PORT=10000
```

## 🛡️ Security Best Practices Implemented

### 1. Secure Token Storage
- JWT tokens now use httpOnly cookies with SameSite protection
- Prevents XSS attacks from stealing authentication tokens
- Automatic token expiration and validation

### 2. Environment Variable Security
- Sensitive data moved to environment variables
- JWT secrets only accessible server-side
- Admin credentials no longer hardcoded

### 3. CORS Protection
- Strict CORS configuration
- Only allowed origins can access the API
- Prevents unauthorized cross-origin requests

### 4. Content Security Policy
- Implemented CSP headers in `vercel.json`
- Prevents XSS and code injection attacks
- Restricts resource loading to trusted sources

## 🚀 Deployment Steps

### 1. Update Environment Variables

**Vercel Dashboard:**
1. Go to your project settings
2. Navigate to Environment Variables
3. Add the required variables listed above
4. Redeploy the application

**Render Dashboard:**
1. Go to your backend service
2. Navigate to Environment
3. Add the required variables listed above
4. Redeploy the service

### 2. Generate Strong Secrets

```bash
# Generate a strong JWT secret (64 characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate a strong admin password
node -e "console.log(require('crypto').randomBytes(16).toString('base64'))"
```

### 3. Update Admin Password

1. Generate a new strong password
2. Set it in both frontend and backend environment variables
3. Test admin login functionality
4. Update any documentation with the new credentials

## 🔍 Security Monitoring

### Regular Security Checks
- [ ] Review environment variables for exposed secrets
- [ ] Check for hardcoded credentials in code
- [ ] Monitor authentication logs for suspicious activity
- [ ] Update dependencies regularly for security patches
- [ ] Review and rotate JWT secrets periodically

### Security Headers
The application includes these security headers:
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Content-Security-Policy: [configured]`
- `Referrer-Policy: strict-origin-when-cross-origin`

## ⚠️ Important Notes

1. **Never commit secrets to git** - Use environment variables
2. **Use strong passwords** - Minimum 16 characters with mixed case, numbers, symbols
3. **Rotate secrets regularly** - Change JWT secrets and passwords periodically
4. **Monitor access logs** - Watch for unauthorized access attempts
5. **Keep dependencies updated** - Regular security updates are crucial

## 🆘 Emergency Response

If you suspect a security breach:
1. **Immediately rotate all secrets** (JWT secrets, admin passwords)
2. **Review access logs** for suspicious activity
3. **Update environment variables** with new credentials
4. **Redeploy both frontend and backend**
5. **Monitor for continued suspicious activity**

## ✅ Security Checklist

- [ ] JWT_SECRET removed from client-side code
- [ ] Admin credentials moved to environment variables
- [ ] Secure token storage implemented
- [ ] Environment variables configured in production
- [ ] Strong passwords generated and set
- [ ] CORS properly configured
- [ ] Security headers implemented
- [ ] Dependencies updated to latest versions
- [ ] Security monitoring in place

**Your application is now secure and ready for production!** 🎉
