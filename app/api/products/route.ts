import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// GET all products (public endpoint for both customer and admin use)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') || '1'
    const limit = searchParams.get('limit') || '1000'

    const backendUrl = process.env.NODE_ENV === 'development' 
      ? `http://localhost:5000/api/v1/products?page=${page}&limit=${limit}`
      : `https://akazuba-backend-api.onrender.com/api/v1/products?page=${page}&limit=${limit}`

    try {
      const response = await fetch(backendUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Backend responded with status: ${response.status}`)
      }

      const data = await response.json()
      return NextResponse.json(data)
    } catch (backendError) {
      console.warn('Backend not available, using fallback products data:', backendError)
      
      // Fallback products data with proper categorization
      const fallbackProducts = {
        success: true,
        data: [
          {
            id: '1',
            name: 'Female Elegance Perfume',
            price: '65000',
            image: '/images/flowers/red/red-1.jpg',
            category: 'Perfumes',
            description: 'Elegant and feminine fragrance for women, perfect for special occasions and romantic evenings',
            type: 'perfume',
            color: 'pink',
            brand: 'Akazuba',
            status: 'active',
            stock: 10,
            isActive: true,
            featured: true,
            createdAt: new Date().toISOString()
          },
          {
            id: '2',
            name: 'Wedding Bouquet - White Roses',
            price: '130000',
            image: '/images/flowers/white/white-1.jpg',
            category: 'Flowers',
            description: 'Beautiful white rose bouquet perfect for wedding ceremonies and bridal celebrations',
            type: 'flowers',
            color: 'white',
            status: 'active',
            stock: 5,
            isActive: true,
            featured: true,
            createdAt: new Date().toISOString()
          },
          {
            id: '3',
            name: 'Anniversary Red Roses',
            price: '130000',
            image: '/images/flowers/red/red-1.jpg',
            category: 'Flowers',
            description: 'Romantic red roses perfect for anniversaries and expressing love',
            type: 'flowers',
            color: 'red',
            status: 'active',
            stock: 8,
            isActive: true,
            featured: true,
            createdAt: new Date().toISOString()
          },
          {
            id: '4',
            name: 'Valentine\'s Day Special',
            price: '95000',
            image: '/images/flowers/red/red-2.jpg',
            category: 'Flowers',
            description: 'Romantic red and pink roses perfect for Valentine\'s Day celebrations',
            type: 'flowers',
            color: 'red',
            status: 'active',
            stock: 12,
            isActive: true,
            featured: false,
            createdAt: new Date().toISOString()
          },
          {
            id: '5',
            name: 'Mother\'s Day Pink Bouquet',
            price: '85000',
            image: '/images/flowers/pink/pink-1.jpg',
            category: 'Flowers',
            description: 'Beautiful pink flowers perfect for showing love and appreciation to mothers',
            type: 'flowers',
            color: 'pink',
            status: 'active',
            stock: 7,
            isActive: true,
            featured: false,
            createdAt: new Date().toISOString()
          },
          {
            id: '6',
            name: 'Graduation Sunflower Arrangement',
            price: '75000',
            image: '/images/flowers/yellow/yellow-1.jpg',
            category: 'Flowers',
            description: 'Bright yellow sunflowers perfect for graduation celebrations and achievements',
            type: 'flowers',
            color: 'yellow',
            status: 'active',
            stock: 9,
            isActive: true,
            featured: false,
            createdAt: new Date().toISOString()
          },
          {
            id: '7',
            name: 'Male Confidence Cologne',
            price: '55000',
            image: '/images/perfumes/male/male-1.jpg',
            category: 'Perfumes',
            description: 'Masculine and confident fragrance for the modern gentleman',
            type: 'perfume',
            color: 'blue',
            brand: 'Akazuba',
            status: 'active',
            stock: 15,
            isActive: true,
            featured: false,
            createdAt: new Date().toISOString()
          },
          {
            id: '8',
            name: 'Soft Scent Daily Wear',
            price: '45000',
            image: '/images/perfumes/soft/soft-1.jpg',
            category: 'Perfumes',
            description: 'Gentle and subtle fragrance perfect for everyday wear and office use',
            type: 'perfume',
            color: 'white',
            brand: 'Akazuba',
            status: 'active',
            stock: 20,
            isActive: true,
            featured: false,
            createdAt: new Date().toISOString()
          },
          {
            id: '9',
            name: 'Birthday Celebration Mix',
            price: '65000',
            image: '/images/flowers/mixed/mixed-1.jpg',
            category: 'Flowers',
            description: 'Colorful mixed flower arrangement perfect for birthday celebrations and parties',
            type: 'flowers',
            color: 'mixed',
            status: 'active',
            stock: 6,
            isActive: true,
            featured: false,
            createdAt: new Date().toISOString()
          },
          {
            id: '10',
            name: 'Funeral Peaceful Lilies',
            price: '90000',
            image: '/images/flowers/white/white-2.jpg',
            category: 'Flowers',
            description: 'Peaceful white lilies for respectful memorial and funeral arrangements',
            type: 'flowers',
            color: 'white',
            status: 'active',
            stock: 4,
            isActive: true,
            featured: false,
            createdAt: new Date().toISOString()
          }
        ],
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: 10,
          pages: 1
        }
      }
      
      return NextResponse.json(fallbackProducts)
    }
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
