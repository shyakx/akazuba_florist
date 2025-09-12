import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('👥 Fetching customers via admin API')

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const page = searchParams.get('page') || '1'
    const limit = searchParams.get('limit') || '20'

    console.log('🔍 Search params:', { search, page, limit })

    // Check if user is authenticated and is admin
    const session = await getServerSession(request)
    console.log('👤 Session:', session ? { user: session.user, hasToken: !!session.token } : 'No session')
    
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

    // Fetch customers from backend
    let backendUrl = 'http://localhost:5000/api/v1/admin/customers'
    
    // If we're in production environment, use production backend
    if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_USE_LOCAL_BACKEND) {
      backendUrl = 'https://akazuba-backend-api.onrender.com/api/v1/admin/customers'
    }

    try {
      const response = await fetch(backendUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Backend error response:', errorText)
        throw new Error(`Backend responded with status: ${response.status} - ${errorText}`)
      }

      const customers = await response.json()
      console.log('✅ Backend customers response:', customers)
      return NextResponse.json(customers)
    } catch (backendError) {
      console.warn('Backend not available for customers, returning empty array:', backendError)
      
      // Return proper response structure when backend is not available
      return NextResponse.json({
        success: true,
        message: 'Backend not available, returning empty customers',
        data: []
      })
    }
      
  } catch (error) {
    console.error('❌ Error fetching customers:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch customers',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
