import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// Mock content data - in a real app, this would come from a database
let contentData = {
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
    console.log('📝 Admin content API called')
    
    // Check if user is authenticated and is admin
    const session = await getServerSession(request)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
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

export async function PUT(request: NextRequest) {
  try {
    console.log('📝 Admin content update API called')
    
    // Check if user is authenticated and is admin
    const session = await getServerSession(request)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const body = await request.json()
    const { section, data } = body
    
    if (!section || !data) {
      return NextResponse.json({
        success: false,
        error: 'Section and data are required'
      }, { status: 400 })
    }
    
    // Validate section
    const validSections = ['hero', 'about', 'contact', 'footer', 'seo']
    if (!validSections.includes(section)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid section'
      }, { status: 400 })
    }
    
    // Update the content
    contentData[section as keyof typeof contentData] = {
      ...contentData[section as keyof typeof contentData],
      ...data
    }
    
    console.log(`✅ Content updated for section: ${section}`)
    return NextResponse.json({
      success: true,
      message: 'Content updated successfully',
      data: contentData[section as keyof typeof contentData]
    })
    
  } catch (error) {
    console.error('❌ Error updating content:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update content'
    }, { status: 500 })
  }
}
