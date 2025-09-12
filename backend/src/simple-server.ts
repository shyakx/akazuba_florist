/// <reference types="node" />
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Log environment variables for debugging
console.log('=== Environment Check ===')
console.log('- NODE_ENV:', process.env.NODE_ENV)
console.log('- PORT:', process.env.PORT)
console.log('- DB_HOST:', process.env.DB_HOST)
console.log('- DB_PORT:', process.env.DB_PORT)
console.log('- DB_NAME:', process.env.DB_NAME)
console.log('- DATABASE_URL exists:', !!process.env.DATABASE_URL)
console.log('- FRONTEND_URL:', process.env.FRONTEND_URL)

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'https://akazuba-florist.vercel.app',
    'https://akazubaflorist.com',
    'https://www.akazubaflorist.com',
    process.env.FRONTEND_URL
  ].filter((url): url is string => Boolean(url)),
  credentials: true,
}))
app.use(express.json())

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Akazuba Florist API is running (Simple Mode)',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: 'not connected (simple mode)',
  })
})

// Test endpoint
app.get('/test', (req, res) => {
  res.status(200).json({
    message: 'API is working!',
    timestamp: new Date().toISOString(),
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Simple server is running on port ${PORT}`)
  console.log(`🏥 Health Check: http://localhost:${PORT}/health`)
  console.log(`🧪 Test Endpoint: http://localhost:${PORT}/test`)
})

export default app
