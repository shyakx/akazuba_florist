'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight, Flower, Heart } from 'lucide-react'

const categories = [
  {
    id: 'flowers',
    name: 'Individual Flowers',
    description: 'Fresh stems and individual flowers for your own arrangements',
    image: 'https://images.unsplash.com/photo-1562690868-60bbe7293e94?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    productCount: 6,
    color: 'bg-pink-500',
    features: ['Fresh Daily', 'Same Day Delivery', 'Perfect for DIY'],
    icon: Flower
  },
  {
    id: 'bouquets',
    name: 'Flower Bouquets',
    description: 'Handcrafted arrangements for every special occasion',
    image: 'https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    productCount: 6,
    color: 'bg-rose-500',
    features: ['Handcrafted', 'Occasion Specific', 'Professional Design'],
    icon: Heart
  }
]

const CategoryCard = ({ category }: { category: typeof categories[0] }) => {
  return (
    <div className="relative group overflow-hidden rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/80"></div>
      </div>

      {/* Content */}
      <div className="relative p-4 sm:p-6 lg:p-8 h-full flex flex-col justify-end">
        <div className="text-white">
          <div className="flex items-center mb-2 sm:mb-3">
            <category.icon className="h-6 w-6 sm:h-8 sm:w-8 mr-2 sm:mr-3" />
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold">{category.name}</h3>
          </div>
          <p className="text-sm sm:text-base lg:text-lg mb-3 sm:mb-4 opacity-90">{category.description}</p>
          
          {/* Features */}
          <div className="mb-4 sm:mb-6">
            <ul className="space-y-1 sm:space-y-2">
              {category.features.map((feature, index) => (
                <li key={index} className="flex items-center text-xs sm:text-sm opacity-80">
                  <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${category.color} mr-2 sm:mr-3`}></div>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Product Count */}
          <div className="mb-4 sm:mb-6">
            <span className="text-xs sm:text-sm opacity-75">{category.productCount}+ Products</span>
          </div>

          {/* CTA Button */}
          <Link
            href={`/category/${category.id}`}
            className={`inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-all duration-300 ${category.color} hover:shadow-lg hover:scale-105`}
          >
            Explore {category.name}
            <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
          </Link>
        </div>
      </div>
    </div>
  )
}

const Categories = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
      <div className="container-responsive">
        <div className="container-max">
          {/* Section Header */}
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center space-x-2 bg-pink-100 rounded-full px-4 sm:px-6 py-2 mb-4 sm:mb-6">
              <Flower className="h-4 w-4 sm:h-5 sm:w-5 text-pink-600" />
              <span className="text-sm sm:text-base text-pink-600 font-semibold">Our Collections</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Shop by Category
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Choose from our carefully curated collections of fresh flowers and handcrafted bouquets
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Categories 