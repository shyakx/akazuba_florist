import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession()
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Mock data for now - replace with actual database query
    const orders = [
      {
        id: 1,
        orderNumber: 'ORD-001',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        customerPhone: '0781234567',
        items: [
          { productId: 1, name: 'Red Rose Bouquet', quantity: 1, price: 25000 }
        ],
        total: 25000,
        status: 'pending',
        paymentMethod: 'MoMo',
        deliveryAddress: 'Kigali, Rwanda',
        createdAt: '2025-01-03T10:00:00Z',
        updatedAt: '2025-01-03T10:00:00Z'
      },
      {
        id: 2,
        orderNumber: 'ORD-002',
        customerName: 'Jane Smith',
        customerEmail: 'jane@example.com',
        customerPhone: '0789876543',
        items: [
          { productId: 2, name: 'Lavender Perfume', quantity: 1, price: 45000 },
          { productId: 3, name: 'Gift Basket', quantity: 1, price: 35000 }
        ],
        total: 80000,
        status: 'completed',
        paymentMethod: 'BK',
        deliveryAddress: 'Kigali, Rwanda',
        createdAt: '2025-01-02T15:30:00Z',
        updatedAt: '2025-01-03T09:00:00Z'
      },
      {
        id: 3,
        orderNumber: 'ORD-003',
        customerName: 'Robert Johnson',
        customerEmail: 'robert@example.com',
        customerPhone: '0785555555',
        items: [
          { productId: 4, name: 'Wedding Package', quantity: 1, price: 150000 }
        ],
        total: 150000,
        status: 'processing',
        paymentMethod: 'MoMo',
        deliveryAddress: 'Kigali, Rwanda',
        createdAt: '2025-01-01T12:00:00Z',
        updatedAt: '2025-01-02T14:00:00Z'
      }
    ]

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession()
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { customerName, customerEmail, items, total, deliveryAddress } = body

    if (!customerName || !customerEmail || !items || !total) {
      return NextResponse.json({ error: 'Customer details, items, and total are required' }, { status: 400 })
    }

    // Mock response - replace with actual database insert
    const newOrder = {
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

    return NextResponse.json(newOrder, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

