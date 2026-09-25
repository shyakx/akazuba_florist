import { useEffect, useState } from 'react';
import { ArrowRight, ShoppingCart, Sparkles } from 'lucide-react';
import { supabase, Category, Product } from '../lib/supabase';

type HomePageProps = {
  onNavigate: (page: string, categoryId?: string) => void;
};

export default function HomePage({ onNavigate }: HomePageProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([loadCategories(), loadProducts()]).finally(() => setLoading(false));
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

  
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative overflow-hidden bg-gray-900 text-white">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/images/hero-flower.jpg"
          className="absolute inset-0 h-full w-full object-cover object-center opacity-100"
          aria-label="Flower arrangement video"
        >
          <source src="/images/Pink%20Elegant%20Minimalist%20Hello%20May%20Mobile%20Video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-black/5" />
        <div className="relative mx-auto flex min-h-[320px] max-w-7xl items-center px-4 py-12 sm:min-h-[360px] sm:px-6 lg:min-h-[420px] lg:px-8">
          <div className="max-w-xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary-100">
              <Sparkles className="h-4 w-4" /> Thoughtful gifts, beautifully made
            </div>
            <h1 className="max-w-lg text-4xl font-black leading-tight tracking-tight sm:text-5xl">Make every moment bloom.</h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-white/75 sm:text-base">Fresh flowers, perfumes, and gifts delivered with care across Kigali.</p>
            <button onClick={() => onNavigate('products')} className="mt-7 inline-flex items-center gap-2 rounded-lg bg-primary-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-black/10 transition hover:bg-primary-400">
              Shop the collection <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <section className="mb-12">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-primary-600">Find your perfect gift</p>
              <h2 className="text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">Shop by category</h2>
            </div>
            <button onClick={() => onNavigate('products')} className="hidden items-center gap-1 text-sm font-bold text-primary-600 hover:text-primary-800 sm:flex">View all <ArrowRight className="h-4 w-4" /></button>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {Array.from({ length: 5 }).map((_, index) => <div key={index} className="aspect-[1.35] animate-pulse rounded-xl bg-gray-200" />)}
            </div>
          ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {categories.map((category) => (
              <button key={category.id} onClick={() => onNavigate('products', category.id)} className="group overflow-hidden rounded-xl bg-white text-left shadow-sm ring-1 ring-gray-100 transition hover:-translate-y-1 hover:shadow-lg">
                <div className="aspect-[1.35] overflow-hidden bg-gray-100">
                  <img src={category.image_url} alt={category.name} loading="lazy" decoding="async" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                </div>
                <div className="flex items-center justify-between gap-2 p-3">
                  <span className="truncate text-sm font-bold text-gray-800">{category.name}</span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-primary-600 transition group-hover:translate-x-1" />
                </div>
              </button>
            ))}
          </div>
          )}
        </section>

        <section>
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-primary-600">Handpicked for you</p>
              <h2 className="text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">Featured products</h2>
            </div>
            <button onClick={() => onNavigate('products')} className="flex items-center gap-1 text-sm font-bold text-primary-600 hover:text-primary-800">View all <ArrowRight className="h-4 w-4" /></button>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => <div key={index} className="aspect-[0.82] animate-pulse rounded-xl bg-gray-200" />)}
            </div>
          ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
            {products.slice(0, 8).map((product) => (
              <article key={product.id} className="group overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100 transition hover:-translate-y-1 hover:shadow-lg">
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  <img src={product.image_url} alt={product.name} loading="lazy" decoding="async" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  {product.stock_quantity === 0 && <span className="absolute left-2 top-2 rounded-md bg-red-500 px-2 py-1 text-[10px] font-bold uppercase text-white">Sold out</span>}
                </div>
                <div className="p-3 sm:p-4">
                  <h3 className="truncate text-sm font-bold text-gray-900">{product.name}</h3>
                  <p className="mt-1 h-9 overflow-hidden text-xs leading-4 text-gray-500">{product.description}</p>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <span className="text-sm font-black text-primary-600 sm:text-base">RWF {product.price.toLocaleString()}</span>
                    <button onClick={() => onNavigate('products')} className="inline-flex items-center gap-1 rounded-lg bg-primary-600 px-2.5 py-2 text-xs font-bold text-white transition hover:bg-primary-700"><ShoppingCart className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Add</span></button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          )}
        </section>
      </div>
    </div>
  );
}
