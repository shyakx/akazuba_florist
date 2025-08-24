'use client'

import React from 'react'
import Link from 'next/link'
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Heart, Flower, Clock, Star } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white relative overflow-hidden">
      {/* Simple background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-pink-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-rose-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center shadow-lg">
                <Flower className="h-6 w-6 text-white" />
              </div>
              <span className="ml-3 text-2xl font-bold">Akazuba Florist</span>
            </div>
            <p className="text-gray-300 text-sm mb-4">
              Rwanda&apos;s premier floral destination, crafting exquisite arrangements that tell your story.
            </p>
            <div className="flex items-center space-x-1 mb-4">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-gray-400 text-sm ml-2">500+ happy customers</span>
            </div>
            <div className="flex space-x-4">
              {[
                { icon: Facebook, href: "#", label: "Facebook" },
                { icon: Instagram, href: "https://www.instagram.com/akazuba_florists", label: "Instagram" },
                { icon: Twitter, href: "#", label: "Twitter" }
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="text-gray-400 hover:text-pink-400 transition-colors duration-300 p-2 rounded-lg hover:bg-gray-800/50"
                  title={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">
              Explore Our Collection
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Home", href: "/", desc: "Discover our floral world" },
                { name: "Roses Collection", href: "/category/roses", desc: "Timeless elegance" },
                { name: "Tulips Gallery", href: "/category/tulips", desc: "Spring's vibrant messengers" },
                { name: "Mixed Bouquets", href: "/category/mixed-bouquets", desc: "Artistic floral symphonies" },
                { name: "Wedding Flowers", href: "/category/wedding-flowers", desc: "Your special day blooms" }
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-300 text-sm relative group block"
                  >
                    <div className="font-medium">{link.name}</div>
                    <div className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                      {link.desc}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">
              Connect With Us
            </h3>
            <div className="space-y-3">
              {[
                {
                  icon: Mail,
                  text: "hello@akazubaflorist.com",
                  href: "mailto:hello@akazubaflorist.com",
                  desc: "Send us your floral dreams"
                },
                {
                  icon: Phone,
                  text: "+250 784 586 110",
                  href: "tel:+250784586110",
                  desc: "Call us anytime"
                },
                {
                  icon: MapPin,
                  text: "Kigali, Rwanda",
                  href: null,
                  desc: "Visit our floral studio"
                },
                {
                  icon: Clock,
                  text: "Mon-Sat: 8AM-8PM",
                  href: null,
                  desc: "Sunday: 10AM-6PM"
                }
              ].map((contact, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3"
                >
                  <div className="w-8 h-8 bg-pink-500/10 rounded-lg flex items-center justify-center backdrop-blur-sm flex-shrink-0 mt-0.5">
                    <contact.icon className="h-4 w-4 text-pink-400" />
                  </div>
                  <div className="flex-1">
                    {contact.href ? (
                      <a
                        href={contact.href}
                        className="text-gray-300 hover:text-white transition-colors duration-300 text-sm font-medium block"
                      >
                        {contact.text}
                      </a>
                    ) : (
                      <span className="text-gray-300 text-sm font-medium block">{contact.text}</span>
                    )}
                    <span className="text-xs text-gray-500 block">{contact.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">
              More About Us
            </h3>
            <ul className="space-y-3">
              {[
                { name: "About Our Story", href: "/about", desc: "The passion behind our petals" },
                { name: "Get in Touch", href: "/contact", desc: "Let's create something beautiful" },
                { name: "Our Services", href: "/services", desc: "What we offer" },
                { name: "Delivery Info", href: "/delivery", desc: "How we deliver" },
                { name: "Privacy Policy", href: "/privacy", desc: "Your privacy matters" }
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-300 text-sm relative group block"
                  >
                    <div className="font-medium">{link.name}</div>
                    <div className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                      {link.desc}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright & Made with Love */}
        <div className="border-t border-gray-800 pt-6 mb-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-2 md:mb-0">
              © 2024 Akazuba Florist. Crafting beauty, one bloom at a time.
            </p>
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-sm">Made with</span>
              <Heart className="h-4 w-4 text-pink-400 fill-current" />
              <span className="text-gray-400 text-sm">in the heart of Rwanda</span>
            </div>
          </div>
        </div>

        {/* Cloud Sync Attribution */}
        <div className="border-t border-gray-800 pt-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-2 md:mb-0">
              <span className="text-gray-400 text-sm">Powered by</span>
              <div className="flex items-center">
                <div className="flex items-center space-x-3 bg-black rounded-lg px-3 py-1 shadow-lg border border-gray-700">
                  <div className="flex items-center space-x-1">
                    <div className="relative">
                      <div className="w-5 h-1 bg-orange-500 transform rotate-45 origin-center"></div>
                      <div className="w-3 h-1 bg-orange-500 transform rotate-45 -mt-1 ml-1 origin-center"></div>
                    </div>
                  </div>
                  <span className="text-white text-sm font-medium ml-2">Cloud Sync</span>
                </div>
              </div>
            </div>
            <div className="text-gray-400 text-xs">
              E-commerce platform developed by Cloud Sync
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer 