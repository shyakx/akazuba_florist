'use client'

import React from 'react'
import { Clock, Star, Gift, Sparkles, ArrowRight, Heart, Crown } from 'lucide-react'
import Link from 'next/link'

const SpecialOffers = () => {
  const offers = [
    {
      id: 1,
      title: "Valentine's Special",
      subtitle: "Romance in Bloom",
      description: "Get 20% off on all rose bouquets and romantic arrangements. Perfect for expressing your love.",
      originalPrice: 30000,
      discountedPrice: 24000,
      discount: 20,
      image: "https://images.unsplash.com/photo-1562690868-60bbe7293e94?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      category: "flowers",
      badge: "Limited Time",
      badgeColor: "bg-red-500",
      icon: Heart,
      expiresIn: "2 days"
    },
    {
      id: 2,
      title: "Wedding Collection",
      subtitle: "Bridal Bouquets",
      description: "Exclusive wedding flower packages including bridal bouquets, bridesmaid bouquets, and venue decoration.",
      originalPrice: 150000,
      discountedPrice: 120000,
      discount: 20,
      image: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      category: "bouquets",
      badge: "Best Seller",
      badgeColor: "bg-yellow-500",
      icon: Crown,
      expiresIn: "1 week"
    },
    {
      id: 3,
      title: "Mixed Flower Bundle",
      subtitle: "Colorful Arrangements",
      description: "Beautiful mixed flower arrangements perfect for birthdays, anniversaries, or to brighten any room.",
      originalPrice: 45000,
      discountedPrice: 36000,
      discount: 20,
      image: "https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      category: "flowers",
      badge: "Popular",
      badgeColor: "bg-green-500",
      icon: Gift,
      expiresIn: "3 days"
    }
  ]

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-pink-100 to-rose-100 rounded-full px-6 py-2 mb-6">
            <Sparkles className="h-5 w-5 text-pink-600" />
            <span className="text-pink-600 font-semibold">Special Offers</span>
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
            Exclusive Flower Deals
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover amazing offers on our premium flowers and handcrafted arrangements. 
            Limited time deals that make luxury flowers accessible.
          </p>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {offers.map((offer) => (
            <div key={offer.id} className="group relative">
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2">
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={offer.image}
                    alt={offer.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  
                  {/* Badge */}
                  <div className={`absolute top-4 left-4 ${offer.badgeColor} text-white px-3 py-1 rounded-full text-sm font-medium`}>
                    {offer.badge}
                  </div>
                  
                  {/* Discount */}
                  <div className="absolute top-4 right-4 bg-white text-red-600 px-3 py-1 rounded-full text-sm font-bold">
                    -{offer.discount}%
                  </div>
                  
                  {/* Icon */}
                  <div className="absolute bottom-4 left-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <offer.icon className="h-6 w-6 text-pink-600" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{offer.title}</h3>
                    <p className="text-pink-600 font-semibold mb-2">{offer.subtitle}</p>
                    <p className="text-gray-600 text-sm leading-relaxed">{offer.description}</p>
                  </div>

                  {/* Pricing */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-pink-600">
                        {formatPrice(offer.discountedPrice)}
                      </span>
                      <span className="text-lg text-gray-400 line-through">
                        {formatPrice(offer.originalPrice)}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>Expires in {offer.expiresIn}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link
                    href={`/category/${offer.category}`}
                    className="group/btn w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-pink-700 hover:to-rose-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                  >
                    Shop Now
                    <ArrowRight className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Promotions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Newsletter Signup */}
          <div className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl p-8 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Gift className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">First Order Discount</h3>
                <p className="text-pink-100">New customers get 15% off</p>
              </div>
            </div>
            <p className="text-lg mb-6">
              Subscribe to our newsletter and receive exclusive offers, new flower arrivals, 
              and floral inspiration delivered to your inbox.
            </p>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <button className="bg-white text-pink-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            </div>
          </div>

          {/* Loyalty Program */}
          <div className="bg-gradient-to-br from-rose-500 to-pink-500 rounded-2xl p-8 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Star className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Loyalty Rewards</h3>
                <p className="text-rose-100">Earn points with every purchase</p>
              </div>
            </div>
            <p className="text-lg mb-6">
              Join our loyalty program and earn points with every flower purchase. 
              Redeem points for discounts, free delivery, and exclusive arrangements.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold">1</span>
                </div>
                <span>Earn 1 point per RWF 1,000 spent</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold">2</span>
                </div>
                <span>Redeem 100 points for RWF 1,000 discount</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold">3</span>
                </div>
                <span>Exclusive member-only flower offers</span>
              </div>
            </div>
            <button className="mt-6 bg-white text-rose-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Join Now
            </button>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Don&apos;t Miss Out on These Amazing Flower Deals!
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Our special offers are available for a limited time only. 
              Shop now to secure the best prices on premium flowers and handcrafted arrangements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/category/roses" className="bg-gradient-to-r from-pink-600 to-rose-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-pink-700 hover:to-rose-700 transition-all duration-300 text-lg">
                Shop Roses
              </Link>
              <Link href="/category/tulips" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 text-lg">
                Shop Tulips
              </Link>
              <Link href="/category/mixed-bouquets" className="border-2 border-pink-600 text-pink-600 px-8 py-4 rounded-xl font-semibold hover:bg-pink-50 transition-all duration-300 text-lg">
                Shop Bouquets
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SpecialOffers 