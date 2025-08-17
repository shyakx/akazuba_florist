'use client'

import React from 'react'
import { Shield, CreditCard, Smartphone, Building2, CheckCircle } from 'lucide-react'

const PaymentMethods = () => {
  const paymentMethods = [
    {
      name: 'Mobile Money (MoMo)',
      accountNumber: '0784 5861 10',
      accountName: 'Umwali Diane',
      icon: '📱',
      color: 'from-orange-400 to-orange-600',
      instructions: [
        'Dial *182*8*1#',
        'Enter merchant code: 123456',
        'Enter amount',
        'Enter PIN to confirm'
      ],
      benefits: ['Instant payment', 'Widely accepted', 'Secure transactions']
    },
    {
      name: 'Bank of Kigali (BK)',
      accountNumber: '100161182448',
      accountName: 'Umwali Diane',
      icon: '🏦',
      color: 'from-blue-400 to-blue-600',
      instructions: [
        'Open BK Mobile App',
        'Go to Transfer',
        'Enter account number',
        'Enter amount and confirm'
      ],
      benefits: ['Direct bank transfer', 'No fees', 'Immediate confirmation']
    }
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Secure Payment Options
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We offer secure and convenient payment methods to make your flower shopping experience seamless. 
            All payments go directly to our business accounts.
          </p>
        </div>

        {/* Payment Methods Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {paymentMethods.map((method, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              {/* Method Header */}
              <div className="flex items-center space-x-4 mb-6">
                <div className={`w-16 h-16 bg-gradient-to-r ${method.color} rounded-xl flex items-center justify-center text-2xl`}>
                  {method.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{method.name}</h3>
                  <p className="text-gray-600">Secure and instant payment</p>
                </div>
              </div>

              {/* Account Details */}
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Account Details</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Account Number:</span>
                    <span className="font-mono font-semibold text-gray-900">{method.accountNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Account Name:</span>
                    <span className="font-semibold text-gray-900">{method.accountName}</span>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">How to Pay</h4>
                <ol className="space-y-2">
                  {method.instructions.map((instruction, idx) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <span className="w-6 h-6 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="text-gray-700">{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Benefits */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Benefits</h4>
                <div className="space-y-2">
                  {method.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Security Features */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Your Security is Our Priority</h3>
            <p className="text-gray-600">
              All transactions are secure and encrypted. We never store your payment information.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Secure Transactions</h4>
              <p className="text-gray-600 text-sm">
                All payments are processed through secure channels with encryption.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Instant Confirmation</h4>
              <p className="text-gray-600 text-sm">
                Receive immediate confirmation of your payment and order status.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CreditCard className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Multiple Options</h4>
              <p className="text-gray-600 text-sm">
                Choose from MoMo or BK payment methods based on your preference.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-pink-600 to-rose-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Order Beautiful Flowers?</h3>
            <p className="text-pink-100 mb-6">
              Choose your preferred payment method and start shopping for stunning floral arrangements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-pink-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
                Shop Flowers
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-pink-600 transition-colors">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PaymentMethods 