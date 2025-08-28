# Environment Setup Guide

## Overview
This application is configured to use the production backend by default for immediate deployment and use.

## Environment Configuration

### Default Configuration (Production Ready)
- **API URL**: `https://akazuba-backend-api.onrender.com/api/v1`
- **Backend**: Deployed backend on Render
- **CORS**: Configured for production domains
- **Status**: Ready for immediate deployment

### Development Override (Optional)
To use local backend during development, set:
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

## Environment Variables

### Optional: Explicit API URL Override
You can override the automatic detection by setting:
```bash
NEXT_PUBLIC_API_URL=https://your-custom-backend.com/api/v1
```

### Development Setup
1. **Start Local Backend**:
   ```bash
   cd backend
   npm run dev
   ```

2. **Start Frontend**:
   ```bash
   npm run dev
   ```

3. **Verify Backend Health**:
   ```bash
   curl http://localhost:5000/health
   ```

### Production Deployment
The application automatically uses the production backend when deployed:
- Vercel: Uses production backend automatically
- Other platforms: Set `NODE_ENV=production`

## API URL Logic

```typescript
// Priority order:
1. NEXT_PUBLIC_API_URL (if set) - Manual override
2. Default → akazuba-backend-api.onrender.com (production)
```

## Troubleshooting

### CORS Issues in Development
- Ensure backend is running on port 5000
- Check backend CORS configuration allows localhost:3000
- Verify backend health endpoint responds

### Production Issues
- Check if backend is deployed and accessible
- Verify CORS allows your production domain
- Check environment variables in deployment platform

## Backend CORS Configuration
The backend is configured to allow:
- `http://localhost:3000` (development)
- `https://online-shopping-by-diane.vercel.app` (production)
- `https://online-shopping-by-diane-git-main-steven-shyakas-projects.vercel.app` (preview deployments)
