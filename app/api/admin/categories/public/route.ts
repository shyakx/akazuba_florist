import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const backendUrl = process.env.NODE_ENV === 'development' 
      ? `http://localhost:5000/api/v1/admin/categories`
      : `https://akazuba-backend-api.onrender.com/api/v1/admin/categories`
    
    // Get the authorization header from the request
    const authHeader = request.headers.get('authorization')
    
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
    
    // Transform the data to match frontend expectations
    if (data.success && data.data) {
      const transformedData = {
        success: true,
        data: data.data.map((category: any) => ({
          id: category.id,
          name: category.name,
          description: `Beautiful ${category.name.toLowerCase()} collection`,
          productCount: category.productsCount || 0,
          status: category.isActive ? 'active' : 'inactive',
          createdAt: category.createdAt
        }))
      }
      return NextResponse.json(transformedData)
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}
