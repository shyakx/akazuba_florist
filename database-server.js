require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const app = express();

const prisma = new PrismaClient();

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
    
    console.log('🔍 CORS Check:')
    console.log('  - Origin:', origin)
    console.log('  - Environment:', process.env.NODE_ENV || 'development')
    console.log('  - Allowed origins:', allowedOrigins)
    
    // Check if origin is in allowed list
    if (allowedOrigins.indexOf(origin) !== -1) {
      console.log('✅ CORS allowed for:', origin)
      callback(null, true)
    } else {
      console.log('🚫 CORS blocked origin:', origin)
      console.log('✅ Allowed origins:', allowedOrigins)
      console.log('🌍 Environment:', process.env.NODE_ENV || 'development')
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

// Serve static files
app.use('/images', express.static('public/images'));
app.use('/uploads', express.static('uploads'));

const JWT_SECRET = process.env.JWT_SECRET || 'akazuba-super-secret-jwt-key-2024';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'akazuba-super-secret-refresh-key-2024';

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Akazuba Backend - CORS FIXED - FORCE REDEPLOY - Version 2.0.2',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: 'connected',
    cors: process.env.NODE_ENV === 'production' ? 'production-only' : 'development-allowed',
    version: '2.0.2',
    corsEnabled: true,
    deployment: 'forced-redeploy'
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
    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        category: true
      }
    });

    // Use existing flower images from the mock data - using actual file names
    const flowerImages = [
      '/images/flowers/red/red-1.jpg',
      '/images/flowers/red/red-2.jpg', 
      '/images/flowers/red/red-3.jpg',
      '/images/flowers/red/red-4.jpg',
      '/images/flowers/red/red-5.jpg',
      '/images/flowers/red/red-6.jpg',
      '/images/flowers/red/red-7.jpg',
      '/images/flowers/red/red-8.jpg',
      '/images/flowers/white/white-1.jpg',
      '/images/flowers/white/white-2.jpg',
      '/images/flowers/white/white-3.jpg',
      '/images/flowers/pink/pink-1.jpg',
      '/images/flowers/pink/pink-2.jpg',
      '/images/flowers/pink/pink-3.jpg',
      '/images/flowers/yellow/yellow-1.jpg',
      '/images/flowers/yellow/yellow-2.jpg',
      '/images/flowers/orange/orange-1.jpg',
      '/images/flowers/mixed/mixed-1.jpg',
      '/images/flowers/mixed/mixed-2.jpg',
      '/images/flowers/mixed/mixed-3.jpg',
      '/images/flowers/mixed/mixed-4.jpg',
      '/images/flowers/mixed/mixed-5.jpg',
      '/images/flowers/mixed/mixed-6.jpg',
      '/images/flowers/mixed/mixed-7.jpg',
      '/images/flowers/mixed/mixed-8.jpg',
      '/images/flowers/mixed/mixed-9.jpg',
      '/images/flowers/mixed/mixed-10.jpg'
    ];

    console.log('🌺 Available products in database:', products.map(p => ({ id: p.id, name: p.name })));
    
    // Transform products to match frontend expectations with proper color assignment
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
      
      // Make some products featured
      const featured = product.featured || index < 3; // First 3 products as featured
      
      // Get image with fallback - ensure we use correct image paths
      let imagePath = product.images?.[0] || flowerImages[index % flowerImages.length];
      
      // If the image path doesn't match our available images, use a fallback
      if (imagePath && !imagePath.includes('/images/flowers/')) {
        imagePath = flowerImages[index % flowerImages.length];
      }
      
      // Ensure we're using the correct image path format
      if (imagePath && imagePath.includes('tulip-mix')) {
        imagePath = '/images/flowers/mixed/mixed-1.jpg';
      }
      
      const transformedProduct = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: imagePath,
        category: product.category?.name || 'Flowers',
        featured: featured,
        description: product.description || `${product.name} from Akazuba Florist`,
        color: product.color || color,
        type: product.type || 'Flower'
      };
      
      console.log(`🖼️ Product "${product.name}" - Image: ${imagePath}`);
      
      return transformedProduct;
    });

    res.json({
      success: true,
      data: transformedProducts
    });
  } catch (error) {
    console.error('Products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get categories endpoint
app.get('/api/v1/categories', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' }
    });

    res.json(categories);
  } catch (error) {
    console.error('Categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
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
        cartItems: {
          include: {
            product: {
              include: {
                category: true
              }
            }
          }
        }
      }
    });

    if (!cart) {
      // Create new cart if doesn't exist
      cart = await prisma.cart.create({
        data: {
          userId,
          cartItems: {
            create: []
          }
        },
        include: {
          cartItems: {
            include: {
              product: {
                include: {
                  category: true
                }
              }
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
        data: { userId }
      });
    }

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId
      }
    });

    let cartItem;
    if (existingItem) {
      // Update quantity
      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: {
          product: {
            include: {
              category: true
            }
          }
        }
      });
    } else {
      // Add new item
      cartItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity
        },
        include: {
          product: {
            include: {
              category: true
            }
          }
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
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id,
        cart: {
          userId
        }
      },
      include: {
        product: {
          include: {
            category: true
          }
        }
      }
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    // Update quantity
    const updatedItem = await prisma.cartItem.update({
      where: { id },
      data: { quantity },
      include: {
        product: {
          include: {
            category: true
          }
        }
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
    await prisma.cartItem.delete({
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
      await prisma.cartItem.deleteMany({
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
        product: true
      }
    });

    console.log('📦 Wishlist items with products:', JSON.stringify(wishlistItems, null, 2));

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
    
    console.log('🔍 Wishlist request - Product ID:', productId);
    console.log('🔍 User ID:', userId);

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    console.log('🔍 Product found:', product ? 'Yes' : 'No');

    if (!product) {
      console.log('❌ Product not found in database');
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
        product: true
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
      prisma.order.count({ where: whereClause })
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

// Database seeding function
async function seedDatabase() {
  try {
    console.log('🌱 Checking if database needs seeding...');
    
    // Check if products exist
    const productCount = await prisma.product.count();
    const categoryCount = await prisma.category.count();
    
    if (productCount === 0 && categoryCount === 0) {
      console.log('🌱 Database is empty, running seed script...');
      
      // Import and run the seed script
      const { execSync } = require('child_process');
      try {
        execSync('node prisma/seed.js', { stdio: 'inherit' });
        console.log('✅ Database seeded successfully!');
      } catch (seedError) {
        console.error('❌ Error running seed script:', seedError);
        console.log('🔄 Attempting manual seeding...');
        
        // Manual seeding as fallback
        await manualSeed();
      }
    } else {
      console.log(`✅ Database already has ${productCount} products and ${categoryCount} categories`);
    }
  } catch (error) {
    console.error('❌ Error checking/seeding database:', error);
  }
}

// Manual seeding function as fallback
async function manualSeed() {
  try {
    console.log('🌱 Running manual database seeding...');
    
    // Create categories
    const categories = await Promise.all([
      prisma.category.create({ data: { name: 'Roses', description: 'Beautiful roses for every occasion' } }),
      prisma.category.create({ data: { name: 'Tulips', description: 'Colorful tulips to brighten your day' } }),
      prisma.category.create({ data: { name: 'Mixed Bouquets', description: 'Stunning mixed flower arrangements' } }),
      prisma.category.create({ data: { name: 'Sunflowers', description: 'Bright and cheerful sunflowers' } })
    ]);
    
    console.log('✅ Categories created:', categories.length);
    
    // Create sample products
    const products = await Promise.all([
      prisma.product.create({
        data: {
          name: 'Red Rose Bouquet',
          description: 'A beautiful bouquet of 12 red roses',
          price: 45.99,
          image: '/images/flowers/red/red-1.jpg',
          categoryId: categories[0].id,
          color: 'red',
          featured: true,
          inStock: true,
          stockQuantity: 50
        }
      }),
      prisma.product.create({
        data: {
          name: 'Yellow Tulip Arrangement',
          description: 'Fresh yellow tulips in a vase',
          price: 35.99,
          image: '/images/flowers/yellow/yellow-1.jpg',
          categoryId: categories[1].id,
          color: 'yellow',
          featured: true,
          inStock: true,
          stockQuantity: 30
        }
      }),
      prisma.product.create({
        data: {
          name: 'Mixed Spring Bouquet',
          description: 'Colorful spring flowers mixed arrangement',
          price: 55.99,
          image: '/images/flowers/mixed/mixed-1.jpg',
          categoryId: categories[2].id,
          color: 'mixed',
          featured: true,
          inStock: true,
          stockQuantity: 25
        }
      })
    ]);
    
    console.log('✅ Products created:', products.length);
    console.log('🎉 Manual seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error in manual seeding:', error);
  }
}

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Akazuba Backend with Database running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/v1/auth/`);
  console.log(`🌺 Products: http://localhost:${PORT}/api/v1/products`);
  console.log(`📂 Categories: http://localhost:${PORT}/api/v1/categories`);
  console.log(`🛒 Cart: http://localhost:${PORT}/api/v1/cart`);
  console.log(`❤️ Wishlist: http://localhost:${PORT}/api/v1/wishlist`);
  console.log(`📋 Orders: http://localhost:${PORT}/api/v1/orders/my-orders`);
  console.log(`👨‍💼 Admin setup: http://localhost:${PORT}/api/v1/admin/setup`);
  
  // Run database seeding on startup
  await seedDatabase();
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
}); 