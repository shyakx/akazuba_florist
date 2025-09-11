'use client'

import React, { useState, useEffect } from 'react'
import { Star, Heart, ThumbsUp, MessageCircle } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface Rating {
  id: string
  productId: string
  userId: string
  userName: string
  rating: number
  comment: string
  createdAt: string
  helpful: number
}

interface RatingSystemProps {
  productId: string
  productName: string
  currentRating?: number
  onRatingSubmit?: (rating: Rating) => void
}

const RatingSystem: React.FC<RatingSystemProps> = ({
  productId,
  productName,
  currentRating = 0,
  onRatingSubmit
}) => {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState('')
  const [userName, setUserName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [existingRatings, setExistingRatings] = useState<Rating[]>([])
  const [averageRating, setAverageRating] = useState(0)
  const [totalRatings, setTotalRatings] = useState(0)

  // Load existing ratings
  useEffect(() => {
    loadRatings()
  }, [productId])

  const loadRatings = async () => {
    try {
      const response = await fetch(`/api/ratings/${productId}`)
      if (response.ok) {
        const data = await response.json()
        setExistingRatings(data.ratings || [])
        
        // Calculate average rating
        if (data.ratings && data.ratings.length > 0) {
          const total = data.ratings.reduce((sum: number, r: Rating) => sum + r.rating, 0)
          setAverageRating(total / data.ratings.length)
          setTotalRatings(data.ratings.length)
        }
      }
    } catch (error) {
      console.error('Error loading ratings:', error)
    }
  }

  const handleRatingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (rating === 0) {
      toast.error('Please select a rating')
      return
    }
    
    if (!userName.trim()) {
      toast.error('Please enter your name')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          productName,
          rating,
          comment: comment.trim(),
          userName: userName.trim(),
        }),
      })

      if (response.ok) {
        const newRating = await response.json()
        setExistingRatings(prev => [newRating.rating, ...prev])
        
        // Update average rating
        const newTotal = existingRatings.reduce((sum, r) => sum + r.rating, 0) + rating
        const newCount = existingRatings.length + 1
        setAverageRating(newTotal / newCount)
        setTotalRatings(newCount)
        
        // Reset form
        setRating(0)
        setComment('')
        setUserName('')
        setShowForm(false)
        
        toast.success('Thank you for your rating!')
        
        if (onRatingSubmit) {
          onRatingSubmit(newRating.rating)
        }
      } else {
        const error = await response.json()
        toast.error(error.message || 'Failed to submit rating')
      }
    } catch (error) {
      console.error('Error submitting rating:', error)
      toast.error('Failed to submit rating. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleHelpful = async (ratingId: string) => {
    try {
      const response = await fetch(`/api/ratings/helpful/${ratingId}`, {
        method: 'POST',
      })

      if (response.ok) {
        // Update local state
        setExistingRatings(prev => 
          prev.map(r => 
            r.id === ratingId 
              ? { ...r, helpful: r.helpful + 1 }
              : r
          )
        )
        toast.success('Thank you for your feedback!')
      }
    } catch (error) {
      console.error('Error marking as helpful:', error)
    }
  }

  const renderStars = (rating: number, interactive = false, size = 'w-5 h-5') => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={interactive ? () => setRating(star) : undefined}
            onMouseEnter={interactive ? () => setHoveredRating(star) : undefined}
            onMouseLeave={interactive ? () => setHoveredRating(0) : undefined}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Rating Summary */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">{averageRating.toFixed(1)}</div>
            {renderStars(Math.round(averageRating), false, 'w-4 h-4')}
            <div className="text-sm text-gray-500 mt-1">{totalRatings} rating{totalRatings !== 1 ? 's' : ''}</div>
          </div>
          <div className="text-gray-600">
            <div className="font-medium">{productName}</div>
            <div className="text-sm">Share your experience with others</div>
          </div>
        </div>
        
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          {showForm ? 'Cancel' : 'Write a Review'}
        </button>
      </div>

      {/* Rating Form */}
      {showForm && (
        <form onSubmit={handleRatingSubmit} className="border-t pt-6 mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Rating *
              </label>
              <div className="flex items-center space-x-2">
                {renderStars(hoveredRating || rating, true, 'w-6 h-6')}
                <span className="text-sm text-gray-500 ml-2">
                  {rating > 0 && (
                    rating === 1 ? 'Poor' :
                    rating === 2 ? 'Fair' :
                    rating === 3 ? 'Good' :
                    rating === 4 ? 'Very Good' :
                    'Excellent'
                  )}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name *
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Enter your name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Review (Optional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Tell others about your experience with this product..."
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || rating === 0}
                className="bg-pink-600 hover:bg-pink-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Existing Ratings */}
      {existingRatings.length > 0 && (
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Reviews</h3>
          <div className="space-y-4">
            {existingRatings.map((rating) => (
              <div key={rating.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="font-medium text-gray-900">{rating.userName}</div>
                      {renderStars(rating.rating, false, 'w-4 h-4')}
                      <div className="text-sm text-gray-500">
                        {new Date(rating.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    {rating.comment && (
                      <p className="text-gray-700 mb-2">{rating.comment}</p>
                    )}
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <button
                        onClick={() => handleHelpful(rating.id)}
                        className="flex items-center space-x-1 hover:text-pink-600 transition-colors"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span>Helpful ({rating.helpful})</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default RatingSystem
