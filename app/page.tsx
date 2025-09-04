'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Flower, Sparkles } from 'lucide-react'
import { useProducts } from '@/contexts/ProductsContext'
import { flowerCategories, perfumeCategories } from '@/data/categories'
import Footer from '@/components/Footer'
import { useAuth } from '@/contexts/RealAuthContext'

export default function HomePage() {
  const { products, isLoading } = useProducts()
  const { isAuthenticated, logout, forceClearAuth, resetToFirstTime } = useAuth()

  // Get featured products
  const featuredProducts = products?.filter(p => p.isFeatured).slice(0, 4) || []
  
  // Get counts
  const flowerCount = products?.filter(p => p.categoryName === 'Flowers').length || 0
  const perfumeCount = products?.filter(p => p.categoryName === 'Perfumes').length || 0

  return (
    <div className="min-h-screen bg-white">
      {/* Development Tools - Only show in development */}
      {process.env.NODE_ENV === 'development' && isAuthenticated && (
        <div className="fixed top-4 right-4 z-50 bg-yellow-100 border border-yellow-300 rounded-lg p-3 shadow-lg">
          <div className="text-xs text-yellow-800 mb-2">🧪 Dev Tools</div>
          <div className="space-y-2">
            <button
              onClick={logout}
              className="block w-full bg-red-500 text-white text-xs px-3 py-1 rounded hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
            <button
              onClick={forceClearAuth}
              className="block w-full bg-orange-500 text-white text-xs px-3 py-1 rounded hover:bg-orange-600 transition-colors"
            >
              Force Clear Auth
            </button>
            <button
              onClick={resetToFirstTime}
              className="block w-full bg-blue-500 text-white text-xs px-3 py-1 rounded hover:bg-blue-600 transition-colors"
            >
              Reset to First Time
            </button>
          </div>
        </div>
      )}



      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-pink-50 to-green-50">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Beautiful Flowers &{' '}
            <span className="text-pink-600">Exquisite Perfumes</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover our carefully curated collection for every occasion
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              Shop Now
              <ArrowRight className="inline ml-2 w-4 h-4" />
            </Link>
            <Link
              href="/categories"
              className="bg-white hover:bg-gray-50 text-gray-900 px-8 py-3 rounded-lg font-semibold transition-colors duration-200 border border-gray-200"
            >
              View Categories
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-pink-600 mb-2">{flowerCount}+</div>
              <div className="text-gray-600">Flowers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">{perfumeCount}+</div>
              <div className="text-gray-600">Perfumes</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">17</div>
              <div className="text-gray-600">Categories</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
              <p className="text-gray-600">Our most popular selections</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="relative h-40 bg-gray-100">
                    <Image
                      src={product.images[0] || '/images/placeholder-flower.jpg'}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  </div>
                  
                  <div className="p-4">
                    <div className="text-xs text-pink-600 font-medium mb-2">
                      {product.categoryName}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="text-lg font-bold text-gray-900 mb-3">
                      {new Intl.NumberFormat('en-RW', {
                        style: 'currency',
                        currency: 'RWF',
                        minimumFractionDigits: 0
                      }).format(product.salePrice || product.price)}
                    </div>
                    <Link
                      href={`/products?category=${product.categoryName.toLowerCase()}`}
                      className="block w-full bg-pink-600 hover:bg-pink-700 text-white text-center py-2 rounded text-sm font-medium transition-colors duration-200"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link
                href="/products"
                className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                View All Products
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-gray-600">Find exactly what you need</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Flowers */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-pink-100 rounded-full">
                  <Flower className="w-8 h-8 text-pink-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Flowers</h3>
                  <p className="text-gray-600">Beautiful arrangements</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mb-6">
                {flowerCategories.slice(0, 6).map((category) => (
                  <Link
                    key={category.id}
                    href={`/category/${category.id}`}
                    className="text-sm text-gray-600 hover:text-pink-600 transition-colors p-2 rounded hover:bg-pink-50"
                  >
                    {category.icon} {category.name}
                  </Link>
                ))}
              </div>
              
              <Link
                href="/categories"
                className="text-pink-600 hover:text-pink-700 font-medium"
              >
                View All Flower Categories →
              </Link>
            </div>
            
            {/* Perfumes */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-purple-100 rounded-full">
                  <Sparkles className="w-8 h-8 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Perfumes</h3>
                  <p className="text-gray-600">Exquisite fragrances</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mb-6">
                {perfumeCategories.slice(0, 6).map((category) => (
                  <Link
                    key={category.id}
                    href={`/category/${category.id}`}
                    className="text-sm text-gray-600 hover:text-purple-600 transition-colors p-2 rounded hover:bg-purple-50"
                  >
                    {category.icon} {category.name}
                  </Link>
                ))}
              </div>
              
              <Link
                href="/categories"
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                View All Perfume Categories →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-pink-50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Shop?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Explore our complete collection and find the perfect flowers and perfumes for your needs.
          </p>
          <Link
            href="/products"
            className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
          >
            Start Shopping
          </Link>
        </div>
      </section>
      
      <Footer />
    </div>
  )
} 