'use client'

import React from 'react'
import SearchBar from '@/components/SearchBar'

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SearchBar />
      <div className="container-responsive py-8">
        <div className="container-wide">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Search Results</h1>
            <p className="text-gray-600">Use the search bar above to find your perfect flowers</p>
          </div>
        </div>
      </div>
    </div>
  )
} 