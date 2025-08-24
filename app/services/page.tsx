'use client'

import React from 'react'
import { Clock, Crown, Flower, Gift, Heart, Sparkles, Truck, Users, ArrowRight, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import Footer from '@/components/Footer'

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-RW', {
    style: 'currency',
    currency: 'RWF',
    minimumFractionDigits: 0,
  }).format(price)
}

const ServicesPage = () => {
  const services = [
    {
      icon: Flower,
      title: 'Custom Floral Arrangements',
      description: 'Bespoke floral designs tailored to your specific needs and preferences. From simple bouquets to elaborate centerpieces.',
      features: [
        'Personal consultation',
        'Custom color schemes',
        'Seasonal flower selection',
        'Unique design concepts'
      ],
      price: 'From 15,000 RWF'
    },
    {
      icon: Gift,
      title: 'Gift Services',
      description: 'Perfect flower gifts for every occasion. From birthday surprises to corporate gifts, we make gifting effortless and memorable.',
      features: [
        'Gift wrapping included',
        'Personalized messages',
        'Same-day delivery',
        'Corporate accounts'
      ],
      price: 'From 12,000 RWF'
    },
    {
      icon: Crown,
      title: 'Wedding & Event Services',
      description: 'Complete floral services for your special day. From bridal bouquets to venue decoration.',
      features: [
        'Bridal bouquets',
        'Venue decoration',
        'Boutonnieres & corsages',
        'Wedding consultation'
      ],
      price: 'From 50,000 RWF'
    },
    {
      icon: Users,
      title: 'Corporate Services',
      description: 'Professional floral solutions for businesses. Enhance your workspace and impress your clients.',
      features: [
        'Office decoration',
        'Event arrangements',
        'Regular maintenance',
        'Corporate accounts'
      ],
      price: 'From 25,000 RWF'
    },
    {
      icon: Truck,
      title: 'Delivery Services',
      description: 'Reliable and timely delivery across Rwanda. We ensure your flowers arrive fresh and beautiful.',
      features: [
        'Same-day delivery',
        'Scheduled delivery',
        'Real-time tracking',
        'Care instructions'
      ],
      price: 'From 2,000 RWF'
    },
    {
      icon: Heart,
      title: 'Care & Maintenance',
      description: 'Expert advice and services to keep your flowers looking beautiful for longer.',
      features: [
        'Care instructions',
        'Maintenance tips',
        'Replacement services',
        'Expert consultation'
      ],
      price: 'Free consultation'
    }
  ]

  const additionalServices = [
    {
      title: 'Subscription Services',
      description: 'Regular flower deliveries to brighten your space',
      icon: Clock,
      features: ['Weekly deliveries', 'Monthly arrangements', 'Custom schedules', 'Flexible plans']
    },
    {
      title: 'Special Occasions',
      description: 'Celebrate life\'s special moments with our curated collections',
      icon: Sparkles,
      features: ['Birthdays', 'Anniversaries', 'Graduations', 'Holidays']
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-pink-50 to-rose-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="h-10 w-10 text-pink-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Our Floral Services
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              From custom arrangements to corporate solutions, we provide comprehensive floral services 
              to make every occasion special and every space beautiful.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="btn-primary"
              >
                Get a Quote
              </Link>
              <Link
                href="/category/roses"
                className="btn-outline"
              >
                Browse Roses
              </Link>
              <Link
                href="/category/tulips"
                className="btn-outline"
              >
                Browse Tulips
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Services */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Comprehensive Floral Solutions
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We offer a wide range of services to meet all your floral needs, from personal gifts to large-scale events.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="card p-8">
                <div className="flex items-center justify-center w-16 h-16 bg-pink-100 rounded-xl mb-6">
                  <service.icon className="h-8 w-8 text-pink-600" />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {service.title}
                </h3>
                
                <p className="text-gray-600 mb-6">
                  {service.description}
                </p>

                <div className="space-y-3 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-pink-600">{formatPrice(Number(service.price))}</span>
                    <Link
                      href="/contact"
                      className="text-pink-600 hover:text-pink-700 transition-colors"
                    >
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Services */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Specialized Services
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Beyond our core services, we offer specialized solutions for unique needs and occasions.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {additionalServices.map((service, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-pink-100 rounded-lg">
                    <service.icon className="h-6 w-6 text-pink-600" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900">
                    {service.title}
                  </h3>
                </div>
                
                <p className="text-gray-600 mb-6">
                  {service.description}
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-pink-600 to-rose-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-pink-100 mb-8 max-w-2xl mx-auto">
            Contact us today to discuss your floral needs and get a personalized quote for your project.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-pink-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
            >
              Contact Us
            </Link>
            <Link
              href="/category/roses"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-pink-600 transition-colors"
            >
              Browse Roses
            </Link>
            <Link
              href="/category/tulips"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-purple-600 transition-colors"
            >
              Browse Tulips
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default ServicesPage 
