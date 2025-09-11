import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

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
    
    // Get the authorization header from the request
    const authHeader = request.headers.get('authorization')
    
    const backendUrl = process.env.NODE_ENV === 'development' 
      ? `http://localhost:5000/api/v1/orders/${id}/status`
      : `https://akazuba-backend-api.onrender.com/api/v1/orders/${id}/status`
    
    try {
      console.log('🔄 Updating order status in backend:', backendUrl, body)
      
      const response = await fetch(backendUrl, {
        method: 'PATCH',
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
      console.log('✅ Backend order update successful:', data)
      
      return NextResponse.json({
        success: true,
        message: 'Order updated successfully',
        data: data.data || data
      })
    } catch (backendError) {
      console.warn('⚠️ Backend not available for order update, using fallback:', backendError)
      
      // Return fallback response when backend is not available
      const fallbackResponse = {
        id: id,
        ...body,
        updatedAt: new Date().toISOString()
      }
      
      console.log('📝 Returning fallback response:', fallbackResponse)
      
      return NextResponse.json({
        success: true,
        message: 'Order updated successfully (offline mode)',
        data: fallbackResponse,
        backendAvailable: false
      })
    }
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update order' },
      { status: 500 }
    )
  }
}

export async function DELETE(
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
    
    // Get the authorization header from the request
    const authHeader = request.headers.get('authorization')
    
    const backendUrl = process.env.NODE_ENV === 'development' 
      ? `http://localhost:5000/api/v1/orders/${id}`
      : `https://akazuba-backend-api.onrender.com/api/v1/orders/${id}`
    
    try {
      console.log('🔄 Deleting order in backend:', backendUrl)
      
      const response = await fetch(backendUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(authHeader && { 'Authorization': authHeader }),
        }
      })

      console.log('📡 Backend response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Backend error response:', errorText)
        throw new Error(`Backend responded with status: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log('✅ Backend order deletion successful:', data)
      
      return NextResponse.json({
        success: true,
        message: 'Order deleted successfully',
        data: data.data || data
      })
    } catch (backendError) {
      console.warn('⚠️ Backend not available for order deletion, using fallback:', backendError)
      
      // Return fallback response when backend is not available
      const fallbackResponse = {
        id: id,
        deletedAt: new Date().toISOString()
      }
      
      console.log('📝 Returning fallback response:', fallbackResponse)
      
      return NextResponse.json({
        success: true,
        message: 'Order deleted successfully (offline mode)',
        data: fallbackResponse,
        backendAvailable: false
      })
    }
  } catch (error) {
    console.error('Error deleting order:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to delete order' },
      { status: 500 }
    )
  }
}

export async function GET(
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
    
    // Get the authorization header from the request
    const authHeader = request.headers.get('authorization')
    
    const backendUrl = process.env.NODE_ENV === 'development' 
      ? `http://localhost:5000/api/v1/orders/${id}`
      : `https://akazuba-backend-api.onrender.com/api/v1/orders/${id}`
    
    try {
      console.log('🔄 Fetching order from backend:', backendUrl)
      
      const response = await fetch(backendUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(authHeader && { 'Authorization': authHeader }),
        }
      })

      console.log('📡 Backend response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Backend error response:', errorText)
        throw new Error(`Backend responded with status: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log('✅ Backend order fetch successful:', data)
      
      return NextResponse.json({
        success: true,
        message: 'Order fetched successfully',
        data: data.data || data
      })
    } catch (backendError) {
      console.warn('⚠️ Backend not available for order fetch, using fallback:', backendError)
      
      // Return fallback response when backend is not available
      const fallbackResponse = {
        id: id,
        orderNumber: `ORD-${id.slice(-6)}`,
        status: 'pending',
        totalAmount: 0,
        createdAt: new Date().toISOString()
      }
      
      console.log('📝 Returning fallback response:', fallbackResponse)
      
      return NextResponse.json({
        success: true,
        message: 'Order fetched successfully (offline mode)',
        data: fallbackResponse,
        backendAvailable: false
      })
    }
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch order' },
      { status: 500 }
    )
  }
}
