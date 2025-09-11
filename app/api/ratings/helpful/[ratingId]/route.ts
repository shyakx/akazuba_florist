import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// POST mark rating as helpful
export async function POST(
  request: NextRequest,
  { params }: { params: { ratingId: string } }
) {
  try {
    const { ratingId } = params

    if (!ratingId) {
      return NextResponse.json(
        { success: false, message: 'Rating ID is required' },
        { status: 400 }
      )
    }

    const backendUrl = process.env.NODE_ENV === 'development' 
      ? `http://localhost:5000/api/v1/ratings/${ratingId}/helpful`
      : `https://akazuba-backend-api.onrender.com/api/v1/ratings/${ratingId}/helpful`

    try {
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Backend responded with status: ${response.status}`)
      }

      const data = await response.json()
      return NextResponse.json(data)
    } catch (backendError) {
      console.warn('Backend not available for helpful rating, simulating success:', backendError)
      
      // Return success response for demo
      return NextResponse.json({
        success: true,
        message: 'Rating marked as helpful (demo mode)',
        helpful: true
      })
    }
  } catch (error) {
    console.error('Error marking rating as helpful:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to mark rating as helpful' },
      { status: 500 }
    )
  }
}
