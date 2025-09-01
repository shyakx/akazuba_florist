const { Pool } = require('pg')
const fs = require('fs')
const path = require('path')

// Database configuration
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'akazuba_florist',
  password: process.env.DB_PASSWORD || 'password',
  port: parseInt(process.env.DB_PORT || '5434'),
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
})

async function initializeDatabase() {
  try {
    console.log('Connecting to PostgreSQL database...')
    
    // Read the schema file
    const schemaPath = path.join(__dirname, '../lib/schema.sql')
    const schema = fs.readFileSync(schemaPath, 'utf8')
    
    // Execute the schema
    console.log('Creating tables and inserting sample data...')
    await pool.query(schema)
    
    console.log('✅ Database initialized successfully!')
    console.log('📊 Tables created: products, orders, order_items')
    console.log('🌺 Sample flower products inserted')
    console.log('📦 Sample orders inserted')
    
  } catch (error) {
    console.error('❌ Error initializing database:', error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

// Run the initialization
initializeDatabase() 