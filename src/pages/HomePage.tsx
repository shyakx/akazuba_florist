import { useEffect, useState } from 'react';
import { ArrowRight, Flower2, Sparkles, ShoppingCart, Heart, Truck, Shield, Clock, Gift, CheckCircle } from 'lucide-react';
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
      {/* Hero Banner Section - Light Gray Background */}
      <section className="bg-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-4 items-center">
            {/* Left Side - Advertisement Image */}
            <div className="hidden lg:block flex-1 max-w-sm">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <img
                  src="/images/special announcment on valentines.jpg"
                  alt="Special Valentine's Day Offer"
                  className="w-full h-auto object-contain max-h-[300px]"
                  onError={(e) => {
                    console.error('Failed to load advertisement image');
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            </div>

            {/* Center - Promotional Banner */}
            <div className="flex-1 text-center lg:text-left">
              <div className="bg-white rounded-lg p-5 shadow-sm">
                <div className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
                  SAVE UP TO A RWF 50,000
                </div>
                <div className="text-lg md:text-xl font-bold text-gray-800 mb-3">
                  On Selected Bouquets & Perfumes
                </div>
                <p className="text-gray-600 text-sm mb-4">Terms and Condition Apply</p>
                <button
                  onClick={() => onNavigate('products')}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold text-sm"
                >
                  Shop Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Main Content - Full Width */}
        <div className="w-full">
            {/* Shop by Category Section */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Shop by Category</h2>
              <p className="text-gray-600 text-sm mb-4">
                Explore our beautiful collections
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    onClick={() => onNavigate('products', category.id)}
                    className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition cursor-pointer transform hover:scale-[1.02] duration-300"
                  >
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={category.image_url}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-3">
                      <h3 className="text-lg font-bold text-white mb-1">{category.name}</h3>
                      <p className="text-white/90 mb-2 text-xs">{category.description}</p>
                      <div className="inline-flex items-center space-x-1 text-white font-semibold group-hover:gap-3 transition-all text-xs">
                        <span>Explore Collection</span>
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Our Products Section */}
            <section className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Our Products</h2>
                <div className="flex space-x-1">
                  <button className="px-3 py-1.5 bg-primary-600 text-white rounded-lg text-xs font-medium">
                    All Products
                  </button>
                  <button className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-300">
                    New Arrivals
                  </button>
                  <button className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-300">
                    Featured
                  </button>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {products.slice(0, 8).map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg shadow-sm hover:shadow-lg transition overflow-hidden group"
                  >
                    <div className="aspect-square overflow-hidden bg-gray-100 relative">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                      />
                      {product.stock_quantity === 0 && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                          Out of Stock
                        </div>
                      )}
                    </div>
                    <div className="p-2">
                      <h3 className="text-xs font-semibold text-gray-800 mb-1 line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 text-xs mb-1.5 line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-bold text-primary-600">
                          RWF {product.price.toLocaleString()}
                        </span>
                      </div>
                      <button
                        onClick={() => onNavigate('products')}
                        className="w-full flex items-center justify-center space-x-1 px-2 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-xs font-medium"
                      >
                        <ShoppingCart className="w-3 h-3" />
                        <span>Add To Cart</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
        </div>
      </div>

      {/* Service Features Section - Bottom */}
      <section className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="text-center">
              <div className="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                <Truck className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-bold text-gray-800 mb-0.5 text-xs">Free Return</h3>
              <p className="text-gray-600 text-xs">30 days money back guarantee!</p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                <Truck className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-bold text-gray-800 mb-0.5 text-xs">Free Shipping</h3>
              <p className="text-gray-600 text-xs">Free shipping on all order</p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                <Clock className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-bold text-gray-800 mb-0.5 text-xs">Support 24/7</h3>
              <p className="text-gray-600 text-xs">We support online 24 hrs a day</p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                <Gift className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-bold text-gray-800 mb-0.5 text-xs">Receive Gift Card</h3>
              <p className="text-gray-600 text-xs">Receive gift all over order RWF 50,000</p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                <Shield className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-bold text-gray-800 mb-0.5 text-xs">Secure Payment</h3>
              <p className="text-gray-600 text-xs">We Value Your Security</p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-bold text-gray-800 mb-0.5 text-xs">Online Service</h3>
              <p className="text-gray-600 text-xs">Free return products in 30 days</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
