'use client'

import React from 'react'
import SearchBar from '@/components/SearchBar'
import CategorySelector from '@/components/CategorySelector'
import FeaturedProducts from '@/components/FeaturedProducts'
import FeaturedPerfumes from '@/components/FeaturedPerfumes'
import PaymentMethods from '@/components/PaymentMethods'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main>
      <SearchBar />
      <CategorySelector />
      <FeaturedProducts />
      <FeaturedPerfumes />
      <PaymentMethods />
      <Footer />
    </main>
  )
} 