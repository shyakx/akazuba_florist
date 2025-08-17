'use client'

import React, { useState, useEffect } from 'react'
import { Flower, Sparkles, Truck, Shield, Star, ArrowRight, Play, Heart, Crown } from 'lucide-react'
import Link from 'next/link'
import CartSummary from './CartSummary'

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  
  const heroSlides = [
    {
      title: "Beautiful Blooms",
      subtitle: "Handcrafted with Love",
      description: "Discover our stunning collection of fresh flowers and handcrafted arrangements. Every bouquet tells a story of beauty and elegance.",
      image: "https://images.unsplash.com/photo-1562690868-60bbe7293e94?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      accent: "pink"
    },
    {
      title: "Wedding Flowers",
      subtitle: "Perfect for Your Special Day",
      description: "From bridal bouquets to venue decorations, we create magical floral arrangements that make your wedding day unforgettable.",
      image: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      accent: "rose"
    },
    {
      title: "Fresh Flowers",
      subtitle: "Delivered Daily",
      description: "Handpicked blooms delivered fresh to your door. From romantic roses to cheerful sunflowers, we bring nature's beauty to your special moments.",
      image: "https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      accent: "pink"
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [heroSlides.length])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-pink-200 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-rose-200 rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 left-1/3 w-20 h-20 bg-pink-200 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 left-10 w-16 h-16 bg-pink-100 rounded-full animate-bounce"></div>
        <div className="absolute bottom-1/3 right-10 w-12 h-12 bg-rose-100 rounded-full animate-pulse"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left Content */}
          <div className="space-y-8 relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
              <Flower className="h-5 w-5 text-pink-600" />
              <span className="text-pink-600 font-semibold text-sm">Akazuba Florist</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight">
                {heroSlides[currentSlide].title}
                <br />
                <span className={`text-gradient bg-gradient-to-r from-${heroSlides[currentSlide].accent}-600 to-${heroSlides[currentSlide].accent === 'pink' ? 'rose' : 'pink'}-600`}>
                  {heroSlides[currentSlide].subtitle}
                </span>
              </h1>
              <p className="text-xl lg:text-2xl text-gray-600 max-w-lg leading-relaxed">
                {heroSlides[currentSlide].description}
              </p>
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                  <Truck className="h-6 w-6 text-pink-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Same Day Delivery</h3>
                  <p className="text-sm text-gray-600">Free in Kigali</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                  <Shield className="h-6 w-6 text-rose-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Secure Payment</h3>
                  <p className="text-sm text-gray-600">MoMo & BK accepted</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-pink-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Fresh Flowers</h3>
                  <p className="text-sm text-gray-600">Handpicked daily</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Star className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">5-Star Service</h3>
                  <p className="text-sm text-gray-600">Customer satisfaction</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/category/roses" 
                className="group bg-gradient-to-r from-pink-600 to-rose-600 text-white text-lg px-8 py-4 rounded-xl font-semibold hover:from-pink-700 hover:to-rose-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
              >
                <Flower className="h-5 w-5" />
                Shop Roses
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/category/tulips" 
                className="group bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
              >
                <Flower className="h-5 w-5" />
                Shop Tulips
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/category/mixed-bouquets" 
                className="group border-2 border-pink-600 text-pink-600 text-lg px-8 py-4 rounded-xl font-semibold hover:bg-pink-50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <Heart className="h-5 w-5" />
                View Bouquets
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-8 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-1">
                  <div className="w-8 h-8 bg-pink-200 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-rose-200 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-pink-200 rounded-full border-2 border-white"></div>
                </div>
                <span className="font-medium">500+ Happy Customers</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="font-medium">4.9/5 Rating</span>
              </div>
            </div>

            {/* Slide Indicators */}
            <div className="flex space-x-2">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-pink-600 w-8' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Right Content - Enhanced Cart Summary */}
          <div className="flex justify-center lg:justify-end relative z-10">
            <div className="relative">
              <CartSummary />
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-white rounded-full p-3 shadow-lg animate-bounce">
                <Heart className="h-6 w-6 text-red-500" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white rounded-full p-3 shadow-lg animate-pulse">
                <Sparkles className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Product Preview with Enhanced Design */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Featured Collections
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our most popular flower arrangements, carefully crafted for every occasion.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="group text-center">
              <div className="relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-300">
                <img
                  src="https://images.unsplash.com/photo-1562690868-60bbe7293e94?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
                  alt="Luxury Roses"
                  className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h3 className="font-semibold text-gray-900 mt-4 text-lg">Luxury Roses</h3>
              <p className="text-sm text-gray-600 mb-2">Premium red roses</p>
              <p className="text-pink-600 font-bold">{formatPrice(25000)}</p>
            </div>
            
            <div className="group text-center">
              <div className="relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-300">
                <img
                  src="https://images.unsplash.com/photo-1582735689369-4fe89db7114c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
                  alt="Mixed Bouquet"
                  className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h3 className="font-semibold text-gray-900 mt-4 text-lg">Mixed Bouquet</h3>
              <p className="text-sm text-gray-600 mb-2">Colorful arrangement</p>
              <p className="text-pink-600 font-bold">{formatPrice(35000)}</p>
            </div>
            
            <div className="group text-center">
              <div className="relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-300">
                <img
                  src="https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
                  alt="Wedding Bouquet"
                  className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h3 className="font-semibold text-gray-900 mt-4 text-lg">Wedding Bouquet</h3>
              <p className="text-sm text-gray-600 mb-2">Elegant white roses</p>
              <p className="text-pink-600 font-bold">{formatPrice(45000)}</p>
            </div>
            
            <div className="group text-center">
              <div className="relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-300">
                <img
                  src="https://images.unsplash.com/photo-1597848212624-a19eb35e2651?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
                  alt="Sunflower Bundle"
                  className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h3 className="font-semibold text-gray-900 mt-4 text-lg">Sunflower Bundle</h3>
              <p className="text-sm text-gray-600 mb-2">Cheerful sunflowers</p>
              <p className="text-pink-600 font-bold">{formatPrice(22000)}</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-pink-600 mb-2">500+</div>
            <div className="text-gray-600">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-rose-600 mb-2">1000+</div>
            <div className="text-gray-600">Bouquets Delivered</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-pink-600 mb-2">4.9★</div>
            <div className="text-gray-600">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
            <div className="text-gray-600">Customer Support</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero 