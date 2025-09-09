const nodemailer = require('nodemailer')

console.log('🧪 TESTING PRODUCTION EMAIL CONFIGURATION...')
console.log('')

// Check environment variables
console.log('📧 Environment Variables:')
console.log(`   SMTP_HOST: ${process.env.SMTP_HOST || 'NOT SET'}`)
console.log(`   SMTP_PORT: ${process.env.SMTP_PORT || 'NOT SET'}`)
console.log(`   SMTP_USER: ${process.env.SMTP_USER || 'NOT SET'}`)
console.log(`   SMTP_PASS: ${process.env.SMTP_PASS ? '***SET***' : 'NOT SET'}`)
console.log(`   ADMIN_EMAIL: ${process.env.ADMIN_EMAIL || 'NOT SET'}`)
console.log('')

// Check if all required variables are set
const requiredVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'ADMIN_EMAIL']
const missingVars = requiredVars.filter(varName => !process.env[varName])

if (missingVars.length > 0) {
  console.log('❌ MISSING ENVIRONMENT VARIABLES:')
  missingVars.forEach(varName => {
    console.log(`   - ${varName}`)
  })
  console.log('')
  console.log('🔧 SOLUTION:')
  console.log('1. Go to your Render.com dashboard')
  console.log('2. Navigate to your backend service')
  console.log('3. Go to Environment tab')
  console.log('4. Add the missing variables:')
  console.log('')
  console.log('SMTP_HOST=smtp.gmail.com')
  console.log('SMTP_PORT=587')
  console.log('SMTP_SECURE=false')
  console.log('SMTP_USER=shyakasteven2023@gmail.com')
  console.log('SMTP_PASS=vpts dacf vzqu yixy')
  console.log('ADMIN_EMAIL=info.akazubaflorist@gmail.com')
  console.log('ADMIN_PANEL_URL=https://akazuba-florist.vercel.app/admin/orders')
  console.log('')
  console.log('5. Save changes and wait for restart')
  process.exit(1)
}

console.log('✅ All required environment variables are set!')
console.log('')

// Test email connection
async function testEmailConnection() {
  try {
    console.log('🔍 Testing SMTP connection...')
    
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    })

    await transporter.verify()
    console.log('✅ SMTP connection successful!')
    
    // Send test email
    console.log('📤 Sending test email...')
    const result = await transporter.sendMail({
      from: `"Akazuba Florist Production Test" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: '🧪 Production Email Test - Akazuba Florist',
      html: `
        <h2>🎉 Production Email Test Successful!</h2>
        <p>This email confirms that your production email system is working correctly.</p>
        <p><strong>Test Details:</strong></p>
        <ul>
          <li>From: ${process.env.SMTP_USER}</li>
          <li>To: ${process.env.ADMIN_EMAIL}</li>
          <li>Time: ${new Date().toLocaleString()}</li>
          <li>Environment: Production</li>
        </ul>
        <p>✅ Your email notification system is ready for production orders!</p>
      `
    })
    
    console.log('✅ Test email sent successfully!')
    console.log(`   Message ID: ${result.messageId}`)
    console.log(`   To: ${process.env.ADMIN_EMAIL}`)
    console.log('')
    console.log('🎉 PRODUCTION EMAIL SYSTEM IS WORKING!')
    console.log('📧 Check your inbox at:', process.env.ADMIN_EMAIL)
    
  } catch (error) {
    console.log('❌ Email test failed:', error.message)
    console.log('')
    console.log('🔧 TROUBLESHOOTING:')
    console.log('1. Verify Gmail App Password is correct')
    console.log('2. Check if 2-Factor Authentication is enabled')
    console.log('3. Ensure environment variables are set correctly')
    console.log('4. Wait for backend service to restart after env changes')
  }
}

testEmailConnection()
