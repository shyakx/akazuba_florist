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

    // Get audit statistics
    const stats = auditLogger.getStats()

    return createSuccessResponse(stats, 'Audit statistics retrieved successfully')

  } catch (error) {
    console.error('Error fetching audit statistics:', error)
    return ErrorResponses.internalError('Failed to fetch audit statistics')
  }
}
