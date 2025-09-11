import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// GET rating analytics for admin dashboard
export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(request)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const backendUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:5000/api/v1/admin/ratings/analytics'
      : 'https://akazuba-backend-api.onrender.com/api/v1/admin/ratings/analytics'

    try {
      const response = await fetch(backendUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.token}`
        },
      })

      if (!response.ok) {
        throw new Error(`Backend responded with status: ${response.status}`)
      }

      const data = await response.json()
      return NextResponse.json(data)
    } catch (backendError) {
      console.warn('Backend not available for rating analytics, returning empty data:', backendError)
      
      // Return empty analytics when backend is not available
      return NextResponse.json({
        success: true,
        totalRatings: 0,
        averageRating: 0,
        recentRatings: [],
        message: 'No rating data available (backend not available)'
      })
    }
  } catch (error) {
    console.error('Error fetching rating analytics:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch rating analytics' },
      { status: 500 }
    )
  }
}
