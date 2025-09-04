# Scentiva Rwanda - Online Flower & Perfume Shop

A modern, responsive e-commerce website for Scentiva Rwanda, specializing in premium flowers and luxury perfumes in Rwanda.

## 🌸 Features

### Core E-commerce Features
- **Product Catalog**: Beautiful display of flowers and perfumes with detailed descriptions
- **Shopping Cart**: Add products to cart with quantity management
- **Secure Payment**: MoMo (Mobile Money) and BK (Bank of Kigali) payment integration
- **Order Management**: Complete order tracking and management system
- **User Notifications**: Real-time notifications for successful payments and orders

### Payment Integration
- **MoMo Payment**: MTN Mobile Money integration with merchant code
- **BK Payment**: Bank of Kigali direct transfer
- **Payment Confirmation**: Automatic order processing after payment verification
- **Owner Notifications**: Instant notifications to shop owners for new orders

### User Experience
- **Responsive Design**: Mobile-first design that works on all devices
- **Modern UI**: Beautiful, intuitive interface with smooth animations
- **Product Search**: Advanced search functionality with filters
- **Wishlist**: Save favorite products for later
- **Customer Reviews**: Authentic customer testimonials and ratings

### Business Features
- **Inventory Management**: Real-time stock tracking
- **Order Analytics**: Sales reports and customer insights
- **Delivery Tracking**: Real-time delivery status updates
- **Customer Support**: Integrated chat and support system

## 🚀 Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Custom CSS
- **Icons**: Lucide React, Heroicons
- **Animations**: Framer Motion
- **Notifications**: React Hot Toast
- **Payment**: Custom MoMo and BK integration
- **Deployment**: Vercel (recommended)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd scentiva-rwanda
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Configuration

### Environment Variables
Create a `.env.local` file in the root directory:

```env
# Payment Configuration
MOMO_MERCHANT_CODE=123456
MOMO_ACCOUNT_NUMBER=0784586110
BK_ACCOUNT_NUMBER=00040-1234567-01

# Notification Settings
OWNER_EMAIL=info.akazubaflorist@gmail.com
OWNER_PHONE=0784586110

# Database (if using)
DATABASE_URL=postgresql://akazuba_user:WVkNIzcYTDXNAmOn893o1byvf7j6wDxN@dpg-d2o0b8ripnbc73d1n3pg-a/akazuba_florist
```

### Payment Setup
1. **MoMo Integration**:
   - Register with MTN Mobile Money for Business
   - Get your merchant code and account details
   - Update the configuration in `components/PaymentMethods.tsx`

2. **BK Integration**:
   - Set up business account with Bank of Kigali
   - Configure online banking credentials
   - Update account details in the payment component

## 📱 Features in Detail

### Product Display
- High-quality product images with zoom functionality
- Detailed product descriptions and specifications
- Price display in Rwandan Francs (RWF)
- Stock availability indicators
- Customer ratings and reviews

### Payment Process
1. **Add to Cart**: Users can add products to their shopping cart
2. **Checkout**: Secure checkout process with delivery information
3. **Payment Selection**: Choose between MoMo or BK payment
4. **Payment Instructions**: Clear step-by-step payment instructions
5. **Confirmation**: Automatic order confirmation after payment
6. **Notifications**: Both customer and owner receive notifications

### Customer Experience
- **Same Day Delivery**: Available in Kigali and surrounding areas
- **Free Delivery**: On orders above RWF 50,000
- **Customer Support**: 24/7 support via phone and email
- **Returns Policy**: 7-day return policy for unused items

## 🎨 Design System

### Color Palette
- **Primary**: Pink/Rose (#ec4899)
- **Secondary**: Green (#22c55e)
- **Accent**: Yellow (#eab308)
- **Neutral**: Gray scale for text and backgrounds

### Typography
- **Headings**: Inter (Bold)
- **Body**: Inter (Regular)
- **Display**: Playfair Display (for special headings)

### Components
- **Cards**: Product cards with hover effects
- **Buttons**: Primary, secondary, and outline variants
- **Forms**: Clean, accessible form components
- **Navigation**: Sticky header with mobile menu

## 📊 Business Logic

### Order Flow
1. Customer browses products
2. Adds items to cart
3. Proceeds to checkout
4. Selects payment method
5. Completes payment via MoMo or BK
6. System verifies payment
7. Order is confirmed and owner is notified
8. Customer receives confirmation
9. Order is processed and delivered

### Payment Verification
- **MoMo**: SMS confirmation and transaction ID verification
- **BK**: Bank transfer confirmation and reference matching
- **Manual Verification**: Owner can manually verify payments
- **Auto-processing**: Orders are automatically processed after verification

## 🔧 Customization

### Adding New Products
1. Update `data/products.ts` with new product information
2. Add product images to the public directory
3. Update categories if needed
4. Test the product display

### Modifying Payment Methods
1. Edit `components/PaymentMethods.tsx`
2. Update account details and instructions
3. Test payment flow
4. Update environment variables

### Styling Changes
1. Modify `tailwind.config.js` for theme changes
2. Update `app/globals.css` for custom styles
3. Edit component-specific styles as needed

## 🚀 Deployment

### Render (Recommended)
1. Connect your GitHub repository to Render
2. Set Root Directory to `backend`
3. Configure environment variables
4. Deploy automatically on push to main branch

### Environment Variables
Make sure to set these in your Render service:
- `DATABASE_URL` - Render PostgreSQL connection string
- `JWT_SECRET` - Secure JWT secret
- `CORS_ORIGIN` - Your Vercel frontend URL
- Other required variables (see `env.example`)

## 📞 Support

For technical support or business inquiries:
- **Email**: info.akazubaflorist@gmail.com
- **Phone**: 0784586110
- **Address**: Kigali, Rwanda

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
