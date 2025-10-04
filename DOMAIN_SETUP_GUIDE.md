# 🌐 Custom Domain Setup Guide for AKAZUBA FLORIST

## Overview
This guide will help you set up your custom domain `akazubaflorist.com` on Vercel and configure all necessary settings.

## Step 1: Add Domain to Vercel

### 1.1 Access Vercel Dashboard
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Find your `akazuba-florist` project
3. Click on the project to open it

### 1.2 Add Domain
1. Click on **"Settings"** tab
2. Click on **"Domains"** in the left sidebar
3. Click **"Add Domain"**
4. Enter: `akazubaflorist.com`
5. Click **"Add"**

### 1.3 Get DNS Configuration
Vercel will show you the DNS records needed. Note down:
- **A Record**: `@` → `216.198.79.1` (Updated IP address)
- **CNAME Record**: `www` → `39dc2a9a667c6364.vercel-dns-017.com.` (Updated CNAME)

## Step 2: Configure Namecheap DNS

### 2.1 Access Namecheap
1. Go to [namecheap.com](https://namecheap.com)
2. Log into your account
3. Go to **"Domain List"**

### 2.2 Update DNS Records
1. Find `akazubaflorist.com`
2. Click **"Manage"**
3. Go to **"Advanced DNS"** tab
4. **Remove existing records** for `@` and `www`
5. **Add new records**:
   - **A Record**: Host `@`, Value `216.198.79.1`, TTL `Automatic`
   - **CNAME Record**: Host `www`, Value `39dc2a9a667c6364.vercel-dns-017.com.`, TTL `Automatic`

## Step 3: Update Supabase Configuration

### 3.1 Access Supabase Dashboard
1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project

### 3.2 Update Authentication URLs
1. Go to **"Authentication"** → **"URL Configuration"**
2. Update **Site URL** to: `https://akazubaflorist.com`
3. Add **Redirect URLs**:
   - `https://akazubaflorist.com`
   - `https://www.akazubaflorist.com`
   - `https://akazubaflorist.com/auth/callback`

## Step 4: Update Vercel Environment Variables

### 4.1 Access Vercel Environment Variables
1. In your Vercel project dashboard
2. Go to **"Settings"** → **"Environment Variables"**

### 4.2 Update Variables (if needed)
Make sure these are set correctly:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
VITE_ADMIN_EMAIL=info.akazubaflorist@gmail.com
```

## Step 5: Verify Setup

### 5.1 Check Domain Status
1. In Vercel dashboard, check domain status
2. Should show "Valid Configuration" when DNS propagates
3. This can take 5-60 minutes

### 5.2 Test Your Site
1. Visit `https://akazubaflorist.com`
2. Visit `https://www.akazubaflorist.com`
3. Both should redirect to your Vercel app
4. Test authentication (login/signup)
5. Test admin panel access

## Step 6: Force HTTPS (Already Configured)

Your `vercel.json` already includes HTTPS redirects:
```json
{
  "redirects": [
    {
      "source": "/(.*)",
      "has": [
        {
          "type": "host",
          "value": "akazubaflorist.com"
        }
      ],
      "destination": "https://akazubaflorist.com/$1",
      "permanent": true
    }
  ]
}
```

## Troubleshooting

### Domain Not Working?
1. **Check DNS Propagation**: Use [whatsmydns.net](https://whatsmydns.net)
2. **Wait 24-48 hours**: DNS changes can take time
3. **Check Vercel Status**: Ensure domain shows "Valid Configuration"

### Authentication Issues?
1. **Check Supabase URLs**: Make sure all redirect URLs are correct
2. **Clear Browser Cache**: Try incognito/private browsing
3. **Check Environment Variables**: Ensure they're set in Vercel

### SSL Certificate Issues?
1. **Wait for SSL**: Vercel automatically provisions SSL certificates
2. **Check Certificate Status**: Should show "Valid" in Vercel dashboard

## Expected Timeline
- **DNS Propagation**: 5-60 minutes
- **SSL Certificate**: 5-15 minutes
- **Full Setup**: Usually within 1 hour

## Final Result
After setup, your site will be accessible at:
- ✅ `https://akazubaflorist.com`
- ✅ `https://www.akazubaflorist.com`
- ✅ Both redirect to HTTPS automatically
- ✅ SSL certificate automatically provisioned
- ✅ Authentication working with custom domain
