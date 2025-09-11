import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// GET all ratings for a product
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    if (!productId) {
      return NextResponse.json(
        { success: false, message: 'Product ID is required' },
        { status: 400 }
      )
    }

    const backendUrl = process.env.NODE_ENV === 'development' 
      ? `http://localhost:5000/api/v1/ratings?productId=${productId}`
      : `https://akazuba-backend-api.onrender.com/api/v1/ratings?productId=${productId}`

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

// POST new rating
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId, productName, rating, comment, userName } = body

    // Validation
    if (!productId || !rating || !userName) {
      return NextResponse.json(
        { success: false, message: 'Product ID, rating, and user name are required' },
        { status: 400 }
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, message: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    const backendUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:5000/api/v1/ratings'
      : 'https://akazuba-backend-api.onrender.com/api/v1/ratings'

    const ratingData = {
      productId,
      productName,
      rating,
      comment: comment || '',
      userName,
      helpful: 0
    }

    try {
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ratingData),
      })

      if (!response.ok) {
        throw new Error(`Backend responded with status: ${response.status}`)
      }

      const data = await response.json()
      
      // Send admin notification
      await sendAdminNotification({
        type: 'new_rating',
        productName,
        rating,
        userName,
        comment
      })

      return NextResponse.json(data)
    } catch (backendError) {
      console.warn('Backend not available for rating submission, returning error:', backendError)
      
      // Send admin notification even when backend is down
      await sendAdminNotification({
        type: 'new_rating',
        productName,
        rating,
        userName,
        comment
      })

      return NextResponse.json({
        success: false,
        message: 'Rating service is currently unavailable. Please try again later.'
      }, { status: 503 })
    }
  } catch (error) {
    console.error('Error submitting rating:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to submit rating' },
      { status: 500 }
    )
  }
}

// Function to send admin notification
async function sendAdminNotification(notificationData: {
  type: string
  productName: string
  rating: number
  userName: string
  comment: string
}) {
  try {
    // Import admin notification system
    const { adminNotifications } = await import('@/lib/adminNotifications')
    
    // Create and add notification
    adminNotifications.createRatingNotification({
      productName: notificationData.productName,
      rating: notificationData.rating,
      userName: notificationData.userName,
      comment: notificationData.comment
    })
    
    // Admin notification sent for new rating
    
  } catch (error) {
    console.error('Error sending admin notification:', error)
  }
}
