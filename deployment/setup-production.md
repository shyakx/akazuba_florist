# 🚀 Production Setup Checklist

## ✅ Pre-Deployment Checklist

### 1. Code Preparation
- [ ] All tests passing (100% success rate achieved ✅)
- [ ] Build successful (`npm run build` works ✅)
- [ ] No TypeScript errors
- [ ] No linting errors
- [ ] All environment variables documented
- [ ] Database migrations ready

### 2. Security Review
- [ ] JWT secrets are secure and unique
- [ ] Database credentials are secure
- [ ] CORS properly configured
- [ ] Rate limiting implemented
- [ ] Input validation in place
- [ ] XSS protection enabled
- [ ] CSRF protection enabled

### 3. Performance Optimization
- [ ] Database indexes configured
- [ ] Image optimization enabled
- [ ] Code splitting implemented
- [ ] Caching strategy in place
- [ ] Compression enabled
- [ ] CDN configured

## 🗄️ Database Setup (Render)

### Step 1: Create PostgreSQL Database
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"PostgreSQL"**
3. Configure:
   - **Name**: `akazuba-database`
   - **Database Name**: `akazuba_production`
   - **User**: `akazuba_user`
   - **Plan**: `Starter` (Free tier)
   - **Region**: `Oregon (US West)` or closest to your users
4. Click **"Create Database"**
5. Wait for database to be ready (2-3 minutes)
6. **Copy the External Database URL** - you'll need this!

### Step 2: Run Database Migrations
```bash
# Set your database URL
export DATABASE_URL="postgresql://akazuba_user:password@dpg-xxxxx-a.oregon-postgres.render.com:5432/akazuba_production"

# Generate Prisma client
cd backend
npx prisma generate

# Push schema to database
npx prisma db push

# Optional: Seed with initial data
npx prisma db seed
```

## 🔧 Backend Setup (Render)

### Step 1: Create Web Service
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

### Step 2: Environment Variables
Add these in Render dashboard:

```env
NODE_ENV=production
PORT=10000
DATABASE_URL=postgresql://akazuba_user:password@dpg-xxxxx-a.oregon-postgres.render.com:5432/akazuba_production
JWT_SECRET=your_super_secure_jwt_secret_key_min_32_chars_here
JWT_REFRESH_SECRET=your_super_secure_refresh_secret_key_min_32_chars_here
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

### Step 3: Deploy Backend
1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Your API will be at: `https://akazuba-backend-api.onrender.com`

## 🌐 Frontend Setup (Vercel)

### Step 1: Connect Repository
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"New Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: `./` (root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### Step 2: Environment Variables
Add these in Vercel dashboard:

```env
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://akazubaflorist.vercel.app
NEXT_PUBLIC_APP_NAME=Akazuba Florist
NEXT_PUBLIC_APP_DESCRIPTION=Premium flowers and perfumes in Rwanda
NEXT_PUBLIC_API_URL=https://akazuba-backend-api.onrender.com
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
FACEBOOK_PIXEL_ID=your_facebook_pixel_id
```

### Step 3: Deploy Frontend
1. Click **"Deploy"**
2. Wait for deployment (3-5 minutes)
3. Your app will be at: `https://akazubaflorist.vercel.app`

## 🔗 Custom Domain Setup (Optional)

### Step 1: Vercel Domain
1. Go to your project in Vercel dashboard
2. Click **"Settings"** → **"Domains"**
3. Add your domain: `akazubaflorist.com`
4. Follow DNS configuration instructions
5. SSL certificate will be auto-provisioned

### Step 2: Update Environment Variables
After domain setup, update:
- `NEXT_PUBLIC_APP_URL=https://akazubaflorist.com`
- `CORS_ORIGIN=https://akazubaflorist.com`

## 🧪 Testing Production

### Health Checks
Test these endpoints:
- ✅ Frontend: `https://akazubaflorist.vercel.app`
- ✅ Backend Health: `https://akazuba-backend-api.onrender.com/api/health`
- ✅ API Products: `https://akazuba-backend-api.onrender.com/api/products`

### Functional Tests
- [ ] User registration/login
- [ ] Product browsing
- [ ] Shopping cart
- [ ] Order placement
- [ ] Admin panel access
- [ ] File uploads
- [ ] Payment processing

## 📊 Monitoring Setup

### Vercel Analytics
- Built-in analytics available
- Real-time performance metrics
- Core Web Vitals monitoring

### Render Monitoring
- Built-in logs and metrics
- Uptime monitoring
- Performance insights

### Custom Analytics
- Google Analytics integration
- Facebook Pixel tracking
- Custom event tracking

## 🎉 Deployment Complete!

### Live URLs
- **Frontend**: https://akazubaflorist.vercel.app
- **Backend API**: https://akazuba-backend-api.onrender.com
- **Admin Panel**: https://akazubaflorist.vercel.app/admin

### Management Dashboards
- **Vercel**: https://vercel.com/dashboard
- **Render**: https://dashboard.render.com

---

**🚀 Your Akazuba Florist e-commerce platform is now live and ready to serve customers! 🌸**
