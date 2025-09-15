'use client'

import React, { useState, useEffect } from 'react'
import { 
  Save, 
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Store,
  Mail,
  Phone,
  MapPin,
  Globe,
  DollarSign
} from 'lucide-react'

interface StoreSettings {
  storeName: string
  storeEmail: string
  storePhone: string
  storeAddress: string
  storeWebsite: string
  currency: string
  taxRate: number
  deliveryFee: number
  freeDeliveryThreshold: number
  businessHours: string
  aboutUs: string
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<StoreSettings>({
    storeName: 'Akazuba Florist',
    storeEmail: 'info@akazuba.com',
    storePhone: '+250 788 123 456',
    storeAddress: 'Kigali, Rwanda',
    storeWebsite: 'https://akazuba.com',
    currency: 'RWF',
    taxRate: 18,
    deliveryFee: 2000,
    freeDeliveryThreshold: 10000,
    businessHours: 'Mon-Sat: 8AM-6PM, Sun: 10AM-4PM',
    aboutUs: 'Your trusted florist for beautiful flowers and perfumes in Rwanda.'
  })
  
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      setError(null)

      const token = localStorage.getItem('accessToken')
      const headers: Record<string, string> = {}
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      
      const response = await fetch('/api/admin/settings', { headers })
      if (response.ok) {
        const data = await response.json()
        if (data.data) {
          setSettings({ ...settings, ...data.data })
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
      setError('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setSettings(prev => ({
      ...prev,
      [name]: name === 'taxRate' || name === 'deliveryFee' || name === 'freeDeliveryThreshold' 
        ? Number(value) 
        : value
    }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setSaving(true)
      setError(null)
      setSuccess(null)

      const token = localStorage.getItem('accessToken')
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers,
        body: JSON.stringify(settings)
      })
      
      if (response.ok) {
        setSuccess('Settings saved successfully!')
        setTimeout(() => setSuccess(null), 3000)
      } else {
        throw new Error('Failed to save settings')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      setError('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Store Settings</h1>
          <p className="text-gray-600 mt-2">Configure your store settings and preferences</p>
        </div>
        <button
          onClick={fetchSettings}
          className="flex items-center space-x-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-green-800 text-sm">{success}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800 text-sm">{error}</p>
      </div>
    </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Store Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Store className="w-6 h-6 text-pink-600" />
            <h2 className="text-xl font-semibold text-gray-900">Store Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
              <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 mb-2">
                Store Name
              </label>
              <input
                type="text"
                id="storeName"
                name="storeName"
                value={settings.storeName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Enter store name"
              />
            </div>

            <div>
              <label htmlFor="storeEmail" className="block text-sm font-medium text-gray-700 mb-2">
                Store Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="email"
                  id="storeEmail"
                  name="storeEmail"
                  value={settings.storeEmail}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Enter store email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="storePhone" className="block text-sm font-medium text-gray-700 mb-2">
                Store Phone
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="tel"
                  id="storePhone"
                  name="storePhone"
                  value={settings.storePhone}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Enter store phone"
                />
              </div>
            </div>

            <div>
              <label htmlFor="storeWebsite" className="block text-sm font-medium text-gray-700 mb-2">
                Store Website
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="url"
                  id="storeWebsite"
                  name="storeWebsite"
                  value={settings.storeWebsite}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Enter store website"
            />
          </div>
        </div>
      </div>

          <div className="mt-6">
            <label htmlFor="storeAddress" className="block text-sm font-medium text-gray-700 mb-2">
              Store Address
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
              <textarea
                id="storeAddress"
                name="storeAddress"
                value={settings.storeAddress}
                onChange={handleInputChange}
                rows={3}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Enter store address"
              />
            </div>
            </div>

          <div className="mt-6">
            <label htmlFor="businessHours" className="block text-sm font-medium text-gray-700 mb-2">
              Business Hours
            </label>
                <input
              type="text"
              id="businessHours"
              name="businessHours"
              value={settings.businessHours}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Enter business hours"
            />
          </div>

          <div className="mt-6">
            <label htmlFor="aboutUs" className="block text-sm font-medium text-gray-700 mb-2">
              About Us
            </label>
            <textarea
              id="aboutUs"
              name="aboutUs"
              value={settings.aboutUs}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Enter store description"
            />
          </div>
        </div>

        {/* Financial Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <DollarSign className="w-6 h-6 text-pink-600" />
            <h2 className="text-xl font-semibold text-gray-900">Financial Settings</h2>
            </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-2">
                Currency
              </label>
                <select
                id="currency"
                name="currency"
                value={settings.currency}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="RWF">RWF (Rwandan Franc)</option>
                <option value="USD">USD (US Dollar)</option>
                <option value="EUR">EUR (Euro)</option>
                </select>
            </div>

            <div>
              <label htmlFor="taxRate" className="block text-sm font-medium text-gray-700 mb-2">
                Tax Rate (%)
              </label>
                      <input
              type="number"
                id="taxRate"
                name="taxRate"
                value={settings.taxRate}
                onChange={handleInputChange}
                min="0"
                max="100"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="0"
            />
                </div>
          
                <div>
              <label htmlFor="deliveryFee" className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Fee ({settings.currency})
              </label>
              <input
                type="number"
                id="deliveryFee"
                name="deliveryFee"
                value={settings.deliveryFee}
                onChange={handleInputChange}
                min="0"
                step="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="0"
              />
            </div>

            <div>
              <label htmlFor="freeDeliveryThreshold" className="block text-sm font-medium text-gray-700 mb-2">
                Free Delivery Threshold ({settings.currency})
              </label>
              <input
                type="number"
                id="freeDeliveryThreshold"
                name="freeDeliveryThreshold"
                value={settings.freeDeliveryThreshold}
                onChange={handleInputChange}
                min="0"
                step="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
      <div className="flex items-center justify-end">
        <button 
            type="submit"
            disabled={saving}
            className="flex items-center space-x-2 px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
            </>
          ) : (
            <>
                <Save className="w-4 h-4" />
                <span>Save Settings</span>
            </>
          )}
          </button>
      </div>
      </form>
    </div>
  )
}