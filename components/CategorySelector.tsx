'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Flower, Sparkles, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const CategorySelector = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-green-50 via-pink-50 to-purple-50">
      <div className="container-responsive">
        <div className="container-max">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
              Choose Your Category
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our beautiful flowers or discover luxury fragrances
            </p>
          </motion.div>

          {/* Category Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Flowers Category */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="group"
            >
              <Link href="/category/flowers" className="block">
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-green-100 hover:border-green-300">
                  {/* Image Section */}
                  <div className="relative h-64 bg-gradient-to-br from-green-400 to-green-600 overflow-hidden">
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Flower className="w-24 h-24 text-white/90 group-hover:text-white transition-all duration-300" />
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3">
                        <h3 className="text-xl font-bold text-gray-800">Fresh Flowers</h3>
                        <p className="text-sm text-gray-600">Beautiful arrangements for every occasion</p>
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold text-gray-800">Flowers</h3>
                      <ArrowRight className="w-6 h-6 text-green-600 group-hover:translate-x-1 transition-transform duration-200" />
                    </div>
                    
                    <div className="space-y-3 text-gray-600">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Fresh cut flowers</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Beautiful bouquets</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Same-day delivery</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Custom arrangements</span>
                      </div>
                    </div>

                    <div className="mt-6">
                      <div className="bg-green-50 text-green-800 px-4 py-2 rounded-lg text-sm font-medium">
                        Starting from RWF 15,000
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Perfumes Category */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
              className="group"
            >
              <Link href="/category/perfumes" className="block">
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-purple-100 hover:border-purple-300">
                  {/* Image Section */}
                  <div className="relative h-64 bg-gradient-to-br from-purple-400 to-pink-600 overflow-hidden">
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="w-24 h-24 text-white/90 group-hover:text-white transition-all duration-300" />
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3">
                        <h3 className="text-xl font-bold text-gray-800">Luxury Fragrances</h3>
                        <p className="text-sm text-gray-600">Premium perfumes from world-renowned brands</p>
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold text-gray-800">Perfumes</h3>
                      <ArrowRight className="w-6 h-6 text-purple-600 group-hover:translate-x-1 transition-transform duration-200" />
                    </div>
                    
                    <div className="space-y-3 text-gray-600">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span>Luxury brands</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span>Men, Women & Unisex</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span>Authentic products</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span>Expert consultation</span>
                      </div>
                    </div>

                    <div className="mt-6">
                      <div className="bg-purple-50 text-purple-800 px-4 py-2 rounded-lg text-sm font-medium">
                        Starting from RWF 125,000
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-12"
          >
            <p className="text-gray-600 mb-4">
              Can't decide? Browse our complete collection
            </p>
            <Link 
              href="/products"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-purple-500 text-white px-8 py-3 rounded-lg hover:from-green-600 hover:to-purple-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
            >
              View All Products
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default CategorySelector
