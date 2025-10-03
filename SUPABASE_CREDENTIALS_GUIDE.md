# How to Get Your Supabase Credentials 🔑

## Step-by-Step Guide

### 1. Go to Supabase Dashboard
- Visit [supabase.com](https://supabase.com)
- Sign in to your account
- Select your AKAZUBA FLORIST project

### 2. Navigate to Settings
- Click on the **"Settings"** icon in the left sidebar (gear icon)
- Click on **"API"** from the settings menu

### 3. Copy Your Credentials
You'll see a section called **"Project API keys"**:

#### Project URL:
- Look for **"Project URL"**
- Copy the URL (looks like: `https://your-project-id.supabase.co`)

#### Anon Public Key:
- Look for **"anon public"** key
- Copy the long key that starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 4. Add to Vercel
Use these values in your Vercel environment variables:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Important Notes ⚠️

- **Never share your service_role key** - only use the anon key
- The anon key is safe to use in frontend applications
- Make sure your Supabase project is active and running
