import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession()
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Mock dashboard data - replace with actual database queries
    const dashboardData = {
      stats: {
        totalProducts: 24,
        totalOrders: 156,
        totalRevenue: 8750000,
        totalCustomers: 89
      },
      recentOrders: [
        {
          id: 1,
          orderNumber: 'ORD-001',
          customerName: 'John Doe',
          total: 25000,
          status: 'pending',
          createdAt: '2025-01-03T10:00:00Z'
        },
        {
          id: 2,
          orderNumber: 'ORD-002',
          customerName: 'Jane Smith',
          total: 80000,
          status: 'completed',
          createdAt: '2025-01-02T15:30:00Z'
        },
        {
          id: 3,
          orderNumber: 'ORD-003',
          customerName: 'Robert Johnson',
          total: 150000,
          status: 'processing',
          createdAt: '2025-01-01T12:00:00Z'
        }
      ],
      topProducts: [
        {
          id: 1,
          name: 'Red Rose Bouquet',
          sales: 45,
          revenue: 1125000
        },
        {
          id: 2,
          name: 'Lavender Perfume',
          sales: 32,
          revenue: 1440000
        },
        {
          id: 3,
          name: 'Gift Basket',
          sales: 28,
          revenue: 980000
        }
      ],
      recentActivity: [
        {
          id: 1,
          type: 'order_created',
          message: 'New order ORD-001 received from John Doe',
          timestamp: '2025-01-03T10:00:00Z'
        },
        {
          id: 2,
          type: 'product_updated',
          message: 'Product "Red Rose Bouquet" stock updated',
          timestamp: '2025-01-03T09:30:00Z'
        },
        {
          id: 3,
          type: 'order_completed',
          message: 'Order ORD-002 completed successfully',
          timestamp: '2025-01-03T09:00:00Z'
        }
      ]
    }

    return NextResponse.json(dashboardData)
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
