'use client'

import { ArrowLeft, FileText, Shield, Users, CreditCard, Truck } from 'lucide-react'
import Link from 'next/link'

const TermsOfService = () => {
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
              <FileText className="h-8 w-8 mr-3 text-pink-500" />
              Terms of Service
            </h1>
            <p className="text-gray-600 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          
          {/* Introduction */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Welcome to Akazuba Florist</h2>
            <p className="text-gray-600 leading-relaxed">
              These Terms of Service ("Terms") govern your use of our website and services. 
              By accessing or using Akazuba Florist, you agree to be bound by these Terms.
            </p>
          </section>

          {/* Services */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <Truck className="h-6 w-6 mr-2 text-pink-500" />
              Our Services
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>Akazuba Florist provides:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Premium floral arrangements and bouquets</li>
                <li>Wedding and special event flowers</li>
                <li>Fresh flower delivery services</li>
                <li>Online ordering and payment processing</li>
                <li>Customer support and consultation</li>
              </ul>
            </div>
          </section>

          {/* Orders and Payment */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <CreditCard className="h-6 w-6 mr-2 text-pink-500" />
              Orders and Payment
            </h2>
            <div className="space-y-4 text-gray-600">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Order Processing</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>All orders are subject to availability</li>
                  <li>We reserve the right to refuse or cancel orders</li>
                  <li>Order confirmation will be sent via email</li>
                  <li>Payment must be completed before order processing</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Payment Methods</h3>
                <p>We accept payments through:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Mobile Money (MOMO)</li>
                  <li>Bank transfers (BK)</li>
                  <li>Cash on delivery (where available)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Delivery */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <Truck className="h-6 w-6 mr-2 text-pink-500" />
              Delivery Policy
            </h2>
            <div className="space-y-4 text-gray-600">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-2">🎉 Free Delivery</h3>
                <p>We offer free delivery on all orders within our service areas.</p>
              </div>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Delivery times may vary based on location and order volume</li>
                <li>We will contact you to confirm delivery details</li>
                <li>Someone must be available to receive the delivery</li>
                <li>We are not responsible for delays due to weather or circumstances beyond our control</li>
              </ul>
            </div>
          </section>

          {/* Privacy and Data */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <Shield className="h-6 w-6 mr-2 text-pink-500" />
              Privacy and Data Protection
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>We are committed to protecting your privacy:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>We collect only necessary information to process your orders</li>
                <li>Your personal information is never shared with third parties</li>
                <li>We use secure payment processing systems</li>
                <li>You can request to view or delete your data at any time</li>
              </ul>
            </div>
          </section>

          {/* Customer Responsibilities */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <Users className="h-6 w-6 mr-2 text-pink-500" />
              Customer Responsibilities
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>As a customer, you agree to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide accurate and complete information</li>
                <li>Use our services only for lawful purposes</li>
                <li>Respect our intellectual property rights</li>
                <li>Not attempt to interfere with our website or services</li>
                <li>Contact us promptly if you have any issues with your order</li>
              </ul>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Limitation of Liability</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                Akazuba Florist shall not be liable for any indirect, incidental, special, 
                or consequential damages arising from your use of our services.
              </p>
              <p>
                Our total liability shall not exceed the amount paid for the specific order in question.
              </p>
            </div>
          </section>

          {/* Changes to Terms */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to Terms</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                We reserve the right to modify these Terms at any time. 
                Changes will be effective immediately upon posting on our website.
              </p>
              <p>
                Your continued use of our services after changes constitutes acceptance of the new Terms.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-600 mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="space-y-2">
                <p><strong>Email:</strong> info.akazubaflorist@gmail.com</p>
                <p><strong>Phone:</strong> +250 784 586 110</p>
                <p><strong>Address:</strong> Kigali, Rwanda</p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}

export default TermsOfService
