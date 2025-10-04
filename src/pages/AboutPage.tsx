import { useEffect, useState } from 'react';
import { Heart, Award, Users, Flower, Star, Shield, Truck } from 'lucide-react';
import { supabase, SiteContent } from '../lib/supabase';

export default function AboutPage() {
  const [content, setContent] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .eq('page', 'about');

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
      <section className="bg-green-600 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">About AKAZUBA FLORIST</h1>
          <p className="text-lg text-green-100 max-w-3xl mx-auto">
            Rwanda's premier destination for premium fresh flowers and elegant floral arrangements. 
            We specialize in creating stunning bouquets, wedding arrangements, and custom floral designs 
            that celebrate life's most precious moments.
          </p>
        </div>
      </section>

      {/* Our Services Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Services</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              From intimate celebrations to grand events, we provide comprehensive floral solutions 
              tailored to your unique needs and preferences.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Flower className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Fresh Flower Bouquets</h3>
              <p className="text-gray-600">
                Handcrafted bouquets using the freshest flowers, perfect for birthdays, anniversaries, 
                and special occasions.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Wedding Arrangements</h3>
              <p className="text-gray-600">
                Stunning bridal bouquets, centerpieces, and ceremony decorations that make your 
                special day unforgettable.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Graduation Celebrations</h3>
              <p className="text-gray-600">
                Beautiful graduation bouquets and arrangements to celebrate academic achievements 
                and new beginnings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-700">
                <p className="text-lg leading-relaxed">
                  Founded with a passion for natural beauty and a commitment to excellence, 
                  AKAZUBA FLORIST has been serving Rwanda's floral needs with dedication and care.
                </p>
                <p className="text-lg leading-relaxed">
                  We source the freshest, highest-quality flowers and work with skilled florists 
                  to create beautiful, long-lasting arrangements. Our convenient online platform 
                  allows you to browse our collections, place orders, and pay securely.
                </p>
                <p className="text-lg leading-relaxed">
                  Whether you're celebrating a wedding, graduation, birthday, or simply want to 
                  brighten someone's day, AKAZUBA FLORIST delivers exceptional floral experiences 
                  that create lasting memories.
                </p>
              </div>
            </div>
            
            <div className="bg-green-50 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Why Choose AKAZUBA FLORIST?</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Star className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Premium Quality</h4>
                    <p className="text-gray-600 text-sm">Only the freshest flowers from trusted suppliers</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Truck className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Same-Day Delivery</h4>
                    <p className="text-gray-600 text-sm">Fast and reliable delivery throughout Kigali</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Secure Payment</h4>
                    <p className="text-gray-600 text-sm">Safe online payments with MTN MoMo and BK</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Expert Service</h4>
                    <p className="text-gray-600 text-sm">Professional florists with years of experience</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values Section */}
      <section className="py-16 px-4 bg-green-600">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-8">Our Mission & Values</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm p-8 rounded-xl">
              <Heart className="w-12 h-12 text-white mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-4">Our Mission</h3>
              <p className="text-green-100 leading-relaxed">
                To bring joy and beauty into your life through carefully curated flowers and 
                exceptional service. We believe every occasion deserves the perfect flowers, 
                and we're committed to making your floral dreams come true.
              </p>
            </div>
            
            <div className="bg-white bg-opacity-10 backdrop-blur-sm p-8 rounded-xl">
              <Award className="w-12 h-12 text-white mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-4">Our Values</h3>
              <p className="text-green-100 leading-relaxed">
                Quality, integrity, and customer satisfaction are at the heart of everything we do. 
                We work with suppliers who share our commitment to environmental responsibility 
                and ethical business practices.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
