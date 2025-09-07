# 🌸 Akazuba Florist - Premium Floral Arrangements

A modern, responsive e-commerce website for Akazuba Florist, offering beautiful flower arrangements and bouquets in Rwanda.

 to start a fresh **Latest Update**: 🚀 **PRODUCTION READY** - All localhost dependencies removed, completely configured for production deployment. Ready to go live!

## 🚀 Live Site

**Frontend URL**: https://online-shopping-by-diane.vercel.app/
**Backend URL**: https://akazuba-backend-api.onrender.com/

## ✨ Features

### 🛍️ **E-commerce Features**
- **Product Catalog**: Browse flowers by type, color, and occasion
- **Search Functionality**: Find flowers by name, type, or occasion
- **Shopping Cart**: Add items with local storage
- **Wishlist**: Save favorite products
- **User Authentication**: Sign in/register system
- **Order Management**: Track orders and view history

### 🎨 **Design & UX**
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Modern UI**: Clean, professional design with pink/rose theme
- **Fast Loading**: Optimized for performance
- **Accessibility**: User-friendly navigation and interactions

### 🔧 **Technical Features**
- **Next.js 14**: Latest React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Static Export**: Optimized for Vercel deployment
- **Backend API**: Full backend integration with Render deployment

## 🏗️ **Architecture**

### **Frontend Stack**
- **Framework**: Next.js 14.2.31 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Context API
- **Build**: Optimized for Vercel deployment

### **Deployment**
- **Frontend**: Vercel (Next.js hosting)
- **Backend**: Render (Node.js API)
- **Database**: Render PostgreSQL
- **Build Process**: Automatic deployment via GitHub

## 🚀 **Production Deployment**

### **Status**: 🟢 **READY FOR PRODUCTION**

Your Akazuba Florist platform is **100% production-ready** with no localhost dependencies. All configurations are optimized for production deployment.

### **Quick Deploy**
1. **Backend**: Deploy to Render using `backend/render.yaml`
2. **Frontend**: Deploy to Vercel using `vercel.json`
3. **Database**: Set up production PostgreSQL
4. **Go Live**: Your e-commerce platform will be fully operational

### **For Development (Optional)**
```bash
# Clone the repository
git clone <repository-url>
cd akazuba-florist

# Install dependencies
npm install

# Start development server
npm run dev
```

### **Available Scripts**
   ```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 📁 **Project Structure**

```
akazuba-florist/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── admin/             # Admin dashboard
│   ├── category/          # Product category pages
│   └── ...
├── components/            # Reusable React components
├── contexts/              # React Context providers
├── data/                  # Static data and API fallback data
├── lib/                   # Utility functions and API
├── public/                # Static assets
└── types/                 # TypeScript type definitions
```

## 🔐 **Authentication**

### **User Types**
- **Customers**: Can browse, add to cart, and place orders
- **Admins**: Full access to admin dashboard and analytics

### **Features**
- **Public Access**: Browse products without signing in
- **User Registration**: Create account for full features
- **Admin Panel**: Manage products, orders, and analytics

## 🛒 **Shopping Experience**

### **Product Browsing**
- **Categories**: Browse by flower type (Roses, Tulips, etc.)
- **Colors**: Filter by color preferences
- **Occasions**: Find flowers for specific events
- **Search**: Quick search functionality

### **Cart & Checkout**
- **Local Storage**: Cart persists across sessions
- **Quantity Management**: Adjust item quantities
- **Checkout Process**: Streamlined ordering

## 🎯 **Key Pages**

- **Homepage**: Featured products and search
- **Categories**: Product listings by type/color
- **Product Details**: Individual product pages
- **Cart**: Shopping cart management
- **Checkout**: Order completion
- **User Dashboard**: Order history and profile
- **Admin Panel**: Backend management

## 🔧 **Development**

### **Environment Setup**
   ```bash
# Copy environment example
cp env.example .env.local

# Configure environment variables
NEXT_PUBLIC_API_URL=https://akazuba-backend-api.onrender.com/api/v1
NODE_ENV=development
```

### **Code Quality**
- **TypeScript**: Strict type checking
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting

## 📊 **Performance**

- **Static Export**: Pre-built HTML for fast loading
- **CDN Deployment**: Global content delivery
- **Optimized Images**: WebP format with fallbacks
- **Code Splitting**: Automatic bundle optimization

## 🌐 **Deployment**

### **Current Setup**
- **Frontend**: Vercel (Next.js hosting)
- **Backend**: Render (Node.js API)
- **Database**: Render PostgreSQL
- **Automatic Build**: GitHub integration

### **Deployment Process**
```bash
# Build the project
npm run build

# Deploy automatically via GitHub push
# Frontend: Vercel auto-deploys from main branch
# Backend: Render auto-deploys from main branch
```

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

## 📞 **Support**

For technical support or questions:
- **Email**: info.akazubaflorist@gmail.com
- **Phone**: 0784586110
- **Location**: Kigali, Rwanda

**Admin Access:**
- **Primary Admin**: info.akazubaflorist@gmail.com (password: akazuba2024)
- **Info Admin**: info.akazubaflorist@gmail.com (password: akazuba2024)

## 📄 **License**

This project is proprietary software for Akazuba Florist.

---

**Built with ❤️ for beautiful flowers and happy customers** 