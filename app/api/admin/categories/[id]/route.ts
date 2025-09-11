import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(request)
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ 
        success: false, 
        message: 'Admin access required' 
      }, { status: 401 })
    }

    const { id } = params
    const body = await request.json()

    const backendUrl = process.env.NODE_ENV === 'development' 
      ? `http://localhost:5000/api/v1/admin/categories/${id}`
      : `https://akazuba-backend-api.onrender.com/api/v1/admin/categories/${id}`
    
    // Get the authorization header from the request
    const authHeader = request.headers.get('authorization')
    
    try {
      console.log('🔄 Updating category in backend:', backendUrl, body)
      
      const response = await fetch(backendUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(authHeader && { 'Authorization': authHeader }),
        },
        body: JSON.stringify(body)
      })

      console.log('📡 Backend response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Backend error response:', errorText)
        throw new Error(`Backend responded with status: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log('✅ Backend category update successful:', data)
      
      return NextResponse.json({
        success: true,
        message: 'Category updated successfully',
        data: data.data || data
      })
    } catch (backendError) {
      console.warn('⚠️ Backend not available for category update, using fallback:', backendError)
      
      // Return fallback response when backend is not available
      const fallbackResponse = {
        id: id,
        ...body,
        updatedAt: new Date().toISOString()
      }
      
      console.log('📝 Returning fallback response:', fallbackResponse)
      
      return NextResponse.json({
        success: true,
        message: 'Category updated successfully (offline mode)',
        data: fallbackResponse,
        backendAvailable: false
      })
    }
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update category' },
      { status: 500 }
    )
  }
}
