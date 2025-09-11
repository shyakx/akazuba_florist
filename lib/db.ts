import { Pool } from 'pg'

// Database configuration
const pool = new Pool({
  user: process.env.DB_USER || 'akazuba_user',
  host: process.env.DB_HOST || 'dpg-d2o0b8ripnbc73d1n3pg-a.oregon-postgres.render.com',
  database: process.env.DB_NAME || 'akazuba_florist',
  password: process.env.DB_PASSWORD || 'WVkNIzcYTDXNAmOn893o1byvf7j6wDxN',
  port: parseInt(process.env.DB_PORT || '5432'),
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
})

// Test the connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database')
})

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

export default pool 