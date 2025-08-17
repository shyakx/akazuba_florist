'use client'

import React from 'react'
import { Flower, Truck, Clock, Heart, Crown, Sparkles, Gift, Users, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-RW', {
    style: 'currency',
    currency: 'RWF',
    minimumFractionDigits: 0,
  }).format(price)
}

const Services = () => {
  const services = [
    {
      icon: Flower,
      title: 'Custom Floral Arrangements',
      description: 'Personalized flower arrangements designed to match your style and occasion. Perfect for weddings, events, and special moments.',
      features: ['Wedding bouquets', 'Event decorations', 'Personalized designs', 'Seasonal arrangements'],
      price: 'From RWF 25,000',
      link: '/category/flowers'
    },
    {
      icon: Crown,
      title: 'Luxury Flower Collections',
      description: 'Premium flower collections featuring rare and exotic blooms. Discover stunning arrangements that make a lasting impression.',
      features: ['Premium roses', 'Exotic flowers', 'Expert consultation', 'Gift packaging'],
      price: 'From RWF 45,000',
      link: '/category/bouquets'
    },
    {
      icon: Truck,
      title: 'Same Day Delivery',
      description: 'Fast and reliable delivery service across Rwanda. Your beautiful flowers delivered fresh and on time.',
      features: ['Same day delivery', 'Free delivery in Kigali', 'Real-time tracking', 'Careful handling'],
      price: 'Free in Kigali',
      link: '/contact'
    },
    {
      icon: Gift,
      title: 'Gift Services',
      description: 'Perfect flower gifts for every occasion. From birthday surprises to corporate gifts, we make gifting effortless and memorable.',
      features: ['Birthday gifts', 'Corporate gifts', 'Anniversary packages', 'Get well wishes'],
      price: 'From RWF 15,000',
      link: '/category/flowers'
    },
    {
      icon: Heart,
      title: 'Wedding & Events',
      description: 'Complete floral services for your special day. From bridal bouquets to venue decoration.',
      features: ['Bridal bouquets', 'Venue decoration', 'Boutonnieres', 'Centerpieces'],
      price: 'Custom pricing',
      link: '/contact'
    },
    {
      icon: Users,
      title: 'Corporate Services',
      description: 'Professional floral solutions for businesses. Enhance your workspace and impress your clients.',
      features: ['Office decoration', 'Client gifts', 'Event planning', 'Regular maintenance'],
      price: 'Custom pricing',
      link: '/contact'
    }
  ]

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-pink-100 to-rose-100 rounded-full px-6 py-2 mb-6">
            <Sparkles className="h-5 w-5 text-pink-600" />
            <span className="text-pink-600 font-semibold">Our Services</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Comprehensive Floral Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From custom floral arrangements to wedding services, we offer a comprehensive range of services 
            to meet all your flower and gifting needs.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-gray-50 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 group">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-pink-200 transition-colors">
                <service.icon className="h-8 w-8 text-pink-600" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{service.title}</h3>
              <p className="text-gray-600 mb-6">{service.description}</p>
              
              <div className="space-y-2 mb-6">
                {service.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <Sparkles className="h-4 w-4 text-pink-500" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-pink-600">{formatPrice(Number(service.price))}</span>
                <Link
                  href="/services"
                  className="text-pink-600 hover:text-pink-700 transition-colors"
                >
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
              
              <Link
                href={service.link}
                className="inline-flex items-center justify-center w-full border-2 border-pink-600 text-pink-600 py-3 px-6 rounded-xl font-semibold hover:bg-pink-600 hover:text-white transition-all duration-300 group-hover:bg-pink-600 group-hover:text-white"
              >
                Learn More
              </Link>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-pink-600 to-rose-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Need a Custom Arrangement?</h3>
            <p className="text-pink-100 mb-6">
              Let us create something special for your unique occasion. Contact us to discuss your requirements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="bg-white text-pink-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
                Contact Us
              </Link>
              <Link href="/category/roses" className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-pink-600 transition-colors">
                Shop Roses
              </Link>
              <Link href="/category/tulips" className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-purple-600 transition-colors">
                Shop Tulips
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Services 