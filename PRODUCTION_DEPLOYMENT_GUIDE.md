# 🚀 Production Deployment Guide - Akazuba Florist

## Overview
This guide will help you transition your Akazuba Florist project from MVP (using local storage) to a production-ready application with a real database.

## ✅ What's Already Complete

### Backend Infrastructure
- ✅ **Database Schema**: Complete Prisma schema with all models
- ✅ **API Routes**: All necessary endpoints implemented
- ✅ **Authentication**: JWT-based auth system
- ✅ **Database**: PostgreSQL with Prisma ORM
- ✅ **Seeding**: Database populated with sample data
- ✅ **Security**: Rate limiting, validation, CORS

### Frontend Infrastructure
- ✅ **Context Providers**: Updated to use database API
- ✅ **API Integration**: Database API layer implemented
- ✅ **Type Safety**: Proper TypeScript interfaces
- ✅ **Error Handling**: Comprehensive error management

## 🔧 Production Setup Steps

### 1. Environment Configuration

#### Backend (.env.production)
```bash
# Database
DATABASE_URL=postgresql://username:password@your-db-host:5432/akazuba_florist

# JWT (CHANGE THESE!)
JWT_SECRET=your-super-secure-jwt-secret-2024
JWT_REFRESH_SECRET=your-super-secure-refresh-secret-2024

# CORS
CORS_ORIGIN=https://your-frontend-domain.com
FRONTEND_URL=https://your-frontend-domain.com

# Cloudinary (Image Storage)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email (SendGrid)
SENDGRID_API_KEY=your-sendgrid-key
SENDGRID_FROM_EMAIL=noreply@yourdomain.com

# Payment Gateways
FLUTTERWAVE_PUBLIC_KEY=your-flutterwave-key
FLUTTERWAVE_SECRET_KEY=your-flutterwave-secret
```

#### Frontend (.env.production)
```bash
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api/v1
NEXT_PUBLIC_SITE_URL=https://your-frontend-domain.com
```

### 2. Database Setup

#### Option A: AWS RDS (Recommended)
1. Create PostgreSQL RDS instance
2. Configure security groups
3. Update DATABASE_URL in backend
4. Run migrations: `npx prisma migrate deploy`

#### Option B: Render PostgreSQL
1. Create PostgreSQL service on Render
2. Get connection string
3. Update DATABASE_URL
4. Run migrations

### 3. Backend Deployment

#### Option A: Render (Recommended for MVP → Production)
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically on push
4. Configure custom domain

#### Option B: AWS EC2
1. Launch EC2 instance
2. Install Node.js, PostgreSQL
3. Configure security groups
4. Deploy using PM2 or Docker

#### Option C: Railway
1. Connect repository
2. Set environment variables
3. Deploy with one click

### 4. Frontend Deployment

#### Option A: Vercel (Recommended)
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically
4. Configure custom domain

#### Option B: Netlify
1. Connect repository
2. Set build settings
3. Configure redirects for SPA

### 5. Domain & SSL Setup

1. Purchase domain (e.g., akazubaflorist.com)
2. Configure DNS records
3. Enable SSL certificates
4. Update CORS origins

### 6. Image Storage (Cloudinary)

1. Create Cloudinary account
2. Get API credentials
3. Update environment variables
4. Test image uploads

### 7. Email Service (SendGrid)

1. Create SendGrid account
2. Verify sender domain
3. Get API key
4. Test email functionality

### 8. Payment Gateway Setup

1. **Flutterwave** (for bank transfers)
   - Create account
   - Get API keys
   - Test transactions

2. **MTN MoMo** (for mobile money)
   - Register as developer
   - Get API credentials
   - Test payments

## 🧪 Testing Checklist

### Backend API Testing
- [ ] Authentication endpoints
- [ ] Product CRUD operations
- [ ] Cart management
- [ ] Order processing
- [ ] Payment integration
- [ ] File uploads
- [ ] Rate limiting

### Frontend Testing
- [ ] User registration/login
- [ ] Product browsing
- [ ] Cart functionality
- [ ] Checkout process
- [ ] Admin panel
- [ ] Responsive design
- [ ] Error handling

### Database Testing
- [ ] Connection stability
- [ ] Query performance
- [ ] Data integrity
- [ ] Backup/restore

## 🔒 Security Checklist

- [ ] JWT secrets changed from defaults
- [ ] HTTPS enabled everywhere
- [ ] CORS properly configured
- [ ] Rate limiting active
- [ ] Input validation implemented
- [ ] SQL injection protection
- [ ] XSS protection
- [ ] CSRF protection
- [ ] Environment variables secured
- [ ] Admin access restricted

## 📊 Monitoring & Analytics

### Backend Monitoring
- [ ] Error logging (Winston)
- [ ] Performance monitoring
- [ ] Database query monitoring
- [ ] API response times
- [ ] Error rate tracking

### Frontend Monitoring
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring
- [ ] User analytics
- [ ] Conversion tracking

## 🚀 Deployment Commands

### Backend
```bash
# Build
npm run build

# Start production server
npm start

# Database operations
npx prisma migrate deploy
npx prisma generate
npx prisma db seed
```

### Frontend
```bash
# Build
npm run build

# Start production server
npm start
```

## 🔄 CI/CD Pipeline

### GitHub Actions (Recommended)
1. **On push to main**:
   - Run tests
   - Build application
   - Deploy to staging

2. **On release tag**:
   - Deploy to production
   - Run database migrations
   - Send notifications

## 📈 Performance Optimization

### Backend
- [ ] Database indexing
- [ ] Query optimization
- [ ] Caching (Redis)
- [ ] Image compression
- [ ] CDN for static assets

### Frontend
- [ ] Code splitting
- [ ] Image optimization
- [ ] Lazy loading
- [ ] Service worker
- [ ] Bundle optimization

## 🆘 Troubleshooting

### Common Issues
1. **Database Connection**: Check DATABASE_URL and network access
2. **CORS Errors**: Verify CORS_ORIGIN settings
3. **JWT Issues**: Ensure secrets are properly set
4. **Image Uploads**: Verify Cloudinary credentials
5. **Payment Failures**: Check gateway API keys

### Debug Commands
```bash
# Check database connection
npx prisma db push --preview-feature

# View logs
npm run dev

# Test API endpoints
curl https://your-api.com/api/v1/health
```

## 📞 Support & Maintenance

### Regular Tasks
- [ ] Database backups
- [ ] Security updates
- [ ] Performance monitoring
- [ ] Error log review
- [ ] User feedback collection

### Emergency Procedures
1. **Database Down**: Switch to backup
2. **API Failure**: Check logs, restart service
3. **Payment Issues**: Verify gateway status
4. **Security Breach**: Rotate keys, audit logs

## 🎯 Next Steps

1. **Choose deployment platform** (Render + Vercel recommended)
2. **Set up production database** (AWS RDS or Render)
3. **Configure environment variables**
4. **Deploy backend first**
5. **Deploy frontend**
6. **Test all functionality**
7. **Go live!**

## 📚 Resources

- [Prisma Documentation](https://www.prisma.io/docs/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [AWS RDS Guide](https://aws.amazon.com/rds/)

---

**Status**: 🟡 Ready for Production Deployment
**Last Updated**: $(date)
**Next Review**: After deployment
