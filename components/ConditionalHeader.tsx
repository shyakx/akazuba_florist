'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'

const ConditionalHeader = () => {
  const pathname = usePathname()
  
  // Don't render header for admin pages
  if (pathname?.startsWith('/admin')) {
    return null
  }
  
  return <Header />
}

export default ConditionalHeader
