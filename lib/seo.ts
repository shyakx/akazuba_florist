/**
 * SEO utilities for the Akazuba Florist application
 * 
 * This module provides utilities for:
 * - Meta tag generation
 * - Open Graph tags
 * - Twitter Card tags
 * - Structured data (JSON-LD)
 * - Sitemap generation
 * - Canonical URLs
 * 
 * @fileoverview SEO optimization utilities
 * @author Akazuba Development Team
 * @version 1.0.0
 */

/**
 * Base SEO configuration
 */
export const seoConfig = {
  siteName: 'Akazuba Florist',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://akazuba.com',
  defaultTitle: 'Akazuba Florist - Beautiful Flowers & Bouquets in Rwanda',
  defaultDescription: 'Discover beautiful fresh flowers, bouquets, and floral arrangements in Rwanda. Same-day delivery available. Order online from Akazuba Florist.',
  defaultKeywords: 'flowers, bouquets, floral arrangements, Rwanda, Kigali, same-day delivery, fresh flowers, gift flowers',
  twitterHandle: '@akazubaflorist',
  facebookAppId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
  googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID,
  googleTagManagerId: process.env.NEXT_PUBLIC_GTM_ID
}

/**
 * SEO metadata interface
 */
export interface SEOMetadata {
  title?: string
  description?: string
  keywords?: string
  image?: string
  url?: string
  type?: 'website' | 'article' | 'product'
  publishedTime?: string
  modifiedTime?: string
  author?: string
  section?: string
  tags?: string[]
  price?: number
  currency?: string
  availability?: 'in stock' | 'out of stock' | 'preorder'
  brand?: string
  category?: string
}

/**
 * Generate page title
 */
export const generateTitle = (title?: string, includeSiteName = true): string => {
  if (!title) return seoConfig.defaultTitle
  
  if (includeSiteName && !title.includes(seoConfig.siteName)) {
    return `${title} | ${seoConfig.siteName}`
  }
  
  return title
}

/**
 * Generate meta description
 */
export const generateDescription = (description?: string): string => {
  if (!description) return seoConfig.defaultDescription
  
  // Truncate to 160 characters for optimal SEO
  return description.length > 160 
    ? description.substring(0, 157) + '...'
    : description
}

/**
 * Generate canonical URL
 */
export const generateCanonicalUrl = (path: string): string => {
  const baseUrl = seoConfig.siteUrl.replace(/\/$/, '')
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${baseUrl}${cleanPath}`
}

/**
 * Generate Open Graph tags
 */
export const generateOpenGraphTags = (metadata: SEOMetadata) => {
  const title = generateTitle(metadata.title, false)
  const description = generateDescription(metadata.description)
  const url = metadata.url ? generateCanonicalUrl(metadata.url) : seoConfig.siteUrl
  const image = metadata.image || `${seoConfig.siteUrl}/images/og-default.jpg`

  return {
    'og:title': title,
    'og:description': description,
    'og:url': url,
    'og:image': image,
    'og:type': metadata.type || 'website',
    'og:site_name': seoConfig.siteName,
    'og:locale': 'en_US',
    ...(metadata.publishedTime && { 'og:article:published_time': metadata.publishedTime }),
    ...(metadata.modifiedTime && { 'og:article:modified_time': metadata.modifiedTime }),
    ...(metadata.author && { 'og:article:author': metadata.author }),
    ...(metadata.section && { 'og:article:section': metadata.section }),
    ...(metadata.tags && { 'og:article:tag': metadata.tags.join(', ') }),
    ...(metadata.price && { 'og:price:amount': metadata.price.toString() }),
    ...(metadata.currency && { 'og:price:currency': metadata.currency }),
    ...(metadata.availability && { 'og:availability': metadata.availability })
  }
}

/**
 * Generate Twitter Card tags
 */
export const generateTwitterCardTags = (metadata: SEOMetadata) => {
  const title = generateTitle(metadata.title, false)
  const description = generateDescription(metadata.description)
  const image = metadata.image || `${seoConfig.siteUrl}/images/twitter-card.jpg`

  return {
    'twitter:card': 'summary_large_image',
    'twitter:site': seoConfig.twitterHandle,
    'twitter:title': title,
    'twitter:description': description,
    'twitter:image': image,
    'twitter:creator': seoConfig.twitterHandle
  }
}

/**
 * Generate structured data (JSON-LD)
 */
export const generateStructuredData = (metadata: SEOMetadata, type: 'product' | 'article' | 'organization' | 'website') => {
  const baseUrl = seoConfig.siteUrl

  switch (type) {
    case 'product':
      return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: metadata.title,
        description: metadata.description,
        image: metadata.image,
        url: metadata.url ? generateCanonicalUrl(metadata.url) : baseUrl,
        brand: {
          '@type': 'Brand',
          name: metadata.brand || seoConfig.siteName
        },
        category: metadata.category,
        offers: {
          '@type': 'Offer',
          price: metadata.price,
          priceCurrency: metadata.currency || 'RWF',
          availability: metadata.availability === 'in stock' 
            ? 'https://schema.org/InStock' 
            : 'https://schema.org/OutOfStock',
          seller: {
            '@type': 'Organization',
            name: seoConfig.siteName
          }
        }
      }

    case 'article':
      return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: metadata.title,
        description: metadata.description,
        image: metadata.image,
        url: metadata.url ? generateCanonicalUrl(metadata.url) : baseUrl,
        datePublished: metadata.publishedTime,
        dateModified: metadata.modifiedTime,
        author: {
          '@type': 'Person',
          name: metadata.author || seoConfig.siteName
        },
        publisher: {
          '@type': 'Organization',
          name: seoConfig.siteName,
          logo: {
            '@type': 'ImageObject',
            url: `${baseUrl}/images/logo.png`
          }
        }
      }

    case 'organization':
      return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: seoConfig.siteName,
        url: baseUrl,
        logo: `${baseUrl}/images/logo.png`,
        description: seoConfig.defaultDescription,
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'RW',
          addressLocality: 'Kigali'
        },
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+250-XXX-XXXX',
          contactType: 'customer service'
        },
        sameAs: [
          'https://www.facebook.com/akazubaflorist',
          'https://www.instagram.com/akazubaflorist',
          'https://twitter.com/akazubaflorist'
        ]
      }

    case 'website':
    default:
      return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: seoConfig.siteName,
        url: baseUrl,
        description: seoConfig.defaultDescription,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${baseUrl}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string'
        }
      }
  }
}

/**
 * Generate robots meta tag
 */
export const generateRobotsTag = (index = true, follow = true, noarchive = false) => {
  const directives = []
  
  if (!index) directives.push('noindex')
  if (!follow) directives.push('nofollow')
  if (noarchive) directives.push('noarchive')
  
  return directives.length > 0 ? directives.join(', ') : 'index, follow'
}

/**
 * Generate sitemap data
 */
export const generateSitemapData = (pages: Array<{
  url: string
  lastModified?: string
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority?: number
}>) => {
  const baseUrl = seoConfig.siteUrl

  return pages.map(page => ({
    url: page.url.startsWith('http') ? page.url : `${baseUrl}${page.url}`,
    lastModified: page.lastModified || new Date().toISOString(),
    changeFrequency: page.changeFrequency || 'weekly',
    priority: page.priority || 0.5
  }))
}

/**
 * Generate breadcrumb structured data
 */
export const generateBreadcrumbData = (items: Array<{
  name: string
  url: string
}>) => {
  const baseUrl = seoConfig.siteUrl

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}`
    }))
  }
}

/**
 * SEO hook for React components
 */
export const useSEO = (metadata: SEOMetadata, type: 'product' | 'article' | 'organization' | 'website' = 'website') => {
  const title = generateTitle(metadata.title)
  const description = generateDescription(metadata.description)
  const canonicalUrl = metadata.url ? generateCanonicalUrl(metadata.url) : seoConfig.siteUrl
  const openGraphTags = generateOpenGraphTags(metadata)
  const twitterCardTags = generateTwitterCardTags(metadata)
  const structuredData = generateStructuredData(metadata, type)

  return {
    title,
    description,
    canonicalUrl,
    openGraphTags,
    twitterCardTags,
    structuredData,
    keywords: metadata.keywords || seoConfig.defaultKeywords
  }
}

/**
 * Generate meta tags for Next.js Head component
 */
export const generateMetaTags = (metadata: SEOMetadata, type: 'product' | 'article' | 'organization' | 'website' = 'website') => {
  const seo = useSEO(metadata, type)
  
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    canonical: seo.canonicalUrl,
    openGraph: seo.openGraphTags,
    twitter: seo.twitterCardTags,
    robots: generateRobotsTag(),
    'google-site-verification': process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    'msvalidate.01': process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
  }
}

export default {
  seoConfig,
  generateTitle,
  generateDescription,
  generateCanonicalUrl,
  generateOpenGraphTags,
  generateTwitterCardTags,
  generateStructuredData,
  generateRobotsTag,
  generateSitemapData,
  generateBreadcrumbData,
  useSEO,
  generateMetaTags
}
