'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingCart, User, Search, Menu, X, Heart, Crown, Flower, LogOut, Settings, Package, ChevronDown, Phone, MapPin } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import { realFlowerProducts } from '@/data/real-flowers'
import { User as UserType } from '@/lib/api'

// Navigation item type
interface NavigationItem {
  name: string
  href: string
}

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  
  const { state } = useCart()
  const { user, isAuthenticated, logout } = useAuth()
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
          href: `/category/${type.toLowerCase()}`
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
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                  <Flower className="h-7 w-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-yellow-900">★</span>
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent group-hover:from-pink-600 group-hover:to-rose-600 transition-all duration-300">
                  Akazuba Florist
                </h1>
                <p className="text-sm text-gray-600 -mt-1 font-medium">Premium Floral Arrangements</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {finalNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-4 py-2 text-gray-700 hover:text-pink-600 font-medium transition-all duration-200 relative group rounded-lg hover:bg-pink-50"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-rose-500 group-hover:w-3/4 transition-all duration-300"></span>
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
              <button className="p-3 text-gray-600 hover:text-red-500 hover:bg-red-50 transition-all duration-200 rounded-xl relative group">
                <Heart className="h-5 w-5" />
                <span className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                  Wishlist
                </span>
              </button>

              {/* Cart */}
              <Link href="/cart" className="relative p-3 text-gray-600 hover:text-pink-600 hover:bg-pink-50 transition-all duration-200 rounded-xl group">
                <ShoppingCart className="h-5 w-5" />
                {state.itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold animate-pulse shadow-lg">
                    {state.itemCount}
                  </span>
                )}
                <span className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                  Cart ({state.itemCount})
                </span>
              </Link>

              {/* User Account Dropdown */}
              <div className="relative user-dropdown">
                <button 
                  onClick={toggleUserDropdown}
                  className="p-3 text-gray-600 hover:text-pink-600 hover:bg-pink-50 transition-all duration-200 rounded-xl relative group flex items-center space-x-1"
                >
                  <User className="h-5 w-5" />
                  <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                  <span className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                    {isAuthenticated ? 'My Account' : 'Sign In'}
                  </span>
                </button>

                  {/* Dropdown Menu */}
                  {isUserDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 z-50">
                      {isAuthenticated && user ? (
                        <>
                          {/* Logged In User */}
                          <div className="px-4 py-3 border-b border-gray-100">
                            <p className="text-sm font-semibold text-gray-900">
                              Welcome back, {(user as UserType).firstName || (user as UserType).email}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {(user as UserType).role === 'ADMIN' ? 'Administrator' : 'Customer'}
                            </p>
                          </div>

                          {/* Menu Items for Logged In User */}
                          <div className="py-2">
                            {(user as UserType).role === 'ADMIN' ? (
                              <Link 
                                href="/admin"
                                className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-pink-50 transition-colors"
                                onClick={() => setIsUserDropdownOpen(false)}
                              >
                                <Crown className="h-4 w-4 text-yellow-500" />
                                <span>Admin Dashboard</span>
                              </Link>
                            ) : (
                              <>
                                <Link 
                                  href="/profile"
                                  className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-pink-50 transition-colors"
                                  onClick={() => setIsUserDropdownOpen(false)}
                                >
                                  <User className="h-4 w-4" />
                                  <span>My Profile</span>
                                </Link>
                                <Link 
                                  href="/orders"
                                  className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-pink-50 transition-colors"
                                  onClick={() => setIsUserDropdownOpen(false)}
                                >
                                  <Package className="h-4 w-4" />
                                  <span>My Orders</span>
                                </Link>
                              </>
                            )}
                            <div className="border-t border-gray-100 my-2"></div>
                            <button
                              onClick={handleLogout}
                              className="flex items-center space-x-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                            >
                              <LogOut className="h-4 w-4" />
                              <span>Sign Out</span>
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          {/* Guest User Options */}
                          <div className="px-4 py-3 border-b border-gray-100">
                            <p className="text-sm font-semibold text-gray-900">Welcome to Akazuba Florist</p>
                            <p className="text-xs text-gray-500 mt-1">Sign in to access your account</p>
                          </div>

                          {/* Menu Items for Guest */}
                          <div className="py-2">
                            <Link 
                              href="/login"
                              className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-pink-50 transition-colors"
                              onClick={() => setIsUserDropdownOpen(false)}
                            >
                              <User className="h-4 w-4" />
                              <span>Sign In</span>
                            </Link>
                            <Link 
                              href="/register"
                              className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-pink-50 transition-colors"
                              onClick={() => setIsUserDropdownOpen(false)}
                            >
                              <User className="h-4 w-4" />
                              <span>Create Account</span>
                            </Link>
                            <div className="border-t border-gray-100 my-2"></div>
                            <Link 
                              href="/admin/login"
                              className="flex items-center space-x-3 px-4 py-3 text-sm text-pink-600 hover:bg-pink-50 transition-colors"
                              onClick={() => setIsUserDropdownOpen(false)}
                            >
                              <Crown className="h-4 w-4" />
                              <span>Admin Panel</span>
                            </Link>
                            <Link 
                              href="/orders"
                              className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-pink-50 transition-colors"
                              onClick={() => setIsUserDropdownOpen(false)}
                            >
                              <Package className="h-4 w-4" />
                              <span>Track Orders</span>
                            </Link>
                            <Link 
                              href="/contact"
                              className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-pink-50 transition-colors"
                              onClick={() => setIsUserDropdownOpen(false)}
                            >
                              <Settings className="h-4 w-4" />
                              <span>Help & Support</span>
                            </Link>
                          </div>
                        </>
                      )}
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
                      <Link
                        href="/register"
                        className="block px-4 py-3 text-gray-700 hover:text-pink-600 hover:bg-pink-50 font-medium transition-all duration-200 rounded-xl"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Create Account
                      </Link>
                      <Link
                        href="/admin/login"
                        className="block px-4 py-3 text-pink-600 hover:text-pink-700 hover:bg-pink-50 font-medium transition-all duration-200 rounded-xl"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Admin Panel
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