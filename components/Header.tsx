'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, Heart, ShoppingCart, User, Menu, X, LogOut, Settings } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/RealAuthContext'
import { useWishlist } from '@/contexts/WishlistContext'
import { realFlowerProducts } from '@/data/real-flowers'

interface NavigationItem {
  name: string
  href: string
}

const Header = () => {
  const pathname = usePathname()
  const { state: cartState } = useCart()
  const { user, isAuthenticated, logout } = useAuth()
  const { items: wishlistItems } = useWishlist()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)

  // Generate dynamic navigation based on real flower data
  const generateNavigation = (): NavigationItem[] => {
    // Extract unique flower types and colors
    const flowerTypes = Array.from(new Set(realFlowerProducts.map(product => product.type)))
    const flowerColors = Array.from(new Set(realFlowerProducts.map(product => product.color)))
    
    // Create navigation items
    const navigation: NavigationItem[] = [
      { name: 'Home', href: '/' },
      { name: 'Products', href: '/products' }, // Updated to new clean page
      { name: 'Categories', href: '/categories' },
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

    // Add essential pages only
    navigation.push(
      { name: 'Contact', href: '/contact' }
    )

    return navigation
  }

  // Generate navigation and store it in a variable
  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' }, // Updated to new clean page
    { name: 'Categories', href: '/categories' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' }
  ]

  // Fallback navigation if no real flower data
  const fallbackNavigation: NavigationItem[] = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Categories', href: '/categories' },
    { name: 'Roses', href: '/category/roses' },
    { name: 'Tulips', href: '/category/tulips' },
    { name: 'Bouquets', href: '/category/mixed' },
    { name: 'Colors', href: '/category/colors' },
    { name: 'Perfumes', href: '/category/perfumes' },
    { name: 'Contact', href: '/contact' },
  ]

  // Use fallback navigation if dynamic navigation is empty
  const finalNavigation = navigation.length > 0 ? navigation : fallbackNavigation

  // Check if a navigation item is active
  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.profile-dropdown')) {
        setIsProfileDropdownOpen(false)
      }
    }

    if (isProfileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isProfileDropdownOpen])

  const cartItemCount = cartState.items.length // Show unique items, not total quantity

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-sm'
    }`}>
      {/* Top Info Bar - Shopping Focused */}
      <div className="bg-green-600 text-white py-2 px-4 text-sm">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <a href="tel:+250784586110" className="flex items-center space-x-1 hover:text-green-200 transition-colors">
              <span>📞</span>
              <span>+250 784 586 110</span>
            </a>
            <a href="https://wa.me/250784586110" className="flex items-center space-x-1 hover:text-green-200 transition-colors">
              <span>WhatsApp</span>
            </a>
            <a href="https://www.instagram.com/akazuba_florists?igsh=aXdsY203Y3Eza2x4" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1 hover:text-green-200 transition-colors">
              <span>@akazuba_florists</span>
            </a>
          </div>
          <div className="hidden sm:flex items-center space-x-4">
            <span>🚚 Free delivery everywhere</span>
            <span>🌸 Fresh flowers daily</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative">
              <img 
                src="/images/logo.png" 
                alt="Akazuba Florist Logo" 
                className="w-10 h-10 object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Akazuba Florist</h1>
              <p className="text-xs text-gray-600">Premium Floral Arrangements</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {finalNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`transition-colors duration-200 font-medium ${
                  isActive(item.href)
                    ? 'text-pink-600 border-b-2 border-pink-600 pb-1'
                    : 'text-gray-700 hover:text-pink-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <button className="p-2 text-gray-600 hover:text-pink-600 transition-colors duration-200">
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <Link href="/wishlist" className="relative p-2 text-gray-600 hover:text-pink-600 transition-colors duration-200">
              <Heart className="w-5 h-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link href="/cart" className="relative p-2 text-gray-600 hover:text-pink-600 transition-colors duration-200">
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* User Account */}
            {isAuthenticated ? (
              <div className="relative profile-dropdown">
                <button 
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="p-2 text-gray-600 hover:text-pink-600 transition-colors duration-200"
                >
                  <User className="w-5 h-5" />
                </button>
                
                {/* Profile Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="py-2">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : user?.email}
                        </p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                      
                      <Link
                        href="/profile"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                      >
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </Link>
                      

                      
                      <button
                        onClick={() => {
                          logout()
                          setIsProfileDropdownOpen(false)
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/unified-login"
                className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors duration-200 text-sm font-medium"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-pink-600 transition-colors duration-200"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <nav className="container mx-auto px-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              {finalNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`transition-colors duration-200 font-medium py-2 px-3 rounded-lg ${
                    isActive(item.href)
                      ? 'text-pink-600 bg-pink-50 border border-pink-200'
                      : 'text-gray-700 hover:text-pink-600 hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header 
