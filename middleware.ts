import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define protected routes
const protectedRoutes = [
  '/profile',
  '/orders',
  '/wishlist'
]

// Define admin-only routes (require authentication AND admin role)
const adminRoutes = [
  '/admin'
]

// Define auth routes (login, register)
const authRoutes = [
  '/login',
  '/register',
  '/admin/login'
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Get tokens from cookies
  const accessToken = request.cookies.get('accessToken')?.value
  const userRole = request.cookies.get('userRole')?.value
  
  // Check if user is authenticated
  const isAuthenticated = !!accessToken
  const isAdmin = userRole === 'ADMIN'
  
  // Only log important middleware checks (not every request)
  if (pathname.startsWith('/admin') || pathname.startsWith('/profile') || pathname.startsWith('/orders')) {
    console.log('🔒 Middleware check:', {
      pathname,
      isAuthenticated,
      isAdmin,
      hasToken: !!accessToken,
      userRole
    })
  }
  
  // Handle auth routes (login, register) - ALWAYS allow access
  if (authRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }
  
  // Handle admin routes - STRICT SECURITY
  if (adminRoutes.some(route => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      console.log('❌ Admin access denied - not authenticated')
      return NextResponse.redirect(new URL('/admin/login', request.url))
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
      return NextResponse.redirect(new URL('/login', request.url))
    }
    
    return NextResponse.next()
  }
  
  // For all other routes, allow access
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