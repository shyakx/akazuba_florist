'use client'

// Cache busting timestamp: 2025-08-17T23:00:00Z - FORCE REFRESH
// Unique ID: nav-fix-001
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingCart, User, Search, Menu, X, Heart, Crown, Flower, LogOut, Settings, Package, ChevronDown, Phone, MapPin, CheckCircle, Instagram } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/RealAuthContext'
import { useWishlist } from '@/contexts/WishlistContext'
import { realFlowerProducts } from '@/data/real-flowers'
import { User as UserType } from '@/lib/auth-api'
import { useRouter } from 'next/navigation'

// Navigation item type
interface NavigationItem {
  name: string
  href: string
}

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const [showWelcomeNotification, setShowWelcomeNotification] = useState(false)
  const [hasShownWelcome, setHasShownWelcome] = useState(false)
  
  const { state } = useCart()
  const { user, isAuthenticated, logout } = useAuth()
  const { itemCount: wishlistCount } = useWishlist()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Show welcome notification when user logs in
  useEffect(() => {
    if (isAuthenticated && user && !hasShownWelcome) {
      setShowWelcomeNotification(true)
      setHasShownWelcome(true)
      
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setShowWelcomeNotification(false)
      }, 5000)
      
      return () => clearTimeout(timer)
    }
  }, [isAuthenticated, user, hasShownWelcome])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.user-dropdown')) {
        setIsUserDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Check if we're on an admin page
  const isAdminPage = pathname?.startsWith('/admin')

  // If on admin page, don't render the main website header
  if (isAdminPage) {
    return null
  }

  // Generate dynamic navigation based on real flower data
  const generateNavigation = (): NavigationItem[] => {
    // Extract unique flower types and colors
    const flowerTypes = Array.from(new Set(realFlowerProducts.map(product => product.type)))
    const flowerColors = Array.from(new Set(realFlowerProducts.map(product => product.color)))
    
    // Create navigation items
    const navigation: NavigationItem[] = [
      { name: 'Home', href: '/' },
    ]

    // Add flower types that have multiple products (2+ items)
    const typeCounts = flowerTypes.reduce((acc, type) => {
      acc[type] = realFlowerProducts.filter(p => p.type === type).length
      return acc
    }, {} as Record<string, number>)

    // Add types with 2+ products as main categories (limit to most important ones)
    const importantTypes = ['Rose', 'Tulip', 'Lily', 'Sunflower', 'Carnation', 'Peony', 'Orchid']
    Object.entries(typeCounts).forEach(([type, count]) => {
      if (count >= 2 && importantTypes.includes(type)) {
        navigation.push({
          name: type + 's', // Pluralize
          href: `/category/${type.toLowerCase()}s` // Pluralize URL too
        })
      }
    })

    // Add mixed bouquets if available (only once)
    const mixedProducts = realFlowerProducts.filter(p => p.color === 'mixed')
    if (mixedProducts.length > 0) {
      navigation.push({
        name: 'Bouquets',
        href: '/category/mixed'
      })
    }

    // Add a "Colors" category that will show all colors
    const colorProducts = flowerColors.filter(color => color !== 'mixed')
    if (colorProducts.length > 0) {
      navigation.push({
        name: 'Colors',
        href: '/category/colors'
      })
    }

    // Add Perfumes category
    navigation.push({
      name: 'Perfumes',
      href: '/category/perfumes'
    })

    // Add static pages
    navigation.push(
      { name: 'About', href: '/about' },
      { name: 'Contact', href: '/contact' }
    )

    return navigation
  }

  // Generate navigation and store it in a variable
  const navigation = generateNavigation()

  // Fallback navigation if no real flower data
  const fallbackNavigation: NavigationItem[] = [
    { name: 'Home', href: '/' },
    { name: 'Roses', href: '/category/roses' },
    { name: 'Tulips', href: '/category/tulips' },
    { name: 'Bouquets', href: '/category/mixed' },
    { name: 'Colors', href: '/category/colors' },
    { name: 'Perfumes', href: '/category/perfumes' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ]
  
  // Use fallback if no real flower data
  const finalNavigation = realFlowerProducts.length > 0 ? navigation : fallbackNavigation

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen)
  }

  const handleLogout = () => {
    logout()
    setIsUserDropdownOpen(false)
  }

  return (
    <>
      {/* Welcome Notification */}
      {showWelcomeNotification && (
        <div className="fixed top-4 right-4 z-[9999] animate-bounce-in">
          <div className="bg-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl border border-green-200 max-w-sm">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-lg">Welcome back!</h4>
                <p className="text-sm opacity-90">
                  Great to see you again, {user?.firstName || 'User'}! 🌸
                </p>
              </div>
              <button
                onClick={() => setShowWelcomeNotification(false)}
                className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Bar */}
      <div className="bg-emerald-600 text-white py-2">
        <div className="container-responsive">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+250 784 586 110</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Kigali, Rwanda</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="hidden sm:block">Free delivery in Kigali</span>
              <span className="hidden sm:block">•</span>
              <span className="hidden sm:block">Fresh flowers daily</span>
              <span className="hidden sm:block">•</span>
              <a 
                href="https://www.instagram.com/akazuba_florists?igsh=aXdsY203Y3Eza2x4" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 hover:text-pink-200 transition-colors duration-200"
              >
                <Instagram className="h-4 w-4" />
                <span className="hidden sm:block">@akazuba_florists</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100' 
          : 'bg-white'
      }`}>
        <div className="container-responsive">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-12 h-12 bg-pink-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                  <Flower className="h-7 w-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-yellow-900">★</span>
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 group-hover:text-pink-600 transition-all duration-300">
                  Akazuba Florist
                </h1>
                <p className="text-sm text-gray-600 -mt-1 font-medium">Premium Floral Arrangements</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1 nav-fix-001">
              {finalNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-4 py-2 text-gray-700 hover:text-pink-600 font-medium transition-all duration-200 relative group rounded-lg hover:bg-pink-50 nav-link-fixed"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-pink-500 group-hover:w-3/4 transition-all duration-300"></span>
                </Link>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2">
              {/* Search */}
              <button className="p-3 text-gray-600 hover:text-pink-600 hover:bg-pink-50 transition-all duration-200 rounded-xl relative group">
                <Search className="h-5 w-5" />
                <span className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                  Search Flowers
                </span>
              </button>

              {/* Wishlist */}
              <button 
                onClick={() => {
                  if (!isAuthenticated) {
                    router.push('/login')
                  } else {
                    router.push('/wishlist')
                  }
                }}
                className="relative p-3 text-gray-600 hover:text-red-500 hover:bg-red-50 transition-all duration-200 rounded-xl group"
              >
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold animate-pulse shadow-lg">
                    {wishlistCount}
                  </span>
                )}
                <span className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                  Wishlist ({wishlistCount})
                </span>
              </button>

              {/* Cart */}
              <button 
                onClick={() => {
                  if (!isAuthenticated) {
                    router.push('/login')
                  } else {
                    router.push('/cart')
                  }
                }}
                className="relative p-3 text-gray-600 hover:text-pink-600 hover:bg-pink-50 transition-all duration-200 rounded-xl group"
              >
                <ShoppingCart className="h-5 w-5" />
                {state.itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold animate-pulse shadow-lg">
                    {state.itemCount}
                  </span>
                )}
                <span className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                  Cart ({state.itemCount})
                </span>
              </button>

              {/* User Account Dropdown */}
              <div className="relative user-dropdown">
                {!isAuthenticated ? (
                  // Show only Sign In button for unauthenticated users
                  <Link
                    href="/login"
                    className="px-4 py-2 text-pink-600 hover:text-pink-700 hover:bg-pink-50 font-medium transition-all duration-200 rounded-xl border border-pink-200 hover:border-pink-300"
                  >
                    Sign In
                  </Link>
                ) : (
                  // Show dropdown for authenticated users
                  <button 
                    onClick={toggleUserDropdown}
                    className="p-3 text-gray-600 hover:text-pink-600 hover:bg-pink-50 transition-all duration-200 rounded-xl relative group flex items-center space-x-1"
                  >
                    <User className="h-5 w-5" />
                    <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                    <span className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                      My Account
                    </span>
                  </button>
                )}

                  {/* Dropdown Menu */}
                  {isUserDropdownOpen && isAuthenticated && (
                    <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 py-4 z-50 transform transition-all duration-200 ease-out animate-in slide-in-from-top-2">
                      {user ? (
                        <>
                          {/* User Profile Header */}
                          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 rounded-t-2xl">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center shadow-lg">
                                <span className="text-white font-bold text-lg">
                                  {(user as UserType).firstName?.charAt(0) || (user as UserType).email?.charAt(0) || 'U'}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate">
                                  Welcome back, {(user as UserType).firstName || (user as UserType).email}
                                </p>
                                <p className="text-xs text-gray-500 mt-1 flex items-center">
                                  {(user as UserType).role === 'ADMIN' ? (
                                    <>
                                      <Crown className="h-3 w-3 text-yellow-500 mr-1" />
                                      Administrator
                                    </>
                                  ) : (
                                    <>
                                      <User className="h-3 w-3 text-blue-500 mr-1" />
                                      Customer
                                    </>
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Quick Stats */}
                          <div className="px-6 py-3 bg-gray-50">
                            <div className="grid grid-cols-3 gap-3 text-center">
                              <div className="bg-white rounded-lg p-2 shadow-sm">
                                <div className="text-lg font-bold text-pink-600">{state.itemCount}</div>
                                <div className="text-xs text-gray-500">Cart</div>
                              </div>
                              <div className="bg-white rounded-lg p-2 shadow-sm">
                                <div className="text-lg font-bold text-red-500">{wishlistCount}</div>
                                <div className="text-xs text-gray-500">Wishlist</div>
                              </div>
                              <div className="bg-white rounded-lg p-2 shadow-sm">
                                <div className="text-lg font-bold text-green-600">0</div>
                                <div className="text-xs text-gray-500">Orders</div>
                              </div>
                            </div>
                          </div>

                          {/* Menu Items for Logged In User */}
                          <div className="py-2">
                            {(user as UserType).role === 'ADMIN' ? (
                              <Link 
                                href="/admin"
                                className="flex items-center space-x-3 px-6 py-3 text-sm text-gray-700 hover:bg-yellow-50 transition-all duration-200 group"
                                onClick={() => setIsUserDropdownOpen(false)}
                              >
                                <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                                  <Crown className="h-4 w-4 text-white" />
                                </div>
                                <div>
                                  <span className="font-medium">Admin Dashboard</span>
                                  <p className="text-xs text-gray-500">Manage your store</p>
                                </div>
                              </Link>
                            ) : (
                              <>
                                <Link 
                                  href="/dashboard"
                                  className="flex items-center space-x-3 px-6 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-all duration-200 group"
                                  onClick={() => setIsUserDropdownOpen(false)}
                                >
                                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                                    <User className="h-4 w-4 text-white" />
                                  </div>
                                  <div>
                                    <span className="font-medium">My Dashboard</span>
                                    <p className="text-xs text-gray-500">View orders & profile</p>
                                  </div>
                                </Link>
                                <Link 
                                  href="/orders"
                                  className="flex items-center space-x-3 px-6 py-3 text-sm text-gray-700 hover:bg-green-50 transition-all duration-200 group"
                                  onClick={() => setIsUserDropdownOpen(false)}
                                >
                                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                                    <Package className="h-4 w-4 text-white" />
                                  </div>
                                  <div>
                                    <span className="font-medium">My Orders</span>
                                    <p className="text-xs text-gray-500">Track your deliveries</p>
                                  </div>
                                </Link>
                              </>
                            )}
                            
                            <div className="border-t border-gray-100 my-2 mx-6"></div>
                            
                            <Link 
                              href="/profile"
                              className="flex items-center space-x-3 px-6 py-3 text-sm text-gray-700 hover:bg-purple-50 transition-all duration-200 group"
                              onClick={() => setIsUserDropdownOpen(false)}
                            >
                              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                                <Settings className="h-4 w-4 text-white" />
                              </div>
                              <div>
                                <span className="font-medium">Settings</span>
                                <p className="text-xs text-gray-500">Manage your account</p>
                              </div>
                            </Link>
                            
                            <div className="border-t border-gray-100 my-2 mx-6"></div>
                            
                            <button
                              onClick={handleLogout}
                              className="flex items-center space-x-3 px-6 py-3 text-sm text-red-600 hover:bg-red-50 transition-all duration-200 w-full text-left group"
                            >
                              <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                                <LogOut className="h-4 w-4 text-white" />
                              </div>
                              <div>
                                <span className="font-medium">Sign Out</span>
                                <p className="text-xs text-gray-500">Logout from your account</p>
                              </div>
                            </button>
                          </div>
                        </>
                      ) : null}
                    </div>
                  )}
                </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-3 text-gray-600 hover:text-pink-600 hover:bg-pink-50 transition-all duration-200 rounded-xl"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg rounded-b-2xl">
              <nav className="px-4 py-6 space-y-2">
                {finalNavigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block px-4 py-3 text-gray-700 hover:text-pink-600 hover:bg-pink-50 font-medium transition-all duration-200 rounded-xl"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                
                {/* Mobile User Actions */}
                <div className="border-t border-gray-100 pt-4 mt-4 space-y-2">
                  {/* Cart and Wishlist for all users */}
                  <button
                    onClick={() => {
                      setIsMenuOpen(false)
                      if (!isAuthenticated) {
                        router.push('/login')
                      } else {
                        router.push('/cart')
                      }
                    }}
                    className="block px-4 py-3 text-gray-700 hover:text-pink-600 hover:bg-pink-50 font-medium transition-all duration-200 rounded-xl w-full text-left"
                  >
                    Cart ({state.itemCount})
                  </button>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false)
                      if (!isAuthenticated) {
                        router.push('/login')
                      } else {
                        router.push('/wishlist')
                      }
                    }}
                    className="block px-4 py-3 text-gray-700 hover:text-pink-600 hover:bg-pink-50 font-medium transition-all duration-200 rounded-xl w-full text-left"
                  >
                    Wishlist ({wishlistCount})
                  </button>
                  
                  {isAuthenticated && user ? (
                    <>
                      <div className="px-4 py-3 bg-gray-50 rounded-xl">
                        <p className="text-sm font-semibold text-gray-900">
                          Welcome, {(user as UserType).firstName || (user as UserType).email}
                        </p>
                      </div>
                      <Link
                        href="/profile"
                        className="block px-4 py-3 text-gray-700 hover:text-pink-600 hover:bg-pink-50 font-medium transition-all duration-200 rounded-xl"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        My Profile
                      </Link>
                      <Link
                        href="/orders"
                        className="block px-4 py-3 text-gray-700 hover:text-pink-600 hover:bg-pink-50 font-medium transition-all duration-200 rounded-xl"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        My Orders
                      </Link>
                      {(user as UserType).role === 'ADMIN' && (
                        <Link
                          href="/admin"
                          className="block px-4 py-3 text-pink-600 hover:text-pink-700 hover:bg-pink-50 font-medium transition-all duration-200 rounded-xl"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="block px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 font-medium transition-all duration-200 rounded-xl w-full text-left"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="block px-4 py-3 text-gray-700 hover:text-pink-600 hover:bg-pink-50 font-medium transition-all duration-200 rounded-xl"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Sign In
                      </Link>
                    </>
                  )}
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  )
}

export default Header 
