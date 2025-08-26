'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Flower, Heart, Star, Sparkles, ArrowRight, Clock, Truck, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { realFlowerProducts } from '@/data/real-flowers'

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-RW', {
    style: 'currency',
    currency: 'RWF',
    minimumFractionDigits: 0,
  }).format(price)
}

const TulipsShowcase = () => {
  // Filter tulip products from real flower data
  const tulipProducts = realFlowerProducts.filter(product => 
    product.type.toLowerCase().includes('tulip') || 
    product.name.toLowerCase().includes('tulip')
  )

  // If no tulips in real data, use featured products as fallback
  const featuredTulips = tulipProducts.length > 0 ? tulipProducts.slice(0, 4) : 
    realFlowerProducts.filter(p => p.featured).slice(0, 4)

  const tulipVarieties = [
    {
      name: 'Red Tulips',
      description: 'Classic red tulips symbolizing perfect love and passion. Perfect for romantic occasions and declarations of love.',
      image: featuredTulips[0]?.image || '/images/flowers/red/red-2.jpg',
      price: featuredTulips[0]?.price || 32500,
      features: ['Perfect Love', 'Romantic', 'Classic Beauty'],
      rating: 4.9,
      reviews: 127
    },
    {
      name: 'Pink Tulips',
      description: 'Delicate pink tulips representing happiness and affection. Ideal for birthdays, anniversaries, and celebrations.',
      image: featuredTulips[1]?.image || '/images/flowers/pink/pink-1.jpg',
      price: featuredTulips[1]?.price || 41600,
      features: ['Happiness', 'Affection', 'Spring Vibes'],
      rating: 4.8,
      reviews: 89
    },
    {
      name: 'Yellow Tulips',
      description: 'Bright yellow tulips bringing sunshine and cheer. Perfect for brightening someone\'s day or expressing friendship.',
      image: featuredTulips[2]?.image || '/images/flowers/yellow/yellow-1.jpg',
      price: featuredTulips[2]?.price || 26000,
      features: ['Sunshine', 'Cheerful', 'Friendship'],
      rating: 4.7,
      reviews: 156
    },
    {
      name: 'White Tulips',
      description: 'Pure white tulips symbolizing forgiveness and new beginnings. Elegant choice for weddings and special occasions.',
      image: featuredTulips[3]?.image || '/images/flowers/white/white-1.jpg',
      price: featuredTulips[3]?.price || 39000,
      features: ['Purity', 'Elegance', 'New Beginnings'],
      rating: 4.9,
      reviews: 203
    }
  ]

  const careTips = [
    {
      icon: Clock,
      title: 'Fresh Daily',
      description: 'Our tulips are handpicked fresh every morning from local Rwandan farms',
      color: 'bg-red-500'
    },
    {
      icon: Truck,
      title: 'Same Day Delivery',
      description: 'Get your tulips delivered within hours in Kigali and surrounding areas',
      color: 'bg-pink-500'
    },
    {
      icon: Heart,
      title: 'Care Instructions',
      description: 'Detailed care guide included with every order to ensure longevity',
      color: 'bg-purple-500'
    },
    {
      icon: Star,
      title: 'Premium Quality',
      description: 'Only the finest tulips selected for our discerning customers',
      color: 'bg-green-500'
    }
  ]

  const tulipFacts = [
    {
      fact: 'Tulips symbolize perfect love and are often associated with spring and renewal. In Rwanda, they represent hope and new beginnings.',
      category: 'Symbolism',
      icon: Heart
    },
    {
      fact: 'Tulips come in over 3,000 registered varieties worldwide. Our collection features the most popular and beautiful varieties.',
      category: 'Variety',
      icon: Flower
    },
    {
      fact: 'Tulips can continue to grow up to an inch per day after being cut and placed in water, making them perfect for arrangements.',
      category: 'Care',
      icon: Sparkles
    },
    {
      fact: 'Our tulips are sourced from premium local farms in Rwanda, ensuring freshness and supporting local agriculture.',
      category: 'Local',
      icon: Star
    }
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-pink-100 rounded-full px-6 py-2 mb-6">
            <Flower className="h-5 w-5 text-pink-600" />
            <span className="text-pink-600 font-semibold">Premium Tulips Collection</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Discover the Magic of Tulips
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Experience the beauty and elegance of our premium tulip collection. Each variety is carefully selected 
            for its unique charm and meaning, perfect for expressing your deepest emotions and creating unforgettable moments.
          </p>
        </motion.div>

        {/* Tulip Varieties */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {tulipVarieties.map((variety, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2 border border-gray-100">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={variety.image}
                    alt={variety.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      console.log('Tulip image failed to load:', variety.image)
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Rating Badge */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-semibold text-gray-800">{variety.rating}</span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{variety.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{variety.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {variety.features.map((feature, featureIndex) => (
                      <span
                        key={featureIndex}
                        className="px-3 py-1 bg-pink-100 text-pink-700 text-xs rounded-full font-medium"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-pink-600">{formatPrice(variety.price)}</span>
                      <span className="text-sm text-gray-500">({variety.reviews} reviews)</span>
                    </div>
                    <Link
                      href="/category/tulips"
                      className="text-pink-600 hover:text-pink-700 transition-colors"
                    >
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </div>

                  <Link
                    href="/category/tulips"
                    className="w-full bg-pink-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-pink-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                  >
                    <span>Shop Now</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Care Tips */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {careTips.map((tip, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center group"
            >
              <div className={`w-20 h-20 ${tip.color} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <tip.icon className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{tip.title}</h3>
              <p className="text-gray-600 leading-relaxed">{tip.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Tulip Facts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl shadow-xl p-8 mb-16 border border-gray-100"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our Tulips?</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover what makes our tulip collection special and why customers choose us for their floral needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {tulipFacts.map((fact, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex items-start space-x-4 p-6 bg-pink-50 rounded-2xl hover:shadow-lg transition-shadow duration-300"
              >
                <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <fact.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-sm font-bold text-pink-600 uppercase tracking-wide">
                    {fact.category}
                  </span>
                  <p className="text-gray-700 mt-2 leading-relaxed">{fact.fact}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="bg-pink-600 rounded-3xl p-12 text-white shadow-2xl">
            <h3 className="text-3xl font-bold mb-4">Ready to Experience Tulip Magic?</h3>
            <p className="text-xl text-pink-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              Choose from our beautiful tulip collection and bring spring colors to your space. 
              Perfect for gifts, celebrations, or simply brightening your day with nature&apos;s beauty.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/category/tulips"
                className="bg-white text-pink-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors transform hover:scale-105 shadow-lg"
              >
                Shop Tulips Collection
              </Link>
              <Link
                href="/contact"
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-pink-600 transition-colors transform hover:scale-105"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default TulipsShowcase 