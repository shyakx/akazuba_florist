import { NextRequest, NextResponse } from 'next/server'

// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const backendUrl = process.env.NODE_ENV === 'development' 
      ? `http://localhost:5000/api/v1/admin/settings`
      : `https://akazuba-backend-api.onrender.com/api/v1/admin/settings`
    
    // Get the authorization header from the request (only if available)
    const authHeader = request.headers?.get('authorization') || null
    
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { 'Authorization': authHeader }),
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    
    const backendUrl = process.env.NODE_ENV === 'development' 
      ? `http://localhost:5000/api/v1/admin/settings`
      : `https://akazuba-backend-api.onrender.com/api/v1/admin/settings`
    
    // Get the authorization header from the request (only if available)
    const authHeader = request.headers?.get('authorization') || null
    
    const response = await fetch(backendUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { 'Authorization': authHeader }),
      },
      body: JSON.stringify(body),
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}