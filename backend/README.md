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

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd akazuba-florist-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

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

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
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