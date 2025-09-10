import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Product ID is required' },
        { status: 400 }
      )
    }

    const backendUrl = process.env.NODE_ENV === 'development' 
      ? `http://localhost:5000/api/v1/admin/products/${id}`
      : `https://akazuba-backend-api.onrender.com/api/v1/admin/products/${id}`
    
    // Get the authorization header from the request
    const authHeader = request.headers.get('authorization')
    
    console.log('🗑️ Deleting product:', { id, backendUrl, hasAuth: !!authHeader })
    
    let response: Response
    try {
      response = await fetch(backendUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(authHeader && { 'Authorization': authHeader }),
        },
      })
    } catch (fetchError) {
      console.warn('🗑️ Backend server not available:', fetchError)
      // Return an error response when backend is not available
      return NextResponse.json({
        success: false,
        message: 'Backend server is not available. Please ensure the backend server is running.',
        error: 'Backend connection failed',
        backendAvailable: false
      }, { status: 503 })
    }

    console.log('🗑️ Backend response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('🗑️ Backend error response:', errorText)
      
      // If backend returns 404 or 500, return proper error
      if (response.status === 404 || response.status === 500) {
        console.warn('🗑️ Backend error:', response.status, errorText)
        return NextResponse.json({
          success: false,
          message: `Backend error: ${errorText || 'Product not found or server error'}`,
          error: 'Backend error',
          status: response.status
        }, { status: response.status })
      }
      
      throw new Error(`Backend responded with status: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log('🗑️ Product deleted successfully:', data)
    return NextResponse.json(data)
  } catch (error) {
    console.error('🗑️ Error deleting product:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to delete product',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
