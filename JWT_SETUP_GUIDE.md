# 🔐 JWT Configuration for Production Deployment

## ⚠️ CRITICAL: JWT_SECRET Configuration Required

Your build shows warnings about missing JWT_SECRET. This is **essential for production security**.

## 🚀 Quick Fix for Production

### 1. **Vercel (Frontend) Environment Variables**
Go to Vercel Dashboard → Your Project → Settings → Environment Variables:

```bash
JWT_SECRET=akazuba-production-jwt-secret-2024-super-secure-key-for-production-deployment
NEXT_PUBLIC_API_URL=https://akazuba-backend-api.onrender.com/api/v1
NODE_ENV=production
```

### 2. **Render (Backend) Environment Variables**
Go to Render Dashboard → Your Service → Environment:

```bash
JWT_SECRET=akazuba-production-jwt-secret-2024-super-secure-key-for-production-deployment
JWT_REFRESH_SECRET=akazuba-production-refresh-secret-2024-super-secure-key-for-production-deployment
DATABASE_URL=your-postgresql-connection-string
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
