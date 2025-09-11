import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('👥 Fetching customers via admin API')

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const page = searchParams.get('page') || '1'
    const limit = searchParams.get('limit') || '20'

    console.log('🔍 Search params:', { search, page, limit })

    // For now, return mock customer data
    // This would be replaced with actual backend calls when the backend is ready
    const fallbackCustomers = [
          {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            phone: '+250784123456',
            totalOrders: 5,
            totalSpent: 375000,
            lastOrderDate: new Date(Date.now() - 86400000).toISOString(),
            status: 'active',
            createdAt: new Date(Date.now() - 2592000000).toISOString()
          },
          {
            id: '2',
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane@example.com',
            phone: '+250784654321',
            totalOrders: 3,
            totalSpent: 195000,
            lastOrderDate: new Date(Date.now() - 172800000).toISOString(),
            status: 'active',
            createdAt: new Date(Date.now() - 1728000000).toISOString()
          },
          {
            id: '3',
            firstName: 'Alice',
            lastName: 'Johnson',
            email: 'alice@example.com',
            phone: '+250784789012',
            totalOrders: 8,
            totalSpent: 520000,
            lastOrderDate: new Date(Date.now() - 432000000).toISOString(),
            status: 'active',
            createdAt: new Date(Date.now() - 3456000000).toISOString()
          }
    ]
    
    console.log('✅ Customers fetched:', fallbackCustomers.length)
    return NextResponse.json({
      success: true,
      data: fallbackCustomers,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
        total: fallbackCustomers.length,
          pages: 1
        }
    })
      
  } catch (error) {
    console.error('❌ Error fetching customers:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch customers',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
