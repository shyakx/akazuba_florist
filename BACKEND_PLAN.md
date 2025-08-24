# 🚀 Akazuba Florist - Backend & Database Architecture Plan

## 📋 **Project Overview**
Full-stack e-commerce platform for Akazuba Florist with admin dashboard, customer management, and order processing.

---

## 🗄️ **Database Schema Design**

### **1. Users Table**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  role ENUM('customer', 'admin', 'staff') DEFAULT 'customer',
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **2. Categories Table**
```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **3. Products Table**
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  short_description VARCHAR(500),
  price DECIMAL(10,2) NOT NULL,
  sale_price DECIMAL(10,2),
  cost_price DECIMAL(10,2),
  sku VARCHAR(100) UNIQUE,
  stock_quantity INTEGER DEFAULT 0,
  min_stock_alert INTEGER DEFAULT 5,
  category_id UUID REFERENCES categories(id),
  images JSONB, -- Array of image URLs
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  weight DECIMAL(8,2),
  dimensions JSONB, -- {length, width, height}
  tags TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **4. Orders Table**
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id),
  status ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  subtotal DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  shipping_amount DECIMAL(10,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  payment_method ENUM('momo', 'bk', 'cash') NOT NULL,
  payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
  shipping_address JSONB NOT NULL,
  billing_address JSONB,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **5. Order Items Table**
```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_name VARCHAR(255) NOT NULL,
  product_sku VARCHAR(100),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **6. Cart Table**
```sql
CREATE TABLE cart (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  session_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **7. Cart Items Table**
```sql
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id UUID REFERENCES cart(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **8. Wishlist Table**
```sql
CREATE TABLE wishlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, product_id)
);
```

### **9. Reviews Table**
```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  title VARCHAR(255),
  comment TEXT,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **10. Settings Table**
```sql
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔧 **Backend Technology Stack**

### **Core Technologies:**
- **Runtime:** Node.js with TypeScript
- **Framework:** Express.js or Fastify
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** JWT + bcrypt
- **File Upload:** Multer + Cloudinary
- **Email:** Nodemailer + SendGrid
- **Payment:** Integration with MoMo and BK APIs
- **Validation:** Joi or Zod
- **Testing:** Jest + Supertest

### **Additional Tools:**
- **Caching:** Redis
- **Queue:** Bull (for background jobs)
- **Logging:** Winston
- **Documentation:** Swagger/OpenAPI
- **Monitoring:** Sentry
- **Rate Limiting:** Express-rate-limit

---

## 🏗️ **API Architecture**

### **Base URL:** `https://api.akazubaflorist.com/v1`

### **Authentication Endpoints:**
```
POST   /auth/register          # Customer registration
POST   /auth/login             # Customer login
POST   /auth/admin/login       # Admin login
POST   /auth/logout            # Logout
POST   /auth/refresh           # Refresh token
POST   /auth/forgot-password   # Forgot password
POST   /auth/reset-password    # Reset password
```

### **User Management:**
```
GET    /users/profile          # Get user profile
PUT    /users/profile          # Update profile
PUT    /users/password         # Change password
DELETE /users/account          # Delete account
```

### **Products & Categories:**
```
GET    /categories             # List categories
GET    /categories/:id         # Get category details
GET    /products               # List products (with filters)
GET    /products/:id           # Get product details
GET    /products/search        # Search products
GET    /products/featured      # Get featured products
```

### **Cart Management:**
```
GET    /cart                   # Get cart items
POST   /cart/items             # Add item to cart
PUT    /cart/items/:id         # Update cart item
DELETE /cart/items/:id         # Remove cart item
DELETE /cart                   # Clear cart
```

### **Orders:**
```
GET    /orders                 # List user orders
POST   /orders                 # Create order
GET    /orders/:id             # Get order details
PUT    /orders/:id/cancel      # Cancel order
GET    /orders/:id/track       # Track order
```

### **Admin Endpoints:**
```
# Products Management
GET    /admin/products         # List all products
POST   /admin/products         # Create product
PUT    /admin/products/:id     # Update product
DELETE /admin/products/:id     # Delete product

# Orders Management
GET    /admin/orders           # List all orders
PUT    /admin/orders/:id       # Update order status
GET    /admin/orders/stats     # Order statistics

# User Management
GET    /admin/users            # List all users
PUT    /admin/users/:id        # Update user
DELETE /admin/users/:id        # Delete user

# Analytics
GET    /admin/analytics/sales  # Sales analytics
GET    /admin/analytics/products # Product analytics
GET    /admin/analytics/customers # Customer analytics
```

---

## 🔐 **Security Implementation**

### **Authentication & Authorization:**
- JWT tokens with refresh mechanism
- Role-based access control (RBAC)
- Password hashing with bcrypt
- Rate limiting on auth endpoints
- Session management

### **Data Protection:**
- Input validation and sanitization
- SQL injection prevention (Prisma ORM)
- XSS protection
- CORS configuration
- HTTPS enforcement

### **API Security:**
- API key authentication for admin routes
- Request/response encryption
- Audit logging
- Error handling without sensitive data exposure

---

## 📊 **Database Indexes & Optimization**

### **Primary Indexes:**
```sql
-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Products
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_products_price ON products(price);

-- Orders
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at);

-- Reviews
CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_approved ON reviews(is_approved);
```

### **Full-Text Search:**
```sql
-- Product search
CREATE INDEX idx_products_search ON products USING gin(to_tsvector('english', name || ' ' || description));
```

---

## 🔄 **Background Jobs & Services**

### **Scheduled Tasks:**
- **Daily:** Stock level alerts, sales reports
- **Weekly:** Customer newsletter, inventory reports
- **Monthly:** Analytics compilation, backup verification

### **Real-time Jobs:**
- **Order Processing:** Payment verification, stock updates
- **Email Notifications:** Order confirmations, shipping updates
- **Inventory Management:** Stock synchronization

---

## 📱 **Mobile & Web Integration**

### **API Features:**
- RESTful API design
- GraphQL support (optional)
- WebSocket for real-time updates
- Push notifications
- File upload handling

### **Third-party Integrations:**
- **Payment Gateways:** MoMo, BK, PayPal
- **SMS:** Twilio for order notifications
- **Email:** SendGrid for marketing
- **Analytics:** Google Analytics, Facebook Pixel
- **Maps:** Google Maps for delivery tracking

---

## 🧪 **Testing Strategy**

### **Test Types:**
- **Unit Tests:** Individual functions and services
- **Integration Tests:** API endpoints and database operations
- **E2E Tests:** Complete user workflows
- **Performance Tests:** Load testing and optimization

### **Testing Tools:**
- Jest for unit and integration tests
- Supertest for API testing
- Playwright for E2E testing
- Artillery for load testing

---

## 🚀 **Deployment & DevOps**

### **Environment Setup:**
- **Development:** Local PostgreSQL + Redis
- **Staging:** Docker containers on cloud
- **Production:** Kubernetes or Docker Swarm

### **CI/CD Pipeline:**
- GitHub Actions for automated testing
- Docker image building
- Automated deployment to staging/production
- Database migrations

### **Monitoring:**
- Application performance monitoring (APM)
- Error tracking and alerting
- Database performance monitoring
- Uptime monitoring

---

## 📈 **Scalability Considerations**

### **Database Scaling:**
- Read replicas for heavy read operations
- Connection pooling
- Query optimization
- Caching strategies

### **Application Scaling:**
- Horizontal scaling with load balancers
- Microservices architecture (future)
- CDN for static assets
- Redis clustering for caching

---

## 🔄 **Migration Strategy**

### **Phase 1: Core Setup (Week 1-2)**
- Database schema creation
- Basic API endpoints
- Authentication system
- Admin dashboard integration

### **Phase 2: E-commerce Features (Week 3-4)**
- Product management
- Cart functionality
- Order processing
- Payment integration

### **Phase 3: Advanced Features (Week 5-6)**
- Analytics and reporting
- Email notifications
- Mobile optimization
- Performance optimization

### **Phase 4: Production Ready (Week 7-8)**
- Security hardening
- Testing and bug fixes
- Documentation
- Deployment setup

---

## 💰 **Cost Estimation**

### **Development Costs:**
- **Backend Development:** 6-8 weeks
- **Database Design:** 1 week
- **API Development:** 3-4 weeks
- **Testing & QA:** 1-2 weeks
- **Deployment & Setup:** 1 week

### **Infrastructure Costs (Monthly):**
- **Database:** $50-100 (PostgreSQL)
- **Server:** $100-200 (VPS/Cloud)
- **CDN:** $20-50
- **Email Service:** $20-50
- **Monitoring:** $20-50
- **Total:** $210-450/month

---

## 🎯 **Next Steps**

1. **Set up development environment**
2. **Create database schema**
3. **Implement authentication system**
4. **Build core API endpoints**
5. **Integrate with frontend**
6. **Add payment processing**
7. **Implement admin features**
8. **Testing and deployment**

This plan provides a solid foundation for building a scalable, secure, and feature-rich e-commerce backend for Akazuba Florist! 🌸 