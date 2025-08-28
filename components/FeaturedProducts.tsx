'use client'

import { motion } from 'framer-motion'
import { useProducts } from '@/contexts/ProductsContext'
import ProductCard from './ProductCard'
import { realFlowerProducts } from '@/data/real-flowers'

const FeaturedProducts = () => {
  const { state } = useProducts()
  const { products, isLoading } = state

  // Fallback data in case context fails
  const fallbackProducts = realFlowerProducts.slice(0, 8).map((product, index) => ({
    ...product,
    id: index + 1,
    featured: true
  }))



  // Show loading state
  if (isLoading) {
    return (
      <section className="py-8 sm:py-12 lg:py-16 bg-white">
        <div className="container-responsive">
          <div className="container-max">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
                Featured Flowers
              </h2>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-4">
                Loading beautiful flowers...
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Show products from backend or fallback data
  const displayProducts = products.length > 0 ? products.slice(0, 8) : fallbackProducts



  // Ensure we always have products to display
  if (displayProducts.length === 0) {
    console.error('❌ FeaturedProducts - No products available, using fallback')
    return (
      <section className="py-8 sm:py-12 lg:py-16 bg-white">
        <div className="container-responsive">
          <div className="container-max">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
                Featured Flowers
              </h2>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-4">
                Discover our most popular and beautiful flower selections
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {fallbackProducts.map((product, index) => (
                <div key={product.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        console.log('Image failed to load:', product.image)
                        e.currentTarget.src = '/images/placeholder-flower.jpg'
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-pink-600 font-bold text-lg mb-2">
                      RWF {product.price.toLocaleString()}
                    </p>
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
              Featured Flowers
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Discover our most popular and beautiful flower selections, carefully chosen to brighten your day
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {displayProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <ProductCard 
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
              href="/products"
              className="inline-block bg-pink-500 text-white px-8 py-3 rounded-lg hover:bg-pink-600 transition-colors duration-200 font-medium"
            >
              View All Flowers
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default FeaturedProducts 