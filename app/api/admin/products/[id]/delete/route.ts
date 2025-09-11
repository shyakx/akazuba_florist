import { NextRequest, NextResponse } from 'next/server'
import { unifiedProductService } from '@/lib/unifiedProductService'

// Force dynamic rendering - this route needs access to request headers
export const dynamic = 'force-dynamic'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    console.log('🗑️ Deleting product:', id)
    
    // Delete product using unified service
    const success = await unifiedProductService.deleteProduct(id)
    
    if (success) {
      console.log('✅ Product deleted successfully:', id)
      return NextResponse.json({
        success: true,
        message: 'Product deleted successfully'
      })
    } else {
      console.error('❌ Failed to delete product')
      return NextResponse.json({
        success: false,
        message: 'Failed to delete product'
      }, { status: 500 })
    }
    
  } catch (error) {
    console.error('❌ Error deleting product:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to delete product',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
