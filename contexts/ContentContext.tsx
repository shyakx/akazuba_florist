'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

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

interface ContentContextType {
  content: ContentData | null
  loading: boolean
  error: string | null
  refreshContent: () => Promise<void>
}

const ContentContext = createContext<ContentContextType | undefined>(undefined)

// Default content fallback
const defaultContent: ContentData = {
  hero: {
    title: "Welcome to Akazuba Florist",
    subtitle: "Beautiful flowers and fragrances for every occasion",
    backgroundImage: "/images/hero-bg.jpg",
    ctaText: "Shop Now",
    ctaLink: "/products"
  },
  about: {
    title: "About Akazuba Florist",
    description: "We are passionate about providing the finest flowers and perfumes to make your special moments unforgettable. With years of experience in the floral industry, we bring beauty and fragrance to your life.",
    image: "/images/about-us.jpg"
  },
  contact: {
    address: "Kigali, Rwanda",
    phone: "+250 788 123 456",
    email: "info@akazubaflorist.com",
    hours: "Mon-Sat: 8AM-6PM, Sun: 10AM-4PM"
  },
  footer: {
    description: "Your trusted partner for beautiful flowers and exquisite fragrances.",
    socialLinks: {
      facebook: "https://facebook.com/akazubaflorist",
      instagram: "https://instagram.com/akazubaflorist",
      twitter: "https://twitter.com/akazubaflorist"
    }
  },
  seo: {
    siteTitle: "Akazuba Florist - Beautiful Flowers & Perfumes",
    siteDescription: "Premium flowers and fragrances in Rwanda. Wedding bouquets, anniversary gifts, and luxury perfumes.",
    keywords: "flowers, perfumes, Rwanda, wedding, anniversary, gifts"
  }
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<ContentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchContent = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Try to fetch from API first
      const response = await fetch('/api/content')
      
      if (response.ok) {
        const result = await response.json()
        if (result.success && result.data) {
          setContent(result.data)
          return
        }
      }
      
      // Fallback to default content if API fails
      console.warn('⚠️ Content API not available, using default content')
      setContent(defaultContent)
      
    } catch (error) {
      console.error('❌ Error fetching content:', error)
      setError('Failed to load content')
      // Use default content as fallback
      setContent(defaultContent)
    } finally {
      setLoading(false)
    }
  }

  const refreshContent = async () => {
    await fetchContent()
  }

  useEffect(() => {
    fetchContent()
  }, [])

  const value: ContentContextType = {
    content,
    loading,
    error,
    refreshContent
  }

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  )
}

export function useContent() {
  const context = useContext(ContentContext)
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider')
  }
  return context
}

// Hook to get specific content section
export function useContentSection(section: keyof ContentData) {
  const { content, loading, error } = useContent()
  
  return {
    data: content?.[section] || defaultContent[section],
    loading,
    error
  }
}