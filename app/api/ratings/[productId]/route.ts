import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// GET ratings for a specific product
export async function GET(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const { productId } = params

    if (!productId) {
      return NextResponse.json(
        { success: false, message: 'Product ID is required' },
        { status: 400 }
      )
    }

    const backendUrl = process.env.NODE_ENV === 'development' 
      ? `http://localhost:5000/api/v1/ratings/${productId}`
      : `https://akazuba-backend-api.onrender.com/api/v1/ratings/${productId}`

    try {
      const response = await fetch(backendUrl, {
        method: 'GET',
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
      console.warn('Backend not available for ratings, returning empty data:', backendError)
      
      // Return empty data when backend is not available
      return NextResponse.json({
        success: true,
        ratings: [],
        averageRating: 0,
        totalRatings: 0,
        message: 'No ratings available (backend not available)'
      })
    }
  } catch (error) {
    console.error('Error fetching ratings:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch ratings' },
      { status: 500 }
    )
  }
}
