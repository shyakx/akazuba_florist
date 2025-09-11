import { NextRequest, NextResponse } from 'next/server'
import { unifiedProductService } from '@/lib/unifiedProductService'

// Force dynamic rendering - this route needs access to request headers
export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    console.log('📦 Fetching product by ID:', id)
    
    // Get product using unified service
    const product = await unifiedProductService.getProductById(id)
    
    if (product) {
      console.log('✅ Product found:', product.name)
      return NextResponse.json({
        success: true,
        data: product
      })
    } else {
      console.log('❌ Product not found:', id)
      return NextResponse.json({
        success: false,
        message: 'Product not found'
      }, { status: 404 })
    }
    
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
    const { id } = params
    console.log('🔄 Updating product:', id)
    
    const body = await request.json()
    console.log('📝 Update data received:', body)
    
    // Update product using unified service
    const updatedProduct = await unifiedProductService.updateProduct(id, body)
    
    if (updatedProduct) {
      console.log('✅ Product updated successfully:', updatedProduct.name)
      return NextResponse.json({
        success: true,
        data: updatedProduct,
        message: 'Product updated successfully'
      })
    } else {
      console.error('❌ Failed to update product')
      return NextResponse.json({
        success: false,
        message: 'Failed to update product'
      }, { status: 500 })
    }
    
  } catch (error) {
    console.error('❌ Error updating product:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to update product',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
