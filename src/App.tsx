import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import WishlistPage from './pages/WishlistPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AdminPage from './pages/AdminPage';
import { supabase } from './lib/supabase';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>();
  const [cartItemCount, setCartItemCount] = useState(0);
  const { user, profile, loading } = useAuth();

  useEffect(() => {
    if (user) {
      loadCartCount();

      const channel = supabase
        .channel('cart-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'cart_items',
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            loadCartCount();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  // Auto-redirect admin users to admin page
  useEffect(() => {
    if (profile?.is_admin && currentPage !== 'admin') {
      setCurrentPage('admin');
    }
  }, [profile, currentPage]);

  const loadCartCount = async () => {
    if (!user) {
      setCartItemCount(0);
      return;
    }

    const { data, error } = await supabase
      .from('cart_items')
      .select('quantity')
      .eq('user_id', user.id);

    if (data && !error) {
      const total = data.reduce((sum, item) => sum + item.quantity, 0);
      setCartItemCount(total);
    }
  };

  const handleNavigate = (page: string, categoryId?: string) => {
    setCurrentPage(page);
    if (categoryId) {
      setSelectedCategoryId(categoryId);
    } else {
      setSelectedCategoryId(undefined);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex items-center justify-center">
        {/* Updated green theme - deployment test */}
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (currentPage === 'login') {
    return (
      <LoginPage
        onSwitchToSignup={() => setCurrentPage('signup')}
        onClose={() => setCurrentPage('home')}
        onNavigate={handleNavigate}
      />
    );
  }

  if (currentPage === 'signup') {
    return (
      <SignupPage
        onSwitchToLogin={() => setCurrentPage('login')}
        onClose={() => setCurrentPage('home')}
      />
    );
  }

  // Pages that should not show the footer
  const pagesWithoutFooter = ['login', 'signup', 'admin'];
  const showFooter = !pagesWithoutFooter.includes(currentPage);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar onNavigate={handleNavigate} currentPage={currentPage} cartItemCount={cartItemCount} />

      <main className="flex-1">
        {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
        {currentPage === 'products' && (
          <ProductsPage onNavigate={handleNavigate} selectedCategoryId={selectedCategoryId} />
        )}
        {currentPage === 'about' && <AboutPage />}
        {currentPage === 'contact' && <ContactPage />}
        {currentPage === 'cart' && <CartPage onNavigate={handleNavigate} />}
        {currentPage === 'checkout' && <CheckoutPage onNavigate={handleNavigate} />}
        {currentPage === 'wishlist' && <WishlistPage onNavigate={handleNavigate} />}
        {currentPage === 'admin' && <AdminPage onNavigate={handleNavigate} />}
      </main>

      {showFooter && <Footer onNavigate={handleNavigate} />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
