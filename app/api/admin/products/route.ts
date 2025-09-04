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
    // Check if user is authenticated and is admin
    const session = await getServerSession()
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, price, category, stock } = body

    if (!name || !price || !category) {
      return NextResponse.json({ error: 'Name, price, and category are required' }, { status: 400 })
    }

    // Mock response - replace with actual database insert
    const newProduct = {
      id: Date.now(),
      name,
      description: description || '',
      price: Number(price),
      category,
      status: 'active',
      stock: Number(stock) || 0,
      image: '/images/default-product.jpg',
      createdAt: new Date().toISOString()
    }

    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

