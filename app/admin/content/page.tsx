'use client'

import { useState, useEffect } from 'react'
import { Save, Eye, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react'

interface ContentData {
  hero: {
    title: string
    subtitle: string
    backgroundImage: string
    ctaText: string
    ctaLink: string
  }
  about: {
    title: string
    description: string
    image: string
  }
  contact: {
    address: string
    phone: string
    email: string
    hours: string
  }
  footer: {
    description: string
    socialLinks: {
      facebook: string
      instagram: string
      twitter: string
    }
  }
  seo: {
    siteTitle: string
    siteDescription: string
    keywords: string
  }
}

export default function ContentManagement() {
  const [content, setContent] = useState<ContentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      setLoading(true)
      setMessage(null)
      
      // Simplified: Use default content for now
      setContent({
        hero: {
          title: 'Welcome to Akazuba',
          subtitle: 'Beautiful flowers and perfumes for every occasion',
          backgroundImage: '/images/hero-bg.jpg',
          ctaText: 'Shop Now',
          ctaLink: '/products'
        },
        about: {
          title: 'About Us',
          description: 'We are passionate about providing the finest flowers and perfumes.',
          image: '/images/about.jpg'
        },
        contact: {
          address: 'Kigali, Rwanda',
          phone: '+250 788 123 456',
          email: 'info@akazuba.com',
          hours: 'Mon-Sat: 8AM-6PM'
        },
        footer: {
          description: 'Your trusted florist for beautiful flowers and perfumes.',
          socialLinks: {
            facebook: 'https://facebook.com/akazuba',
            instagram: 'https://instagram.com/akazuba',
            twitter: 'https://twitter.com/akazuba'
          }
        },
        seo: {
          siteTitle: 'Akazuba - Flowers & Perfumes',
          siteDescription: 'Beautiful flowers and perfumes for every occasion',
          keywords: 'flowers, perfumes, gifts, Rwanda'
        }
      })
    } catch (error) {
      console.error('Error setting content:', error)
      setMessage({ type: 'error', text: 'Failed to load content' })
    } finally {
      setLoading(false)
    }
  }

  const saveContent = async (section: string, data: any) => {
    try {
      setSaving(true)
      setMessage(null)
      
      // Simplified: Just update local state for now
      setContent(prev => prev ? {
        ...prev,
        [section]: data
      } : null)
      
      setMessage({ type: 'success', text: `${section} content updated successfully!` })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      console.error('Error saving content:', error)
      setMessage({ type: 'error', text: `Failed to update ${section} content` })
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (section: string, field: string, value: string) => {
    if (!content) return
    
    setContent(prev => prev ? {
      ...prev,
      [section]: {
        ...prev[section as keyof ContentData],
        [field]: value
      }
    } : null)
  }

  const handleSocialLinkChange = (platform: string, value: string) => {
    if (!content) return
    
    setContent(prev => prev ? {
      ...prev,
      footer: {
        ...prev.footer,
        socialLinks: {
          ...prev.footer.socialLinks,
          [platform]: value
        }
      }
    } : null)
  }

  const sections = [
    { id: 'hero', name: 'Hero Section', icon: '🏠' },
    { id: 'about', name: 'About Us', icon: 'ℹ️' },
    { id: 'contact', name: 'Contact Info', icon: '📞' },
    { id: 'footer', name: 'Footer', icon: '📄' },
    { id: 'seo', name: 'SEO Settings', icon: '🔍' }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading content...</p>
        </div>
      </div>
    )
  }

  if (!content) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-gray-600">Failed to load content</p>
        <button
          onClick={fetchContent}
          className="mt-4 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4 inline mr-2" />
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
          <p className="text-gray-600">Manage your website content and settings</p>
      </div>
        <button
          onClick={fetchContent}
          className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </button>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg flex items-center ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 mr-2" />
          ) : (
            <AlertCircle className="w-5 h-5 mr-2" />
          )}
          {message.text}
          <button
            onClick={() => setMessage(null)}
            className="ml-auto text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
              </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Content Sections</h3>
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    activeSection === section.id
                      ? 'bg-pink-100 text-pink-700 border border-pink-200'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-2">{section.icon}</span>
                  {section.name}
                </button>
              ))}
            </nav>
          </div>
      </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {/* Content sections will be rendered here */}
            <div className="text-center py-12">
              <p className="text-gray-600">Content form for {activeSection} will be implemented next</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
