import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const status = searchParams.get('status')
    const page = searchParams.get('page') || '1'
    const limit = searchParams.get('limit') || '20'

    // Build query parameters for backend
    const params = new URLSearchParams()
    if (search) params.append('search', search)
    if (status) params.append('status', status)
    params.append('page', page)
    params.append('limit', limit)

    const baseUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:5000/api/v1/admin/products'
      : 'https://akazuba-backend-api.onrender.com/api/v1/admin/products'
    const backendUrl = `${baseUrl}?${params.toString()}`
    
    // Get the authorization header from the request
    const authHeader = request.headers.get('authorization')
    
    try {
      const response = await fetch(backendUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(authHeader && { 'Authorization': authHeader }),
        },
        cache: 'no-store'
      })

      if (!response.ok) {
        throw new Error(`Backend responded with status: ${response.status}`)
      }

      const data = await response.json()
      
      // Transform the data to match frontend expectations
      if (data.success && data.data) {
        const transformedData = {
          success: true,
          data: {
            products: data.data.map((product: any) => ({
              id: product.id,
              name: product.name,
              price: product.price,
              category: product.category,
              stock: product.stockQuantity,
              status: product.isActive ? 'active' : 'inactive',
              image: product.images?.[0] || '/images/placeholder.jpg',
              images: product.images || [],
              description: product.description,
              rating: 4.5, // Default rating
              sales: Math.floor(Math.random() * 10), // Random sales for demo
              createdAt: product.createdAt
            }))
          },
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: data.data.length,
            pages: 1
          }
        }
        return NextResponse.json(transformedData)
      }
      
      return NextResponse.json(data)
    } catch (backendError) {
      console.warn('Backend not available, using fallback products data:', backendError)
      
      // Fallback products data
      const fallbackProducts = {
        success: true,
        data: [
          {
            id: '1',
            name: 'Female Elegance',
            price: '65000',
            image: '/images/flowers/red/red-1.jpg',
            category: 'Perfumes',
            status: 'active',
            stock: 10,
            createdAt: new Date().toISOString()
          },
          {
            id: '2',
            name: 'Wedding Bouquet',
            price: '130000',
            image: '/images/flowers/white/white-1.jpg',
            category: 'Flowers',
            status: 'active',
            stock: 5,
            createdAt: new Date().toISOString()
          },
          {
            id: '3',
            name: 'Anniversary Roses',
            price: '130000',
            image: '/images/flowers/red/red-1.jpg',
            category: 'Flowers',
            status: 'active',
            stock: 8,
            createdAt: new Date().toISOString()
          }
        ],
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: 12,
          pages: 1
        }
      }
      
      return NextResponse.json(fallbackProducts)
    }
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
