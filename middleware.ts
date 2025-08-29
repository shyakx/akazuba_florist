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
  
  console.log('🔒 Middleware check:', {
    pathname,
    isAuthenticated,
    isAdmin,
    hasToken: !!accessToken,
    userRole
  })
  
  // Handle auth routes (login, register) - ALWAYS allow access
  if (authRoutes.some(route => pathname.startsWith(route))) {
    console.log('✅ Allowing access to auth route:', pathname)
    return NextResponse.next()
  }
  
  // Handle admin routes - STRICT SECURITY
  if (adminRoutes.some(route => pathname.startsWith(route))) {
    console.log('🔐 Admin route access check:', pathname)
    
    if (!isAuthenticated) {
      console.log('❌ Not authenticated - redirecting to admin login')
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    
    if (!isAdmin) {
      console.log('❌ Not admin - redirecting to home')
      return NextResponse.redirect(new URL('/', request.url))
    }
    
    console.log('✅ Admin access granted')
    return NextResponse.next()
  }
  
  // Handle other protected routes
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      console.log('❌ Not authenticated - redirecting to login')
      return NextResponse.redirect(new URL('/login', request.url))
    }
    
    console.log('✅ Protected route access granted')
    return NextResponse.next()
  }
  
  // For all other routes, allow access
  console.log('✅ Public route access granted')
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
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
} 