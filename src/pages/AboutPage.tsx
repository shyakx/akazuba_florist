import { useEffect, useState } from 'react';
import { Heart, Award, Users } from 'lucide-react';
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
      <section className="bg-gradient-to-br from-primary-500 to-red-500 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">About Us</h1>
          <p className="text-xl text-primary-50">
            Bringing beauty and elegance to your life since day one
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <div className="flex items-center space-x-3 mb-4">
              <Heart className="w-8 h-8 text-primary-500" />
              <h2 className="text-3xl font-bold text-gray-800">Our Mission</h2>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed">
              {content.mission ||
                'Our mission is to bring joy and beauty into your life through carefully curated flowers and fragrances. Each product is selected with care to ensure the highest quality and customer satisfaction.'}
            </p>
          </div>

          <div className="mb-12">
            <div className="flex items-center space-x-3 mb-4">
              <Award className="w-8 h-8 text-primary-500" />
              <h2 className="text-3xl font-bold text-gray-800">Our Story</h2>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed">
              {content.story ||
                'Founded with a passion for natural beauty, we have been serving Rwanda for years with the finest flowers and perfumes from around the world.'}
            </p>
          </div>

          <div>
            <div className="flex items-center space-x-3 mb-4">
              <Users className="w-8 h-8 text-primary-500" />
              <h2 className="text-3xl font-bold text-gray-800">Why Choose Us</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-primary-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Quality Assured</h3>
                <p className="text-gray-600">
                  Every product undergoes strict quality control to ensure you receive only the best
                </p>
              </div>
              <div className="bg-primary-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Expert Selection</h3>
                <p className="text-gray-600">
                  Our team carefully curates each item in our collection with passion and expertise
                </p>
              </div>
              <div className="bg-primary-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Customer First</h3>
                <p className="text-gray-600">
                  Your satisfaction is our priority, with dedicated support always ready to help
                </p>
              </div>
              <div className="bg-primary-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Sustainable Practices</h3>
                <p className="text-gray-600">
                  We work with suppliers who share our commitment to environmental responsibility
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
