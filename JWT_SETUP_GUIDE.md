# 🔐 JWT Configuration for Production Deployment

## ⚠️ CRITICAL: JWT_SECRET Configuration Required

Your build shows warnings about missing JWT_SECRET. This is **essential for production security**.

## 🚀 Quick Fix for Production

### 1. **Vercel (Frontend) Environment Variables**
Go to Vercel Dashboard → Your Project → Settings → Environment Variables:

```bash
JWT_SECRET=27f74d4094e2f4d8676cdabb12a17548181fa19903624a53f640ce08d5f50665
NEXT_PUBLIC_API_URL=https://akazuba-backend-api.onrender.com/api/v1
NODE_ENV=production
```

### 2. **Render (Backend) Environment Variables**
Go to Render Dashboard → Your Service → Environment:

```bash
JWT_SECRET=27f74d4094e2f4d8676cdabb12a17548181fa19903624a53f640ce08d5f50665
JWT_REFRESH_SECRET=27f74d4094e2f4d8676cdabb12a17548181fa19903624a53f640ce08d5f50665
DATABASE_URL=postgresql://akazuba_user:WVkNIzcYTDXNAmOn893o1byvf7j6wDxN@dpg-d2o0b8ripnbc73d1n3pg-a.oregon-postgres.render.com/akazuba_florist
CORS_ORIGIN=https://akazubaflorist.com
FRONTEND_URL=https://akazubaflorist.com
NODE_ENV=production
PORT=10000
```

**Note**: Your live domains are:
- **Primary**: https://akazubaflorist.com/
- **Alternative**: https://www.akazubaflorist.com/
- **Vercel**: https://akazuba-florist.vercel.app/

## 🔒 Security Notes

- **JWT_SECRET** must be the **same** on both frontend and backend
- Use a **strong, unique secret** (at least 32 characters)
- **Never commit** JWT secrets to git
- **Regenerate** secrets if compromised

## ✅ Verification

After setting environment variables:
1. **Redeploy** both frontend and backend
2. **Test authentication** (login/logout)
3. **Check admin panel** access
4. **Verify** no JWT warnings in build logs

## 🆘 Current Status

- ✅ **Build**: Successful
- ⚠️ **JWT_SECRET**: Needs production environment variable
- ✅ **Security**: Properly configured once JWT_SECRET is set
- ✅ **Deployment**: Ready to go live

**Your site is ready for production once JWT_SECRET is configured!**
