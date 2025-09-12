import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Debug token endpoint called')
    
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        error: 'No authorization header found'
      }, { status: 401 })
    }
    
    const token = authHeader.substring(7)
    console.log('🔑 Token (first 20 chars):', token.substring(0, 20) + '...')
    
    // Test the token with the backend
    const backendUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:5000/api/v1/admin/orders'
      : 'https://akazuba-backend-api.onrender.com/api/v1/admin/orders'
    
    try {
      const response = await fetch(backendUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      
      console.log('📡 Backend response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        return NextResponse.json({
          success: true,
          message: 'Token is valid',
          backendStatus: response.status,
          dataLength: data.data ? data.data.length : 0
        })
      } else {
        const errorText = await response.text()
        return NextResponse.json({
          success: false,
          message: 'Token validation failed',
          backendStatus: response.status,
          backendError: errorText
        }, { status: 401 })
      }
    } catch (backendError) {
      console.error('❌ Backend test error:', backendError)
      return NextResponse.json({
        success: false,
        message: 'Backend connection failed',
        error: backendError instanceof Error ? backendError.message : 'Unknown error'
      }, { status: 500 })
    }
  } catch (error) {
    console.error('❌ Debug token error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
