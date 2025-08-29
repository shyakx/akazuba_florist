/// <reference types="node" />
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import path from 'path'

// Import routes
import authRoutes from './routes/auth'
import userRoutes from './routes/users'
import productRoutes from './routes/products'
import categoryRoutes from './routes/categories'
import cartRoutes from './routes/cart'
import orderRoutes from './routes/orders'
import wishlistRoutes from './routes/wishlist'
import adminRoutes from './routes/admin'
import paymentRoutes from './routes/payments'
// MoMo routes removed - using simplified payment methods
import { errorHandler } from './middleware/errorHandler'
import { logger } from './utils/logger'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Production environment check
if (process.env.NODE_ENV === 'production') {
  console.log('🚀 PRODUCTION MODE ENABLED')
  console.log('- Environment: Production')
  console.log('- Port:', process.env.PORT)
  console.log('- Database: Connected')
  console.log('- CORS: Production origins only')
  console.log('- Security: Maximum protection enabled')
} else {
  console.log('⚠️  WARNING: Not in production mode')
  console.log('- Environment:', process.env.NODE_ENV)
  console.log('- Port:', process.env.PORT)
}

// Initialize Prisma with error handling
let prisma: PrismaClient
try {
  prisma = new PrismaClient()
  console.log('Prisma client initialized successfully')
} catch (error) {
  console.error('Failed to initialize Prisma client:', error)
  process.exit(1)
}

// Test database connection
async function testDatabaseConnection() {
  try {
    await prisma.$connect()
    console.log('Database connection successful')
  } catch (error) {
    console.error('Database connection failed:', error)
    // Don't exit, let the app start but log the error
  }
}

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Akazuba Florist API',
      version: '1.0.0',
      description: 'API documentation for Akazuba Florist e-commerce platform',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // Path to the API routes
}

const swaggerSpec = swaggerJsdoc(swaggerOptions)

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
})

// Production Security Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://akazuba-backend-api.onrender.com"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}))

// Production-only CORS configuration
const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true)
    
    // Production origins only - no development origins allowed
    const allowedOrigins = [
      'https://online-shopping-by-diane.vercel.app',
      'https://akazuba-florist.vercel.app',
      process.env.FRONTEND_URL
    ].filter((url): url is string => Boolean(url))
    
    // Check if origin is in allowed list
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      console.log('🚫 CORS blocked origin:', origin)
      console.log('✅ Allowed origins:', allowedOrigins)
      callback(new Error('Not allowed by CORS - Production only'))
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

app.use(compression())
app.use(limiter)
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Serve static files for uploaded payment proofs
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Akazuba Florist API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: 'connected', // We'll update this based on actual connection status
  })
})

// API Routes
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/products', productRoutes)
app.use('/api/v1/categories', categoryRoutes)
app.use('/api/v1/cart', cartRoutes)
app.use('/api/v1/orders', orderRoutes)
app.use('/api/v1/wishlist', wishlistRoutes)
app.use('/api/v1/admin', adminRoutes)
app.use('/api/v1/payments', paymentRoutes)

// Error handling middleware
app.use(errorHandler)

// Start server with error handling
async function startServer() {
  try {
    // Test database connection
    await testDatabaseConnection()
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`)
      console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`)
      console.log(`🏥 Health Check: http://localhost:${PORT}/health`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully')
  await prisma.$disconnect()
  process.exit(0)
})

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully')
  await prisma.$disconnect()
  process.exit(0)
})

// Start the server
startServer()
