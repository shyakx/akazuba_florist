import { ShoppingCart, User, LogOut, Home, Info, Package, Phone, Heart, MessageCircle, Instagram } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type NavbarProps = {
  onNavigate: (page: string) => void;
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
      // Still navigate to home even if signOut fails
      onNavigate('home');
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center space-x-2 text-2xl font-bold text-primary-600 hover:text-primary-700 transition"
            >
              <img 
                src="/images/logo/akazuba-logo.png" 
                alt="AKAZUBA FLORIST" 
                className="h-8 w-auto"
                onError={(e) => {
                  // Try fallback logo first
                  const target = e.currentTarget as HTMLImageElement;
                  if (target.src.includes('akazuba-logo.png')) {
                    target.src = '/images/logo/akazuba-logo-icon.png';
                  } else {
                    // If both logos fail, show text
                    target.style.display = 'none';
                    const nextElement = target.nextElementSibling as HTMLElement;
                    if (nextElement) {
                      nextElement.style.display = 'inline';
                    }
                  }
                }}
              />
              <span style={{ display: 'none' }}>AKAZUBA FLORIST</span>
            </button>

            <div className="hidden md:flex space-x-4">
              <button
                onClick={() => onNavigate('home')}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition ${
                  currentPage === 'home'
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </button>

              <button
                onClick={() => onNavigate('products')}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition ${
                  currentPage === 'products'
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Products</span>
              </button>

              <button
                onClick={() => onNavigate('about')}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition ${
                  currentPage === 'about'
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Info className="w-4 h-4" />
                <span>About</span>
              </button>

              <button
                onClick={() => onNavigate('contact')}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition ${
                  currentPage === 'contact'
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Phone className="w-4 h-4" />
                <span>Contact</span>
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Social Media Links */}
            <div className="hidden md:flex items-center space-x-2">
              <a
                href="https://wa.me/250784586110"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                title="WhatsApp: +250 784 586 110"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/akazuba_florists?igsh=aXdsY203Y3Eza2x4"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-pink-600 hover:bg-pink-50 rounded-lg transition"
                title="Instagram: @akazuba_florists"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>

            {user && (
              <>
                <button
                  onClick={() => onNavigate('wishlist')}
                  className="relative p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                  title="Wishlist"
                >
                  <Heart className="w-6 h-6" />
                  {wishlistItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {wishlistItemCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => onNavigate('cart')}
                  className="relative p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                >
                  <ShoppingCart className="w-6 h-6" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </button>
              </>
            )}

            {user ? (
              <div className="flex items-center space-x-3">
                {profile?.is_admin && (
                  <button
                    onClick={() => onNavigate('admin')}
                    className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition text-sm font-medium"
                  >
                    Admin
                  </button>
                )}
                <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg">
                  <User className="w-5 h-5 text-gray-700" />
                  <span className="text-sm font-medium text-gray-700">
                    {profile?.full_name || 'User'}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={() => onNavigate('login')}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition font-medium"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onNavigate('signup')}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
