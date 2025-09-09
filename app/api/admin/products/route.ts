import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession()
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Mock data for now - replace with actual database query
    const products = [
      {
        id: 1,
        name: 'Red Rose Bouquet',
        description: 'Beautiful red rose arrangement, perfect for romantic occasions',
        price: 25000,
        category: 'Flowers',
        status: 'active',
        stock: 15,
        image: '/images/red-rose.jpg'
      },
      {
        id: 2,
        name: 'Lavender Perfume',
        description: 'Elegant lavender fragrance with long-lasting scent',
        price: 45000,
        category: 'Perfumes',
        status: 'active',
        stock: 8,
        image: '/images/lavender-perfume.jpg'
      },
      {
        id: 3,
        name: 'Gift Basket',
        description: 'Luxury gift basket with flowers and chocolates',
        price: 35000,
        category: 'Gifts',
        status: 'active',
        stock: 12,
        image: '/images/gift-basket.jpg'
      },
      {
        id: 4,
        name: 'Wedding Package',
        description: 'Complete wedding floral arrangement service',
        price: 150000,
        category: 'Wedding',
        status: 'active',
        stock: 5,
        image: '/images/wedding-package.jpg'
      }
    ]

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, price, categoryId, stockQuantity, isActive, images } = body

    if (!name || !price || !categoryId) {
      return NextResponse.json({ 
        success: false, 
        message: 'Name, price, and category are required' 
      }, { status: 400 })
    }

    const backendUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:5000/api/v1/admin/products'
      : 'https://akazuba-backend-api.onrender.com/api/v1/admin/products'
    
    // Get the authorization header from the request
    const authHeader = request.headers.get('authorization')
    
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { 'Authorization': authHeader }),
      },
      body: JSON.stringify({
        name,
        description: description || '',
        price: Number(price),
        categoryId,
        stockQuantity: Number(stockQuantity) || 0,
        isActive: isActive !== false,
        images: images || []
      })
    })

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to create product' },
      { status: 500 }
    )
  }
}

