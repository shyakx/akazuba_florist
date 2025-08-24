import React from 'react'
import { realFlowerProducts } from '@/data/real-flowers'
import Footer from '@/components/Footer'

// Cache busting timestamp: 2025-08-17T23:58:00Z - INLINE PRICE FORMATTING
// Version: v5 - Direct price formatting

// Format price function for RWF currency
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-RW', {
    style: 'currency',
    currency: 'RWF',
    minimumFractionDigits: 0,
  }).format(price)
}

// Generate static params for static export
export async function generateStaticParams() {
  const categories = [
    'roses',
    'tulips',
    'lilies',
    'sunflowers',
    'orchids',
    'carnations',
    'daisies',
    'peonies',
    'red',
    'pink',
    'white',
    'yellow',
    'purple',
    'orange',
    'blue',
    'colors',
    'mixed'
  ]
  
  return categories.map((category) => ({
    category: category,
  }))
}

const CategoryPage = ({ params }: { params: { category: string } }) => {
  // Cache busting identifier: rwf-fix-2025-08-17-23-55-v4
  const category = params.category
  
  // Filter products based on category
  let filteredProducts = realFlowerProducts
  
  if (category) {
    const flowerTypes = Array.from(new Set(realFlowerProducts.map(p => p.type.toLowerCase())))
    const flowerColors = Array.from(new Set(realFlowerProducts.map(p => p.color.toLowerCase())))
    
    if (category === 'colors') {
      filteredProducts = realFlowerProducts.filter(p => p.color !== 'mixed')
    } else if (category === 'mixed') {
      // Show mixed color flowers for bouquets
      filteredProducts = realFlowerProducts.filter(p => p.color === 'mixed')
    } else if (flowerTypes.includes(category.toLowerCase())) {
      filteredProducts = realFlowerProducts.filter(p => 
        p.type.toLowerCase() === category.toLowerCase()
      )
    } else if (flowerColors.includes(category.toLowerCase())) {
      filteredProducts = realFlowerProducts.filter(p => 
        p.color.toLowerCase() === category.toLowerCase()
      )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-green-50 rwf-category-page-v4">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 capitalize">
            {category === 'colors' ? 'All Colors' : category === 'mixed' ? 'Mixed Bouquets' : category} Collection
          </h1>
          <p className="text-gray-600">
            Discover our beautiful selection of {category === 'colors' ? 'colorful flowers' : category === 'mixed' ? 'mixed bouquets' : category}
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-64 object-cover"
              />
              
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {product.name}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4">
                  {product.description.substring(0, 100)}...
                </p>
                
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </span>
                  
                  <button className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Products Message */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              No products found in this category
            </h3>
            <p className="text-gray-600">
              We&apos;re working on adding more beautiful flowers to this collection.
            </p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default CategoryPage 