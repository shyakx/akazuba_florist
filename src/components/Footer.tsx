import { Heart, Mail, Phone, MapPin, Clock, Facebook, Instagram, Twitter, Truck } from 'lucide-react';

type FooterProps = {
  onNavigate: (page: string) => void;
};

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Company Info */}
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-center space-x-2 mb-3">
              <img 
                src="/images/logo/akazuba-logo-icon.png" 
                alt="AKAZUBA FLORIST" 
                className="h-6 w-6 rounded-full"
                onError={(e) => {
                  // Fallback to heart icon if logo not found
                  e.currentTarget.style.display = 'none';
                  const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                  if (nextElement) {
                    nextElement.style.display = 'block';
                  }
                }}
              />
              <div className="bg-primary-600 p-1.5 rounded-full" style={{ display: 'none' }}>
                <Heart className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-xl font-bold">AKAZUBA FLORIST</h3>
            </div>
            <p className="text-gray-300 mb-3 max-w-md text-sm">
              Premium flowers and perfumes delivered throughout Rwanda. 
              Same-day delivery in Kigali.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="text-gray-400 hover:text-primary-500 transition">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="text-gray-300 hover:text-primary-500 transition text-sm"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('products')}
                  className="text-gray-300 hover:text-primary-500 transition text-sm"
                >
                  Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="text-gray-300 hover:text-primary-500 transition text-sm"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="text-gray-300 hover:text-primary-500 transition text-sm"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-base font-semibold mb-3">Contact Info</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-primary-500" />
                <span className="text-gray-300 text-sm">info.akazubaflorist@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-primary-500" />
                <span className="text-gray-300 text-sm">+250 784 586 110</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-primary-500" />
                <span className="text-gray-300 text-sm">Kigali, Rwanda</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-primary-500" />
                <div className="text-gray-300 text-sm">
                  <div>Mon-Fri: 8AM-6PM</div>
                  <div>Sat: 9AM-4PM, Sun: Closed</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Combined Info Section */}
        <div className="mt-6 pt-4 border-t border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Delivery Info */}
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <div className="bg-primary-100 w-6 h-6 rounded-full flex items-center justify-center mx-auto mb-1">
                  <Truck className="w-3 h-3 text-primary-500" />
                </div>
                <h5 className="font-medium text-sm mb-1">Delivery Fee</h5>
                <p className="text-gray-300 text-xs">RWF 2,000</p>
              </div>
              <div className="text-center">
                <div className="bg-primary-100 w-6 h-6 rounded-full flex items-center justify-center mx-auto mb-1">
                  <Clock className="w-3 h-3 text-primary-500" />
                </div>
                <h5 className="font-medium text-sm mb-1">Same Day</h5>
                <p className="text-gray-300 text-xs">Before 2PM</p>
              </div>
              <div className="text-center">
                <div className="bg-primary-100 w-6 h-6 rounded-full flex items-center justify-center mx-auto mb-1">
                  <Heart className="w-3 h-3 text-primary-500" />
                </div>
                <h5 className="font-medium text-sm mb-1">Premium</h5>
                <p className="text-gray-300 text-xs">Quality</p>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="text-center md:text-right">
              <h4 className="text-sm font-semibold mb-2">Payment Methods</h4>
              <div className="flex justify-center md:justify-end items-center space-x-3">
                <div className="bg-white rounded px-3 py-1">
                  <span className="text-gray-900 font-medium text-sm">MTN MoMo</span>
                </div>
                <div className="bg-white rounded px-3 py-1">
                  <span className="text-gray-900 font-medium text-sm">BK</span>
                </div>
                <div className="bg-white rounded px-3 py-1">
                  <span className="text-gray-900 font-medium text-sm">COD</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-3 pt-2 border-t border-gray-800 text-center">
          <p className="text-gray-400 text-xs">
            © 2025 AKAZUBA FLORIST. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
