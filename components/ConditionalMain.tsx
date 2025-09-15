'use client'

import { usePathname } from 'next/navigation'

interface ConditionalMainWrapperProps {
  children: React.ReactNode
}

const ConditionalMainWrapper = ({ children }: ConditionalMainWrapperProps) => {
  const pathname = usePathname()
  
  // Don't apply padding for admin pages
  if (pathname?.startsWith('/admin')) {
    return (
      <main className="pt-0">
        {children}
      </main>
    )
  }
  
  // Apply normal padding for customer pages
  return (
    <main className="pt-32">
      {children}
    </main>
  )
}

export default ConditionalMainWrapper
