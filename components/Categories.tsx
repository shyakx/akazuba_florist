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
    color: 'from-pink-400 to-rose-400',
    features: ['Fresh Daily', 'Same Day Delivery', 'Perfect for DIY'],
    icon: Flower
  },
  {
    id: 'bouquets',
    name: 'Flower Bouquets',
    description: 'Handcrafted arrangements for every special occasion',
    image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    productCount: 6,
    color: 'from-rose-400 to-pink-400',
    features: ['Handcrafted', 'Occasion Specific', 'Professional Design'],
    icon: Heart
  }
]

const CategoryCard = ({ category }: { category: typeof categories[0] }) => {
  return (
    <div className="relative group overflow-hidden rounded-2xl shadow-xl">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative p-8 h-full flex flex-col justify-end">
        <div className="text-white">
          <div className="flex items-center mb-3">
            <category.icon className="h-8 w-8 mr-3" />
            <h3 className="text-3xl font-bold">{category.name}</h3>
          </div>
          <p className="text-lg mb-4 opacity-90">{category.description}</p>
          
          {/* Features */}
          <div className="mb-6">
            <ul className="space-y-2">
              {category.features.map((feature, index) => (
                <li key={index} className="flex items-center text-sm opacity-80">
                  <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${category.color} mr-3`}></div>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Product Count */}
          <div className="mb-6">
            <span className="text-sm opacity-75">{category.productCount}+ Products</span>
          </div>

          {/* CTA Button */}
          <Link
            href={`/category/${category.id}`}
            className={`inline-flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-300 bg-gradient-to-r ${category.color} hover:shadow-lg hover:scale-105`}
          >
            Explore {category.name}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  )
}

const Categories = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-pink-100 to-rose-100 rounded-full px-6 py-2 mb-6">
            <Flower className="h-5 w-5 text-pink-600" />
            <span className="text-pink-600 font-semibold">Our Collections</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose from our carefully curated collections of fresh flowers and handcrafted bouquets
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Flower className="h-8 w-8 text-pink-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Fresh Daily</h3>
            <p className="text-gray-600">All our flowers are handpicked fresh every morning</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-rose-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Handcrafted</h3>
            <p className="text-gray-600">Each arrangement is carefully crafted by our expert florists</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ArrowRight className="h-8 w-8 text-pink-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Same Day Delivery</h3>
            <p className="text-gray-600">Free delivery in Kigali for orders placed before 2 PM</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Categories 