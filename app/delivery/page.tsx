'use client'

import React from 'react'
import Link from 'next/link'
import { Truck, MapPin, Clock, Package, CheckCircle, Phone } from 'lucide-react'
import Footer from '@/components/Footer'

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-RW', {
    style: 'currency',
    currency: 'RWF',
    minimumFractionDigits: 0,
  }).format(price)
}

const DeliveryPage = () => {
  const deliveryOptions = [
    {
      title: 'Same Day Delivery',
      description: 'Get your flowers delivered within hours of ordering',
      price: '5,000 RWF',
      time: '2-6 hours',
      icon: Clock,
      features: ['Available in Kigali', 'Order by 2 PM', 'Priority handling', 'Real-time tracking']
    },
    {
      title: 'Next Day Delivery',
      description: 'Standard delivery service for orders placed before 6 PM',
      price: '3,000 RWF',
      time: '24 hours',
      icon: Truck,
      features: ['Nationwide delivery', 'Order by 6 PM', 'Standard handling', 'Email tracking']
    },
    {
      title: 'Scheduled Delivery',
      description: 'Choose your preferred delivery date and time',
      price: '2,000 RWF',
      time: 'Flexible',
      icon: Package,
      features: ['Advance booking', 'Time slots available', 'Special occasions', 'Gift wrapping included']
    }
  ]

  const deliveryAreas = [
    {
      area: 'Kigali City',
      deliveryTime: 'Same day / Next day',
      price: '2,000 - 5,000 RWF',
      status: 'Available'
    },
    {
      area: 'Kigali Province',
      deliveryTime: '1-2 days',
      price: '3,000 - 6,000 RWF',
      status: 'Available'
    },
    {
      area: 'Other Provinces',
      deliveryTime: '2-3 days',
      price: '5,000 - 10,000 RWF',
      status: 'Available'
    }
  ]

  const careInstructions = [
    {
      title: 'Upon Arrival',
      steps: [
        'Remove packaging carefully',
        'Trim stems at an angle',
        'Place in clean water',
        'Keep away from direct sunlight'
      ]
    },
    {
      title: 'Daily Care',
      steps: [
        'Change water every 2-3 days',
        'Re-trim stems if needed',
        'Remove wilted flowers',
        'Keep in cool location'
      ]
    },
    {
      title: 'Longevity Tips',
      steps: [
        'Use flower food if provided',
        'Avoid placing near fruits',
        'Keep away from heat sources',
        'Mist petals occasionally'
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-pink-50 to-rose-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center">
                <Truck className="h-10 w-10 text-pink-600" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Delivery Information
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Fast, reliable, and careful delivery of your beautiful flowers across Rwanda. 
              We ensure your arrangements arrive fresh and perfect every time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="btn-primary"
              >
                Contact Us
              </a>
              <a
                href="/category/roses"
                className="btn-outline"
              >
                Order Roses
              </a>
              <a
                href="/category/tulips"
                className="btn-outline"
              >
                Order Tulips
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Options */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Delivery Options
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose the delivery option that best suits your needs and timeline.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {deliveryOptions.map((option, index) => (
              <div key={index} className="card p-8">
                <div className="flex items-center justify-center w-16 h-16 bg-pink-100 rounded-xl mb-6">
                  <option.icon className="h-8 w-8 text-pink-600" />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {option.title}
                </h3>
                
                <p className="text-gray-600 mb-6">
                  {option.description}
                </p>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-pink-600">{formatPrice(Number(option.price))}</span>
                    <span className="text-sm text-gray-500">{option.time}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {option.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Delivery Areas */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Delivery Areas & Pricing
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We deliver across Rwanda with competitive pricing and reliable service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {deliveryAreas.map((area, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{area.area}</h3>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                    {area.status}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-pink-600">{formatPrice(Number(area.price))}</span>
                    <span className="text-sm text-gray-500">{area.deliveryTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Care Instructions */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Flower Care Instructions
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Follow these simple steps to keep your flowers looking beautiful for longer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {careInstructions.map((instruction, index) => (
              <div key={index} className="card p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  {instruction.title}
                </h3>
                
                <div className="space-y-4">
                  {instruction.steps.map((step, stepIndex) => (
                    <div key={stepIndex} className="flex items-start space-x-3">
                      <div className="flex items-center justify-center w-6 h-6 bg-pink-100 rounded-full flex-shrink-0 mt-0.5">
                        <span className="text-pink-600 text-sm font-medium">{stepIndex + 1}</span>
                      </div>
                      <span className="text-gray-700">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Section */}
              <div className="py-20 bg-pink-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Questions About Delivery?
          </h2>
          <p className="text-xl text-pink-100 mb-8 max-w-2xl mx-auto">
            Our delivery team is here to help. Contact us for any questions about delivery times, areas, or special arrangements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-white text-pink-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
            >
              Contact Us
            </a>
            <a
              href="tel:+250784586110"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-pink-600 transition-colors"
            >
              Call Now
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default DeliveryPage 
