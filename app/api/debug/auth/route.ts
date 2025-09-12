import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Debug auth endpoint called')
    console.log('🔑 Auth header:', request.headers.get('authorization'))
    console.log('🍪 Cookies:', request.headers.get('cookie'))
    console.log('🌐 Host:', request.headers.get('host'))
    console.log('📍 Origin:', request.headers.get('origin'))
    console.log('🔗 Referer:', request.headers.get('referer'))
    
    const session = await getServerSession(request)
    console.log('👤 Session result:', session)
    
    // Extract token from headers
    const authHeader = request.headers.get('authorization')
    let tokenFromHeader = null
    if (authHeader && authHeader.startsWith('Bearer ')) {
      tokenFromHeader = authHeader.substring(7)
    }
    
    // Extract token from cookies
    const cookies = request.headers.get('cookie')
    let tokenFromCookie = null
    if (cookies) {
      const cookieMatch = cookies.match(/accessToken=([^;]+)/)
      if (cookieMatch) {
        tokenFromCookie = cookieMatch[1]
      }
    }
    
    return NextResponse.json({
      success: true,
      debug: {
        hasAuthHeader: !!authHeader,
        hasTokenFromHeader: !!tokenFromHeader,
        hasTokenFromCookie: !!tokenFromCookie,
        session: session ? {
          user: session.user,
          hasToken: !!session.token
        } : null,
        headers: {
          authorization: authHeader,
          cookie: cookies,
          host: request.headers.get('host'),
          origin: request.headers.get('origin'),
          referer: request.headers.get('referer')
        }
      }
    })
  } catch (error) {
    console.error('❌ Debug auth error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
