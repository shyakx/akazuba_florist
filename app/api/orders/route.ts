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

    const backendUrl = process.env.NODE_ENV === 'development' 
      ? `http://localhost:5000/api/v1/orders?${params.toString()}`
      : `https://akazuba-backend-api.onrender.com/api/v1/orders?${params.toString()}`

    // Get the authorization header from the request
    const authHeader = request.headers.get('authorization')

    try {
      const response = await fetch(backendUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(authHeader && { 'Authorization': authHeader }),
        },
      })

      if (!response.ok) {
        throw new Error(`Backend responded with status: ${response.status}`)
      }

      const data = await response.json()
      return NextResponse.json(data)
    } catch (backendError) {
      console.warn('Backend not available for orders, using fallback data:', backendError)
      
      // Fallback orders data
      const fallbackOrders = {
        success: true,
        data: [
          {
            id: '1',
            orderNumber: 'ORD-001',
            customerName: 'John Doe',
            customerEmail: 'john@example.com',
            customerPhone: '+250784123456',
            total: 75000,
            status: 'pending',
            paymentMethod: 'MoMo',
            deliveryAddress: 'Kigali, Rwanda',
            items: [
              {
                id: '1',
                name: 'Red Rose Bouquet',
                price: 25000,
                quantity: 2,
                image: '/images/flowers/red/red-1.jpg'
              },
              {
                id: '2',
                name: 'White Lily Arrangement',
                price: 25000,
                quantity: 1,
                image: '/images/flowers/white/white-1.jpg'
              }
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: '2',
            orderNumber: 'ORD-002',
            customerName: 'Jane Smith',
            customerEmail: 'jane@example.com',
            customerPhone: '+250784654321',
            total: 45000,
            status: 'completed',
            paymentMethod: 'Bank Transfer',
            deliveryAddress: 'Kigali, Rwanda',
            items: [
              {
                id: '3',
                name: 'Female Elegance Perfume',
                price: 45000,
                quantity: 1,
                image: '/images/flowers/red/red-1.jpg'
              }
            ],
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            updatedAt: new Date().toISOString()
          }
        ],
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: 2,
          pages: 1
        }
      }
      
      return NextResponse.json(fallbackOrders)
    }
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
