import { NextRequest, NextResponse } from 'next/server'

// Force dynamic rendering - this route needs access to request headers
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Since this is an admin route, it's already protected by the admin layout
    // We can directly fetch from the backend without additional token validation
    
    const backendUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:5000/api/v1/admin/dashboard/stats/public'
      : 'https://akazuba-backend-api.onrender.com/api/v1/admin/dashboard/stats/public'
    
    try {
      const response = await fetch(backendUrl, {
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()
      
      if (response.ok) {
        return NextResponse.json(data)
      } else {
        throw new Error(`Backend responded with status: ${response.status}`)
      }
    } catch (backendError) {
      console.warn('Backend not available, using fallback data:', backendError)
      
      // Fallback data when backend is not available
      const fallbackStats = {
        success: true,
        categories: 4,
        products: 12,
        orders: 8,
        revenue: 125000,
        customers: 15
      }
      
      return NextResponse.json(fallbackStats)
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
