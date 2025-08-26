'use client'

import { AuthProvider } from '@/contexts/RealAuthContext'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
} 