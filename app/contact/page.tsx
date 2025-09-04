'use client'

import React, { useState } from 'react'
import { useAuth } from '@/contexts/RealAuthContext'
import { Mail, Phone, MapPin, Clock, MessageCircle, Send, CheckCircle } from 'lucide-react'
import Footer from '@/components/Footer'
import toast from 'react-hot-toast'

const ContactPage = () => {
  const { user, isAuthenticated } = useAuth()
  const [formData, setFormData] = useState({
    name: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : '',
    email: user?.email || '',
    phone: user?.phone || '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.phone || !formData.subject || !formData.message) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)
    
    try {
      // Simulate form submission (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success('Message sent successfully! We\'ll get back to you soon.')
      setIsSubmitted(true)
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    })
    } catch (error) {
      toast.error('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const supportTopics = [
    {
      title: 'Order Status',
      description: 'Track your order and check delivery status',
      icon: <MessageCircle className="w-6 h-6" />
    },
    {
      title: 'Product Information',
      description: 'Get details about our flowers and perfumes',
      icon: <MessageCircle className="w-6 h-6" />
    },
    {
      title: 'Payment Issues',
      description: 'Help with payment methods and transactions',
      icon: <MessageCircle className="w-6 h-6" />
    },
    {
      title: 'Delivery & Shipping',
      description: 'Information about delivery times and fees',
      icon: <MessageCircle className="w-6 h-6" />
    },
    {
      title: 'Returns & Refunds',
      description: 'How to return items and request refunds',
      icon: <MessageCircle className="w-6 h-6" />
    },
    {
      title: 'General Inquiries',
      description: 'Any other questions about our services',
      icon: <MessageCircle className="w-6 h-6" />
    }
  ]

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container-responsive py-16">
          <div className="container-wide">
            <div className="max-w-md mx-auto text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Message Sent Successfully!</h1>
              <p className="text-gray-600 mb-8">
                Thank you for contacting us. We'll get back to you within 24 hours.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Send Another Message
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-responsive py-16">
        <div className="container-wide">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're here to help! Get in touch with us for any questions about our products, orders, or services.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+250 788 123 456"
                    required
                  />
                </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select a topic</option>
                    <option value="Order Status">Order Status</option>
                    <option value="Product Information">Product Information</option>
                    <option value="Payment Issues">Payment Issues</option>
                    <option value="Delivery & Shipping">Delivery & Shipping</option>
                    <option value="Returns & Refunds">Returns & Refunds</option>
                    <option value="General Inquiry">General Inquiry</option>
                    </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tell us how we can help you..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                  <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              {/* Contact Details */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Phone</h3>
                      <p className="text-gray-600">WhatsApp: +250 784 586 110</p>
                </div>
              </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Email</h3>
                      <p className="text-gray-600">info.akazubaflorist@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Address</h3>
                      <p className="text-gray-600">
                        Kigali, Rwanda<br />
                        Kimihurura, KG 123 St<br />
                        Near Kigali Convention Centre
                      </p>
                  </div>
                </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Business Hours</h3>
                      <p className="text-gray-600">Monday - Friday: 8:00 AM - 6:00 PM</p>
                      <p className="text-gray-600">Saturday: 9:00 AM - 4:00 PM</p>
                      <p className="text-gray-600">Sunday: Closed</p>
                      <p className="text-gray-600 text-sm mt-2">Emergency orders: Available 24/7</p>
              </div>
            </div>
          </div>
        </div>

              {/* Support Topics */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">How Can We Help?</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {supportTopics.map((topic, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="text-blue-600">
                          {topic.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm">{topic.title}</h3>
                          <p className="text-gray-600 text-xs">{topic.description}</p>
                        </div>
          </div>
              </div>
            ))}
                </div>
          </div>

              {/* FAQ Quick Links */}
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Frequently Asked Questions</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600">• How do I track my order?</p>
                  <p className="text-gray-600">• What payment methods do you accept?</p>
                  <p className="text-gray-600">• How long does delivery take?</p>
                  <p className="text-gray-600">• Can I cancel or modify my order?</p>
                  <p className="text-gray-600">• What is your return policy?</p>
                </div>
                <button className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All FAQs →
              </button>
            </div>
          </div>
        </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default ContactPage 