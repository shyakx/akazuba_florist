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

// Log environment variables for debugging
console.log('Environment check:')
console.log('- NODE_ENV:', process.env.NODE_ENV)
console.log('- PORT:', process.env.PORT)
console.log('- DB_HOST:', process.env.DB_HOST)
console.log('- DB_PORT:', process.env.DB_PORT)
console.log('- DB_NAME:', process.env.DB_NAME)
console.log('- DATABASE_URL exists:', !!process.env.DATABASE_URL)

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

// Middleware
app.use(helmet())
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    process.env.FRONTEND_URL
  ].filter((url): url is string => Boolean(url)),
  credentials: true,
}))
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