#!/usr/bin/env node

// Set memory options before starting Next.js
process.env.NODE_OPTIONS = '--max-old-space-size=4096'

// Start the Next.js development server
const { spawn } = require('child_process')

console.log('🚀 Starting Next.js with increased memory allocation...')
console.log('💾 Memory limit set to 4GB')

const child = spawn('npx', ['next', 'dev'], {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    NODE_OPTIONS: '--max-old-space-size=4096'
  }
})

child.on('error', (error) => {
  console.error('❌ Error starting Next.js:', error)
  process.exit(1)
})

child.on('exit', (code) => {
  console.log(`📝 Next.js exited with code ${code}`)
  process.exit(code)
})
