'use client'

import React, { useState, useRef } from 'react'
import { X, Save, Upload, Image as ImageIcon, FileText, Settings, Globe, Mail, Phone, MapPin, DollarSign, Users, Package } from 'lucide-react'
import toast from 'react-hot-toast'

interface ContentManagerProps {
  isOpen: boolean
  onClose: () => void
}

const ContentManager = ({ isOpen, onClose }: ContentManagerProps) => {
  const [activeTab, setActiveTab] = useState('general')
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // General Settings
  const [generalSettings, setGeneralSettings] = useState({
    shopName: 'Akazuba Florist',
    tagline: 'Rwanda\'s premier floral destination',
    contactEmail: 'hello@akazubaflorist.com',
    phoneNumber: '+250 784 586 110',
    address: 'Kigali, Rwanda',
    businessHours: 'Mon - Sat: 8:00 AM - 8:00 PM',
    sundayHours: 'Sunday: 10:00 AM - 4:00 PM'
  })

  // Payment Settings
  const [paymentSettings, setPaymentSettings] = useState({
    momoAccountNumber: '0784 5861 10',
    momoAccountName: 'Umwali Diane',
    bkAccountNumber: '100161182448',
    bkAccountName: 'Umwali Diane',
    freeDeliveryThreshold: '50000',
    deliveryFee: '2000'
  })

  // Hero Section
  const [heroContent, setHeroContent] = useState({
    title: 'Discover the Magic of Flowers',
    subtitle: 'Premium floral arrangements delivered to your doorstep',
    ctaText: 'Shop Now',
    backgroundImage: '/images/hero-bg.jpg'
  })

  // About Section
  const [aboutContent, setAboutContent] = useState({
    title: 'About Akazuba Florist',
    description: 'Founded with a passion for beauty and elegance, Akazuba Florist has been bringing the finest flowers and handcrafted arrangements to Rwanda since 2021.',
    stats: [
      { value: '500+', label: 'Happy Customers' },
      { value: '4.9★', label: 'Average Rating' },
      { value: '1000+', label: 'Bouquets Delivered' },
      { value: '3+', label: 'Years of Excellence' }
    ]
  })

  // Social Media
  const [socialMedia, setSocialMedia] = useState({
    instagram: 'https://www.instagram.com/akazuba_florists',
    facebook: '',
    twitter: '',
    whatsapp: '+250784586110'
  })

  const handleGeneralSettingsChange = (field: string, value: string) => {
    setGeneralSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePaymentSettingsChange = (field: string, value: string) => {
    setPaymentSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleHeroContentChange = (field: string, value: string) => {
    setHeroContent(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAboutContentChange = (field: string, value: string) => {
    setAboutContent(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSocialMediaChange = (field: string, value: string) => {
    setSocialMedia(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    setIsUploading(true)
    try {
      // Simulate image upload
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success('Image uploaded successfully!')
    } catch (error) {
      toast.error('Failed to upload image')
    } finally {
      setIsUploading(false)
    }
  }

  const handleSave = async () => {
    try {
      // Simulate saving
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Content saved successfully!')
    } catch (error) {
      toast.error('Failed to save content')
    }
  }

  const tabs = [
    { id: 'general', name: 'General Settings', icon: Settings },
    { id: 'payment', name: 'Payment Info', icon: DollarSign },
    { id: 'hero', name: 'Hero Section', icon: ImageIcon },
    { id: 'about', name: 'About Section', icon: FileText },
    { id: 'social', name: 'Social Media', icon: Globe }
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6 text-pink-600" />
            <h2 className="text-xl font-bold text-gray-900">Content Manager</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-pink-500 text-pink-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">General Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Shop Name</label>
                  <input
                    type="text"
                    value={generalSettings.shopName}
                    onChange={(e) => handleGeneralSettingsChange('shopName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tagline</label>
                  <input
                    type="text"
                    value={generalSettings.tagline}
                    onChange={(e) => handleGeneralSettingsChange('tagline', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                  <input
                    type="email"
                    value={generalSettings.contactEmail}
                    onChange={(e) => handleGeneralSettingsChange('contactEmail', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={generalSettings.phoneNumber}
                    onChange={(e) => handleGeneralSettingsChange('phoneNumber', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <input
                    type="text"
                    value={generalSettings.address}
                    onChange={(e) => handleGeneralSettingsChange('address', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Hours</label>
                  <input
                    type="text"
                    value={generalSettings.businessHours}
                    onChange={(e) => handleGeneralSettingsChange('businessHours', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sunday Hours</label>
                  <input
                    type="text"
                    value={generalSettings.sundayHours}
                    onChange={(e) => handleGeneralSettingsChange('sundayHours', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Payment Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">MoMo Account Number</label>
                  <input
                    type="text"
                    value={paymentSettings.momoAccountNumber}
                    onChange={(e) => handlePaymentSettingsChange('momoAccountNumber', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">MoMo Account Name</label>
                  <input
                    type="text"
                    value={paymentSettings.momoAccountName}
                    onChange={(e) => handlePaymentSettingsChange('momoAccountName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">BK Account Number</label>
                  <input
                    type="text"
                    value={paymentSettings.bkAccountNumber}
                    onChange={(e) => handlePaymentSettingsChange('bkAccountNumber', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">BK Account Name</label>
                  <input
                    type="text"
                    value={paymentSettings.bkAccountName}
                    onChange={(e) => handlePaymentSettingsChange('bkAccountName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Free Delivery Threshold (RWF)</label>
                  <input
                    type="number"
                    value={paymentSettings.freeDeliveryThreshold}
                    onChange={(e) => handlePaymentSettingsChange('freeDeliveryThreshold', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Fee (RWF)</label>
                  <input
                    type="number"
                    value={paymentSettings.deliveryFee}
                    onChange={(e) => handlePaymentSettingsChange('deliveryFee', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'hero' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Hero Section</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hero Title</label>
                  <input
                    type="text"
                    value={heroContent.title}
                    onChange={(e) => handleHeroContentChange('title', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hero Subtitle</label>
                  <input
                    type="text"
                    value={heroContent.subtitle}
                    onChange={(e) => handleHeroContentChange('subtitle', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CTA Button Text</label>
                  <input
                    type="text"
                    value={heroContent.ctaText}
                    onChange={(e) => handleHeroContentChange('ctaText', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hero Background Image</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-pink-400 transition-colors">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="flex flex-col items-center space-y-2 text-gray-600 hover:text-pink-600 transition-colors"
                  >
                    {isUploading ? (
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
                    ) : (
                      <Upload className="h-8 w-8" />
                    )}
                    <span className="text-sm">
                      {isUploading ? 'Uploading...' : 'Upload Hero Background'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">About Section</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">About Title</label>
                <input
                  type="text"
                  value={aboutContent.title}
                  onChange={(e) => handleAboutContentChange('title', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">About Description</label>
                <textarea
                  value={aboutContent.description}
                  onChange={(e) => handleAboutContentChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">Statistics</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {aboutContent.stats.map((stat, index) => (
                    <div key={index} className="flex space-x-2">
                      <input
                        type="text"
                        value={stat.value}
                        onChange={(e) => {
                          const newStats = [...aboutContent.stats]
                          newStats[index].value = e.target.value
                          setAboutContent(prev => ({ ...prev, stats: newStats }))
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        placeholder="Value"
                      />
                      <input
                        type="text"
                        value={stat.label}
                        onChange={(e) => {
                          const newStats = [...aboutContent.stats]
                          newStats[index].label = e.target.value
                          setAboutContent(prev => ({ ...prev, stats: newStats }))
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        placeholder="Label"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'social' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Social Media Links</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Instagram URL</label>
                  <input
                    type="url"
                    value={socialMedia.instagram}
                    onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="https://instagram.com/..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Facebook URL</label>
                  <input
                    type="url"
                    value={socialMedia.facebook}
                    onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="https://facebook.com/..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Twitter URL</label>
                  <input
                    type="url"
                    value={socialMedia.twitter}
                    onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="https://twitter.com/..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Number</label>
                  <input
                    type="tel"
                    value={socialMedia.whatsapp}
                    onChange={(e) => handleSocialMediaChange('whatsapp', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="+250..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end pt-6 border-t border-gray-200">
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg hover:from-pink-700 hover:to-rose-700 transition-all duration-300 flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContentManager 