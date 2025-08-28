# 🚀 Quick Deployment Guide

## Prerequisites
- GitHub repository with your code
- Vercel account
- Render account

## Quick Start

### 1. Push to GitHub
```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### 2. Deploy Database (Render)
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Create new **PostgreSQL** database
3. Note the connection string

### 3. Deploy Backend (Render)
1. Create new **Web Service**
2. Connect your GitHub repo
3. Set **Root Directory**: `backend`
4. Set **Build Command**: `npm install && npm run build`
5. Set **Start Command**: `npm start`
6. Add environment variables (see below)

### 4. Deploy Frontend (Vercel)
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Import your GitHub repo
3. Add environment variables (see below)
4. Deploy

## Environment Variables

### Backend (Render)
```bash
NODE_ENV=production
PORT=10000
DATABASE_URL=your-render-postgresql-url-here
JWT_SECRET=akazuba-jwt-secret-2024-production-super-secure
CORS_ORIGIN=https://online-shopping-by-diane.vercel.app
```

### Frontend (Vercel)
```bash
NEXT_PUBLIC_API_URL=https://akazuba-backend.onrender.com/api/v1
```

## Test Your Deployment
1. Backend health: `https://akazuba-backend.onrender.com/health`
2. Frontend: `https://online-shopping-by-diane.vercel.app`
3. Admin setup: `https://akazuba-backend.onrender.com/api/v1/admin/setup`

## Admin Access
- Email: `admin@akazubaflorist.com`
- Password: `akazuba2024`

For detailed instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)
