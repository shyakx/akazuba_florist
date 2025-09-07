import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const status = searchParams.get('status')
    const page = searchParams.get('page') || '1'
    const limit = searchParams.get('limit') || '20'

    // Build query parameters for backend
    const params = new URLSearchParams()
    if (search) params.append('search', search)
    if (status) params.append('status', status)
    params.append('page', page)
    params.append('limit', limit)

    const backendUrl = process.env.NODE_ENV === 'development' 
      ? `http://localhost:5000/api/v1/admin/orders?${params.toString()}`
      : `https://akazuba-backend-api.onrender.com/api/v1/admin/orders?${params.toString()}`
    
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
        data: data.data.map((order: any) => ({
          id: order.id,
          orderNumber: order.orderNumber,
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          customerPhone: order.shippingAddress?.phone || 'N/A',
          status: order.status.toLowerCase(),
          paymentStatus: order.paymentStatus.toLowerCase(),
          totalAmount: parseInt(order.totalAmount) || 0,
          total: parseInt(order.totalAmount) || 0,
          subtotal: parseInt(order.subtotal) || 0,
          taxAmount: order.taxAmount || 0,
          shippingAmount: order.shippingAmount || 0,
          discountAmount: order.discountAmount || 0,
          paymentMethod: order.paymentMethod,
          shippingAddress: order.shippingAddress,
          items: order.items || [],
          itemsCount: order.items?.length || 0,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt
        }))
      }
      return NextResponse.json(transformedData)
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
