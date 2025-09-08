'use client'

import dynamicImport from 'next/dynamic'
import React from 'react'

// Force dynamic rendering to avoid SSR issues
export const dynamic = 'force-dynamic'

// Dynamically import the wishlist component with SSR disabled
const WishlistComponent = dynamicImport(() => import('./WishlistComponent'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Loading Wishlist...</h2>
        <p className="text-gray-600">Please wait while we load your wishlist</p>
      </div>
    </div>
  )
})

const WishlistPage = () => {
  return <WishlistComponent />
}

export default WishlistPage 