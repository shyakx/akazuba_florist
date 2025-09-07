'use client'

import React, { useState } from 'react'
import ContentManager from '@/components/ContentManager'
import { Edit3, FileText, Settings, Globe, Mail, Phone, MapPin, DollarSign, Users, Package } from 'lucide-react'

export default function AdminContentPage() {
  const [isContentManagerOpen, setIsContentManagerOpen] = useState(false)

  const contentSections = [
    {
      title: 'General Settings',
      description: 'Manage shop name, contact information, and business hours',
      icon: Settings,
      color: 'bg-blue-500'
    },
    {
      title: 'Payment Settings',
      description: 'Configure payment methods, delivery fees, and account details',
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      title: 'Hero Section',
      description: 'Customize homepage hero content and call-to-action',
      icon: Globe,
      color: 'bg-purple-500'
    },
    {
      title: 'About Section',
      description: 'Update company information and statistics',
      icon: Users,
      color: 'bg-orange-500'
    },
    {
      title: 'Social Media',
      description: 'Manage social media links and contact information',
      icon: Mail,
      color: 'bg-pink-500'
    },
    {
      title: 'About Page',
      description: 'Edit detailed about page content and team information',
      icon: FileText,
      color: 'bg-indigo-500'
    }
  ]

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <Edit3 className="h-8 w-8 text-pink-600" />
          <h1 className="text-3xl font-bold text-gray-900">Content Manager</h1>
        </div>
        <p className="text-gray-600">
          Manage your website content, settings, and branding from one central location.
        </p>
      </div>

      {/* Quick Access Button */}
      <div className="mb-8">
        <button
          onClick={() => setIsContentManagerOpen(true)}
          className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
        >
          <Edit3 className="h-5 w-5" />
          <span>Open Content Manager</span>
        </button>
      </div>

      {/* Content Sections Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contentSections.map((section, index) => (
          <div
            key={index}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setIsContentManagerOpen(true)}
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className={`p-2 rounded-lg ${section.color}`}>
                <section.icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
            </div>
            <p className="text-gray-600 text-sm">{section.description}</p>
          </div>
        ))}
      </div>

      {/* Instructions */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">How to Use Content Manager</h3>
        <ul className="text-blue-800 space-y-2">
          <li>• Click "Open Content Manager" or any section card above to access the full editor</li>
          <li>• Use the tabs to navigate between different content sections</li>
          <li>• Make your changes and click "Save Changes" to apply them</li>
          <li>• Changes will be reflected on your website immediately</li>
        </ul>
      </div>

      {/* Content Manager Modal */}
      <ContentManager 
        isOpen={isContentManagerOpen} 
        onClose={() => setIsContentManagerOpen(false)} 
      />
    </div>
  )
}
