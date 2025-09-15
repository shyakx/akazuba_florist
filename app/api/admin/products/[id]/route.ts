import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
import { unifiedProductService } from '@/lib/unifiedProductService'

// Force dynamic rendering - this route needs access to request headers
export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('📦 Admin get product API called for ID:', params.id)
    
    // Check if user is authenticated and is admin
    const session = await getServerSession(request)
    
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
    
    // Get product using unified service
    const headers = { 'Authorization': `Bearer ${authToken}`, 'Content-Type': 'application/json' }
    const products = await unifiedProductService.getAllProducts(true, true, headers)
    const product = products.find(p => p.id === params.id)
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    
    console.log('📦 Returning product from backend:', product.id)
    console.log('📦 Product data fields:', {
      id: product.id,
      name: product.name,
      categoryId: product.categoryId,
      categoryName: product.categoryName,
      allFields: Object.keys(product)
    })
    
    return NextResponse.json({
      success: true,
      data: product
    })
    
  } catch (error) {
    console.error('❌ Error fetching product:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch product',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('📦 Admin update product API called for ID:', params.id)
    
    // Check if user is authenticated and is admin (same logic as GET)
    const session = await getServerSession(request)
    
    // If no session found, try to extract token from headers directly
    let authToken = null
    if (!session) {
      const authHeader = request.headers.get('authorization')
      if (authHeader && authHeader.startsWith('Bearer ')) {
        authToken = authHeader.substring(7)
        console.log('🔑 Found token in headers for PUT, attempting direct validation')
      }
    } else {
      authToken = session.token
    }
    
    if (!authToken) {
      console.log('❌ No authentication token found for PUT')
      return NextResponse.json({ error: 'Unauthorized - No token' }, { status: 401 })
    }
    
    console.log('✅ Token found for PUT, will let backend validate it')

    const body = await request.json()
    console.log('📝 Product update data received:', body)
    
    // Update product using unified service with auth headers
    const headers = { 'Authorization': `Bearer ${authToken}`, 'Content-Type': 'application/json' }
    const updatedProduct = await unifiedProductService.updateProduct(params.id, body, headers)
    
    if (!updatedProduct) {
      throw new Error('Failed to update product')
    }
    
    console.log('✅ Product updated successfully:', updatedProduct.id)
    return NextResponse.json({
      success: true,
      data: updatedProduct,
      message: 'Product updated successfully'
    })
    
  } catch (error) {
    console.error('❌ Error updating product:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to update product',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('📦 Admin delete product API called for ID:', params.id)
    
    // Check if user is authenticated and is admin
    const session = await getServerSession(request)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized' 
      }, { status: 401 })
    }
    
    // Get the access token from the request headers
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    if (!token) {
      console.error('❌ No access token found in request headers')
      return NextResponse.json({
        success: false,
        message: 'Access token required'
      }, { status: 401 })
    }
    
    // Delete product using unified service
    await unifiedProductService.deleteProductWithToken(params.id, token)
    
    console.log('✅ Product deleted successfully:', params.id)
    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    })
    
  } catch (error) {
    console.error('❌ Error deleting product:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to delete product',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}