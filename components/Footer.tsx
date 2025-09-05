'use client'

import React from 'react'
import Link from 'next/link'
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Heart, Flower, Clock, Star } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white relative">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-pink-500 rounded-xl flex items-center justify-center">
                <Flower className="h-6 w-6 text-white" />
              </div>
              <span className="ml-3 text-2xl font-bold">Akazuba Florist</span>
            </div>
            <p className="text-gray-300 text-sm mb-6">
              Premium flowers and perfumes delivered fresh to your door.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: Facebook, href: "#", label: "Facebook" },
                { icon: Instagram, href: "https://www.instagram.com/akazuba_florists?igsh=aXdsY203Y3Eza2x4", label: "Instagram" },
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
                { name: "Mixed Bouquets", href: "/category/mixed", desc: "Artistic floral symphonies" },
                { name: "Wedding Flowers", href: "/category/wedding", desc: "Your special day blooms" }
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
                  text: "info.akazubaflorist@gmail.com",
                  href: "mailto:info.akazubaflorist@gmail.com",
                  desc: "Send us your floral dreams"
                },
                {
                  icon: Phone,
                  text: "0784586110",
                  href: "tel:0784586110",
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

          {/* Shopping Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">
              Shopping
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Get in Touch", href: "/contact", desc: "Customer support" },
                { name: "Delivery Info", href: "/delivery", desc: "How we deliver" },
                { name: "Privacy Policy", href: "/privacy", desc: "Your privacy matters" },
                { name: "Terms of Service", href: "/terms", desc: "Terms and conditions" }
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

        {/* Developer Section - Cloud Sync Logo */}
        <div className="border-t border-gray-700/30 pt-12 pb-8">
          <div className="text-center">
            <div className="inline-block">
              <div className="text-gray-500 text-xs uppercase tracking-wider mb-6">Developed by</div>
              <div className="flex items-center justify-center space-x-4">
                <img 
                  src="/images/cloud-sync-logo.png" 
                  alt="Cloud Sync Logo" 
                  className="h-16 w-auto object-contain filter brightness-110 flex-shrink-0"
                />
                <div className="text-left">
                  <div className="text-white font-bold text-2xl tracking-tight leading-tight">Cloud Sync</div>
                  <div className="text-gray-400 text-sm italic leading-tight">Crafting Digital Experiences That Sync</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700/50 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2024 Akazuba Florist. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <span className="text-gray-400 text-sm">Secure shopping</span>
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="h-4 w-4 text-pink-400" />
                <span className="text-gray-400 text-sm">Made with love</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer 