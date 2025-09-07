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
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // General Settings
  const [generalSettings, setGeneralSettings] = useState({
    shopName: 'Akazuba Florist',
    tagline: 'Rwanda\'s premier floral destination',
    contactEmail: 'info.akazubaflorist@gmail.com',
    phoneNumber: '0784586110',
    address: 'Kigali, Rwanda',
    businessHours: 'Mon - Sat: 8:00 AM - 8:00 PM',
    sundayHours: 'Sunday: 10:00 AM - 4:00 PM'
  })

  // Payment Settings
  const [paymentSettings, setPaymentSettings] = useState({
    momoAccountNumber: '0784586110',
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
    instagram: 'https://www.instagram.com/akazuba_florists?igsh=aXdsY203Y3Eza2x4',
    facebook: '',
    twitter: '',
    whatsapp: '0784586110'
  })

  // About Page Content
  const [aboutPageContent, setAboutPageContent] = useState({
    heroTitle: 'About Akazuba Florist',
    heroSubtitle: 'Rwanda\'s premier destination for premium flowers and luxury perfumes. We bring you the world\'s finest floral arrangements and exquisite fragrances, delivered fresh to your door with love and care.',
    storyTitle: 'Our Story',
    storyParagraph1: 'Founded in 2019 by Diane Akazuba, our journey began with a simple dream: to bring the beauty of fresh flowers and luxury fragrances to every corner of Rwanda. What started as a small home-based business in Kigali has grown into Rwanda\'s most trusted floral and fragrance destination, serving over 2,500 satisfied customers across the country.',
    storyParagraph2: 'Diane\'s love for flowers was born from her childhood in the hills of Rwanda, where she spent countless hours admiring the natural beauty of her homeland. Her passion for creating beautiful arrangements began when she started making bouquets for family celebrations and local events. Word of her talent spread quickly through the community.',
    storyParagraph3: 'Today, we offer an extensive collection of fresh flowers, elegant bouquets, and luxury perfumes. From intimate birthday celebrations to grand weddings, corporate events to romantic gestures, we create memorable experiences that celebrate life\'s most precious moments right here in Rwanda.',
    storyParagraph4: 'Our commitment extends beyond products - we work directly with local flower growers, support Rwandan communities, and ensure every customer receives personalized service that reflects the warmth and hospitality of our beautiful country.',
    stats: [
      { value: '2,500+', label: 'Happy Customers' },
      { value: '4.8★', label: 'Customer Rating' },
      { value: '5,000+', label: 'Orders Delivered' },
      { value: '5+', label: 'Years of Excellence' }
    ]
  })

  // Contact Page Content
  const [contactPageContent, setContactPageContent] = useState({
    heroTitle: 'Contact Us',
    heroSubtitle: 'We\'re here to help! Get in touch with us for any questions about our products, orders, or services.',
    phone1: '+250 784 586 110',
    phone2: '+250 784 586 110',
    whatsapp: '+250 784 586 110',
    email1: 'info@akazuba.com',
    email2: 'support@akazuba.com',
    email3: 'orders@akazuba.com',
    address: 'Kigali, Rwanda',
    addressDetail: 'Kimihurura, KG 123 St',
    landmark: 'Near Kigali Convention Centre',
    hoursWeekdays: 'Monday - Friday: 8:00 AM - 6:00 PM',
    hoursSaturday: 'Saturday: 9:00 AM - 4:00 PM',
    hoursSunday: 'Sunday: Closed',
    emergencyNote: 'Emergency orders: Available 24/7'
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

  const handleAboutPageContentChange = (field: string, value: string) => {
    setAboutPageContent(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleContactPageContentChange = (field: string, value: string) => {
    setContactPageContent(prev => ({
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

  const loadContent = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/settings/public', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success && result.data) {
          // Load saved content if available
          const settings = result.data
          
          // You can extend this to load specific content sections
          // For now, we'll keep the default values
          console.log('Loaded settings:', settings)
        }
      }
    } catch (error) {
      console.error('Error loading content:', error)
      // Don't show error toast for loading, just use defaults
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setIsLoading(true)
      
      // Prepare all content data
      const contentData = {
        general: generalSettings,
        payment: paymentSettings,
        hero: heroContent,
        about: aboutContent,
        social: socialMedia,
        aboutPage: aboutPageContent
      }

      // Save to backend
      const response = await fetch('/api/admin/settings/public', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          contentManager: contentData
        })
      })

      if (!response.ok) {
        throw new Error('Failed to save content')
      }

      const result = await response.json()
      
      if (result.success) {
        toast.success('Content saved successfully!')
        // Optionally close the modal after successful save
        // onClose()
      } else {
        throw new Error(result.message || 'Failed to save content')
      }
    } catch (error) {
      console.error('Error saving content:', error)
      toast.error('Failed to save content. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Load content when modal opens
  React.useEffect(() => {
    if (isOpen) {
      loadContent()
    }
  }, [isOpen])

  const tabs = [
    { id: 'general', name: 'General Settings', icon: Settings },
    { id: 'payment', name: 'Payment Info', icon: DollarSign },
    { id: 'hero', name: 'Hero Section', icon: ImageIcon },
    { id: 'about', name: 'About Section', icon: FileText },
    { id: 'about-page', name: 'About Page', icon: Users },
    { id: 'contact-page', name: 'Contact Page', icon: Phone },
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
                        placeholder="Enter value"
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
                        placeholder="Enter label"
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
                    placeholder="https://www.instagram.com/akazuba_florists?igsh=aXdsY203Y3Eza2x4"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Facebook URL</label>
                  <input
                    type="url"
                    value={socialMedia.facebook}
                    onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="https://facebook.com/akazubaflorist"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Twitter URL</label>
                  <input
                    type="url"
                    value={socialMedia.twitter}
                    onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="https://twitter.com/akazubaflorist"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Number</label>
                  <input
                    type="tel"
                    value={socialMedia.whatsapp}
                    onChange={(e) => handleSocialMediaChange('whatsapp', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="0784586110"
                  />
                </div>
              </div>
            </div>
          )}

          {/* About Page Tab */}
          {activeTab === 'about-page' && (
            <div className="p-6 space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">About Page Content</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hero Title</label>
                  <input
                    type="text"
                    value={aboutPageContent.heroTitle}
                    onChange={(e) => handleAboutPageContentChange('heroTitle', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hero Subtitle</label>
                  <textarea
                    rows={3}
                    value={aboutPageContent.heroSubtitle}
                    onChange={(e) => handleAboutPageContentChange('heroSubtitle', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Story Title</label>
                  <input
                    type="text"
                    value={aboutPageContent.storyTitle}
                    onChange={(e) => handleAboutPageContentChange('storyTitle', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Story Paragraph 1</label>
                  <textarea
                    rows={3}
                    value={aboutPageContent.storyParagraph1}
                    onChange={(e) => handleAboutPageContentChange('storyParagraph1', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Story Paragraph 2</label>
                  <textarea
                    rows={3}
                    value={aboutPageContent.storyParagraph2}
                    onChange={(e) => handleAboutPageContentChange('storyParagraph2', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Story Paragraph 3</label>
                  <textarea
                    rows={3}
                    value={aboutPageContent.storyParagraph3}
                    onChange={(e) => handleAboutPageContentChange('storyParagraph3', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Story Paragraph 4</label>
                  <textarea
                    rows={3}
                    value={aboutPageContent.storyParagraph4}
                    onChange={(e) => handleAboutPageContentChange('storyParagraph4', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Contact Page Tab */}
          {activeTab === 'contact-page' && (
            <div className="p-6 space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Contact Page Content</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hero Title</label>
                  <input
                    type="text"
                    value={contactPageContent.heroTitle}
                    onChange={(e) => handleContactPageContentChange('heroTitle', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hero Subtitle</label>
                  <textarea
                    rows={2}
                    value={contactPageContent.heroSubtitle}
                    onChange={(e) => handleContactPageContentChange('heroSubtitle', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number 1</label>
                    <input
                      type="tel"
                      value={contactPageContent.phone1}
                      onChange={(e) => handleContactPageContentChange('phone1', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number 2</label>
                    <input
                      type="tel"
                      value={contactPageContent.phone2}
                      onChange={(e) => handleContactPageContentChange('phone2', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Number</label>
                    <input
                      type="tel"
                      value={contactPageContent.whatsapp}
                      onChange={(e) => handleContactPageContentChange('whatsapp', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email 1</label>
                    <input
                      type="email"
                      value={contactPageContent.email1}
                      onChange={(e) => handleContactPageContentChange('email1', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email 2</label>
                    <input
                      type="email"
                      value={contactPageContent.email2}
                      onChange={(e) => handleContactPageContentChange('email2', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email 3</label>
                    <input
                      type="email"
                      value={contactPageContent.email3}
                      onChange={(e) => handleContactPageContentChange('email3', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <input
                      type="text"
                      value={contactPageContent.address}
                      onChange={(e) => handleContactPageContentChange('address', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address Detail</label>
                    <input
                      type="text"
                      value={contactPageContent.addressDetail}
                      onChange={(e) => handleContactPageContentChange('addressDetail', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Landmark</label>
                    <input
                      type="text"
                      value={contactPageContent.landmark}
                      onChange={(e) => handleContactPageContentChange('landmark', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Note</label>
                    <input
                      type="text"
                      value={contactPageContent.emergencyNote}
                      onChange={(e) => handleContactPageContentChange('emergencyNote', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Weekdays Hours</label>
                    <input
                      type="text"
                      value={contactPageContent.hoursWeekdays}
                      onChange={(e) => handleContactPageContentChange('hoursWeekdays', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Saturday Hours</label>
                    <input
                      type="text"
                      value={contactPageContent.hoursSaturday}
                      onChange={(e) => handleContactPageContentChange('hoursSaturday', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sunday Hours</label>
                    <input
                      type="text"
                      value={contactPageContent.hoursSunday}
                      onChange={(e) => handleContactPageContentChange('hoursSunday', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end pt-6 border-t border-gray-200">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className={`px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg transition-all duration-300 flex items-center space-x-2 ${
                isLoading 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:from-pink-700 hover:to-rose-700'
              }`}
            >
              <Save className="h-4 w-4" />
              <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContentManager 