require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const app = express();

// Initialize Prisma client
const prisma = new PrismaClient()

// Add fallback data for local development
const fallbackProducts = [
  {
    id: '1',
    name: 'Red Roses Bouquet',
    description: 'Beautiful red roses perfect for romantic occasions',
    price: 25000,
    salePrice: null,
    stockQuantity: 50,
    images: ['/images/flowers/roses/red-roses-1.jpg'],
    categoryName: 'Flowers',
    isActive: true,
    isFeatured: true,
    brand: 'Akazuba Florist',
    type: 'rose',
    color: 'red'
  },
  {
    id: '2',
    name: 'White Lilies',
    description: 'Elegant white lilies for special occasions',
    price: 30000,
    salePrice: 25000,
    stockQuantity: 30,
    images: ['/images/flowers/lilies/white-lilies-1.jpg'],
    categoryName: 'Flowers',
    isActive: true,
    isFeatured: true,
    brand: 'Akazuba Florist',
    type: 'lily',
    color: 'white'
  }
]

// Test database connection
prisma.$connect()
  .then(() => {
    console.log('✅ Database connected successfully')
  })
  .catch((error) => {
    console.log('⚠️ Database connection failed, using fallback data')
    console.log('Error:', error.message)
  })

const PORT = process.env.PORT || 5000;

// CORS configuration - Production and Development
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true)
    
    // Define allowed origins based on environment
    const productionOrigins = [
    'https://online-shopping-by-diane.vercel.app',
      'https://akazuba-florist.vercel.app',
      process.env.FRONTEND_URL
    ].filter((url) => Boolean(url))
    
    const developmentOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
      'http://127.0.0.1:3002'
    ]
    
    // Use production origins only in production, allow development origins in other environments
    const allowedOrigins = process.env.NODE_ENV === 'production' 
      ? productionOrigins 
      : [...productionOrigins, ...developmentOrigins]
    
    // Check if origin is in allowed list
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Length', 'X-Requested-With'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}

app.use(cors(corsOptions))

// Handle preflight requests explicitly
app.options('*', cors(corsOptions))
app.use(express.json());

// Handle Prisma connection errors gracefully
prisma.$on('error', (e) => {
  console.log('⚠️ Prisma error:', e.message)
})

prisma.$on('disconnect', () => {
  console.log('⚠️ Database disconnected')
})

// Serve static files
app.use('/images', express.static('public/images'));
app.use('/uploads', express.static('uploads'));

const JWT_SECRET = process.env.JWT_SECRET || 'ePEjU/59G45QozOIFHr1k/C+iPDkoVKT61QbZxYtqEQ=';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'Xoan1HrOMCvIaPm0OxDKpzML/wAoPfo54iqFu/cn6gg=';

// Health check endpoint
app.get('/health', (req, res) => {
  // Check if we can connect to the database
  let dbStatus = 'unknown';
  prisma.$queryRaw`SELECT 1`
    .then(() => {
      dbStatus = 'connected';
    })
    .catch(() => {
      dbStatus = 'disconnected';
    })
    .finally(() => {
  res.status(200).json({
    status: 'OK',
    message: 'Akazuba Backend - Admin Panel Enhanced - Version 2.1.2 - Prisma Schema Fixed',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
        database: dbStatus,
    cors: process.env.NODE_ENV === 'production' ? 'production-only' : 'development-allowed',
    version: '2.1.2',
    corsEnabled: true,
    deployment: 'forced-redeploy'
      });
  });
});

// CORS test endpoint
app.get('/cors-test', (req, res) => {
  res.status(200).json({
    message: 'CORS is working!',
    origin: req.headers.origin,
    timestamp: new Date().toISOString()
  });
});

// Simple test endpoint for debugging
app.get('/api/test', (req, res) => {
  console.log('🧪 Test endpoint called');
  res.json({
    message: 'Backend server is working!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Register endpoint
app.post('/api/v1/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email already exists. Please try logging in instead.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        firstName,
        lastName,
        phone,
        role: 'CUSTOMER',
        isActive: true,
        emailVerified: false,
      }
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      },
      accessToken: token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed. Please try again in a few moments.' });
  }
});

// Login endpoint
app.post('/api/v1/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password. Please check your credentials and try again.' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password. Please check your credentials and try again.' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Generate refresh token
    const refreshToken = jwt.sign(
      { userId: user.id },
      JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful - Updated',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      },
      accessToken: token,
      refreshToken
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed. Please try again in a few moments.' });
  }
});

// Protected route example
app.get('/api/v1/auth/profile', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Refresh token endpoint
app.post('/api/v1/auth/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate new access token
    const newToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Generate new refresh token
    const newRefreshToken = jwt.sign(
      { userId: user.id },
      JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Token refreshed successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      },
      accessToken: newToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});

// Logout endpoint
app.post('/api/v1/auth/logout', async (req, res) => {
  try {
    // For JWT-based auth, we don't need to do anything server-side
    // The client should clear the tokens
    res.json({
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
});

// Get products endpoint
app.get('/api/v1/products', async (req, res) => {
  try {
    // Try to get products from database
    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        categories: true
      }
    });

    // If we have products from database, use them
    if (products && products.length > 0) {
      // Transform products to match frontend expectations
    const transformedProducts = products.map((product, index) => {
      // Assign colors based on product names
      let color = 'mixed';
      const name = product.name.toLowerCase();
      if (name.includes('red')) color = 'red';
      else if (name.includes('white')) color = 'white';
      else if (name.includes('pink')) color = 'pink';
      else if (name.includes('yellow')) color = 'yellow';
      else if (name.includes('orange')) color = 'orange';
      else if (name.includes('purple')) color = 'purple';
      else if (name.includes('mixed')) color = 'mixed';
      
        return {
          ...product,
          color,
          type: product.categories?.name?.toLowerCase() || 'flower'
        };
      });

      res.json({
        success: true,
        data: transformedProducts,
        message: 'Products retrieved successfully'
      });
    } else {
      // Use fallback data if no products in database
      console.log('No products in database, using fallback data');
      res.json({
        success: true,
        data: fallbackProducts,
        message: 'Using fallback products'
      });
    }
  } catch (error) {
    console.log('Database error, using fallback data:', error.message);
    // Return fallback data when database fails
    res.json({
      success: true,
      data: fallbackProducts,
      message: 'Using fallback products due to database error'
    });
  }
});

// Get categories endpoint
app.get('/api/v1/categories', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    });

    if (categories && categories.length > 0) {
    res.json({
      success: true,
      data: categories,
      message: 'Categories retrieved successfully'
    });
    } else {
      // Use fallback categories if none in database
      const fallbackCategories = [
        { id: '1', name: 'Flowers', type: 'flowers', description: 'Beautiful flower arrangements' },
        { id: '2', name: 'Perfumes', type: 'perfumes', description: 'Exquisite fragrances' }
      ];
      res.json({
        success: true,
        data: fallbackCategories,
        message: 'Using fallback categories'
      });
    }
  } catch (error) {
    console.log('Categories database error, using fallback:', error.message);
    // Return fallback categories when database fails
    const fallbackCategories = [
      { id: '1', name: 'Flowers', type: 'flowers', description: 'Beautiful flower arrangements' },
      { id: '2', name: 'Perfumes', type: 'perfumes', description: 'Exquisite fragrances' }
    ];
    res.json({
      success: true,
      data: fallbackCategories,
      message: 'Using fallback categories due to database error'
    });
  }
});

// Cart endpoints
app.get('/api/v1/cart', async (req, res) => {
  try {
    // Get user from token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    // Get or create cart for user
    let cart = await prisma.cart.findFirst({
      where: { userId },
      include: {
        cart_items: {
          include: {
            products: true
          }
        }
      }
    });

    if (!cart) {
      // Create new cart if doesn't exist
      cart = await prisma.cart.create({
        data: {
          id: `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId,
          updatedAt: new Date()
        },
        include: {
          cart_items: {
            include: {
              products: true
            }
          }
        }
      });
    }

    res.json({
      success: true,
      message: 'Cart retrieved successfully',
      data: cart
    });
  } catch (error) {
    console.error('Cart error:', error);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// Add item to cart
app.post('/api/v1/cart/items', async (req, res) => {
  try {
    // Get user from token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Product ID and valid quantity are required'
      });
    }

    // Verify product exists
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Get or create cart
    let cart = await prisma.cart.findFirst({
      where: { userId }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { 
          id: `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId,
          updatedAt: new Date()
        }
      });
    }

    // Check if item already exists in cart
    const existingItem = await prisma.cart_items.findFirst({
      where: {
        cartId: cart.id,
        productId
      }
    });

    let cartItem;
    if (existingItem) {
      // Update quantity
      cartItem = await prisma.cart_items.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: {
            products: true
        }
      });
    } else {
      // Add new item
      cartItem = await prisma.cart_items.create({
        data: {
          cartId: cart.id,
          productId,
          quantity
        },
        include: {
          products: true
        }
      });
    }

    res.json({
      success: true,
      message: 'Item added to cart successfully',
      data: cartItem
    });
  } catch (error) {
    console.error('Error adding item to cart:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add item to cart'
    });
  }
});

// Update cart item quantity
app.put('/api/v1/cart/items/:id', async (req, res) => {
  try {
    // Get user from token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid quantity is required'
      });
    }

    // Verify the cart item belongs to the user
    const cartItem = await prisma.cart_items.findFirst({
      where: {
        id,
        cart: {
          userId
        }
      },
      include: {
        products: true
      }
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    // Update quantity
    const updatedItem = await prisma.cart_items.update({
      where: { id },
      data: { quantity },
      include: {
        products: true
      }
    });

    res.json({
      success: true,
      message: 'Cart item updated successfully',
      data: updatedItem
    });
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update cart item'
    });
  }
});

// Remove item from cart
app.delete('/api/v1/cart/items/:id', async (req, res) => {
  try {
    // Get user from token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;
    const { id } = req.params;

    // Verify the cart item belongs to the user
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id,
        cart: {
          userId
        }
      }
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    // Delete the item
    await prisma.cart_items.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Item removed from cart successfully'
    });
  } catch (error) {
    console.error('Error removing cart item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove item from cart'
    });
  }
});

// Clear cart
app.delete('/api/v1/cart', async (req, res) => {
  try {
    // Get user from token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    // Get user's cart
    const cart = await prisma.cart.findFirst({
      where: { userId }
    });

    if (cart) {
      // Delete all cart items
      await prisma.cart_items.deleteMany({
        where: { cartId: cart.id }
      });
    }

    res.json({
      success: true,
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear cart'
    });
  }
});

// Wishlist endpoints
app.get('/api/v1/wishlist', async (req, res) => {
  try {
    // Get user from token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    // Get user's wishlist items with product details
    const wishlistItems = await prisma.wishlist.findMany({
      where: { userId },
      include: {
        products: true
      }
    });

  

    res.json({
      success: true,
      data: wishlistItems
    });
  } catch (error) {
    console.error('Wishlist error:', error);
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
});

// Add item to wishlist
app.post('/api/v1/wishlist', async (req, res) => {
  try {
    // Get user from token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    const { productId } = req.body;
    


    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    

    if (!product) {

      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if item is already in wishlist
    const existingItem = await prisma.wishlist.findFirst({
      where: {
        userId,
        productId
      }
    });

    if (existingItem) {
      return res.json({
        success: true,
        message: 'Item already in wishlist',
        data: existingItem
      });
    }

    // Add to wishlist
    const wishlistItem = await prisma.wishlist.create({
      data: {
        userId,
        productId
      },
      include: {
        products: true
      }
    });

    res.status(201).json({
      success: true,
      message: 'Item added to wishlist',
      data: wishlistItem
    });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ error: 'Failed to add to wishlist' });
  }
});

// Remove item from wishlist
app.delete('/api/v1/wishlist/:id', async (req, res) => {
  try {
    // Get user from token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    const { id } = req.params;

    // Check if item exists and belongs to user
    const wishlistItem = await prisma.wishlist.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!wishlistItem) {
      return res.status(404).json({ error: 'Wishlist item not found' });
    }

    // Delete the item
    await prisma.wishlist.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Item removed from wishlist'
    });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({ error: 'Failed to remove from wishlist' });
  }
});

// Clear wishlist
app.delete('/api/v1/wishlist', async (req, res) => {
  try {
    // Get user from token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    // Delete all wishlist items for user
    await prisma.wishlist.deleteMany({
      where: { userId }
    });

    res.json({
      success: true,
      message: 'Wishlist cleared successfully'
    });
  } catch (error) {
    console.error('Error clearing wishlist:', error);
    res.status(500).json({ error: 'Failed to clear wishlist' });
  }
});

// Orders endpoints
app.get('/api/v1/orders/my-orders', async (req, res) => {
  try {
    // For now, return empty orders list
    res.json({
      success: true,
      data: []
    });
  } catch (error) {
    console.error('Orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Create order endpoint
app.post('/api/v1/orders', async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      customerCity,
      items,
      paymentMethod,
      notes,
      subtotal,
      deliveryFee,
      totalAmount
    } = req.body;

    // Validate required fields
    if (!customerName || !customerEmail || !customerPhone || !customerAddress || !customerCity || !items || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Generate order number
    const orderCount = await prisma.order.count();
    const orderNumber = `AKZ-${String(orderCount + 1).padStart(3, '0')}`;

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName,
        customerEmail,
        customerPhone,
        customerAddress,
        customerCity,
        subtotal: Number(subtotal),
        deliveryFee: Number(deliveryFee),
        totalAmount: Number(totalAmount),
        paymentMethod,
        notes,
        status: 'PENDING',
        paymentStatus: 'PENDING'
      }
    });

    // Create order items
    const orderItems = await Promise.all(
      items.map((item) =>
        prisma.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            productName: item.productName,
            productSku: item.productSku,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice
          }
        })
      )
    );

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        order: {
          ...order,
          items: orderItems
        }
      }
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order'
    });
  }
});

// Admin Authentication Middleware
const authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user || user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Admin auth error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Admin Dashboard Stats
app.get('/api/v1/admin/dashboard/stats', authenticateAdmin, async (req, res) => {
  try {
    const [totalOrders, totalRevenue, totalCustomers, totalProducts] = await Promise.all([
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { totalAmount: true }
      }),
      prisma.user.count({
        where: { role: 'CUSTOMER' }
      }),
      prisma.product.count()
    ]);

    res.json({
      success: true,
      data: {
        totalOrders,
        totalRevenue: Number(totalRevenue._sum.totalAmount || 0),
        totalCustomers,
        totalProducts,
        newCustomers: totalCustomers,
        uniqueCustomers: totalCustomers,
        averageOrderValue: totalOrders > 0 ? Number(totalRevenue._sum.totalAmount || 0) / totalOrders : 0
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

// Admin Recent Orders
app.get('/api/v1/admin/dashboard/recent-orders', authenticateAdmin, async (req, res) => {
  try {
    const recentOrders = await prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    const formattedOrders = recentOrders.map(order => ({
      id: order.id,
      orderNumber: order.orderNumber || `ORD-${order.id.slice(-6)}`,
      customerName: order.user ? `${order.user.firstName} ${order.user.lastName}` : 'Guest User',
      totalAmount: Number(order.totalAmount),
      status: order.status.toUpperCase(),
      createdAt: order.createdAt.toISOString()
    }));

    res.json({
      success: true,
      data: formattedOrders
    });
  } catch (error) {
    console.error('Error fetching recent orders:', error);
    res.status(500).json({ error: 'Failed to fetch recent orders' });
  }
});

// Admin Recent Activity
app.get('/api/v1/admin/dashboard/activity', authenticateAdmin, async (req, res) => {
  try {
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    });

    const activities = recentOrders.map(order => ({
      type: 'order',
      title: 'New order received',
      description: `Order #${order.orderNumber || `ORD-${order.id.slice(-6)}`} from ${order.user ? `${order.user.firstName} ${order.user.lastName}` : 'Guest User'}`,
      timestamp: order.createdAt,
      status: 'success'
    }));

    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    const recentActivities = activities.slice(0, 10);

    res.json({
      success: true,
      data: recentActivities
    });
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    res.status(500).json({ error: 'Failed to fetch recent activity' });
  }
});

// Public Admin Dashboard Stats (for frontend admin panel) - Optimized
app.get('/api/v1/admin/dashboard/stats/public', async (req, res) => {
  try {
    console.log('📊 Dashboard stats endpoint called');
    
    // Set cache headers for better performance
    res.set({
      'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
      'Content-Type': 'application/json'
    });
    
    // Get real data from database
    try {
      const [
        categoriesCount,
        productsCount,
        ordersCount,
        revenueData,
        customersCount
      ] = await Promise.all([
        prisma.category.count({ where: { isActive: true } }).catch(() => 0),
        prisma.product.count({ where: { isActive: true } }).catch(() => 0),
        prisma.orders.count().catch(() => 0),
        prisma.orders.aggregate({
          _sum: { totalAmount: true }
        }).catch(() => ({ _sum: { totalAmount: 0 } })),
        prisma.user.count({ where: { role: 'CUSTOMER' } }).catch(() => 0)
      ]);
      
      const stats = {
        success: true,
        categories: categoriesCount,
        products: productsCount,
        orders: ordersCount,
        revenue: revenueData._sum.totalAmount || 0,
        customers: customersCount
      };
      
      console.log('✅ Returning real dashboard stats for admin panel:', stats);
      res.json(stats);
    } catch (dbError) {
      console.error('Database error, using fallback:', dbError);
      const stats = {
        success: true,
        categories: 2,
        products: 12,
        orders: 5,
        revenue: 148000,
        customers: 8
      };
      res.json(stats);
    }
    
    /* 
    // Database queries - temporarily disabled for production stability
    try {
      const [
        categoriesCount,
        productsCount,
        ordersCount,
        revenueData,
        customersCount
      ] = await Promise.all([
        prisma.category.count({ where: { isActive: true } }).catch(() => 0),
        prisma.product.count({ where: { isActive: true } }).catch(() => 0),
        prisma.order.count().catch(() => 0),
        prisma.order.aggregate({
          _sum: { totalAmount: true }
        }).catch(() => ({ _sum: { totalAmount: 0 } })),
        prisma.user.count({ where: { role: 'CUSTOMER' } }).catch(() => 0)
      ]);
      
      const stats = {
        success: true,
        categories: categoriesCount,
        products: productsCount,
        orders: ordersCount,
        revenue: revenueData._sum.totalAmount || 0,
        customers: customersCount
      };
      
      res.json(stats);
    } catch (dbError) {
      console.error('Database error, using fallback:', dbError);
      const stats = {
        success: true,
        categories: 4,
        products: 12,
        orders: 8,
        revenue: 125000,
        customers: 15
      };
      res.json(stats);
    }
    */
  } catch (error) {
    console.error('❌ Error fetching public dashboard stats:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    
    // Fallback to mock data if database fails
    const stats = {
      success: true,
      categories: 4,
      products: 12,
      orders: 8,
      revenue: 125000,
      customers: 15
    };
    
    console.log('🔄 Returning fallback stats due to error');
    res.json(stats);
  }
});

// Public Admin Recent Orders (for frontend admin panel) - Optimized
app.get('/api/v1/admin/dashboard/recent-orders/public', async (req, res) => {
  try {
    // Set cache headers for better performance
    res.set({
      'Cache-Control': 'public, max-age=180', // Cache for 3 minutes
      'Content-Type': 'application/json'
    });
    
    // Get real data from database
    try {
      const recentOrders = await prisma.orders.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          users: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        }
      });

      const formattedOrders = recentOrders.map(order => ({
        id: order.id,
        orderNumber: order.orderNumber,
        customerName: order.users ? `${order.users.firstName} ${order.users.lastName}` : 'Guest',
        total: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt.toISOString()
      }));
      
      console.log('✅ Returning real recent orders for admin panel');
      res.json({
        success: true,
        orders: formattedOrders
      });
    } catch (dbError) {
      console.error('Database error, using fallback:', dbError);
      const now = Date.now();
      const mockOrders = [
        {
          id: '1',
          orderNumber: 'AKZ-001',
          customerName: 'Jean Mukamana',
          total: 25000,
          status: 'DELIVERED',
          createdAt: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          orderNumber: 'AKZ-002',
          customerName: 'Marie Uwimana',
          total: 30000,
          status: 'PROCESSING',
          createdAt: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      res.json({
        success: true,
        orders: mockOrders
      });
    }
  } catch (error) {
    console.error('Error fetching public recent orders:', error);
    // Fallback to mock data if database fails
    const now = Date.now();
    const mockOrders = [
      {
        id: '1',
        orderNumber: 'ORD-001',
        customerName: 'John Doe',
        total: 25000,
        status: 'DELIVERED',
        createdAt: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        orderNumber: 'ORD-002',
        customerName: 'Jane Smith',
        total: 18000,
        status: 'PROCESSING',
        createdAt: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        orderNumber: 'ORD-003',
        customerName: 'Mike Johnson',
        total: 32000,
        status: 'SHIPPED',
        createdAt: new Date(now - 3 * 60 * 60 * 1000).toISOString()
      }
    ];
    res.json({
      success: true,
      orders: mockOrders
    });
  }
});

// Public Admin Products (for frontend admin panel)
app.get('/api/v1/admin/products/public', async (req, res) => {
  try {
    res.set({
      'Cache-Control': 'public, max-age=300',
      'Content-Type': 'application/json'
    });
    
    // Get real data from database
    const { page = 1, limit = 20, search, category, status } = req.query;
    const offset = (page - 1) * limit;
    
    const whereClause = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ]
      }),
      ...(category && category !== 'all' && { 
        categories: { name: { equals: category, mode: 'insensitive' } }
      }),
      ...(status && status !== 'all' && { isActive: status === 'active' })
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        skip: offset,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          categories: {
            select: {
              name: true
            }
          }
        }
      }),
      prisma.product.count({ where: whereClause })
    ]);

    const formattedProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.categories?.name || 'Uncategorized',
      stock: product.stockQuantity,
      status: product.isActive ? 'active' : 'inactive',
      images: product.images || [],
      createdAt: product.createdAt.toISOString().split('T')[0],
      sales: 0, // TODO: Calculate from order_items
      rating: 4.5, // TODO: Calculate from reviews
      description: product.description
    }));
    
    console.log('✅ Returning real products for admin panel');
    res.json({
      success: true,
      data: {
        products: formattedProducts,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
    
    /* 
    // Database queries - temporarily disabled for production stability
    try {
      const { page = 1, limit = 20, search, status } = req.query;
      const offset = (page - 1) * limit;
      
      const whereClause = {
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } }
          ]
        }),
        ...(status && status !== 'all' && { isActive: status === 'active' })
      };

      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where: whereClause,
          skip: offset,
          take: parseInt(limit),
          orderBy: { createdAt: 'desc' },
          include: {
            category: {
              select: { name: true }
            }
          }
        }),
        prisma.product.count({ where: whereClause })
      ]);

      const formattedProducts = products.map(product => ({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        category: product.category?.name || 'Uncategorized',
        stock: product.stockQuantity,
        status: product.isActive ? 'active' : 'inactive',
        createdAt: product.createdAt.toISOString().split('T')[0],
        sales: 0,
        rating: 0,
        description: product.description
      }));

      res.json({
        success: true,
        data: {
          products: formattedProducts,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (dbError) {
      console.error('Database error, using fallback:', dbError);
      throw dbError; // This will trigger the fallback below
    }
    */
  } catch (error) {
    console.error('Error fetching public products:', error);
    // Fallback to mock data if database fails
    const mockProducts = [
      {
        id: '1',
        name: 'Red Roses Bouquet',
        price: 25000,
        category: 'Flowers',
        stock: 15,
        status: 'active',
        createdAt: '2024-01-15',
        sales: 8,
        rating: 4.5,
        description: 'Beautiful red roses perfect for any occasion'
      }
    ];
    res.json({
      success: true,
      data: {
        products: mockProducts,
        total: mockProducts.length,
        pages: 1
      }
    });
  }
});

// Public Admin Orders (for frontend admin panel)
app.get('/api/v1/admin/orders/public', async (req, res) => {
  try {
    res.set({
      'Cache-Control': 'public, max-age=180',
      'Content-Type': 'application/json'
    });
    
    const { page = 1, limit = 20, search, status } = req.query;
    const offset = (page - 1) * limit;
    
    const whereClause = {
      ...(search && {
        OR: [
          { orderNumber: { contains: search, mode: 'insensitive' } },
          { customerName: { contains: search, mode: 'insensitive' } }
        ]
      }),
      ...(status && status !== 'all' && { status: status.toUpperCase() })
    };

    const [orders, total] = await Promise.all([
      prisma.orders.findMany({
        where: whereClause,
        skip: offset,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          users: {
            select: {
              firstName: true,
              lastName: true,
              email: true
            }
          },
          orderItems: {
            select: { quantity: true }
          }
        }
      }),
      prisma.orders.count({ where: whereClause })
    ]);

    const formattedOrders = orders.map(order => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.user ? `${order.user.firstName} ${order.user.lastName}` : 'Guest User',
      customerEmail: order.user?.email || 'guest@example.com',
      total: order.totalAmount,
      status: order.status.toLowerCase(),
      items: order.orderItems.reduce((sum, item) => sum + item.quantity, 0),
      createdAt: order.createdAt.toISOString().split('T')[0],
      deliveryAddress: order.customerAddress || 'Not specified',
      paymentMethod: order.paymentMethod || 'Unknown'
    }));

    res.json({
      success: true,
      data: {
        orders: formattedOrders,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching public orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Public Admin Customers (for frontend admin panel)
app.get('/api/v1/admin/customers/public', async (req, res) => {
  try {
    res.set({
      'Cache-Control': 'public, max-age=300',
      'Content-Type': 'application/json'
    });
    
    // Get real data from database
    const { page = 1, limit = 20, search } = req.query;
    const offset = (page - 1) * limit;
    
    const whereClause = {
      role: 'CUSTOMER',
      ...(search && {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } }
        ]
      })
    };

    const [customers, total] = await Promise.all([
      prisma.user.findMany({
        where: whereClause,
        skip: offset,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          isActive: true,
          createdAt: true
        }
      }),
      prisma.user.count({ where: whereClause })
    ]);

    const formattedCustomers = customers.map(customer => ({
      id: customer.id,
      name: `${customer.firstName} ${customer.lastName}`,
      email: customer.email,
      phone: customer.phone || '',
      orders: 0, // TODO: Calculate from orders
      totalSpent: 0, // TODO: Calculate from orders
      status: customer.isActive ? 'active' : 'inactive',
      joinedDate: customer.createdAt.toISOString().split('T')[0]
    }));
    
    console.log('✅ Returning real customers for admin panel');
    res.json({
      success: true,
      data: {
        customers: formattedCustomers,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching public customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// Public Admin Categories (for frontend admin panel)
app.get('/api/v1/admin/categories/public', async (req, res) => {
  try {
    res.set({
      'Cache-Control': 'public, max-age=300',
      'Content-Type': 'application/json'
    });
    
    // Get real data from database
    const categories = await prisma.category.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            products: true
          }
        }
      }
    });

    const formattedCategories = categories.map(category => ({
      id: category.id,
      name: category.name,
      description: category.description || '',
      productCount: category._count.products,
      status: category.isActive ? 'active' : 'inactive',
      imageUrl: category.imageUrl,
      createdAt: category.createdAt.toISOString().split('T')[0]
    }));
    
    console.log('✅ Returning real categories for admin panel');
    res.json({
      success: true,
      data: formattedCategories
    });
  } catch (error) {
    console.error('Error fetching public categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Public Admin Analytics (for frontend admin panel)
app.get('/api/v1/admin/analytics/public', async (req, res) => {
  try {
    res.set({
      'Cache-Control': 'public, max-age=300',
      'Content-Type': 'application/json'
    });
    
    // Get real analytics data from database
    const [
      totalOrders,
      totalRevenue,
      totalCustomers,
      totalProducts,
      recentOrders,
      topProducts,
      monthlyRevenue,
      orderStatusCounts
    ] = await Promise.all([
      // Total orders
      prisma.orders.count(),
      
      // Total revenue
      prisma.orders.aggregate({
        _sum: { totalAmount: true }
      }),
      
      // Total customers
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      
      // Total products
      prisma.product.count(),
      
      // Recent orders (last 5)
      prisma.orders.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          users: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        }
      }),
      
      // Top products (by order items)
      prisma.order_items.groupBy({
        by: ['productId'],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 5
      }),
      
      // Monthly revenue (last 3 months)
      prisma.orders.groupBy({
        by: ['createdAt'],
        _sum: { totalAmount: true },
        where: {
          createdAt: {
            gte: new Date(new Date().setMonth(new Date().getMonth() - 3))
          }
        }
      }),
      
      // Order status counts
      prisma.orders.groupBy({
        by: ['status'],
        _count: { status: true }
      })
    ]);

    // Get product names for top products
    const topProductIds = topProducts.map(p => p.productId);
    const productNames = await prisma.product.findMany({
      where: { id: { in: topProductIds } },
      select: { id: true, name: true }
    });

    // Format top products
    const formattedTopProducts = topProducts.map(item => {
      const product = productNames.find(p => p.id === item.productId);
      return {
        name: product?.name || 'Unknown Product',
        sales: item._sum.quantity || 0
      };
    });

    // Format monthly revenue
    const formattedMonthlyRevenue = monthlyRevenue.map(item => ({
      month: item.createdAt.toLocaleDateString('en-US', { month: 'short' }),
      revenue: Number(item._sum.totalAmount) || 0
    }));

    // Format recent orders
    const formattedRecentOrders = recentOrders.map(order => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.users ? `${order.users.firstName} ${order.users.lastName}` : 'Guest',
      total: Number(order.totalAmount),
      status: order.status.toLowerCase(),
      createdAt: order.createdAt.toISOString().split('T')[0]
    }));

    // Calculate growth percentages (simplified - comparing to previous period)
    const revenueGrowth = 15; // TODO: Calculate actual growth
    const ordersGrowth = 12; // TODO: Calculate actual growth
    const customersGrowth = 8; // TODO: Calculate actual growth
    const productsGrowth = 5; // TODO: Calculate actual growth

    const analytics = {
      totalOrders,
      totalRevenue: Number(totalRevenue._sum.totalAmount) || 0,
      totalCustomers,
      totalProducts,
      revenueGrowth,
      ordersGrowth,
      customersGrowth,
      productsGrowth,
      recentOrders: formattedRecentOrders,
      topProducts: formattedTopProducts,
      monthlyRevenue: formattedMonthlyRevenue,
      orderStatusCounts,
      recentActivity: [
        {
          action: 'New order received',
          time: '2 hours ago',
          user: 'System'
        },
        {
          action: 'Product updated',
          time: '4 hours ago',
          user: 'Admin'
        },
        {
          action: 'Customer registered',
          time: '6 hours ago',
          user: 'System'
        }
      ]
    };
    
    console.log('✅ Returning real analytics for admin panel');
    res.json({
      success: true,
      ...analytics
    });
  } catch (error) {
    console.error('Error fetching public analytics:', error);
    // Fallback to mock data if database fails
    const mockAnalytics = {
      totalOrders: 8,
      totalRevenue: 125000,
      totalCustomers: 15,
      totalProducts: 12,
      recentOrders: [],
      topProducts: [],
      monthlyRevenue: [],
      recentActivity: []
    };
    res.json({
      success: true,
      data: mockAnalytics
    });
  }
});

// Public Admin Reports (for frontend admin panel)
app.get('/api/v1/admin/reports/public', async (req, res) => {
  try {
    res.set({
      'Cache-Control': 'public, max-age=300',
      'Content-Type': 'application/json'
    });
    
    // Get real data for reports
    const [
      totalOrders,
      totalRevenue,
      totalCustomers,
      totalProducts
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { totalAmount: true }
      }),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.product.count({ where: { isActive: true } })
    ]);

    // Generate reports based on real data
    const reports = [
      {
        id: '1',
        title: 'Sales Revenue Report',
        type: 'sales',
        period: 'This Month',
        value: totalRevenue._sum.totalAmount || 0,
        change: 15.2, // Placeholder - would need historical data
        changeType: 'increase',
        description: 'Total revenue generated from all sales',
        lastUpdated: new Date().toISOString().split('T')[0]
      },
      {
        id: '2',
        title: 'Order Volume Report',
        type: 'orders',
        period: 'This Month',
        value: totalOrders,
        change: 8.7, // Placeholder
        changeType: 'increase',
        description: 'Total number of orders processed',
        lastUpdated: new Date().toISOString().split('T')[0]
      },
      {
        id: '3',
        title: 'Customer Growth Report',
        type: 'customers',
        period: 'This Month',
        value: totalCustomers,
        change: 12.3, // Placeholder
        changeType: 'increase',
        description: 'New customer registrations',
        lastUpdated: new Date().toISOString().split('T')[0]
      },
      {
        id: '4',
        title: 'Product Performance Report',
        type: 'products',
        period: 'This Month',
        value: totalProducts,
        change: -2.1, // Placeholder
        changeType: 'decrease',
        description: 'Products sold this month',
        lastUpdated: new Date().toISOString().split('T')[0]
      }
    ];

    res.json({
      success: true,
      data: reports
    });
  } catch (error) {
    console.error('Error fetching public reports:', error);
    // Fallback to mock data if database fails
    const reports = [
      {
        id: '1',
        title: 'Sales Revenue Report',
        type: 'sales',
        period: 'This Month',
        value: 1250000,
        change: 15.2,
        changeType: 'increase',
        description: 'Total revenue generated from all sales',
        lastUpdated: '2024-01-15'
      },
      {
        id: '2',
        title: 'Order Volume Report',
        type: 'orders',
        period: 'This Month',
        value: 245,
        change: 8.7,
        changeType: 'increase',
        description: 'Total number of orders processed',
        lastUpdated: '2024-01-15'
      },
      {
        id: '3',
        title: 'Customer Growth Report',
        type: 'customers',
        period: 'This Month',
        value: 89,
        change: 12.3,
        changeType: 'increase',
        description: 'New customer registrations',
        lastUpdated: '2024-01-15'
      },
      {
        id: '4',
        title: 'Product Performance Report',
        type: 'products',
        period: 'This Month',
        value: 156,
        change: -2.1,
        changeType: 'decrease',
        description: 'Products sold this month',
        lastUpdated: '2024-01-15'
      }
    ];
    res.json({
      success: true,
      data: reports
    });
  }
});

// Public Admin Support Tickets (for frontend admin panel)
app.get('/api/v1/admin/support-tickets/public', async (req, res) => {
  try {
    res.set({
      'Cache-Control': 'public, max-age=180',
      'Content-Type': 'application/json'
    });
    
    // Check if support_tickets table exists, if not return mock data
    try {
      const { page = 1, limit = 20, search, status, priority } = req.query;
      const offset = (page - 1) * limit;
      
      const whereClause = {
        ...(search && {
          OR: [
            { customerName: { contains: search, mode: 'insensitive' } },
            { customerEmail: { contains: search, mode: 'insensitive' } },
            { subject: { contains: search, mode: 'insensitive' } }
          ]
        }),
        ...(status && status !== 'all' && { status: status.toUpperCase() }),
        ...(priority && priority !== 'all' && { priority: priority.toUpperCase() })
      };

      const [tickets, total] = await Promise.all([
        prisma.support_tickets.findMany({
          where: whereClause,
          skip: offset,
          take: parseInt(limit),
          orderBy: { createdAt: 'desc' }
        }),
        prisma.support_tickets.count({ where: whereClause })
      ]);

      const formattedTickets = tickets.map(ticket => ({
        id: ticket.id,
        customerName: ticket.customerName,
        customerEmail: ticket.customerEmail,
        subject: ticket.subject,
        message: ticket.message,
        status: ticket.status.toLowerCase(),
        priority: ticket.priority.toLowerCase(),
        assignedTo: ticket.assignedTo || 'Unassigned',
        orderId: ticket.orderId,
        createdAt: ticket.createdAt.toISOString().split('T')[0],
        updatedAt: ticket.updatedAt.toISOString().split('T')[0],
        resolvedAt: ticket.resolvedAt ? ticket.resolvedAt.toISOString().split('T')[0] : null,
        adminNotes: ticket.adminNotes
      }));

      res.json({
        success: true,
        data: {
          tickets: formattedTickets,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (dbError) {
      console.log('Support tickets table not found, using mock data:', dbError.message);
      throw dbError; // This will trigger the fallback below
    }
  } catch (error) {
    console.error('Error fetching public support tickets:', error);
    // Fallback to mock data if database fails or table doesn't exist
    const mockTickets = [
      {
        id: '1',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        subject: 'Order Delivery Issue',
        message: 'My order was supposed to be delivered yesterday but it hasn\'t arrived yet.',
        status: 'pending',
        priority: 'high',
        assignedTo: 'Unassigned',
        orderId: null,
        createdAt: '2024-01-15',
        updatedAt: '2024-01-15',
        resolvedAt: null,
        adminNotes: null
      },
      {
        id: '2',
        customerName: 'Jane Smith',
        customerEmail: 'jane@example.com',
        subject: 'Product Quality Concern',
        message: 'The flowers I received don\'t look as fresh as shown in the pictures.',
        status: 'in-progress',
        priority: 'medium',
        assignedTo: 'Support Team',
        orderId: null,
        createdAt: '2024-01-14',
        updatedAt: '2024-01-15',
        resolvedAt: null,
        adminNotes: 'Contacted customer for more details'
      }
    ];
    res.json({
      success: true,
      data: {
        tickets: mockTickets,
        total: mockTickets.length,
        pages: 1
      }
    });
  }
});

// Public Admin Settings (for frontend admin panel)
app.get('/api/v1/admin/settings/public', async (req, res) => {
  try {
    res.set({
      'Cache-Control': 'public, max-age=300',
      'Content-Type': 'application/json'
    });
    
    // Default settings
    const defaultSettings = {
      businessName: 'Akazuba Florist',
      businessEmail: 'admin@akazubaflorist.com',
      businessPhone: '+250 788 123 456',
      businessAddress: 'Kigali, Rwanda',
      currency: 'RWF',
      timezone: 'Africa/Kigali',
      emailNotifications: 'true',
      orderNotifications: 'true',
      customerNotifications: 'true',
      marketingEmails: 'false',
      twoFactorAuth: 'false',
      sessionTimeout: '30',
      passwordExpiry: '90',
      autoBackup: 'true',
      backupFrequency: 'daily',
      logRetention: '30',
      maintenanceMode: 'false'
    };

    try {
      const settings = await prisma.settings.findMany({
        orderBy: { key: 'asc' }
      });

      // Convert array of key-value pairs to object
      const settingsObject = settings.reduce((acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {});

      const finalSettings = { ...defaultSettings, ...settingsObject };

      res.json({
        success: true,
        data: finalSettings
      });
    } catch (dbError) {
      console.log('Settings table not found, using default settings:', dbError.message);
      res.json({
        success: true,
        data: defaultSettings
      });
    }
  } catch (error) {
    console.error('Error fetching public settings:', error);
    // Fallback to default settings
    const defaultSettings = {
      businessName: 'Akazuba Florist',
      businessEmail: 'admin@akazubaflorist.com',
      businessPhone: '+250 788 123 456',
      businessAddress: 'Kigali, Rwanda',
      currency: 'RWF',
      timezone: 'Africa/Kigali',
      emailNotifications: 'true',
      orderNotifications: 'true',
      customerNotifications: 'true',
      marketingEmails: 'false',
      twoFactorAuth: 'false',
      sessionTimeout: '30',
      passwordExpiry: '90',
      autoBackup: 'true',
      backupFrequency: 'daily',
      logRetention: '30',
      maintenanceMode: 'false'
    };
    res.json({
      success: true,
      data: defaultSettings
    });
  }
});

// Update Admin Settings
app.put('/api/v1/admin/settings/public', async (req, res) => {
  try {
    const settings = req.body;
    
    // Update each setting
    const updatePromises = Object.entries(settings).map(([key, value]) => 
      prisma.settings.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) }
      })
    );

    await Promise.all(updatePromises);

    res.json({
      success: true,
      message: 'Settings updated successfully'
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update settings'
    });
  }
});

// Admin Customers
app.get('/api/v1/admin/customers', authenticateAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const skip = (page - 1) * limit;

    const whereClause = {
      role: 'CUSTOMER',
      ...(search && {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } }
        ]
      })
    };

    const [customers, total] = await Promise.all([
      prisma.user.findMany({
        where: whereClause,
        skip: parseInt(skip),
        take: parseInt(limit),
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          isActive: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true
        }
      }),
      prisma.user.count({ where: whereClause })
    ]);

    const customersWithStats = await Promise.all(
      customers.map(async (customer) => {
        const orders = await prisma.order.findMany({
          where: { userId: customer.id }
        });

        const totalOrders = orders.length;
        const totalSpent = orders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
        const wishlistItems = await prisma.wishlist.count({
          where: { userId: customer.id }
        });

        const recentOrder = await prisma.order.findFirst({
          where: { userId: customer.id },
          orderBy: { createdAt: 'desc' },
          select: { customerAddress: true, customerCity: true }
        });

        return {
          ...customer,
          totalOrders,
          totalSpent,
          status: totalSpent > 100000 ? 'vip' : 'active',
          joinedDate: customer.createdAt.toISOString().split('T')[0],
          address: recentOrder ? 
            `${recentOrder.customerCity}, ${recentOrder.customerAddress}` : 
            'Address not available',
          wishlistItems
        };
      })
    );

    res.json({
      success: true,
      data: {
        customers: customersWithStats,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// Admin Orders
app.get('/api/v1/admin/orders', authenticateAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status, paymentStatus } = req.query;
    const skip = (page - 1) * limit;

    const whereClause = {
      ...(search && {
        OR: [
          { orderNumber: { contains: search, mode: 'insensitive' } },
          { customerName: { contains: search, mode: 'insensitive' } },
          { customerEmail: { contains: search, mode: 'insensitive' } }
        ]
      }),
      ...(status && { status }),
      ...(paymentStatus && { paymentStatus })
    };

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: whereClause,
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true
            }
          },
          orderItems: {
            include: {
              product: {
                select: {
                  name: true,
                  price: true,
                  images: true
                }
              }
            }
          }
        }
      }),
      prisma.orders.count({ where: whereClause })
    ]);

    const formattedOrders = orders.map(order => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.user ? `${order.user.firstName} ${order.user.lastName}` : 'Guest User',
      customerEmail: order.user?.email || 'guest@akazubaflorist.com',
      status: order.status,
      subtotal: order.subtotal,
      taxAmount: 0,
      shippingAmount: Number(order.deliveryFee),
      discountAmount: 0,
      totalAmount: order.totalAmount,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      shippingAddress: {
        address: order.customerAddress,
        city: order.customerCity
      },
      items: order.orderItems.map(item => ({
        productName: item.product.name,
        quantity: item.quantity,
        price: Number(item.unitPrice),
        productImage: item.productImage
      })),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    }));

    res.json({
      success: true,
      data: {
        orders: formattedOrders,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Admin Single Order
app.get('/api/v1/admin/orders/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                images: true
              }
            }
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const formattedOrder = {
      id: order.id,
      orderNumber: order.orderNumber,
      userId: order.userId,
      status: order.status,
      paymentStatus: order.paymentStatus,
      totalAmount: Number(order.totalAmount),
      deliveryFee: Number(order.deliveryFee),
      customerName: order.user ? `${order.user.firstName} ${order.user.lastName}` : 'Guest User',
      customerEmail: order.user?.email || order.customerEmail || 'guest@akazubaflorist.com',
      customerPhone: order.customerPhone || 'N/A',
      customerAddress: order.customerAddress || 'N/A',
      customerCity: order.customerCity || 'N/A',
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      items: order.orderItems.map(item => ({
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice),
        product: {
          id: item.product.id,
          name: item.product.name,
          images: item.product.images || [],
          price: item.product.price
        }
      })),
      user: order.user ? {
        id: order.user.id,
        name: `${order.user.firstName} ${order.user.lastName}`,
        email: order.user.email
      } : undefined
    };

    res.json({
      success: true,
      data: formattedOrder
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Admin Products Management
app.get('/api/v1/admin/products', authenticateAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category, status } = req.query;
    const skip = (page - 1) * limit;

    const whereClause = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ]
      }),
      ...(category && category !== 'all' && { categoryId: category }),
      ...(status && status !== 'all' && {
        isActive: status === 'active'
      })
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        skip: parseInt(skip),
        take: parseInt(limit),
        include: {
          category: {
            select: {
              name: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.product.count({ where: whereClause })
    ]);

    const formattedProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      shortDescription: product.shortDescription,
      price: Number(product.price),
      salePrice: product.salePrice ? Number(product.salePrice) : undefined,
      costPrice: product.costPrice ? Number(product.costPrice) : undefined,
      sku: product.sku,
      stockQuantity: product.stockQuantity,
      minStockAlert: product.minStockAlert,
      categoryId: product.categoryId,
      categoryName: product.category?.name || 'Uncategorized',
      images: product.images || [],
      isActive: product.isActive,
      isFeatured: product.isFeatured,
      weight: product.weight ? Number(product.weight) : undefined,
      dimensions: product.dimensions || {},
      tags: product.tags || [],
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
      views: 0, // Placeholder
      sales: 0, // Placeholder
      revenue: 0, // Placeholder
      rating: 0, // Placeholder
      reviewCount: 0 // Placeholder
    }));

    res.json({
      success: true,
      data: {
        products: formattedProducts,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.post('/api/v1/admin/products', authenticateAdmin, async (req, res) => {
  try {
    const productData = req.body;
    
    // Create or find category
    let categoryId = productData.categoryId;
    if (productData.categoryName && !categoryId) {
      const category = await prisma.category.upsert({
        where: { name: productData.categoryName },
        update: {},
        create: {
          name: productData.categoryName,
          slug: productData.categoryName.toLowerCase().replace(/\s+/g, '-'),
          description: `${productData.categoryName} category`
        }
      });
      categoryId = category.id;
    }

    const product = await prisma.product.create({
      data: {
        name: productData.name,
        slug: productData.slug,
        description: productData.description,
        shortDescription: productData.shortDescription,
        price: productData.price,
        salePrice: productData.salePrice,
        costPrice: productData.costPrice,
        sku: productData.sku,
        stockQuantity: productData.stockQuantity || 0,
        minStockAlert: productData.minStockAlert || 5,
        categoryId: categoryId,
        images: productData.images || [],
        isActive: productData.isActive !== undefined ? productData.isActive : true,
        isFeatured: productData.isFeatured || false,
        weight: productData.weight,
        dimensions: productData.dimensions || {},
        tags: productData.tags || []
      },
      include: {
        category: {
          select: {
            name: true
          }
        }
      }
    });

    const formattedProduct = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      shortDescription: product.shortDescription,
      price: Number(product.price),
      salePrice: product.salePrice ? Number(product.salePrice) : undefined,
      costPrice: product.costPrice ? Number(product.costPrice) : undefined,
      sku: product.sku,
      stockQuantity: product.stockQuantity,
      minStockAlert: product.minStockAlert,
      categoryId: product.categoryId,
      categoryName: product.category?.name || 'Uncategorized',
      images: product.images || [],
      isActive: product.isActive,
      isFeatured: product.isFeatured,
      weight: product.weight ? Number(product.weight) : undefined,
      dimensions: product.dimensions || {},
      tags: product.tags || [],
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
      views: 0,
      sales: 0,
      revenue: 0,
      rating: 0,
      reviewCount: 0
    };

    res.status(201).json({
      success: true,
      data: formattedProduct
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

app.put('/api/v1/admin/products/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const productData = req.body;

    // Create or find category if categoryName is provided
    let categoryId = productData.categoryId;
    if (productData.categoryName && !categoryId) {
      const category = await prisma.category.upsert({
        where: { name: productData.categoryName },
        update: {},
        create: {
          name: productData.categoryName,
          slug: productData.categoryName.toLowerCase().replace(/\s+/g, '-'),
          description: `${productData.categoryName} category`
        }
      });
      categoryId = category.id;
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: productData.name,
        slug: productData.slug,
        description: productData.description,
        shortDescription: productData.shortDescription,
        price: productData.price,
        salePrice: productData.salePrice,
        costPrice: productData.costPrice,
        sku: productData.sku,
        stockQuantity: productData.stockQuantity,
        minStockAlert: productData.minStockAlert,
        categoryId: categoryId,
        images: productData.images,
        isActive: productData.isActive,
        isFeatured: productData.isFeatured,
        weight: productData.weight,
        dimensions: productData.dimensions,
        tags: productData.tags
      },
      include: {
        category: {
          select: {
            name: true
          }
        }
      }
    });

    const formattedProduct = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      shortDescription: product.shortDescription,
      price: Number(product.price),
      salePrice: product.salePrice ? Number(product.salePrice) : undefined,
      costPrice: product.costPrice ? Number(product.costPrice) : undefined,
      sku: product.sku,
      stockQuantity: product.stockQuantity,
      minStockAlert: product.minStockAlert,
      categoryId: product.categoryId,
      categoryName: product.category?.name || 'Uncategorized',
      images: product.images || [],
      isActive: product.isActive,
      isFeatured: product.isFeatured,
      weight: product.weight ? Number(product.weight) : undefined,
      dimensions: product.dimensions || {},
      tags: product.tags || [],
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
      views: 0,
      sales: 0,
      revenue: 0,
      rating: 0,
      reviewCount: 0
    };

    res.json({
      success: true,
      data: formattedProduct
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

app.delete('/api/v1/admin/products/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.product.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Delete category
app.delete('/api/v1/admin/categories/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.category.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

// Public delete endpoints for admin panel (without authentication)
app.delete('/api/v1/admin/products/:id/public', async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.product.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

app.delete('/api/v1/admin/categories/:id/public', async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.category.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

app.post('/api/v1/admin/products/bulk', authenticateAdmin, async (req, res) => {
  try {
    const { operation, productIds, data } = req.body;

    switch (operation) {
      case 'delete':
        await prisma.product.deleteMany({
          where: { id: { in: productIds } }
        });
        break;
      case 'activate':
        await prisma.product.updateMany({
          where: { id: { in: productIds } },
          data: { isActive: true }
        });
        break;
      case 'deactivate':
        await prisma.product.updateMany({
          where: { id: { in: productIds } },
          data: { isActive: false }
        });
        break;
      case 'feature':
        await prisma.product.updateMany({
          where: { id: { in: productIds } },
          data: { isFeatured: true }
        });
        break;
      case 'unfeature':
        await prisma.product.updateMany({
          where: { id: { in: productIds } },
          data: { isFeatured: false }
        });
        break;
      case 'updateStock':
        if (data && data.operation && data.quantity !== undefined) {
          const products = await prisma.product.findMany({
            where: { id: { in: productIds } }
          });

          for (const product of products) {
            let newQuantity = product.stockQuantity;
            switch (data.operation) {
              case 'add':
                newQuantity += data.quantity;
                break;
              case 'subtract':
                newQuantity = Math.max(0, newQuantity - data.quantity);
                break;
              case 'set':
                newQuantity = data.quantity;
                break;
            }
            
            await prisma.product.update({
              where: { id: product.id },
              data: { stockQuantity: newQuantity }
            });
          }
        }
        break;
      default:
        return res.status(400).json({ error: 'Invalid operation' });
    }

    res.json({
      success: true,
      message: `Bulk operation '${operation}' completed successfully`
    });
  } catch (error) {
    console.error('Error performing bulk operation:', error);
    res.status(500).json({ error: 'Failed to perform bulk operation' });
  }
});

// Admin Order Status Updates
app.put('/api/v1/admin/orders/:id/status', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await prisma.order.update({
      where: { id },
      data: { status }
    });

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

app.put('/api/v1/admin/orders/:id/payment-status', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;

    const order = await prisma.order.update({
      where: { id },
      data: { paymentStatus }
    });

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({ error: 'Failed to update payment status' });
  }
});

// Admin Customer Management
app.put('/api/v1/admin/customers/:id/deactivate', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await prisma.user.update({
      where: { id },
      data: { isActive: false }
    });

    res.json({
      success: true,
      data: customer
    });
  } catch (error) {
    console.error('Error deactivating customer:', error);
    res.status(500).json({ error: 'Failed to deactivate customer' });
  }
});

app.get('/api/v1/admin/customers/:id/orders', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const orders = await prisma.order.findMany({
      where: { userId: id },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                name: true,
                price: true,
                images: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formattedOrders = orders.map(order => ({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
      totalAmount: Number(order.totalAmount),
      createdAt: order.createdAt.toISOString(),
      items: order.orderItems.map(item => ({
        productName: item.product.name,
        quantity: item.quantity,
        price: Number(item.unitPrice)
      }))
    }));

    res.json({
      success: true,
      data: formattedOrders
    });
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    res.status(500).json({ error: 'Failed to fetch customer orders' });
  }
});

// Create admin user if it doesn't exist
app.post('/api/v1/admin/setup', async (req, res) => {
  try {
    const adminEmail = 'admin@akazubaflorist.com';
    const adminPassword = 'akazuba2024';
    
    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail }
    });

    if (existingAdmin) {
      return res.json({ 
        message: 'Admin user already exists',
        email: adminEmail,
        password: adminPassword
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Create admin user
    const adminUser = await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        phone: '+250700000000',
        role: 'ADMIN',
        isActive: true,
        emailVerified: true,
      }
    });

    res.status(201).json({
      message: 'Admin user created successfully',
      email: adminEmail,
      password: adminPassword,
      user: {
        id: adminUser.id,
        email: adminUser.email,
        role: adminUser.role
      }
    });
  } catch (error) {
    console.error('Error creating admin user:', error);
    res.status(500).json({ error: 'Failed to create admin user' });
  }
});

// Create additional admin user for info.akazubaflorist@gmail.com
app.post('/api/v1/admin/setup-info', async (req, res) => {
  try {
    const adminEmail = 'info.akazubaflorist@gmail.com';
    const adminPassword = 'akazuba2024';
    
    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail }
    });

    if (existingAdmin) {
      return res.json({ 
        message: 'Info admin user already exists',
        email: adminEmail,
        password: adminPassword
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Create admin user
    const adminUser = await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash: hashedPassword,
        firstName: 'Info',
        lastName: 'Admin',
        phone: '0784586110',
        role: 'ADMIN',
        isActive: true,
        emailVerified: true,
      }
    });

    res.status(201).json({
      message: 'Info admin user created successfully',
      email: adminEmail,
      password: adminPassword,
      user: {
        id: adminUser.id,
        email: adminUser.email,
        role: adminUser.role
      }
    });
  } catch (error) {
    console.error('Error creating info admin user:', error);
    res.status(500).json({ error: 'Failed to create info admin user' });
  }
});



// Start server
app.listen(PORT, () => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`🚀 Backend server running on port ${PORT}`)
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`)
    console.log(`🌐 CORS enabled for development`)
    console.log(`🔗 Health check: http://localhost:${PORT}/health`)
    console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test`)
  } else {
    console.log(`🚀 Backend server running on port ${PORT}`)
    console.log(`📊 Environment: ${process.env.NODE_ENV}`)
  }
})

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
}); 