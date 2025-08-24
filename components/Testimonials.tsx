'use client'

import React from 'react'
import { Star, Quote } from 'lucide-react'

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Marie Uwimana',
      role: 'Wedding Client',
      rating: 5,
      comment: 'The flowers were absolutely stunning! Fresh, beautiful, and delivered right on time. Akazuba Florist exceeded my expectations.',
      product: 'Luxury Red Rose Bouquet',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 2,
      name: 'Jean Pierre',
      role: 'Regular Customer',
      rating: 5,
      comment: 'I\'ve been ordering flowers from Akazuba Florist for months now. The quality is consistently excellent and the service is outstanding.',
      product: 'Mixed Flower Arrangement',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 3,
      name: 'Claire Mutoni',
      role: 'Event Planner',
      rating: 5,
      comment: 'As an event planner, I need reliable flower suppliers. Akazuba Florist never disappoints. Their arrangements are always perfect.',
      product: 'Wedding Flower Package',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 4,
      name: 'David Nshuti',
      role: 'Business Owner',
      rating: 5,
      comment: 'I order flowers regularly for my office. The team at Akazuba Florist is professional, punctual, and the flowers are always fresh.',
      product: 'Office Flower Subscription',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 5,
      name: 'Grace Uwase',
      role: 'Bride',
      rating: 5,
      comment: 'My wedding flowers were absolutely magical! The team understood my vision perfectly and created the most beautiful arrangements.',
      product: 'Complete Wedding Package',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 6,
      name: 'Emmanuel Kwizera',
      role: 'Gift Buyer',
      rating: 5,
      comment: 'I ordered flowers for my mother\'s birthday. The delivery was on time and the flowers were more beautiful than expected. Highly recommended!',
      product: 'Birthday Flower Bouquet',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
    }
  ]

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-pink-100 to-rose-100 rounded-full px-6 py-2 mb-6">
            <Quote className="h-5 w-5 text-pink-600" />
            <span className="text-pink-600 font-semibold">Customer Reviews</span>
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
            What Our Customers Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Don&apos;t just take our word for it. Here&apos;s what our valued customers have to say 
            about their experience with Akazuba Florist.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300">
              {/* Rating */}
              <div className="flex items-center space-x-1 mb-4">
                {renderStars(testimonial.rating)}
                <span className="text-sm text-gray-600 ml-2">({testimonial.rating}.0)</span>
              </div>

              {/* Comment */}
              <blockquote className="text-gray-700 mb-6 italic">
                &quot;{testimonial.comment}&quot;
              </blockquote>

              {/* Product */}
              <div className="bg-white rounded-xl p-3 mb-4">
                <p className="text-sm text-gray-600">Ordered:</p>
                <p className="font-semibold text-gray-900">{testimonial.product}</p>
              </div>

              {/* Customer Info */}
              <div className="flex items-center space-x-3">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 bg-gradient-to-r from-pink-600 to-rose-600 rounded-2xl p-8 text-white">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">500+</div>
              <div className="text-pink-100">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">4.9★</div>
              <div className="text-pink-100">Average Rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">1000+</div>
              <div className="text-pink-100">Orders Delivered</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">98%</div>
              <div className="text-pink-100">Satisfaction Rate</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Join Our Happy Customers!
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Experience the beauty and quality that our customers love. 
              Order your first bouquet today and see why Akazuba Florist is the trusted choice for flowers in Rwanda.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-pink-600 to-rose-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-pink-700 hover:to-rose-700 transition-all duration-300">
                Shop Flowers
              </button>
              <button className="border-2 border-pink-600 text-pink-600 px-8 py-4 rounded-xl font-semibold hover:bg-pink-50 transition-all duration-300">
                Read More Reviews
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials 