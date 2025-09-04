'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useProducts } from '@/contexts/ProductsContext'
import ProductCard from './ProductCard'
import { Flower } from 'lucide-react'
import { Product } from '@/types'

const FeaturedProducts = () => {
  const { products, getFeaturedProducts } = useProducts()
  const [featuredFlowers, setFeaturedFlowers] = useState<Product[]>([])

  // Update featured flowers when products are loaded
  useEffect(() => {
    if (products.length > 0) {
      const featured = getFeaturedProducts().filter(p => p.categoryName === 'Flowers')
      setFeaturedFlowers(featured)
    }
  }, [products, getFeaturedProducts])

  // Show loading state while products are loading
  if (products.length === 0) {
    return (
      <section className="py-12 sm:py-16">
        <div className="container-responsive">
          <div className="container-max">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Flower className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
                Featured Flowers
              </h2>
              <p className="text-lg text-gray-600">Loading products...</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (featuredFlowers.length === 0) {
    return (
      <section className="py-12 sm:py-16">
        <div className="container-responsive">
          <div className="container-max">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Flower className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
                Featured Flowers
              </h2>
              <p className="text-lg text-gray-600">No featured flowers available at the moment.</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 sm:py-16">
      <div className="container-responsive">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                <Flower className="w-8 h-8 text-emerald-600" />
              </div>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
              Featured Flowers
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our most popular flower arrangements and bouquets
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredFlowers.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <ProductCard 
                  product={product}
                />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-12"
          >
            <a 
              href="/category/flowers"
              className="inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-3 rounded-lg hover:bg-emerald-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
            >
              View All Flowers
              <Flower className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default FeaturedProducts 