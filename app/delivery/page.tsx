'use client'

import { ArrowLeft, Truck, MapPin, Clock, Gift, Shield, Phone, Mail } from 'lucide-react'
import Link from 'next/link'

const DeliveryInfo = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <Link 
              href="/"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
              </div>
          <div className="mt-4">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Truck className="h-8 w-8 mr-3 text-pink-500" />
              Delivery Information
            </h1>
            <p className="text-gray-600 mt-2">Everything you need to know about our delivery service</p>
          </div>
        </div>
      </div>


      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Free Delivery Banner */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 mb-8 text-white">
          <div className="flex items-center space-x-4">
            <Gift className="h-12 w-12" />
            <div>
              <h2 className="text-2xl font-bold">🎉 Free Delivery Everywhere!</h2>
              <p className="text-green-100 mt-1">No delivery fees on any order, regardless of location or amount</p>
            </div>
          </div>
                </div>
                
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Delivery Areas */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="h-6 w-6 mr-2 text-pink-500" />
              Delivery Areas
            </h2>
            <div className="space-y-4 text-gray-600">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">Primary Service Areas</h3>
                <ul className="list-disc list-inside space-y-1 text-blue-700">
                  <li>Kigali City and surrounding areas</li>
                  <li>Gasabo District</li>
                  <li>Kicukiro District</li>
                  <li>Nyarugenge District</li>
                </ul>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-2">Extended Areas</h3>
                <ul className="list-disc list-inside space-y-1 text-green-700">
                  <li>Kigali suburbs</li>
                  <li>Nearby towns and villages</li>
                  <li>Special event locations</li>
                </ul>
              </div>
              <p className="text-sm text-gray-500">
                Don't see your area? Contact us to check if we can deliver to your location.
              </p>
                  </div>
                </div>

          {/* Delivery Times */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <Clock className="h-6 w-6 mr-2 text-pink-500" />
              Delivery Times
            </h2>
            <div className="space-y-4 text-gray-600">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 mb-2">Standard Delivery</h3>
                <ul className="list-disc list-inside space-y-1 text-yellow-700">
                  <li>Same-day delivery (orders placed before 2 PM)</li>
                  <li>Next-day delivery (orders placed after 2 PM)</li>
                  <li>Delivery hours: 8 AM - 6 PM</li>
                </ul>
                    </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="font-semibold text-purple-800 mb-2">Express Delivery</h3>
                <ul className="list-disc list-inside space-y-1 text-purple-700">
                  <li>2-4 hour delivery (subject to availability)</li>
                  <li>Available for urgent orders</li>
                  <li>Additional charges may apply</li>
                </ul>
          </div>
        </div>
      </div>

          {/* Delivery Process */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">How It Works</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Place Your Order</h3>
                  <p className="text-gray-600 text-sm">Browse our collection and add items to your cart</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Order Confirmation</h3>
                  <p className="text-gray-600 text-sm">Receive email confirmation with order details</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Preparation</h3>
                  <p className="text-gray-600 text-sm">We carefully prepare your fresh flowers</p>
                </div>
          </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold text-sm">4</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Delivery</h3>
                  <p className="text-gray-600 text-sm">Your order is delivered fresh to your door</p>
                </div>
                  </div>
                </div>
              </div>

          {/* Delivery Requirements */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <Shield className="h-6 w-6 mr-2 text-pink-500" />
              Delivery Requirements
            </h2>
            <div className="space-y-4 text-gray-600">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">What We Need</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Complete and accurate delivery address</li>
                  <li>Contact phone number for delivery coordination</li>
                  <li>Someone available to receive the delivery</li>
                  <li>Clear access instructions if needed</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Special Instructions</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Leave with neighbor (specify which neighbor)</li>
                  <li>Leave at security gate</li>
                  <li>Call before delivery</li>
                  <li>Any specific timing requirements</li>
                </ul>
          </div>
        </div>
      </div>

          </div>

        {/* Important Notes */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Important Notes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-600">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Weather Conditions</h3>
              <p className="text-sm">Deliveries may be delayed during severe weather conditions. We'll contact you if there are any delays.</p>
                      </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Failed Deliveries</h3>
              <p className="text-sm">If we can't deliver, we'll attempt to contact you and arrange a new delivery time.</p>
                    </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Quality Guarantee</h3>
              <p className="text-sm">All flowers are delivered fresh. If you're not satisfied, contact us within 24 hours.</p>
                </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Special Events</h3>
              <p className="text-sm">For weddings and special events, we recommend placing orders at least 3 days in advance.</p>
          </div>
        </div>
      </div>

        {/* Contact Information */}
        <div className="mt-8 bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg p-6 text-white">
          <h2 className="text-2xl font-semibold mb-4">Need Help with Delivery?</h2>
          <p className="mb-4">Our delivery team is here to help ensure your flowers arrive perfectly.</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5" />
              <span>+250 784 586 110</span>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5" />
              <span>info.akazubaflorist@gmail.com</span>
          </div>
        </div>
      </div>

      </div>
    </div>
  )
}

export default DeliveryInfo