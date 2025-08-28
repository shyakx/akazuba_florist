'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useProducts } from '@/contexts/ProductsContext'
import PerfumeCard from '@/components/PerfumeCard'
import ProductCard from '@/components/ProductCard'
import { Filter, Search, Sparkles, Droplets, Star } from 'lucide-react'

const PerfumesPage = () => {
  const { getProductsByCategory } = useProducts()
  const allPerfumes = getProductsByCategory('perfumes')
  
  const [filteredPerfumes, setFilteredPerfumes] = useState(allPerfumes)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedBrand, setSelectedBrand] = useState('all')
  const [selectedConcentration, setSelectedConcentration] = useState('all')
  const [sortBy, setSortBy] = useState('featured')

  // Extract unique filters
  const types = Array.from(new Set(allPerfumes.map(p => p.type))).filter(Boolean)
  const brands = Array.from(new Set(allPerfumes.map(p => p.brand))).filter(Boolean)
  const concentrations = Array.from(new Set(allPerfumes.map(p => p.concentration))).filter(Boolean)

  useEffect(() => {
    let filtered = allPerfumes

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(perfume =>
        perfume.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        perfume.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        perfume.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(perfume => perfume.type === selectedType)
    }

    // Brand filter
    if (selectedBrand !== 'all') {
      filtered = filtered.filter(perfume => perfume.brand === selectedBrand)
    }

    // Concentration filter
    if (selectedConcentration !== 'all') {
      filtered = filtered.filter(perfume => perfume.concentration === selectedConcentration)
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered = [...filtered].sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered = [...filtered].sort((a, b) => b.price - a.price)
        break
      case 'name':
        filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'featured':
      default:
        filtered = [...filtered].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
        break
    }

    setFilteredPerfumes(filtered)
  }, [allPerfumes, searchTerm, selectedType, selectedBrand, selectedConcentration, sortBy])

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedType('all')
    setSelectedBrand('all')
    setSelectedConcentration('all')
    setSortBy('featured')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
        <div className="container-responsive">
          <div className="container-max text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <Sparkles className="w-8 h-8" />
                </div>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
                Luxury Perfumes
              </h1>
              <p className="text-xl sm:text-2xl text-purple-100 max-w-3xl mx-auto">
                Discover our curated collection of premium fragrances from world-renowned brands
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="container-responsive py-8">
        <div className="container-max">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search perfumes, brands, or notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Sort */}
              <div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="featured">Featured</option>
                  <option value="name">Name A-Z</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Filter Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              {/* Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  {types.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Brand Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">All Brands</option>
                  {brands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>

              {/* Concentration Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Concentration</label>
                <select
                  value={selectedConcentration}
                  onChange={(e) => setSelectedConcentration(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">All Concentrations</option>
                  {concentrations.map(conc => (
                    <option key={conc} value={conc}>{conc}</option>
                  ))}
                </select>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600">
              Showing {filteredPerfumes.length} of {allPerfumes.length} perfumes
            </p>
          </div>

          {/* Products Grid */}
          {filteredPerfumes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPerfumes.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <PerfumeCard 
                    product={product}
                    showRating={true}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No perfumes found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PerfumesPage
