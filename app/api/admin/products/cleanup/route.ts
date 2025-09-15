import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(request: NextRequest) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if we're in development mode
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { success: false, message: 'Cleanup only allowed in development mode' },
        { status: 403 }
      )
    }

    console.log('🧹 Starting database cleanup...')

    // Import the unified product service
    const { unifiedProductService } = await import('@/lib/unifiedProductService')
    const token = authHeader.replace('Bearer ', '')

    // Get all existing products first
    const existingProducts = await unifiedProductService.getAllProducts()
    console.log(`📊 Found ${existingProducts.length} existing products to delete`)

    if (existingProducts.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Database is already clean - no products to delete',
        data: {
          deletedCount: 0,
          totalCount: 0
        }
      })
    }

    // Delete each product
    let deletedCount = 0
    let errorCount = 0
    const errors: string[] = []

    for (const product of existingProducts) {
      try {
        console.log(`🗑️ Deleting product: ${product.name}`)
        
        // Use the unified product service to delete
        const deleteResult = await unifiedProductService.deleteProduct(product.id)
        
        if (deleteResult) {
          deletedCount++
          console.log(`✅ Successfully deleted: ${product.name}`)
        } else {
          errorCount++
          const errorMsg = `Failed to delete product: ${product.name}`
          errors.push(errorMsg)
          console.error(`❌ ${errorMsg}`)
        }
      } catch (error) {
        errorCount++
        const errorMsg = `Error deleting product ${product.name}: ${error instanceof Error ? error.message : 'Unknown error'}`
        errors.push(errorMsg)
        console.error(`❌ ${errorMsg}`)
      }
    }

    console.log(`📊 Cleanup completed: ${deletedCount} deleted, ${errorCount} errors`)

    return NextResponse.json({
      success: true,
      message: `Database cleanup completed. ${deletedCount} products deleted, ${errorCount} errors.`,
      data: {
        deletedCount,
        errorCount,
        totalCount: existingProducts.length,
        errors: errors.length > 0 ? errors : undefined
      }
    })

  } catch (error) {
    console.error('❌ Database cleanup failed:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error during cleanup',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Get cleanup status
export async function GET(request: NextRequest) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Import the unified product service
    const { unifiedProductService } = await import('@/lib/unifiedProductService')

    // Get current product count
    const existingProducts = await unifiedProductService.getAllProducts()
    const productCount = existingProducts.length

    return NextResponse.json({
      success: true,
      message: `Database status retrieved`,
      data: {
        totalProducts: productCount,
        isClean: productCount === 0,
        environment: process.env.NODE_ENV || 'development'
      }
    })

  } catch (error) {
    console.error('❌ Failed to get cleanup status:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to get database status',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
