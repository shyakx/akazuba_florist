const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const app = express();

// Set the database URL directly since .env file is not accessible
process.env.DATABASE_URL = "postgresql://postgres:0123@localhost:5434/akazuba_florist";

const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'akazuba-super-secret-jwt-key-2024';

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Akazuba Backend with Database is running!' });
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
      token
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

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      },
      token
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

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Akazuba Backend with Database running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/v1/auth/`);
  console.log(`🌺 Products: http://localhost:${PORT}/api/v1/products`);
  console.log(`📂 Categories: http://localhost:${PORT}/api/v1/categories`);
  console.log(`🛒 Cart: http://localhost:${PORT}/api/v1/cart`);
  console.log(`❤️ Wishlist: http://localhost:${PORT}/api/v1/wishlist`);
  console.log(`📋 Orders: http://localhost:${PORT}/api/v1/orders/my-orders`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
}); 