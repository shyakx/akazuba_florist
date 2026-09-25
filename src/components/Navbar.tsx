import { useEffect, useState } from 'react';
import { ShoppingCart, User, Home, Phone, Heart, Search, List, ChevronDown, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Category } from '../lib/supabase';

type NavbarProps = {
  onNavigate: (page: string, categoryId?: string, searchQuery?: string) => void;
  currentPage: string;
  cartItemCount: number;
  wishlistItemCount: number;
};

export default function Navbar({ onNavigate, currentPage, cartItemCount, wishlistItemCount }: NavbarProps) {
  const { user, profile, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [browseOpen, setBrowseOpen] = useState(false);
  const [pagesOpen, setPagesOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadCategories = async () => {
      const { data, error } = await supabase.from('categories').select('*').order('name');
      if (data && !error) {
        setCategories(data);
      }
    };

    loadCategories();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      onNavigate('home');
    } catch (error) {
      console.warn('Sign out error (non-critical):', error);
      onNavigate('home');
    }
  };

  const navigate = (page: string) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    setBrowseOpen(false);
    setPagesOpen(false);
  };

  const navigateToCategory = (categoryId: string) => {
    onNavigate('products', categoryId);
    setMobileMenuOpen(false);
    setBrowseOpen(false);
  };

  const handleSearch = () => {
    const query = searchQuery.trim();
    if (query) {
      onNavigate('products', undefined, query);
    } else {
      onNavigate('products');
    }
  };

  return (
    <>
      {/* Top Header Bar - Gray Background */}
      <div className="bg-[#2d8060] text-xs text-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-9">
            {/* Left Side - Help/Support/Contact */}
            <div className="hidden md:flex items-center gap-5">
              <button onClick={() => navigate('contact')} className="hover:text-white transition">
                Need help? Contact us
              </button>
              <span className="h-3 w-px bg-white/20" />
              <span>Fresh flowers, delivered in Kigali</span>
            </div>

            {/* Center - Call Us */}
            <div className="flex-1 text-center">
              <span className="hidden sm:block">Call us: <a href="tel:+250784586110" className="text-white hover:underline">+250 784 586 110</a></span>
            </div>

            {/* Right Side - User Actions */}
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <>
                  <button
                    onClick={() => navigate('home')}
                    className="hover:text-white transition flex items-center gap-1"
                  >
                    <Home className="w-4 h-4" />
                    <span>My Dashboard</span>
                  </button>
                  <button
                    onClick={() => navigate('wishlist')}
                    className="hover:text-white transition"
                  >
                    Wishlist
                  </button>
                  <button
                    onClick={() => navigate('cart')}
                    className="hover:text-white transition"
                  >
                    My Cart
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="hover:text-white transition"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate('login')}
                    className="hover:text-white transition"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate('wishlist')}
                    className="hover:text-white transition"
                  >
                    Wishlist
                  </button>
                  <button
                    onClick={() => navigate('cart')}
                    className="hover:text-white transition"
                  >
                    My Cart
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Header - White Background with Logo and Search */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[76px] gap-5">
            {/* Logo */}
            <button
              onClick={() => navigate('home')}
              className="flex items-center gap-2 shrink-0"
            >
              <img 
                src="/images/logo/akazuba-logo.png" 
                alt="AKAZUBA FLORIST" 
                className="h-10 w-auto"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  if (target.src.includes('akazuba-logo.png')) {
                    target.src = '/images/logo/akazuba-logo-icon.png';
                  } else {
                    target.style.display = 'none';
                  }
                }}
              />
              <span className="text-2xl font-black tracking-tight text-primary-600">AKAZUBA</span>
            </button>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-2xl">
              <div className="flex w-full rounded-xl bg-gray-50 border border-gray-200 focus-within:border-primary-600 focus-within:ring-4 focus-within:ring-primary-600/10 overflow-hidden">
                <button className="px-4 text-sm font-semibold text-gray-700 border-r border-gray-200 flex items-center gap-2">
                  All categories <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                <input
                  type="text"
                  placeholder="Search Looking For?"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                  className="flex-1 px-4 py-3 bg-transparent text-sm focus:outline-none"
                />
                <button onClick={handleSearch} className="px-5 bg-primary-600 text-white hover:bg-primary-700 transition" aria-label="Search">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Right Icons */}
            <div className="flex items-center space-x-4">
              {user && (
                <button
                  onClick={() => onNavigate('wishlist')}
                  className="relative p-2 text-gray-700 hover:text-primary-600 transition"
                  title="Wishlist"
                >
                  <Heart className="w-6 h-6" />
                  {wishlistItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {wishlistItemCount}
                    </span>
                  )}
                </button>
              )}
              <button
                onClick={() => navigate('cart')}
                className="relative p-2 text-gray-700 hover:text-primary-600 transition"
                title="Cart"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
              {user && (
                <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg">
                  <User className="w-5 h-5 text-gray-700" />
                  <span className="text-sm font-medium text-gray-700 hidden lg:inline">
                    {profile?.full_name || 'User'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar - Primary Colored */}
      <nav className="bg-primary-600 text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Left - All Categories & Navigation */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  onClick={() => {
                    setBrowseOpen(!browseOpen);
                    setMobileMenuOpen(!mobileMenuOpen);
                  }}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-primary-700 transition rounded-lg"
                  aria-label="Browse product categories"
                  aria-expanded={browseOpen}
                >
                  <List className="w-5 h-5" />
                  <span className="font-semibold hidden sm:inline">Browse</span>
                  <ChevronDown className={`hidden sm:block w-4 h-4 transition ${browseOpen ? 'rotate-180' : ''}`} />
                </button>
                {browseOpen && (
                  <div className="absolute left-0 top-full z-50 mt-2 hidden w-64 overflow-hidden rounded-xl bg-white py-2 text-sm text-gray-700 shadow-xl ring-1 ring-black/5 lg:block">
                    <button onClick={() => navigate('products')} className="flex w-full items-center justify-between px-4 py-3 text-left font-semibold hover:bg-primary-50 hover:text-primary-600">
                      All products <span className="text-gray-300">&#8594;</span>
                    </button>
                    <div className="my-1 border-t border-gray-100" />
                    {categories.length > 0 ? categories.map((category) => (
                      <button key={category.id} onClick={() => navigateToCategory(category.id)} className="flex w-full items-center justify-between px-4 py-2.5 text-left hover:bg-primary-50 hover:text-primary-600">
                        <span className="truncate">{category.name}</span>
                        <span className="text-gray-300">&#8594;</span>
                      </button>
                    )) : (
                      <p className="px-4 py-3 text-xs text-gray-500">Categories loading...</p>
                    )}
                  </div>
                )}
              </div>
              
              <div className="hidden lg:flex items-center gap-1">
                <button
                  onClick={() => navigate('home')}
                  className={`px-4 py-2 hover:bg-primary-700 transition rounded-lg ${
                    currentPage === 'home' ? 'bg-primary-700' : ''
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => navigate('products')}
                  className={`px-4 py-2 hover:bg-primary-700 transition rounded-lg ${
                    currentPage === 'products' ? 'bg-primary-700' : ''
                  }`}
                >
                  Shop
                </button>
                <button
                  onClick={() => setPagesOpen(!pagesOpen)}
                  className="px-4 py-2 hover:bg-primary-700 transition rounded-lg flex items-center gap-1"
                >
                  <span>Pages</span>
                  <ChevronDown className={`w-4 h-4 transition ${pagesOpen ? 'rotate-180' : ''}`} />
                </button>
                {pagesOpen && (
                  <div className="absolute mt-40 ml-28 w-40 rounded-xl bg-white py-2 text-sm text-gray-700 shadow-xl ring-1 ring-black/5">
                    <button onClick={() => navigate('about')} className="block w-full px-4 py-2 text-left hover:bg-gray-50">About us</button>
                  </div>
                )}
                <button
                  onClick={() => navigate('contact')}
                  className={`px-4 py-2 hover:bg-primary-700 transition rounded-lg ${
                    currentPage === 'contact' ? 'bg-primary-700' : ''
                  }`}
                >
                  Contact
                </button>
              </div>
            </div>

            {/* Right - Phone Button */}
            <a
              href="tel:+250784586110"
              className="hidden sm:flex items-center gap-2 bg-[#c84b3f] hover:bg-[#ad3d33] px-4 py-2 rounded-lg transition"
            >
              <Phone className="w-4 h-4" />
              <span className="font-medium">+250 784 586 110</span>
            </a>
          </div>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-black/30 lg:hidden" onClick={() => setMobileMenuOpen(false)}>
          <aside className="h-full w-80 max-w-[85vw] bg-white p-5 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <span className="text-lg font-black tracking-tight text-primary-600">AKAZUBA</span>
              <button onClick={() => setMobileMenuOpen(false)} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100" aria-label="Close navigation menu">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-5 space-y-1">
              {[
                ['home', 'Home'],
                ['products', 'Shop all products'],
                ['about', 'About us'],
                ['contact', 'Contact'],
                ['wishlist', 'Wishlist'],
                ['cart', 'My cart'],
              ].map(([page, label]) => (
                <button key={page} onClick={() => navigate(page)} className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-gray-700 hover:bg-primary-50 hover:text-primary-600">
                  {label}
                  <span className="text-gray-300">&#8594;</span>
                </button>
              ))}
              <div className="mt-4 border-t border-gray-100 pt-4">
                <p className="px-3 pb-2 text-xs font-bold uppercase tracking-wider text-gray-400">Shop by category</p>
                {categories.map((category) => (
                  <button key={category.id} onClick={() => navigateToCategory(category.id)} className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-gray-700 hover:bg-primary-50 hover:text-primary-600">
                    {category.name}
                    <span className="text-gray-300">&#8594;</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
