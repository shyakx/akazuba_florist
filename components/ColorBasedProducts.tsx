'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useProducts } from '@/contexts/ProductsContext'
import ProductCard from './ProductCard'
import { realFlowerProducts } from '@/data/real-flowers'

// Color configuration
const colorConfig = [
  { 
    name: 'Red', 
    value: 'red', 
    bg: 'bg-red-50', 
    border: 'border-red-200', 
    text: 'text-red-800',
    accent: 'bg-red-500'
  },
  { 
    name: 'Pink', 
    value: 'pink', 
    bg: 'bg-pink-50', 
    border: 'border-pink-200', 
    text: 'text-pink-800',
    accent: 'bg-pink-500'
  },
  { 
    name: 'White', 
    value: 'white', 
    bg: 'bg-gray-50', 
    border: 'border-gray-200', 
    text: 'text-gray-800',
    accent: 'bg-gray-500'
  },
  { 
    name: 'Yellow', 
    value: 'yellow', 
    bg: 'bg-yellow-50', 
    border: 'border-yellow-200', 
    text: 'text-yellow-800',
    accent: 'bg-yellow-500'
  },
  { 
    name: 'Orange', 
    value: 'orange', 
    bg: 'bg-orange-50', 
    border: 'border-orange-200', 
    text: 'text-orange-800',
    accent: 'bg-orange-500'
  },
  { 
    name: 'Purple', 
    value: 'purple', 
    bg: 'bg-purple-50', 
    border: 'border-purple-200', 
    text: 'text-purple-800',
    accent: 'bg-purple-500'
  },
  { 
    name: 'Mixed', 
    value: 'mixed', 
    bg: 'bg-gradient-to-r from-pink-50 to-purple-50', 
    border: 'border-purple-200', 
    text: 'text-purple-800',
    accent: 'bg-gradient-to-r from-pink-500 to-purple-500'
  }
]

const ColorBasedProducts = () => {
  const { state } = useProducts()
  const { products, isLoading } = state

  // Fallback data in case context fails
  const fallbackProducts = realFlowerProducts.map((product, index) => ({
    ...product,
    id: index + 1,
    featured: index < 8
  }))

  // Use products from context or fallback
  const displayProducts = products.length > 0 ? products : fallbackProducts

  // Group products by color
  const productsByColor = colorConfig.map(color => ({
    ...color,
    products: displayProducts.filter(product => product.color === color.value)
  })).filter(colorGroup => colorGroup.products.length > 0)

  // Show loading state
  if (isLoading) {
    return (
      <section className="py-8 sm:py-12 lg:py-16 bg-white">
        <div className="container-responsive">
          <div className="container-max">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
                Our Flower Collection
              </h2>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-4">
                Loading beautiful flowers organized by color...
              </p>
            </div>
            <div className="space-y-8">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded mb-4 w-1/4"></div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {[...Array(4)].map((_, productIndex) => (
                      <div key={productIndex}>
                        <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-white">
      <div className="container-responsive">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
              Our Flower Collection
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Discover our beautiful collection of flowers, carefully organized by color to help you find the perfect blooms
            </p>
          </motion.div>

          <div className="space-y-12">
            {productsByColor.map((colorGroup, colorIndex) => (
              <motion.div
                key={colorGroup.value}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: colorIndex * 0.1 }}
                className={`rounded-2xl p-6 ${colorGroup.bg} ${colorGroup.border} border-2`}
              >
                {/* Color Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${colorGroup.accent}`}></div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                      {colorGroup.name} Flowers
                    </h3>
                    <span className="bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-600">
                      {colorGroup.products.length} products
                    </span>
                  </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {colorGroup.products.map((product, productIndex) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: productIndex * 0.05 }}
                    >
                      <ProductCard 
                        product={product}
                        showRating={true}
                      />
                    </motion.div>
                  ))}
                </div>

                                 {/* Show More Button if more than 8 products */}
                 {colorGroup.products.length > 8 && (
                   <motion.div
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.6, delay: 0.3 }}
                     className="text-center mt-6"
                   >
                     <a 
                       href={`/products?color=${colorGroup.value}`}
                       className={`inline-block text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity font-medium ${colorGroup.accent}`}
                     >
                       View All {colorGroup.name} Flowers
                     </a>
                   </motion.div>
                 )}
              </motion.div>
            ))}
          </div>

          {/* Summary Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-12"
          >
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-6 border-2 border-pink-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Complete Collection Summary
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="font-bold text-pink-600">{displayProducts.length}</div>
                  <div className="text-gray-600">Total Flowers</div>
                </div>
                <div>
                  <div className="font-bold text-pink-600">{productsByColor.length}</div>
                  <div className="text-gray-600">Color Categories</div>
                </div>
                <div>
                  <div className="font-bold text-pink-600">
                    {displayProducts.filter(p => p.featured).length}
                  </div>
                  <div className="text-gray-600">Featured</div>
                </div>
                <div>
                  <div className="font-bold text-pink-600">
                    {Math.max(...productsByColor.map(c => c.products.length))}
                  </div>
                  <div className="text-gray-600">Most in Category</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default ColorBasedProducts
