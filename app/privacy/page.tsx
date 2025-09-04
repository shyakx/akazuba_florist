'use client'

import React from 'react'
import { Shield, Lock, Eye, Users, FileText, Calendar, Phone, Mail } from 'lucide-react'
import Link from 'next/link'
import Footer from '@/components/Footer'

const PrivacyPage = () => {
  const privacySections = [
    {
      title: 'Information We Collect',
      icon: FileText,
      content: [
        'Personal information (name, email, phone number, address)',
        'Payment information (processed securely through our payment partners)',
        'Order history and preferences',
        'Website usage data and cookies',
        'Communication records when you contact us'
      ]
    },
    {
      title: 'How We Use Your Information',
      icon: Users,
      content: [
        'Process and fulfill your orders',
        'Communicate about your orders and deliveries',
        'Send promotional offers (with your consent)',
        'Improve our services and website',
        'Provide customer support',
        'Comply with legal obligations'
      ]
    },
    {
      title: 'Information Sharing',
      icon: Shield,
      content: [
        'We do not sell your personal information',
        'Share with delivery partners for order fulfillment',
        'Share with payment processors for secure transactions',
        'Share with legal authorities when required by law',
        'Share with service providers who assist our operations'
      ]
    },
    {
      title: 'Data Security',
      icon: Lock,
      content: [
        'Encryption of sensitive data',
        'Secure payment processing',
        'Regular security audits',
        'Limited access to personal information',
        'Secure data storage practices'
      ]
    },
    {
      title: 'Your Rights',
      icon: Eye,
      content: [
        'Access your personal information',
        'Correct inaccurate information',
        'Request deletion of your data',
        'Opt-out of marketing communications',
        'Withdraw consent at any time'
      ]
    },
    {
      title: 'Data Retention',
      icon: Calendar,
      content: [
        'Order information: 7 years for tax purposes',
        'Account information: Until account deletion',
        'Marketing data: Until consent withdrawal',
        'Website analytics: 2 years',
        'Communication records: 3 years'
      ]
    }
  ]

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: 'privacy@akazubaflorist.com',
      href: 'mailto:privacy@akazubaflorist.com'
    },
    {
      icon: Phone,
      label: 'Phone',
              value: '0784586110',
              href: 'tel:0784586110'
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
                <Shield className="h-10 w-10 text-pink-600" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
            </p>
            <p className="text-sm text-gray-500">
              Last updated: January 2024
            </p>
          </div>
        </div>
      </div>

      {/* Privacy Policy Content */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Introduction */}
          <div className="card p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Introduction
            </h2>
            <p className="text-gray-600 mb-4">
              At Akazuba Florist, we are committed to protecting your privacy and ensuring the security of your personal information. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, 
              make purchases, or interact with our services.
            </p>
            <p className="text-gray-600">
              By using our services, you agree to the collection and use of information in accordance with this policy. 
              If you have any questions about this Privacy Policy, please contact us.
            </p>
          </div>

          {/* Privacy Sections */}
          <div className="space-y-8">
            {privacySections.map((section, index) => (
              <div key={index} className="card p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-pink-100 rounded-lg">
                    <section.icon className="h-6 w-6 text-pink-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {section.title}
                  </h3>
                </div>
                
                <ul className="space-y-3">
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Cookies Policy */}
          <div className="card p-8 mt-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Cookies Policy
            </h3>
            <p className="text-gray-600 mb-4">
              We use cookies and similar tracking technologies to enhance your browsing experience, analyze website traffic, 
              and understand where our visitors are coming from.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Essential Cookies</h4>
                <p className="text-gray-600 text-sm">
                  Required for the website to function properly. These cannot be disabled.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Analytics Cookies</h4>
                <p className="text-gray-600 text-sm">
                  Help us understand how visitors interact with our website to improve user experience.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="card p-8 mt-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Contact Us
            </h3>
            <p className="text-gray-600 mb-6">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {contactInfo.map((contact, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-pink-100 rounded-lg">
                    <contact.icon className="h-5 w-5 text-pink-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{contact.label}</p>
                    <a 
                      href={contact.href}
                      className="text-gray-900 hover:text-pink-600 transition-colors"
                    >
                      {contact.value}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Updates */}
          <div className="card p-8 mt-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Updates to This Policy
            </h3>
            <p className="text-gray-600 mb-4">
              We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, 
              legal, or regulatory reasons. We will notify you of any material changes by posting the new Privacy Policy on this page 
              and updating the &quot;Last updated&quot; date.
            </p>
            <p className="text-gray-600">
              We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
              <div className="py-20 bg-pink-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Questions About Privacy?
          </h2>
          <p className="text-xl text-pink-100 mb-8 max-w-2xl mx-auto">
            We&apos;re here to help. Contact us if you have any questions about our privacy practices or your personal information.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-pink-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
            >
              Contact Us
            </Link>
            <Link
              href="/"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-pink-600 transition-colors"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default PrivacyPage 
