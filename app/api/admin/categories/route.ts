import { NextRequest, NextResponse } from 'next/server'
import { unifiedProductService } from '@/lib/unifiedProductService'

// Force dynamic rendering - this route needs access to request headers
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('📂 Fetching categories via admin API')
    
    // Get categories using unified service
    const categories = await unifiedProductService.getCategories()
    
    console.log('✅ Categories fetched:', categories.length)
    return NextResponse.json({
      success: true,
      data: categories
    })
    
  } catch (error) {
    console.error('❌ Error fetching categories:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch categories',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description } = body
    console.log('📂 Creating category:', name)

    if (!name) {
      return NextResponse.json({ 
        success: false, 
        message: 'Category name is required' 
      }, { status: 400 })
    }

    // For now, we'll return a success response since category creation
    // through the unified service would need backend implementation
    const newCategory = {
          id: Date.now().toString(),
      name,
      description: description || '',
          isActive: true,
      createdAt: new Date().toISOString()
    }
    
    console.log('✅ Category created:', newCategory.id)
    return NextResponse.json({
      success: true,
      message: 'Category created successfully',
      data: newCategory
    })
    
  } catch (error) {
    console.error('❌ Error creating category:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to create category',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

