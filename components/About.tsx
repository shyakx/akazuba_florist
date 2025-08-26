'use client'

import React from 'react'
import { Users, Award, Heart, Shield, Truck, Star, MapPin, Phone, Mail, Clock, Flower, Sparkles, CheckCircle, Globe, Leaf } from 'lucide-react'
import Link from 'next/link'

const About = () => {
  const stats = [
    { icon: Users, value: '500+', label: 'Happy Customers', color: 'text-blue-600' },
    { icon: Award, value: '4.9★', label: 'Average Rating', color: 'text-yellow-600' },
    { icon: Truck, value: '1000+', label: 'Bouquets Delivered', color: 'text-green-600' },
    { icon: Heart, value: '3+', label: 'Years of Excellence', color: 'text-pink-600' },
  ]

  const values = [
    {
      icon: Heart,
      title: 'Passion for Flowers',
      description: 'We are passionate about creating beautiful floral arrangements that bring joy and beauty to every occasion.',
      color: 'bg-pink-100 text-pink-600'
    },
    {
      icon: Shield,
      title: 'Trust & Reliability',
      description: 'Building lasting relationships through transparent pricing, secure payments, and reliable delivery services.',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: Star,
      title: 'Excellence in Service',
      description: 'Providing exceptional customer service with attention to detail and personalized care for every order.',
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      icon: Truck,
      title: 'Local Commitment',
      description: 'Supporting local communities and promoting sustainable practices in our flower business.',
      color: 'bg-green-100 text-green-600'
    }
  ]

  const teamMembers = [
    {
      name: 'Diane Uwimana',
      role: 'Founder & Creative Director',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      description: 'Passionate about bringing beauty to Rwanda through carefully crafted floral arrangements.'
    },
    {
      name: 'Jean Pierre',
      role: 'Head Florist',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      description: 'Expert in creating stunning bouquets and arrangements for all occasions.'
    },
    {
      name: 'Claire Mutoni',
      role: 'Customer Experience Manager',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      description: 'Ensuring every customer receives exceptional service and memorable experiences.'
    }
  ]

  const achievements = [
    {
      year: '2021',
      title: 'Founded Akazuba Florist',
      description: 'Started with a vision to bring premium floral arrangements to Rwanda'
    },
    {
      year: '2022',
      title: 'First 100 Customers',
      description: 'Reached our first milestone of serving 100 happy customers'
    },
    {
      year: '2023',
      title: 'Wedding Specialist',
      description: 'Became the go-to florist for weddings and special events in Kigali'
    },
    {
      year: '2024',
      title: '500+ Happy Customers',
      description: 'Celebrated serving over 500 satisfied customers across Rwanda'
    }
  ]

  return (
    <section className="py-20 bg-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-pink-100 rounded-full px-6 py-3 mb-6">
            <Flower className="h-6 w-6 text-pink-600" />
            <span className="text-pink-600 font-semibold">Our Story</span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            About Akazuba Florist
          </h2>
          <p className="text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Founded with a passion for beauty and elegance, Akazuba Florist has been bringing
            the finest flowers and handcrafted arrangements to Rwanda since 2021. We believe that everyone deserves to experience the joy and sophistication that comes with
            beautiful floral arrangements.
          </p>
        </div>

        {/* Enhanced Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <stat.icon className={`h-10 w-10 ${stat.color}`} />
              </div>
              <div className={`text-4xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Enhanced Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-20">
          <div className="space-y-8">
          <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center mr-4">
                  <Flower className="h-6 w-6 text-white" />
                </div>
                Our Journey
              </h3>
              <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
                <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                  <p className="mb-4">
                What started as a small passion project has grown into one of Rwanda&apos;s most trusted 
                destinations for premium floral arrangements. Our journey began with a simple vision: 
                to bring the world&apos;s finest flowers to the beautiful country of Rwanda.
              </p>
                  <div className="w-16 h-0.5 bg-pink-400 rounded-full"></div>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                  <p className="mb-4">
                Today, we serve customers across Rwanda, delivering not just products, but experiences 
                that create lasting memories. From romantic bouquets to wedding arrangements, every 
                item in our collection is carefully selected and handcrafted to meet the highest 
                standards of quality and beauty.
              </p>
                  <div className="w-16 h-0.5 bg-pink-400 rounded-full"></div>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                  <p className="mb-4">
                We take pride in our commitment to excellence, from the flowers we select to the 
                service we provide. Every arrangement tells a story, and we&apos;re honored to be part 
                of your special moments.
              </p>
                  <div className="w-16 h-0.5 bg-pink-400 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-8">
            {/* Why Choose Us Section */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center mr-3">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                Why Choose Us
              </h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Premium Quality Flowers</h4>
                    <p className="text-gray-600 text-sm">We source only the finest flowers from trusted suppliers to ensure every arrangement is exceptional.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Expert Craftsmanship</h4>
                    <p className="text-gray-600 text-sm">Our skilled florists create stunning arrangements with attention to every detail.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Reliable Delivery</h4>
                    <p className="text-gray-600 text-sm">Fast and secure delivery across Rwanda, ensuring your flowers arrive fresh and on time.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Personalized Service</h4>
                    <p className="text-gray-600 text-sm">We work closely with you to create the perfect arrangement for your special occasion.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Achievement Timeline */}
            <div className="bg-pink-50 rounded-2xl p-8 shadow-lg border border-pink-100">
              <h4 className="text-xl font-bold text-gray-900 mb-8 flex items-center">
                <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center mr-3">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                Our Achievements
              </h4>
              <div className="space-y-6">
                {achievements.map((achievement, index) => (
                  <div key={index} className="relative">
                    {/* Timeline Line */}
                    {index < achievements.length - 1 && (
                      <div className="absolute left-6 top-12 w-0.5 h-12 bg-pink-300"></div>
                    )}
                    
                    <div className="flex items-start space-x-4">
                      <div className="relative">
                        <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                          <span className="text-white font-bold text-sm">{achievement.year}</span>
                        </div>
                        {/* Glow effect */}
                        <div className="absolute inset-0 w-12 h-12 bg-pink-400 rounded-full blur-md opacity-30 animate-pulse"></div>
                      </div>
                      <div className="flex-1 bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        <h5 className="font-bold text-gray-900 text-lg mb-2">{achievement.title}</h5>
                        <p className="text-gray-600 text-sm leading-relaxed">{achievement.description}</p>
                        {/* Achievement icon based on year */}
                        <div className="mt-3 flex items-center">
                          {achievement.year === '2021' && (
                            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-2">
                              <Flower className="h-3 w-3 text-green-600" />
                            </div>
                          )}
                          {achievement.year === '2022' && (
                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                              <Users className="h-3 w-3 text-blue-600" />
                            </div>
                          )}
                          {achievement.year === '2023' && (
                            <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-2">
                              <Heart className="h-3 w-3 text-purple-600" />
                            </div>
                          )}
                          {achievement.year === '2024' && (
                            <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center mr-2">
                              <Award className="h-3 w-3 text-yellow-600" />
                            </div>
                          )}
                          <span className="text-xs font-medium text-gray-500">Milestone Achieved</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          </div>
        </div>

        {/* Enhanced Values */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Our Values</h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These core values guide everything we do, from selecting flowers to serving our customers
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className={`w-16 h-16 ${value.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                  <value.icon className="h-8 w-8" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h4>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The passionate individuals behind every beautiful arrangement
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full object-cover mx-auto mb-6 shadow-lg"
                />
                <h4 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h4>
                <p className="text-pink-600 font-semibold mb-4">{member.role}</p>
                <p className="text-gray-600">{member.description}</p>
              </div>
            ))}
              </div>
            </div>

        {/* Enhanced Contact Info */}
        <div className="bg-white rounded-3xl shadow-2xl p-12">
          <div className="text-center mb-12">
            <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Get in Touch</h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ready to create something beautiful? We&apos;d love to hear from you!
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <MapPin className="h-8 w-8 text-pink-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Visit Us</h4>
              <p className="text-gray-600">Kigali, Rwanda</p>
              <p className="text-sm text-gray-500 mt-1">Come see our beautiful arrangements</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Phone className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Call Us</h4>
                <p className="text-gray-600">+250 784 586 110</p>
              <p className="text-sm text-gray-500 mt-1">Available 24/7 for urgent orders</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Mail className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Email Us</h4>
              <p className="text-gray-600">hello@akazubaflorist.com</p>
              <p className="text-sm text-gray-500 mt-1">We reply within 2 hours</p>
              </div>
            </div>

          {/* CTA Section */}
          <div className="text-center mt-12 pt-12 border-t border-gray-100">
            <h4 className="text-2xl font-bold text-gray-900 mb-4">Ready to Order?</h4>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Browse our beautiful collection and find the perfect arrangement for your special occasion
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/category/roses"
                className="bg-pink-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Shop Roses
              </Link>
              <Link
                href="/contact"
                className="border-2 border-pink-600 text-pink-600 px-8 py-4 rounded-xl font-semibold hover:bg-pink-50 transition-all duration-300 transform hover:scale-105"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About 