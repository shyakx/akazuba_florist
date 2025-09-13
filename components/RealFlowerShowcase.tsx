'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Flower, Palette } from 'lucide-react';
import { useProducts } from '@/contexts/ProductsContext';

// Format price function for RWF currency
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-RW', {
    style: 'currency',
    currency: 'RWF',
    minimumFractionDigits: 0,
  }).format(price)
}

const colors = [
  { name: 'Red', value: 'red', bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800' },
  { name: 'Pink', value: 'pink', bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-800' },
  { name: 'White', value: 'white', bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-800' },
  { name: 'Yellow', value: 'yellow', bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800' },
  { name: 'Purple', value: 'purple', bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-800' },
  { name: 'Orange', value: 'orange', bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-800' },
  { name: 'Mixed', value: 'mixed', bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-800' },
];

export default function RealFlowerShowcase() {
  const [selectedColor, setSelectedColor] = useState('red');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { products, isLoading } = useProducts();

  const filteredProducts = products.filter((product: any) => product.color === selectedColor);
  const currentColor = colors.find(c => c.value === selectedColor);

  // Show loading state
  if (isLoading) {
    return (
      <section className="py-16 bg-pink-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading beautiful flowers...</p>
          </div>
        </div>
      </section>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % filteredProducts.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + filteredProducts.length) % filteredProducts.length);
  };

  return (
    <section className="py-16 bg-pink-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <Flower className="w-8 h-8 text-pink-500" />
            <h2 className="text-4xl font-bold text-gray-800">Our Real Flower Collection</h2>
            <Palette className="w-8 h-8 text-pink-500" />
          </motion.div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our beautiful collection of real flowers, carefully photographed and organized by color. 
            Each flower is unique and ready to brighten your day.
          </p>
        </div>

        {/* Color Selector */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {colors.map((color) => (
            <motion.button
              key={color.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSelectedColor(color.value);
                setCurrentImageIndex(0);
              }}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                selectedColor === color.value
                  ? `${color.bg} ${color.border} ${color.text} border-2 shadow-lg`
                  : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-gray-300'
              }`}
            >
              {color.name} ({products.filter((p: any) => p.color === color.value).length})
            </motion.button>
          ))}
        </div>

        {/* Flower Display */}
        {filteredProducts.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Main Image */}
              <motion.div
                key={`${selectedColor}-${currentImageIndex}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl"
              >
                <img
                  src={filteredProducts[currentImageIndex].image}
                  alt={filteredProducts[currentImageIndex].name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.log('Image failed to load:', filteredProducts[currentImageIndex].image)
                    e.currentTarget.style.display = 'none'
                  }}
                />
                <div className="absolute inset-0 bg-black/30" />
                
                {/* Image Info */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">
                    {filteredProducts[currentImageIndex].name}
                  </h3>
                  <div className="text-3xl font-bold text-white mb-2">
                  {formatPrice(filteredProducts[currentImageIndex].price)}
                </div>
                  <p className="text-sm opacity-90">
                    {filteredProducts[currentImageIndex].description}
                  </p>
                </div>
              </motion.div>

              {/* Navigation Buttons */}
              {filteredProducts.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-700" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-700" />
                  </button>
                </>
              )}

              {/* Image Counter */}
              <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {filteredProducts.length}
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {filteredProducts.length > 1 && (
              <div className="flex gap-3 mt-6 justify-center">
                {filteredProducts.map((product: any, index: number) => (
                  <motion.button
                    key={product.id}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative aspect-square w-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                      index === currentImageIndex
                        ? 'border-pink-500 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.log('Thumbnail failed to load:', product.image)
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Flower className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No {currentColor?.name} flowers available yet
            </h3>
            <p className="text-gray-500">
              Check back soon for beautiful {currentColor?.name.toLowerCase()} flowers!
            </p>
          </motion.div>
        )}

        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center"
          >
            <div className="text-3xl font-bold text-pink-600 mb-2">
              {products.length}
            </div>
            <div className="text-gray-600">Total Flowers</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center"
          >
            <div className="text-3xl font-bold text-pink-600 mb-2">
              {colors.length}
            </div>
            <div className="text-gray-600">Color Varieties</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center"
          >
            <div className="text-3xl font-bold text-pink-600 mb-2">
              {products.filter((p: any) => p.featured).length}
            </div>
            <div className="text-gray-600">Featured Flowers</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center"
          >
            <div className="text-3xl font-bold text-pink-600 mb-2">
              {formatPrice(Math.min(...products.map((p: any) => p.price)))}
            </div>
            <div className="text-gray-600">Starting Price</div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 