import { useEffect, useState } from 'react';
import { Mail, MapPin, Phone, Clock, Instagram } from 'lucide-react';
import { supabase, SiteContent } from '../lib/supabase';
import BusinessStatus from '../components/BusinessStatus';

export default function ContactPage() {
  const [content, setContent] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .eq('page', 'contact');

    if (data && !error) {
      const contentMap: { [key: string]: string } = {};
      data.forEach((item: SiteContent) => {
        contentMap[item.section] = item.content;
      });
      setContent(contentMap);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-green-600 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Contact AKAZUBA FLORIST</h1>
          <p className="text-lg text-green-100 max-w-3xl mx-auto">
            Ready to make your floral dreams come true? Get in touch with our expert team. 
            We're here to help you create the perfect arrangement for any occasion.
          </p>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Get in Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="bg-green-600 p-3 rounded-full">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">Email Us</h3>
                    <p className="text-gray-600 mb-1">{content.email || 'info.akazubaflorist@gmail.com'}</p>
                    <p className="text-sm text-gray-500">We respond within 2 hours during business hours</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="bg-green-600 p-3 rounded-full">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">Call Us</h3>
                    <p className="text-gray-600 mb-1">{content.phone || '+250 784 586 110'}</p>
                    <p className="text-sm text-gray-500">Available 7 days a week, 8 AM - 8 PM</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="bg-green-600 p-3 rounded-full">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">Visit Us</h3>
                    <p className="text-gray-600 mb-1">{content.location || 'Kigali, Rwanda'}</p>
                    <p className="text-sm text-gray-500">Same-day delivery available throughout Kigali</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="bg-green-600 p-3 rounded-full">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">Business Hours</h3>
                    <p className="text-gray-600 mb-1">Monday - Sunday: 8:00 AM - 8:00 PM</p>
                    <p className="text-sm text-gray-500 mb-2">Open 7 days a week for your convenience</p>
                    <div className="mt-2">
                      <BusinessStatus />
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="bg-green-600 p-3 rounded-full">
                    <Instagram className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">Follow Us</h3>
                    <a 
                      href="https://www.instagram.com/akazuba_florists?igsh=aXdsY203Y3Eza2x4" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-600 mb-1 hover:text-green-600 transition-colors"
                    >
                      @akazuba_florists
                    </a>
                    <p className="text-sm text-gray-500">See our latest arrangements and behind-the-scenes</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-8">Send us a Message</h2>
              
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="+250 784 586 110"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Tell us how we can help you..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 transition text-lg"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Delivery Information</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We deliver fresh flowers throughout Kigali and surrounding areas. 
              Fast, reliable, and always on time.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Kigali City</h3>
              <p className="text-gray-600 mb-3">
                RWF 2,000 delivery fee within Kigali city limits. 
                Same-day delivery available for orders placed before 2:00 PM.
              </p>
              <div className="text-sm text-green-600 font-medium">
                ✓ Free delivery on orders over RWF 50,000
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Delivery Times</h3>
              <p className="text-gray-600 mb-3">
                We deliver 7 days a week from 8:00 AM to 8:00 PM. 
                Express delivery available for urgent orders.
              </p>
              <div className="text-sm text-green-600 font-medium">
                ✓ 2-hour express delivery available
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Phone className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Surrounding Areas</h3>
              <p className="text-gray-600 mb-3">
                Delivery available to surrounding areas with additional charges. 
                Contact us for specific locations and pricing.
              </p>
              <div className="text-sm text-green-600 font-medium">
                ✓ Custom delivery arrangements
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
