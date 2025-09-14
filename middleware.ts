import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define protected routes
const protectedRoutes = [
  '/profile',
  '/wishlist'
]

// Define admin-only routes (require authentication AND admin role)
const adminRoutes = [
  '/admin'
]

// Define auth routes (login, register)
const authRoutes = [
  '/register',
  '/unified-login'
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Get tokens from cookies
  const accessToken = request.cookies.get('accessToken')?.value
  const userRole = request.cookies.get('userRole')?.value
  
  // Debug cookie reading
  if (pathname.startsWith('/admin')) {
    console.log('🍪 Middleware cookie debug:', {
      allCookies: request.cookies.getAll().map(c => ({ name: c.name, value: c.value.substring(0, 20) + '...' })),
      accessToken: accessToken ? accessToken.substring(0, 20) + '...' : 'null',
      userRole: userRole || 'null'
    })
  }

  // Check if user is authenticated with robust validation
  const isAuthenticated = !!accessToken
  const isAdmin = userRole === 'ADMIN'

  // Additional security checks - ensure token is valid format
  const hasValidToken = accessToken && 
    accessToken.trim() !== '' && 
    accessToken.includes('.') && // JWT format check
    accessToken.length > 10 // Minimum length check

  // Only log important middleware checks (not every request)
  if (pathname.startsWith('/admin')) {
    console.log('🔒 Admin route check:', {
      pathname,
      isAuthenticated,
      isAdmin,
      hasToken: !!accessToken,
      userRole,
      allCookies: request.cookies.getAll().map(c => ({ name: c.name, value: c.value.substring(0, 20) + '...' })),                                                                                             
      userAgent: request.headers.get('user-agent')?.substring(0, 50) + '...'
    })
  }

  // Handle auth routes (login, register) - ALWAYS allow access
  if (authRoutes.some(route => pathname.startsWith(route))) {
    // Don't log auth route access to reduce noise
    return NextResponse.next()
  }

  // Handle admin routes - STRICT SECURITY
  if (adminRoutes.some(route => pathname.startsWith(route))) {
    if (!hasValidToken) {
      console.log('❌ Admin access denied - no valid token')
      return NextResponse.redirect(new URL('/unified-login', request.url))
    }

    if (!isAdmin) {
      console.log('❌ Admin access denied - not admin role')
      return NextResponse.redirect(new URL('/', request.url))
    }

    console.log('✅ Admin access granted')
    return NextResponse.next()
  }

  // Handle other protected routes
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      console.log('❌ Protected route access denied - redirecting to login')
      return NextResponse.redirect(new URL('/unified-login', request.url))
    }
    
    return NextResponse.next()
  }

  // For all other routes (including home page), allow access
  // This ensures first-time users can access the home page without authentication
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (image files)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|public).*)',
  ],
}