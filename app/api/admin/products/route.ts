import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
import { unifiedProductService } from '@/lib/unifiedProductService'

// Force dynamic rendering - this route needs access to request headers
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('📦 Admin products API called')
    
    // Check if user is authenticated and is admin
    const session = await getServerSession(request)
    console.log('👤 Session:', session ? { user: session.user, hasToken: !!session.token } : 'No session')
    
    // If no session found, try to extract token from headers directly
    let authToken = null
    if (!session) {
      const authHeader = request.headers.get('authorization')
      if (authHeader && authHeader.startsWith('Bearer ')) {
        authToken = authHeader.substring(7)
        console.log('🔑 Found token in headers, attempting direct validation')
      }
    } else {
      authToken = session.token
    }
    
    if (!authToken) {
      console.log('❌ No authentication token found')
      return NextResponse.json({ error: 'Unauthorized - No token' }, { status: 401 })
    }
    
    console.log('✅ Token found, will let backend validate it')
    
    // Get all products using unified service (admin context to get all products)
    const headers = { 'Authorization': `Bearer ${authToken}`, 'Content-Type': 'application/json' }
    const products = await unifiedProductService.getAllProducts(true, true, headers)
    console.log('📦 Products from unified service:', products.length)
    
    return NextResponse.json({
      success: true,
      data: products,
      count: products.length
    })
    
  } catch (error) {
    console.error('❌ Error fetching products:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to fetch products',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('➕ Creating product via admin API')
    
    // Check if user is authenticated and is admin
    const session = await getServerSession(request)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const body = await request.json()
    console.log('📝 Product data received:', body)
    
    // Create product using unified service with token
    const newProduct = await unifiedProductService.createProductWithToken(body, session.token || '')
    
    if (!newProduct) {
      throw new Error('Failed to create product')
    }
    
    console.log('✅ Product created successfully:', newProduct.id)
    return NextResponse.json({
      success: true,
      data: newProduct,
      message: 'Product created successfully'
    })
    
  } catch (error) {
    console.error('❌ Error creating product:', error)
    console.error('❌ Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    })
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to create product',
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}
