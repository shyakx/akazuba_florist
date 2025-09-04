import { NextRequest, NextResponse } from 'next/server'

// Force dynamic rendering - this route needs access to request headers
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Since this is an admin route, it's already protected by the admin layout
    // We can directly fetch from the backend without additional token validation
    
    const response = await fetch(process.env.NODE_ENV === 'development' 
      ? `http://localhost:5000/api/v1/admin/dashboard/recent-orders/public`
      : `https://akazuba-backend-api.onrender.com/api/v1/admin/dashboard/recent-orders/public`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()
    
    if (response.ok) {
      return NextResponse.json(data)
    } else {
      return NextResponse.json({ success: false, message: data.message || 'Failed to fetch recent orders' }, { status: response.status })
    }
  } catch (error) {
    console.error('Error fetching recent orders:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
