'use client'

import React from 'react'
import FeaturedProducts from '@/components/FeaturedProducts'
import Categories from '@/components/Categories'
import PaymentMethods from '@/components/PaymentMethods'
import About from '@/components/About'
import Testimonials from '@/components/Testimonials'
import Footer from '@/components/Footer'
import TulipsShowcase from '@/components/TulipsShowcase'
import RealFlowerShowcase from '@/components/RealFlowerShowcase'

export default function Home() {
  return (
    <main>
      <FeaturedProducts />
      <Categories />
      <RealFlowerShowcase />
      <TulipsShowcase />
      <PaymentMethods />
      <About />
      <Testimonials />
      <Footer />
    </main>
  )
} 