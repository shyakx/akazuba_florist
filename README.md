# 🌸 Akazuba Florist - Premium Floral Arrangements

A modern, responsive e-commerce website for Akazuba Florist, offering beautiful flower arrangements and bouquets in Rwanda.

**Latest Update**: Backend deployment fixed and image loading issues resolved.

## 🚀 Live Site

**Production URL**: https://d238m8iiglcoij.cloudfront.net/

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
- **Static Export**: Deployed on AWS CloudFront for global performance
- **Mock Data**: Works offline with local data

## 🏗️ **Architecture**

### **Frontend Stack**
- **Framework**: Next.js 14.2.31 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Context API
- **Build**: Static export for CDN deployment

### **Deployment**
- **Hosting**: AWS CloudFront + S3
- **Domain**: CloudFront distribution
- **Build Process**: Static export for optimal performance

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+ and npm
- Git

### **Installation**
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
├── data/                  # Static data and mock data
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
NEXT_PUBLIC_API_URL=http://localhost:3000/api/backend
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
- **AWS CloudFront**: Global CDN
- **S3 Bucket**: Static file hosting
- **Automatic Build**: GitHub Actions (if configured)

### **Deployment Process**
```bash
# Build the project
npm run build

# Deploy to CloudFront
./deploy-simple.ps1
```

## 📞 **Support**

For technical support or questions:
- **Email**: info@akazuba.rw
- **Phone**: +250 784 586 110
- **Location**: Kigali, Rwanda

## 📄 **License**

This project is proprietary software for Akazuba Florist.

---

**Built with ❤️ for beautiful flowers and happy customers** 