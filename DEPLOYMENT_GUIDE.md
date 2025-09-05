# 🚀 Akazuba Florist - Production Deployment Guide

## 📋 Overview

This guide will help you deploy your Akazuba Florist application to production using:
- **Vercel** for the Next.js frontend
- **Render** for the Node.js backend and PostgreSQL database

## 🛠️ Prerequisites

1. **GitHub Account** - Your code should be in a GitHub repository
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **Render Account** - Sign up at [render.com](https://render.com)
4. **Domain Name** (optional) - For custom domain setup

## 🗄️ Step 1: Deploy Database to Render

### 1.1 Create PostgreSQL Database
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"PostgreSQL"**
3. Configure:
   - **Name**: `akazuba-database`
   - **Database Name**: `akazuba_production`
   - **User**: `akazuba_user`
   - **Plan**: `Starter` (Free tier)
   - **Region**: Choose closest to your users
4. Click **"Create Database"**
5. Wait for database to be ready (2-3 minutes)
6. Copy the **External Database URL** - you'll need this later

### 1.2 Run Database Migrations
```bash
# Install Prisma CLI globally
npm install -g prisma

# Set database URL
export DATABASE_URL="your_database_url_from_render"

# Generate Prisma client
cd backend
npx prisma generate

# Push schema to database
npx prisma db push

# Seed database (optional)
npx prisma db seed
```

## 🔧 Step 2: Deploy Backend to Render

### 2.1 Create Web Service
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `akazuba-backend-api`
   - **Environment**: `Node`
   - **Plan**: `Starter` (Free tier)
   - **Build Command**: `cd backend && npm install && npm run build`
   - **Start Command**: `cd backend && npm start`
   - **Health Check Path**: `/api/health`

### 2.2 Environment Variables
Add these environment variables in Render dashboard:

```env
NODE_ENV=production
PORT=10000
DATABASE_URL=your_database_url_from_render
JWT_SECRET=your_super_secure_jwt_secret_key_min_32_chars
JWT_REFRESH_SECRET=your_super_secure_refresh_secret_key_min_32_chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=https://akazubaflorist.vercel.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=info
LOG_FORMAT=json
PAYMENT_METHOD=local_upload
UPLOAD_DIR=/opt/render/project/src/uploads
MAX_FILE_SIZE=10485760
```

### 2.3 Deploy Backend
1. Click **"Create Web Service"**
2. Wait for deployment to complete (5-10 minutes)
3. Your API will be available at: `https://akazuba-backend-api.onrender.com`

## 🌐 Step 3: Deploy Frontend to Vercel

### 3.1 Connect Repository
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"New Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: `./` (root of your project)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### 3.2 Environment Variables
Add these environment variables in Vercel dashboard:

```env
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://akazubaflorist.vercel.app
NEXT_PUBLIC_APP_NAME=Akazuba Florist
NEXT_PUBLIC_APP_DESCRIPTION=Premium flowers and perfumes in Rwanda
NEXT_PUBLIC_API_URL=https://akazuba-backend-api.onrender.com
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
FACEBOOK_PIXEL_ID=your_facebook_pixel_id
```

### 3.3 Deploy Frontend
1. Click **"Deploy"**
2. Wait for deployment to complete (3-5 minutes)
3. Your app will be available at: `https://akazubaflorist.vercel.app`

## 🔗 Step 4: Configure Custom Domain (Optional)

### 4.1 Vercel Domain Setup
1. Go to your project in Vercel dashboard
2. Click **"Settings"** → **"Domains"**
3. Add your custom domain: `akazubaflorist.com`
4. Follow DNS configuration instructions
5. SSL certificate will be automatically provisioned

### 4.2 Update Environment Variables
Update these variables after domain setup:
- `NEXT_PUBLIC_APP_URL=https://akazubaflorist.com`
- `CORS_ORIGIN=https://akazubaflorist.com`

## 🧪 Step 5: Test Production Deployment

### 5.1 Health Checks
Test these endpoints:
- Frontend: `https://akazubaflorist.vercel.app`
- Backend Health: `https://akazuba-backend-api.onrender.com/api/health`
- API Products: `https://akazuba-backend-api.onrender.com/api/products`

### 5.2 Functional Tests
1. **User Registration/Login**
2. **Product Browsing**
3. **Shopping Cart**
4. **Order Placement**
5. **Admin Panel Access**
6. **File Uploads**
7. **Payment Processing**

## 📊 Step 6: Monitoring & Analytics

### 6.1 Vercel Analytics
- Built-in analytics available in Vercel dashboard
- Real-time performance metrics
- Core Web Vitals monitoring

### 6.2 Render Monitoring
- Built-in logs and metrics
- Uptime monitoring
- Performance insights

### 6.3 Custom Analytics
- Google Analytics integration
- Facebook Pixel tracking
- Custom event tracking

## 🔒 Step 7: Security Configuration

### 7.1 Environment Security
- ✅ All secrets stored as environment variables
- ✅ Database credentials secured
- ✅ JWT secrets generated securely
- ✅ CORS properly configured

### 7.2 Security Headers
- ✅ XSS Protection enabled
- ✅ Content Security Policy configured
- ✅ HTTPS enforced
- ✅ Rate limiting implemented

## 🚀 Step 8: Performance Optimization

### 8.1 Frontend Optimizations
- ✅ Next.js Image optimization
- ✅ Code splitting implemented
- ✅ Static generation where possible
- ✅ CDN delivery via Vercel

### 8.2 Backend Optimizations
- ✅ Database indexes configured
- ✅ Caching strategy implemented
- ✅ Compression enabled
- ✅ Connection pooling

## 📱 Step 9: Mobile & PWA Features

### 9.1 Progressive Web App
- ✅ Service worker implemented
- ✅ Offline functionality
- ✅ App manifest configured
- ✅ Push notifications ready

### 9.2 Mobile Optimization
- ✅ Responsive design
- ✅ Touch-friendly interface
- ✅ Fast loading on mobile
- ✅ Mobile payment integration

## 🔧 Step 10: Maintenance & Updates

### 10.1 Automated Deployments
- ✅ GitHub integration for auto-deploy
- ✅ Branch-based deployments
- ✅ Preview deployments for testing

### 10.2 Database Management
- ✅ Prisma migrations
- ✅ Database backups (Render handles this)
- ✅ Schema versioning

### 10.3 Monitoring & Alerts
- ✅ Uptime monitoring
- ✅ Error tracking
- ✅ Performance monitoring
- ✅ Security monitoring

## 🎉 Deployment Complete!

Your Akazuba Florist application is now live in production! 

### 🌐 Live URLs
- **Frontend**: https://akazubaflorist.vercel.app
- **Backend API**: https://akazuba-backend-api.onrender.com
- **Admin Panel**: https://akazubaflorist.vercel.app/admin

### 📊 Monitoring Dashboards
- **Vercel**: https://vercel.com/dashboard
- **Render**: https://dashboard.render.com

### 🔧 Management
- **Database**: Managed via Render dashboard
- **Logs**: Available in both Vercel and Render dashboards
- **Analytics**: Built-in Vercel analytics + Google Analytics

## 🆘 Troubleshooting

### Common Issues
1. **Build Failures**: Check environment variables and dependencies
2. **Database Connection**: Verify DATABASE_URL is correct
3. **CORS Errors**: Ensure CORS_ORIGIN matches your frontend URL
4. **File Uploads**: Check UPLOAD_DIR permissions on Render

### Support Resources
- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Prisma Deployment Guide](https://www.prisma.io/docs/guides/deployment)

---

**🎊 Congratulations! Your Akazuba Florist e-commerce platform is now live and ready to serve customers! 🌸**
