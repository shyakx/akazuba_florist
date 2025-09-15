'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/RealAuthContext'
import { 
  Home, Package, ShoppingCart, Users, Settings, 
  LogOut, Menu, X, Plus, Eye, Flower, ChevronDown,
  User, Shield, Upload
} from 'lucide-react'

const AdminNavbar = () => {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false)

  const handleLogout = () => {
    logout()
  }

  const isActive = (path: string) => {
    if (path === '/admin') {
      return pathname === '/admin'
    }
    return pathname.startsWith(path)
  }

  const navItems = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: Home
    },
    {
      name: 'Products',
      href: '/admin/products',
      icon: Package,
      hasDropdown: true,
      dropdownItems: [
        { name: 'All Products', href: '/admin/products', icon: Eye },
        { name: 'Add Product', href: '/admin/products/new', icon: Plus },
        { name: 'Import Products', href: '/admin/import', icon: Upload }
      ]
    },
    {
      name: 'Orders',
      href: '/admin/orders',
      icon: ShoppingCart
    },
    {
      name: 'Customers',
      href: '/admin/customers',
      icon: Users
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: Settings
    }
  ]

  return (
    <>
      {/* Desktop Navbar */}
      <nav>
        <div>
          <div>
            {/* Logo and Brand */}
            <div>
              <Link href="/admin">
                <div>
                  <Flower />
                </div>
                <div>
                  <span>
                    Admin Panel
                  </span>
                  <div>Management Console</div>
                </div>
              </Link>
            </div>

            {/* Navigation Items */}
            <div>
              {navItems.map((item) => (
                <div key={item.name}>
                  {item.hasDropdown ? (
                    <div>
                      <button
                        onClick={() => setIsProductsDropdownOpen(!isProductsDropdownOpen)}
                      >
                        <item.icon />
                        <span>{item.name}</span>
                        <ChevronDown />
                      </button>

                      {/* Dropdown Menu */}
                      {isProductsDropdownOpen && (
                        <div>
                          <div>
                            {item.dropdownItems.map((dropdownItem) => (
                              <Link
                                key={dropdownItem.name}
                                href={dropdownItem.href}
                                onClick={() => setIsProductsDropdownOpen(false)}
                              >
                                <dropdownItem.icon />
                                <span>{dropdownItem.name}</span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                    >
                      <item.icon />
                      <span>{item.name}</span>
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* User Menu */}
            <div>
              <div>
                <User />
              </div>
              <div>
                <div>
                  {user?.email || 'Admin User'}
                </div>
                <div>
                  <Shield />
                  <span>Administrator</span>
                </div>
              </div>
              <button
                onClick={handleLogout}
              >
                <LogOut />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Button */}
      <div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div>
          <div>
            <div>
              <Link href="/admin">
                <div>
                  <Flower />
                </div>
                <div>
                  <span>Admin Panel</span>
                  <div>Management Console</div>
                </div>
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X />
              </button>
            </div>

            <nav>
              {navItems.map((item) => (
                <div key={item.name}>
                  {item.hasDropdown ? (
                    <div>
                      <button
                        onClick={() => setIsProductsDropdownOpen(!isProductsDropdownOpen)}
                      >
                        <item.icon />
                        <span>{item.name}</span>
                        <ChevronDown />
                      </button>

                      {isProductsDropdownOpen && (
                        <div>
                          {item.dropdownItems.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.name}
                              href={dropdownItem.href}
                              onClick={() => {
                                setIsProductsDropdownOpen(false)
                                setIsMobileMenuOpen(false)
                              }}
                            >
                              <dropdownItem.icon />
                              <span>{dropdownItem.name}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <item.icon />
                      <span>{item.name}</span>
                    </Link>
                  )}
                </div>
              ))}

              <div>
                <button
                  onClick={handleLogout}
                >
                  <LogOut />
                  <span>Logout</span>
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  )
}

export default AdminNavbar
