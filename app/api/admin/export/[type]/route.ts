import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: { type: string } }
) {
  try {
    const { type } = params
    
    // Since this is an admin route, it's already protected by the admin layout
    // We can directly fetch from the backend without additional token validation

    // Forward the request to the backend
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 
      (process.env.NODE_ENV === 'development' 
        ? 'http://localhost:5000/api/v1' 
        : 'https://akazuba-backend-api.onrender.com/api/v1')

    const response = await fetch(`${API_BASE_URL}/admin/export/${type}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`)
    }

    const data = await response.text()
    
    return new NextResponse(data, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${type}-export-${new Date().toISOString().split('T')[0]}.csv"`
      }
    })
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    )
  }
}
