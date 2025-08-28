'use client'

import React from 'react'
import { motion } from 'framer-motion'
import CategorySelector from '@/components/CategorySelector'
import FeaturedProducts from '@/components/FeaturedProducts'
import FeaturedPerfumes from '@/components/FeaturedPerfumes'

const ProductsPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gray-800 text-white py-16 sm:py-20">
        <div className="container-responsive">
          <div className="container-max text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                Our Products
              </h1>
              <p className="text-xl sm:text-2xl text-gray-200 max-w-3xl mx-auto">
                Discover our complete collection of beautiful flowers and luxury fragrances
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Category Selector */}
      <CategorySelector />

      {/* Featured Flowers */}
      <section className="py-12 sm:py-16 bg-gradient-to-br from-green-50 to-green-100">
        <div className="container-responsive">
          <div className="container-max">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
                Featured Flowers
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Our most popular flower arrangements and bouquets
              </p>
            </motion.div>
            <FeaturedProducts />
          </div>
        </div>
      </section>

      {/* Featured Perfumes */}
      <section className="py-12 sm:py-16 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container-responsive">
          <div className="container-max">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
                Featured Perfumes
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Luxury fragrances from world-renowned brands
              </p>
            </motion.div>
            <FeaturedPerfumes />
          </div>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="py-12 bg-white">
        <div className="container-responsive">
          <div className="container-max">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-8">
                Quick Navigation
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <a 
                  href="/category/flowers"
                  className="block bg-green-50 hover:bg-green-100 border-2 border-green-200 hover:border-green-300 rounded-xl p-6 text-center transition-all duration-200 group"
                >
                  <div className="text-green-600 text-2xl mb-2">🌸</div>
                  <h4 className="font-semibold text-gray-800 mb-2">Browse Flowers</h4>
                  <p className="text-sm text-gray-600">View all flower arrangements</p>
                </a>
                <a 
                  href="/category/perfumes"
                  className="block bg-purple-50 hover:bg-purple-100 border-2 border-purple-200 hover:border-purple-300 rounded-xl p-6 text-center transition-all duration-200 group"
                >
                  <div className="text-purple-600 text-2xl mb-2">✨</div>
                  <h4 className="font-semibold text-gray-800 mb-2">Browse Perfumes</h4>
                  <p className="text-sm text-gray-600">View all luxury fragrances</p>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ProductsPage
