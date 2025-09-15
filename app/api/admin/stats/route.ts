import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
import { unifiedProductService } from '@/lib/unifiedProductService'

// Force dynamic rendering - this route needs access to request headers
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('📊 Admin stats API called')
    
    // Check if user is authenticated and is admin
    const session = await getServerSession(request)
    
    // If no session found, try to extract token from headers directly
    let authToken = null
    if (!session) {
      const authHeader = request.headers.get('authorization')
      if (authHeader && authHeader.startsWith('Bearer ')) {
        authToken = authHeader.substring(7)
        console.log('🔑 Found token in headers, attempting direct validation')
      }
    } else {
      authToken = session.token
    }
    
    if (!authToken) {
      console.log('❌ No authentication token found')
      return NextResponse.json({ error: 'Unauthorized - No token' }, { status: 401 })
    }
    
    console.log('✅ Token found, will let backend validate it')
    
    // Get all products using unified service (admin context to get all products)
    const headers = { 'Authorization': `Bearer ${authToken}`, 'Content-Type': 'application/json' }
    const products = await unifiedProductService.getAllProducts(true, true, headers)
    console.log('📦 Products from unified service:', products.length)
    
    // Try to get orders from backend
    let orders = []
    let customers = 0
    let revenue = 0
    
    try {
      // Try local backend first, then fallback to production
      let backendUrl = 'http://localhost:5000/api/v1/admin/orders'
      
      // If we're in production environment, use production backend
      if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_USE_LOCAL_BACKEND) {
        backendUrl = 'https://akazuba-backend-api.onrender.com/api/v1/admin/orders'
      }

      const response = await fetch(backendUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
      })

      if (response.ok) {
        const ordersData = await response.json()
        orders = ordersData.data || ordersData || []
        console.log('📦 Orders from backend:', orders.length)
        
        // Calculate revenue from orders
        revenue = orders.reduce((sum: number, order: any) => {
          return sum + (Number(order.totalAmount) || 0)
        }, 0)
        
        // Get unique customers count
        const uniqueCustomers = new Set(orders.map((order: any) => order.customerEmail))
        customers = uniqueCustomers.size
      }
    } catch (backendError) {
      console.warn('Backend not available for orders, using fallback data:', backendError)
      // Use fallback data when backend is not available
      orders = []
      customers = 0
      revenue = 0
    }
    
    const stats = {
      success: true,
      data: {
        categories: 7, // We have 7 categories including flowers, perfumes, and others
        products: products.length,
        orders: orders.length,
        revenue: revenue,
        customers: customers
      }
    }
    
    console.log('📊 Returning stats:', stats)
    return NextResponse.json(stats)
    
  } catch (error) {
    console.error('❌ Error fetching stats:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to fetch stats',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
