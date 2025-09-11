import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
import { createSuccessResponse, ErrorResponses } from '@/lib/errorHandler'

export const dynamic = 'force-dynamic'
import { auditLogger } from '@/lib/auditLogger'

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(request)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return ErrorResponses.unauthorized('Admin access required')
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const action = searchParams.get('action')
    const resource = searchParams.get('resource')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const success = searchParams.get('success')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    // Build filter object
    const filter = {
      ...(userId && { userId }),
      ...(action && { action }),
      ...(resource && { resource }),
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
      ...(success !== null && { success: success === 'true' }),
      page,
      limit
    }

    // Get audit logs
    const result = auditLogger.getLogs(filter)

    return createSuccessResponse(result.logs, 'Audit logs retrieved successfully', {
      page: result.page,
      limit: result.limit,
      total: result.total,
      pages: result.pages
    })

  } catch (error) {
    console.error('Error fetching audit logs:', error)
    return ErrorResponses.internalError('Failed to fetch audit logs')
  }
}
