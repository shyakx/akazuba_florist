import { useEffect, useState } from 'react';
import { ArrowRight, Flower2, Sparkles } from 'lucide-react';
import { supabase, Category, SiteContent } from '../lib/supabase';

type HomePageProps = {
  onNavigate: (page: string, categoryId?: string) => void;
};

export default function HomePage({ onNavigate }: HomePageProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [content, setContent] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    loadCategories();
    loadContent();
  }, []);

  const loadCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (data && !error) {
      setCategories(data);
    }
  };

  const loadContent = async () => {
    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .eq('page', 'home');

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
      <section className="relative bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 text-white py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="flex space-x-4">
                <Flower2 className="w-12 h-12 animate-pulse" />
                <Sparkles className="w-12 h-12 animate-pulse" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              {content.hero_title || 'Welcome to AKAZUBA FLORIST'}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-50">
              {content.hero_subtitle || 'Discover premium flowers and perfumes delivered to your door in Rwanda'}
            </p>
            <button
              onClick={() => onNavigate('products')}
              className="inline-flex items-center space-x-2 bg-white text-green-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-green-50 transition shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <span>Shop Now</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">Shop by Category</h2>
          <p className="text-center text-gray-600 mb-12 text-lg">
            Explore our beautiful collections
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {categories.map((category) => (
              <div
                key={category.id}
                onClick={() => onNavigate('products', category.id)}
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition cursor-pointer transform hover:scale-[1.02] duration-300"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={category.image_url}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-6">
                  <h3 className="text-3xl font-bold text-white mb-2">{category.name}</h3>
                  <p className="text-white/90 mb-4">{category.description}</p>
                  <div className="inline-flex items-center space-x-2 text-white font-semibold group-hover:gap-4 transition-all">
                    <span>Explore Collection</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gradient-to-br from-green-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Flower2 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Premium Quality</h3>
              <p className="text-gray-600">
                Only the finest flowers and fragrances sourced from trusted suppliers
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Fast Delivery</h3>
              <p className="text-gray-600">
                Quick and reliable delivery straight to your doorstep
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Customer Care</h3>
              <p className="text-gray-600">
                Dedicated support team ready to help you with any questions
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
