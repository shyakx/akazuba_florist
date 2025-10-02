# AKAZUBA FLORIST - Deployment Guide 🌸

This guide will help you deploy your AKAZUBA FLORIST e-commerce application to production.

## Prerequisites ✅

1. **Supabase Project**: Your database is already set up and working
2. **Git Repository**: Your code should be in a Git repository (GitHub, GitLab, etc.)
3. **Node.js**: Version 18+ installed locally

## Deployment Options 🚀

### Option 1: Vercel (Recommended)
**Best for**: React apps, automatic deployments, custom domains

**Pros**:
- ✅ Excellent React/Vite support
- ✅ Automatic deployments from Git
- ✅ Free tier with generous limits
- ✅ Easy custom domain setup
- ✅ Built-in CDN and performance optimizations

### Option 2: Netlify
**Best for**: Static sites, form handling, serverless functions

**Pros**:
- ✅ Great for React apps
- ✅ Free tier available
- ✅ Easy drag-and-drop deployment
- ✅ Built-in form handling

### Option 3: Railway
**Best for**: Full-stack apps, databases

**Pros**:
- ✅ Supports both frontend and backend
- ✅ Easy database hosting
- ✅ Simple deployment process

## Step-by-Step Deployment (Vercel) 🎯

### Step 1: Prepare Your Project

1. **Create Environment Variables File**:
   ```bash
   # Copy the example file
   cp env.example .env
   ```

2. **Add Your Supabase Credentials**:
   - Go to your Supabase Dashboard
   - Navigate to Settings → API
   - Copy your Project URL and anon public key
   - Add them to your `.env` file:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### Step 2: Test Build Locally

```bash
# Install dependencies
npm install

# Test production build
npm run build

# Preview production build
npm run preview
```

### Step 3: Deploy to Vercel

#### Method A: Vercel CLI (Fastest)
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from your project directory
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (your account)
# - Link to existing project? N
# - Project name? akazuba-florist
# - Directory? ./
# - Override settings? N
```

#### Method B: GitHub Integration (Recommended)
1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with GitHub
   - Click "New Project"
   - Import your GitHub repository
   - Configure build settings:
     - **Framework Preset**: Vite
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
     - **Install Command**: `npm install`

3. **Add Environment Variables**:
   - In Vercel dashboard, go to your project
   - Navigate to Settings → Environment Variables
   - Add:
     - `VITE_SUPABASE_URL`: Your Supabase URL
     - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key

4. **Deploy**:
   - Click "Deploy" button
   - Wait for deployment to complete

### Step 4: Configure Custom Domain (Optional)

1. **In Vercel Dashboard**:
   - Go to your project → Settings → Domains
   - Add your custom domain (e.g., `akazubaflorist.com`)
   - Follow DNS configuration instructions

2. **DNS Configuration**:
   - Add a CNAME record pointing to your Vercel domain
   - Wait for DNS propagation (can take up to 24 hours)

## Post-Deployment Checklist ✅

### 1. Test Your Application
- [ ] Visit your deployed URL
- [ ] Test user registration/login
- [ ] Browse products
- [ ] Test cart functionality
- [ ] Test checkout process
- [ ] Verify contact information displays correctly

### 2. Configure Supabase for Production
- [ ] Update Supabase Auth settings:
  - Go to Authentication → URL Configuration
  - Add your production domain to "Site URL"
  - Add your production domain to "Redirect URLs"

### 3. Performance Optimization
- [ ] Enable Vercel Analytics (optional)
- [ ] Configure caching headers
- [ ] Optimize images (already done with your product images)

## Environment Variables Reference 🔧

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes |

## Troubleshooting 🛠️

### Common Issues:

1. **Build Fails**:
   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

2. **Environment Variables Not Working**:
   - Ensure variables start with `VITE_`
   - Redeploy after adding variables
   - Check Vercel dashboard for correct values

3. **Supabase Connection Issues**:
   - Verify URL and key are correct
   - Check Supabase project is active
   - Ensure RLS policies are properly configured

4. **Images Not Loading**:
   - Verify image paths are correct
   - Check if images are in the `public` folder
   - Ensure file extensions match exactly

## Monitoring & Maintenance 📊

### Vercel Dashboard Features:
- **Analytics**: Track visitors and performance
- **Functions**: Monitor serverless function logs
- **Deployments**: View deployment history
- **Domains**: Manage custom domains

### Regular Maintenance:
- Keep dependencies updated
- Monitor Supabase usage and limits
- Backup database regularly
- Review and update product inventory

## Support Resources 📚

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Vite Docs**: [vitejs.dev](https://vitejs.dev)

---

## Quick Deploy Commands 🚀

```bash
# Test build locally
npm run build && npm run preview

# Deploy with Vercel CLI
vercel --prod

# Check deployment status
vercel ls
```

Your AKAZUBA FLORIST application is now ready for the world! 🌸✨
