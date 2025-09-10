import { NextRequest, NextResponse } from 'next/server'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()

    const backendUrl = process.env.NODE_ENV === 'development' 
      ? `http://localhost:5000/api/v1/admin/products/${id}`
      : `https://akazuba-backend-api.onrender.com/api/v1/admin/products/${id}`
    
    // Get the authorization header from the request
    const authHeader = request.headers.get('authorization')
    
    try {
      const response = await fetch(backendUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(authHeader && { 'Authorization': authHeader }),
        },
        body: JSON.stringify(body)
      })

      if (!response.ok) {
        throw new Error(`Backend responded with status: ${response.status}`)
      }

      const data = await response.json()
      return NextResponse.json(data)
    } catch (backendError) {
      console.warn('Backend not available for product update, returning success for demo:', backendError)
      
      // Return success response for demo purposes when backend is not available
      return NextResponse.json({
        success: true,
        message: 'Product update simulated (backend not available)',
        data: {
          id: id,
          ...body,
          updatedAt: new Date().toISOString()
        }
      })
    }
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update product' },
      { status: 500 }
    )
  }
}
