'use client'

import Link from 'next/link'
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Heart, Flower, Clock, Star } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white relative">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Flower className="h-6 w-6 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold text-white">Akazuba Florist</span>
            </div>
            <p className="text-gray-300 text-sm mb-6 leading-relaxed">
              Premium flowers and perfumes delivered fresh to your door.
            </p>
            <div className="flex space-x-3">
              {[
                { icon: Facebook, href: "#", label: "Facebook" },
                { icon: Instagram, href: "https://www.instagram.com/akazuba_florists/", label: "Instagram" },
                { icon: Twitter, href: "#", label: "Twitter" }
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="text-gray-400 hover:text-pink-400 transition-colors duration-300 p-2 rounded-lg hover:bg-gray-800/50 flex items-center justify-center"
                  title={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-semibold mb-3 text-white">
              Explore Our Collection
            </h3>
            <ul className="space-y-2">
              {[
                { name: "Home", href: "/" },
                { name: "Roses Collection", href: "/category/roses" },
                { name: "Tulips Gallery", href: "/category/tulips" },
                { name: "Mixed Bouquets", href: "/category/mixed" },
                { name: "Wedding Flowers", href: "/category/wedding" }
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-300 text-sm font-medium block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-base font-semibold mb-4 text-white">
              Connect With Us
            </h3>
            <div className="space-y-3">
              {[
                {
                  icon: Mail,
                  text: "info.akazubaflorist@gmail.com",
                  href: "mailto:info.akazubaflorist@gmail.com"
                },
                {
                  icon: Phone,
                  text: "0784586110",
                  href: "tel:0784586110"
                },
                {
                  icon: MapPin,
                  text: "Kigali, Rwanda",
                  href: null
                },
                {
                  icon: Clock,
                  text: "Mon-Sat: 8AM-8PM",
                  href: null
                }
              ].map((contact, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3"
                >
                  <div className="w-6 h-6 bg-pink-500/20 rounded-lg flex items-center justify-center backdrop-blur-sm flex-shrink-0 mt-0.5">
                    <contact.icon className="h-3.5 w-3.5 text-pink-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    {contact.href ? (
                      <a
                        href={contact.href}
                        className="text-gray-300 hover:text-white transition-colors duration-300 text-sm font-medium block break-words"
                      >
                        {contact.text}
                      </a>
                    ) : (
                      <span className="text-gray-300 text-sm font-medium block">{contact.text}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shopping Links */}
          <div>
            <h3 className="text-base font-semibold mb-3 text-white">
              Shopping
            </h3>
            <ul className="space-y-2">
              {[
                { name: "Get in Touch", href: "/contact" },
                { name: "Delivery Info", href: "/delivery" },
                { name: "Privacy Policy", href: "/privacy" },
                { name: "Terms of Service", href: "/terms" }
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-300 text-sm font-medium block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Developer Section - Cloud Sync Logo */}
        <div className="border-t border-gray-700/30 pt-6 pb-4">
          <div className="text-center">
            <div className="inline-block">
              <div className="text-gray-500 text-xs uppercase tracking-wider mb-3">Developed by</div>
              <div className="flex items-center justify-center space-x-3">
                <img 
                  src="/images/flowers/mixed/cloud-sync-logo.png" 
                  alt="Cloud Sync Logo" 
                  className="h-12 w-auto object-contain filter brightness-110 flex-shrink-0"
                />
                <div className="text-left">
                  <div className="text-white font-bold text-lg tracking-tight leading-tight">Cloud Sync</div>
                  <div className="text-gray-400 text-xs italic leading-tight">Crafting Digital Experiences That Sync</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700/50 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-300 text-sm font-medium mb-1">
                © 2024 Akazuba Florist. All rights reserved.
              </p>
              <p className="text-gray-500 text-xs">
                Registered in Rwanda | Business License: AKZ-FLR-2024 | VAT: RW-2024-001
              </p>
            </div>
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
          
          {/* Additional Legal Links */}
          <div className="mt-4 pt-4 border-t border-gray-700/30">
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs text-gray-500">
              <Link href="/privacy" className="hover:text-gray-300 transition-colors">
                Privacy Policy
              </Link>
              <span>•</span>
              <Link href="/terms" className="hover:text-gray-300 transition-colors">
                Terms of Service
              </Link>
              <span>•</span>
              <Link href="/delivery" className="hover:text-gray-300 transition-colors">
                Delivery Policy
              </Link>
              <span>•</span>
              <Link href="/contact" className="hover:text-gray-300 transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer 