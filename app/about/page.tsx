'use client'

import React from 'react'
import { Users, Award, Heart, Shield, Truck, Star, MapPin, Phone, Mail, Clock } from 'lucide-react'
import Link from 'next/link'

const AboutPage = () => {
  const stats = [
    { icon: Users, value: '2,500+', label: 'Happy Customers' },
    { icon: Award, value: '4.8★', label: 'Customer Rating' },
    { icon: Truck, value: '5,000+', label: 'Orders Delivered' },
    { icon: Heart, value: '5+', label: 'Years of Excellence' },
  ]

  const values = [
    {
      icon: Heart,
      title: 'Passion for Beauty',
      description: 'We believe flowers have the power to transform moments into memories. Every arrangement is crafted with love and attention to detail.'
    },
    {
      icon: Shield,
      title: 'Trust & Quality',
      description: 'From premium flowers to exquisite perfumes, we guarantee fresh, high-quality products delivered with care and reliability.'
    },
    {
      icon: Star,
      title: 'Customer Excellence',
      description: 'Your satisfaction is our priority. We provide personalized service and go the extra mile to make your experience special.'
    },
    {
      icon: Truck,
      title: 'Rwanda Pride',
      description: 'Proudly serving Rwanda with local expertise, supporting our community, and bringing international quality to your doorstep.'
    }
  ]

  const team = [
    {
      name: 'Diane Akazuba',
      role: 'Founder & Creative Director',
      image: '/images/team/diane-akazuba.jpg',
      bio: 'Visionary founder with 8+ years in floral design. Born and raised in Rwanda, Diane combines her natural talent for floral arrangements with a deep commitment to serving her community and showcasing the beauty of Rwanda.'
    },
    {
      name: 'Jean Pierre',
      role: 'Operations Manager',
      image: '/images/team/jean-pierre.jpg',
      bio: 'Expert in logistics and customer service with 5+ years experience. Ensures every order is delivered fresh and on time across Rwanda.'
    },
    {
      name: 'Marie Claire',
      role: 'Senior Florist',
      image: '/images/team/marie-claire.jpg',
      bio: 'Master florist with international training. Specializes in wedding arrangements, corporate events, and custom bouquets that exceed expectations.'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-pink-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              About <span className="text-pink-600">Akazuba Florist</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Rwanda's premier destination for premium flowers and luxury perfumes. We bring you the world's finest 
              floral arrangements and exquisite fragrances, delivered fresh to your door with love and care.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
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
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Our Story
            </h2>
            <div className="space-y-4 text-gray-600 text-lg">
              <p>
                Founded in 2019 by Diane Akazuba, our journey began with a simple dream: to bring the beauty 
                of fresh flowers and luxury fragrances to every corner of Rwanda. What started as a small 
                home-based business in Kigali has grown into Rwanda's most trusted floral and fragrance 
                destination, serving over 2,500 satisfied customers across the country.
              </p>
              <p>
                Diane's love for flowers was born from her childhood in the hills of Rwanda, where she spent 
                countless hours admiring the natural beauty of her homeland. Her passion for creating beautiful 
                arrangements began when she started making bouquets for family celebrations and local events. 
                Word of her talent spread quickly through the community.
              </p>
              <p>
                Today, we offer an extensive collection of fresh flowers, elegant bouquets, and luxury perfumes. 
                From intimate birthday celebrations to grand weddings, corporate events to romantic gestures, 
                we create memorable experiences that celebrate life's most precious moments right here in Rwanda.
              </p>
              <p>
                Our commitment extends beyond products - we work directly with local flower growers, support 
                Rwandan communities, and ensure every customer receives personalized service that reflects 
                the warmth and hospitality of our beautiful country.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              These core values guide everything we do, from selecting flowers to serving our customers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-xl p-6 text-center shadow-lg">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-8 w-8 text-pink-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our Services & Specialties
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From intimate celebrations to grand events, we provide comprehensive floral and fragrance solutions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-pink-50 rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Wedding Arrangements</h3>
              <p className="text-gray-600">Bridal bouquets, centerpieces, ceremony decorations, and complete wedding floral design services.</p>
            </div>
            
            <div className="bg-pink-50 rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Corporate Events</h3>
              <p className="text-gray-600">Professional floral arrangements for conferences, meetings, and corporate celebrations.</p>
            </div>
            
            <div className="bg-pink-50 rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Same-Day Delivery</h3>
              <p className="text-gray-600">Fresh flowers delivered across Kigali and surrounding areas within hours of ordering.</p>
            </div>
            
            <div className="bg-pink-50 rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Luxury Perfumes</h3>
              <p className="text-gray-600">Curated collection of premium fragrances from international and local brands.</p>
            </div>
            
            <div className="bg-pink-50 rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Custom Arrangements</h3>
              <p className="text-gray-600">Personalized floral designs tailored to your specific needs and preferences.</p>
            </div>
            
            <div className="bg-pink-50 rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Event Planning</h3>
              <p className="text-gray-600">Complete event coordination services for weddings, parties, and special occasions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The passionate individuals behind Akazuba Florist&apos;s success.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-48 h-48 object-cover rounded-full mx-auto mb-6"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-pink-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Get in Touch
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                We&apos;d love to hear from you. Contact us for any questions, special requests, or just to say hello.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-pink-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Address</h3>
                    <p className="text-gray-600">Kigali, Rwanda</p>
                    <p className="text-gray-600">Kimihurura, KG 123 St</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                    <Phone className="h-6 w-6 text-pink-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Phone</h3>
                    <p className="text-gray-600">+250 788 123 456</p>
                    <p className="text-gray-600">+250 789 123 456</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                    <Mail className="h-6 w-6 text-pink-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <p className="text-gray-600">info@akazuba.com</p>
                    <p className="text-gray-600">support@akazuba.com</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                    <Clock className="h-6 w-6 text-pink-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Business Hours</h3>
                    <p className="text-gray-600">Monday - Friday: 8:00 AM - 6:00 PM</p>
                    <p className="text-gray-600">Saturday: 9:00 AM - 4:00 PM</p>
                    <p className="text-gray-600">Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="info.akazubaflorist@gmail.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Tell us about your floral needs..."
                  ></textarea>
                </div>
                                 <button type="submit" className="w-full bg-pink-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-pink-700 transition-all duration-300">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage 