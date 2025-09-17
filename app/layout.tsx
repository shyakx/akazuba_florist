import React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { CartProvider } from '@/contexts/CartContext'
import { AuthProvider } from '@/contexts/RealAuthContext'
import { WishlistProvider } from '@/contexts/WishlistContext'
import { ProductsProvider } from '@/contexts/ProductsContext'
import { ContentProvider } from '@/contexts/ContentContext'
import Header from '@/components/Header'
import ConditionalHeader from '@/components/ConditionalHeader'
import ErrorBoundary from '@/components/ErrorBoundary'
import ConditionalMain from '@/components/ConditionalMain'

// Force dynamic rendering to avoid SSR issues
export const dynamic = 'force-dynamic'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Akazuba Florist - #1 Florist in Rwanda | Premium Flowers & Bouquets',
  description: 'Rwanda\'s leading florist delivering fresh flowers, wedding bouquets, and floral arrangements. Same-day delivery in Kigali. Order online with MoMo & BK payment.',
  keywords: 'florist, florist Rwanda, florist Kigali, flowers Rwanda, wedding florist, flower delivery, bouquets, floral arrangements, fresh flowers, online florist, MoMo payment, BK payment, same day delivery, perfumes Rwanda, luxury fragrances, Kigali florist, Rwanda flowers, flower shop, gift flowers, romantic flowers, birthday flowers, anniversary flowers, sympathy flowers, corporate flowers, event flowers, wedding flowers Rwanda',
  authors: [{ name: 'Akazuba Florist', url: 'https://akazubaflorist.com' }],
  creator: 'Akazuba Florist',
  publisher: 'Akazuba Florist',
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  icons: {
    icon: [
      { url: '/images/flowers/mixed/logo.png', sizes: '32x32', type: 'image/png' },
      { url: '/images/flowers/mixed/logo.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/images/flowers/mixed/logo.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/images/flowers/mixed/logo.png', color: '#ec4899' },
    ],
  },
  openGraph: {
    title: 'Akazuba Florist - #1 Florist in Rwanda | Premium Flowers & Bouquets',
    description: 'Rwanda\'s leading florist delivering fresh flowers, wedding bouquets, and floral arrangements. Same-day delivery in Kigali.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Akazuba Florist',
    url: 'https://akazubaflorist.com',
    images: [
      {
        url: '/images/akazuba-florist-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Akazuba Florist - Premium Floral Arrangements',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Akazuba Florist - #1 Florist in Rwanda',
    description: 'Rwanda\'s leading florist delivering fresh flowers and bouquets',
    images: ['/images/akazuba-florist-twitter.jpg'],
    creator: '@akazubaflorist',
    site: '@akazubaflorist',
  },
  alternates: {
    canonical: 'https://akazubaflorist.com',
  },
  verification: {
    google: 'akazuba-google-verification-2024',
    yandex: 'akazuba-yandex-verification',
    yahoo: 'akazuba-yahoo-verification',
  },
  category: 'Shopping',
  classification: 'Florist, Flower Shop, Online Store',
  other: {
    'geo.region': 'RW',
    'geo.placename': 'Kigali',
    'geo.position': '-1.9441;30.0619',
    'ICBM': '-1.9441, 30.0619',
    'DC.title': 'Akazuba Florist - Premium Flowers & Bouquets in Rwanda',
    'DC.creator': 'Akazuba Florist',
    'DC.subject': 'Flowers, Bouquets, Floral Arrangements, Perfumes',
    'DC.description': 'Rwanda\'s leading florist delivering fresh flowers, wedding bouquets, and floral arrangements',
    'DC.publisher': 'Akazuba Florist',
    'DC.contributor': 'Akazuba Florist',
    'DC.date': '2024-01-01',
    'DC.type': 'Service',
    'DC.format': 'text/html',
    'DC.identifier': 'https://akazubaflorist.com',
    'DC.source': 'https://akazubaflorist.com',
    'DC.language': 'en',
    'DC.relation': 'https://akazubaflorist.com',
    'DC.coverage': 'Rwanda, Kigali',
    'DC.rights': '© 2024 Akazuba Florist. All rights reserved.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/images/flowers/mixed/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/images/flowers/mixed/logo.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="theme-color" content="#ec4899" />
        <meta name="msapplication-TileColor" content="#ec4899" />
        <meta name="msapplication-TileImage" content="/images/flowers/mixed/logo.png" />
      </head>
      <body className={inter.className}>
        <ErrorBoundary>
          <AuthProvider>
            <ContentProvider>
              <ProductsProvider>
                <CartProvider>
                  <WishlistProvider>
                    <ConditionalHeader />
                    <ConditionalMain>
                      {children}
                    </ConditionalMain>
                    <Toaster position="top-right" />
                  </WishlistProvider>
                </CartProvider>
              </ProductsProvider>
            </ContentProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
} 