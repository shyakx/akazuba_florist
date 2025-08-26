'use client'

import React from 'react'
import { Users, Award, Heart, Shield, Truck, Star, MapPin, Phone, Mail, Clock } from 'lucide-react'
import Link from 'next/link'

const About = () => {
  const stats = [
    { icon: Users, value: '500+', label: 'Happy Customers' },
    { icon: Award, value: '4.9★', label: 'Average Rating' },
    { icon: Truck, value: '1000+', label: 'Bouquets Delivered' },
    { icon: Heart, value: '3+', label: 'Years of Excellence' },
  ]

  const values = [
    {
      icon: Heart,
      title: 'Passion for Flowers',
      description: 'We are passionate about creating beautiful floral arrangements that bring joy and beauty to every occasion.'
    },
    {
      icon: Shield,
      title: 'Trust & Reliability',
      description: 'Building lasting relationships through transparent pricing, secure payments, and reliable delivery services.'
    },
    {
      icon: Star,
      title: 'Excellence in Service',
      description: 'Providing exceptional customer service with attention to detail and personalized care for every order.'
    },
    {
      icon: Truck,
      title: 'Local Commitment',
      description: 'Supporting local communities and promoting sustainable practices in our flower business.'
    }
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            About Akazuba Florist
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Founded with a passion for beauty and elegance, Akazuba Florist has been bringing
            the finest flowers and handcrafted arrangements to Rwanda since 2021. We believe that everyone deserves to experience the joy and sophistication that comes with
            beautiful floral arrangements.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <stat.icon className="h-8 w-8 text-pink-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Story</h3>
            <div className="space-y-4 text-gray-600">
              <p>
                What started as a small passion project has grown into one of Rwanda&apos;s most trusted 
                destinations for premium floral arrangements. Our journey began with a simple vision: 
                to bring the world&apos;s finest flowers to the beautiful country of Rwanda.
              </p>
              <p>
                Today, we serve customers across Rwanda, delivering not just products, but experiences 
                that create lasting memories. From romantic bouquets to wedding arrangements, every 
                item in our collection is carefully selected and handcrafted to meet the highest 
                standards of quality and beauty.
              </p>
              <p>
                We take pride in our commitment to excellence, from the flowers we select to the 
                service we provide. Every arrangement tells a story, and we&apos;re honored to be part 
                of your special moments.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1562690868-60bbe7293e94?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
              alt="Luxury Roses"
              className="w-full h-64 object-cover rounded-xl"
            />
            <img
              src="https://images.unsplash.com/photo-1582735689369-4fe89db7114c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
              alt="Mixed Bouquet"
              className="w-full h-64 object-cover rounded-xl mt-8"
            />
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-12">Our Values</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-xl p-6 text-center shadow-lg">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-8 w-8 text-pink-600" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h4>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Get in Touch</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                <MapPin className="h-6 w-6 text-pink-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Address</h4>
                <p className="text-gray-600">Kigali, Rwanda</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                <Phone className="h-6 w-6 text-pink-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Phone</h4>
                <p className="text-gray-600">+250 784 586 110</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                <Mail className="h-6 w-6 text-pink-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Email</h4>
                <p className="text-gray-600">hello@akazubaflorist.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About 