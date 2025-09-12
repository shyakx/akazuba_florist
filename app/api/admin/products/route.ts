import { NextRequest, NextResponse } from 'next/server'
import { unifiedProductService } from '@/lib/unifiedProductService'

// Force dynamic rendering - this route needs access to request headers
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('📦 Admin products API called')
    
    // Get the authorization header from the request
    const authHeader = request.headers.get('authorization')
    console.log('🔑 Auth header present:', !!authHeader)
    
    // Get all products using unified service (admin context to get all products)
    const headers = authHeader ? { 'Authorization': authHeader, 'Content-Type': 'application/json' } : undefined
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
    
    // Get the authorization header from the request
    const authHeader = request.headers.get('authorization')
    console.log('🔑 Auth header present:', !!authHeader)
    
    const body = await request.json()
    console.log('📝 Product data received:', body)
    
    // Create product using unified service
    const newProduct = await unifiedProductService.createProduct(body)
    
    if (newProduct) {
      console.log('✅ Product created successfully:', newProduct.id)
      return NextResponse.json({
        success: true,
        data: newProduct,
        message: 'Product created successfully'
      })
    } else {
      console.error('❌ Failed to create product')
      return NextResponse.json({ 
        success: false, 
        message: 'Failed to create product'
      }, { status: 500 })
    }
    
  } catch (error) {
    console.error('❌ Error creating product:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to create product',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
