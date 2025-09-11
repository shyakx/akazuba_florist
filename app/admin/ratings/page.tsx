'use client'

import { useState, useEffect } from 'react'
import { Star, ThumbsUp, User, Calendar, Filter, Search } from 'lucide-react'

interface Rating {
  id: string
  productId: string
  productName: string
  customerName: string
  customerEmail: string
  rating: number
  comment: string
  helpful: number
  createdAt: string
  status: 'active' | 'hidden'
}

interface RatingAnalytics {
  totalRatings: number
  averageRating: number
  recentRatings: Rating[]
}

export default function AdminRatingsPage() {
  const [ratings, setRatings] = useState<Rating[]>([])
  const [analytics, setAnalytics] = useState<RatingAnalytics>({
    totalRatings: 0,
    averageRating: 0,
    recentRatings: []
  })
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRating, setFilterRating] = useState<number | null>(null)
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'hidden'>('all')

  const fetchRatings = async () => {
    try {
      setIsLoading(true)
      
      // Get the JWT token
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      
      // Fetch analytics first
      const analyticsResponse = await fetch('/api/admin/ratings/analytics', { headers })
      if (analyticsResponse.ok) {
        const analyticsResult = await analyticsResponse.json()
        if (analyticsResult.success) {
          setAnalytics(analyticsResult.data || analyticsResult)
        }
      }
      
      // For now, we'll use the recent ratings from analytics
      // In a real implementation, you'd have a separate endpoint for all ratings
      if (analytics.recentRatings) {
        setRatings(analytics.recentRatings)
      }
      
    } catch (error) {
      console.error('Error fetching ratings:', error)
      // Fallback to empty data
      setRatings([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRatings()
  }, [])

  // Filter ratings based on search and filter criteria
  const filteredRatings = ratings.filter(rating => {
    const matchesSearch = !searchTerm || 
      rating.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rating.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rating.comment.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRating = !filterRating || rating.rating === filterRating
    const matchesStatus = filterStatus === 'all' || rating.status === filterStatus
    
    return matchesSearch && matchesRating && matchesStatus
  })

  const handleToggleStatus = async (ratingId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'hidden' : 'active'
      
      // In a real implementation, you'd call an API to update the rating status
      setRatings(prev => prev.map(rating => 
        rating.id === ratingId ? { ...rating, status: newStatus } : rating
      ))
      
      // Show success message
      alert(`Rating ${newStatus === 'active' ? 'shown' : 'hidden'} successfully`)
    } catch (error) {
      console.error('Error updating rating status:', error)
      alert('Failed to update rating status')
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  if (isLoading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p className="mt-4 text-gray-600">Loading ratings...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Ratings</h1>
          <p className="text-gray-600 mt-2">Manage customer ratings and reviews</p>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-500 rounded-lg">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Total Ratings</h3>
              <p className="text-2xl font-bold text-yellow-600">{analytics.totalRatings}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-indigo-500 rounded-lg">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Average Rating</h3>
              <p className="text-2xl font-bold text-indigo-600">{analytics.averageRating.toFixed(1)}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-green-500 rounded-lg">
              <ThumbsUp className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Active Ratings</h3>
              <p className="text-2xl font-bold text-green-600">
                {ratings.filter(r => r.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search ratings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <select
              value={filterRating || ''}
              onChange={(e) => setFilterRating(e.target.value ? parseInt(e.target.value) : null)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'hidden')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="hidden">Hidden</option>
            </select>
          </div>
        </div>
      </div>

      {/* Ratings List */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Product</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Customer</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Rating</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Comment</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRatings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">
                    No ratings found
                  </td>
                </tr>
              ) : (
                filteredRatings.map((rating) => (
                  <tr key={rating.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">{rating.productName}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-gray-400 mr-2" />
                        <div>
                          <div className="font-medium text-gray-900">{rating.customerName}</div>
                          <div className="text-sm text-gray-500">{rating.customerEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        {renderStars(rating.rating)}
                        <span className="ml-2 text-sm text-gray-600">({rating.rating}/5)</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="max-w-xs truncate text-gray-700">
                        {rating.comment || 'No comment'}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(rating.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        rating.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {rating.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleStatus(rating.id, rating.status)}
                        className={`px-3 py-1 rounded text-xs font-medium ${
                          rating.status === 'active'
                            ? 'bg-red-100 text-red-800 hover:bg-red-200'
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }`}
                      >
                        {rating.status === 'active' ? 'Hide' : 'Show'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
