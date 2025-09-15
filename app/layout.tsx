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
  keywords: 'florist, florist Rwanda, florist Kigali, flowers Rwanda, wedding florist, flower delivery, bouquets, floral arrangements, fresh flowers, online florist, MoMo payment, BK payment, same day delivery',
  authors: [{ name: 'Akazuba Florist' }],
  creator: 'Akazuba Florist',
  publisher: 'Akazuba Florist',
  robots: 'index, follow',
  openGraph: {
    title: 'Akazuba Florist - #1 Florist in Rwanda | Premium Flowers & Bouquets',
    description: 'Rwanda\'s leading florist delivering fresh flowers, wedding bouquets, and floral arrangements. Same-day delivery in Kigali.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Akazuba Florist',
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
  },
  alternates: {
    canonical: 'https://akazubaflorist.com',
  },
  verification: {
    google: 'akazuba-google-verification-2024',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
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