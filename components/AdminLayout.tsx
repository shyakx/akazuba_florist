'use client'

import React from 'react'
import AdminNavbar from './AdminNavbar'

interface AdminLayoutProps {
  children: React.ReactNode
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <main className="pt-0">
        {children}
      </main>
    </div>
  )
}

export default AdminLayout
