import React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { CartProvider } from '@/contexts/CartContext'
import { AuthProvider } from '@/contexts/AuthContext'
import Header from '@/components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Akazuba Florist - Premium Floral Arrangements',
  description: 'Discover the finest flowers and handcrafted arrangements in Rwanda. Shop online with secure MoMo and BK payment options.',
  keywords: 'flowers, bouquets, Rwanda, online shopping, MoMo, BK, floral arrangements, wedding flowers',
  authors: [{ name: 'Akazuba Florist' }],
  openGraph: {
    title: 'Akazuba Florist - Premium Floral Arrangements',
    description: 'Discover the finest flowers and handcrafted arrangements in Rwanda',
    type: 'website',
    locale: 'en_US',
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
        <AuthProvider>
          <CartProvider>
            <Header />
            {children}
            <Toaster position="top-right" />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
} 