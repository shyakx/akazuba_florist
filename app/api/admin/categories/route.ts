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
    const categories = [
      { id: 1, name: 'Flowers', description: 'Beautiful flower arrangements', status: 'active', productCount: 15 },
      { id: 2, name: 'Perfumes', description: 'Exquisite fragrances', status: 'active', productCount: 8 },
      { id: 3, name: 'Gifts', description: 'Special gift items', status: 'active', productCount: 12 },
      { id: 4, name: 'Wedding', description: 'Wedding floral services', status: 'active', productCount: 6 },
      { id: 5, name: 'Corporate', description: 'Corporate event flowers', status: 'active', productCount: 4 }
    ]

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
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
    const { name, description } = body

    if (!name) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 })
    }

    // Mock response - replace with actual database insert
    const newCategory = {
      id: Date.now(),
      name,
      description: description || '',
      status: 'active',
      productCount: 0,
      createdAt: new Date().toISOString()
    }

    return NextResponse.json(newCategory, { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

