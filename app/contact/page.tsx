'use client'

import React, { useState } from 'react'
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from 'lucide-react'
import toast from 'react-hot-toast'

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })

  const contactMethods = [
    {
      icon: Phone,
      title: 'Phone',
      details: ['+250 784 586 110'],
      description: 'Call us anytime'
    },
    {
      icon: Mail,
      title: 'Email',
      details: ['hello@akazubaflorist.com', 'support@akazubaflorist.com'],
      description: 'Send us an email anytime'
    },
    {
      icon: MapPin,
      title: 'Address',
      details: ['Kigali, Rwanda'],
      description: 'Visit our location'
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: ['Mon - Sat: 8:00 AM - 8:00 PM', 'Sunday: 10:00 AM - 4:00 PM'],
      description: 'We\'re here to help'
    }
  ]

  const faqs = [
    {
      question: 'How do I place an order?',
      answer: 'You can place an order through our website by browsing our flower collections, adding items to your cart, and completing the checkout process with MoMo or BK payment.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept Mobile Money (MoMo) and Bank of Kigali (BK) transfers. All payments go directly to our business accounts for security.'
    },
    {
      question: 'Do you deliver outside Kigali?',
      answer: 'Yes, we deliver throughout Rwanda. Delivery fees vary by location. Free delivery is available in Kigali for orders above RWF 50,000.'
    },
    {
      question: 'How far in advance should I order?',
      answer: 'For same-day delivery in Kigali, please order before 2 PM. For special events or large orders, we recommend ordering at least 3-5 days in advance.'
    },
    {
      question: 'Can I customize my flower arrangement?',
      answer: 'Absolutely! We offer custom arrangements for special occasions. Contact us with your requirements and we\'ll create something unique for you.'
    },
    {
      question: 'What if I\'m not satisfied with my order?',
      answer: 'Customer satisfaction is our priority. If you\'re not completely satisfied, contact us within 24 hours and we\'ll make it right.'
    }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields')
      return
    }

    // Simulate form submission
    toast.success('Thank you for your message! We\'ll get back to you soon.')
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-pink-50 via-white to-rose-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Get in <span className="text-gradient bg-gradient-to-r from-pink-600 to-rose-600">Touch</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Have questions about our flowers or need help with your order? 
              We&apos;re here to help! Reach out to us and we&apos;ll get back to you as soon as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactMethods.map((method, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg text-center">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <method.icon className="h-8 w-8 text-pink-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{method.title}</h3>
                <div className="space-y-1 mb-3">
                  {method.details.map((detail, idx) => (
                    <p key={idx} className="text-gray-600">{detail}</p>
                  ))}
                </div>
                <p className="text-sm text-gray-500">{method.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="+250 784 586 110"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="order">Order Question</option>
                      <option value="custom">Custom Arrangement</option>
                      <option value="delivery">Delivery Question</option>
                      <option value="payment">Payment Issue</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Tell us how we can help you..."
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-pink-700 hover:to-rose-700 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Send className="h-5 w-5" />
                  Send Message
                </button>
              </form>
            </div>

            {/* Map & Quick Info */}
            <div className="space-y-8">
              {/* Map Placeholder */}
              <div className="bg-gray-200 rounded-2xl h-64 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Interactive Map Coming Soon</p>
                  <p className="text-sm text-gray-500">Kigali, Rwanda</p>
                </div>
              </div>

              {/* Quick Contact Info */}
              <div className="bg-gradient-to-r from-pink-600 to-rose-600 rounded-2xl p-6 text-white">
                <h3 className="text-xl font-bold mb-4">Quick Contact</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5" />
                    <span>+250 784 586 110</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5" />
                    <span>hello@akazubaflorist.com</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5" />
                    <span>Mon - Sat: 8:00 AM - 8:00 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Find answers to common questions about our flower services
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          {/* Still Have Questions */}
          <div className="text-center mt-12">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <MessageSquare className="h-12 w-12 text-pink-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Still Have Questions?
              </h3>
              <p className="text-gray-600 mb-6">
                Can&apos;t find what you&apos;re looking for? Contact us directly and we&apos;ll be happy to help!
              </p>
              <button className="bg-gradient-to-r from-pink-600 to-rose-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-pink-700 hover:to-rose-700 transition-all duration-300">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ContactPage 