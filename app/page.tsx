'use client'

import React from 'react'
import SearchBar from '@/components/SearchBar'
import CategorySelector from '@/components/CategorySelector'
import FeaturedProducts from '@/components/FeaturedProducts'
import FeaturedPerfumes from '@/components/FeaturedPerfumes'
import Categories from '@/components/Categories'
import PaymentMethods from '@/components/PaymentMethods'
import About from '@/components/About'
import Testimonials from '@/components/Testimonials'
import Footer from '@/components/Footer'
import TulipsShowcase from '@/components/TulipsShowcase'
import RealFlowerShowcase from '@/components/RealFlowerShowcase'
import ColorBasedProducts from '@/components/ColorBasedProducts'

export default function Home() {
  // Show home page content to all users (authenticated and unauthenticated)
  return (
    <main>
      <SearchBar />
      <CategorySelector />
      <FeaturedProducts />
      <FeaturedPerfumes />
      <Categories />
      <ColorBasedProducts />
      <RealFlowerShowcase />
      <TulipsShowcase />
      <PaymentMethods />
      <About />
      <Testimonials />
      <Footer />
    </main>
  )
} 