import { ShoppingCart, User, LogOut, Home, Info, Package, Phone, Heart, MessageCircle, Instagram, Search, Menu, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type NavbarProps = {
  onNavigate: (page: string, categoryId?: string) => void;
  currentPage: string;
  cartItemCount: number;
  wishlistItemCount: number;
};

export default function Navbar({ onNavigate, currentPage, cartItemCount, wishlistItemCount }: NavbarProps) {
  const { user, profile, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      onNavigate('home');
    } catch (error) {
      console.warn('Sign out error (non-critical):', error);
      onNavigate('home');
    }
  };

  return (
    <>
      {/* Top Header Bar - Gray Background */}
      <div className="bg-gray-100 border-b border-gray-200 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-10">
            {/* Left Side - Help/Support/Contact */}
            <div className="hidden md:flex items-center space-x-4 text-gray-600">
              <button onClick={() => onNavigate('contact')} className="hover:text-primary-600 transition">
                Help / Support / Contact
              </button>
            </div>

            {/* Center - Call Us */}
            <div className="flex-1 text-center">
              <span className="text-gray-600">Call Us: <a href="tel:+250784586110" className="text-primary-600 hover:underline">+250 784 586 110</a></span>
            </div>

            {/* Right Side - User Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <>
                  <button
                    onClick={() => onNavigate('home')}
                    className="text-gray-600 hover:text-primary-600 transition flex items-center space-x-1"
                  >
                    <Home className="w-4 h-4" />
                    <span>My Dashboard</span>
                  </button>
                  <button
                    onClick={() => onNavigate('wishlist')}
                    className="text-gray-600 hover:text-primary-600 transition"
                  >
                    Wishlist
                  </button>
                  <button
                    onClick={() => onNavigate('cart')}
                    className="text-gray-600 hover:text-primary-600 transition"
                  >
                    My Cart
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="text-gray-600 hover:text-primary-600 transition"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => onNavigate('login')}
                    className="text-gray-600 hover:text-primary-600 transition"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => onNavigate('wishlist')}
                    className="text-gray-600 hover:text-primary-600 transition"
                  >
                    Wishlist
                  </button>
                  <button
                    onClick={() => onNavigate('cart')}
                    className="text-gray-600 hover:text-primary-600 transition"
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
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center space-x-2"
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
              <span className="text-2xl font-bold text-primary-600">AKAZUBA</span>
            </button>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <div className="flex w-full">
                <select className="px-4 py-2 border border-gray-300 rounded-l-lg bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option>All Category</option>
                </select>
                <input
                  type="text"
                  placeholder="Search Looking For?"
                  className="flex-1 px-4 py-2 border-t border-b border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button className="px-6 py-2 bg-primary-600 text-white rounded-r-lg hover:bg-primary-700 transition">
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
                onClick={() => onNavigate('cart')}
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
            <div className="flex items-center space-x-6">
              <button className="flex items-center space-x-2 px-4 py-2 hover:bg-primary-700 transition rounded">
                <Menu className="w-5 h-5" />
                <span className="font-medium">All Categories</span>
              </button>
              
              <div className="hidden lg:flex items-center space-x-1">
                <button
                  onClick={() => onNavigate('home')}
                  className={`px-4 py-2 hover:bg-primary-700 transition rounded ${
                    currentPage === 'home' ? 'bg-primary-700' : ''
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => onNavigate('products')}
                  className={`px-4 py-2 hover:bg-primary-700 transition rounded ${
                    currentPage === 'products' ? 'bg-primary-700' : ''
                  }`}
                >
                  Shop
                </button>
                <button
                  onClick={() => onNavigate('about')}
                  className="px-4 py-2 hover:bg-primary-700 transition rounded flex items-center space-x-1"
                >
                  <span>Pages</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigate('contact')}
                  className={`px-4 py-2 hover:bg-primary-700 transition rounded ${
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
              className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition"
            >
              <Phone className="w-4 h-4" />
              <span className="font-medium">+250 784 586 110</span>
            </a>
          </div>
        </div>
      </nav>
    </>
  );
}
