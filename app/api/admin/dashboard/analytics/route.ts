import { NextRequest, NextResponse } from 'next/server'

// Force dynamic rendering - this route needs access to request headers
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const backendUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:5000/api/v1/admin/dashboard/analytics'
      : 'https://akazuba-backend-api.onrender.com/api/v1/admin/dashboard/analytics'
    
    // Get the authorization header from the request
    const authHeader = request.headers.get('authorization')
    
    try {
      const response = await fetch(backendUrl, {
        headers: {
          'Content-Type': 'application/json',
          ...(authHeader && { 'Authorization': authHeader }),
        }
      })

      const data = await response.json()
      
      if (response.ok && data.success) {
        return NextResponse.json(data)
      } else {
        throw new Error(`Backend responded with status: ${response.status}`)
      }
    } catch (backendError) {
      console.warn('Backend not available, using fallback data:', backendError)
      
      // Fallback data when backend is not available
      const fallbackAnalytics = {
        success: true,
        data: {
          totalOrders: 0,
          totalRevenue: 0,
          totalCustomers: 0,
          totalProducts: 0,
          recentOrders: [],
          topProducts: [],
          monthlyRevenue: [],
          customerGrowth: [],
          revenueGrowth: 0,
          orderGrowth: 0
        }
      }
      
      return NextResponse.json(fallbackAnalytics)
    }
  } catch (error) {
    console.error('Error fetching analytics data:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
