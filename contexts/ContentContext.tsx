'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface AboutPageContent {
  heroTitle: string
  heroSubtitle: string
  storyTitle: string
  storyParagraph1: string
  storyParagraph2: string
  storyParagraph3: string
  storyParagraph4: string
  stats: Array<{ value: string; label: string }>
}

interface ContactPageContent {
  heroTitle: string
  heroSubtitle: string
  phone1: string
  phone2: string
  whatsapp: string
  email1: string
  email2: string
  email3: string
  address: string
  addressDetail: string
  landmark: string
  hoursWeekdays: string
  hoursSaturday: string
  hoursSunday: string
  emergencyNote: string
}

interface ContentContextType {
  aboutPageContent: AboutPageContent
  contactPageContent: ContactPageContent
  updateAboutPageContent: (content: Partial<AboutPageContent>) => void
  updateContactPageContent: (content: Partial<ContactPageContent>) => void
}

const ContentContext = createContext<ContentContextType | undefined>(undefined)

const defaultAboutPageContent: AboutPageContent = {
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
}

const defaultContactPageContent: ContactPageContent = {
  heroTitle: 'Contact Us',
  heroSubtitle: 'We\'re here to help! Get in touch with us for any questions about our products, orders, or services.',
  phone1: '+250 788 123 456',
  phone2: '+250 789 123 456',
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
}

export const ContentProvider = ({ children }: { children: ReactNode }) => {
  const [aboutPageContent, setAboutPageContent] = useState<AboutPageContent>(defaultAboutPageContent)
  const [contactPageContent, setContactPageContent] = useState<ContactPageContent>(defaultContactPageContent)

  const updateAboutPageContent = (content: Partial<AboutPageContent>) => {
    setAboutPageContent(prev => ({ ...prev, ...content }))
  }

  const updateContactPageContent = (content: Partial<ContactPageContent>) => {
    setContactPageContent(prev => ({ ...prev, ...content }))
  }

  return (
    <ContentContext.Provider value={{
      aboutPageContent,
      contactPageContent,
      updateAboutPageContent,
      updateContactPageContent
    }}>
      {children}
    </ContentContext.Provider>
  )
}

export const useContent = () => {
  const context = useContext(ContentContext)
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider')
  }
  return context
}
