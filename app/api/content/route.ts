import { NextRequest, NextResponse } from 'next/server'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// Mock content data - in a real app, this would come from a database
const contentData = {
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

export async function GET(request: NextRequest) {
  try {
    console.log('📝 Public content API called')
    
    // This is a public endpoint - no authentication required
    console.log('✅ Content data retrieved successfully')
    return NextResponse.json({
      success: true,
      data: contentData
    })
    
  } catch (error) {
    console.error('❌ Error fetching content:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch content'
    }, { status: 500 })
  }
}
