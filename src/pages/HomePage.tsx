import { useEffect, useState } from 'react';
import { ArrowRight, Flower2, Sparkles, ShoppingCart, Heart, Truck, Shield, Clock, Gift, CheckCircle, Phone } from 'lucide-react';
import { supabase, Category, SiteContent, Product } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

type HomePageProps = {
  onNavigate: (page: string, categoryId?: string) => void;
};

export default function HomePage({ onNavigate }: HomePageProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [content, setContent] = useState<{ [key: string]: string }>({});
  const { user } = useAuth();

  useEffect(() => {
    loadCategories();
    loadProducts();
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

  const loadProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(8);

    if (data && !error) {
      setProducts(data);
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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner Section - Enhanced Size */}
      <section className="bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            
            {/* Left Side - Larger Advertisement Image */}
            <div className="w-full lg:flex-[1.6] max-w-xl">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-pink-100 transform hover:scale-[1.01] transition-transform duration-300">
                <img
                  src="/images/special announcment on valentines.jpg"
                  alt="Akazuba Valentine's Day Menu"
                  className="w-full h-auto object-contain max-h-[550px]"
                  onError={(e) => {
                    console.error('Failed to load advertisement image');
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            </div>

            {/* Right Side - Promotional Text Banner */}
            <div className="w-full lg:flex-1 text-center lg:text-left">
              <div className="bg-white rounded-2xl p-8 md:p-10 shadow-lg border-l-8 border-pink-500">
                <div className="inline-block px-4 py-1 rounded-full bg-pink-100 text-pink-600 text-sm font-bold mb-4">
                  LIMITED TIME OFFER
                </div>
                <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
                  AKAZUBA <span className="text-pink-600">VALENTINE'S</span> PACKAGES
                </h1>
                <p className="text-xl text-gray-700 font-semibold mb-6">
                  Luxury Bouquets, Cakes & Gifts 
                  <span className="block text-pink-600 mt-1">Starting from RWF 55,000</span>
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-center lg:justify-start gap-3 text-gray-600">
                    <div className="p-2 bg-pink-50 rounded-lg">
                      <Truck className="w-5 h-5 text-pink-500" />
                    </div>
                    <span className="font-medium text-lg">Free Delivery in Kigali</span>
                  </div>
                  <div className="flex items-center justify-center lg:justify-start gap-3 text-gray-600">
                    <div className="p-2 bg-pink-50 rounded-lg">
                      <Phone className="w-5 h-5 text-pink-500" />
                    </div>
                    <span className="font-medium text-lg">Call to Order: 0784586110</span>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('products')}
                  className="w-full md:w-auto px-10 py-4 bg-pink-600 text-white rounded-xl hover:bg-pink-700 transition-all shadow-lg hover:shadow-pink-200 font-bold text-lg flex items-center justify-center gap-2"
                >
                  <Heart className="w-5 h-5 fill-current" />
                  Shop Valentine's Menu
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="w-full">
            {/* Shop by Category Section */}
            <section className="mb-16">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Shop by Category</h2>
                  <p className="text-gray-600">Explore our curated floral and gift collections</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    onClick={() => onNavigate('products', category.id)}
                    className="group relative h-80 overflow-hidden rounded-2xl shadow-lg cursor-pointer"
                  >
                    <img
                      src={category.image_url}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-8">
                      <h3 className="text-2xl font-bold text-white mb-2">{category.name}</h3>
                      <p className="text-white/80 mb-4 line-clamp-2">{category.description}</p>
                      <div className="inline-flex items-center space-x-2 text-pink-400 font-bold group-hover:text-pink-300 transition-colors">
                        <span>Explore Collection</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Our Products Section */}
            <section className="mb-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
                <div className="flex bg-gray-200/50 p-1 rounded-xl">
                  <button className="px-6 py-2 bg-white text-gray-900 rounded-lg shadow-sm text-sm font-bold">
                    All
                  </button>
                  <button className="px-6 py-2 text-gray-600 hover:text-gray-900 rounded-lg text-sm font-bold transition">
                    New
                  </button>
                  <button className="px-6 py-2 text-gray-600 hover:text-gray-900 rounded-lg text-sm font-bold transition">
                    Popular
                  </button>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.slice(0, 8).map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100"
                  >
                    <div className="aspect-square overflow-hidden bg-gray-100 relative">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                      />
                      {product.stock_quantity === 0 && (
                        <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-lg">
                          Sold Out
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-gray-500 text-sm mb-4 line-clamp-2 h-10">{product.description}</p>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xl font-black text-pink-600">
                          RWF {product.price.toLocaleString()}
                        </span>
                      </div>
                      <button
                        onClick={() => onNavigate('products')}
                        className="w-full flex items-center justify-center space-x-2 py-3 bg-gray-900 text-white rounded-xl hover:bg-pink-600 transition-colors font-bold text-sm"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
        </div>
      </div>
    </div>
  );
}
