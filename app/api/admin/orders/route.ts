import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
import { emailService, OrderEmailData } from '@/lib/emailService'

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(request)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch orders from backend
    const backendUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:5000/api/v1/admin/orders'
      : 'https://akazuba-backend-api.onrender.com/api/v1/admin/orders'

    try {
      const response = await fetch(backendUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.token}`
        },
      })

      if (!response.ok) {
        throw new Error(`Backend responded with status: ${response.status}`)
      }

      const orders = await response.json()
      return NextResponse.json(orders)
    } catch (backendError) {
      console.warn('Backend not available for orders, returning empty array:', backendError)
      
      // Return empty array when backend is not available
      return NextResponse.json([])
    }
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(request)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { customerName, customerEmail, items, total, deliveryAddress } = body

    if (!customerName || !customerEmail || !items || !total) {
      return NextResponse.json({ error: 'Customer details, items, and total are required' }, { status: 400 })
    }

    // Create order in backend
    const backendUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:5000/api/v1/admin/orders'
      : 'https://akazuba-backend-api.onrender.com/api/v1/admin/orders'

    const orderData = {
      customerName,
      customerEmail,
      customerPhone: body.customerPhone || '',
      items,
      total: Number(total),
      paymentMethod: body.paymentMethod || 'MoMo',
      deliveryAddress: deliveryAddress || '',
      status: 'pending'
    }

    let newOrder
    try {
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.token}`
        },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        throw new Error(`Backend responded with status: ${response.status}`)
      }

      newOrder = await response.json()
    } catch (backendError) {
      console.warn('Backend not available for order creation, creating local order:', backendError)
      
      // Fallback: create order locally when backend is not available
      newOrder = {
        id: Date.now(),
        orderNumber: `ORD-${String(Date.now()).slice(-6)}`,
        customerName,
        customerEmail,
        customerPhone: body.customerPhone || '',
        items,
        total: Number(total),
        status: 'pending',
        paymentMethod: body.paymentMethod || 'MoMo',
        deliveryAddress: deliveryAddress || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }

    // Send email notification to admin
    try {
      const emailData: OrderEmailData = {
        orderNumber: newOrder.orderNumber,
        customerName: newOrder.customerName,
        customerEmail: newOrder.customerEmail,
        customerPhone: newOrder.customerPhone,
        total: newOrder.total,
        items: newOrder.items.map((item: any) => ({
          id: item.productId || item.id || '',
          name: item.name || 'Unknown Product',
          price: item.price || 0,
          quantity: item.quantity || 1,
          image: item.image || item.imageUrl || '/images/placeholder-product.jpg'
        })),
        orderDate: newOrder.createdAt,
        deliveryAddress: newOrder.deliveryAddress,
        paymentMethod: newOrder.paymentMethod,
        orderStatus: newOrder.status
      }

      const emailSent = await emailService.sendOrderNotificationEmail(emailData)
      console.log('📧 Order notification email sent:', emailSent)
    } catch (emailError) {
      console.error('❌ Failed to send order notification email:', emailError)
      // Don't fail the order creation if email fails
    }

    return NextResponse.json(newOrder, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

