'use client'

import React, { useState } from 'react'
import { 
  Settings, 
  Store, 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  Save,
  Globe,
  CreditCard
} from 'lucide-react'

interface BusinessSettings {
  businessName: string
  phone: string
  email: string
  address: string
  businessHours: string
  currency: string
  paymentMethods: string[]
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<BusinessSettings>({
    businessName: 'Akazuba Florist',
    phone: '+250 789 123 456',
    email: 'info@akazubaflorist.com',
    address: 'Kigali, Rwanda',
    businessHours: 'Monday - Friday: 8:00 AM - 6:00 PM, Saturday: 9:00 AM - 4:00 PM',
    currency: 'RWF',
    paymentMethods: ['MoMo', 'BK', 'Cash on Delivery']
  })

  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate saving
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsEditing(false)
    setIsSaving(false)
    // In real app, save to backend/database
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Reset to original values
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-4 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">Business Settings</h1>
            <p className="text-purple-100 text-sm sm:text-lg">
              Configure your business information and preferences
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Settings className="h-6 w-6" />
            <span className="text-lg font-semibold">Configuration</span>
          </div>
        </div>
      </div>

      {/* Settings Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Business Information</h2>
          <div className="flex space-x-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Settings className="h-4 w-4" />
                <span>Edit Settings</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Business Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Store className="h-4 w-4 inline mr-2" />
              Business Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={settings.businessName}
                onChange={(e) => setSettings(prev => ({ ...prev, businessName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900 font-medium">{settings.businessName}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="h-4 w-4 inline mr-2" />
              Phone Number
            </label>
            {isEditing ? (
              <input
                type="tel"
                value={settings.phone}
                onChange={(e) => setSettings(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900 font-medium">{settings.phone}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="h-4 w-4 inline mr-2" />
              Email Address
            </label>
            {isEditing ? (
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900 font-medium">{settings.email}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="h-4 w-4 inline mr-2" />
              Business Address
            </label>
            {isEditing ? (
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings(prev => ({ ...prev, address: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900 font-medium">{settings.address}</p>
            )}
          </div>

          {/* Business Hours */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="h-4 w-4 inline mr-2" />
              Business Hours
            </label>
            {isEditing ? (
              <textarea
                value={settings.businessHours}
                onChange={(e) => setSettings(prev => ({ ...prev, businessHours: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900 font-medium">{settings.businessHours}</p>
            )}
          </div>

          {/* Currency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Globe className="h-4 w-4 inline mr-2" />
              Currency
            </label>
            {isEditing ? (
              <select
                value={settings.currency}
                onChange={(e) => setSettings(prev => ({ ...prev, currency: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="RWF">Rwandan Franc (RWF)</option>
                <option value="USD">US Dollar (USD)</option>
                <option value="EUR">Euro (EUR)</option>
              </select>
            ) : (
              <p className="text-gray-900 font-medium">{settings.currency}</p>
            )}
          </div>

          {/* Payment Methods */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <CreditCard className="h-4 w-4 inline mr-2" />
              Payment Methods
            </label>
            {isEditing ? (
              <div className="space-y-2">
                {['MoMo', 'BK', 'Cash on Delivery', 'Bank Transfer'].map((method) => (
                  <label key={method} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={settings.paymentMethods.includes(method)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSettings(prev => ({
                            ...prev,
                            paymentMethods: [...prev.paymentMethods, method]
                          }))
                        } else {
                          setSettings(prev => ({
                            ...prev,
                            paymentMethods: prev.paymentMethods.filter(m => m !== method)
                          }))
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{method}</span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {settings.paymentMethods.map((method) => (
                  <span
                    key={method}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {method}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <button className="flex items-center justify-center p-3 sm:p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
            <Store className="h-5 w-5 mr-2" />
            <span className="text-sm sm:text-base font-medium">Business Profile</span>
          </button>
          <button className="flex items-center justify-center p-3 sm:p-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
            <CreditCard className="h-5 w-5 mr-2" />
            <span className="text-sm sm:text-base font-medium">Payment Setup</span>
          </button>
          <button className="flex items-center justify-center p-3 sm:p-4 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
            <Globe className="h-5 w-5 mr-2" />
            <span className="text-sm sm:text-base font-medium">Localization</span>
          </button>
        </div>
      </div>
    </div>
  )
}
