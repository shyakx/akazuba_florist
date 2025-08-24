<<<<<<< HEAD
# 🌸 Akazuba Florist Backend API

A robust, scalable backend API for the Akazuba Florist e-commerce platform built with Node.js, Express, TypeScript, and PostgreSQL.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Product Management**: CRUD operations for products and categories
- **Order Processing**: Complete order lifecycle management
- **Cart Management**: Shopping cart functionality
- **Payment Integration**: MoMo and BK payment gateways
- **File Upload**: Cloudinary integration for image management
- **Email Notifications**: SendGrid integration
- **API Documentation**: Swagger/OpenAPI documentation
- **Security**: Rate limiting, CORS, input validation
- **Logging**: Winston-based logging system
- **Testing**: Jest testing framework

## 🛠️ Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT + bcrypt
- **File Upload**: Multer + Cloudinary
- **Email**: Nodemailer + SendGrid
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest + Supertest
- **Logging**: Winston

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL 12+
- Redis (optional, for caching)
- npm or yarn

## 🔧 Installation
=======
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
>>>>>>> 2d2c1e45299f1c6935aabd8041c42266c4ee7236

1. **Clone the repository**
   ```bash
   git clone <repository-url>
<<<<<<< HEAD
   cd akazuba-florist-backend
=======
   cd scentiva-rwanda
>>>>>>> 2d2c1e45299f1c6935aabd8041c42266c4ee7236
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

<<<<<<< HEAD
3. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Set up the database**
   ```bash
   # Create PostgreSQL database
   createdb akazuba_florist
   
   # Run database migrations
   npm run db:migrate
   
   # Generate Prisma client
   npm run db:generate
   ```

5. **Seed the database (optional)**
   ```bash
   npm run db:seed
   ```

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

### Testing
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📚 API Documentation

Once the server is running, you can access the API documentation at:
- **Swagger UI**: `http://localhost:5000/api-docs`
- **Health Check**: `http://localhost:5000/health`

## 🗄️ Database Schema

The application uses the following main entities:

- **Users**: Customer and admin accounts
- **Categories**: Product categories
- **Products**: Product catalog
- **Orders**: Customer orders
- **Order Items**: Individual items in orders
- **Cart**: Shopping cart
- **Cart Items**: Items in cart
- **Wishlist**: Customer wishlists
- **Reviews**: Product reviews
- **Settings**: Application settings

## 🔐 Authentication

The API uses JWT tokens for authentication:

- **Access Token**: Short-lived (7 days)
- **Refresh Token**: Long-lived (30 days)
- **Role-based Access**: Customer, Admin, Staff roles

### Example Authentication Flow:

1. **Register/Login** → Receive access and refresh tokens
2. **API Requests** → Include access token in Authorization header
3. **Token Expiry** → Use refresh token to get new access token

## 📡 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Customer registration
- `POST /api/v1/auth/login` - Customer login
- `POST /api/v1/auth/admin/login` - Admin login
- `POST /api/v1/auth/logout` - Logout
- `POST /api/v1/auth/refresh` - Refresh token

### Users
- `GET /api/v1/users/profile` - Get user profile
- `PUT /api/v1/users/profile` - Update profile

### Products
- `GET /api/v1/products` - List products
- `GET /api/v1/products/:id` - Get product details
- `GET /api/v1/products/featured` - Get featured products

### Categories
- `GET /api/v1/categories` - List categories
- `GET /api/v1/categories/:id` - Get category details

### Cart
- `GET /api/v1/cart` - Get cart
- `POST /api/v1/cart/items` - Add item to cart
- `PUT /api/v1/cart/items/:id` - Update cart item
- `DELETE /api/v1/cart/items/:id` - Remove cart item

### Orders
- `GET /api/v1/orders` - List user orders
- `POST /api/v1/orders` - Create order
- `GET /api/v1/orders/:id` - Get order details

### Admin (Protected)
- `GET /api/v1/admin/products` - List all products
- `POST /api/v1/admin/products` - Create product
- `PUT /api/v1/admin/products/:id` - Update product
- `DELETE /api/v1/admin/products/:id` - Delete product
- `GET /api/v1/admin/orders` - List all orders
- `PUT /api/v1/admin/orders/:id` - Update order status

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | - |
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment | development |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_EXPIRES_IN` | JWT expiration time | 7d |
| `SENDGRID_API_KEY` | SendGrid API key | - |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | - |
| `CLOUDINARY_API_KEY` | Cloudinary API key | - |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | - |

## 🧪 Testing

The application includes comprehensive testing:

```bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

## 📦 Deployment

### Docker Deployment
```bash
# Build image
docker build -t akazuba-florist-backend .

# Run container
docker run -p 5000:5000 akazuba-florist-backend
```

### Environment Setup
1. Set up PostgreSQL database
2. Configure environment variables
3. Run database migrations
4. Start the application

## 🔒 Security Features

- **Rate Limiting**: Prevents abuse
- **CORS**: Cross-origin resource sharing
- **Helmet**: Security headers
- **Input Validation**: Request validation
- **SQL Injection Prevention**: Prisma ORM
- **XSS Protection**: Input sanitization
- **JWT Security**: Secure token handling

## 📊 Monitoring & Logging

- **Winston Logging**: Structured logging
- **Error Tracking**: Comprehensive error handling
- **Health Checks**: Application health monitoring
- **Performance Monitoring**: Request/response timing
=======
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
MOMO_ACCOUNT_NUMBER=0788123456
BK_ACCOUNT_NUMBER=00040-1234567-01

# Notification Settings
OWNER_EMAIL=owner@scentivarwanda.com
OWNER_PHONE=+250788123456

# Database (if using)
DATABASE_URL=your_database_url
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

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main branch

### Other Platforms
- **Netlify**: Similar process to Vercel
- **AWS**: Use Amplify or EC2
- **DigitalOcean**: Deploy to App Platform or Droplet

## 📞 Support

For technical support or business inquiries:
- **Email**: info@scentivarwanda.com
- **Phone**: +250 788 123 456
- **Address**: Kimihurura, KG 123 St, Kigali, Rwanda

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
>>>>>>> 2d2c1e45299f1c6935aabd8041c42266c4ee7236

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
<<<<<<< HEAD
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Email: support@akazubaflorist.com
- Documentation: `/api-docs` endpoint
- Issues: GitHub Issues

---

**Built with ❤️ for Akazuba Florist** 
=======
4. Test thoroughly
5. Submit a pull request

## 🎯 Roadmap

### Phase 2 Features
- [ ] User accounts and profiles
- [ ] Advanced search and filtering
- [ ] Wishlist functionality
- [ ] Loyalty program
- [ ] Bulk ordering
- [ ] Corporate accounts

### Phase 3 Features
- [ ] Mobile app development
- [ ] AI-powered recommendations
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] International shipping

---

**Scentiva Rwanda** - Bringing beauty and elegance to Rwanda through premium flowers and luxury perfumes. 🌸✨ 
>>>>>>> 2d2c1e45299f1c6935aabd8041c42266c4ee7236
