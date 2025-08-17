import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define protected routes
const protectedRoutes = [
  '/admin',
  '/profile',
  '/orders',
  '/wishlist'
]

// Define admin-only routes
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
  
  // Handle auth routes (login, register)
  if (authRoutes.some(route => pathname.startsWith(route))) {
    // If user is already authenticated, redirect appropriately
    if (isAuthenticated) {
      if (pathname.startsWith('/admin/login')) {
        // Admin is logged in, redirect to admin dashboard
        return NextResponse.redirect(new URL('/admin', request.url))
      } else {
        // Customer is logged in, redirect to home
        return NextResponse.redirect(new URL('/', request.url))
      }
    }
    // Allow access to auth routes for unauthenticated users
    return NextResponse.next()
  }
  
  // Handle admin routes
  if (adminRoutes.some(route => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      // Not authenticated, redirect to admin login
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    
    if (!isAdmin) {
      // Not admin, redirect to home
      return NextResponse.redirect(new URL('/', request.url))
    }
    
    // Admin is authenticated, allow access
    return NextResponse.next()
  }
  
  // Handle other protected routes
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      // Not authenticated, redirect to login
      return NextResponse.redirect(new URL('/login', request.url))
    }
    
    // User is authenticated, allow access
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
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
} 