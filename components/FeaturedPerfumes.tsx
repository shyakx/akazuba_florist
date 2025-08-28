'use client'

import { motion } from 'framer-motion'
import { useProducts } from '@/contexts/ProductsContext'
import PerfumeCard from './PerfumeCard'

const FeaturedPerfumes = () => {
  const { getFeaturedByCategory } = useProducts()
  const featuredPerfumes = getFeaturedByCategory('perfumes')

  // Show loading state
  if (featuredPerfumes.length === 0) {
    return null // Don't show section if no featured perfumes
  }

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container-responsive">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
              Featured Perfumes
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Discover our collection of luxury fragrances from world-renowned brands
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {featuredPerfumes.slice(0, 8).map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <PerfumeCard 
                  product={product}
                  showRating={true}
                />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-12"
          >
            <a 
              href="/category/perfumes"
              className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
            >
              View All Perfumes
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default FeaturedPerfumes
