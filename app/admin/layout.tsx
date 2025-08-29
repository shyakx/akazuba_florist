'use client'

import { AuthProvider } from '@/contexts/RealAuthContext'
import AdminNavbar from '@/components/AdminNavbar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />
        <main className="pt-14 lg:pt-16">
          {children}
        </main>
      </div>
    </AuthProvider>
  )
} 