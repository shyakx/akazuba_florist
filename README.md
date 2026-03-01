# AKAZUBA FLORIST 🌸

**Production E-commerce Platform** - A premium online flower and perfume delivery service based in Kigali, Rwanda. This is the official production website for Akazuba Florist, serving customers throughout Rwanda with fresh flowers, perfumes, and gift items.

## 🌐 Live Site
- **Website**: [https://akazubaflorist.com](https://akazubaflorist.com)
- **Status**: ✅ Production Ready
- **Launch Date**: 2025

## Business Overview 🏪

Akazuba Florist is a registered business specializing in:
- Fresh flower arrangements and bouquets
- Premium perfumes and fragrances
- Gift items for special occasions
- Wedding and event decorations
- Corporate flower services

**Service Areas**: Kigali and throughout Rwanda
**Business Hours**: Monday - Saturday, 8:00 AM - 6:00 PM

## Features ✨

- **User Authentication**: Secure signup and login with Supabase Auth
- **Product Catalog**: Browse flowers, perfumes, bouquets, and gifts
- **Shopping Cart**: Add items to cart and manage quantities
- **Wishlist**: Save favorite products for later
- **Admin Dashboard**: Manage products, categories, and orders
- **Responsive Design**: Works perfectly on all devices
- **Real Images**: High-quality product images
- **Contact Integration**: Easy contact and support

## Production Architecture 🏗️

### Infrastructure
- **Frontend Hosting**: Vercel (CDN-enabled)
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage
- **Domain**: akazubaflorist.com (custom domain with SSL)
- **Email Service**: EmailJS for contact forms

### Security Features
- HTTPS enforcement with SSL certificates
- Security headers (XSS protection, content type options)
- Row Level Security (RLS) on database
- Secure authentication flows
- Environment variable protection

## Tech Stack 🛠️

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Icons**: Lucide React
- **Email**: EmailJS
- **Deployment**: Vercel with custom domain

## Development Setup �

> **Note**: This repository contains the production code. For development, please ensure you have proper authorization from Akazuba Florist management.

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (for local development)

### Local Development
1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd akazuba_florist
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp env.example .env
   ```

4. **Configure environment variables**
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Build for production**
   ```bash
   npm run build
   ```

## Deployment 📦

### Production Deployment
The site is automatically deployed to Vercel on pushes to the main branch. See `DEPLOYMENT_GUIDE.md` for detailed deployment instructions.

### Environment Variables Required
- `VITE_SUPABASE_URL`: Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Supabase anonymous key

## Business Information 📞

### Contact Details
- **Business Name**: Akazuba Florist
- **Contact Person**: Diane Umwali
- **Phone**: +250 784 586 110
- **Email**: info.akazubaflorist@gmail.com
- **Location**: Kigali, Rwanda

### Payment Methods 💳
- MTN Mobile Money
- Bank of Kigali (BK)
- Cash on Delivery

### Service Areas 📍
- Kigali City (all districts)
- Provinces throughout Rwanda
- Same-day delivery available in Kigali
- Next-day delivery for other provinces

## Legal & Licensing ⚖️

- **Business Registration**: Registered in Rwanda
- **Copyright**: © 2025 Akazuba Florist. All rights reserved.
- **License**: Proprietary - Unauthorized reproduction prohibited

## Support 🛟

For technical support or business inquiries:
- **Technical**: Contact development team through business email
- **Business**: Call +250 784 586 110
- **Email**: info.akazubaflorist@gmail.com

---

**AKAZUBA FLORIST** - Premium flowers and perfumes delivered throughout Rwanda 🌸

*This is a production application. Unauthorized access or modifications are strictly prohibited.*
